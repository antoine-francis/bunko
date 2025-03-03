import {SearchBar} from "./SearchBar.tsx";
import {useBunkoSelector} from "@/hooks/redux-hooks.ts";
import {SearchResults} from "./SearchResults.tsx";

export function Search() {
	const {searchBarText} = useBunkoSelector((state) => state.browseTags.tagSearch);

	return (
		<div className="search-bar-container">
			<SearchBar/>
			{searchBarText !== "" && <SearchResults/>}
		</div>
	)
}