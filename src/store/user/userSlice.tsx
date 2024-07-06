import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { generateTextContent } from './dispatchers.user';
import { UserState, Search, Message } from '../../types/responses';

const initialUserState: UserState = {
  name: '',
  API_KEY: '',
  conversation: {
    loading: false,
    error: undefined,
    data: [],
  },
  searches: [],
  proxy: undefined,
  theme: 'dark',
  sessionid: '',
  images: [],
  chatHistory: []
};

const userSlice = createSlice({
  name: 'user',
  initialState: initialUserState,
  reducers: {
    setUser: (state, action) => {
      state.name = action.payload.name;
      state.API_KEY = action.payload.API_KEY;
      state.proxy = action.payload.proxy;
    },
    clearUser: (state) => {
      state.name = initialUserState.name;
      state.API_KEY = initialUserState.API_KEY;
      state.conversation = initialUserState.conversation;
      state.proxy = initialUserState.proxy;
    },
    clearChat: (state) => {
      state.conversation = initialUserState.conversation;
      state.sessionid = initialUserState.sessionid;
    },
    deleteChat: (state) => {
      state.chatHistory = state.chatHistory.filter(
        (session) => session.sessionid !== state.sessionid
      );
      state.conversation = initialUserState.conversation;
      state.sessionid = initialUserState.sessionid;
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
    setSessionid: (state, action) => {
      state.sessionid = action.payload.sessionid;
    },
    setImages: (state, action) => {
      state.images = action.payload;
    },
    saveChat: (state) => {
      const existingSession = state.chatHistory.find(
        (session) => session.sessionid === state.sessionid
      );
      if (!existingSession) {
        state.chatHistory.push({
          sessionid: state.sessionid,
          conversation: state.conversation.data
        });
      }
    },
    loadChat: (state, action) => {
      const session = state.chatHistory.find(
        (session) => session.sessionid === action.payload.sessionid
      );
      if (session) {
        state.sessionid = session.sessionid;
        state.conversation.data = session.conversation;
      }
    },
    autoSaveChat: (state) => {
      const existingSession = state.chatHistory.find(
        (session) => session.sessionid === state.sessionid
      );
      if (existingSession) {
        existingSession.conversation = state.conversation.data;
      } else {
        state.chatHistory.push({
          sessionid: state.sessionid,
          conversation: state.conversation.data
        });
      }
    },
    addSearch: (state, action: PayloadAction<Search>) => {
      if (!state.searches) {
        state.searches = [];
      }
      state.searches.push(action.payload);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(generateTextContent.pending, (state, action) => {
        state.conversation.loading = true;
        state.conversation.error = undefined;

        const outboundTimestamp = new Date().toISOString();
        state.conversation.data.push({
          type: 'outbound',
          message: action.meta.arg.prompt,
          images: action.meta.arg.images,
          timestamp: outboundTimestamp,
        });
      })
      .addCase(generateTextContent.fulfilled, (state, action) => {
        state.conversation.loading = false;

        const inboundTimestamp = new Date().toISOString();
        const inboundMessage: Message = {
          type: 'inbound',
          message: action.payload.text,
          images: action.meta.arg.images,
          timestamp: inboundTimestamp,
        };

        if (action.payload.search) {
          inboundMessage.search = action.payload.search;
        }

        state.conversation.data.push(inboundMessage);
      })
      .addCase(generateTextContent.rejected, (state, action) => {
        state.conversation.loading = false;
        state.conversation.error = action.error.message || 'Error generating content';
      });
  },
});

export const { setUser, clearUser, clearChat, setTheme, setImages, saveChat, loadChat, deleteChat, autoSaveChat, addSearch } = userSlice.actions;
export default userSlice.reducer;
