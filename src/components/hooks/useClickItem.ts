import { useState } from 'react'

export interface ClickedItem {
  columnIdx: number
  id: string
}

export const useClickItem = () => {
  const [isClickedItems, setIsClickedItems] = useState<ClickedItem[]>([])
  const onClickItem = (columnIdx: number, id: string) => {
    if (!isClickedItems.length) setIsClickedItems([...isClickedItems, { columnIdx, id }])
    else {
      isClickedItems.forEach((item) => {
        if (item.id !== id) {
          if (item.columnIdx !== columnIdx) return
          const newItem = { columnIdx, id }
          setIsClickedItems([...isClickedItems, newItem])
        } else {
          const newItem = isClickedItems.filter((item) => item.id !== id)
          setIsClickedItems(newItem)
        }
      })
    }
  }

  const checkIsClickedItem = (id: string) => {
    let isChecked = false
    isClickedItems.forEach((item) => {
      if (item.id === id) {
        isChecked = true
      }
    })
    return isChecked
  }
  return { onClickItem, checkIsClickedItem, isClickedItems, setIsClickedItems }
}
