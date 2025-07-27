import { create } from "zustand";
import { LoginUser } from "../types/loginUser";

type AuthStore = {
  username: string;
  password: string;
  token: string;
  login: (user: LoginUser) => void;
  logout: () => void;
  // register: (user: RegisterUser) => void;
};
export const useAuthStore = create<AuthStore>(set => ({
  username: "",
  password: "",
  token: "",
  login: (user: LoginUser) =>
    set({ username: user.username, password: user.password }),
  logout: () => set({ username: "", password: "", token: "" }),
  // register: user => set({ username: user.username, password: user.password }),
}));
