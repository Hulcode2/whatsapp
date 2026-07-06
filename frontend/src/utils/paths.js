export const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
// utils/apiPaths.j
export const API_PATHS = {
  AUTH: {
    LOGIN: "/api/auth/login",

    REGISTER: "/api/auth/signup",
    UPDATE_PROFILE: "/api/auth/update-profile",
    GET_USER: "/api/auth/user-info",
  },
  CHANNEL: {
    CREATE: "/api/channel/create",
    USER_CHANNELS: "/api/channel/user-channels",
    MESSAGES: (channelId) => {
      return `/api/channel/messages/${channelId}`;
    },
  },
  MESSAGES: {
    MESSAGES: "/api/messages/messages",
    UPLOAD_FILE: "/api/messages/upload-file",
  },
  CONTACTS: {
    SEARCH: "/api/contacts/search",
    ALL: "/api/contacts/all",
    DM_CONTACTS: "/api/contacts/dm-contacts",
  },
};
