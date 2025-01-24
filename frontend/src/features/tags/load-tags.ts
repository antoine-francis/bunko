import {URL} from "../../constants/Url.ts";
import {Genre} from "../../types/Genre.ts";

export const loadTags : () => Promise<Genre[]> = async () : Promise<Genre[]> => {
	const response = await fetch(URL.SERVER + URL.TAGS, {
		credentials: 'include',
	});
	if (response.ok) {
		return await response.json();
	} else {
		throw new Error(response.status.toString());
	}
};