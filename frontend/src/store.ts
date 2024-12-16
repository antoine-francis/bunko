import {configureStore} from "@reduxjs/toolkit";
import userReducer from "./slices/UserSlice.ts";
import {createLogger} from "redux-logger";
import textListReducer from "./slices/TextListSlice.ts";
import textReducer from "./slices/TextSlice.ts";
import profilesReducer from "./slices/ProfilesSlice.ts";
import seriesReducer from "./slices/SeriesSlice.ts";
import collectivesReducer from "./slices/CollectivesSlice.ts"

export const store = configureStore({
	reducer: {
		dashboard: textListReducer,
		userProfiles: profilesReducer,
		currentUser: userReducer,
		series: seriesReducer,
		collectives: collectivesReducer,
		texts: textReducer,
	},
	middleware: getDefaultMiddleware => getDefaultMiddleware().concat(createLogger({
		collapsed: true,
	})),
})

export type RootState = ReturnType<typeof store.getState>

export type BunkoDispatch = typeof store.dispatch;