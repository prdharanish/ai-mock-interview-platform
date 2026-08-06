import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';

export const startSession = createAsyncThunk('interview/start', async (role, thunkAPI) => {
  try {
    const response = await api.post('/interview/start', { role });
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const getNextQuestion = createAsyncThunk('interview/getQuestion', async (sessionId, thunkAPI) => {
  try {
    const response = await api.get(`/interview/${sessionId}/question`);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const submitAnswer = createAsyncThunk('interview/submitAnswer', async (data, thunkAPI) => {
  try {
    const response = await api.post('/interview/submit', data);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

const interviewSlice = createSlice({
  name: 'interview',
  initialState: {
    session: null,
    currentQuestion: null,
    feedback: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearFeedback: (state) => {
      state.feedback = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(startSession.pending, (state) => { state.loading = true; })
      .addCase(startSession.fulfilled, (state, action) => {
        state.loading = false;
        state.session = action.payload;
        state.error = null;
      })
      .addCase(startSession.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getNextQuestion.pending, (state) => { state.loading = true; state.feedback = null; })
      .addCase(getNextQuestion.fulfilled, (state, action) => {
        state.loading = false;
        state.currentQuestion = action.payload;
        state.error = null;
      })
      .addCase(getNextQuestion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(submitAnswer.pending, (state) => { state.loading = true; })
      .addCase(submitAnswer.fulfilled, (state, action) => {
        state.loading = false;
        state.feedback = action.payload.feedbackJSON;
        state.error = null;
      })
      .addCase(submitAnswer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearFeedback } = interviewSlice.actions;
export default interviewSlice.reducer;
