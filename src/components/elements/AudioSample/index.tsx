import dayjs from 'dayjs';
import { useTranslation } from 'next-i18next';

import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { pause, play } from '../../../store/slices/playerSlice';

import { AudioSampleDocument } from '../../../pages/api/audio-samples';

import { IconTextWrapper, PauseIcon, PlayIcon, Status, StyledSkipIcon, Title, Wrapper } from './styles';

function AudioSample({ data }: { data: AudioSampleDocument.Base }) {
  const { t } = useTranslation('common');

  const { isPlaying, current } = useAppSelector(state => state.player);
  const dispatch = useAppDispatch();

  return (
    <Wrapper>
      {(isPlaying && current?._id === data._id)
        ? <PauseIcon onClick={() => dispatch(pause())} />
        : <PlayIcon onClick={() => dispatch(play(data))} />}
      <Title>{data.title}</Title>
      <IconTextWrapper>
        {data.submittedAt && (
          <p>{dayjs(data.submittedAt).format('L - HH:mm')}</p>
        )}
      </IconTextWrapper>
      <IconTextWrapper>
        {data.reviewedAt && (
          <p>{dayjs(data.reviewedAt).format('L - HH:mm')}</p>
        )}
      </IconTextWrapper>
      <IconTextWrapper>
        {data.skipped && <StyledSkipIcon />}
      </IconTextWrapper>
      <IconTextWrapper>
        <Status status={data.status}>
          {t(`common:audioSampleStatus.${data.status}`)}
        </Status>
      </IconTextWrapper>
    </Wrapper>
  );
}

export default AudioSample;
