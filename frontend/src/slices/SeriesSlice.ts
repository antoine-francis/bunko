import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Series, SeriesState} from "../types/Series.ts";
import {LoadingState} from "../types/StateManagement.ts";
import {loadSeries} from "../features/dashboard/api/load-texts.ts";

export const fetchSeries = createAsyncThunk<Series | undefined, string>(
	'series_fetchSeries',
	async (id: string) => {
		return await loadSeries(id);
	}
)

const initialState: SeriesState = {
};

const seriesSlice = createSlice({
	name: 'series',
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder
			.addCase(fetchSeries.pending, (state, action : PayloadAction<LoadingState | undefined>) => {
				const id = (action as any).meta.arg;
				(state[id] as LoadingState) = {loading: true, error: undefined};
			})
			.addCase(fetchSeries.fulfilled, (state, action : PayloadAction<Series | undefined>) => {
				if (action.payload !== undefined) {
					state[action.payload.id] = {...action.payload, loading: false, error: undefined};
				}
			})
			.addCase(fetchSeries.rejected, (state, action) => {
				const id = (action as any).meta.arg;
				state[id].loading = false;
				state[id].error = (action as any).error.message;
			})
	},
});


export default seriesSlice.reducer;