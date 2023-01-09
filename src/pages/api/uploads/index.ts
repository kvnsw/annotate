import Joi from 'joi';
import { ObjectId } from 'mongodb';
import { NextApiResponse } from 'next';
import nc from 'next-connect';

import { getS3Client } from '../../../utils/clients';
import dbConnect from '../../../utils/dbConnect';
import auth from '../../../utils/middlewares/auth';
import { onError, onNoMatch } from '../../../utils/middlewares/errors';
import validate from '../../../utils/middlewares/validate';

const handler = nc<Annotate.Request, NextApiResponse>({ onError, onNoMatch })
  .use(async (req, res, next) => {
    await dbConnect();
    next();
  })
  .post(
    validate({
      body: Joi.object({
        key: Joi.string().required(),
      }).unknown(false),
    }),
    auth,
    async (req, res) => {
      const signedUrl = await new Promise((resolve, reject) => {
        getS3Client().getSignedUrl('putObject', {
          Bucket: process.env.NEXT_PUBLIC_AWS_S3_BUCKET,
          Key: `audio/${new ObjectId()}${req.body.key}`,
          Expires: 60 * 60,
        }, (err, url) => {
          if (err) reject(err);
          else resolve(url);
        });
      });

      res.status(200).json(signedUrl);
    },
  );

export default handler;
