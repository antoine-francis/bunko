import {BunkoComment} from "../types/Comment.ts";

export const useCommentCount = (comments : BunkoComment[]) : number => {
	let count = 0;
	for (const comment of comments) {
		count++;
		if (comment.replies) {
			count += comment.replies.length
		}
	}
	return count;
}