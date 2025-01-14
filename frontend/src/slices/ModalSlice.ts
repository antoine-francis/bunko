import {createSlice} from '@reduxjs/toolkit';
import {C} from "../constants/Constants.ts";
import {ModalState} from "../types/StateManagement.ts";

const initialState: ModalState = {
	showAlert: false,
	alertType: undefined,
};

const modalSlice = createSlice({
	name: 'modal',
	initialState,
	reducers: {
		confirmLostChanges: (state) => {
			state.showAlert = true;
			state.alertType = C.CANCEL_EDIT;
		},
		confirmDelete: (state) => {
			state.showAlert = true;
			state.alertType = C.DELETE_TEXT;
		},
		confirmPublication: (state) => {
			state.showAlert = true;
			state.alertType = C.PUBLISH_TEXT;
		},
		closeModal: (state) => {
			state.showAlert = false;
			state.alertType = undefined;
		},
	},
});

export const { confirmLostChanges, confirmDelete, closeModal, confirmPublication } = modalSlice.actions;


export default modalSlice.reducer;