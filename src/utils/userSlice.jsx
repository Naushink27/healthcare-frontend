import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: null,
    isAuthenticated: false,
  },
  reducers: {
    addUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    removeUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

export const { addUser, removeUser } = userSlice.actions;
export default userSlice.reducer;