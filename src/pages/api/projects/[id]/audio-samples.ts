import Joi from 'joi-oid';
import { NextApiResponse } from 'next';
import nc from 'next-connect';

import dbConnect from '../../../../utils/dbConnect';
import auth from '../../../../utils/middlewares/auth';
import { onError, onNoMatch } from '../../../../utils/middlewares/errors';
import validate from '../../../../utils/middlewares/validate';

import AudioSampleModel from '../../../../models/AudioSample.model';

const handler = nc<Annotate.Request, NextApiResponse>({ onError, onNoMatch })
  .use(async (req, res, next) => {
    await dbConnect();
    next();
  })
  .get(
    validate({
      query: Joi.object({
        // This is project id
        id: Joi.objectId().required(),
        page: Joi.number(),
      }).unknown(false),
    }),
    auth,
    async (req, res) => {
      const count = await AudioSampleModel.countDocuments({ projectId: req.query.id });

      const audioSamples = await AudioSampleModel
        .find({ projectId: req.query.id })
        .sort({ createdAt: -1 })
        .skip((req.query.page ? parseInt(req.query.page as string, 10) : 0) * 20)
        .limit(20);

      return res.status(200).json({ count, data: audioSamples });
    },
  );

export default handler;
