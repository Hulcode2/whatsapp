import { create } from "zustand";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/paths";
const useAuthStore = create((set) => ({
  // state
  userInfo: null,
  isLoading: true,
  // set the whole user object after login/signup
  setUserInfo: (user) => set({ userInfo: user }),

  // clear the user on logout
  clearUser: () => set({ userInfo: null }),

  // update just one field without replacing the whole user
  updateUser: (fields) =>
    set((state) => ({
      userInfo: { ...state.userInfo, ...fields },
    })),
  getUser: async () => {
    try {
      const { data } = await axiosInstance.get(API_PATHS.AUTH.GET_USER);

      set({ userInfo: data.user, isLoading: false });
    } catch (err) {
      console.error(err);
      set({
        userInfo: null,
        isLoading: false,
      });
    }
  },
}));

export default useAuthStore;
