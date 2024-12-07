import {BunkoText} from "../../../types/Text.ts";
import {Link, useLocation, useParams} from "react-router-dom";
import {useEffect} from "react";
import {loadText} from "../../../features/text/api/load-single-text.ts";
import {BunkoComment} from "../../../types/Comment.ts";
import {Loading} from "../../../components/Loading.tsx";
import {FormattedDate} from "react-intl";
import React from "react";
import {NotFound} from "../../../components/NotFound.tsx";
import {paths} from "../../../config/paths.ts";
import {Genre} from "../../../types/Genre.ts";
import {useQuery} from "@tanstack/react-query";
import {ErrorHandler} from "../../../components/ErrorHandler.tsx";

export const SingleText = () => {
	const {id} = useParams();
	const location = useLocation();

	const { data: text, isLoading, error } = useQuery<BunkoText | undefined>({
		queryKey: ["text", id],
		queryFn: () => loadText(id!),
		refetchOnWindowFocus: false,
		retry: 0,
	});

	useEffect(() => {
		if (text !== undefined && text !== null) {
			document.title = text.title;
		}
	}, [text]);

	if (isLoading) {
		return <Loading/>;
	} else if (error) {
		return <ErrorHandler statusCode={error.message} redirectTo={location.pathname} />;
	} else if (text === undefined) {
		return <NotFound/>;
	} else {
		return (
			<div className="text-container">
				<div className="text-title">{text.title}</div>
				<div className="text-author">{text.author.firstName} {text.author.lastName}</div>
				{text.series !== null &&
					(<Link to={{pathname:`${paths.series.getHref()}${text.series.id}`}}>
					<div className="text-series-info">
						{text.series.picture !== null && (
							<div className="series-pic"><img src={text.series.picture} alt={text.series.title}/></div>)}
						<span className="series-name">{text.series.title} - part {text.seriesEntry}</span>
					</div>
				</Link>)
				}
				<span className="genres">{text.genres.map((genre : Genre, index: number) => {
					return `${genre.tag}${index < text.genres.length - 1 && ", "}`;
				})}</span>
				<div className="text-content">{text.content}</div>
				<div className="likes">Liked by {text.likes.length}</div>
				<div className="bookmark-count">Bookmarked by {text.bookmarkedBy.length}</div>
				<div className="comments-container">
					{text.comments.map((comment : BunkoComment) => {
						return (<React.Fragment key={comment.id}>
								<div className="comment-author">{comment.author.username}</div>
								<div className="comment-date"><FormattedDate value={comment.creationDate}/></div>
								<div className="comment">{comment.content}</div>
							</React.Fragment>
						);
					})}
				</div>
			</div>);
	}
}