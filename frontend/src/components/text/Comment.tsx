import {BunkoComment, CommentLike} from "@/types/Comment.ts";
import {paths} from "@/config/paths.ts";
import {Link} from "react-router-dom";
import TimeAgo from "timeago-react";
import {CommentButton} from "./CommentButton.tsx";
import {BunkoText} from "@/types/Text.ts";
import {useBunkoSelector} from "@/hooks/redux-hooks.ts";
import {CommentTextBox} from "./CommentTextBox.tsx";
import {URL} from "@/constants/Url.ts";
import {Dropdown} from "@/components/util/Dropdown.tsx";
import {ReactNode, useCallback} from "react";
import {IconAlertTriangle, IconForbid2, IconTrash} from "@tabler/icons-react";
import {defineMessages, useIntl} from "react-intl";
import React from "react";
import {CommentLikeButton} from "@/components/text/CommentLikeButton.tsx";

const messages = defineMessages({
	delete: {
		id: "delete",
		description: "dropdown button",
		defaultMessage: "Delete",
	},
	report: {
		id: "report",
		description: "dropdown button",
		defaultMessage: "Report",
	},
	block: {
		id: "block",
		description: "dropdown button",
		defaultMessage: "Block {1}",
	}
})

interface CommentProps {
	comment: BunkoComment;
	text: BunkoText;
	parentId?: number;
}

export function Comment({comment, text, parentId = undefined}: CommentProps) {
	const {replyTo} = useBunkoSelector(state => state.comments)
	const {user} = useBunkoSelector((state) => state.currentUser);
	const {formatMessage} = useIntl();

	const getDropdownContent = useCallback(() => {
		const items : ReactNode[] = [];
		if (user !== undefined && comment.author.username === user.username) {
			items.push(
				<React.Fragment key={"action-1" + comment.id}>
					<IconTrash/>
					<div className="nav-btn" onClick={() => {}}>
						{formatMessage(messages.delete)}
					</div>
				</React.Fragment>
			);
		} else {
			items.push(
				<React.Fragment key={"action-0" + comment.id}>
					<IconAlertTriangle />
					<div className="nav-btn" onClick={() => {}}>
						{formatMessage(messages.report)}
					</div>
				</React.Fragment>
			);
			items.push(
				<React.Fragment key={"action-1" + comment.id}>
					<IconForbid2 style={{rotate: "45deg"}}/>
					<div className="nav-btn" onClick={() => {}}>
						{formatMessage(messages.block, {1: comment.author.username})}
					</div>
				</React.Fragment>
			);
		}
		return items;
	}, [comment, formatMessage, user])

	const isLiked = useCallback(() => {
		const likes = comment.likes;
		return (likes.find((like : CommentLike) => {return user !== undefined && like.user.username === user.username;}) !== undefined);
	}, [comment, text, parentId])

	return (
		<>
			<div className="comment-item" id={"comment-" + comment.id.toString()}>
				<img className="mini-profile-pic" src={`${URL.SERVER}${comment.author.picture}`} alt=""/>
				<div className="comment-wrapper">
					<div className="comment-header">
						<div className="comment-meta">
							<Link to={`${paths.profile.getHref()}${comment.author.username}`}>
								<span className="comment-author">{comment.author.username} </span>
							</Link>
							<span className="comment-date"><TimeAgo className="comment-timestamp" live={false}
																	datetime={comment.creationDate}/></span>
						</div>
						<Dropdown items={getDropdownContent()} align={"end"}/>
					</div>
					<div className="comment-content">{comment.content}</div>
					{replyTo !== undefined && replyTo.id === comment.id ?
						<CommentTextBox text={text} replyToComment={replyTo} replyParent={parentId}/> :
						<div className="reactions">
							<CommentLikeButton comment={comment} liked={isLiked()}/>
							<CommentButton text={text} comment={comment} isReply={true}/>
						</div>}
				</div>
			</div>
			{comment.replies && (
				<div className="replies">
					{comment.replies.map((reply: BunkoComment) => {
						return (
							<Comment comment={reply} text={text} parentId={comment.id} key={reply.id} />
						)
					})}
				</div>
			)}
		</>
	)
}