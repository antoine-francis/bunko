import {Author} from "./Author.ts";

export interface BunkoComment {
	id: number;
	content: string;
	creationDate: Date;
	modificationDate?: Date;
	author: Author;
	parentComment?: number;
}