import {TextsList} from "@/components/texts-list/TextsList.tsx";
import {useEffect} from "react";
import {Link, useLocation, useNavigate, useParams} from "react-router-dom";
import {ErrorHandler} from "@/components/ErrorHandler.tsx";
import {useBunkoDispatch, useBunkoSelector} from "@/hooks/redux-hooks.ts";
import {paths} from "@/config/paths.ts";
import {fetchSeries} from "@/slices/SeriesSlice.ts";
import {BunkoText, TextDescription} from "@/types/Text.ts";
import {convertTextToDesc} from "@/features/text/text-functions.ts";
import {LoadingContainer} from "@/components/LoadingContainer.tsx";
import {Author} from "@/types/Author.ts";
import {defineMessages, useIntl} from "react-intl";

const messages = defineMessages({
	entry: {
		id: "series.entry",
		description: "text list label",
		defaultMessage: "{count, plural, one {{count} entry} other {{count} entries}}"
	},
})

export const SeriesDescription = () => {
	const {id} = useParams();
	const location = useLocation();
	const navigate = useNavigate();
	const dispatch = useBunkoDispatch();
	const series = useBunkoSelector(state => id ? state.series[id] : undefined);
	const {formatMessage} = useIntl();

	useEffect(() => {
		if (series !== undefined) {
			document.title = series.title;
		}
		if (id === undefined) {
			navigate(paths.notFound.getHref());
		} else {
			if (!series) {
				dispatch(fetchSeries(id));
			}
		}
	}, [series, dispatch, id, navigate]);

	const getSeriesAuthors = () : Author[] => {
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

	if (!series) {
		return null;
	} else if (series.loading) {
		return <LoadingContainer />;
	} else if (series.error) {
		return <ErrorHandler statusCode={series.error} redirectTo={location.pathname} />;
	} else if (series.entries !== undefined) {
		const seriesTextDesc : TextDescription[] = series.entries.map((text : BunkoText) => {
			return convertTextToDesc(text);
		})
		const seriesAuthor : Author[] = getSeriesAuthors();
		return (
			<>
				<div id="series-info-container">
					<div className="series-title">{series.title}</div>
					<div className="author">
						{seriesAuthor.map((author : Author, index : number) => {
							return (
								<Link key={"author-" + author.username} to={paths.profile.getHref() + author.username}>
									{`${author.firstName} ${author.lastName}${index !== seriesAuthor.length - 1 ? ", " : ""}`}
								</Link>
							)
						})}

					</div>
					<div className="synopsis">{series.synopsis}</div>
					<div className="entries-label text-count">
						{formatMessage(messages.entry, {count: seriesTextDesc.length})}
					</div>
					<div className="text-list-container">
						<TextsList texts={seriesTextDesc} showAuthor={true} showSeries={false}/>
					</div>
				</div>
			</>
		);
	}

}