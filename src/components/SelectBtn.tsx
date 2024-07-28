import React from 'react'

interface PropsType {
  selectedId: string
  value: string
  title: string
  onClickType: (e: React.MouseEvent<HTMLButtonElement>) => void
}

export default function SelectBtn({ selectedId, value, title, onClickType }: PropsType) {
  return (
    <button
      className={` ${
        selectedId === value ? 'bg-blue-300 text-white' : 'bg-gray-100'
      } w-full py-2 rounded-md`}
      onClick={onClickType}
      value={value}
    >
      {title}
    </button>
  )
}
