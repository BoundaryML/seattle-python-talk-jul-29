  
Title: FFIs but better: BAML Bridge  
Description: We've spent the last 8 months creating a new programming language, and also adding an ergonomic foreign function interface to it that are typesafe for all things. That means threads, generics, errors over the ffi boundary, and callbacks. We'll walk through both what something like this looks like and some details about how to bridge python ⭤ baml (by way of rust ffis).
Length: 25 min

# SLIDE: What is BAML?

Let's start with a demo!

5 min: intro bridge-python, show demos

- show different pieces of the demo:
	- python calls baml
	- highlight unions, generics
	- stateful file handles (as fields of objects)
	- image inputs, image outputs
	- callbacks

# Everything is bytes

Python box (Python VM) talking to BAML box (Baml execution engine)
Two arrows between the boxes: `bytes in →` and `← bytes out`
Box enclosing everything above it labeled `python my_python_baml_app.py`

===============
# Slide: One concrete `respond` call

Inside the Discord bot, one invocation might have these concrete Python values:

```baml
class DiscordMessage {
    from_user: string,
    content: string,
}

function respond(message: DiscordMessage, delete_callback: () -> null throws never, send_update: (string) -> null throws never) -> string {
    // ...
}
```

`baml generate` turns `DiscordMessage` into a Pydantic model and gives `respond` a type-checked Python signature:

```python
response = baml_sdk.respond(
    baml_sdk.DiscordMessage(
        from_user="sam",
        content="@bamlbot prepare the FFI talk slides. source code is in baml_language/",
    ),
    # We'll come back to how these lambdas cross the boundary later.
    lambda: tasks.append(loop.create_task(message.delete())),
    lambda update: tasks.append(loop.create_task(thread.send(update))),
)
```

The generated wrapper binds those positional arguments to `message`, `delete_callback`, and `send_update`. For this first pass, follow only the generated `DiscordMessage` object into BAML and the returned string back into Python. The callback values are deliberately elided from the wire views below.

# SLIDE GROUP: talk overview
- we're going to explain how we make this type-safe
- explain how the basic case works, passing simple data across the boundary
- explain one of the advanced cases
- give you some insight into how the complexity ramps up

# SLIDE GROUP: Type safety

BAML's goal is to let agents move fast, which means type safety.

Python has a lot of type safety issues, but with type checkers like `ty` , `pyright`, and `pyrefly`, if you _have_ type information to work with, your IDE _will_ respect it, and your agents also will!

{ screenshot: error when you pass in the wrong type }

```
baml_sdk.respond()
```

# SLIDE: How do we do this?

baml code
```
function respond(message: DiscordMessage, delete_callback: () -> null throws never, send_update: (string) -> null throws never) -> string
```

python code
```python
# baml_sdk/__init__.pyi
def respond(message: DiscordMessage, delete_callback: typing.Callable[[], None], send_update: typing.Callable[[str], None]) -> str:
    """Raises:
        DevOther, InvalidArgument, Io, LlmClient, RenderPrompt, Timeout"""
```

# SLIDE: We define rules for how to map items in BAML to Python
- for a given BAML file, what will the corresponding Python file be?
	- BAML's namespacing rules mean that we collapse multiple BAML files into a single Python file
- for a given BAML class definition, what will the corresponding Python class definition be?
	- BAML `DiscordMessage` becomes Pydantic `DiscordMessage`
- for a given BAML enum definition, what will the corresponding Python enum definition be?
	- BAML `enum Color { Red, Green, Blue }` becomes Python enum

# SLIDE: We define rules for how to map items in BAML to Python
- for a given BAML type, what will the corresponding Python type be?
	- BAML types should be relatively familiar to you: we have lists, maps, unions, generics, and closures.

This can get really complicated: what is the Python type corresponding to `Box<SlackMessage | DiscordMessage>[] | map<string, EmailMessage | LinkedInDm | TwitterDm>`?

===============
# SLIDE GROUP: Runtime
Bytes go in, bytes come out
Python value -> baml_inbound.proto -> bex_vm::call_function -> baml_outbound.proto -> Python value

# Slide: barrel function
```def _sync(*args: Any, **kwargs: Any) -> Any:
	merged = _build_kwargs(args, kwargs, required_names, optional_names)
	type_args = <snip>
	rt = get_runtime()
	call_id = new_function_call()
	args_proto = encode_call_args(
		merged,
		call_id,
		type_args,
		function_name=baml_fqn,
	)
	result_bytes = rt.call_function_sync(args_proto)
	return decode_call_result(result_bytes)
```



# Slide: encode_call_args
``
The `call_id` below is an illustrative runtime-generated value. The callback kwargs are omitted here so we can focus on ordinary serializable data.

```textproto
CallFunctionArgs {
  call_id: 9001
  function_name: "user.respond"
  kwargs {
    string_key: "message"
    value {
      value_type {
        class_ty {
          name: "user.DiscordMessage"
        }
      }
      class_value {
        fields {
          string_key: "from_user"
          value {
            string_value: "sam"
          }
        }
        fields {
          string_key: "content"
          value {
            string_value: "@bamlbot prepare the FFI talk slides. source code is in baml_language/"
          }
        }
      }
    }
  }
}
```

`respond` is not generic, so `type_args` is empty. The Pydantic model becomes a `class_value`: its fields are recursively serialized as strings, while the sparse `value_type.class_ty` annotation preserves the nominal `user.DiscordMessage` identity.

# Slide: call_function_sync

# Inbound BexExternalValue

After protobuf decoding, `kwargs_to_bex_values` has a `HashMap<String, BexExternalValue>` conceptually equivalent to:

```rust
HashMap::from([
    (
        "message".to_string(),
        BexExternalValue::typed(
            BexExternalValue::Instance {
                class_name: String::new(),
                type_args: vec![],
                fields: IndexMap::from([
                    (
                        "from_user".to_string(),
                        BexExternalValue::String("sam".into()),
                    ),
                    (
                        "content".to_string(),
                        BexExternalValue::String("@bamlbot prepare the FFI talk slides. source code is in baml_language/".into()),
                    ),
                ]),
            },
            RuntimeTy::class_with_args(
                TypeName::from_dotted_path("user.DiscordMessage"),
                vec![],
            ),
        ),
    ),
])
```

`BexExternalValue::typed` is a transient inbound type-annotation wrapper: the protobuf payload provides the instance fields, while `value_type.class_ty` preserves the nominal class identity needed by contextual VM materialization.

# Outbound `BexExternalValue`

Suppose this run completes successfully with the following illustrative model response:

```text
Done! Slides have been attached to B-832
```

At the engine-to-bridge boundary, the top-level return is:

```rust
BexExternalValue::String(
    "Done! Slides have been attached to B-832".into(),
)
```

This is the final return value from `respond`.

# Slide: decode_call_result

The outbound encoder places that string in the success arm of the top-level result envelope:

```textproto
BamlOutboundResult {
  ok {
    string_value: "Done! Slides have been attached to B-832"
  }
}
```

The Python decoder reads `ok.string_value` and returns a Python `str`, which is the value assigned to `response`.



===============


# But what about lambdas?

Python lambdas don't really have a serialization format.


# Let's go back to the earlier `respond` call

The ordinary `DiscordMessage` value is already covered. Focus now on the two Python function objects:

```python
response = baml_sdk.respond(
    discord_message,  # Serialized normally, as shown above.
    lambda: tasks.append(loop.create_task(message.delete())),
    lambda update: tasks.append(loop.create_task(thread.send(update))),
)
```

The bridge cannot serialize a lambda's code, closure variables, Python interpreter state, or object identity. Instead, it keeps each callable in Python and serializes a reference to it.

# A Python callable as a protobuf handle

The Python encoder calls `register_host_callable(send_update)`. The registry keeps a strong reference to the lambda and returns an illustrative runtime-generated key, `42`. Only that integer and its handle kind cross the boundary:

```textproto
InboundMapEntry {
  string_key: "send_update"
  value {
    handle {
      key: 42
      handle_type: HOST_VALUE_CALLABLE
    }
  }
}
```

`delete_callback` follows the same path with a different key. The function object itself never leaves Python.

# Inbound `BexExternalValue`

The Rust inbound decoder recognizes `HOST_VALUE_CALLABLE` and turns the handle into:

```rust
BexExternalValue::HostValue(
    HostValueArc::intern(42, HostValueKind::Callable),
)
```

This special handle does not use the ordinary CFFI handle table. `HostValueArc::intern` preserves identity for the key, and contextual conversion against `(string) -> null throws never` materializes a VM host closure.

# Slide: OK, so the Rust code has a u64 - now what?

```baml
send_update("Reading baml_language/")
```

When BAML calls the host closure, the VM sends key `42` and the serialized string argument through the host-call trampoline. Python uses key `42` to retrieve and invoke the original lambda, so `thread.send("Reading baml_language/")` runs in the Python process. The callback's return value crosses back through the same value codecs in the opposite direction.

The integer is the only representation of the lambda that crosses the FFI boundary. When the final `HostValueArc` is dropped, its release callback tells Python to remove key `42` from the registry.



- how does baml invoke a host handle?
	- baml->python trampoline
	- baml_outbound, baml_inbound - just reversed!
- what happens if a callback throws an exception?
	- this is why the host table is a host _value_ table

# Slide: OK, so the Rust code has a u64 - now what?

```rust
    bridge_cffi::register_host_dispatch_callback(host_value::host_dispatch_callback);
```

```rust
pub extern "C" fn host_dispatch_callback(
    host_value_key: u64,
    call_id: u32,
    args: *const u8,
    length: usize,
) { ... }
```

# Slide: We're just scratching the surface...
- What functions do you support across the boundary?
	- Free functions
	- Instance methods
	- Static methods
- Supporting both synchronous and asynchronous function calls
	- How do you cancel a function call?
	- If you modify Python `os.env`, how do you observe those changes in BAML?
	- If a BAML function throws an error, how does that error surface in Python? What's the API for handling that error?
- We now have a strategy for serializing Python values to BAML, but what about the other direction?
	- How do we return a closure from BAML to Python?
	- How do we represent a BAML file handle in Python?
	- What about a BAML socket?
- What happens when a closure binds a reference to a local variable?
- BAML supports generics: how do you recover generic information at the Python<->BAML boundary?

# Slide: try it out!

boundaryml.com/quickstart
