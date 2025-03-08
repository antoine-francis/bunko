import {Author} from "./Author.ts";
import {UserBadge} from "@/types/UserProfile.ts";

export interface BunkoComment {
	id: number;
	content: string;
	creationDate: Date;
	modificationDate?: Date;
	author: Author;
	replies?: BunkoComment[];
	parentId?: number;
	likes: CommentLike[];
	text: string; // text hash
}

export interface CommentLike {
	comment: BunkoComment;
	user: UserBadge;
	likedDate: Date;
}

export interface CommentPost {
	content: string;
	textId: number;
	parent: number | undefined;
}

export interface DeleteComment {
	id: number;
	username: string;
	text: string;
	parent: number | undefined;
}

export interface CommentState {
	replyTo: BunkoComment | undefined;
}