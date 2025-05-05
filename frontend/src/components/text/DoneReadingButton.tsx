import {useCallback} from "react";
import {defineMessages, useIntl} from "react-intl";
import {setBookmark} from "@/slices/TextSlice.ts";
import {C} from "@/constants/Constants.ts";
import {BunkoText} from "@/types/Text.ts";
import {useBunkoDispatch} from "@/hooks/redux-hooks.ts";

const messages = defineMessages({
	doneReading: {
		id: "text.doneReading",
		description: "button",
		defaultMessage: "Done",
	}
})

interface DoneReadingButtonProps {
	text: BunkoText;
	position?: number;
}

export const DoneReadingButton = ({text, position} : DoneReadingButtonProps) => {
	const {formatMessage} = useIntl();
	const dispatch = useBunkoDispatch();

	const finishReading = useCallback(() => {
		if (text !== undefined) {
			dispatch(setBookmark({position: C.READING_COMPLETE, textHash: text.hash}));
		}
	}, [text])

	return (
		<button onClick={finishReading}
				id="done-reading"
				className={position !== undefined && position === -1 ? "finished" : ""}>
			{formatMessage(messages.doneReading)}
		</button>
	)
}