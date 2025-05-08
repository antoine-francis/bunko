import {Author} from "@/types/Author.ts";
import {BunkoText, TextDescription} from "@/types/Text.ts";
import {Series} from "@/types/Series.ts";

export const getSeriesAuthors = (series : Series) : Author[] => {
	if (series !== undefined && series.entries !== undefined && series.entries.length > 0) {
		return series.entries.map((entry : TextDescription, index : number, self : BunkoText[]) => {
			if (index === self.findIndex((t : BunkoText) => t.author.username === entry.author.username)) {
				return entry.author;
			}
		}).filter((entry : Author | undefined) => entry !== undefined)
	} else {
		return [];
	}
}

export const getReaderCount = (series : Series) : number => {
	let readerCount = 0;
	if (series.entries !== undefined && series.entries.length > 0) {
		for (const entry of series.entries) {
			if (entry.bookmarkCount !== undefined) {
				readerCount += entry.bookmarkCount;
			}
		}
	}
	return readerCount;
}