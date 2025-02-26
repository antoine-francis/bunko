import {createSlice} from '@reduxjs/toolkit';
import {UiState} from "../types/StateManagement.ts";
import {detectDarkMode} from "../utils/detect-color-scheme.ts";

const isDarkMode : boolean = detectDarkMode();

const initialState: UiState = {
	showVerticalOptionsBar: false,
	isDarkMode
};

const uiStateSlice = createSlice({
	name: 'uiState',
	initialState,
	reducers: {
		toggleVerticalBar: (state) => {
			state.showVerticalOptionsBar = !state.showVerticalOptionsBar;
		},
		toggleDarkMode: (state) => {
			state.isDarkMode = !state.isDarkMode;
		},
	},
});

export const { toggleVerticalBar, toggleDarkMode } = uiStateSlice.actions;


export default uiStateSlice.reducer;