import type { ComponentType } from "react";
import type { SlideMeta } from "@/components/deck/SlidePrimitives";
import Title, { meta as titleMeta } from "./00-title.mdx";
import WhatIsBaml, { meta as whatIsBamlMeta } from "./01-what-is-baml.mdx";
import EverythingIsBits, { meta as everythingIsBitsMeta } from "./02-everything-is-bits.mdx";
import ConcreteRespond, { meta as concreteRespondMeta } from "./03-one-concrete-respond-call.mdx";
import TalkOverview, { meta as talkOverviewMeta } from "./04-talk-overview.mdx";
import TypeSafety, { meta as typeSafetyMeta } from "./05-type-safety.mdx";
import HowDoWeDoThis, { meta as howDoWeDoThisMeta } from "./06-how-do-we-do-this.mdx";
import Runtime, { meta as runtimeMeta } from "./06-runtime.mdx";
import BarrelFunction, { meta as barrelFunctionMeta } from "./07-barrel-function.mdx";
import EncodeCallArgs, { meta as encodeCallArgsMeta } from "./08-encode-call-args.mdx";
import CallFunctionSync, { meta as callFunctionSyncMeta } from "./09-call-function-sync.mdx";
import InboundBex, { meta as inboundBexMeta } from "./10-inbound-bex-external-value.mdx";
import OutboundBex, { meta as outboundBexMeta } from "./11-outbound-bex-external-value.mdx";
import DecodeCallResult, { meta as decodeCallResultMeta } from "./12-decode-call-result.mdx";
import Lambdas, { meta as lambdasMeta } from "./13-but-what-about-lambdas.mdx";
import EarlierRespond, { meta as earlierRespondMeta } from "./14-earlier-respond-call.mdx";
import CallableHandle, { meta as callableHandleMeta } from "./15-python-callable-as-protobuf-handle.mdx";
import InboundHostValue, { meta as inboundHostValueMeta } from "./16-inbound-host-value.mdx";
import RustU64, { meta as rustU64Meta } from "./17-rust-has-a-u64.mdx";
import FeatureList, { meta as featureListMeta } from "./18-feature-list.mdx";

type SlideEntry = { component: ComponentType; meta: SlideMeta };

export const slides: SlideEntry[] = [
  { component: Title, meta: titleMeta as SlideMeta },
  { component: WhatIsBaml, meta: whatIsBamlMeta as SlideMeta },
  { component: EverythingIsBits, meta: everythingIsBitsMeta as SlideMeta },
  { component: ConcreteRespond, meta: concreteRespondMeta as SlideMeta },
  { component: TalkOverview, meta: talkOverviewMeta as SlideMeta },
  { component: TypeSafety, meta: typeSafetyMeta as SlideMeta },
  { component: HowDoWeDoThis, meta: howDoWeDoThisMeta as SlideMeta },
  { component: Runtime, meta: runtimeMeta as SlideMeta },
  { component: BarrelFunction, meta: barrelFunctionMeta as SlideMeta },
  { component: EncodeCallArgs, meta: encodeCallArgsMeta as SlideMeta },
  { component: CallFunctionSync, meta: callFunctionSyncMeta as SlideMeta },
  { component: InboundBex, meta: inboundBexMeta as SlideMeta },
  { component: OutboundBex, meta: outboundBexMeta as SlideMeta },
  { component: DecodeCallResult, meta: decodeCallResultMeta as SlideMeta },
  { component: Lambdas, meta: lambdasMeta as SlideMeta },
  { component: EarlierRespond, meta: earlierRespondMeta as SlideMeta },
  { component: CallableHandle, meta: callableHandleMeta as SlideMeta },
  { component: InboundHostValue, meta: inboundHostValueMeta as SlideMeta },
  { component: RustU64, meta: rustU64Meta as SlideMeta },
  { component: FeatureList, meta: featureListMeta as SlideMeta },
];
