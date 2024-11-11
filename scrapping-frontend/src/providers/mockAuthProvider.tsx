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

    const data = await response.json();
    return data.success === false ?
      Promise.resolve({ success: false }) :
      Promise.resolve({ success: true, token: data.token });
  },
  check: async (params) => {
    if (localStorage.getItem("auth_token")) {
      const token = localStorage.getItem("auth_token");
      const response = await fetch(`${API_URL}/account/check?token=${token}`, {
        method: "get",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status < 200 || response.status > 299) throw response;

      const data = await response.json();
      if (data.ok) {
        localStorage.setItem("auth_usermail", data.email);
        return { authenticated: true };
      }
      else {
        return { authenticated: false };
      }
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