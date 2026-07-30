import createMDX from "@next/mdx";
import protobuf from "highlight.js/lib/languages/protobuf";
import python from "highlight.js/lib/languages/python";
import rust from "highlight.js/lib/languages/rust";
import rehypeHighlight from "rehype-highlight";
import baml from "./lib/syntax/baml.js";

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    rehypePlugins: [
      [
        rehypeHighlight,
        {
          detect: false,
          languages: {
            baml,
            protobuf,
            python,
            rust,
            textproto: protobuf,
          },
          plainText: ["text", "plaintext"],
        },
      ],
    ],
  },
});

export default withMDX({
  devIndicators: false,
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
});
