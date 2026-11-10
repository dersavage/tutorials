---
title: "7. Your first procedure"
weight: 7
---

This is where Logo starts to feel like a different kind of language. You teach it new words.

```logo
to greet
  print [Hello from my first procedure!]
end
greet
greet
```

Run it. The first thing Logo says is `greet defined`. That's Logo confirming you've added a word to its vocabulary. From now on `greet` is as much a part of the language as `print`. The next two lines use it, and the sentence appears twice.

`to` opens a definition, and `end` closes it. Everything in between is the **body**. You are not running anything while you define it; you're just storing the instructions under a name.

I want to stress how different this feels from other languages. In Logo, there's no special syntax for "function" as opposed to "built-in command". Your `greet` and the built-in `print` are used the same way. That's why Logo programs feel like you're *extending the language* rather than writing something on top of it.

<div class="cmp">Python</div>

```python
def greet():
    print("Hello from my first procedure!")

greet()
greet()
```

`def`, a pair of brackets (empty here, but required), a colon, and indentation that *is* the syntax. Then you call it with brackets again. Perfectly sensible, and the indentation rule is excellent for readability. But there's more punctuation to get right, and calling `greet` without the brackets silently does nothing.

<div class="cmp">Raku</div>

```raku
sub greet {
    say "Hello from my first procedure!";
}

greet;
greet;
```

Raku's `sub` with braces looks a lot like Logo's `to ... end`, and you can call `greet;` without brackets, same as Logo. This is the Python-to-Logo midpoint.

Procedures can call other procedures, and that's how you build big things out of small ones.

```logo
to hello
  print "hello
end
to hello.twice
  hello
  hello
end
hello.twice
```

Output: `hello` twice. `hello.twice` doesn't know or care how `hello` works. It just trusts that the word does what its name says. That's **abstraction**, the central idea in all of programming, and in Logo you start doing it in your first ten minutes.

Notice the names, too: `hello.twice` has a dot in it. Dots are legal in Logo names, and Logo programmers use them the way Python programmers use underscores. By convention the dot says "this is a variation on that".

You can change your mind at any time. Retype the definition and the old one is replaced. There is no compile step and no restart: define, run, tweak, run again. For a learner, that loop of a few seconds is the entire game.

<div class="cmp">Python</div>

```python
def hello():
    print("hello")

def hello_twice():
    hello()
    hello()

hello_twice()
```

The same structure, one function calling another. Python is fine here. I'd only point out the one real difference: in Python you usually write a *file* and run it, and the rewriting loop is slower. (Python has a REPL too, but its multi-line editing is awkward compared to Logo's.)

<div class="cmp">Raku</div>

```raku
sub hello { say "hello" }
sub hello-twice { hello; hello }
hello-twice;
```

Raku allows hyphens in names, as in `hello-twice`, which is a nice readable choice. Logo's dots do the same job.

{{< quiz >}}
type: choice
q: What does Logo print right after you type `to greet … end`?
o: Nothing, since definitions are silent
o*: `greet defined`
o: The body of `greet`
why: UCBLogo confirms each definition with `name defined`.
===
type: choice
q: What do `to` and `end` do?
o: Run the instructions between them immediately
o*: Mark the start and end of a new procedure definition
o: Create a loop
why: Everything between `to` and `end` is stored under the new name and runs only when you use that name.
===
type: choice
q: You type the definition of `greet` a second time with different instructions. What happens?
o: An error, because the name is taken
o: Both versions are kept
o*: The new definition replaces the old one
why: Redefining a procedure simply replaces it, which is perfect for the edit and re-run loop.
===
type: predict
q: Type what this prints.
pre: to ping
pre:   print "ping
pre: end
pre: to pingpong
pre:   ping
pre:   print "pong
pre: end
code: pingpong
code: ping
hint: `pingpong` calls `ping` first.
why: `pingpong` prints `ping`, then `pong`. Then the second line runs `ping` on its own.
===
type: write
q: Define a procedure called `cheer` that prints `hooray`, then call it once.
expect: hooray
solution: to cheer
solution:   print "hooray
solution: end
solution: cheer
hint: `to cheer`, the body, `end`, then the name on its own line.
why: Defining `cheer` prints only `cheer defined`, which this checker ignores. The call prints `hooray`.
{{< /quiz >}}
