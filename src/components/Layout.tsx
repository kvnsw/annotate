import 'bootstrap/dist/css/bootstrap.css';

import { useRouter } from 'next/router';
import React, { Fragment, ReactElement } from 'react';
import SSRProvider from 'react-bootstrap/SSRProvider';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from 'styled-components';

import RouteGuard from './RouteGuard';

import Header from './elements/Header';

import theme from '../theme';
import { GlobalStyle, PageWrapper } from '../theme/global.styles';

function Layout({ children }: { children: ReactElement }) {
  const { route } = useRouter();

  const disableWrapper = ['/', '/404'].includes(route);

  const ChildrenWrapper = disableWrapper ? Fragment : PageWrapper;

  return (
    <SSRProvider>
      <ThemeProvider theme={theme}>
        <>
          <GlobalStyle />
          <RouteGuard>
            <>
              <Header />
              <ChildrenWrapper>
                {children}
              </ChildrenWrapper>
              <Toaster position="bottom-center" />
            </>
          </RouteGuard>
        </>
      </ThemeProvider>
    </SSRProvider>
  );
}

export default Layout;
