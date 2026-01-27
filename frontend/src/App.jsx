// import { useState } from "react"
import CondionalRender from "./components/Conditional"
import CounterIncrese, { CounterDecrease } from "./components/Counter"
import PropsCheck from "./components/PropsCheck"
import PropsAsSlot from "./components/PropsAsSlot"
import ControlledComponent from "./components/ControlledComponent"
import HandleCheckboxes from "./components/HandleCheckboxes"
import { HandleRadioAndSelect } from "./components/HandleRadioAndSelect"
import { BasicLooping } from "./components/BasicLooping"
import { LoopWithComponent } from "./components/LoopWithComponent"
import { ClockParent } from "./components/ClockParent"
import { NestedLooping } from "./components/NestedLooping"
import { UseEffectUsage } from "./components/UseEffectUsage"
import { StylesCheck } from "./components/StylesCheck"
import { UseRefSample } from "./components/UseRefSample"
import { UncontrolledComponent } from "./components/UncontrolledComponent"
import { CallParentFunctionFromChild } from "./components/CallParentFunctionFromChild"
import { ForwardRefParent } from "./components/ForwardRefParent"
import {  UseFormStatus } from "./components/UseFormStatus"
// import styles from './css/StyleCheck.module.css'

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
      {/* <HandleCheckboxes /> */}
      {/* <HandleRadioAndSelect /> */}
      {/* <BasicLooping /> */}
      {/* <LoopWithComponent /> */}
      {/* <ClockParent /> */}
      {/* <NestedLooping /> */}
      {/* <UseEffectUsage /> */}
      {/* <StylesCheck /> */}
      {/* <h1 className={styles.test}>check</h1> */}
      {/* <UseRefSample /> */}
      {/* <UncontrolledComponent /> */}
      {/* <CallParentFunctionFromChild /> */}
      {/* <ForwardRefParent /> */}
      <UseFormStatus />
      {/* <CheckAnotherFunc /> */}
    </>
  )
}

export default App
