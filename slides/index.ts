import type { ComponentType } from "react";
import type { SlideMeta } from "@/components/deck/SlidePrimitives";
import Title, { meta as titleMeta } from "./00-title.mdx";
import WhatIsBaml, { meta as whatIsBamlMeta } from "./01-what-is-baml.mdx";
import EverythingIsBytes, { meta as everythingIsBytesMeta } from "./02-everything-is-bytes.mdx";
import ConcreteRespond, { meta as concreteRespondMeta } from "./03-one-concrete-respond-call.mdx";
import TalkOverview, { meta as talkOverviewMeta } from "./04-talk-overview.mdx";
import TypeSafety, { meta as typeSafetyMeta } from "./05-type-safety.mdx";
import MappingFilesClassesEnums, { meta as mappingFilesClassesEnumsMeta } from "./06a-mapping-files-classes-enums.mdx";
import MappingComposedTypes, { meta as mappingComposedTypesMeta } from "./06b-mapping-composed-types.mdx";
import BamlGenerate, { meta as bamlGenerateMeta } from "./06c-baml-generate.mdx";
import Runtime, { meta as runtimeMeta } from "./06-runtime.mdx";
import BarrelFunction, { meta as barrelFunctionMeta } from "./07-barrel-function.mdx";
import BamlInboundProto, { meta as bamlInboundProtoMeta } from "./08-baml-inbound-proto.mdx";
import InboundBex, { meta as inboundBexMeta } from "./10-inbound-bex-external-value.mdx";
import BamlInterface, { meta as bamlInterfaceMeta } from "./10b-baml-interface.mdx";
import OutboundBex, { meta as outboundBexMeta } from "./11-outbound-bex-external-value.mdx";
import BamlOutboundProto, { meta as bamlOutboundProtoMeta } from "./12-baml-outbound-proto.mdx";
import BytesInBytesOutResult, { meta as bytesInBytesOutResultMeta } from "./12b-bytes-in-bytes-out.mdx";
import Lambdas, { meta as lambdasMeta } from "./13-but-what-about-lambdas.mdx";
import EarlierRespond, { meta as earlierRespondMeta } from "./14-earlier-respond-call.mdx";
import CallableHandle, { meta as callableHandleMeta } from "./15-python-callable-as-protobuf-handle.mdx";
import InboundHostValue, { meta as inboundHostValueMeta } from "./16-inbound-host-value.mdx";
import RustU64, { meta as rustU64Meta } from "./17-rust-has-a-u64.mdx";
import RustHostDispatch, { meta as rustHostDispatchMeta } from "./17b-rust-host-dispatch-callback.mdx";
import CompleteHostCall, { meta as completeHostCallMeta } from "./17c-complete-host-call.mdx";
import ScratchingTheSurface, { meta as scratchingTheSurfaceMeta } from "./18-scratching-the-surface.mdx";
import TryItOut, { meta as tryItOutMeta } from "./19-try-it-out.mdx";

type SlideEntry = { component: ComponentType; meta: SlideMeta };

export const slides: SlideEntry[] = [
  { component: Title, meta: titleMeta as SlideMeta },
  { component: WhatIsBaml, meta: whatIsBamlMeta as SlideMeta },
  { component: EverythingIsBytes, meta: everythingIsBytesMeta as SlideMeta },
  { component: ConcreteRespond, meta: concreteRespondMeta as SlideMeta },
  { component: TalkOverview, meta: talkOverviewMeta as SlideMeta },
  { component: TypeSafety, meta: typeSafetyMeta as SlideMeta },
  { component: BamlGenerate, meta: bamlGenerateMeta as SlideMeta },
  { component: MappingFilesClassesEnums, meta: mappingFilesClassesEnumsMeta as SlideMeta },
  { component: MappingComposedTypes, meta: mappingComposedTypesMeta as SlideMeta },
  { component: BamlGenerate, meta: bamlGenerateMeta as SlideMeta },
  { component: Runtime, meta: runtimeMeta as SlideMeta },
  { component: BarrelFunction, meta: barrelFunctionMeta as SlideMeta },
  { component: BamlInboundProto, meta: bamlInboundProtoMeta as SlideMeta },
  { component: InboundBex, meta: inboundBexMeta as SlideMeta },
  { component: BamlInterface, meta: bamlInterfaceMeta as SlideMeta },
  { component: OutboundBex, meta: outboundBexMeta as SlideMeta },
  { component: BamlOutboundProto, meta: bamlOutboundProtoMeta as SlideMeta },
  { component: BytesInBytesOutResult, meta: bytesInBytesOutResultMeta as SlideMeta },
  { component: Lambdas, meta: lambdasMeta as SlideMeta },
  { component: EarlierRespond, meta: earlierRespondMeta as SlideMeta },
  { component: CallableHandle, meta: callableHandleMeta as SlideMeta },
  { component: InboundHostValue, meta: inboundHostValueMeta as SlideMeta },
  { component: RustU64, meta: rustU64Meta as SlideMeta },
  { component: RustHostDispatch, meta: rustHostDispatchMeta as SlideMeta },
  { component: CompleteHostCall, meta: completeHostCallMeta as SlideMeta },
  { component: ScratchingTheSurface, meta: scratchingTheSurfaceMeta as SlideMeta },
  { component: TryItOut, meta: tryItOutMeta as SlideMeta },
];
