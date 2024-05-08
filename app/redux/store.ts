import { Action, ThunkAction, configureStore } from "@reduxjs/toolkit";
import accountReducer from "./slice/accountSlide";
import roleReducer from "./slice/roleSlide";
import permissionSlide from "./slice/permissionSlide";
import userSlide from "./slice/userSlide";
import cinemaSlide from "./slice/cinemaSlide";
import roomSilide from "./slice/roomSilide";
import movieSlide from "./slice/movieSlide";

export const store = configureStore({
  reducer: {
    account: accountReducer,
    role: roleReducer,
    permission: permissionSlide,
    user: userSlide,
    cinema: cinemaSlide,
    room: roomSilide,
    movie: movieSlide
  }
})

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;