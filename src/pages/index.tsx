import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import HomeLayout from '../components/layouts/Home';

function Home() {
  return <HomeLayout />;
}

export const getStaticProps = async ({ locale }: { locale: 'en' }) => ({
  props: {
    ...await serverSideTranslations(locale, ['common', 'pages']),
  },
});

export default Home;
