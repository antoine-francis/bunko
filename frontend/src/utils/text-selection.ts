import {BookmarkPosition} from "@/types/Text.ts";

export function getCaretCharacterOffsetWithin(element : HTMLElement) {
	let caretOffset = 0;
	const doc : Document = element.ownerDocument;
	const window : Window | null = doc.defaultView;
	let selection : Selection | null;
	if (window !== null && window.getSelection() !== undefined) {
		selection = window.getSelection();
		if (selection !== null && selection.rangeCount > 0) {
			const range = window.getSelection()?.getRangeAt(0);
			if (range !== undefined) {
				const preCaretRange = range.cloneRange();
				preCaretRange.selectNodeContents(element);
				preCaretRange.setEnd(range.endContainer, range.endOffset);
				caretOffset = preCaretRange.toString().length;
			}
		}
	}
	return caretOffset;
}

export function getTextNodeAtPosition(element : HTMLElement, position : number) : BookmarkPosition | undefined {
	let charCount = 0;
	const walk = document.createTreeWalker(
		element,
		NodeFilter.SHOW_TEXT,
		null
	);

	while (walk.nextNode()) {
		const currentNode = walk.currentNode;
		const nodeValue = currentNode.nodeValue;
		const nodeLength = nodeValue?.length;

		if (nodeLength !== undefined) {
			if (charCount + nodeLength > position) {
				return {textNode: currentNode, position: position - charCount};
			}
			charCount += nodeLength;
		}
	}
	return undefined;
}