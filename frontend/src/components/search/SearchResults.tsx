import {useBunkoSelector} from "@/hooks/redux-hooks.ts";
import {Genre} from "@/types/Genre.ts";
import {Loading} from "../Loading.tsx";
import {ErrorHandler} from "../ErrorHandler.tsx";
import {Link, useLocation} from "react-router-dom";
import {useCallback, useEffect, useState} from "react";
import {defineMessages, useIntl} from "react-intl";
import {paths} from "@/config/paths.ts";

const messages = defineMessages({
	noResultFound: {
		id: "search.noResultFound",
		description: "search results text",
		defaultMessage: "No result found for ''{1}''"
	},
	resultCountSing: {
		id: "search.resultCountSing",
		description: "search results text",
		defaultMessage: "{1} result"
	},
	resultCountPlur: {
		id: "search.resultCountPlur",
		description: "search results text",
		defaultMessage: "{1} results"
	}
})

export function SearchResults() {
	const location = useLocation();
	const {formatMessage} = useIntl();
	const {searchBarText, loading, error} = useBunkoSelector((state) => state.browseTags.tagSearch);
	const results = useBunkoSelector((state) => state.browseTags.tagSearch.searchResults[searchBarText]);
	const [showResults, setShowResults] = useState<boolean>(true);

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

	const resultsOutput = useCallback(() => {
		if (loading || results === undefined) {
			return (
					<Loading/>);
		} else if (error) {
			return (
					<ErrorHandler statusCode={error} redirectTo={location.pathname}/>);
		} else {
			if (results.length === 0) {
				return (
						<div className="no-result">
							{formatMessage(messages.noResultFound, {1: searchBarText})}
					</div>);
			} else {
				return (
					<ul>
						{results.map((result: Genre) => (
							<li key={result.tag} className="result">
								<Link to={paths.tag.getHref() + result.tag}>
									#{result.tag}{result.texts !== undefined && " - "
									+ formatMessage(result.texts.length > 1 ? messages.resultCountPlur : messages.resultCountSing,
										{1: result.texts.length})}
								</Link>
							</li>
						))}
					</ul>
				)
			}
		}
	}, [searchBarText, results, loading, error, location.pathname, formatMessage]);

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