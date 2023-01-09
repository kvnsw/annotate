import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UserState {
  isLogged: boolean;
  data?: {
    accountType: 'admin' | 'operator';
  };
}

const initialState: UserState = {
  isLogged: false,
  data: undefined,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logIn: (state, action: PayloadAction<UserState['data']>) => {
      state.isLogged = true;
      state.data = action.payload;
    },
    logOut: (state) => {
      state.isLogged = false;
      state.data = undefined;
    },
  },
});

export const { logIn, logOut } = userSlice.actions;

export default userSlice.reducer;
