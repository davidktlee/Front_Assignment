import Container from './components/Container'
import Input from './components/Input'

export default function App() {
  const addTask = (inputValue: string, id: string) => {}
  return (
    <>
      <Input addTask={addTask} />
      <Container />
    </>
  )
}
