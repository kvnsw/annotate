import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AudioSampleDocument } from '../../pages/api/audio-samples';

export interface PlayerState {
  isPlaying: boolean;
  current?: AudioSampleDocument.Base;
  duration: number;
}

const initialState: PlayerState = {
  isPlaying: false,
  current: undefined,
  duration: 0,
};

export const playerSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    play: (state, action: PayloadAction<AudioSampleDocument.Base>) => {
      // When changing sources, we let the player handle the play action
      if (action.payload._id !== state.current?._id) {
        state.current = action.payload;
      } else {
        state.isPlaying = true;
      }
    },
    pause: (state) => {
      state.isPlaying = false;
    },
    setPlaying: (state, action: PayloadAction<boolean>) => {
      state.isPlaying = action.payload;
    },
    setCurrentTrack: (state, action: PayloadAction<AudioSampleDocument.Base>) => {
      state.current = action.payload;
    },
    setDuration: (state, action: PayloadAction<number>) => {
      state.duration = action.payload;
    },
    resetPlayer: (state) => {
      state.isPlaying = false;
      state.current = undefined;
      state.duration = 0;
    },
  },
});

export const {
  play,
  pause,
  setPlaying,
  setCurrentTrack,
  setDuration,
  resetPlayer,
} = playerSlice.actions;

export default playerSlice.reducer;
