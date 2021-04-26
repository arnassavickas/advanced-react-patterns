// Compound Components
// http://localhost:3000/isolated/exercise/02.js

import * as React from 'react'
import {Switch} from '../switch'

function Toggle({children, ...props}) {
  const [on, setOn] = React.useState(false)
  const toggle = () => setOn(!on)

  return React.Children.map(children, child => {
    if (typeof child.type === 'string') {
      return child
    }
    return React.cloneElement(child, {on, toggle})
  })
}

const ToggleOn = ({on, children}) => {
  if (on) {
    return children
  } else {
    return null
  }
}

const ToggleOff = ({on, children}) => {
  if (!on) {
    return children
  } else {
    return null
  }
}

const ToggleButton = ({on, toggle}) => {
  return <Switch on={on} onClick={toggle} />
}

function App() {
  return (
    <div>
      <Toggle>
        <ToggleOn>The button is on</ToggleOn>
        <ToggleOff>The button is off</ToggleOff>
        <span>Hello</span>
        <ToggleButton />
      </Toggle>
    </div>
  )
}

export default App
