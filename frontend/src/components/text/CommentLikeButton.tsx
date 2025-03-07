import {IconHeart, IconHeartFilled} from "@tabler/icons-react";
import {useCallback} from "react";
import {likeComment, unlikeComment} from "@/slices/TextSlice.ts";
import {useBunkoDispatch} from "@/hooks/redux-hooks.ts";
import {BunkoComment} from "@/types/Comment.ts";

interface CommentLikeButtonProps {
	comment: BunkoComment;
	liked: boolean;
}

export function CommentLikeButton({liked, comment} : CommentLikeButtonProps) {
	const dispatch = useBunkoDispatch();

	const handleLike = useCallback(() => {
		if (comment !== undefined) {
			if (!liked) {
				dispatch(likeComment(comment));
			} else {
				dispatch(unlikeComment(comment));
			}
		}
	}, [comment, dispatch, liked])

	return (
		<span className="like reactions" onClick={handleLike}>
			<span className="like-btn btn">
				{liked ? <IconHeartFilled/> : <IconHeart/>}
			</span>
			{comment.likes && comment.likes.length > 0 && comment.likes.length}
		</span>
	)
}