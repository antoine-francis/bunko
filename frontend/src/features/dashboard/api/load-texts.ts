import {BunkoText} from "../../../types/Text.ts";
import {Series} from "../../../types/Series.ts";

export const loadTexts : () => Promise<BunkoText[]> = async () => {
	try {
		const response = await fetch("http://localhost:8000/texts/antoinefrancis", {
			headers: {
				Cookie: "sessionid=owtt56ms9uvyq60gdghetb3z0cwoayjf;csrftoken=eLjJjD5rx4xTfwjla1NjUS1RIUmV8T28"
			},
			credentials: 'same-origin',
		});
		if (response.ok) {
			return await response.json();
		}
	} catch (exception) {
		console.log(exception);
	}
};

export const loadSeries : (id : string) => Promise<Series> = async (id : string) => {
	try {
		const response = await fetch("http://localhost:8000/series_id/" + id, {
			headers: {
				Cookie: "sessionid=owtt56ms9uvyq60gdghetb3z0cwoayjf;csrftoken=eLjJjD5rx4xTfwjla1NjUS1RIUmV8T28"
			},
			credentials: 'same-origin',
		});
		if (response.ok) {
			return await response.json();
		}
	} catch (exception) {
		console.log(exception);
	}
};