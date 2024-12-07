import {BunkoText} from "../../../types/Text.ts";
import {Series} from "../../../types/Series.ts";

export const loadTexts : () => Promise<BunkoText[]> = async () => {
	const response = await fetch("http://localhost:8000/texts", {
		credentials: 'include',
	});
	if (response.ok) {
		return await response.json();
	} else {
		throw new Error(response.status.toString());
	}
};

export const loadSeries : (id : string) => Promise<Series> = async (id : string) => {
	const response = await fetch("http://localhost:8000/series_id/" + id, {
		credentials: 'include',
	});
	if (response.ok) {
		return await response.json();
	} else {
		throw new Error(response.status.toString());
	}
};