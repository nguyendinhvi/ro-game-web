import { ReactNode, useEffect, useRef, useState } from "react";
import { List } from "@/components";
import { mergeClass } from "@/utils";

interface MasonryProps<T> {
  columns: number;
  list: T[] | undefined;
  renderItem: (item: T, index: number) => ReactNode;
  wrapperId?: string;
  className?: string;
  columnClassName?: string;
}

interface ItemWithColumn<T> {
  item: T;
  col: number;
  index: number;
}

interface IdentifiableItem {
  _id?: string | number;
  id?: string | number;
}

const Masonry = <T,>({
  columns,
  list,
  renderItem,
  wrapperId,
  className = "",
  columnClassName = "masonry-column",
}: MasonryProps<T>) => {
  const [itemsWithColumn, setItemsWithColumn] = useState<ItemWithColumn<T>[]>(
    [],
  );

  const itemsWithColumnRef = useRef<ItemWithColumn<T>[]>([]);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const currentIndexRef = useRef<number>(0);

  itemsWithColumnRef.current = itemsWithColumn;

  const areItemsEqual = (item1: T, item2: T): boolean => {
    // Handle null/undefined cases
    if (item1 == null || item2 == null) {
      return item1 === item2;
    }

    const type1 = typeof item1;
    const type2 = typeof item2;

    // If types don't match, they're not equal
    if (type1 !== type2) {
      return false;
    }

    // Handle based on type
    switch (type1) {
      case "object": {
        // Both are objects (not null)
        const a = item1 as IdentifiableItem;
        const b = item2 as IdentifiableItem;

        // Check if both have _id and they match
        if (a?._id && b?._id) {
          return a._id === b._id;
        }

        // Check if both have id and they match
        if (a?.id && b?.id) {
          return a.id === b.id;
        }

        // If both id and _id are undefined/null, they are not equal
        const aHasId = a?._id || a?.id;
        const bHasId = b?._id || b?.id;
        if (!aHasId && !bHasId) {
          return false;
        }

        // Fallback to reference equality for objects
        return item1 === item2;
      }

      case "string":
      case "number":
      case "boolean":
      case "bigint":
      case "symbol":
        // For primitive types, use strict equality
        return item1 === item2;

      case "function":
        // For functions, use reference equality
        return item1 === item2;

      default:
        // Fallback to reference equality
        return item1 === item2;
    }
  };

  const processNextItem = async (item: T, to: "head" | "tail") => {
    // if (currentIndexRef.current >= list.length || !wrapperRef.current) return;

    // Wait for DOM to update
    await new Promise((resolve) => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setTimeout(resolve, 50);
        });
      });
    });

    if (!wrapperRef.current) return;

    const currentIndex = currentIndexRef.current;

    // Get current column heights
    const columnElements: HTMLElement[] = [];
    for (let i = 0; i < columns; i++) {
      const col = wrapperRef.current.querySelector(
        `.${columnClassName}:nth-child(${i + 1})`,
      ) as HTMLElement;
      if (col) {
        columnElements.push(col);
      }
    }

    // Find column with minimum height
    const heights = columnElements.map((col) => col.offsetHeight);
    const minHeight = Math.min(...heights);
    const colIndex = heights.indexOf(minHeight);

    // Assign current item to shortest column
    setItemsWithColumn((prev) => {
      if (prev?.some((e) => areItemsEqual(e.item, item))) {
        return prev;
      }

      return to === "head"
        ? [{ item, col: colIndex, index: currentIndex }, ...prev]
        : [...prev, { item, col: colIndex, index: currentIndex }];
    });
  };

  const itemExists = (item: T, items: ItemWithColumn<T>[]): boolean => {
    return items.some((e) => areItemsEqual(e.item, item));
  };

  const init = async () => {
    const current = itemsWithColumnRef.current;
    const newItems = list?.filter((item) => !itemExists(item, current)) || [];
    const deletedItems = current?.filter(
      (itemWithCol) => !list?.some((item) => itemExists(item, [itemWithCol])),
    );

    // DELETE: Remove deleted items
    if (deletedItems.length > 0) {
      setItemsWithColumn((prev) =>
        prev.filter((itemWithCol) =>
          list?.some((item) => areItemsEqual(item, itemWithCol.item)),
        ),
      );
    }

    // ADD: Add new items
    if (newItems.length > 0) {
      const isInit = current.length === 0;
      const to = isInit
        ? "tail"
        : list?.indexOf(newItems[0]) === 0
          ? "head"
          : "tail";
      for (const item of newItems) {
        await processNextItem(item, to);
      }
    }
  };

  useEffect(() => {
    init();
  }, [list]);

  return (
    <div
      ref={wrapperRef}
      id={wrapperId}
      style={{
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
      }}
      className={`masonry-wrapper ${className}`}
    >
      <List
        items={Array.from({ length: columns })}
        renderItem={(_, colIndex) => (
          <div className={mergeClass("masonry-column", columnClassName)}>
            <List
              items={itemsWithColumn.filter(
                (itemWithCol) => itemWithCol.col === colIndex,
              )}
              renderItem={(itemWithCol) =>
                renderItem(itemWithCol.item, itemWithCol.index)
              }
            />
          </div>
        )}
      />
    </div>
  );
};

export default Masonry;
