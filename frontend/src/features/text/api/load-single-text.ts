import {BunkoText} from "../../../types/Text.ts";

export const loadText : (id : string) => Promise<BunkoText | undefined> = async (id) => {
	const response = await fetch("http://localhost:8000/text/" + id, {
		credentials: 'include',
	});
	if (response.ok) {
		const data = await response.json();
		const text : BunkoText = Object.assign({}, {
			author: data.author,
			content: data.content,
			creationDate: data.creationDate,
			title: data.title,
			comments: data.comments,
			genres: data.genres,
			isDraft: data.isDraft,
			bookmarkedBy: data.bookmarkedBy === undefined ? 0 : data.bookmarkedBy,
			likes: data.likes === undefined ? 0 : data.likes,
			series: data.series,
			seriesEntry: data.seriesEntry
		});
		return text;
	} else {
		throw new Error(response.status.toString());
	}
};