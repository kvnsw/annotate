import { ArrowRepeat, PauseCircle, PlayCircle } from 'react-bootstrap-icons';
import styled, { css } from 'styled-components';

export const Wrapper = styled.div``;

export const CurrentTrack = styled.div`
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  color: ${({ theme }) => theme.colors.white};
  text-align: center;
  padding: 30px 20px;
  background: linear-gradient(90deg, #2b3e65 0%, #30364b 100%);
`;

export const SeekBarWrapper = styled.div`
  width: 100%;
  margin-top: 30px;
`;

export const SeekBarInput = styled.input`
  width: 100%;
`;

export const DurationWrapper = styled.div`
  font-size: 10px;
  font-weight: 600;
  width: 100%;
  display: flex;
  justify-content: space-between;
`;

export const NowPlaying = styled.p`
  text-transform: uppercase;
  font-size: 10px;
`;

export const TrackTitle = styled.p`
  margin-top: 20px;
  font-size: 13px;
  font-weight: 600;
  word-break: break-all;
`;

export const Actions = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  background-color: #464858;
  height: 70px;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
`;

export const RepeatIcon = styled(ArrowRepeat).attrs({
  width: 25,
  height: 25,
})<{ $isActive?: boolean }>`
  cursor: pointer;
  fill: ${({ theme }) => theme.colors.white};

  ${({ $isActive }) => $isActive && css`
    fill: ${({ theme }) => theme.colors.sand};
  `};
`;

export const PlayIcon = styled(PlayCircle).attrs(({ theme }) => ({
  width: 30,
  height: 30,
  fill: theme.colors.white,
}))`
  cursor: pointer;
`;

export const PauseIcon = styled(PauseCircle).attrs(({ theme }) => ({
  width: 30,
  height: 30,
  fill: theme.colors.white,
}))`
  cursor: pointer;
`;

export const SpeedIcon = styled.div`
  width: 25px;
  height: 25px;
  border: 1.5px solid ${({ theme }) => theme.colors.white};
  border-radius: 50%;
  color: ${({ theme }) => theme.colors.white};
  font-size: 8px;
  font-weight: 600;
  text-align: center;
  line-height: 22px;
  cursor: pointer;
  user-select: none;
`;
