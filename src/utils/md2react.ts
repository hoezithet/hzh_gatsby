import React from "react";
import unified from 'unified';
import math from 'remark-math';
import remark from 'remark-parse';
import katex from 'rehype-katex';
import remark2rehype from 'remark-rehype';
import rehype2react from 'rehype-react';
import katexOptions from "../katexOptions"

const md2react = (md_text: string) => {
    const processor = unified()
        .use(remark)
        .use(math)
        .use(remark2rehype)
        .use(katex, katexOptions)
        .use(rehype2react, { createElement: React.createElement });
    return processor.processSync(md_text).result as JSX.Element 
}; 

export default md2react;
