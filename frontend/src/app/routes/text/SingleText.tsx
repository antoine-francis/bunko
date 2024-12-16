import {Link, useLocation, useNavigate, useParams} from "react-router-dom";
import {useEffect} from "react";
import {BunkoComment} from "../../../types/Comment.ts";
import {Loading} from "../../../components/Loading.tsx";
import {FormattedDate} from "react-intl";
import React from "react";
import {NotFound} from "../../../components/NotFound.tsx";
import {paths} from "../../../config/paths.ts";
import {Genre} from "../../../types/Genre.ts";
import {ErrorHandler} from "../../../components/ErrorHandler.tsx";
import {useBunkoDispatch, useBunkoSelector} from "../../../hooks/redux-hooks.ts";
import {fetchText} from "../../../slices/TextSlice.ts";

export const SingleText = () => {
	const {id} = useParams();
	const location = useLocation();
	const navigate = useNavigate();
	const dispatch = useBunkoDispatch();
	const text = useBunkoSelector(state => id ? state.texts[id] : undefined);

	useEffect(() => {
		if (text !== undefined) {
			document.title = text.title;
		}
	}, [text]);

	if (id === undefined) {
		navigate(paths.notFound.getHref());
	} else {
		if (!text) {
			dispatch(fetchText(id));
		}
	}

	if (text === undefined) {
		return <NotFound/>;
	}
	if (text.loading) {
		return <Loading/>;
	} else if (text.error) {
		return <ErrorHandler statusCode={text.error} redirectTo={location.pathname} />;
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