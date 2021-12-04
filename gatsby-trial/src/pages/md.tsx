import * as React from "react"
import { graphql, PageProps } from "gatsby"
import { MdPageQuery } from '../../graphql-types'
import 'katex/dist/katex.min.css';
import "prismjs/themes/prism-solarizedlight.css";

const mdPage: React.FC<PageProps<MdPageQuery>> = ({ data }) => {
    return (
        <div dangerouslySetInnerHTML={{ __html: data.markdownRemark.html }} />
    )
}

export const query = graphql`
query MdPage {
    markdownRemark {
        html
    }
}
`

export default mdPage
