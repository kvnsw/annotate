import { useTranslation } from 'next-i18next';

import { Description, Title, Wrapper } from './styles';

function NotFoundLayout() {
  const { t } = useTranslation(['pages']);

  return (
    <Wrapper>
      <Title>{t('pages:notFound.title')}</Title>
      <Description>{t('pages:notFound.desc')}</Description>
    </Wrapper>
  );
}

export default NotFoundLayout;
