import { create } from "zustand";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/paths";
const useChatStore = create((set) => ({
  // which contact or channel is open
  selectedChatType: null, // 'contact' or 'channel'
  selectedChatData: null, // the full contact/channel object
  isLoading: true,
  dmContacts: [],
  channels: [],

  messages: [],
  getChannelMessages: async (channelId) => {
    try {
      const { data } = await axiosInstance.get(
        API_PATHS.CHANNEL.MESSAGES(channelId),
      );

      set({ messages: data.channel.messages, isLoading: false });
    } catch (err) {
      console.error(err);
      set({
        messages: [],
        isLoading: false,
      });
    }
  },
  getUserDm: async () => {
    try {
      const { data } = await axiosInstance.get(API_PATHS.CONTACTS.DM_CONTACTS);

      set({ dmContacts: data.contacts, isLoading: false });
    } catch (err) {
      console.error(err);
      set({
        dmContacts: null,
        isLoading: false,
      });
    }
  },

  getUserChannels: async () => {
    try {
      const { data } = await axiosInstance.get(API_PATHS.CHANNEL.USER_CHANNELS);

      set({ channels: data.channels, isLoading: false });
    } catch (err) {
      console.error(err);
      set({
        channels: null,
        isLoading: false,
      });
    }
  },

  setSelectedChat: (type, data) => {
    set({
      selectedChatType: type,
      selectedChatData: data,
      messages: [], // clear messages when switching chats
    });
  },
  setDmContacts: (contacts) => set({ dmContacts: contacts }),
  setChannels: (channels) => set({ channels: channels }),

  setMessages: (messages) => set({ messages: messages }),
  getMessages: async (recipientId) => {
    const { data } = await axiosInstance.post(API_PATHS.MESSAGES.MESSAGES, {
      recipientId,
    });

    set({ messages: data.data });
  },

  addMessage: (message) =>
    set((state) => ({
      messages: [...(state.messages || []), message],
    })),
  clearChatStore: () =>
    set({
      selectedChatData: null,
      selectedChatType: null,
      messages: [],
      dmContacts: [],
      channels: [],
    }),
}));

export default useChatStore;
