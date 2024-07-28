import { useEffect, useState } from 'react'
import { Draggable } from 'react-beautiful-dnd'
import { ClickedItem } from './hooks/useClickItem'

interface PropsType {
  id: string
  index: number
  content: string
  isError: boolean
  columnIndex: number
  isClickedItems: ClickedItem[]
  isGhosting?: boolean
  onClickItem: (columnIdx: number, id: string) => void
  checkIsClickedItem: (id: string) => boolean
}

export default function Item({
  id,
  index,
  content,
  isError,
  isGhosting,
  columnIndex,
  isClickedItems,
  onClickItem,
  checkIsClickedItem,
}: PropsType) {
  const [viewMultipleCount, setViewMultiple] = useState(0)

  useEffect(() => {
    const multipleCnt = isClickedItems.filter((item) => item.id !== id).length
    setViewMultiple(multipleCnt)
  }, [isClickedItems])

  return (
    <Draggable draggableId={id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`${
            isGhosting ? 'opacity-0' : 'opacity-100'
          } relative flex items-center gap-x-4 p-3 mb-2 bg-white rounded-lg shadow 
          ${
            snapshot.isDragging
              ? isError
                ? 'shadow-lg border-2 border-red-700'
                : 'shadow-lg border-2 border-blue-400'
              : ''
          }
          hover:bg-gray-50 `}
        >
          <div {...provided.dragHandleProps} className="justify-self-end p-[2px] font-semibold">
            =
          </div>
          <input
            type="checkbox"
            id={id}
            checked={checkIsClickedItem(id)}
            onClick={() => onClickItem(columnIndex, id)}
            className="w-4 h-4 p-1 cursor-pointer"
            readOnly
          />
          <p className="text-gray-800">{content}</p>
          {snapshot.isDragging && !!viewMultipleCount && (
            <div className="absolute top-[-10px] right-[-10px] w-6 h-6 flex justify-center items-center border-2 border-blue-300 text-white animate-pulse rounded-full p-4 bg-blue-200">
              {viewMultipleCount}
            </div>
          )}
        </div>
      )}
    </Draggable>
  )
}
