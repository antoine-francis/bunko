import {BunkoText} from "@/types/Text.ts";
import {
	IconBookmark,
	IconBookmarkFilled,
} from "@tabler/icons-react";
import {useCallback} from "react";
import {bookmarkText, unbookmarkText} from "@/slices/TextSlice.ts";
import {useBunkoDispatch} from "@/hooks/redux-hooks.ts";

interface BookmarkButtonProps {
	text: BunkoText;
	bookmarked: boolean;
}

export function BookmarkButton({ bookmarked, text } : BookmarkButtonProps) {
	const dispatch = useBunkoDispatch();

	const handleBookmark = useCallback(() => {
		if (text !== undefined) {
			if (!bookmarked) {
				dispatch(bookmarkText(text));
			} else {
				dispatch(unbookmarkText(text));
			}
		}
	}, [text, dispatch, bookmarked]);

	return (
		<span className="bookmark reactions" onClick={handleBookmark}>
			<span className="bookmark-btn btn">
				{bookmarked ? <IconBookmarkFilled/> : <IconBookmark />}
			</span>
			<span>{text.bookmarkedBy.length}</span>
		</span>
		)
}