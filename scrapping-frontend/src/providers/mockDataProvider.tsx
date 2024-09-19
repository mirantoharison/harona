import type { DataProvider } from "@refinedev/core";

const API_URL = "http://localhost:3000";

export const dataProvider: DataProvider = {
  getOne: async ({ resource, id, meta }) => {
    const response = await fetch(`${API_URL}/${resource}/details/${id}`);

    if (response.status < 200 || response.status > 299) throw response;

    console.log(response)
    const data = await response.json();

    return { data };
  },
  update: async ({ resource, id, variables }) => {
    const response = await fetch(`${API_URL}/${resource}/${id}`, {
      method: "put",
      body: JSON.stringify(variables),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status < 200 || response.status > 299) throw response;

    const data = await response.json();

    return { data };
  },
  getList: async ({ resource, pagination, filters, sorters, meta }) => {
    const params = new URLSearchParams();
    const current = pagination?.current ?? 1;
    const pageSize = pagination?.pageSize ?? 10;

    const response = await fetch(`${API_URL}/${resource}/list?${params.toString()}`);

    if (response.status < 200 || response.status > 299) throw response;

    const data = await response.json();
    console.log(data);

    return {
      data,
      total: 0, // We'll cover this in the next steps.
    };
  },
  create: async ({ resource, variables }) => {
    const response = await fetch(`${API_URL}/${resource}/add`, {
      method: "post",
      body: JSON.stringify(variables),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status < 200 || response.status > 299) throw response;

    const data = await response.json();

    return {
      data,
    };
  },
};