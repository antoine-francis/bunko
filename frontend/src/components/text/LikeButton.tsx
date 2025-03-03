import {BunkoText} from "@/types/Text.ts";
import {IconHeart, IconHeartFilled} from "@tabler/icons-react";
import {useCallback} from "react";
import {likeText, unlikeText} from "@/slices/TextSlice.ts";
import {useBunkoDispatch} from "@/hooks/redux-hooks.ts";

interface LikeButtonProps {
	text: BunkoText;
	liked: boolean;
}

export function LikeButton({liked, text} : LikeButtonProps) {
	const dispatch = useBunkoDispatch();

	const handleLike = useCallback(() => {
		if (text !== undefined) {
			if (!liked) {
				dispatch(likeText(text));
			} else {
				dispatch(unlikeText(text));
			}
		}
	}, [text, dispatch, liked])

	return (
		<span className="like reactions" onClick={handleLike}>
			<span className="like-btn btn">
				{liked ? <IconHeartFilled/> : <IconHeart/>}
			</span>
			{text.likes.length}
		</span>
	)
}