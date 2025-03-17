import { useState } from 'react'
import './App.css'
import reactLogo from '/assets/react.svg'

import sheet from './example.module.scss'
console.log(`imported CSSStyleSheet rules=${(sheet => {
  let rules = []
  for (let rule of sheet.cssRules) {
    rules.push(rule.cssText)
  }
  return JSON.stringify(rules, null, 2)
})(sheet)}`);

let fetchLogo = async () => {
  return await fetch(reactLogo);
}

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>React + TS</h1>
      <div className="card">
        <button onClick={() => (setCount((count) => count + 1), fetchLogo())}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code>
        </p>
      </div>
      <p className="read-the-docs">
        Click on the React logo to learn more
      </p>
    </>
  )
}

export default App
