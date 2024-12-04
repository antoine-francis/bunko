import {BunkoText} from "../../types/Text.ts";

export const loadText : (id : string) => Promise<BunkoText | undefined> = async (id) => {
	try {
		const response = await fetch("http://localhost:8000/text/" + id, {
			headers: {
				Cookie: "sessionid=owtt56ms9uvyq60gdghetb3z0cwoayjf;csrftoken=eLjJjD5rx4xTfwjla1NjUS1RIUmV8T28"
			},
			credentials: 'same-origin',
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
		}
	} catch (exception) {
		console.error(exception);
		throw new Error(`Could not load single text with id ${id}`);
	}
};