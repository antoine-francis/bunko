import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {BunkoComment, CommentState} from "../types/Comment.ts";


const initialState: CommentState = {
	replyTo: undefined
};

const commentsSlice = createSlice({
	name: 'comment',
	initialState,
	reducers: {
		toggleReply: (state, action : PayloadAction<BunkoComment | undefined>) => {
			state.replyTo = action.payload;
			// state.replyTo as BunkoComment = action.payload.id;
		},
	},
});

export const { toggleReply } = commentsSlice.actions;


export default commentsSlice.reducer;