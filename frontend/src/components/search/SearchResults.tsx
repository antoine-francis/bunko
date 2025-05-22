import {useBunkoDispatch, useBunkoSelector} from "@/hooks/redux-hooks.ts";
import {Genre} from "@/types/Genre.ts";
import {Loading} from "../Loading.tsx";
import {ErrorHandler} from "../ErrorHandler.tsx";
import {Link, useLocation} from "react-router-dom";
import React, {useCallback, useEffect, useState} from "react";
import {defineMessages, useIntl} from "react-intl";
import {paths} from "@/config/paths.ts";
import {IconHash, IconTypography, IconUser} from "@tabler/icons-react";
import {C} from "@/constants/Constants.ts";
import {searchTags} from "@/slices/BrowseTagsSlice.ts";
import {changeSearchType, searchTitles} from "@/slices/SearchSlice.ts";
import {TextDescription} from "@/types/Text.ts";

const messages = defineMessages({
	noResultFound: {
		id: "search.noResultFound",
		description: "search results text",
		defaultMessage: "No result found for ''{1}''"
	},
	resultCount: {
		id: "search.resultCount",
		description: "search results text",
		defaultMessage: "{count, plural, one {{count} result} other {{count} results}}",
	},
	// resultCountSing: {
	// 	id: "search.resultCountSing",
	// 	description: "search results text",
	// 	defaultMessage: "{1} result"
	// },
	// resultCountPlur: {
	// 	id: "search.resultCountPlur",
	// 	description: "search results text",
	// 	defaultMessage: "{1} results"
	// },
	users: {
		id: "search.users",
		description: "search results text",
		defaultMessage: "Users"
	},
	author: {
		id: "by.author",
		description: "author display on single text view",
		defaultMessage: "{0}",
	},
	tags: {
		id: "search.tags",
		description: "search results text",
		defaultMessage: "Tags"
	},
	titles: {
		id: "search.titles",
		description: "search results text",
		defaultMessage: "Titles"
	}
})

export function SearchResults() {
	const location = useLocation();
	const {formatMessage} = useIntl();
	const {searchBarText, loading, error} = useBunkoSelector((state) => state.browseTags.tagSearch);
	const results = useBunkoSelector((state) => state.browseTags.tagSearch.searchResults[searchBarText]);
	const {searchType, results : resultTitles} = useBunkoSelector((state) => state.search)
	const [showResults, setShowResults] = useState<boolean>(true);
	const dispatch = useBunkoDispatch();


	useEffect(() => {
		const handleFocus = () => {
			setShowResults(document.activeElement === document.getElementById('search-bar'));
		};
		document.addEventListener("click", () => {
			handleFocus();
		});
		document.addEventListener("keydown", () => {
			handleFocus();
		});
		return () => {
			document.removeEventListener("click", () => {
				handleFocus();
			});
			document.addEventListener("keydown", () => {
				handleFocus();
			});
		}
	}, []);

	const handleSearchTypeChange = useCallback((event : React.MouseEvent<HTMLElement>) => {
		event.stopPropagation();
		const newSearchType : string | null = event.currentTarget.getAttribute("data-search-type");
		if (newSearchType !== null && newSearchType !== searchType) {
			dispatch(changeSearchType(newSearchType));
			if (newSearchType === C.TAGS) {
				dispatch(searchTags(searchBarText));
			} else if (newSearchType === C.USERS) {
				// dispatch(searchUsers(searchBarText));
			} else if (newSearchType === C.TITLES) {
				dispatch(searchTitles(searchBarText));
			}
		}
	}, [searchType]);

	const resultsOutput = useCallback(() => {
		if (loading || results === undefined) {
			return (<Loading/>);
		} else if (error) {
			return (
					<ErrorHandler statusCode={error} redirectTo={location.pathname}/>);
		} else {
			let searchResults;
			if (results.length === 0) {
				searchResults = (
					<div className="no-result">
						{formatMessage(messages.noResultFound, {1: searchBarText})}
					</div>
				);
			} else {
				if (searchType === C.TAGS) {
					searchResults = results.map((result: Genre) => (
						<li key={result.tag} className="result">
							<Link to={paths.tag.getHref() + result.tag}>
								#{result.tag}{result.texts !== undefined && " - "
								+ formatMessage(messages.resultCount, {count: result.texts.length})}
							</Link>
						</li>
					))
				} else if (searchType === C.USERS) {

				} else if (searchType === C.TITLES) {
					searchResults = resultTitles.map((text: TextDescription) => (
						<li key={text.hash} className="result">
							<Link to={paths.singleText.getHref() + text.hash}>
								<span className="result-item">
									<span className="title">{text.title}</span>
									<span className="author">{formatMessage(messages.author, {0:`${text.author.firstName} ${text.author.lastName}`})}</span>
								</span>

							</Link>
						</li>
					))
				}
			}
			return (
				<div className="results-container">
					<div id="search-type">
							<span data-search-type={C.TAGS} className={searchType === C.TAGS ? "active" : ""} onClick={handleSearchTypeChange}>
								<IconHash/>
								<span>{formatMessage(messages.tags)}</span>
							</span>
						<span data-search-type={C.USERS} className={searchType === C.USERS ? "active" : ""} onClick={handleSearchTypeChange}>
								<IconUser/>
								<span>{formatMessage(messages.users)}</span>
							</span>
						<span data-search-type={C.TITLES} className={searchType === C.TITLES ? "active" : ""} onClick={handleSearchTypeChange}>
								<IconTypography/>
								<span>{formatMessage(messages.titles)}</span>
							</span>
					</div>
					<ul>
						{searchResults}
						{searchType !== C.TAGS && results.length > 0 ? (<span
							className="result-count">{formatMessage(messages.resultCount, {count: resultTitles.length})}</span>) : null}
					</ul>
				</div>
			)
		}
	}, [searchBarText, results, resultTitles, loading, error, location.pathname, formatMessage, searchType]);

	if (error) {
		return <ErrorHandler statusCode={error} redirectTo={location.pathname}/>;
	} else if (!showResults) {
		return null;
	} else {
		return (
			<>
				<div className="search-results">
					<div className="list-results">
						{resultsOutput()}
					</div>
				</div>
			</>
		)
	}
}