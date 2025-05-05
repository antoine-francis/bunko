import {BunkoText} from "@/types/Text.ts";
import {UserBadge} from "@/types/UserProfile.ts";
import {EmptyDashboardContainer} from "@/components/EmptyDashboardContainer.tsx";
import {ContinueReadingBar} from "@/components/texts-list/ContinueReadingBar.tsx";
import {TextFeedItem} from "@/components/text/TextFeedItem.tsx";


interface TextsFeedProps {
	texts: BunkoText[],
	bookmarks: BunkoText[],
	user: UserBadge | undefined,
}

export const TextsFeed = ({texts, bookmarks, user} : TextsFeedProps) => {

	return (
		<div id="dashboard">
			<ContinueReadingBar bookmarks={bookmarks}/>
			{texts.length === 0 ?
				<EmptyDashboardContainer/> :
				<div id="feed">
					{texts.map((text: BunkoText, index: number) => {
						return (<TextFeedItem key={`text-${index}`} text={text} user={user} />)
					})}
				</div>
			}
		</div>
	)
}