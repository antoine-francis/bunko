import {BunkoText, TextDescription} from "../../types/Text.ts";

export const convertTextToDesc = (text : BunkoText) : TextDescription => {
	return {
		hash: text.hash,
		title: text.title,
		id: text.id,
		content: text.content,
		author: text.author,
		series: text.series,
		seriesEntry: text.seriesEntry,
		isDraft: text.isDraft,
		creationDate: text.creationDate,
		modificationDate: text.modificationDate,
		publicationDate: text.publicationDate,
	}
}