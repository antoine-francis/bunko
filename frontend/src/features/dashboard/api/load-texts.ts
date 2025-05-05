import {BunkoText} from "@/types/Text.ts";
import {Series} from "@/types/Series.ts";
import {URL} from "@/constants/Url.ts";

export const loadTexts : () => Promise<{feed: BunkoText[], bookmarks: BunkoText[]}> = async () => {
	const response = await fetch(URL.SERVER + URL.TEXTS, {
		credentials: 'include',
	});
	if (response.ok) {
		return await response.json();
	} else {
		throw new Error(response.status.toString());
	}
};

export const loadTextsByTag : (tag : string) => Promise<BunkoText[]> = async (tag : string) => {
	const response = await fetch(URL.SERVER + URL.TAG + tag, {
		credentials: 'include',
	});
	if (response.ok) {
		return await response.json();
	} else {
		throw new Error(response.status.toString());
	}
};

export const loadSeries : (id : string) => Promise<Series> = async (id : string) => {
	const response = await fetch(URL.SERVER + URL.SERIES + id, {
		credentials: 'include',
	});
	if (response.ok) {
		return await response.json();
	} else {
		throw new Error(response.status.toString());
	}
};