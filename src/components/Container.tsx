import React from 'react'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'
import { ItemsType } from './types'
import { useDrag } from './hooks/useDrag'
import Item from './Item'
import { useClickItem } from './hooks/useClickItem'

export default function Container() {
  const { onClickItem, checkIsClickedItem, isClickedItems, setIsClickedItems } = useClickItem()
  const { items, isError, onDragEnd, onDragUpdate, onDragStart } = useDrag(
    isClickedItems,
    setIsClickedItems
  )
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8 text-center text-blue-500">Todo</h1>
      <DragDropContext onDragEnd={onDragEnd} onDragUpdate={onDragUpdate} onDragStart={onDragStart}>
        <div className="flex justify-center space-x-4 overflow-x-auto pb-8">
          {items.map(({ id, name, contents }: ItemsType, columnIndex: number) => (
            <div key={id} className="flex-shrink-0 w-[300px]">
              <div className="bg-blue-100 rounded-lg shadow-md">
                <p
                  className={`text-lg font-semibold p-3 ${
                    columnIndex === 0 ? 'bg-red-600' : `bg-blue-${400 - columnIndex * 100}`
                  } rounded-t-lg text-white border-[1px] border-gray-100`}
                >
                  {name}
                </p>
                <Droppable droppableId={`${columnIndex}`}>
                  {(provided, snapshot) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className={`p-2 rounded-b-lg min-h-screen overflow-y-scroll ${
                        snapshot.isDraggingOver ? 'bg-blue-200' : ''
                      }`}
                    >
                      {contents.map(({ id, content, isGhosting }, index) => (
                        <Item
                          key={id}
                          id={id}
                          index={index}
                          content={content}
                          isError={isError}
                          isGhosting={isGhosting}
                          columnIndex={columnIndex}
                          onClickItem={onClickItem}
                          isClickedItems={isClickedItems}
                          checkIsClickedItem={checkIsClickedItem}
                        />
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  )
}
