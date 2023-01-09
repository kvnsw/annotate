import { NextApiRequest, NextApiResponse } from 'next';

export const onError = (
  err: any,
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  // eslint-disable-next-line no-console
  console.log(err);
  res.status(500).end('Internal server error');
};

export const onNoMatch = (
  req: NextApiRequest,
  res: NextApiResponse,
) => res.status(404).end('Api not found');
