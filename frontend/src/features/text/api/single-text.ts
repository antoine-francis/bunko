import {BunkoText, EditorContent} from "@/types/Text.ts";
import {URL} from "@/constants/Url.ts";
import {Like} from "@/types/Like.ts";
import {getCookie} from "@/utils/get-cookie.ts";
import {BunkoComment} from "@/types/Comment.ts";
import {Bookmark} from "@/types/Bookmark.ts";

export const loadText : (id : string) => Promise<BunkoText | undefined> = async (hash) => {
	const response = await fetch(URL.SERVER + URL.TEXT + hash, {
		credentials: 'include',
	});
	if (response.ok) {
		const data = await response.json();
		const text : BunkoText = Object.assign({}, {
			id: data.id,
			hash: data.hash,
			author: data.author,
			content: data.content,
			creationDate: data.creationDate,
			modificationDate: data.modificationDate,
			publicationDate: data.publicationDate,
			title: data.title,
			comments: data.comments,
			genres: data.genres,
			isDraft: data.isDraft,
			bookmarkedBy: data.bookmarkedBy === undefined ? 0 : data.bookmarkedBy,
			likes: data.likes === undefined ? 0 : data.likes,
			series: data.series,
			seriesEntry: data.seriesEntry,
			synopsis: data.synopsis,
		});
		return text;
	} else {
		throw new Error(response.status.toString());
	}
};

export const like = async (text : BunkoText) : Promise<Like> => {
	const response = await fetch(URL.SERVER + URL.LIKE + text.id, {
		method: "POST",
		credentials: "include",
		headers: {
			"Content-Type": "application/json",
			"X-CSRFToken": getCookie("csrftoken"),
		}
	});

	if (response.ok) {
		return await response.json();
	} else {
		throw new Error(response.status.toString());
	}
}

export const unlike = async (text : BunkoText) : Promise<string> => {
	const response = await fetch(URL.SERVER + URL.UNLIKE + text.id, {
		method: "POST",
		credentials: "include",
		headers: {
			"Content-Type": "application/json",
			"X-CSRFToken": getCookie("csrftoken"),
		}
	});
	if (!response.ok) {
		throw new Error(response.status.toString());
	}
	return response.json();
}

export const bookmark = async (text : BunkoText) : Promise<Bookmark> => {
	const response = await fetch(URL.SERVER + URL.BOOKMARK + text.id, {
		method: "POST",
		credentials: "include",
		headers: {
			"Content-Type": "application/json",
			"X-CSRFToken": getCookie("csrftoken"),
		}
	});

	if (response.ok) {
		return await response.json();
	} else {
		throw new Error(response.status.toString());
	}
}

export const unbookmark = async (text : BunkoText) : Promise<string> => {
	const response = await fetch(URL.SERVER + URL.UNBOOKMARK + text.id, {
		method: "POST",
		credentials: "include",
		headers: {
			"Content-Type": "application/json",
			"X-CSRFToken": getCookie("csrftoken"),
		}
	});
	if (!response.ok) {
		throw new Error(response.status.toString());
	}
	return response.json();
}

export const postComment = async (content : string, textId: number, parent: number | undefined = undefined) : Promise<BunkoComment> => {
	const response = await fetch(URL.SERVER + URL.COMMENT, {
		body: JSON.stringify({content, textId, parent}),
		method: "POST",
		credentials: "include",
		headers: {
			"Content-Type": "application/json",
			"X-CSRFToken": getCookie("csrftoken"),
		}
	});
	if (!response.ok) {
		throw new Error(response.status.toString());
	}
	return response.json();
}

export const createNewText = async (editorContent: EditorContent) : Promise<BunkoText> => {
	const response = await fetch(URL.SERVER + URL.NEW_TEXT, {
		body: JSON.stringify(editorContent),
		method: "POST",
		credentials: "include",
		headers: {
			"Content-Type": "application/json",
			"X-CSRFToken": getCookie("csrftoken"),
		}
	});
	if (!response.ok) {
		throw new Error(response.status.toString());
	}
	return response.json();
}

export const updateExistingText = async (text: BunkoText) : Promise<BunkoText> => {
	const response = await fetch(URL.SERVER + URL.TEXT + text.hash, {
		body: JSON.stringify(text),
		method: "PUT",
		credentials: "include",
		headers: {
			"Content-Type": "application/json",
			"X-CSRFToken": getCookie("csrftoken"),
		}
	});
	if (!response.ok) {
		throw new Error(response.status.toString());
	}
	return response.json();
}

export const deleteSingleText = async (text : BunkoText) : Promise<BunkoText> => {
	const response = await fetch(URL.SERVER + URL.TEXT + text.hash, {
		body: JSON.stringify(text),
		method: "DELETE",
		credentials: "include",
		headers: {
			"Content-Type": "application/json",
			"X-CSRFToken": getCookie("csrftoken"),
		}
	});
	if (!response.ok) {
		throw new Error(response.status.toString());
	}
	return response.json();
}