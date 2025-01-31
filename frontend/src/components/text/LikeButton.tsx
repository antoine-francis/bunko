import {BunkoText} from "../../types/Text.ts";
import {IconHeart, IconHeartFilled} from "@tabler/icons-react";

interface LikeButtonProps {
	onClick: () => void;
	text: BunkoText;
	liked: boolean;
}

export function LikeButton({onClick, liked, text} : LikeButtonProps) {
	return (
		<span className="like reactions">
			<span className="like-btn btn" onClick={onClick}>
				{liked ? <IconHeartFilled/> : <IconHeart/>}
			</span>
			{text.likes.length}
		</span>
	)
}