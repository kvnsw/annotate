import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import NotFoundLayout from '../components/layouts/NotFound';

function NotFound() {
  return <NotFoundLayout />;
}

export const getStaticProps = async ({ locale }: { locale: 'en' }) => ({
  props: {
    ...await serverSideTranslations(locale, ['pages']),
  },
});

export default NotFound;
