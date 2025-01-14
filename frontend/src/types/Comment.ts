import {Author} from "./Author.ts";

export interface BunkoComment {
	id: number;
	content: string;
	creationDate: Date;
	modificationDate?: Date;
	author: Author;
	replies?: BunkoComment[];
	text: string; // text hash
}

export interface CommentPost {
	content: string;
	textId: number;
	parent: number | undefined;
}