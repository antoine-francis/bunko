import {TextDescription} from "@/types/Text.ts";
import PropTypes from "prop-types";
import {Link} from "react-router-dom";
import {paths} from "@/config/paths.ts";
import {defineMessages, FormattedDate, useIntl} from "react-intl";
import {toRoman} from "@/utils/roman-numerals.ts";
import {TagList} from "./TagList.tsx";
import {Truncate} from "@re-dev/react-truncate";
import {EmptyTextList} from "@/components/texts-list/EmptyTextList.tsx";

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
	showAuthor?: boolean;
}

export const TextsList = ({texts, showAuthor = false, showDescription = true, showSeries = true}: TextsListProps) => {
	const {formatMessage, formatDate} = useIntl();
	return (<div className={showDescription ? "text-list" : "text-list-cards"}>
		{texts !== undefined && texts.length > 0 ?
			texts.map((text : TextDescription, index : number) => (
				<Link key={text.hash} className="no-highlight" to={paths.singleText.getHref() + text.hash}>
				<div className="text-item" key={"text-"+index}>
					<div className="title-badge">
						<Link to={paths.singleText.getHref() + text.hash}>
							<div className="preview-container"><p
								className="content-preview">{text.content?.substring(0, 900)}</p></div>
							{!showDescription && <div
								className="title-overlap">{text.title ? text.title : formatMessage(messages.untitledText)}</div>}
						</Link>
						{text.isDraft &&
							<div className="publ-date">
								{formatMessage(messages.lastModified, {
						date: formatDate(text.modificationDate ? text.modificationDate : text.creationDate)
					})}
				</div>}
					</div>
					{showDescription && (
						<div className="text-description">
							<div className="title">{text.title ? text.title : formatMessage(messages.untitledText)}</div>
							{showAuthor &&
								<Link to={paths.profile.getHref() + text.author.username}>
									{`${text.author.firstName} ${text.author.lastName}`}
								</Link>}
							{showSeries && text.series &&
								<div className="series">
									<Link to={{pathname: `${paths.series.getHref()}${text.series.id}`}}>
										<div className="series-title">{text.series.title} {text.seriesEntry && toRoman(text.seriesEntry)}</div>
										<div></div>
									</Link>
								</div>}
							{text.synopsis ? text.synopsis : <div className="preview-synopsis"><Truncate lines={4}>{text.content}</Truncate></div>}
							<TagList genres={text.genres}/>
							<div className="publ-date">
								<FormattedDate value={text.publicationDate ? text.publicationDate : text.creationDate}/>
							</div>
						</div>
					)}
				</div>
					{text.bookmarkPosition && text.content &&
						<div className="progress-bar-container">
							<div className="progress-bar"
								 style={{width: `${(text.bookmarkPosition / text.content.length) * 100}%`}}></div>
						</div>
					}
				</Link>
			)) : <EmptyTextList/>}
	</div>);
}

TextsList.propTypes = {
	texts: PropTypes.array,
}