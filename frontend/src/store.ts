import {configureStore} from "@reduxjs/toolkit";
import userReducer from "./slices/UserSlice.ts";
import {createLogger} from "redux-logger";

export const store = configureStore({
	reducer: {
		currentUser: userReducer
	},
	middleware: getDefaultMiddleware => getDefaultMiddleware().concat(createLogger()),
})

export type RootState = ReturnType<typeof store.getState>

export type BunkoDispatch = typeof store.dispatch;