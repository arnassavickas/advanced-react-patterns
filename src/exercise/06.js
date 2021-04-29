// Control Props
// http://localhost:3000/isolated/exercise/06.js

import {reduce} from 'lodash'
import * as React from 'react'
import {act} from 'react-dom/test-utils'
import {Switch} from '../switch'
import warning from 'warning'

const callAll = (...fns) => (...args) => fns.forEach(fn => fn?.(...args))

const actionTypes = {
  toggle: 'toggle',
  reset: 'reset',
}

function toggleReducer(state, {type, initialState}) {
  switch (type) {
    case actionTypes.toggle: {
      return {on: !state.on}
    }
    case actionTypes.reset: {
      return initialState
    }
    default: {
      throw new Error(`Unsupported type: ${type}`)
    }
  }
}

function useToggle({
  initialOn = false,
  reducer = toggleReducer,
  onChange,
  on: controlledOn,
} = {}) {
  const {current: initialState} = React.useRef({on: initialOn})
  const [state, dispatch] = React.useReducer(reducer, initialState)

  const onIsControlled = controlledOn != null
  const on = onIsControlled ? controlledOn : state.on

  const dispatchWithOnChange = action => {
    if (!onIsControlled) {
      dispatch(action)
    }
    onChange?.(reducer({...state, on}, action), action)
  }

  const toggle = () => dispatchWithOnChange({type: actionTypes.toggle})
  const reset = () =>
    dispatchWithOnChange({type: actionTypes.reset, initialState})

  function getTogglerProps({onClick, ...props} = {}) {
    return {
      'aria-pressed': on,
      onClick: callAll(onClick, toggle),
      ...props,
    }
  }

  function getResetterProps({onClick, ...props} = {}) {
    return {
      onClick: callAll(onClick, reset),
      ...props,
    }
  }

  return {
    on,
    reset,
    toggle,
    getTogglerProps,
    getResetterProps,
  }
}

function useControlledInputWarning(value, onChange, readOnly) {
  const onRef = React.useRef(value)

  React.useEffect(() => {
    if (value != null && !onChange && !readOnly) {
      warning(
        false,
        `Warning: Failed prop type: You provided a \`value\`
      prop to a form field without an \`onChange\` handler. This will
      render a read-only field. If the field should be mutable use
      \`defaultValue\`. Otherwise, set either \`onChange\` or \`readOnly\`.`,
      )
    }

    if (onRef.current != null && value == null) {
      warning(
        false,
        `Warning: A component is changing a controlled input of type undefined
        to be uncontrolled. Input elements should not switch from controlled to
        uncontrolled (or vice versa). Decide between using a controlled or
        uncontrolled input element for the lifetime of the component.
        More info: https://fb.me/react-controlled-components`,
      )
    }

    if (onRef.current == null && value != null) {
      warning(
        false,
        `Warning: A component is changing an uncontrolled input of type
          undefined to be controlled. Input elements should not switch from
          uncontrolled to controlled (or vice versa). Decide between using
          a controlled or uncontrolled input element for the lifetime of
          the component. More info: https://fb.me/react-controlled-components`,
      )
    }
  }, [value, onChange, readOnly])
}

function Toggle({on: controlledOn, onChange, readOnly = false}) {
  const {on, getTogglerProps} = useToggle({on: controlledOn, onChange})
  const props = getTogglerProps({on})

  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useControlledInputWarning(controlledOn, onChange, readOnly)
  }

  return <Switch {...props} />
}

function App() {
  const [bothOn, setBothOn] = React.useState(false)
  const [timesClicked, setTimesClicked] = React.useState(0)

  function handleToggleChange(state, action) {
    if (action.type === actionTypes.toggle && timesClicked > 4) {
      return
    }
    setBothOn(state.on)
    setTimesClicked(c => c + 1)
  }

  function handleResetClick() {
    setBothOn(false)
    setTimesClicked(0)
  }

  return (
    <div>
      <div>
        <Toggle on={bothOn} onChange={handleToggleChange} />
        <Toggle on={bothOn} onChange={handleToggleChange} />
      </div>
      {timesClicked > 4 ? (
        <div data-testid="notice">
          Whoa, you clicked too much!
          <br />
        </div>
      ) : (
        <div data-testid="click-count">Click count: {timesClicked}</div>
      )}
      <button onClick={handleResetClick}>Reset</button>
      <hr />
      <div>
        <div>Uncontrolled Toggle:</div>
        <Toggle
          onChange={(...args) => {
            console.info('Uncontrolled Toggle onChange', ...args)
          }}
        />
      </div>
    </div>
  )
}

export default App
// we're adding the Toggle export for tests
export {Toggle}

/*
eslint
  no-unused-vars: "off",
*/
