import {HttpStatus} from "../constants/Http.ts";

export interface LoadingState {
	loading: boolean;
	error: HttpStatus | undefined;
}