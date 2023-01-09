import 'dayjs/locale/en';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { appWithTranslation, useTranslation } from 'next-i18next';
import { AppProps } from 'next/app';
import { Provider as ReduxProvider } from 'react-redux';
import Script from 'next/script';
import { useEffect } from 'react';
import { setLocale } from 'yup';

import store from '../store';

import Layout from '../components/Layout';

dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);

function App({ Component, pageProps }: AppProps) {
  const { t } = useTranslation('common');

  useEffect(() => {
    setLocale({
      mixed: {
        default: t('common:form.errors.invalid'),
        required: t('common:form.errors.required'),
      },
      number: {
        min: ({ min }) => t('common:form.errors.min', { val: min }),
        max: ({ max }) => t('common:form.errors.max', { val: max }),
        moreThan: ({ more }) => t('common:form.errors.moreThan', { val: more }),
      },
    });
  }, [t]);

  return (
    <>
      <Script
        src="https://polyfill.io/v3/polyfill.min.js?features=Intl%2CglobalThis%2CObject.fromEntries%2CResizeObserver%2CqueueMicrotask%2CPromise.allSettled"
        strategy="beforeInteractive"
      />
      <ReduxProvider store={store}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ReduxProvider>
    </>
  );
}

export default appWithTranslation(App);
