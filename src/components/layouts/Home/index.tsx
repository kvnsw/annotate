import { useTranslation } from 'next-i18next';

import { useAppDispatch } from '../../../store/hooks';
import { logIn } from '../../../store/slices/userSlice';
import { AdminWrapper, OperatorWrapper, Wrapper } from './styles';

function HomeLayout() {
  const { t } = useTranslation(['common', 'pages']);
  const dispatch = useAppDispatch();

  return (
    <Wrapper>
      <AdminWrapper onClick={() => dispatch(logIn({ accountType: 'admin' }))}>
        <div>{t('common:admin')}</div>
        <span>{t('pages:home.logInAs')}</span>
      </AdminWrapper>
      <OperatorWrapper onClick={() => dispatch(logIn({ accountType: 'operator' }))}>
        <div>{t('common:operator')}</div>
        <span>{t('pages:home.logInAs')}</span>
      </OperatorWrapper>
    </Wrapper>
  );
}

export default HomeLayout;
