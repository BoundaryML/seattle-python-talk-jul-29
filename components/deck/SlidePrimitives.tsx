import type { ReactNode } from "react";

export type SlideMeta = {
  title: string;
  eyebrow: string;
  kind?: "content" | "section" | "title";
  tone?: "paper" | "ink" | "purple";
};

export function SlideFrame({ title, eyebrow, children, dense = false }: { title: string; eyebrow: string; children: ReactNode; dense?: boolean }) {
  return (
    <div className={dense ? "slide-frame is-dense" : "slide-frame"}>
      <div className="slide-heading">
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
      </div>
      <div className="mdx-body">{children}</div>
    </div>
  );
}

export function SectionSlide({ title, label }: { title: string; label: string }) {
  return (
    <div className="section-slide">
      <p className="eyebrow">{label}</p>
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
      <p className="eyebrow">Seattle Python · 25 minutes</p>
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
        <div className="runtime-step-wrap" key={label}>
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

export function FeatureGrid() {
  const groups = [
    ["Functions", "free · instance · static"],
    ["Execution", "sync · async · cancel"],
    ["Environment", "errors · os.env · state"],
    ["Return trip", "closures · files · sockets"],
    ["Lifetimes", "captured local references"],
    ["Types", "recover generic information"],
  ];
  return (
    <div className="feature-grid">
      {groups.map(([title, detail], index) => <div key={title}><span>{String(index + 1).padStart(2, "0")}</span><b>{title}</b><p>{detail}</p></div>)}
    </div>
  );
}
