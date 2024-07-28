import React, { useState } from 'react'
import SelectBtn from './SelectBtn'

interface PropsType {
  addTask: (inputValue: string, id: string) => void
}

export default function Input({ addTask }: PropsType) {
  const [inputValue, setInputValue] = useState('')
  const [selectedId, setSelectedId] = useState('1')

  const onClickType = (e: React.MouseEvent<HTMLButtonElement>) => {
    setSelectedId(e.currentTarget.value)
  }
  const onClickAdd = () => {
    alert('현재 추가 기능은 지원하지 않습니다.')
    setInputValue('')
    addTask(inputValue, selectedId)
  }
  return (
    <div className="w-full flex justify-center">
      <div className="inline-flex flex-col items-start mt-10">
        <div className="flex items-center gap-x-4 my-2">
          <input
            className="border-b-2 border-blue-300 p-2 inline-block outline-none"
            type="text"
            value={inputValue}
            placeholder="할 일 추가"
            onChange={(e) => setInputValue(e.currentTarget.value)}
          />
          <button
            className="w-full px-8 py-2 text-center border-2 border-blue-300 rounded-md hover:text-white hover:bg-blue-300"
            onClick={onClickAdd}
          >
            추가
          </button>
        </div>
        <div className="w-full flex justify-between gap-x-2">
          <SelectBtn selectedId={selectedId} value="1" onClickType={onClickType} title="비상" />
          <SelectBtn selectedId={selectedId} value="2" onClickType={onClickType} title="중요" />
          <SelectBtn selectedId={selectedId} value="3" onClickType={onClickType} title="보통" />
          <SelectBtn selectedId={selectedId} value="4" onClickType={onClickType} title="미루기" />
        </div>
      </div>
    </div>
  )
}
