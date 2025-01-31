import {createSlice} from '@reduxjs/toolkit';
import {UiState} from "../types/StateManagement.ts";

const initialState: UiState = {
	showVerticalOptionsBar: false,
};

const uiStateSlice = createSlice({
	name: 'modal',
	initialState,
	reducers: {
		showVerticalBar: (state) => {
			state.showVerticalOptionsBar = true;
		},
		hideVerticalBar: (state) => {
			state.showVerticalOptionsBar = false;
		},
		toggleVerticalBar: (state) => {
			state.showVerticalOptionsBar = !state.showVerticalOptionsBar;
		},
	},
});

export const { toggleVerticalBar, hideVerticalBar, showVerticalBar } = uiStateSlice.actions;


export default uiStateSlice.reducer;