import { JSX } from "preact";
import { useMemo } from "preact/hooks";
import { memo } from "preact/compat";
import "./VirtualizedList.css";

interface VirtualizedListProps<ItemType> {
  scrollTop: number;
  itemHeight: number;
  bodyHeight: number;
  renderItemContent: (item: ItemType) => JSX.Element;
  items: ItemType[];
  itemClassName?: string;
  bumperCount?: number;
  ordered?: boolean;
}

export function VirtualizedList<ItemType>({
  scrollTop,
  itemHeight,
  bodyHeight,
  renderItemContent,
  items,
  itemClassName = "",
  bumperCount = 3,
  ordered = false,
}: VirtualizedListProps<ItemType>) {
  const firstVisibleIndex = Math.floor(scrollTop / itemHeight);
  const itemsOnScreen = Math.ceil(bodyHeight / itemHeight) + 1;

  const startIndex = Math.max(0, firstVisibleIndex - bumperCount);
  const endIndex = Math.min(
    items.length,
    firstVisibleIndex + itemsOnScreen + bumperCount,
  );

  const itemsToRender = useMemo(
    () => items.slice(startIndex, endIndex),
    [items, startIndex, endIndex],
  );

  return (
    <VirtualizedListInner
      bodyHeight={bodyHeight}
      itemHeight={itemHeight}
      itemCount={items.length}
      itemsToRender={itemsToRender}
      itemClassName={itemClassName}
      renderItemContent={renderItemContent}
      indexOffset={startIndex}
      ordered={ordered}
    />
  );
}

interface VirtualizedListInnerProps<ItemType> {
  itemHeight: number;
  itemCount: number;
  bodyHeight: number;
  itemsToRender: ItemType[];
  indexOffset: number;
  ordered: boolean;
  itemClassName: string;
  renderItemContent: (item: ItemType) => JSX.Element;
}

const VirtualizedListInner = memo(
  ({
    itemHeight,
    itemCount,
    bodyHeight,
    itemsToRender,
    indexOffset,
    itemClassName,
    ordered,
    renderItemContent,
  }: VirtualizedListInnerProps<any>) => {
    const ListElement = ordered ? "ol" : "ul";
    return (
      <ListElement
        className="virtualized-list"
        style={{
          "--item-height": itemHeight,
          "--item-count": itemCount,
          "--body-height": bodyHeight,
        }}
      >
        {itemsToRender.map((item, index) => (
          <li
            key={indexOffset + index}
            data-is-even={(indexOffset + index) % 2 === 0}
            data-is-odd={(indexOffset + index) % 2 === 1}
            className={`virtualized-list__item ${itemClassName}`}
            style={{ "--item-index": indexOffset + index }}
          >
            {renderItemContent(item)}
          </li>
        ))}
      </ListElement>
    );
  },
);
