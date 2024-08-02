import { Dispatch, SetStateAction, useCallback, useState } from 'react'
import { DragStart, DragUpdate, DropResult } from 'react-beautiful-dnd'
import { ItemsType } from '../types'
import { ITEMS } from '../constants'
import { checkValidate } from '../util/checkValidate'
import { ClickedItem } from './useClickItem'

export const useDrag = (
  isClickedItems: ClickedItem[],
  setIsClickedItems: Dispatch<SetStateAction<ClickedItem[]>>
) => {
  const [items, setItems] = useState<ItemsType[]>(ITEMS)
  const [isError, setIsError] = useState(false)

  const onDragEnd = useCallback(
    (result: DropResult) => {
      const { source, destination, draggableId } = result
      if (!destination) {
        return
      }

      const sourceColumnIndex = parseInt(source.droppableId)
      const destColumnIndex = parseInt(destination.droppableId)
      const sourceItemIndex = source.index
      const destItemIndex = destination.index

      const isDraggingItemSelected = isClickedItems.some(
        (item) => item.id === draggableId && item.columnIdx === sourceColumnIndex
      )

      if (isDraggingItemSelected && isClickedItems.length >= 1) {
        // 멀티 드래그 로직
        if (sourceColumnIndex === destColumnIndex) {
          // 드래그 위치가 같을 때
          const newItems = [...items]
          const columnItems = newItems[sourceColumnIndex].contents

          const selectedItemIndices = isClickedItems
            .filter((item) => item.columnIdx === sourceColumnIndex)
            .map((item) => columnItems.findIndex((colItem) => colItem.id === item.id))
            .sort((a, b) => a - b)

          // 선택된 아이템들을 배열에서 제거
          const movedItems = selectedItemIndices.map(
            (index, i) => columnItems.splice(index - i, 1)[0]
          )

          // 원래 순서대로 아이템들을 다시 삽입
          selectedItemIndices.forEach((originalIndex, i) => {
            columnItems.splice(originalIndex, 0, { ...movedItems[i], isGhosting: false })
          })

          newItems[sourceColumnIndex] = { ...newItems[sourceColumnIndex], contents: columnItems }
          setItems(newItems)
          setIsClickedItems([])
          return
        }
        const newItems = [...items]
        const sourceItems = newItems[sourceColumnIndex].contents
        const destItems = newItems[destColumnIndex].contents

        const selectedItemsInSourceColumn = isClickedItems.filter(
          (item) => item.columnIdx === sourceColumnIndex
        )

        // 선택된 모든 아이템을 source에서 제거
        const movedItems = selectedItemsInSourceColumn.map((item) => {
          const index = sourceItems.findIndex((sourceItem) => sourceItem.id === item.id)
          return sourceItems.splice(index, 1)[0]
        })

        // destination에 선택된 아이템들 삽입
        destItems.splice(destination.index, 0, ...movedItems)

        // 새로운 배열 생성
        newItems[sourceColumnIndex] = {
          ...newItems[sourceColumnIndex],
          contents: sourceItems.map((content) => ({ ...content, isGhosting: false })),
        }
        newItems[destColumnIndex] = {
          ...newItems[destColumnIndex],
          contents: destItems.map((content) => ({ ...content, isGhosting: false })),
        }

        setItems(newItems)

        // 선택된 아이템들 초기화
        setIsClickedItems([])
      } else if (sourceColumnIndex === destColumnIndex) {
        // 같은 컬럼 내에서 이동
        const newContents = items[sourceColumnIndex].contents
        const [reorderedItem] = newContents.splice(source.index, 1)
        newContents.splice(destination.index, 0, reorderedItem)

        const newItems = [...items]
        newItems[sourceColumnIndex] = {
          ...newItems[sourceColumnIndex],
          contents: newContents.map((content) => ({ ...content, isGhosting: false })),
        }
        setItems(newItems)
      } else {
        // 다른 컬럼으로 이동

        if (sourceColumnIndex === 0 && destColumnIndex === 2) return
        else if (
          (sourceItemIndex + 1) % 2 === 0 && // 끄는 아이템이 짝수 아이템
          destItemIndex !== 0 && // 도착 아이템 인덱스가 0이 아님
          (destItemIndex + 1) % 2 === 0 && // 도착지의 itemIndex가 짝수
          destItemIndex !== items[destColumnIndex].contents.length
        ) {
          return
        }

        const sourceContents = items[sourceColumnIndex].contents
        const destContents = items[destColumnIndex].contents
        const [movedItem] = sourceContents.splice(source.index, 1)
        destContents.splice(destination.index, 0, movedItem)

        const newItems = [...items]
        newItems[sourceColumnIndex] = {
          ...newItems[sourceColumnIndex],
          contents: sourceContents.map((content) => ({ ...content, isGhosting: false })),
        }
        newItems[destColumnIndex] = {
          ...newItems[destColumnIndex],
          contents: destContents.map((content) => ({ ...content, isGhosting: false })),
        }
        setItems(newItems)
      }
    },

    [items, isClickedItems]
  )
  const onDragUpdate = (dragEvent: DragUpdate) => {
    const { source, destination } = dragEvent
    const sourceColumnIndex = parseInt(source.droppableId)
    const sourceItemIndex = source.index
    if (destination) {
      const destColumnIndex = parseInt(destination.droppableId)
      const destItemIndex = destination.index
      checkValidate(
        sourceColumnIndex,
        destColumnIndex,
        sourceItemIndex,
        destItemIndex,
        items,
        isClickedItems,
        setIsError
      )
    }
  }
  const onDragStart = (start: DragStart) => {
    const { source, draggableId } = start

    const sourceColumnIndex = parseInt(source.droppableId)

    if (isClickedItems.length > 0) {
      const newItems = items.map((column, colIndex) => {
        if (colIndex === sourceColumnIndex) {
          return {
            ...column,
            contents: column.contents.map((item) => {
              const isClicked = isClickedItems.some(
                (clickedItem) =>
                  clickedItem.columnIdx === sourceColumnIndex && clickedItem.id === item.id
              )

              const isDragged = item.id === draggableId

              return {
                ...item,
                isGhosting: isClicked && !isDragged,
              }
            }),
          }
        }
        return column
      })

      setItems(newItems)
    }
  }

  return { items, isError, setItems, onDragEnd, onDragUpdate, onDragStart }
}
