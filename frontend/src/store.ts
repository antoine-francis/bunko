import {configureStore} from "@reduxjs/toolkit";
import userReducer from "./slices/UserSlice.ts";
import {createLogger} from "redux-logger";
import textListReducer from "./slices/TextListSlice.ts";
import textReducer from "./slices/TextSlice.ts";
import textEditorReducer from "./slices/TextEditorSlice.ts";
import profilesReducer from "./slices/ProfilesSlice.ts";
import seriesReducer from "./slices/SeriesSlice.ts";
import tagsReducer from "./slices/TagSlice.ts";
import browseTagsReducer from "./slices/BrowseTagsSlice.ts";
import collectivesReducer from "./slices/CollectivesSlice.ts"
import modalReducer from "./slices/ModalSlice.ts"
import uiStateReducer from "./slices/UiStateSlice.ts"

export const store = configureStore({
	reducer: {
		uiState: uiStateReducer,
		dashboard: textListReducer,
		userProfiles: profilesReducer,
		currentUser: userReducer,
		series: seriesReducer,
		collectives: collectivesReducer,
		tags: tagsReducer,
		browseTags: browseTagsReducer,
		texts: textReducer,
		textEditor: textEditorReducer,
		modal: modalReducer,
	},
	middleware: getDefaultMiddleware => getDefaultMiddleware().concat(createLogger({
		collapsed: true,
	})),
})

export type RootState = ReturnType<typeof store.getState>

export type BunkoDispatch = typeof store.dispatch;