import {BunkoComment} from "../../types/Comment.ts";
import {paths} from "../../config/paths.ts";
import {Link} from "react-router-dom";
import TimeAgo from "timeago-react";

interface CommentProps {
	comment: BunkoComment;
}

export function Comment({comment}: CommentProps) {
	return (
		<>
			<div className="comment-meta">
				<Link to={`${paths.profile.getHref()}${comment.author.username}`}>
					<span className="comment-author">{comment.author.username} </span>
				</Link>
				<span className="comment-date"><TimeAgo datetime={comment.creationDate}/></span>
			</div>
			<div className="comment">{comment.content}</div>
			<span className="reply-btn btn">💬</span>
		</>
	)
}