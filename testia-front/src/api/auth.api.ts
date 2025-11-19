import api from "@/lib/axios";
import { AuthResponse } from "@/types/auth";

export const AuthAPI = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const res = await api.post("/api/v1/auth/login", { email, password });
    return res.data;
  },

  register: async (fullName: string, email: string, password: string): Promise<AuthResponse> => {
    const res = await api.post("/api/v1/auth/register", {
      fullName,
      email,
      password,
      role: "ROLE_CANDIDATE",
    });
    return res.data;
  },

  acceptInvite: async (inviteToken: string, password: string): Promise<AuthResponse> => {
    const res = await api.post("/api/v1/auth/invite/complete", {
      inviteToken,
      password,
    });
    return res.data;
  }
};
