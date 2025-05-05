import {defineMessages, useIntl} from "react-intl";

const messages = defineMessages({
	emptyList: {
		id: "EmptyText.emptyList",
		defaultMessage: "There is nothing here yet...",
		description: "Empty text list text"
	}
})

export const EmptyTextList = () => {
	const {formatMessage} = useIntl();

	return <p>{formatMessage(messages.emptyList)}</p>;
}