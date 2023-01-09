import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit';

import playerReducer from './slices/playerSlice';
import userReducer from './slices/userSlice';

export function makeStore() {
  return configureStore({
    reducer: { user: userReducer, player: playerReducer },
  });
}

const store = makeStore();

export type AppState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  AppState,
  unknown,
  Action<string>
>;

export default store;
