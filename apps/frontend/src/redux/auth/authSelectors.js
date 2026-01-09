export const selectIsLoggedIn = (state) => state.auth.isLoggedIn;
export const selectIsLoading = (state) => state.auth.isLoading;
export const selectIsRefreshing = (state) => state.auth.isRefreshing;
export const selectError = (state) => state.auth.error;
export const selectUser = (state) => state.auth.user;
export const selectUsername = (state) => state.auth.user.name;
