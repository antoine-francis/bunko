import {BunkoText, EditorContent} from "@/types/Text.ts";
import {URL} from "@/constants/Url.ts";
import {Like} from "@/types/Like.ts";
import {getCookie} from "@/utils/get-cookie.ts";
import {BunkoComment, CommentLike} from "@/types/Comment.ts";
import {SavedText} from "@/types/SavedText.ts";

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
			savedBy: data.savedBy === undefined ? 0 : data.savedBy,
			likes: data.likes === undefined ? 0 : data.likes,
			series: data.series,
			seriesEntry: data.seriesEntry,
			synopsis: data.synopsis,
			bookmarkPosition: data.bookmarkPosition,
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

export const likeCommentReq = async (comment : BunkoComment) : Promise<CommentLike> => {
	const response = await fetch(URL.SERVER + URL.LIKE_COMMENT + comment.id, {
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

export const unlikeCommentReq = async (comment : BunkoComment) : Promise<string> => {
	const response = await fetch(URL.SERVER + URL.UNLIKE_COMMENT + comment.id, {
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

export const save = async (text : BunkoText) : Promise<SavedText> => {
	const response = await fetch(URL.SERVER + URL.SAVE + text.id, {
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

export const unsave = async (text : BunkoText) : Promise<string> => {
	const response = await fetch(URL.SERVER + URL.UNSAVE + text.id, {
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

export const deleteCommentReq = async (id : number, text: string, username : string, parent : number | undefined) : Promise<void> => {
	const response = await fetch(URL.SERVER + URL.DELETE_COMMENT, {
		body: JSON.stringify({id, text, username, parent}),
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

export const setBookmarkPosition  = async (position: number, textHash : string) : Promise<void> => {
	const response = await fetch(URL.SERVER + URL.BOOKMARK, {
		body: JSON.stringify({textHash, position}),
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
}