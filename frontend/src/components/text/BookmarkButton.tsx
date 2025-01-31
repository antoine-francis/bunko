import {BunkoText} from "../../types/Text.ts";
import {
	IconBookmark,
	IconBookmarkFilled,
} from "@tabler/icons-react";

interface BookmarkButtonProps {
	onClick: () => void;
	text: BunkoText;
	bookmarked: boolean;
}

export function BookmarkButton({ onClick, bookmarked, text } : BookmarkButtonProps) {
	return (
		<span className="bookmark reactions">
			<span className="bookmark-btn btn" onClick={onClick}>
				{bookmarked ? <IconBookmarkFilled/> : <IconBookmark />}
			</span>
			<span>{text.bookmarkedBy.length}</span>
		</span>
		)
}