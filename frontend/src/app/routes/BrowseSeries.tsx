import {useEffect} from "react";

import {paths} from "@/config/paths.ts";
import {Link, useLocation} from "react-router-dom";
import {ErrorHandler} from "@/components/ErrorHandler.tsx";
import {EmptyList} from "@/components/users-list/EmptyList.tsx";
import {useBunkoDispatch, useBunkoSelector} from "@/hooks/redux-hooks.ts";
import {defineMessages, useIntl} from "react-intl";
import {LoadingContainer} from "@/components/LoadingContainer.tsx";
import {Series} from "@/types/Series.ts";
import {fetchPopularSeries} from "@/slices/SuggestionsSlice.ts";
import {getReaderCount, getSeriesAuthors} from "@/hooks/series-hooks.ts";
import {Author} from "@/types/Author.ts";
import {IconBooks} from "@tabler/icons-react";

const messages = defineMessages({
	browseSeries: {
		id: "browseSeries.title",
		description: "page title",
		defaultMessage: "Explore popular series",
	},
	readingUsers: {
		id: "series.readingUsers",
		description: "how many users are reading the series",
		defaultMessage: "{count, plural, one {{count} is reading} other {{count} are reading}}",
	}
});

export const BrowseSeries = () => {
	const location = useLocation();
	const dispatch = useBunkoDispatch();
	const {formatMessage} = useIntl();
	const {suggestedSeries, error, loading} = useBunkoSelector(state => state.suggestions)

	useEffect(() => {
		document.title = "Browse series";
		dispatch(fetchPopularSeries());
	}, [dispatch]);

	if (loading) {
		return <LoadingContainer />;
	} else if (error) {
		return <ErrorHandler statusCode={error} redirectTo={location.pathname} />;
	} else if (suggestedSeries === undefined || !suggestedSeries.length) {
		return <EmptyList/>;
	} else {
		return (
			<div id="browse-by-series-container">
				<h2>{formatMessage(messages.browseSeries)}</h2>
				{suggestedSeries.map((series: Series, index: number) => {
					const seriesAuthor = getSeriesAuthors(series);
					return (
						<div className="series-card" key={"series-" + index}>
							<div className="cover-img">
								<IconBooks/>
							</div>
							<div className="series-info">
								<Link key={`${series}-${index}`} to={{pathname: `${paths.series.getHref()}${series.id}`}}>
									<div className="title">{series.title}</div>
									{seriesAuthor.map((author: Author, index: number) => {
										return (
											<Link key={"author-" + author.username}
												  to={paths.profile.getHref() + author.username}>
												{`${author.firstName} ${author.lastName}${index !== seriesAuthor.length - 1 ? ", " : ""}`}
											</Link>
										)
									})}
									<div className="synopsis">{series.synopsis}</div>
								</Link>
								<div className="read-count">
									{formatMessage(messages.readingUsers, {count: getReaderCount(series)})}
								</div>
							</div>
						</div>
					)
				})}
			</div>
		);
	}
}