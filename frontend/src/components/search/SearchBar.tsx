import {ChangeEvent, useCallback, useEffect, useState} from "react";
import {defineMessages, useIntl} from "react-intl";
import {useBunkoDispatch} from "@/hooks/redux-hooks.ts";
import {resetSearchBar, searchTags} from "@/slices/BrowseTagsSlice.ts";
import {IconX} from "@tabler/icons-react";

const messages = defineMessages({
	searchTitles: {
		id: "menubar.searchTitles",
		description: "Menu bar button",
		defaultMessage: "Search titles",
	},
	searchAuthors: {
		id: "menubar.searchAuthors",
		description: "Menu bar button",
		defaultMessage: "Search authors",
	},
	searchTags: {
		id: "menubar.searchTags",
		description: "Menu bar button",
		defaultMessage: "Search tags",
	},
	clearSearch: {
		id: "menubar.clearSearch",
		description: "Menu bar button",
		defaultMessage: "Clear",
	}
})

export function SearchBar() {
	const {formatMessage} = useIntl();
	const dispatch = useBunkoDispatch();
	const [searchVal, setSearchVal] = useState("");
	const [debounceValue, setDebouncedValue] = useState("");

	useEffect(() => {
		const timeoutId : ReturnType<typeof setTimeout> = setTimeout(() => {
			setDebouncedValue(searchVal);
			if (debounceValue !== "") {
				dispatch(searchTags(debounceValue));
			} else {
				dispatch(resetSearchBar());
			}
		}, 300);
		return () => clearTimeout(timeoutId);
	}, [searchVal, debounceValue, dispatch]);

	const handleChange = useCallback((e : ChangeEvent<HTMLInputElement>) => {
		setSearchVal(e.target.value);
	}, [])

	return (
		<>
		<input id="search-bar" type="text" placeholder={formatMessage(messages.searchTags)} value={searchVal}
				  onChange={handleChange}/>
			{searchVal !== "" && <div id="clear-input" onClick={() => {
				setSearchVal("");
			}}><IconX title={formatMessage(messages.clearSearch)}/></div>}
		</>
	);
}