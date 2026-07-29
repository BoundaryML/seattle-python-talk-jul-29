"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Slide = {
  eyebrow?: string;
  title: string;
  body: React.ReactNode;
  notes: string;
  tone?: "ink" | "paper" | "signal";
};

function Code({ children, label }: { children: React.ReactNode; label?: string }) {
  return (
    <div className="code-window">
      <div className="code-chrome">
        <span /><span /><span />
        {label && <strong>{label}</strong>}
      </div>
      <pre><code>{children}</code></pre>
    </div>
  );
}

function Pill({ children, accent = false }: { children: React.ReactNode; accent?: boolean }) {
  return <span className={accent ? "pill pill-accent" : "pill"}>{children}</span>;
}

function Flow({ items }: { items: Array<{ label: string; detail?: string; accent?: boolean }> }) {
  return (
    <div className="flow" role="img" aria-label={items.map((item) => item.label).join(" then ")}>
      {items.map((item, index) => (
        <div className="flow-step-wrap" key={item.label}>
          <div className={item.accent ? "flow-step flow-step-accent" : "flow-step"}>
            <b>{item.label}</b>
            {item.detail && <small>{item.detail}</small>}
          </div>
          {index < items.length - 1 && <span className="flow-arrow" aria-hidden="true">→</span>}
        </div>
      ))}
    </div>
  );
}

const slides: Slide[] = [
  {
    eyebrow: "Seattle Python · 30 min",
    title: "FFIs,\nbut better.",
    tone: "ink",
    body: (
      <div className="title-lockup">
        <p className="lede">BAML Bridge × Python</p>
        <div className="title-rule" />
        <p className="quiet">Types, handles, callbacks — across a Rust boundary.</p>
      </div>
    ),
    notes: "Open with the promise: this is an FFI talk for people who know Python, not a Rust ABI lecture. We’ll start from the Python experience, then peel back the bridge.",
  },
  {
    eyebrow: "A quick room check",
    title: "When have Python types lied to you?",
    body: (
      <div className="poll-grid">
        <div className="poll-card"><span>01</span><b>“It type-checked.”</b><p>…then failed in production.</p></div>
        <div className="poll-card"><span>02</span><b>“The SDK says Any.”</b><p>…so autocomplete gave up.</p></div>
        <div className="poll-card"><span>03</span><b>“The JSON changed.”</b><p>…and the boundary shrugged.</p></div>
      </div>
    ),
    notes: "Ask for hands. Then ask who runs mypy, Pyright, ty, or Pyrefly. The point is not that Python typing is bad; it’s that a boundary can invalidate the story your type checker told you.",
  },
  {
    eyebrow: "The tension",
    title: "Python is gloriously dynamic.\nProduction boundaries are not.",
    body: (
      <div className="balance">
        <div><span className="balance-icon">✦</span><b>Keep</b><p>reflection, libraries, notebooks, “just do the thing”</p></div>
        <div className="balance-axis"><span /></div>
        <div><span className="balance-icon">◆</span><b>Add</b><p>contracts, generated types, structured errors, portable execution</p></div>
      </div>
    ),
    notes: "BAML’s design target is not to turn Python into Rust. It is to keep Python’s runtime freedom while making the boundary unusually honest.",
  },
  {
    eyebrow: "BAML in one sentence",
    title: "An agent-first language with the toolchain baked in.",
    tone: "signal",
    body: (
      <div className="speedrun">
        <Pill>check</Pill><Pill>run</Pill><Pill accent>playground</Pill><Pill>generate</Pill><Pill>pack</Pill>
        <p>Define typed AI behavior once. Inspect it, run it, generate host SDKs, and ship the program as one artifact.</p>
      </div>
    ),
    notes: "This is the elevator pitch. Don’t demo every command. Mention check/run, show the playground briefly, then emphasize generate and pack as the bridge into Python and deployment.",
  },
  {
    eyebrow: "The speedrun",
    title: "One program. Five useful surfaces.",
    body: (
      <div className="feature-list">
        <div><b>01</b><span><strong>Author</strong> typed functions, models, agents</span></div>
        <div><b>02</b><span><strong>Inspect</strong> requests and traces in the playground</span></div>
        <div><b>03</b><span><strong>Generate</strong> Python packages with real signatures</span></div>
        <div><b>04</b><span><strong>Embed</strong> bytecode beside your application</span></div>
        <div><b>05</b><span><strong>Pack</strong> without package-manager gymnastics</span></div>
      </div>
    ),
    notes: "Move quickly. The generated package is the segue: Python calls the BAML program at ordinary module paths, and those calls are where the bridge begins.",
  },
  {
    eyebrow: "Demo · the surface",
    title: "BAML in.\nPython out.",
    body: (
      <div className="split-code">
        <Code label="agent.baml">{`class Finding {
  label string
  confidence float
}

function classify(text: string)
  -> Finding | "skip" {
  // typed agent logic
}`}</Code>
        <Code label="app.py">{`import baml_sdk as b

result = await b.classify_async(
    "refund requested"
)

# Finding | Literal["skip"]
print(result)`}</Code>
      </div>
    ),
    notes: "The Python package is the client: no generated b object. Runtime files bind structural callables; .pyi stubs carry the typed surface for editors and type checkers.",
  },
  {
    eyebrow: "Generated Python",
    title: "It looks boring.\nThat is a feature.",
    body: (
      <div className="typed-surface">
        <Code label="baml_sdk/__init__.pyi">{`class Finding(pydantic.BaseModel):
    label: str
    confidence: float

def classify(
    text: str
) -> Finding | Literal["skip"]: ...

async def classify_async(
    text: str
) -> Finding | Literal["skip"]: ...`}</Code>
        <div className="annotation-stack">
          <Pill>PEP 561</Pill>
          <Pill>Pydantic v2</Pill>
          <Pill>sync + async</Pill>
          <p>Your editor sees normal Python. The runtime sees a BAML function FQN.</p>
        </div>
      </div>
    ),
    notes: "Point out py.typed and .pyi. The runtime package binds define_function(\"user.classify\", ...), but users see a normal callable signature.",
  },
  {
    eyebrow: "Demo · rich types",
    title: "Unions and generics survive the trip.",
    body: (
      <div className="split-code">
        <Code label="BAML">{`class Box<T> {
  value T
}

function choose<T>(
  value: T,
  fallback: T
) -> Box<T> | "empty"`}</Code>
        <Code label="Python">{`box = Box[int](value=3)
out = choose[int](
    value=box.value,
    fallback=0,
)

# Box[int] | Literal["empty"]
reveal_type(out)`}</Code>
      </div>
    ),
    notes: "BAML types map into Python typing constructs. Concrete generic args are carried on class values and on generic calls, so returned Pydantic models can be parameterized again.",
  },
  {
    eyebrow: "Demo · state",
    title: "Some values are not data.\nThey are live state.",
    body: (
      <div className="handle-demo">
        <Code label="Python">{`from baml_sdk.baml.fs import open

f = open("digits.txt", "r")

assert f.read(3) == "012"
assert f.read(3) == "345"

f.seek_from("start", 0)
assert f.read(2) == "01"`}</Code>
        <div className="handle-orbit">
          <span className="orbit-label">Python shell</span>
          <div className="handle-chip">_handle<br/><b>#7</b></div>
          <span className="orbit-label">Rust File</span>
        </div>
      </div>
    ),
    notes: "This is not serializing a file. The generated Pydantic shell has a private _handle. The engine owns the Rust file state; sending the shell back hands the same Arc to the next operation, preserving the cursor.",
  },
  {
    eyebrow: "Demo · multimodal",
    title: "Images cross as typed, handle-backed values.",
    body: (
      <div className="media-demo">
        <div className="pixel-art" aria-label="abstract image placeholder"><i /><i /><i /><i /><i /><i /><i /><i /><i /></div>
        <Code label="Python">{`from baml_sdk.baml.media import Image

img = Image.from_base64(
    png_bytes,
    "image/png",
)

result = await b.inspect_async(img)
preview = await b.render_async(result)`}</Code>
        <div className="media-stack">
          <Pill>Image</Pill><Pill>Audio</Pill><Pill>Video</Pill><Pill>PDF</Pill>
        </div>
      </div>
    ),
    notes: "Media has a host-side wrapper backed by a handle. BAML can consume and return it; the bridge preserves its media kind and reconstructs the right Python wrapper.",
  },
  {
    eyebrow: "Demo · callbacks",
    title: "Pass Python behavior into BAML.",
    tone: "signal",
    body: (
      <div className="callback-tease">
        <Code label="Python">{`def lookup_user(user_id: int) -> str:
    return db[user_id]

answer = b.run_agent(
    query="Who owns ticket 42?",
    tool=lookup_user,
)`}</Code>
        <div className="big-arrow">↗</div>
        <Code label="BAML">{`function run_agent(
  query: string,
  tool: (int) -> string,
) -> string {
  let owner = tool(42)
  "\${query}\\nOwner: \${owner}"
}`}</Code>
      </div>
    ),
    notes: "Let this feel magical for a beat. Then ask: what could possibly cross the FFI for a Python function with closures, globals, and arbitrary code?",
  },
  {
    eyebrow: "Now peel the bridge open",
    title: "EVERYTHING\nIS BITS.",
    tone: "ink",
    body: (
      <div className="bits-field" aria-hidden="true">
        <span>01000010</span><span>01000001</span><span>01001101</span><span>01001100</span>
      </div>
    ),
    notes: "This is the mental reset. Every ordinary input and output becomes bytes. Callbacks are the exception only in the sense that their identity needs indirection.",
  },
  {
    eyebrow: "The FFI mental model",
    title: "Imagine an HTTP POST.\nWithout HTTP.",
    body: (
      <Flow items={[
        { label: "Python", detail: "objects" },
        { label: "protobuf", detail: "bytes", accent: true },
        { label: "Rust bridge", detail: "C / PyO3" },
        { label: "BAML VM", detail: "typed values" },
      ]} />
    ),
    notes: "We are not covering CFFI or PyO3 mechanics. Pretend Python POSTs bytes to another process and receives bytes. The interesting part is the schema and semantics around those bytes.",
  },
  {
    eyebrow: "Type translation",
    title: "One BAML type.\nOne unsurprising Python spelling.",
    body: (
      <div className="mapping-table" role="table" aria-label="BAML to Python type mappings">
        <div className="table-head"><span>BAML</span><span>Python</span><span>Runtime shape</span></div>
        <div><code>int · bigint</code><code>int</code><span>i64 · hex string</span></div>
        <div><code>string · bool</code><code>str · bool</code><span>scalar</span></div>
        <div><code>uint8array</code><code>bytes</code><span>bytes</span></div>
        <div><code>T?</code><code>Optional[T]</code><span>null-bearing union</span></div>
        <div><code>A | B</code><code>Union[A, B]</code><span>selected value</span></div>
        <div><code>class Box&lt;T&gt;</code><code>Box[T]</code><span>FQN + fields + type args</span></div>
        <div><code>(A) → B</code><code>Callable[[A], B]</code><span>host-value handle</span></div>
      </div>
    ),
    notes: "Mention that a few mappings deliberately widen: float literal types become Any because Python Literal rejects floats; enum variants widen to the enum class. Keep focus on the common path.",
  },
  {
    eyebrow: "Python → BAML",
    title: "Inbound is structural.\nAnd intentionally a little lossy.",
    body: (
      <div className="proto-layout">
        <Code label="baml_inbound.proto">{`message InboundValue {
  BamlTy value_type = 1; // sparse
  oneof value {
    string string_value = 2;
    int64 int_value = 3;
    InboundListValue list_value = 6;
    InboundClassValue class_value = 8;
    BamlHandle handle = 10;
  }
  // absent oneof = null
}`}</Code>
        <div className="callouts">
          <div><b>Python says:</b><code>[1, 2, 3]</code></div>
          <div><b>Not necessarily:</b><code>list[int]</code></div>
          <p>The engine validates against the BAML function’s declared type.</p>
        </div>
      </div>
    ),
    notes: "Runtime Python values rarely carry their declared annotations. The inbound encoder is value-driven. Sparse value_type metadata is used only when shape/context cannot preserve a choice, such as empty or overlapping containers.",
  },
  {
    eyebrow: "BAML → Python",
    title: "Outbound must explain itself.",
    body: (
      <div className="proto-layout reverse">
        <div className="callouts">
          <div><b>Name</b><code>user.generics.Box</code></div>
          <div><b>Args</b><code>[int]</code></div>
          <div><b>Fields</b><code>{`{ value: 3 }`}</code></div>
          <p>No Python return annotation is consulted at runtime.</p>
        </div>
        <Code label="baml_outbound.proto">{`message BamlValueClass {
  string name = 1;          // FQN
  repeated Entry fields = 2;
  repeated BamlTy type_args = 3;
}

message BamlValueUnionVariant {
  BamlTy self_type = 4;
  uint32 selected_option_index = 7;
  BamlOutboundValue value = 6;
}`}</Code>
      </div>
    ),
    notes: "The decoder gets only payload bytes and the typemap, not an expected return type. So class names, concrete generic arguments, union selection, list item types, and handle tags travel outbound.",
  },
  {
    eyebrow: "Why the asymmetry?",
    title: "The callee has context.\nThe caller only has bytes.",
    body: (
      <div className="asymmetry">
        <div>
          <span className="direction">IN</span>
          <b>Python value + BAML parameter</b>
          <p>shape can be interpreted against a known type</p>
          <div className="signal-meter"><i /><i /><i /></div>
        </div>
        <div>
          <span className="direction">OUT</span>
          <b>BAML value + no expected Python type</b>
          <p>the payload must identify how to rebuild itself</p>
          <div className="signal-meter full"><i /><i /><i /><i /><i /></div>
        </div>
      </div>
    ),
    notes: "This is the central bridge idea. Inbound can lean on the callee’s signature and engine validation. Outbound cannot lean on Python annotations, so the wire must be self-describing.",
  },
  {
    eyebrow: "A normal call, end to end",
    title: "Encode. Validate. Execute. Rehydrate.",
    body: (
      <div className="roundtrip">
        <Flow items={[
          { label: "kwargs", detail: "Python" },
          { label: "InboundValue", detail: "structural" },
          { label: "BexExternalValue", detail: "typed", accent: true },
          { label: "VM result", detail: "value / throw / panic" },
        ]} />
        <div className="return-line">← <b>Pydantic / enum / handle / primitive</b> ← <span>BamlOutboundResult bytes</span> ←</div>
      </div>
    ),
    notes: "CallFunctionArgs carries kwargs, a call id, optional generic bindings, and a function FQN. The return envelope has three control-flow arms: ok, error, and panic. Each value uses the same outbound decoder.",
  },
  {
    eyebrow: "But a callback…",
    title: "You cannot serialize this.",
    tone: "paper",
    body: (
      <div className="impossible">
        <Code label="Python">{`def tool(user_id: int) -> str:
    row = db.lookup(user_id)  # connection
    audit.info(user_id)       # logger
    return row.name           # closure, globals…

# turn this function into bytes?`}</Code>
        <div className="stamp">NOPE</div>
      </div>
    ),
    notes: "A Python function includes code, closures, globals, module state, and possibly native resources. Serializing the behavior is the wrong problem.",
  },
  {
    eyebrow: "So serialize identity",
    title: "Send an integer.",
    tone: "signal",
    body: (
      <div className="integer-reveal">
        <span className="tiny-label">wire payload</span>
        <strong>42</strong>
        <Code label="conceptually">{`Handle {
  key: 42,
  handle_type: HOST_VALUE_CALLABLE
}`}</Code>
      </div>
    ),
    notes: "The Python bridge registers the callable and emits its key with the HOST_VALUE_CALLABLE discriminator. The number is meaningful only to that host runtime.",
  },
  {
    eyebrow: "The host-value table",
    title: "A tiny registry makes the function reachable.",
    body: (
      <div className="registry">
        <div className="registry-table">
          <div><b>KEY</b><b>PYTHON OBJECT</b></div>
          <div><code>40</code><span>report_progress</span></div>
          <div className="selected"><code>42</code><span>lookup_user</span></div>
          <div><code>43</code><span>ValueError("nope")</span></div>
        </div>
        <div className="registry-notes">
          <span><b>register</b> strong reference</span>
          <span><b>dispatch</b> lookup by key</span>
          <span><b>release</b> when Rust drops the last clone</span>
        </div>
      </div>
    ),
    notes: "Keys are process-global u64 values, never zero. The registry owns strong Python references. Rust’s HostValueArc release callback removes the entry. There is also rollback if encoding a later argument fails before the engine receives the call.",
  },
  {
    eyebrow: "The trampoline",
    title: "For callbacks, the bridge runs in reverse.",
    body: (
      <div className="trampoline">
        <Flow items={[
          { label: "BAML", detail: "tool(42)" },
          { label: "OutboundValue", detail: "args" },
          { label: "Python", detail: "registry[42](…)", accent: true },
          { label: "InboundValue", detail: "result" },
          { label: "BAML", detail: "typed return" },
        ]} />
        <p>Same codecs. Opposite direction.</p>
      </div>
    ),
    notes: "The engine encodes callback args with the outbound schema because they travel BAML→Python. Python invokes the function, then encodes its return with the inbound schema because it travels Python→BAML.",
  },
  {
    eyebrow: "Back to the demo",
    title: "A Python function becomes a typed BAML dependency.",
    body: (
      <div className="split-code">
        <Code label="BAML">{`function call_with_callback(
  callback: (int) -> string,
  x: int,
) -> string {
  callback(x)
}`}</Code>
        <Code label="Python">{`def cb(x: int) -> str:
    return f"got {x}"

result = call_with_callback(
    callback=cb,
    x=5,
)

assert result == "got 5"`}</Code>
      </div>
    ),
    notes: "Generated stubs render typing.Callable[[int], str]. At runtime the bridge decodes arguments into ordinary Python values and validates the returned value back against the BAML callable type.",
  },
  {
    eyebrow: "What if Python throws?",
    title: "The exception can make the round trip intact.",
    body: (
      <div className="exception-demo">
        <Code label="Python">{`raised = ValueError("nope")

def cb(_: int) -> str:
    raise raised

try:
    call_with_callback(cb, 1)
except ValueError as caught:
    assert caught is raised  # same object`}</Code>
        <div className="exception-path">
          <span>exception</span><b>→ key 43</b><span>BAML throw</span><b>→ lookup 43</b><span>re-raise</span>
        </div>
      </div>
    ),
    notes: "A native Python exception is registered as a host opaque value and wrapped as baml.errors.HostCallable. If it returns to the same host, decode_call_result looks up the handle and re-raises the original object, preserving identity and custom fields.",
  },
  {
    eyebrow: "The bigger picture",
    title: "Type safety is a runtime protocol,\nnot just a stub file.",
    body: (
      <div className="contract-grid">
        <div><span>01</span><b>Static surface</b><p>.pyi, Pydantic, editor feedback</p></div>
        <div><span>02</span><b>Wire contract</b><p>protobuf values, FQNs, generic args</p></div>
        <div><span>03</span><b>Runtime validation</b><p>engine checks inputs, callback returns, throws</p></div>
        <div><span>04</span><b>Identity channels</b><p>handles for state, media, functions, exceptions</p></div>
      </div>
    ),
    notes: "This is the thesis. A generated signature alone can lie. The bridge makes the static surface, serialized representation, runtime validation, and identity/lifetime rules agree.",
  },
  {
    eyebrow: "Three things to keep",
    title: "FFIs get friendlier when the boundary is explicit.",
    tone: "ink",
    body: (
      <div className="takeaways">
        <div><b>01</b><p>Ordinary values become <em>bits</em>.</p></div>
        <div><b>02</b><p>Stateful values become <em>handles</em>.</p></div>
        <div><b>03</b><p>Callbacks become <em>handles + a trampoline</em>.</p></div>
      </div>
    ),
    notes: "Pause on each. If people remember only these three nouns, they can reason about the whole bridge.",
  },
  {
    eyebrow: "Questions?",
    title: "Bring Python.\nKeep the contract.",
    tone: "signal",
    body: (
      <div className="closing">
        <p>BAML Bridge</p>
        <div className="closing-tags"><Pill>Python</Pill><Pill>Rust FFI</Pill><Pill>typed agents</Pill></div>
        <p className="quiet">← / → navigate · N speaker notes · O overview · F fullscreen</p>
      </div>
    ),
    notes: "Invite questions. Likely topics: performance, GIL behavior, async callbacks, handle lifetime, and how codegen stays in sync with runtime wire semantics.",
  },
];

function clamp(value: number) {
  return Math.max(0, Math.min(slides.length - 1, value));
}

export default function Home() {
  const [index, setIndex] = useState(0);
  const [notesOpen, setNotesOpen] = useState(false);
  const [overviewOpen, setOverviewOpen] = useState(false);
  const touchStart = useRef<number | null>(null);

  const go = useCallback((next: number) => {
    const clamped = clamp(next);
    setIndex(clamped);
    setOverviewOpen(false);
    window.location.hash = `slide-${clamped + 1}`;
  }, []);

  useEffect(() => {
    const match = window.location.hash.match(/slide-(\d+)/);
    if (match) setIndex(clamp(Number(match[1]) - 1));
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight" || event.key === "PageDown" || event.key === " ") {
        event.preventDefault();
        go(index + 1);
      } else if (event.key === "ArrowLeft" || event.key === "PageUp") {
        event.preventDefault();
        go(index - 1);
      } else if (event.key === "Home") {
        go(0);
      } else if (event.key === "End") {
        go(slides.length - 1);
      } else if (event.key.toLowerCase() === "n") {
        setNotesOpen((open) => !open);
      } else if (event.key.toLowerCase() === "o") {
        setOverviewOpen((open) => !open);
      } else if (event.key.toLowerCase() === "f") {
        if (!document.fullscreenElement) document.documentElement.requestFullscreen?.();
        else document.exitFullscreen?.();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, index]);

  const slide = slides[index];

  return (
    <main
      className="deck"
      onTouchStart={(event) => { touchStart.current = event.changedTouches[0].clientX; }}
      onTouchEnd={(event) => {
        if (touchStart.current === null) return;
        const delta = event.changedTouches[0].clientX - touchStart.current;
        if (Math.abs(delta) > 60) go(index + (delta < 0 ? 1 : -1));
        touchStart.current = null;
      }}
    >
      <section className={`slide tone-${slide.tone ?? "paper"}`} key={index} aria-live="polite">
        <div className="grain" aria-hidden="true" />
        <header className="slide-header">
          <span className="brand">BAML / PY</span>
          <span>{slide.eyebrow}</span>
        </header>
        <div className="slide-content">
          <h1>{slide.title.split("\n").map((line, i) => <span key={`${line}-${i}`}>{line}</span>)}</h1>
          <div className="slide-body">{slide.body}</div>
        </div>
        <footer className="slide-footer">
          <button onClick={() => go(index - 1)} disabled={index === 0} aria-label="Previous slide">←</button>
          <div className="progress" aria-label={`Slide ${index + 1} of ${slides.length}`}><i style={{ width: `${((index + 1) / slides.length) * 100}%` }} /></div>
          <span>{String(index + 1).padStart(2, "0")} / {slides.length}</span>
          <button onClick={() => go(index + 1)} disabled={index === slides.length - 1} aria-label="Next slide">→</button>
        </footer>
      </section>

      {notesOpen && (
        <aside className="speaker-notes">
          <div><b>Speaker notes · {index + 1}</b><button onClick={() => setNotesOpen(false)} aria-label="Close speaker notes">×</button></div>
          <p>{slide.notes}</p>
        </aside>
      )}

      {overviewOpen && (
        <div className="overview" role="dialog" aria-modal="true" aria-label="Slide overview">
          <div className="overview-head"><b>Slide overview</b><button onClick={() => setOverviewOpen(false)}>Close</button></div>
          <div className="overview-grid">
            {slides.map((item, itemIndex) => (
              <button className={itemIndex === index ? "current" : ""} onClick={() => go(itemIndex)} key={`${item.title}-${itemIndex}`}>
                <span>{String(itemIndex + 1).padStart(2, "0")}</span>
                <b>{item.title.replace("\n", " ")}</b>
                <small>{item.eyebrow}</small>
              </button>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
