import { useTranslation } from 'next-i18next';

import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { logOut } from '../../../store/slices/userSlice';

import LinkWithAnchor from '../LinkWithAnchor';

import { RightSection, StyledLogo, StyledLogoutIcon, UserChip, Wrapper } from './styles';

function Header() {
  const { t } = useTranslation('common');
  const { isLogged, data } = useAppSelector(state => state.user);
  const dispatch = useAppDispatch();

  return (
    <Wrapper isHome={!isLogged}>
      <LinkWithAnchor href={!isLogged ? '/' : '/projects'} passHref>
        <StyledLogo />
      </LinkWithAnchor>
      {isLogged && (
        <RightSection>
          <UserChip>
            {t(data!.accountType)}
          </UserChip>
          <StyledLogoutIcon onClick={() => dispatch(logOut())} />
        </RightSection>
      )}
    </Wrapper>
  );
}

export default Header;
