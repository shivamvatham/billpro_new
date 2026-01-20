import { useState } from "react"
import CondionalRender from "./components/Conditional"
import CounterIncrese, { CounterDecrease } from "./components/Counter"
import PropsCheck from "./components/PropsCheck"
import PropsAsSlot from "./components/PropsAsSlot"
import ControlledComponent from "./components/ControlledComponent"
import HandleCheckboxes from "./components/HandleCheckboxes"

function App() {
  // const [change, setChange] = useState(false)

  // const userDetails = {
  //   name: 'shivam',
  //   age: 25,
  //   email: 'sk940895Ck',
  //   empId: 90,
  //   mobile: 9408954477
  // }
  // const userDetails2 = {
  //   name: 'gaman ',
  //   age: 30,
  //   email: '441@g.com',
  //   empId: 190,
  //   mobile: 9924352145
  // }
  return (
    <>
      {/* <button onClick={() => setChange(!change)}>change prop data</button>
      <PropsCheck data={change ? userDetails : userDetails2} /> */}
      {/* <CondionalRender />
     <CounterIncrese />
     <CounterDecrease /> */}
     {/* <PropsAsSlot>
      <h1>shivam</h1>
     </PropsAsSlot>
     <PropsAsSlot color="blue">
      <h1>meetu</h1>
     </PropsAsSlot> */}
     {/* <ControlledComponent /> */}
     <HandleCheckboxes />
    </>
  )
}

export default App
