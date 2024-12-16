import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {LoadingState} from "../types/StateManagement.ts";
import {loadText} from "../features/text/api/load-single-text.ts";
import {BunkoText, TextState} from "../types/Text.ts";

export const fetchText = createAsyncThunk<BunkoText | undefined, string>(
	'text_fetchText',
	async (id: string) => {
		return await loadText(id);
	}
)

const initialState: TextState = {
};

const textSlice = createSlice({
	name: 'text',
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder
			.addCase(fetchText.pending, (state, action : PayloadAction<LoadingState | undefined>) => {
				const id = (action as any).meta.arg;
				(state[id] as LoadingState) = {loading: true, error: undefined};
			})
			.addCase(fetchText.fulfilled, (state, action : PayloadAction<BunkoText | undefined>) => {
				if (action.payload !== undefined) {
					state[action.payload.id] = {...action.payload, loading: false, error: undefined};
				}
			})
			.addCase(fetchText.rejected, (state, action) => {
				const id = (action as any).meta.arg;
				state[id].loading = false;
				state[id].error = (action as any).error.message;
			})
	},
});


export default textSlice.reducer;