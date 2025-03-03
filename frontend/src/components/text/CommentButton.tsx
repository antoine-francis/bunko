import {BunkoText} from "@/types/Text.ts";
import {IconMessage} from "@tabler/icons-react";
import {useCallback} from "react";
import {useBunkoDispatch} from "@/hooks/redux-hooks.ts";
import {useNavigate} from "react-router-dom";
import {paths} from "@/config/paths.ts";
import {BunkoComment} from "@/types/Comment.ts";
import {toggleReply} from "@/slices/CommentsSlice.ts";
import {useCommentCount} from "@/hooks/comments-hooks.ts";

interface CommentButtonProps {
	text: BunkoText;
	comment?: BunkoComment;
	isReply?: boolean;
}

export function CommentButton({text, comment, isReply = false} : CommentButtonProps) {
	const dispatch = useBunkoDispatch();
	const navigate = useNavigate();
	const commentCount = useCommentCount(text.comments);

	const handleComment = useCallback(() => {
		if (text !== undefined) {
			if (isReply && comment !== undefined) {
				navigate(`#comment-${comment.id}`);
				dispatch(toggleReply(comment));
			} else {
				navigate(paths.singleText.getHref() + text.hash + "#comments-container");
			}
		}
	}, [text, navigate, dispatch])

	return (
		<span className="comment reactions" onClick={handleComment}>
			<span data-comment-id={comment !== undefined && comment.id} className="comment-btn btn">
				<IconMessage/>
			</span>
			{!isReply && commentCount}
		</span>
	)
}