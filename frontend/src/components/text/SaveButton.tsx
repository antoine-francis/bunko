import {BunkoText} from "@/types/Text.ts";
import {
	IconBookmark,
	IconBookmarkFilled,
} from "@tabler/icons-react";
import {useCallback} from "react";
import {saveText, unsaveText} from "@/slices/TextSlice.ts";
import {useBunkoDispatch} from "@/hooks/redux-hooks.ts";

interface SaveButtonProps {
	text: BunkoText;
	saved: boolean;
}

export function SaveButton({ saved, text } : SaveButtonProps) {
	const dispatch = useBunkoDispatch();

	const handleSave = useCallback(() => {
		if (text !== undefined) {
			if (!saved) {
				dispatch(saveText(text));
			} else {
				dispatch(unsaveText(text));
			}
		}
	}, [text, dispatch, saved]);

	return (
		<span className="saved reactions" onClick={handleSave}>
			<span className="save-btn btn">
				{saved ? <IconBookmarkFilled/> : <IconBookmark />}
			</span>
			<span>{text.savedBy.length}</span>
		</span>
		)
}