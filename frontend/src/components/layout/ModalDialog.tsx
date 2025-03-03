import ReactModal from "react-modal";
import {useCallback} from "react";
import {C} from "@/constants/Constants.ts";
import {defineMessages, useIntl} from "react-intl";
import {useBunkoDispatch} from "@/hooks/redux-hooks.ts";
import {closeModal} from "@/slices/ModalSlice.ts";

const messages = defineMessages({
	cancel: {
		id: "modal.button.cancel",
		defaultMessage: "Cancel",
		description: "Button text",
	},
	confirm: {
		id: "modal.button.confirm",
		defaultMessage: "Confirm",
		description: "Button text",
	},
	publicationPrompt: {
		id: "modal.publicationPrompt",
		defaultMessage: "Are you sure you want to publish your text?",
		description: "Prompt description",
	},
	cancelPrompt: {
		id: "modal.cancelPrompt",
		defaultMessage: "Are you sure you want to cancel your changes?",
		description: "Prompt description",
	},
	deletePrompt: {
		id: "modal.deletePrompt",
		defaultMessage: "Are you sure you want to delete your text?",
		description: "Prompt description",
	},
	cantBeUndone: {
		id: "modal.cantBeUndone",
		defaultMessage: "This action cannot be undone.",
		description: "Prompt description",
	},
	default: {
		id: "modal.default",
		defaultMessage: "Are you sure you want to quit?",
		description: "Prompt description",
	}
})

const customStyles = {
	overlay: {
		backdropFilter: "blur(8px",
		backgroundColor: "rgba(0, 0, 0, 0.5)",
	},
	content: {
		top: '50%',
		left: '50%',
		right: 'auto',
		bottom: 'auto',
		marginRight: '-100%',
		transform: 'translate(-50%, -50%)',
		backgroundColor: 'var(--background-color)',
		minHeight: '150px',
		maxWidth: '80%',
	},
};

interface ModalDialogProps {
	isOpen: boolean;
	type?: string;
	confirmFunction: () => void;
}

export const ModalDialog = ({isOpen, type, confirmFunction}: ModalDialogProps) => {
	const {formatMessage} = useIntl();
	const dispatch = useBunkoDispatch();

	const closeDialog = useCallback(() => {
		dispatch(closeModal());
	}, [dispatch]);

	const confirmAndClose = useCallback(() => {
		confirmFunction();
		closeDialog();
	}, [closeDialog, confirmFunction]);

	const getModalContent = useCallback(() => {
		switch (type) {
			case C.PUBLISH_TEXT: {
				return (
					<>
						<h3>Wait !</h3>
						<h4 className="modal-content">{formatMessage(messages.publicationPrompt)}</h4>
						<div className="modal-buttons">
							<button onClick={closeDialog}>{formatMessage(messages.cancel)}</button>
							<button onClick={confirmAndClose}>{formatMessage(messages.confirm)}</button>
						</div>
					</>
				)
			}
			case C.CANCEL_EDIT: {
				return (
					<>
						<h3>Wait !</h3>
						<h4 className="modal-content">{formatMessage(messages.cancelPrompt)}</h4>
						<div className="modal-buttons">
							<button onClick={closeDialog}>{formatMessage(messages.cancel)}</button>
							<button onClick={confirmAndClose}>{formatMessage(messages.confirm)}</button>
						</div>
					</>
				)
			}
			case C.DELETE_TEXT: {
				return (
					<>
						<h3>Wait !</h3>
						<h4 className="modal-content">{formatMessage(messages.deletePrompt)}</h4>
						<p className="modal-content">{formatMessage(messages.cantBeUndone)}</p>
						<div className="modal-buttons">
							<button onClick={closeDialog}>{formatMessage(messages.cancel)}</button>
							<button onClick={confirmAndClose}>{formatMessage(messages.confirm)}</button>
						</div>
					</>
				)
			}
			default:
				return <h4>{formatMessage(messages.default)}</h4>
		}
	}, [closeDialog, type, formatMessage, confirmAndClose]);

	return (
		<ReactModal
			appElement={document.body}
			style={customStyles}
			isOpen={isOpen}
			shouldCloseOnEsc={true}
			onRequestClose={closeDialog}
			shouldCloseOnOverlayClick={true}>
			{getModalContent()}
		</ReactModal>
	);
}