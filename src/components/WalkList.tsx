import { FunctionComponent, JSX } from "preact";
import { useCallback, useRef } from "preact/hooks";
import { Doc } from "../helpers/DomainHelpers";
import { useResizeObserver } from "../hooks/useResizeObserver";
import { useScrollState } from "../hooks/useScrollState";
import { VirtualizedList } from "./VirtualizedList";

export const WalkList: FunctionComponent<{
  walks: Doc[][];
  isPathVisible: boolean;
}> = ({ walks, isPathVisible }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const containerSize = useResizeObserver(containerRef);
  const [scrollState, onScroll] = useScrollState();
  const renderWalk = useCallback(
    (walk: Doc[]): JSX.Element => (
      <ol className="walk">
        {walk.map((doc) => (
          <li key={doc.id} className="walk__item">
            {isPathVisible && (
              <span className="walk__item__path">
                {doc.folderParts.join("/")}
                {doc.folderParts.length > 0 && "/"}
              </span>
            )}
            <span
              className="walk__item__name"
              title={isPathVisible ? "" : doc.searchTarget}
            >
              {doc.name}
            </span>
          </li>
        ))}
      </ol>
    ),
    [isPathVisible]
  );
  return (
    <div
      className="walk-list__container"
      ref={containerRef}
      onScroll={onScroll}
    >
      <VirtualizedList
        itemHeight={16}
        bodyHeight={containerSize.height}
        scrollTop={scrollState.y}
        items={walks}
        itemClassName="walk-list__item"
        renderItemContent={renderWalk}
      />
    </div>
  );
};
