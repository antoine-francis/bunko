import {TextsList} from "@/components/texts-list/TextsList.tsx";
import {BunkoText} from "@/types/Text.ts";
import {defineMessages, useIntl} from "react-intl";

const messages = defineMessages({
	continueReading: {
		id: "text.continueReading",
		description: "label for bookmark list",
		defaultMessage: "Continue reading",
	},
});

interface ContinueReadingBarProps {
	bookmarks: BunkoText[];
}

export const ContinueReadingBar = ({bookmarks} : ContinueReadingBarProps) => {
	const {formatMessage} = useIntl();

	if (bookmarks.length > 0) {
		return (
			<div id="continue-reading">
				<span className="label">{formatMessage(messages.continueReading)}</span>
				<TextsList texts={bookmarks} showSeries={true} showDescription={false} showAuthor={true}/>
			</div>
		)
	}
	return null;
}