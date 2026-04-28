import React from "react"

export default function TestComponent() {
  return (
    <div style={{ padding: "20px", background: "lightblue", textAlign: "center" }}>
      <h1>Test Component is Working! 🎉</h1>
      <p>If you can see this, React is loading correctly.</p>
      <button onClick={() => alert("It works!")}>Test Button</button>
    </div>
  )
}
