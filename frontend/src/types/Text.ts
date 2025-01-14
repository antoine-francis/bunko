import {BunkoComment} from "./Comment.ts";
import {Author} from "./Author.ts";
import {Genre} from "./Genre.ts";
import {Series} from "./Series.ts";
import {Like} from "./Like.ts";
import {Bookmark} from "./Bookmark.ts";
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
	bookmarkedBy: Bookmark[];
	likes: Like[];
	series?: Series;
	seriesEntry?: number;
	creationDate: Date;
	modificationDate: Date;
	publicationDate: Date;
	loading?: boolean;
	error?: HttpStatus | undefined;
}

export interface TextDescription {
	hash: string;
	title: string;
	author: Author;
	series?: Series;
	seriesEntry?: number;
	isDraft: boolean;
	creationDate: Date;
	modificationDate: Date;
	publicationDate: Date;
	id: number;
	content?: string;
}

export interface TextListState {
	texts: BunkoText[];
	error?: HttpStatus;
	loaded: boolean;
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
	// showAlert: boolean;
	// alertType: string | undefined;
	title: string | undefined;
	genres: Genre[],
	content: string;
	isDraft: boolean;
	error?: HttpStatus
	loading: boolean;
	saved: boolean;
	newHash: string | undefined;
}

export interface DraftState {
	isDraft: boolean;
	hash: string;
}