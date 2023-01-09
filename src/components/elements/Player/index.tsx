import { compose } from '@reduxjs/toolkit';
import { TFunction, withTranslation } from 'next-i18next';
import raf from 'raf';
import { Component, ComponentType } from 'react';
import ReactHowler from 'react-howler';
import { connect, ConnectedProps } from 'react-redux';

import { AppState } from '../../../store';
import {
  setPlaying as setPlayingBase,
  setDuration as setDurationBase,
} from '../../../store/slices/playerSlice';

import {
  Actions,
  CurrentTrack,
  DurationWrapper,
  NowPlaying,
  PauseIcon,
  PlayIcon,
  RepeatIcon,
  SeekBarInput,
  SeekBarWrapper,
  SpeedIcon,
  TrackTitle,
  Wrapper,
} from './styles';

const mapState = (state: AppState) => ({
  isPlaying: state.player.isPlaying,
  data: state.player.current,
});

const mapDispatch = {
  setPlaying: setPlayingBase,
  setDuration: setDurationBase,
};

const connector = connect(mapState, mapDispatch);

interface PlayerProps extends ConnectedProps<typeof connector> {
  t: TFunction;
}

interface PlayerState {
  loaded: boolean;
  loop: boolean;
  seek: number;
  duration: number;
  rate: number;
  isSeeking: boolean;
}

function presentDuration(duration: number) {
  let ms: number | string = Math.floor((duration * 100) % 100);
  let sec: number | string = Math.floor(duration % 60);
  let min: number | string = Math.floor(duration / 60);

  if (ms < 10) ms = `0${ms}`;
  if (sec < 10) sec = `0${sec}`;
  if (min < 10) min = `0${min}`;

  return `${min}:${sec}:${ms}`;
}

class Player extends Component<PlayerProps, PlayerState> {
  protected player: ReactHowler | null;

  protected rafVal: number;

  constructor(props: PlayerProps) {
    super(props);

    this.state = {
      loaded: false,
      loop: false,
      seek: 0.0,
      duration: 0,
      rate: 1,
      isSeeking: false,
    };

    this.player = null;
    this.rafVal = 0;
  }

  componentDidMount() {
    window.addEventListener('keydown', this.handleKeyDown);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown);
    this.clearRAF();
  }

  handleKeyDown = (e: KeyboardEvent) => {
    const { data } = this.props;

    let targetTagName = '';

    if (e.target instanceof Element) {
      targetTagName = e.target.tagName.toLowerCase();
    }

    // When pressing on space bar when there is a current
    // track and target is not an input or textarea
    if (
      !!data
      && e.code === 'Space'
      && !['input', 'textarea'].includes(targetTagName)
    ) {
      e.preventDefault();

      this.handleToggle();
    }
  };

  handleToggle = () => {
    const { isPlaying, setPlaying } = this.props;

    setPlaying(!isPlaying);
  };

  handleOnLoad = () => {
    const { isPlaying, setDuration } = this.props;

    setDuration(this.player!.duration());

    this.setState({
      loaded: true,
      duration: this.player!.duration(),
    }, () => {
      if (!isPlaying) {
        this.handleOnPlay();
      }
    });
  };

  handleOnPlay = () => {
    const { setPlaying } = this.props;

    setPlaying(true);
    this.renderSeekPos();
  };

  handleOnEnd = () => {
    const { setPlaying } = this.props;

    setPlaying(false);
    this.clearRAF();
  };

  handleLoopToggle = () => {
    this.setState(({ loop }) => ({
      loop: !loop,
    }));
  };

  handleMouseDownSeek = () => {
    this.setState({ isSeeking: true });
  };

  handleMouseUpSeek = (nextSeek: number) => {
    this.setState({ isSeeking: false });

    this.player!.seek(nextSeek);
  };

  handleSeekingChange = (nextSeek: number) => {
    this.setState({ seek: nextSeek });
  };

  renderSeekPos = () => {
    const { isPlaying } = this.props;
    const { isSeeking } = this.state;

    if (!isSeeking) {
      this.setState({
        seek: this.player?.seek() || 0,
      });
    }

    if (isPlaying) {
      this.rafVal = raf(this.renderSeekPos);
    }
  };

  handleRate = (nextRate: number) => {
    (this.player as ReactHowler & { rate: (_r: number) => void })!.rate(nextRate);
    this.setState({ rate: nextRate });
  };

  clearRAF = () => {
    raf.cancel(this.rafVal);
  };

  render() {
    const { data, isPlaying, t } = this.props;
    const { loop, loaded, seek, duration, rate } = this.state;

    return (
      <Wrapper>
        {data?.sampleUrl && (
          <ReactHowler
            src={`https://${process.env.NEXT_PUBLIC_ANNOTATE_AWS_S3_BUCKET}.s3.${process.env.NEXT_PUBLIC_ANNOTATE_AWS_S3_BUCKET_REGION}.amazonaws.com${data.sampleUrl}`}
            playing={isPlaying}
            onLoad={this.handleOnLoad}
            onPlay={this.handleOnPlay}
            onEnd={this.handleOnEnd}
            loop={loop}
            rate={rate}
            volume={1.0} // Use computer volume
            ref={(ref) => {
              this.player = ref;
            }}
          />
        )}
        <CurrentTrack>
          <NowPlaying>
            {loaded
              ? t('components:player.nowPlaying')
              : t('components:player.loading')}
          </NowPlaying>
          <TrackTitle>{data?.title || '-'}</TrackTitle>
          <SeekBarWrapper>
            <SeekBarInput
              type="range"
              min="0"
              max={duration ? duration.toFixed(2) : 0}
              step=".01"
              value={seek}
              onChange={e => this.handleSeekingChange(
                parseFloat(e.target.value),
              )}
              onMouseDown={this.handleMouseDownSeek}
              onMouseUp={e => this.handleMouseUpSeek(
                parseFloat((e.target as HTMLInputElement).value),
              )}
            />
          </SeekBarWrapper>
          {!!duration && (
            <DurationWrapper>
              <span>{presentDuration(seek)}</span>
              <span>{presentDuration(duration)}</span>
            </DurationWrapper>
          )}
        </CurrentTrack>
        <Actions>
          <RepeatIcon
            $isActive={loop as boolean}
            onClick={this.handleLoopToggle}
          />
          {isPlaying
            ? <PauseIcon onClick={this.handleToggle} />
            : <PlayIcon onClick={this.handleToggle} />}
          <SpeedIcon onClick={() => this.handleRate(rate === 1 ? 0.5 : 1)}>
            x
            {rate === 1 ? 1 : 0.5}
          </SpeedIcon>
        </Actions>
      </Wrapper>
    );
  }
}

export default compose<ComponentType>(
  connector,
  withTranslation(['components']),
)(Player);
