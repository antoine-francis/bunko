import {TextDescription} from "../../types/Text.ts";
import PropTypes from "prop-types";
import {EmptyList} from "../users-list/EmptyList.tsx";
import {Link} from "react-router-dom";
import {paths} from "../../config/paths.ts";
import {defineMessages, FormattedDate, useIntl} from "react-intl";
import {toRoman} from "../../utils/roman-numerals.ts";
import {TagList} from "./TagList.tsx";

const messages = defineMessages({
	untitledText: {
		id: "title.untitledText",
		description: "untitled text title",
		defaultMessage: "(Untitled)",
	},
	lastModified: {
		id: "text.lastModified",
		description: "info under text tile",
		defaultMessage: "Last modified on {date}",
	},
})

interface TextsListProps {
	texts?: TextDescription[];
	showDescription?: boolean;
	showSeries?: boolean;
}

export const TextsList = ({texts, showDescription = true, showSeries = true}: TextsListProps) => {
	const {formatMessage, formatDate} = useIntl();
	return (<div className={showDescription ? "text-list" : "text-list-cards"}>
		{texts !== undefined && texts.length > 0 ?
			texts.map((text : TextDescription, index : number) => (
				<div className="text-item" key={"text-"+index}>
					<div className="title-badge">
			<Link to={paths.singleText.getHref()+text.hash}>
				<div className="preview-container"><p className="content-preview">{text.content?.substring(0, 900)}</p></div>
				<div className="title">{text.title ? text.title : formatMessage(messages.untitledText)}</div>
			</Link>
			{showSeries && text.series &&
				<div className="series">
					<Link to={{pathname: `${paths.series.getHref()}${text.series.id}`}}>
						<div className="series-title">{text.series.title} {text.seriesEntry && toRoman(text.seriesEntry)}</div>
						<div></div>
					</Link>
				</div>}
			{text.isDraft &&
				<div className="publ-date">
					{formatMessage(messages.lastModified, {
						date: formatDate(text.modificationDate ? text.modificationDate : text.creationDate)
					})}
				</div>}
				</div>
					{showDescription && (
						<div className="text-description">
							{text.synopsis ? text.synopsis : text.content?.substring(0, 255)}
							<TagList genres={text.genres}/>
							<div className="publ-date"><FormattedDate
								value={text.publicationDate ? text.publicationDate : text.creationDate}/></div>
						</div>
					)}
				</div>
			)) : <EmptyList/>}
	</div>);
}

TextsList.propTypes = {
	texts: PropTypes.array,
}