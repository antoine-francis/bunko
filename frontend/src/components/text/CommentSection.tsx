import {BunkoComment} from "../../types/Comment.ts";
import React, {ChangeEvent, useCallback, useState} from "react";
import {Comment} from "./Comment.tsx";
import {defineMessages, useIntl} from "react-intl";
import {comment} from "../../slices/TextSlice.ts";
import {useBunkoDispatch} from "../../hooks/redux-hooks.ts";

const messages = defineMessages({
	placeholder: {
		id: "placeholder",
		defaultMessage: "Add a comment",
		description: "placeholder text",
	}
})

interface CommentSectionProps {
	comments: BunkoComment[];
	textId: number;
}

export function CommentSection({comments, textId} : CommentSectionProps ) {
	const [newComment, setNewComment] = useState("");
	const {formatMessage} = useIntl();
	const dispatch = useBunkoDispatch();

	const getCommentCount = useCallback(() => {
		let count = 0;
		for (const comment of comments) {
			count++;
			if (comment.replies) {
				count += comment.replies.length
			}
		}
		return count;
	}, [comments]);

	const commentCount = getCommentCount();

	const handleSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		dispatch(comment({content: newComment, textId: textId, parent: undefined}))
		setNewComment("");
	}, [newComment, dispatch, textId]);

	return (
		<div className="comments-container">
			<hr/>
			<p>Showing {commentCount} comment{commentCount > 1 && "s"}</p>
			{comments.map((comment: BunkoComment) => {
				return (<React.Fragment key={comment.id}>
						<Comment comment={comment}/>
						{comment.replies && (
							<div className="replies">
								{comment.replies.map((reply: BunkoComment) => {
									return (
										<Comment comment={reply} key={reply.id}/>
									)
								})}
							</div>
						)}
					</React.Fragment>
				);
			})}
			<form id="new-comment" onSubmit={handleSubmit}>
				<div>
					<textarea
						value={newComment}
						placeholder={formatMessage(messages.placeholder)}
						onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setNewComment(e.target.value)}
						required
					/>
				</div>
				<button type="submit">Comment</button>
			</form>
		</div>);
}
