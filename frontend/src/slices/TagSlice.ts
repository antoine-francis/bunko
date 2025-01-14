import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {loadTextsByTag} from "../features/dashboard/api/load-texts.ts";
import {BunkoText} from "../types/Text.ts";
import {LoadingState} from "../types/StateManagement.ts";
import {TagListState} from "../types/Genre.ts";

export const fetchTextsByTag = createAsyncThunk<BunkoText[], string>(
	'texts_fetchTextsByTag',
	async (tag : string) => {
		return await loadTextsByTag(tag);
	}
)

const initialState: TagListState = {};

const tagSlice = createSlice({
	name: 'texts',
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder
			.addCase(fetchTextsByTag.pending, (state, action : PayloadAction<LoadingState | undefined>) => {
				const tag = (action as any).meta.arg;
				(state[tag] as LoadingState) = {loading: true, error: undefined};
			})
			.addCase(fetchTextsByTag.fulfilled, (state, action : PayloadAction<BunkoText[]>) => {
				if (action.payload !== undefined) {
					const tag = (action as any).meta.arg;
					state[tag] = {loading: false, error: undefined, texts: action.payload};
				}
			})
			.addCase(fetchTextsByTag.rejected, (state, action) => {
				const tag = (action as any).meta.arg;
				state[tag].loading = false;
				state[tag].error = (action as any).error.message;
			})

	}
});

export default tagSlice.reducer;