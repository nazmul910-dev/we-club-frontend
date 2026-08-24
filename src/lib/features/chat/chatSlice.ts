import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

import { Message, Room, TypingUser } from "@/types/chat";
import { getCountryRoom, getGeneralRoom, getMessageHistory } from "./chatApi";

interface ChatState {
  room: Room | null;
  messages: Message[];
  typingUsers: TypingUser[];
  onlineUserIds: string[];
  isLoadingRoom: boolean;
  isLoadingHistory: boolean;
  error: string | null;
}

const initialState: ChatState = {
  room: null,
  messages: [],
  typingUsers: [],
  onlineUserIds: [],
  isLoadingRoom: false,
  isLoadingHistory: false,
  error: null,
};

export const fetchGeneralRoom = createAsyncThunk<
  Room,
  void,
  { rejectValue: string }
>("chat/fetchGeneralRoom", async (_, { rejectWithValue }) => {
  try {
    return await getGeneralRoom();
  } catch (err) {
    if (axios.isAxiosError(err)) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to load room",
      );
    }
    return rejectWithValue("Unexpected error");
  }
});

export const fetchCountryRoom = createAsyncThunk<
  Room,
  string,
  { rejectValue: string }
>("chat/fetchCountryRoom", async (countryName, { rejectWithValue }) => {
  try {
    return await getCountryRoom(countryName);
  } catch (err) {
    if (axios.isAxiosError(err)) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to load country room",
      );
    }
    return rejectWithValue("Unexpected error");
  }
});

export const fetchMessageHistory = createAsyncThunk<
  Message[],
  string,
  { rejectValue: string }
>("chat/fetchMessageHistory", async (roomId, { rejectWithValue }) => {
  try {
    return await getMessageHistory(roomId);
  } catch (err) {
    if (axios.isAxiosError(err)) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to load messages",
      );
    }
    return rejectWithValue("Unexpected error");
  }
});

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    messageReceived: (state, action: PayloadAction<Message>) => {
      if (!state.messages.some((message) => message._id === action.payload._id)) {
        state.messages.push(action.payload);
      }
      // if the sender was shown as typing, clear it now that their message arrived
      state.typingUsers = state.typingUsers.filter(
        (t) => t.userId !== action.payload.sender._id,
      );
    },

    messageDeleted: (
      state,
      action: PayloadAction<{ messageId: string; content: string }>,
    ) => {
      const msg = state.messages.find(
        (m) => m._id === action.payload.messageId,
      );
      if (msg) {
        msg.isDeleted = true;
        msg.content = action.payload.content; // "This message was deleted"
      }
    },

    typingUpdated: (
      state,
      action: PayloadAction<{
        userId: string;
        fullName: string;
        typing: boolean;
      }>,
    ) => {
      const { userId, fullName, typing } = action.payload;
      const exists = state.typingUsers.some((t) => t.userId === userId);

      if (typing && !exists) {
        state.typingUsers.push({ userId, fullName });
      } else if (!typing && exists) {
        state.typingUsers = state.typingUsers.filter(
          (t) => t.userId !== userId,
        );
      }
    },

    presenceListSet: (state, action: PayloadAction<string[]>) => {
      state.onlineUserIds = action.payload;
    },

    presenceUpdated: (
      state,
      action: PayloadAction<{ userId: string; online: boolean }>,
    ) => {
      const { userId, online } = action.payload;

      if (online && !state.onlineUserIds.includes(userId)) {
        state.onlineUserIds.push(userId);
      } else if (!online) {
        state.onlineUserIds = state.onlineUserIds.filter((id) => id !== userId);
      }
    },

    chatReset: () => initialState,
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchGeneralRoom.pending, (state) => {
        state.isLoadingRoom = true;
        state.error = null;
      })
      .addCase(fetchGeneralRoom.fulfilled, (state, action) => {
        state.isLoadingRoom = false;
        state.room = action.payload;
      })
      .addCase(fetchGeneralRoom.rejected, (state, action) => {
        state.isLoadingRoom = false;
        state.error = action.payload ?? "Failed to load room";
      })
      .addCase(fetchCountryRoom.pending, (state) => {
        state.isLoadingRoom = true;
        state.error = null;
      })
      .addCase(fetchCountryRoom.fulfilled, (state, action) => {
        state.isLoadingRoom = false;
        state.room = action.payload;
      })
      .addCase(fetchCountryRoom.rejected, (state, action) => {
        state.isLoadingRoom = false;
        state.error = action.payload ?? "Failed to load country room";
      })

      .addCase(fetchMessageHistory.pending, (state) => {
        state.isLoadingHistory = true;
      })
      .addCase(fetchMessageHistory.fulfilled, (state, action) => {
        state.isLoadingHistory = false;
        const liveMessages = state.messages.filter(
          (message) => message.room === action.meta.arg,
        );
        const messagesById = new Map(
          [...action.payload, ...liveMessages].map((message) => [
            message._id,
            message,
          ]),
        );

        state.messages = Array.from(messagesById.values()).sort(
          (first, second) =>
            new Date(first.createdAt).getTime() -
            new Date(second.createdAt).getTime(),
        );
      })
      .addCase(fetchMessageHistory.rejected, (state, action) => {
        state.isLoadingHistory = false;
        state.error = action.payload ?? "Failed to load messages";
      });
  },
});

export const {
  messageReceived,
  messageDeleted,
  typingUpdated,
  presenceListSet,
  presenceUpdated,
  chatReset,
} = chatSlice.actions;

export default chatSlice.reducer;
