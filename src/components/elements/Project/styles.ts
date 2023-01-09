import { darken, lighten } from 'polished';
import { CalendarCheck, ClockHistory, FileMusic, SkipEndCircle } from 'react-bootstrap-icons';
import styled, { css } from 'styled-components';

import { ProjectDocument } from '../../../pages/api/projects';

export const Wrapper = styled.a`
  width: 100%;
  background-color: rgba(255, 255, 255, 0.7);
  padding: 20px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 200ms ease, box-shadow 200ms ease;

  &:hover {
    background-color: rgba(255, 255, 255, 1);
    box-shadow: 5px 5px 15px 5px rgba(0, 0, 0, 0.05);
  }
`;

export const DisplayWrapper = styled.div`
  width: 100%;
  height: 100%;
  position:relative;
`;

export const PreHeadSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: right;
  margin-bottom: 20px;
`;

export const IconTextWrapper = styled.div<{
  variant?: 'warning' | 'overdue'
}>`
  display: flex;
  align-items: center;
  font-size: 13px;

  :not(:first-of-type) {
    margin-left: 15px;
  }

  & p {
    margin-right: 5px;
    color: ${({ theme, variant }) => {
    switch (variant) {
      case 'warning': return lighten(0.1, theme.colors.rust);
      case 'overdue': return theme.colors.rust;
      default: return darken(0.4, theme.colors.grey);
    }
  }};
  }
`;

export const StyledAudioIcon = styled(FileMusic).attrs(({ theme }) => ({
  width: 19,
  height: 19,
  fill: darken(0.4, theme.colors.grey),
}))``;

export const StyledSkipIcon = styled(SkipEndCircle).attrs(({ theme }) => ({
  width: 19,
  height: 19,
  fill: darken(0.4, theme.colors.grey),
}))``;

export const StyledCheckIcon = styled(CalendarCheck).attrs(({ theme }) => ({
  width: 19,
  height: 19,
  fill: darken(0.4, theme.colors.grey),
}))``;

export const StyledTimeIcon = styled(ClockHistory).attrs({
  width: 19,
  height: 19,
})<{ variant?: 'warning' | 'overdue' }>`
  fill: ${({ theme, variant }) => {
    switch (variant) {
      case 'warning': return lighten(0.1, theme.colors.rust);
      case 'overdue': return theme.colors.rust;
      default: return darken(0.4, theme.colors.grey);
    }
  }};
`;

export const HeadSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const Title = styled.p`
  ${({ theme }) => theme.helpers.textEllipsis};
  font-weight: 600;
  max-width: 60%;
`;

export const Status = styled.div<{ status: ProjectDocument.Base['status'] }>`
  background-color: ${({ theme }) => theme.colors.grey};
  border: 1px solid ${({ theme }) => darken(0.1, theme.colors.grey)};
  height: 35px;
  line-height: 35px;
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

      case 'completed':
        return css`
          background-color: ${theme.colors.pine};
          border: 1px solid ${darken(0.1, theme.colors.pine)};
          color: ${theme.colors.white};
        `;

      case 'draft':
      default:
        return css`
          background-color: ${theme.colors.grey};
          border: 1px solid ${darken(0.1, theme.colors.grey)};
        `;
    }
  }}
`;

export const Provider = styled.p`
  ${({ theme }) => theme.helpers.textEllipsis};
  margin: 10px 0 40px;
  font-size: 14px;
  max-width: 80%;
  height: 20px;

  & b {
    font-weight: 600;
  }
`;

export const ProgressPlaceholder = styled.div`
  height: 80px;
  margin-top: 20px;
`;

export const ProgressWrapper = styled.div`
  color: ${({ theme }) => theme.colors.black};
  font-size: 12px;
  font-weight: 600;
  height: 30px;

  &:not(:first-of-type) {
    margin-top: 20px;
  }
`;

export const AnnotationProgressWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const RejectedReviews = styled.p`
  color: ${({ theme }) => theme.colors.rust};
`;

export const DateWrapper = styled.div<{ variant?: 'display' | 'card' }>`
  margin-top: 40px;

  ${({ variant }) => variant && css`
    position: absolute;
    bottom: 0;
    left: 0;
    padding: inherit;
  `};
`;

export const DateDisplay = styled.p`
  font-weight: 400;
  font-style: italic;
  font-size: 12px;
  color: ${({ theme }) => darken(0.3, theme.colors.grey)};
  
  &:not(:first-of-type) {
    margin-top: 10px;
  }
`;
