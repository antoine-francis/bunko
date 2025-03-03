import React, {ChangeEvent, useCallback, useState} from "react";
import {BunkoComment} from "@/types/Comment.ts";
import {BunkoText} from "@/types/Text.ts";
import {defineMessages, useIntl} from "react-intl";
import {comment} from "@/slices/TextSlice.ts";
import {useBunkoDispatch} from "@/hooks/redux-hooks.ts";
import {toggleReply} from "@/slices/CommentsSlice.ts";

const messages = defineMessages({
	placeholder: {
		id: "placeholder",
		defaultMessage: "Add a comment…",
		description: "placeholder text",
	},
	replyTo: {
		id: "replyTo",
		defaultMessage: "Reply to {1}…",
		description: "placeholder text",
	}
})

interface CommentTextBoxProps {
	text: BunkoText;
	replyToComment?: BunkoComment;
	replyParent?: number;
}

export function CommentTextBox({text, replyToComment, replyParent} : CommentTextBoxProps) {
	const dispatch = useBunkoDispatch();
	const [newComment, setNewComment] = useState("");
	const {formatMessage} = useIntl();

	const handleSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const parentComment = replyParent !== undefined
			? replyParent : replyToComment !== undefined ? replyToComment.id : undefined;
		dispatch(comment({content: newComment, textId: text.id, parent: parentComment}))
		setNewComment("");
		dispatch(toggleReply(undefined));
	}, [newComment, dispatch, text]);

	return (
		<form id="new-comment" onSubmit={handleSubmit}>
			<div>
				<textarea
					id="new-comment-textarea"
					value={newComment}
					onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setNewComment(e.target.value)}
					placeholder={replyToComment !== undefined ?
						formatMessage(messages.replyTo, {1: replyToComment.author.username}) : formatMessage(messages.placeholder)}
					required
				/>
			</div>
			<div className="button-wrapper">
				<button type="submit">Comment</button>
				{replyToComment !== undefined && (<button onClick={() => dispatch(toggleReply(undefined))} className="destructive-action">Cancel</button>)}
			</div>
		</form>
	);
}