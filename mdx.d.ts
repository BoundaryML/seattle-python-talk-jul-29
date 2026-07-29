declare module "*.mdx" {
  import type { ComponentType } from "react";
  import type { SlideMeta } from "@/components/deck/SlidePrimitives";

  export const meta: SlideMeta;
  const MDXComponent: ComponentType;
  export default MDXComponent;
}
