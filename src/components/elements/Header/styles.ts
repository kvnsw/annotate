import { BoxArrowLeft } from 'react-bootstrap-icons';
import styled, { css } from 'styled-components';

import { headerHeight } from '../../../theme/variables';

import Logo from '../../icons/Logo';

export const Wrapper = styled.div<{ isHome: boolean }>`
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: ${headerHeight};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 30px;
  z-index: 1;

  ${({ isHome }) => !isHome && css`
    background-color: ${({ theme }) => theme.colors.white};
    box-shadow:  rgba(0, 0, 0, 0.05) 0px 8px 24px
  `};
`;

export const StyledLogo = styled(Logo).attrs({
  height: 25,
  width: 125,
})``;

export const RightSection = styled.div`
  display: flex;
  align-items: center;
`;

export const UserChip = styled.div`
  padding: 10px 15px;
  background-color: ${({ theme }) => theme.colors.black};
  color: ${({ theme }) => theme.colors.white};
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
`;

export const StyledLogoutIcon = styled(BoxArrowLeft).attrs({
  height: 22,
  width: 22,
})`
  cursor: pointer;
  margin-left: 10px;
  transition: fill 200ms ease;

  &:hover {
    fill: ${({ theme }) => theme.colors.rust};
  }
`;
