import { NextApiResponse } from 'next';
import { NextHandler } from 'next-connect';

const auth = (req: Annotate.Request, res: NextApiResponse, next: NextHandler) => {
  const accountType = req.headers['x-auth'] as string | undefined;

  if (!accountType || !['admin', 'operator'].includes(accountType)) {
    return res.status(401).end();
  }

  req.accountType = accountType as Annotate.Request['accountType'];
  return next();
};

export default auth;
