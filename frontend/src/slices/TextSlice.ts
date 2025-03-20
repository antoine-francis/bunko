import {createAsyncThunk, createSlice, current, PayloadAction} from '@reduxjs/toolkit';
import {LoadingState} from "../types/StateManagement.ts";
import {
	save, deleteCommentReq,
	deleteSingleText,
	like, likeCommentReq,
	loadText,
	postComment,
	unsave,
	unlike, unlikeCommentReq,
	updateExistingText, setBookmarkPosition
} from "../features/text/api/single-text.ts";
import {Bookmark, BunkoText, TextState} from "../types/Text.ts";
import {Like} from "../types/Like.ts";
import {SavedText} from "../types/SavedText.ts";
import {BunkoComment, CommentLike, CommentPost, DeleteComment} from "../types/Comment.ts";

export const fetchText = createAsyncThunk<BunkoText | undefined, string>(
	'text_fetchText',
	async (hash: string) => {
		return await loadText(hash);
	}
)

export const updateText = createAsyncThunk<BunkoText | undefined, BunkoText>(
	'text_updateText',
	async (text : BunkoText) => {
		return await updateExistingText(text);
	}
)

export const deleteText = createAsyncThunk<BunkoText | undefined, BunkoText>(
	'text_deleteText',
	async (text: BunkoText) => {
		return await deleteSingleText(text);
	}
)

export const likeText = createAsyncThunk(
	'text_like',
	async (text : BunkoText) => {
		return await like(text);
	}
)

export const unlikeText = createAsyncThunk(
	'text_unlike',
	async (text : BunkoText) => {
		return await unlike(text);
	}
)

export const likeComment = createAsyncThunk(
	'comment_like',
	async (comment : BunkoComment) => {
		return await likeCommentReq(comment);
	}
)

export const unlikeComment = createAsyncThunk(
	'comment_unlike',
	async (comment : BunkoComment) => {
		return await unlikeCommentReq(comment);
	}
)

export const saveText = createAsyncThunk<SavedText | undefined, BunkoText>(
	'text_saveText',
	async (text : BunkoText) => {
		return await save(text);
	}
)

export const unsaveText = createAsyncThunk(
	'text_unsaveText',
	async (text : BunkoText) => {
		return await unsave(text);
	}
)

export const comment = createAsyncThunk<BunkoComment | undefined, CommentPost>(
	'text_postComment',
	async ({content, textId, parent} : CommentPost) => {
		return await postComment(content, textId, parent);
	}
)

export const deleteComment = createAsyncThunk<void, DeleteComment>(
	'text_deleteComment',
	async ({id, parent, text, username} : DeleteComment) => {
		return await deleteCommentReq(id, text, username, parent);
	}
)

export const setBookmark = createAsyncThunk<void, Bookmark>(
	'text_setBookmark',
	async ({position, textHash} : Bookmark) : Promise<void> => {
		return await setBookmarkPosition(position, textHash);
	}
)

const initialState: TextState = {};

const textSlice = createSlice({
	name: 'text',
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder
			.addCase(fetchText.pending, (state, action : PayloadAction<LoadingState | undefined>) => {
				const hash = (action as any).meta.arg;
				(state[hash] as LoadingState) = {loading: true, error: undefined};
			})
			.addCase(fetchText.fulfilled, (state, action : PayloadAction<BunkoText | undefined>) => {
				if (action.payload !== undefined) {
					state[action.payload.hash] = {...action.payload, loading: false, error: undefined};
				}
			})
			.addCase(fetchText.rejected, (state, action) => {
				const hash = (action as any).meta.arg;
				state[hash].loading = false;
				state[hash].error = (action as any).error.message;
			})
			.addCase(likeText.pending, (state, action : PayloadAction<LoadingState | undefined>) => {
				const hash = (action as any).meta.arg;
				(state[hash] as LoadingState) = {loading: true, error: undefined};
			})
			.addCase(likeText.fulfilled, (state, action : PayloadAction<Like>) => {
				if (action.payload !== undefined) {
					const {hash} = (action as any).meta.arg;
					state[hash].likes = state[hash].likes.concat(action.payload);
				}
			})
			.addCase(likeText.rejected, (state, action) => {
				const {hash} = (action as any).meta.arg;
				state[hash].loading = false;
				state[hash].error = (action as any).error.message;
			})
			.addCase(unlikeText.pending, (state, action : PayloadAction<LoadingState | undefined>) => {
				const hash = (action as any).meta.arg;
				(state[hash] as LoadingState) = {loading: true, error: undefined};
			})
			.addCase(unlikeText.fulfilled, (state, action : PayloadAction<string>) => {
				if (action.payload !== undefined) {
					const {hash} = (action as any).meta.arg;
					const currentUser : string = action.payload;
					state[hash].likes = state[hash].likes.filter(like => {return like.user.username !== currentUser});
				}
			})
			.addCase(unlikeText.rejected, (state, action) => {
				const hash = (action as any).meta.arg;
				state[hash].loading = false;
				state[hash].error = (action as any).error.message;
			})
			.addCase(likeComment.pending, (state, action : PayloadAction<LoadingState | undefined>) => {
				const textHash = (action as any).meta.arg;
				(state[textHash] as LoadingState) = {loading: true, error: undefined};
			})
			.addCase(likeComment.fulfilled, (state, action : PayloadAction<CommentLike>) => {
				if (action.payload !== undefined) {
					const {text, id, parent} = (action as any).meta.arg;
					const textComments = state[text].comments;
					const currentState = current(state)[text].comments;
					if (parent !== undefined && parent !== null) {
						const parentIndex : number = currentState.map(function(c) {
							return c.id;
						}).indexOf(parent);
						if (parentIndex !== -1 && currentState[parentIndex].replies !== undefined) {
							const index : number = currentState[parentIndex].replies.map(function(c) {
								return c.id;
							}).indexOf(id);
							if (index !== undefined && textComments !== undefined && textComments[parentIndex].replies !== undefined) {
								textComments[parentIndex].replies[index].likes = textComments[parentIndex].replies[index].likes.concat(action.payload);
							}
						}
					} else {
						const index : number = currentState.map(function(c) {
							return c.id;
						}).indexOf(id);
						state[text].comments[index].likes = state[text].comments[index].likes.concat(action.payload);
					}
				}
			})
			.addCase(likeComment.rejected, (state, action) => {
				const hash = (action as any).meta.arg;
				state[hash].loading = false;
				state[hash].error = (action as any).error.message;
			})
			.addCase(unlikeComment.pending, (state, action : PayloadAction<LoadingState | undefined>) => {
				const textHash = (action as any).meta.arg;
				(state[textHash] as LoadingState) = {loading: true, error: undefined};
			})
			.addCase(unlikeComment.fulfilled, (state, action : PayloadAction<string>) => {
				if (action.payload !== undefined) {
					const currentUser = action.payload;
					const {text, id, parent} = (action as any).meta.arg;
					const textComments = state[text].comments;
					const currentState = current(state)[text].comments;
					if (parent !== undefined && parent !== null) {
						const parentIndex : number = currentState.map(function(c) {
							return c.id;
						}).indexOf(parent);
						if (parentIndex !== -1 && currentState[parentIndex].replies !== undefined) {
							const index : number = currentState[parentIndex].replies.map(function(c) {
								return c.id;
							}).indexOf(id);
							if (index !== undefined && textComments !== undefined && textComments[parentIndex].replies !== undefined) {
								textComments[parentIndex].replies[index].likes = textComments[parentIndex].replies[index].likes.filter(like => {
									return like.user.username !== currentUser
								});
							}
						}
					} else {
						const index : number = currentState.map(function(c) {
							return c.id;
						}).indexOf(id);
						state[text].comments[index].likes = state[text].comments[index].likes.filter(like => {return like.user.username !== currentUser});
					}
				}
			})
			.addCase(unlikeComment.rejected, (state, action) => {
				const hash = (action as any).meta.arg;
				state[hash].loading = false;
				state[hash].error = (action as any).error.message;
			})
			.addCase(saveText.pending, (state, action : PayloadAction<LoadingState | undefined>) => {
				const hash = (action as any).meta.arg;
				(state[hash] as LoadingState) = {loading: true, error: undefined};
			})
			.addCase(saveText.fulfilled, (state, action : PayloadAction<SavedText | undefined>) => {
				if (action.payload !== undefined) {
					const {hash} = (action as any).meta.arg;
					state[hash].savedBy = state[hash].savedBy.concat(action.payload);
				}
			})
			.addCase(saveText.rejected, (state, action) => {
				const hash = (action as any).meta.arg;
				state[hash].loading = false;
				state[hash].error = (action as any).error.message;
			})
			.addCase(unsaveText.pending, (state, action : PayloadAction<LoadingState | undefined>) => {
				const hash = (action as any).meta.arg;
				(state[hash] as LoadingState) = {loading: true, error: undefined};
			})
			.addCase(unsaveText.fulfilled, (state, action : PayloadAction<string>) => {
				if (action.payload !== undefined) {
					const {hash} = (action as any).meta.arg;
					const currentUser : string = action.payload;
					state[hash].savedBy = state[hash].savedBy.filter(bkmk => {return bkmk.user.username !== currentUser});
				}
			})
			.addCase(unsaveText.rejected, (state, action) => {
				const hash = (action as any).meta.arg;
				state[hash].loading = false;
				state[hash].error = (action as any).error.message;
			})
			.addCase(comment.pending, (state, action : PayloadAction<LoadingState | undefined>) => {
				const textHash = (action as any).meta.arg;
				(state[textHash] as LoadingState) = {loading: true, error: undefined};
			})
			.addCase(comment.fulfilled, (state, action : PayloadAction<BunkoComment | undefined>) => {
				if (action.payload !== undefined) {
					const {text} = action.payload;
					const {parent} = (action as any).meta.arg;
					if (parent !== undefined) {
						const index = current(state)[text].comments.map(function(c) {
							return c.id;
						}).indexOf(parent);
						if (index !== undefined && state[text].comments[index].replies !== undefined) {
							state[text].comments[index].replies = state[text].comments[index].replies.concat(action.payload);
						}
					} else {
						state[text].comments = state[text].comments.concat(action.payload);
					}
				}
			})
			.addCase(comment.rejected, (state, action) => {
				const hash = (action as any).meta.arg;
				state[hash].loading = false;
				state[hash].error = (action as any).error.message;
			})
			.addCase(deleteComment.pending, (state, action : PayloadAction<LoadingState | undefined>) => {
				const textHash = (action as any).meta.arg;
				(state[textHash] as LoadingState) = {loading: true, error: undefined};
			})
			.addCase(deleteComment.fulfilled, (state, action : PayloadAction<void | DeleteComment>) => {
				if (action.payload !== undefined) {
					const {parent, text, id} = (action as any).meta.arg;
					if (parent !== undefined) {
						const index = current(state)[text].comments.map(function(c) {
							return c.id;
						}).indexOf(parent);
						if (index !== undefined && state[text].comments[index].replies !== undefined) {
							state[text].comments[index].replies = state[text].comments[index].replies.filter(comment => {return comment.id !== id});
						}
					} else {
						state[text].comments = state[text].comments.filter(comment => {return comment.id !== id});
					}
				}
			})
			.addCase(deleteComment.rejected, (state, action) => {
				const hash = (action as any).meta.arg;
				state[hash].loading = false;
				state[hash].error = (action as any).error.message;
			})
			.addCase(updateText.pending, (state, action : PayloadAction<LoadingState | undefined>) => {
				const textHash = (action as any).meta.arg;
				(state[textHash] as LoadingState) = {loading: true, error: undefined};
			})
			.addCase(updateText.fulfilled, (state, action : PayloadAction<BunkoText | undefined>) => {
				if (action.payload !== undefined) {
					const {hash} = action.payload;
					state[hash] = action.payload
				}
			})
			.addCase(updateText.rejected, (state, action) => {
				const hash = (action as any).meta.arg;
				state[hash].loading = false;
				state[hash].error = (action as any).error.message;
			})
			.addCase(deleteText.pending, (state, action : PayloadAction<LoadingState | undefined>) => {
				const textHash = (action as any).meta.arg;
				(state[textHash] as LoadingState) = {loading: true, error: undefined};
			})
			.addCase(deleteText.fulfilled, (state, action : PayloadAction<BunkoText | undefined>) => {
				if (action.payload !== undefined) {
					const {hash} = action.payload;
					delete state[hash];
				}
			})
			.addCase(deleteText.rejected, (state, action) => {
				const hash = (action as any).meta.arg;
				state[hash].loading = false;
				state[hash].error = (action as any).error.message;
			})
			.addCase(setBookmark.fulfilled, (state, action : PayloadAction<void | Bookmark>) => {
				const {textHash, position} = (action as any).meta.arg;
				state[textHash].bookmarkPosition = position;
			})
	},
});


export default textSlice.reducer;