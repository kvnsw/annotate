import Joi from 'joi-oid';
import { NextApiResponse } from 'next';
import nc from 'next-connect';

import dbConnect from '../../../utils/dbConnect';
import auth from '../../../utils/middlewares/auth';
import { onError, onNoMatch } from '../../../utils/middlewares/errors';
import validate from '../../../utils/middlewares/validate';

import ProjectModel, { IProject } from '../../../models/Project.model';

export namespace ProjectDocument {
  export type Base = Pick<IProject, 'title' | 'provider' | 'status'> & {
    _id: string, // ObjectId
    dueDate?: string, // ISO String date
    completedDate?: string, // ISO String date
    createdAt: string, // ISO String date
    updatedAt: string, // ISO String date
  }

  export interface Populated extends Base {
    nbSamples: number;
    skippedSamples: number;
    reviewedSamples: number;
    rejectedSamples: number;
    annotatedSamples: number;
  }

  export type Editable = Pick<IProject, | 'provider'> & {
    title?: string, // Not mandatory in edit
    status?: IProject['status'], // Not mandatory in edit
    dueDate?: string, // ISO String date
  }
}

export const projectPopulatePipeline = [
  {
    $lookup: {
      from: 'audio_samples',
      localField: '_id',
      foreignField: 'projectId',
      as: 'audioSamples',
      pipeline: [
        {
          $group: {
            _id: '$status',
            statusCount: { $sum: 1 },
            skippedCount: { $sum: { $cond: ['$skipped', 1, 0] } },
          },
        },
        {
          $group: {
            _id: null,
            nbSamples: { $sum: '$statusCount' },
            skippedSamples: { $sum: '$skippedCount' },
            statusCounts: {
              $push: {
                k: '$_id',
                v: '$statusCount',
              },
            },
          },
        },
        {
          $project: {
            nbSamples: 1,
            skippedSamples: 1,
            statusCounts: { $arrayToObject: '$statusCounts' },
          },
        },
      ],
    },
  },
  { $unwind: { path: '$audioSamples', preserveNullAndEmptyArrays: true } },
  {
    $addFields: {
      nbSamples: { $ifNull: ['$audioSamples.nbSamples', 0] },
      skippedSamples: { $ifNull: ['$audioSamples.skippedSamples', 0] },
      reviewedSamples: { $ifNull: ['$audioSamples.statusCounts.accepted', 0] },
      rejectedSamples: { $ifNull: ['$audioSamples.statusCounts.rejected', 0] },
      reviewingSamples: { $ifNull: ['$audioSamples.statusCounts.review', 0] },
    },
  },
  {
    $addFields: {
      annotatedSamples: { $add: ['$reviewingSamples', '$reviewedSamples'] },
    },
  },
  { $unset: ['audioSamples', 'reviewingSamples'] },
];

const handler = nc<Annotate.Request, NextApiResponse>({ onError, onNoMatch })
  .use(async (req, res, next) => {
    await dbConnect();
    next();
  })
  .get(
    validate({
      query: Joi.object({
        page: Joi.number(),
      }).unknown(false),
    }),
    auth,
    async (req, res) => {
      const count = await ProjectModel.countDocuments({
        ...(req.accountType !== 'admin' ? { status: { $ne: 'draft' } } : {}),
      });

      const projects = await ProjectModel.collection.aggregate([
        ...(req.accountType !== 'admin' ? [{
          // $ne: 'draft' seems more logical but doesn't use
          // index because it is less selective than $in
          // It does not happen with above countDocuments because we do not sort
          // See: https://docs.mongodb.com/manual/tutorial/create-queries-that-ensure-selectivity/
          // Also, we could use $hint but not available with out current db
          $match: { status: { $in: ['ongoing', 'review', 'completed'] } },
        }] : []),
        { $sort: { updatedAt: -1 } },
        { $skip: (req.query.page ? parseInt(req.query.page as string, 10) : 0) * 12 },
        { $limit: 12 },
        ...projectPopulatePipeline,
      ]).toArray();

      res.status(200).json({ count, data: projects });
    },
  )
  .post(
    validate({
      body: Joi.object({
        title: Joi.string(),
        provider: Joi.string().allow(''),
        dueDate: Joi.date().allow(''),
        status: Joi.string().valid('draft'),
      }).unknown(false),
    }),
    auth,
    async (req, res) => {
      if (req.accountType !== 'admin') {
        return res.status(405).json('Invalid permissions');
      }

      const project = await ProjectModel.create(req.body);

      return res.status(200).json(project);
    },
  );

export default handler;
