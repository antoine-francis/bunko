import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Collective, CollectivesState} from "../types/Collective.ts";
import {LoadingState} from "../types/StateManagement.ts";
import {loadCollectiveDetails} from "../features/collectives/api/load-collectives.ts";

export const fetchCollective = createAsyncThunk<Collective | undefined, string>(
	'collectives_fetchCollective',
	async (id: string) => {
		return await loadCollectiveDetails(id);
	}
)

const initialState: CollectivesState = {
};

const collectivesSlice = createSlice({
	name: 'collectives',
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder
			.addCase(fetchCollective.pending, (state, action : PayloadAction<LoadingState | undefined>) => {
				const id = (action as any).meta.arg;
				(state[id] as LoadingState) = {loading: true, error: undefined}
			})
			.addCase(fetchCollective.fulfilled, (state, action : PayloadAction<Collective | undefined>) => {
				if (action.payload !== undefined) {
					state[action.payload.id] = {...action.payload, loading: false, error: undefined};
				}
			})
			.addCase(fetchCollective.rejected, (state, action) => {
				const id = (action as any).meta.arg;
				state[id].loading = false;
				state[id].error = (action as any).error.message;
			})
	},
});


export default collectivesSlice.reducer;