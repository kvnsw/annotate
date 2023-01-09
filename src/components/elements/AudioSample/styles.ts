import { darken } from 'polished';
import { PauseCircle, PlayCircle, SkipEndCircle } from 'react-bootstrap-icons';
import styled, { css } from 'styled-components';

import { AudioSampleDocument } from '../../../pages/api/audio-samples';

export const Wrapper = styled.div`
  width: 100%;
  background-color: ${({ theme }) => theme.colors.white};
  height: 70px;
  border-radius: 10px;
  box-shadow: 5px 5px 15px 5px rgba(0, 0, 0, 0.05);
  padding: 0 20px;
  display: grid;
  align-items: center;
  grid-gap: 2%;
  grid-template-columns: 5% 30% 16.5% 16.5% 8% 14%;

  &:not(:last-of-type) {
    margin-bottom: 20px;
  }
`;

export const Title = styled.p`
  ${({ theme }) => theme.helpers.textEllipsis};
  font-weight: 600;
  font-size: 14px;
`;

export const PlayIcon = styled(PlayCircle).attrs({
  width: 30,
  height: 30,
})`
  cursor: pointer;
`;

export const PauseIcon = styled(PauseCircle).attrs({
  width: 30,
  height: 30,
})`
  cursor: pointer;
`;

export const IconTextWrapper = styled.div`
  display: flex;
  align-items: center;
  font-size: 13px;

  & p {
    margin-left: 5px;
  }
`;

export const Status = styled.div<{ status: AudioSampleDocument.Base['status'] }>`
  background-color: ${({ theme }) => theme.colors.grey};
  border: 1px solid ${({ theme }) => darken(0.1, theme.colors.grey)};
  height: 30px;
  line-height: 30px;
  font-size: 12px;
  border-radius: 5px;
  text-align: center;
  padding: 0 10px;

  ${({ status, theme }) => {
    switch (status) {
      case 'ongoing':
        return css`
          background-color: ${darken(0.4, theme.colors.sky)};
          border: 1px solid ${darken(0.5, theme.colors.sky)};
          color: ${theme.colors.white};
        `;

      case 'review':
        return css`
          background-color: ${theme.colors.sand};
          border: 1px solid ${darken(0.1, theme.colors.sand)};
          color: ${theme.colors.white};
        `;

      case 'accepted':
        return css`
          background-color: ${theme.colors.pine};
          border: 1px solid ${darken(0.1, theme.colors.pine)};
          color: ${theme.colors.white};
        `;

      case 'rejected':
      default:
        return css`
          background-color: ${theme.colors.rust};
          border: 1px solid ${darken(0.1, theme.colors.rust)};
          color: ${theme.colors.white};
        `;
    }
  }}
`;

export const StyledSkipIcon = styled(SkipEndCircle).attrs(({ theme }) => ({
  width: 20,
  height: 20,
  fill: darken(0.4, theme.colors.grey),
}))``;
