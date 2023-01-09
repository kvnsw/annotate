import Joi from 'joi-oid';
import { ObjectId } from 'mongodb';
import { NextApiResponse } from 'next';
import nc from 'next-connect';
import path from 'path';
import _compact from 'lodash/compact';

import dbConnect from '../../../utils/dbConnect';
import auth from '../../../utils/middlewares/auth';
import { onError, onNoMatch } from '../../../utils/middlewares/errors';
import validate from '../../../utils/middlewares/validate';

import AudioSampleModel from '../../../models/AudioSample.model';
import ProjectModel from '../../../models/Project.model';

const handler = nc<Annotate.Request, NextApiResponse>({ onError, onNoMatch })
  .use(async (req, res, next) => {
    await dbConnect();
    next();
  })
  .post(
    validate({
      body: Joi.object({
        filePaths: Joi.array().items(Joi.string()).min(1).max(500)
          .required(),
        projectId: Joi.objectId().required(),
      }).unknown(false),
    }),
    auth,
    async (req, res) => {
      const project = await ProjectModel
        .findById(new ObjectId(req.body.projectId), { status: 1 });

      if (!project || project.status !== 'draft') {
        return res.status(404).end('Document not found');
      }

      const bulk = AudioSampleModel.collection.initializeUnorderedBulkOp();

      req.body.filePaths.forEach((filePath: string) => {
        bulk.insert({
          _id: new ObjectId(_compact(filePath.split('/'))[1]), // ['audio', ObjectId', fileName]
          title: decodeURIComponent(path.parse(filePath).name),
          projectId: new ObjectId(req.body.projectId),
          sampleUrl: filePath,
          status: 'ongoing',
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      });

      await bulk.execute();

      await ProjectModel.updateOne({ _id: new ObjectId(req.body.projectId) }, {
        $set: { updatedAt: new Date() },
      });

      return res.status(200).json({ message: 'success' });
    },
  );

export default handler;
