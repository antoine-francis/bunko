import {BunkoComment} from "./Comment.ts";
import {Author} from "./Author.ts";
import {Genre} from "./Genre.ts";
import {Series} from "./Series.ts";
import {Like} from "./Like.ts";
import {SavedText} from "./SavedText.ts";
import {HttpStatus} from "../constants/Http.ts";

export interface BunkoText {
    hash: string;
	id: number;
	title: string;
	content: string;
	author: Author;
	comments: BunkoComment[];
	genres: Genre[];
	synopsis?: string;
	isDraft: boolean;
	savedBy: SavedText[];
	likes: Like[];
	series?: Series;
	seriesEntry?: number;
	creationDate: Date;
	modificationDate: Date;
	publicationDate: Date;
	bookmarkPosition?: number;
	bookmarkCount?: number;
	loading?: boolean;
	error?: HttpStatus | undefined;
}

export interface TextDescription {
	hash: string;
	title: string;
	author: Author;
	series?: Series;
	seriesEntry?: number;
	synopsis?: string;
	genres: Genre[];
	isDraft: boolean;
	creationDate: Date;
	modificationDate: Date;
	publicationDate: Date;
	bookmarkPosition?: number;
	id: number;
	content?: string;
}

export interface MinimalTextDesc {
	hash: string;
	title: string;
	author: Author;
}

export interface TextListState {
	bookmarks: BunkoText[];
	error?: HttpStatus;
	loading: boolean;
}

export interface TextState {
	[key: string]: BunkoText;
}

export interface EditorContent {
	content: string;
	title: string;
	genres: Genre[];
	isDraft: boolean;
	series?: Series;
	series_entry?: number;
	synopsis?: string;
}

export interface TextEditorState {
	title: string | undefined;
	genres: Genre[],
	content: string;
	isDraft: boolean;
	error?: HttpStatus
	loading: boolean;
	saved: boolean;
	newHash: string | undefined;
}

export interface SearchState {
	query: string;
	searchType: string;
	results: any[];
	error?: HttpStatus | undefined;
	loading: boolean;
}

export interface BookmarkPosition {
	textNode : Node;
	position: number;
}

export interface Bookmark {
	textHash : string;
	position: number;
}