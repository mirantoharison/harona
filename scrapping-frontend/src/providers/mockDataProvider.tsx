import type { BaseRecord, CrudFilter, DataProvider, DeleteOneResponse } from "@refinedev/core";
import getApiUrl from "../config";

const API_URL = getApiUrl();

export const dataProvider: DataProvider = {
  getApiUrl: () => API_URL,
  getOne: async ({ resource, id, meta }) => {
    const response = await fetch(`${API_URL}/${resource}/details/${id}`);

    if (response.status < 200 || response.status > 299) throw response;

    const data = await response.json();

    return { data };
  },
  update: async ({ resource, id, variables }) => {
    console.log("update")
    const response = await fetch(`${API_URL}/${resource}/update/${id}`, {
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
    try {
      const params = new URLSearchParams();
      const current = pagination?.current ?? 1;
      const pageSize = pagination?.pageSize ?? 10;

      params.append("page", String(current));
      params.append("offset", String(pageSize));
      for (let filter of (filters as Array<{ field: string; value: any }>) || []) {
        params.append(filter.field, filter.value);
      }
      for (const sorter of sorters || []) {
        params.append("sort_field", sorter.field);
        params.append("sort_order", sorter.order);
      }

      const response = await fetch(`${API_URL}/${resource}/list?${params.toString()}`);
      if (!response.ok) throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      const responseData = await response.json()
      const { body, metadata } = responseData ?? { body: [], metadata: {} };

      return {
        data: body,
        total: metadata?.total ?? 0,
        page: metadata?.page ?? current,
        hasNextPage: metadata?.hasNextPage ?? false,
      };
    } catch (error) {
      throw error;
    }
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
  deleteOne: async ({ resource, id }) => {
    const response = await fetch(`${API_URL}/${resource}/delete/${id}`, {
      method: "DELETE",
    });

    if (response.status < 200 || response.status > 299) throw response;

    const data = await response.json();

    return { data };
  },
  custom: async ({
    url,
    method,
    filters,
    sorters,
    payload,
    query,
    headers,
    meta,
  }) => {
    try {
      interface Query {
        [key: string]: string | number | boolean;
      }
      
      let params: string[] = [];
      for (const [key, value] of Object.entries(query as Query)) {
        params.push(`${key}=${value.toString()}`);
      }

      const response = await fetch(`${url}?${params.join("&")}`);

      if (response.status < 200 || response.status > 299) throw response;
  
      const data = await response.json();

      return data;
    }
    catch (err) {
      throw err;
    }
  }
};