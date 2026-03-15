import { useEffect, useState } from "react";

type FetchStatus = "init" | "loading" | "success" | "error";

export const useFetch = <T>(
  callback: () => Promise<T>,
  dependencies: unknown[] = [],
  condition: boolean | (() => boolean) = true,
  resolve?: (data: T | undefined | null) => void,
  onError?: (error: unknown) => void,
) => {
  const [data, setData] = useState<T>();
  const [status, setStatus] = useState<FetchStatus>("init");
  const [error, setError] = useState<unknown>(null);

  const shouldRun = typeof condition === "function" ? condition() : condition;

  const fetchData = async () => {
    if (!shouldRun) return;
    try {
      setStatus("loading");
      setError(null);
      const resData = await callback();
      setData(resData);
      setStatus("success");
      resolve?.(resData);
    } catch (err) {
      setStatus("error");
      setError(err);
      onError?.(err);
    }
  };

  useEffect(() => {
    void fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  return { data, status, error, setData };
};
