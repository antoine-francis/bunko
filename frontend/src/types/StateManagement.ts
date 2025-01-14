import {HttpStatus} from "../constants/Http.ts";

export interface LoadingState {
	loading: boolean;
	error: HttpStatus | undefined;
}

export interface ModalState {
	alertType: string | undefined;
	showAlert: boolean;
}