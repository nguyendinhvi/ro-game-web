import { useEffect, useRef, useState } from "react";
import { useToggle } from "./useToggle";

type DebouncedFn = ((e: Event) => void) & { cancel?: () => void };

function debounce(fn: (e: Event) => void, ms: number): DebouncedFn {
  let timer: ReturnType<typeof setTimeout> | undefined;

  const debounced = ((e: Event) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => fn(e), ms);
  }) as DebouncedFn;

  debounced.cancel = () => {
    if (timer) clearTimeout(timer);
  };

  return debounced;
}

interface IUseInfiniteScrollOptions<T> {
  containerId: string;
  onLoadMore: () => Promise<T[] | null | undefined>;
  dependency?: string;
  onReset?: () => void;
}

export function useInfiniteScroll<T>({
  containerId,
  onLoadMore,
  dependency = "",
  onReset,
}: IUseInfiniteScrollOptions<T>) {
  const isFullRef = useRef(false);
  const [items, setItems] = useState<T[]>();
  const toggleLoad = useToggle();

  const loadData = async () => {
    try {
      toggleLoad.open();
      const newItems = await onLoadMore();

      if (!newItems) return;

      if (newItems.length === 0) {
        isFullRef.current = true;
      }

      setItems((prev) => (prev ?? []).concat(newItems));
    } catch {
      // Error handling delegated to onLoadMore caller
    } finally {
      toggleLoad.close();
    }
  };

  const onScroll = (e: Event) => {
    const target = e.target as HTMLElement;
    if (!target) return;

    const scrollTop = target.scrollTop;
    const scrollHeight = target.scrollHeight;
    const clientHeight = target.clientHeight;
    const isScrollToBottom = scrollTop + clientHeight + 100 >= scrollHeight;

    if (isScrollToBottom && !toggleLoad.isOpen && !isFullRef.current) {
      void loadData();
    }
  };

  useEffect(() => {
    const scrollWrapper = document.getElementById(containerId);
    if (!scrollWrapper) return;

    const handleScroll = debounce(onScroll, 100);
    scrollWrapper.addEventListener("scroll", handleScroll);

    return () => {
      scrollWrapper.removeEventListener("scroll", handleScroll);
      handleScroll.cancel?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [containerId]);

  useEffect(() => {
    if (!dependency) {
      void loadData();
    } else {
      isFullRef.current = false;
      onReset?.();
      setItems(undefined);
      void loadData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dependency]);

  return {
    items,
    isLoading: toggleLoad.isOpen,
    isFull: isFullRef.current,
    setItems,
  };
}
