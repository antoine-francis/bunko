import {BunkoComment} from "@/types/Comment.ts";
import {paths} from "@/config/paths.ts";
import {Link} from "react-router-dom";
import TimeAgo from "timeago-react";
import {CommentButton} from "./CommentButton.tsx";
import {BunkoText} from "@/types/Text.ts";
import {useBunkoSelector} from "@/hooks/redux-hooks.ts";
import {CommentTextBox} from "./CommentTextBox.tsx";
import {URL} from "@/constants/Url.ts";

interface CommentProps {
	comment: BunkoComment;
	text: BunkoText;
	parentId?: number;
}

export function Comment({comment, text, parentId = undefined}: CommentProps) {
	const {replyTo} = useBunkoSelector(state => state.comments)

	return (
		<>
			<div className="comment-item" id={"comment-" + comment.id.toString()}>
				<img className="mini-profile-pic" src={`${URL.SERVER}${comment.author.picture}`} alt=""/>
				<div className="comment-wrapper">
					<div className="comment-meta">
						<Link to={`${paths.profile.getHref()}${comment.author.username}`}>
							<span className="comment-author">{comment.author.username} </span>
						</Link>
						<span className="comment-date"><TimeAgo className="comment-timestamp" live={false}
																datetime={comment.creationDate}/></span>
					</div>
					<div className="comment-content">{comment.content}</div>
					{replyTo !== undefined && replyTo.id === comment.id ?
						<CommentTextBox text={text} replyToComment={replyTo} replyParent={parentId}/> :
						<CommentButton text={text} comment={comment} isReply={true}/>}
				</div>
			</div>
			{comment.replies && (
				<div className="replies">
					{comment.replies.map((reply: BunkoComment) => {
						return (
							<Comment comment={reply} text={text} parentId={comment.id} key={reply.id}/>
						)
					})}
				</div>
			)}
		</>
	)
}