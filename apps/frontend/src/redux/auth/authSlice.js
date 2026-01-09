import { createSlice } from "@reduxjs/toolkit";
import { logIn, logOut, register, refreshUser } from "./authOperations.js";

// Yardımcı reducer fonksiyonlar

const handlePending = (state) => {
  state.isLoading = true;
  state.error = null;
};

const handleRejected = (state, action) => {
  state.isLoading = false;
  state.error = action.payload;
};

const handleFulfilled = (state, action) => {
  state.user = action.payload.user;
  state.token = action.payload.token;
  state.isLoggedIn = true;
  state.isLoading = false;
  state.error = null;
};

// Refresh durumu için yardımcı reducerlar
const handleRefreshFulFilled = (state, action) => {
  const { user, accessToken, refreshToken } = action.payload;

  state.user = user || { name: null, email: null };
  state.token = accessToken || null;
  state.refreshToken = refreshToken || null;
  state.isLoggedIn = true;
  state.isRefreshing = false;
  state.isLoading = false;
  state.error = null;
};

const handleRefreshPending = (state) => {
  state.isRefreshing = true;
  state.isLoading = true;
  state.error = null;
};

const handleRefreshRejected = (state) => {
  state.isRefreshing = false;
  state.isLoggedIn = false;
  state.isLoading = false;
};

const handleLogOutFulfilled = (state) => {
  state.user = { name: null, email: null };
  state.token = null;
  state.isLoggedIn = false;
  state.isLoading = false;
  state.error = null;
};

const handleLogOutRejected = (state) => {
  state.user = { name: null, email: null };
  state.token = null;
  state.isLoggedIn = false;
  state.isLoading = false;
  state.error = null;
};

// Başlangıç değerleri
const initialState = {
  user: { name: null, email: null },
  token: null,
  isLoggedIn: false,
  isRefreshing: false,
  isLoading: false,
  error: null,
};

// Slice

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      //Login durumları
      .addCase(logIn.pending, handlePending)
      .addCase(logIn.fulfilled, handleFulfilled)
      .addCase(logIn.rejected, handleRejected)
      //Register durumları
      .addCase(register.pending, handlePending)
      .addCase(register.fulfilled, handleFulfilled)
      .addCase(register.rejected, handleRejected)
      //Refresh durumları
      .addCase(refreshUser.pending, handleRefreshPending)
      .addCase(refreshUser.fulfilled, handleRefreshFulFilled)
      .addCase(refreshUser.rejected, handleRefreshRejected)
      //Logout durumları
      .addCase(logOut.pending, handlePending)
      .addCase(logOut.fulfilled, handleLogOutFulfilled)
      .addCase(logOut.rejected, handleLogOutRejected);
  },
});

export const { clearAuthError } = authSlice.actions;
export default authSlice.reducer;
