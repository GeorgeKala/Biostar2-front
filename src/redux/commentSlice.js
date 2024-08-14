import { createSlice } from '@reduxjs/toolkit';
import commentService from '../services/comment';

const commentSlice = createSlice({
  name: 'comments',
  initialState: {
    analyzedComments: [],
    commentedDetails: [],
    error: null,
  },
  reducers: {
    setAnalyzedComments(state, action) {
      state.analyzedComments = action.payload;
    },
    setCommentedDetails(state, action) {
      state.commentedDetails = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
    removeComment(state, action) {
      state.commentedDetails = state.commentedDetails.filter(
        (detail) => detail.id !== action.payload
      );
    },
    clearComments(state) {
      state.analyzedComments = [];
      state.commentedDetails = [];
      state.error = null;
    },
  },
});

export const fetchCommentedDetails = (filters) => async (dispatch) => {
  try {
    const response = await commentService.fetchCommentedDetails(filters);
    dispatch(setCommentedDetails(response));
  } catch (error) {
    dispatch(setError(error.toString()));
  }
};

export const fetchAnalyzedComments = (filters) => async (dispatch) => {
  try {
    const response = await commentService.fetchAnalyzedComments(filters);
    dispatch(setAnalyzedComments(response));
  } catch (error) {
    dispatch(setError(error.toString()));
  }
};


export const { setAnalyzedComments, setCommentedDetails, setError, removeComment, clearComments } = commentSlice.actions;

export default commentSlice.reducer;
