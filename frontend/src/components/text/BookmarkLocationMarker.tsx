import {useEffect, useState} from "react";
import {BookmarkPosition} from "@/types/Text.ts";
import {getTextNodeAtPosition} from "@/utils/text-selection.ts";
import {useBunkoSelector} from "@/hooks/redux-hooks.ts";

interface BookmarkLocationMarkerProps {
	bookmarkLocation: number | undefined;
}

export const BookmarkLocationMarker = ({bookmarkLocation} : BookmarkLocationMarkerProps) => {
	const {showVerticalOptionsBar} = useBunkoSelector(state => state.uiState);
	const [scrolledIntoView, setScrolledIntoView] = useState<boolean>(false);

	useEffect(() => {
		window.addEventListener("resize", () => {
			setPosition();
		});

		return window.removeEventListener("resize", () => {
			setPosition();
		});
	}, []);

	useEffect(() => {
		setPosition();
		if (!scrolledIntoView) {
			const bookmark : HTMLElement | null = document.getElementById("location-marker");
			if (bookmark !== null) {
				bookmark.scrollIntoView({behavior: "smooth", block: "center"});
				setScrolledIntoView(true);
			}
		}
	}, [scrolledIntoView, showVerticalOptionsBar, bookmarkLocation]);

	const setPosition = () : void => {
		if (bookmarkLocation !== undefined) {
			const range : Range = document.createRange();
			const textContent : HTMLElement | null = document.getElementById("text-content");
			if (textContent !== null) {
				const bookmarkPosition : BookmarkPosition | undefined = getTextNodeAtPosition(textContent, bookmarkLocation);
				if (bookmarkPosition !== undefined) {
					const {textNode, position: relativePosition} = bookmarkPosition;
					range.setStart(textNode, relativePosition);

					const rect : DOMRect = range.getBoundingClientRect();
					const box : HTMLElement | null = document.getElementById("location-marker");
					if (box !== null) {
						box.style.position = 'absolute';
						box.style.top = `${rect.top + window.scrollY + 18}px`;
						box.style.left = `0`;
						box.style.width = "100%";
						box.style.height = `3px`;
						box.style.borderTop = '2px solid #c29b00';
						box.style.borderBottom = '2px solid #c29b00';
						box.style.backgroundColor = 'rgba(255, 0, 0, 0.3)';
						box.style.zIndex = '-1';
						box.style.boxSizing = 'border-box';
					}
				}
			}
		}
	}

	return (
		<div id="location-marker"></div>
	)
}