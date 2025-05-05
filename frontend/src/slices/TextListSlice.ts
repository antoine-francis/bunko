import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {loadTexts} from "../features/dashboard/api/load-texts.ts";
import {BunkoText, TextListState} from "../types/Text.ts";

export const fetchTexts = createAsyncThunk(
	'texts_fetchTexts',
	async () => {
		return await loadTexts();
	}
)

const initialState: TextListState = {
	bookmarks: [] as BunkoText[],
	error: undefined,
	loading: true,
};

const textListSlice = createSlice({
	name: 'texts',
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder
			.addCase(fetchTexts.pending, (state) => {
				state.loading = true;
			})
			.addCase(fetchTexts.fulfilled, (state, action : PayloadAction<{feed: BunkoText[], bookmarks: BunkoText[]}>) => {
				const {bookmarks} = action.payload;
				state.bookmarks = bookmarks;
				state.loading = false;
			})
			.addCase(fetchTexts.rejected, (state, action) => {
				state.loading = false;
				state.error = (action as any).error.message;
			})
	}
});

export default textListSlice.reducer;