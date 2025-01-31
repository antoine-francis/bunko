import {BunkoText, MinimalTextDesc} from "./Text.ts";
import {HttpStatus} from "../constants/Http.ts";

export interface Genre {
	tag: string;
	texts?: MinimalTextDesc[]
}

export interface TagListState {
	[key: string]: TagLoadingState;
}

export interface BrowseTagsState {
	tags: Genre[];
	loading: boolean;
	error: HttpStatus | undefined;
	tagSearch: {
		loading: boolean;
		error: HttpStatus | undefined;
		searchBarText: string;
		searchResults: GenreSearchResults;
	}
}

export interface GenreSearchResults {
	[key: string]: Genre[];
}

export interface TagLoadingState {
	texts: BunkoText[];
	loading: boolean;
	error: HttpStatus | undefined;
}