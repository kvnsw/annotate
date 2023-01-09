import Joi from 'joi-oid';
import { NextApiResponse } from 'next';
import nc from 'next-connect';
import { ObjectId } from 'mongodb';

import dbConnect from '../../../utils/dbConnect';
import auth from '../../../utils/middlewares/auth';
import { onError, onNoMatch } from '../../../utils/middlewares/errors';
import validate from '../../../utils/middlewares/validate';

import AudioSampleModel, { IAudioSample } from '../../../models/AudioSample.model';
import ProjectModel from '../../../models/Project.model';

const handler = nc<
  Annotate.Request & { document?: IAudioSample },
  NextApiResponse
>({ onError, onNoMatch })
  .use(async (req, res, next) => {
    await dbConnect();
    next();
  })
  .put(
    // Validate a first time to prevent using auth middleware
    // if request is invalid
    validate({
      query: Joi.object({
        id: Joi.objectId().required(),
      }).unknown(false),
      body: Joi.object({
        annotations: Joi.object({
          wake: Joi.object({
            start: Joi.number().required(),
            end: Joi.number().required(),
          }).unknown(false).required(),
          utterance: Joi.object({
            transcript: Joi.string().required(),
            start: Joi.number().required(),
            end: Joi.number().required(),
          }).unknown(false).required(),
        }).unknown(false),
        skipped: Joi.boolean(),
        status: Joi.string().valid('review', 'accepted', 'rejected').required(),
      }).unknown(false),
    }),
    auth,
    async (req, res, next) => {
      const audioSample = await AudioSampleModel.findById(
        new ObjectId(req.query.id as string),
      );

      if (!audioSample) {
        return res.status(404).end('Document not found');
      }

      req.document = audioSample;

      // Validator changes depending on status
      switch (true) {
        case req.accountType === 'operator'
          && ['ongoing', 'rejected'].includes(req.document!.status):
          return validate({
            query: Joi.object({
              id: Joi.objectId().required(),
            }).unknown(false),
            body: Joi.object({
              annotations: Joi.object({
                wake: Joi.object({
                  start: Joi.number().required(),
                  end: Joi.number().required(),
                }).unknown(false).required(),
                utterance: Joi.object({
                  transcript: Joi.string().required(),
                  start: Joi.number().required(),
                  end: Joi.number().required(),
                }).unknown(false).required(),
              }).unknown(false),
              skipped: Joi.boolean(),
              status: Joi.string().valid('review').required(),
            }).unknown(false).xor('annotations', 'skipped'),
          })(req, res, next);

        case req.accountType === 'admin' && req.document!.status === 'review':
          return validate({
            query: Joi.object({
              id: Joi.objectId().required(),
            }).unknown(false),
            body: Joi.object({
              status: Joi.string().valid('accepted', 'rejected').required(),
            }).unknown(false),
          })(req, res, next);

        default:
          return res.status(400).end('Bad request');
      }
    },
    async (req, res) => {
      Object.assign(req.document!, {
        ...req.body,
        ...(req.body.status === 'review' ? {
          submittedAt: new Date(),
        } : {}),
        ...(['accepted', 'rejected'].includes(req.body.status) ? {
          reviewedAt: new Date(),
        } : {}),
      });

      await req.document!.save();

      await ProjectModel.updateOne({ _id: req.document!.projectId }, {
        $set: { updatedAt: new Date() },
      });

      return res.status(200).json(req.document!);
    },
  );

export default handler;
