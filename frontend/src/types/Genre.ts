import {BunkoText} from "./Text.ts";
import {HttpStatus} from "../constants/Http.ts";

export interface Genre {
	tag: string;
}

export interface TagListState {
	[key: string]: TagLoadingState;
}

export interface TagLoadingState {
	texts: BunkoText[];
	loading: boolean;
	error: HttpStatus | undefined;
}