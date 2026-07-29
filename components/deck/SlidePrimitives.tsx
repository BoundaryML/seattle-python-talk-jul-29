import type { ReactNode } from "react";

export type SlideMeta = {
  title: string;
  eyebrow: string;
  kind?: "content" | "section" | "title";
  tone?: "paper" | "ink" | "purple";
};

export function SlideFrame({ title, children, dense = false, footer }: { title: string; eyebrow?: string; children: ReactNode; dense?: boolean; footer?: ReactNode }) {
  const className = ["slide-frame", dense ? "is-dense" : "", footer ? "has-footer" : ""].filter(Boolean).join(" ");
  return (
    <div className={className}>
      <div className="slide-heading">
        <h1>{title}</h1>
      </div>
      <div className="mdx-body">{children}</div>
      {footer && <div className="slide-frame-footer">{footer}</div>}
    </div>
  );
}

type RuntimeStage = "python-in" | "inbound" | "bex" | "outbound" | "python-out";

export function RuntimePathFooter({ active }: { active: RuntimeStage }) {
  const stages: Array<{ id: RuntimeStage; label: string }> = [
    { id: "python-in", label: "Python" },
    { id: "inbound", label: "baml_inbound.proto" },
    { id: "bex", label: "BAML" },
    { id: "outbound", label: "baml_outbound.proto" },
    { id: "python-out", label: "Python" },
  ];

  return (
    <div className="runtime-path" aria-label="baml_sdk.respond(discord_message, ...) to Python to baml_inbound.proto to BAML to baml_outbound.proto to Python">
      <span className="runtime-path-part">
        <span className="runtime-path-stage">baml_sdk.respond(discord_message, ...)</span>
        <span className="runtime-path-arrow" aria-hidden="true">→</span>
      </span>
      {stages.map((stage, index) => (
        <span className="runtime-path-part" key={stage.id}>
          <span className={stage.id === active ? "runtime-path-stage active" : "runtime-path-stage"}>{stage.label}</span>
          {index < stages.length - 1 && <span className="runtime-path-arrow" aria-hidden="true">→</span>}
        </span>
      ))}
    </div>
  );
}

export function SectionSlide({ title }: { title: string; label?: string }) {
  return (
    <div className="section-slide">
      <div className="section-index" aria-hidden="true">{`{ }`}</div>
      <h1>{title}</h1>
      <div className="section-rule"><span /></div>
    </div>
  );
}

export function TitleSlide({ title, accent, description }: { title: string; accent: string; description: string }) {
  return (
    <div className="title-slide">
      <div className="title-mark" aria-hidden="true">B</div>
      <h1>{title}<br /><em>{accent}</em></h1>
      <div className="title-description">
        <p>{description}</p>
        <span>Python ↔ protobuf ↔ Rust ↔ BAML</span>
      </div>
    </div>
  );
}

export function Notes({ children }: { children: ReactNode }) {
  return (
    <aside className="speaker-notes" aria-label="Speaker notes">
      <div><b>Speaker notes</b><kbd>N</kbd></div>
      <div>{children}</div>
    </aside>
  );
}

export function BridgeDiagram() {
  return (
    <div className="bridge-diagram" role="img" aria-label="Python VM talking to the BAML execution engine inside one Python process">
      <div className="process-box">
        <span className="process-label">python my_python_baml_app.py</span>
        <div className="runtime-box"><b>Python VM</b><small>objects + callables</small></div>
        <div className="wire"><i /><code>bits</code><i /></div>
        <div className="runtime-box purple-box"><b>BAML</b><small>execution engine</small></div>
      </div>
    </div>
  );
}

export function RuntimeFlow() {
  const steps = [
    ["Python value", "objects"],
    ["baml_inbound.proto", "bytes"],
    ["bex_vm::call_function", "typed VM"],
    ["baml_outbound.proto", "bytes"],
    ["Python value", "objects"],
  ];
  return (
    <div className="runtime-flow" role="img" aria-label={steps.map(([label]) => label).join(" then ")}>
      {steps.map(([label, detail], index) => (
        <div className="runtime-step-wrap" key={`${label}-${index}`}>
          <div className={index === 2 ? "runtime-step active" : "runtime-step"}><b>{label}</b><small>{detail}</small></div>
          {index < steps.length - 1 && <span aria-hidden="true">→</span>}
        </div>
      ))}
    </div>
  );
}

export function DemoChecklist() {
  return (
    <div className="demo-checklist">
      <div><span>01</span><b>Python calls BAML</b></div>
      <div><span>02</span><b>Unions + generics</b></div>
      <div><span>03</span><b>Stateful handles</b></div>
      <div><span>04</span><b>Images in + out</b></div>
      <div><span>05</span><b>Callbacks</b></div>
    </div>
  );
}

export function HandleReveal() {
  return (
    <div className="handle-reveal" role="img" aria-label="A Python callable remains in Python while integer handle 42 crosses into Rust">
      <div><small>stays in Python</small><b>lambda update: …</b></div>
      <span className="handle-arrow">→</span>
      <strong>42</strong>
      <span className="handle-arrow">→</span>
      <div><small>materializes in BAML</small><b>HostValueArc</b></div>
    </div>
  );
}
