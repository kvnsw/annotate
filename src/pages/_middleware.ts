import { NextRequest, NextResponse } from 'next/server';

// Make app private through basic auth
export function middleware(req: NextRequest) {
  const isApiReq = new URL(req.url).pathname.startsWith('/api');

  // API auth is handled by "user" auth middleware
  if (isApiReq || (!process.env.AUTH_USER && !process.env.AUTH_PWD)) {
    return NextResponse.next();
  }

  const user: { name?: string, pass?: string } = {};
  const basicAuth = req.headers.get('authorization');

  // https://github.com/jshttp/basic-auth/blob/master/index.js
  if (basicAuth) {
    const match = /^ *(?:[Bb][Aa][Ss][Ii][Cc]) +([A-Za-z0-9._~+/-]+=*) *$/.exec(basicAuth);

    if (match) {
      const credentials = /^([^:]*):(.*)$/.exec(Buffer.from(match[1], 'base64').toString());

      if (credentials) {
        [, user.name, user.pass] = credentials;
      }
    }
  }

  if (user?.name === process.env.AUTH_USER && user?.pass === process.env.AUTH_PWD) {
    return NextResponse.next();
  }

  return new Response('Auth required', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="annotate-realm"',
    },
  });
}
