import { darken } from 'polished';
import { Button } from 'react-bootstrap';
import { PencilSquare } from 'react-bootstrap-icons';
import styled, { css } from 'styled-components';

import { headerHeight, layoutTopBottomPadding } from '../../../theme/variables';

export const ProjectWrapper = styled.div`
  width: 20%;
  position: fixed;
  background-color: ${({ theme }) => theme.colors.white};
  left: 0;
  top: ${headerHeight};
  height: calc(100vh - ${headerHeight});
  padding: ${layoutTopBottomPadding};
`;

export const ProjectActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-bottom: ${layoutTopBottomPadding};
  cursor: pointer;
  height: 25px;
`;

export const EditIcon = styled(PencilSquare).attrs(({ theme }) => ({
  width: 18,
  height: 18,
  fill: theme.colors.black,
}))`
  transition: 200ms ease fill;

  &:hover {
    fill: ${({ theme }) => darken(0.1, theme.colors.black)};
  }
`;

export const ProjectInformations = styled.div<{ withActions: boolean }>`
  height: 100%;

  ${({ withActions }) => withActions && css`
    height: calc(100% - 65px);
  `};
`;

export const StatusButton = styled(Button)`
  font-size: 12px !important;
  margin-left: 20px !important;
`;

export const AudioSamplesWrapper = styled.div<{ fullSize?: boolean }>`
  padding: 0 25% ${layoutTopBottomPadding} 20%;

  ${({ fullSize }) => fullSize && css`
    padding: 0 0 ${layoutTopBottomPadding} 20%;
  `};
`;

export const AudioSamplesHeadSection = styled.div<{ fullSize?: boolean }>`
  position: fixed;
  background-color: ${({ theme }) => theme.colors.grey};
  width: 55%;
  padding: ${layoutTopBottomPadding} ${layoutTopBottomPadding} 0;
  height: 155px;

  ${({ fullSize }) => fullSize && css`
    width: 80%;
  `};
`;

export const AudioSamplesInnerHeadSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 35px;
`;

export const AudioSamplesHeadColumn = styled.div`
  width: 100%;
  height: 20px;
  padding: 0 20px;
  display: grid;
  align-items: center;
  grid-gap: 2%;
  grid-template-columns: 5% 30% 16.5% 16.5% 8% 14%;
  margin-top: 60px;
`;

export const AudioSampleColumn = styled.div<{ justify?: string }>`
  font-size: 11px;
  font-weight: 600;

  ${({ justify }) => justify && css`
    justify-self: ${justify};
  `};
`;

export const UploaderWrapper = styled.div`
  padding: ${layoutTopBottomPadding} ${layoutTopBottomPadding} 0 ;
`;

export const AudioSamplesListing = styled.div`
  padding: 175px ${layoutTopBottomPadding} 0;
`;

export const AudioSampleFormWrapper = styled.div`
  width: 25%;
  position: fixed;
  right: 0;
  top: ${headerHeight};
  height: calc(100vh - ${headerHeight});
  padding: ${layoutTopBottomPadding};
  background-color: ${({ theme }) => theme.colors.white};
  overflow: auto;
`;

export const ConfirmActionDesc = styled.p`
  text-align: center;
  line-height: 1.3;
`;
