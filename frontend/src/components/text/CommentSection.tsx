import {BunkoComment} from "@/types/Comment.ts";
import React from "react";
import {Comment} from "./Comment.tsx";
import {BunkoText} from "@/types/Text.ts";
import {CommentTextBox} from "./CommentTextBox.tsx";


interface CommentSectionProps {
	comments: BunkoComment[];
	text: BunkoText;
}

export function CommentSection({comments, text} : CommentSectionProps ) {

	return (
		<div id="comments-container">
			<hr/>
			{comments.map((comment: BunkoComment) => {
				const isLiked : boolean = comment.author !== undefined ? comment.likes !== undefined && comment.likes.filter((like) => {
					return like.user.username === comment.author.username
				}).length > 0 : false;
				return (
					<React.Fragment key={comment.id}>
							<Comment comment={comment} text={text}/>
					</React.Fragment>
			);
			})}
				<CommentTextBox text={text}/>
			</div>)
				;
			}
