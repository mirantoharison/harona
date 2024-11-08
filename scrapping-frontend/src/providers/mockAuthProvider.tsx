import { AuthProvider } from "@refinedev/core";
import { dataProvider } from "./mockDataProvider";

const API_URL = dataProvider.getApiUrl();

export const authProvider: AuthProvider = {
  login: async (params) => {
    const response = await fetch(`${API_URL}/account/verify`, {
      method: "post",
      body: JSON.stringify(params),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status < 200 || response.status > 299) throw response;

    if (params.save) localStorage.setItem("auth_save", String(1));
    else localStorage.removeItem("auth_save");

    const data = await response.json();

    return Promise.resolve({ success: true, token: data.token });
  },
  check: async (params) => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      const response = await fetch(`${API_URL}/account/check?token=${token}`, {
        method: "get",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status < 200 || response.status > 299) throw response;

      const data = await response.json();
      localStorage.setItem("auth_usermail", data.email);

      return { authenticated: true };
    }

    return {
      authenticated: false,
      redirectTo: "/login",
    };
  },
  logout: () => {
    localStorage.removeItem("auth_token");
    if (!localStorage.getItem("auth_save")) {
      localStorage.removeItem("auth_usermail");
    }
    return Promise.resolve({
      success: true,
      redirectTo: "/login",
    });
  },
  onError: async (error) => {
    console.error(error);
    return { error };
  },
  register: async (params) => {
    const response = await fetch(`${API_URL}/account/create`, {
      method: "post",
      body: JSON.stringify(params),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status < 200 || response.status > 299) throw response;

    const data = await response.json();

    return { success: true, data };
  },
  getIdentity: () => Promise.resolve({ email: localStorage.getItem("auth_usermail") }),
};