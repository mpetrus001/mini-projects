type Config = {
  method: "POST" | "GET";
  headers: any;
  body?: any;
  signal: AbortSignal;
};

export default function client(
  endpoint: String,
  { body, ...customConfig }: any = {}
) {
  const controller = new AbortController();
  const headers = { "content-type": "application/json" };
  const config: Config = {
    method: body ? "POST" : "GET",
    ...customConfig,
    headers,
    signal: controller.signal,
  };
  if (body) {
    config.body = JSON.stringify(body);
  }

  return {
    fetch: () =>
      window.fetch(`${endpoint}`, config).then(async (response) => {
        const data = await response.json();
        if (response.ok) {
          return data;
        } else {
          return Promise.reject(data);
        }
      }),
    controller,
  };
}
