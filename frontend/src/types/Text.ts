import {BunkoComment} from "./Comment.ts";
import {Author} from "./Author.ts";
import {Genre} from "./Genre.ts";
import {Series} from "./Series.ts";
import {Like} from "./Like.ts";
import {Bookmark} from "./Bookmark.ts";

export interface BunkoText {
	id?: number;
	title: string;
	content: string;
	author: Author;
	comments: BunkoComment[];
	genres: Genre[];
	isDraft: boolean;
	bookmarkedBy: Bookmark[];
	likes: Like[];
	series: Series;
	seriesEntry: number;
}

export interface TextDescription {
	title: string;
	author: Author;
	series: Series;
	seriesEntry: number;
}