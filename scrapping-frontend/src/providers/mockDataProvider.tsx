import type { DataProvider } from "@refinedev/core";

const API_URL = "http://localhost:3000";

export const dataProvider: DataProvider = {
  getOne: async ({ resource, id, meta }) => {
    const response = await fetch(`${API_URL}/${resource}/details/${id}`);

    if (response.status < 200 || response.status > 299) throw response;

    const data = await response.json();

    return { data };
  },
  update: async ({ resource, id, variables }) => {
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
    const params = new URLSearchParams();
    const current = pagination?.current ?? 1;
    const pageSize = pagination?.pageSize ?? 10;

    params.append("page", String(current));
    params.append("offset", String(pageSize));
    for (const filter of filters || []) {
      params.append(filter?.field, filter?.value);
    }
    for (const sorter of sorters || []) {
      params.append("sort_field", sorter.field);
      params.append("sort_order", sorter.order);
    }
    const response = await fetch(`${API_URL}/${resource}/list?${params.toString()}`);

    if (response.status < 200 || response.status > 299) throw response;

    const responseData = await response.json();

    if (current !== undefined && pageSize !== undefined) {
      const { body, metadata } = responseData ?? { body: [], metadata: {} };

      return {
        data: body,
        total: metadata?.total,
        page: metadata?.page,
        hasNextPage: metadata?.hasNextPage
      };
    }
    else {
      return { data: responseData, total: 0, page: 0, hasNextPage: false };
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

    console.log(variables)

    if (response.status < 200 || response.status > 299) throw response;

    const data = await response.json();

    return {
      data,
    };
  },
  deleteOne: async () => {

  }
};