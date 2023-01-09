/* eslint-disable no-unused-vars */
declare module 'joi-oid';

declare module Annotate {
  type Request = import('next').NextApiRequest & {
    accountType?: 'admin' | 'operator';
  }
}
