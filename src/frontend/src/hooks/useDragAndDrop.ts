/**
 * useDragAndDrop — native HTML5 drag-and-drop reorder hook.
 *
 * Works with any list of items that have a string `id`.
 * Returns props to spread onto draggable elements and a pure
 * `reorderItems` function to apply the reorder to your state.
 *
 * CSS classes used:
 *   builder-drag-handle  — cursor affordance for the drag handle
 *   builder-drop-zone    — base class on every draggable item
 *   builder-drop-active  — applied while the item is the active drop target
 *   builder-dragging     — applied to the item currently being dragged
 */

import { useCallback, useRef, useState } from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface DragItemProps {
  draggable: true;
  onDragStart: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragEnd: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  className: string;
  "data-drag-id": string;
}

export interface UseDragAndDropResult<T extends { id: string }> {
  /** ID of the item currently being dragged, or null */
  dragItemId: string | null;
  /** ID of the item currently being hovered over as a drop target */
  dragOverId: string | null;
  /** True while any drag is in progress */
  isDragging: boolean;
  /**
   * Returns props to spread onto each draggable list item.
   * @param id - the item's unique id
   * @param baseClassName - additional class names for the element
   */
  getItemProps: (id: string, baseClassName?: string) => DragItemProps;
  /**
   * Pure function that reorders `items` by moving the item with `fromId`
   * to the position of the item with `toId`.
   */
  reorderItems: (items: T[], fromId: string, toId: string) => T[];
  /** Called by the parent to respond to a drop; passes fromId and toId */
  onReorder: ((fromId: string, toId: string) => void) | null;
  /** Register a callback that fires on every successful reorder */
  setOnReorder: (cb: (fromId: string, toId: string) => void) => void;
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useDragAndDrop<
  T extends { id: string },
>(): UseDragAndDropResult<T> {
  const [dragItemId, setDragItemId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const onReorderRef = useRef<((fromId: string, toId: string) => void) | null>(
    null,
  );

  const setOnReorder = useCallback(
    (cb: (fromId: string, toId: string) => void) => {
      onReorderRef.current = cb;
    },
    [],
  );

  // ---------------------------------------------------------------------------
  // Pure reorder helper
  // ---------------------------------------------------------------------------

  const reorderItems = useCallback(
    (items: T[], fromId: string, toId: string): T[] => {
      if (fromId === toId) return items;
      const fromIdx = items.findIndex((item) => item.id === fromId);
      const toIdx = items.findIndex((item) => item.id === toId);
      if (fromIdx === -1 || toIdx === -1) return items;
      const result = [...items];
      const [moved] = result.splice(fromIdx, 1);
      result.splice(toIdx, 0, moved);
      return result;
    },
    [],
  );

  // ---------------------------------------------------------------------------
  // Event handlers
  // ---------------------------------------------------------------------------

  const getItemProps = useCallback(
    (id: string, baseClassName = ""): DragItemProps => {
      const isBeingDragged = dragItemId === id;
      const isDropTarget = dragOverId === id && dragItemId !== id;

      const classNames = [
        "builder-drop-zone",
        baseClassName,
        isBeingDragged ? "builder-dragging opacity-40 scale-[0.98]" : "",
        isDropTarget
          ? "builder-drop-active ring-2 ring-primary/60 ring-offset-1"
          : "",
      ]
        .filter(Boolean)
        .join(" ");

      return {
        draggable: true,
        "data-drag-id": id,
        className: classNames,
        onDragStart: (e: React.DragEvent) => {
          e.dataTransfer.effectAllowed = "move";
          e.dataTransfer.setData("text/plain", id);
          setDragItemId(id);
        },
        onDragOver: (e: React.DragEvent) => {
          e.preventDefault();
          e.dataTransfer.dropEffect = "move";
          if (dragOverId !== id) setDragOverId(id);
        },
        onDragEnd: (_e: React.DragEvent) => {
          setDragItemId(null);
          setDragOverId(null);
        },
        onDrop: (e: React.DragEvent) => {
          e.preventDefault();
          const fromId = e.dataTransfer.getData("text/plain");
          setDragItemId(null);
          setDragOverId(null);
          if (fromId && fromId !== id && onReorderRef.current) {
            onReorderRef.current(fromId, id);
          }
        },
      };
    },
    [dragItemId, dragOverId],
  );

  return {
    dragItemId,
    dragOverId,
    isDragging: dragItemId !== null,
    getItemProps,
    reorderItems,
    onReorder: onReorderRef.current,
    setOnReorder,
  };
}
