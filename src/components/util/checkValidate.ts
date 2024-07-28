import { Dispatch, SetStateAction } from 'react'
import { ItemsType } from '../types'
import { ClickedItem } from '../hooks/useClickItem'

export const checkValidate = (
  sourceColumnIndex: number,
  destColumnIndex: number,
  sourceItemIndex: number,
  destItemIndex: number,
  items: ItemsType[],
  isClickedItems: ClickedItem[],
  setIsError: Dispatch<SetStateAction<boolean>>
) => {
  if (sourceColumnIndex === destColumnIndex && sourceItemIndex === destItemIndex) setIsError(false)
  else if (sourceColumnIndex === destColumnIndex && isClickedItems.length > 1) setIsError(true)
  else if (sourceColumnIndex === 0 && destColumnIndex === 2) setIsError(true)
  else if (
    (sourceItemIndex + 1) % 2 === 0 && // 끄는 아이템이 짝수 아이템
    destItemIndex !== 0 && // 도착 아이템 인덱스가 0이 아님
    (destItemIndex + 1) % 2 === 0 && // 도착지의 itemIndex가 짝수
    destItemIndex !== items[destColumnIndex].contents.length
  )
    setIsError(true)
  else setIsError(false)
}
