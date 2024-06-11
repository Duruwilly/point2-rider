import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import User from "../../models/User";
import UserLocation from "../../models/User-location";

const UserReducerState: {
  isAuthenticated: boolean;
  access_token?: string;
  refresh_token?: string;
  auth_Id?: string;
  user?: User;
  location?: UserLocation;
  expoPushtoken?: string;
} = { isAuthenticated: false };

const UserReducer = createSlice({
  name: "userSlice",
  initialState: UserReducerState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      return {
        ...state,
        user: action.payload,
        // isAuthenticated: true,
      };
    },
    setIsAuthentication: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    },

    clearUser: (state) => {
      return {
        ...state,
        user: undefined,
        isAuthenticated: false,
        access_token: undefined,
        auth_Id: undefined,
      };
    },

    // setRefreshToken: (state, action: PayloadAction<string | undefined>) => {
    //   return { ...state, refresh_token: action.payload };
    // },

    setAccessToken: (state, action: PayloadAction<string | undefined>) => {
      return { ...state, access_token: action.payload };
    },
    setAuthId: (state, action: PayloadAction<string | undefined>) => {
      return { ...state, auth_Id: action.payload };
    },
    setExpoPushToken: (state, action: PayloadAction<string | undefined>) => {
      return { ...state, expoPushtoken: action.payload };
    },
    setLocation: (state, action: PayloadAction<UserLocation>) => {
      return { ...state, location: action.payload };
    },
  },
});

export const {
  setIsAuthentication,
  clearUser,
  // setRefreshToken,
  setAccessToken,
  setAuthId,
  setUser,
  setLocation,
  setExpoPushToken,
} = UserReducer.actions;
export default UserReducer.reducer;
