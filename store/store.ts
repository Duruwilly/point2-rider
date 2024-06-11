import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import thunk from "redux-thunk";
import appReducer from "./reducers/app-reducer";
import usersReducer from "./reducers/users-reducer";

const rootReducer = combineReducers({
  user: usersReducer,
  appReducer: appReducer,
});

export const store = configureStore({
  reducer: rootReducer,
//   middleware: [thunk],
});

export type RootState = ReturnType<typeof store.getState>;
