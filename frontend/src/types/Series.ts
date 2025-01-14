import {Author} from "./Author.ts";
import {BunkoText} from "./Text.ts";

export interface Series {
	id: number;
	title: string;
	author: Author;
	picture?: string;
	entries: BunkoText[];
	error?: string;
	loading?: boolean;
}

export interface SeriesState {
	[key: string]: Series;
}