import {BunkoText} from "../../types/Text.ts";

interface BookmarkButtonProps {
	onClick: () => void;
	text: BunkoText;
	bookmarked: boolean;
}

export function BookmarkButton({ onClick, bookmarked, text } : BookmarkButtonProps) {
	return (
		<span className="bookmarks reactions">
			<span className="bookmark-btn btn" onClick={onClick}>
				{bookmarked ? "★ " : "☆ "}
			</span>
			{text.bookmarkedBy.length}
		</span>
		)
}