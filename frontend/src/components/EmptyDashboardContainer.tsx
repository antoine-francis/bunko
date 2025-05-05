import {defineMessages, useIntl} from "react-intl";
import {Link} from "react-router-dom";
import {paths} from "@/config/paths.ts";

const messages = defineMessages({
	exploreAuthors: {
		id: "dashboard.exploreAuthors",
		description: "dashboard text",
		defaultMessage: "Explore authors",
	},
	browseSeries: {
		id: "dashboard.browseSeries",
		description: "dashboard text",
		defaultMessage: "Browse series",
	},
	browseTags: {
		id: "dashboard.browseTags",
		description: "dashboard text",
		defaultMessage: "Browse tags",
	},
});

export const EmptyDashboardContainer = () => {
	const {formatMessage} = useIntl();
	return (
		<div id="empty-list-container">
			<ul>
				<li><Link to={""}>{formatMessage(messages.exploreAuthors)}</Link></li>
				<li><Link to={""}>{formatMessage(messages.browseSeries)}</Link></li>
				<li><Link to={paths.tags.getHref()}>{formatMessage(messages.browseTags)}</Link></li>
			</ul>
		</div>
	)
}