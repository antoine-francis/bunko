import {BunkoText} from "../../types/Text.ts";

interface LikeButtonProps {
	onClick: () => void;
	text: BunkoText;
	liked: boolean;
}

export function LikeButton({onClick, liked, text} : LikeButtonProps) {
	return (
		<span className="like reactions">
			<span className="like-btn btn" onClick={onClick}>
				{liked ? "♥ " : "♡ "}
			</span>
			{text.likes.length}
		</span>
	)
}