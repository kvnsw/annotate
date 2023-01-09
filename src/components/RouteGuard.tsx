import { useRouter } from 'next/router';
import { ReactElement, useEffect } from 'react';

import { useAppSelector } from '../store/hooks';

function RouteGuard({ children }: { children: ReactElement }) {
  const router = useRouter();
  const isPublic = ['/', '/404'].includes(router.route);
  const { isLogged } = useAppSelector(state => state.user);

  useEffect(() => {
    if (!isPublic && !isLogged) {
      router.push('/');
    }

    if (isPublic && isLogged) {
      router.push('/projects');
    }
  });

  if ((!isPublic && !isLogged) || (isPublic && isLogged)) {
    return null;
  }

  return children;
}

export default RouteGuard;
