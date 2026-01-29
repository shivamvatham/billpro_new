import { lazy } from 'react'

const Conditional = lazy(() => import('../components/Conditional'))
const Counter = lazy(() => import('../components/Counter'))
const PropsCheck = lazy(() => import('../components/PropsCheck'))
const ControlledComponent = lazy(() => import('../components/ControlledComponent'))
const HandleCheckboxes = lazy(() => import('../components/HandleCheckboxes'))
const HandleRadioAndSelect = lazy(() => import('../components/HandleRadioAndSelect'))
const BasicLooping = lazy(() => import('../components/BasicLooping'))
const LoopWithComponent = lazy(() => import('../components/LoopWithComponent'))
const ClockParent = lazy(() => import('../components/ClockParent'))
const NestedLooping = lazy(() => import('../components/NestedLooping'))
const UseEffectUsage = lazy(() => import('../components/UseEffectUsage'))
const StylesCheck = lazy(() => import('../components/StylesCheck'))
const UseRefSample = lazy(() => import('../components/UseRefSample'))
const UncontrolledComponent = lazy(() => import('../components/UncontrolledComponent'))
const CallParentFunctionFromChild = lazy(() => import('../components/CallParentFunctionFromChild'))
const ForwardRefParent = lazy(() => import('../components/ForwardRefParent'))
const UseFormStatus = lazy(() => import('../components/UseFormStatus'))
const UseTransition = lazy(() => import('../components/UseTransition'))
const DerrivedState = lazy(() => import('../components/DerrivedState'))
const LiftState = lazy(() => import('../components/LiftingState'))
const UpdateObj = lazy(() => import('../components/UpdateObj'))
const UpdateArray = lazy(() => import('../components/UpdateArray'))
const UseActionState = lazy(() => import('../components/UseActionState'))
const UseId = lazy(() => import('../components/UseId'))
const CustomHook = lazy(() => import('../components/CustomHook'))
const UseContext = lazy(() => import('../components/UseContext'))

export const routes = [
  { path: '/', element: Conditional, title: 'Conditional Rendering' },
  { path: '/counter', element: Counter, title: 'Counter' },
  { path: '/props-check', element: PropsCheck, title: 'Props Check' },
  { path: '/controlled-component', element: ControlledComponent, title: 'Controlled Component' },
  { path: '/handle-checkboxes', element: HandleCheckboxes, title: 'Handle Checkboxes' },
  { path: '/handle-radio-select', element: HandleRadioAndSelect, title: 'Handle Radio and Select' },
  { path: '/basic-looping', element: BasicLooping, title: 'Basic Looping' },
  { path: '/loop-with-component', element: LoopWithComponent, title: 'Loop with Component' },
  { path: '/clock-parent', element: ClockParent, title: 'Clock Parent' },
  { path: '/nested-looping', element: NestedLooping, title: 'Nested Looping' },
  { path: '/use-effect-usage', element: UseEffectUsage, title: 'UseEffect Usage' },
  { path: '/styles-check', element: StylesCheck, title: 'Styles Check' },
  { path: '/use-ref-sample', element: UseRefSample, title: 'UseRef Sample' },
  { path: '/uncontrolled-component', element: UncontrolledComponent, title: 'Uncontrolled Component' },
  { path: '/call-parent-function', element: CallParentFunctionFromChild, title: 'Call Parent Function from Child' },
  { path: '/forward-ref-parent', element: ForwardRefParent, title: 'Forward Ref Parent' },
  { path: '/use-form-status', element: UseFormStatus, title: 'Use Form Status' },
  { path: '/use-transition', element: UseTransition, title: 'Use Transition' },
  { path: '/derrived-state', element: DerrivedState, title: 'Derrived State' },
  { path: '/lift-state', element: LiftState, title: 'Lift State' },
  { path: '/update-obj', element: UpdateObj, title: 'Update Object' },
  { path: '/update-array', element: UpdateArray, title: 'Update Array' },
  { path: '/use-action-state', element: UseActionState, title: 'Use Action State' },
  { path: '/use-id', element: UseId, title: 'Use ID' },
  { path: '/custom-hook', element: CustomHook, title: 'Custom Hook' },
  { path: '/use-context', element: UseContext, title: 'Use Context' },
]