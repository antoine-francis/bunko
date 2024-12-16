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
	texts: [] as BunkoText[],
	error: undefined,
	loaded: false,
};

const textListSlice = createSlice({
	name: 'texts',
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder
			.addCase(fetchTexts.pending, (state) => {
				state.loaded = false;
			})
			.addCase(fetchTexts.fulfilled, (state, action : PayloadAction<BunkoText[]>) => {
				state.texts = action.payload;
				state.loaded = true;
			})
			.addCase(fetchTexts.rejected, (state, action) => {
				state.texts = [];
				state.loaded = true;
				state.error = (action as any).error.message;
			})
	}
});

export default textListSlice.reducer;