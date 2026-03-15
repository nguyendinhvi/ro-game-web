import { Fragment, type ReactNode } from "react";
import Or from "./Or";

interface IProps<T> {
  items: T[] | undefined;
  renderItem: (item: T, index: number) => ReactNode;
  renderEmpty?: ReactNode;
  className?: string;
}

export default function List<T>({
  items,
  className,
  renderItem,
  renderEmpty,
}: IProps<T>) {
  const renderedItems = items?.map((item, index) => (
    <Fragment key={index}>{renderItem(item, index)}</Fragment>
  ));

  if (items?.length === 0) {
    return renderEmpty;
  }

  return (
    <Or
      condition={!!className}
      true={<div className={className}>{renderedItems}</div>}
      false={<>{renderedItems}</>}
    />
  );
}
