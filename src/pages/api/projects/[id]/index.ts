import Joi from 'joi-oid';
import { NextApiResponse } from 'next';
import nc from 'next-connect';

import { ObjectId } from 'mongodb';
import dbConnect from '../../../../utils/dbConnect';
import auth from '../../../../utils/middlewares/auth';
import { onError, onNoMatch } from '../../../../utils/middlewares/errors';
import validate from '../../../../utils/middlewares/validate';

import ProjectModel from '../../../../models/Project.model';

import { ProjectDocument, projectPopulatePipeline } from '../';

async function getPopulatedProject(
  projectId: ObjectId,
): Promise<ProjectDocument.Populated | undefined> {
  const agg = await ProjectModel.collection.aggregate<ProjectDocument.Populated>([
    { $match: { _id: projectId } },
    ...projectPopulatePipeline,
  ]).toArray();

  return agg[0];
}

const handler = nc<Annotate.Request, NextApiResponse>({ onError, onNoMatch })
  .use(async (req, res, next) => {
    await dbConnect();
    next();
  })
  .get(
    validate({
      query: Joi.object({
        id: Joi.objectId().required(),
      }).unknown(false),
    }),
    auth,
    async (req, res) => {
      const project = await getPopulatedProject(new ObjectId(req.query.id as string));

      if (!project) {
        return res.status(404).end('Document not found');
      }

      return res.status(200).json(project);
    },
  )
  .put(
    validate({
      query: Joi.object({
        id: Joi.objectId().required(),
      }).unknown(false),
      body: Joi.object({
        title: Joi.string(),
        provider: Joi.string().allow(''),
        dueDate: Joi.date().allow(''),
        status: Joi.string().valid('draft', 'ongoing', 'review', 'completed'),
      }).unknown(false),
    }),
    auth,
    async (req, res) => {
      const project = await ProjectModel.findById(req.query.id);

      if (!project) {
        return res.status(404).end('Document not found');
      }

      // Operators can only pass status from ongoing to review
      // Admins could potentially pass to any status although
      // we will not make it possible on the front-end
      if (
        req.body.status
        && req.accountType === 'operator'
        && (
          project.status !== 'ongoing'
          || req.body.status !== 'review'
        )
      ) {
        return res.status(400).end('Operator cannot set this status');
      }

      Object.assign(project, {
        ...req.body,
        ...(req.body.status === 'completed' ? {
          completedDate: new Date(),
        } : {}),
      });

      await project.save();

      return res.status(200).json(await getPopulatedProject(project._id));
    },
  );

export default handler;
