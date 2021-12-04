import * as React from "react"
import { Link } from "gatsby"

const IndexPage = () => {
  return (
    <main>
      <title>Home Page</title>
      <p>Sample</p>
      <ul>
        <li>
          <Link to="/mdx">mdx</Link>
        </li>
        <li>
          <Link to="/md">md</Link>
        </li>
      </ul>
    </main>
  )
}

export default IndexPage
