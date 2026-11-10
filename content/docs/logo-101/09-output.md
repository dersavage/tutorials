---
title: "9. Procedures that answer back"
weight: 9
---

So far our procedures *do* things. They print. A different kind of procedure *produces a value*, and that distinction is more important in Logo than in any other beginner language, because Logo makes you say which kind you wrote.

```logo
to double :n
  output :n * 2
end
print double 21
print double double 5
```

Output: `42` and `20`. The command `output` ends the procedure and hands a value to whoever called it. We call procedures that do this **operations**. Procedures that just do something, like `print`, are **commands**. `sum`, `first` and `sqrt` are operations. `print`, `make` and `to` are commands.

An operation produces a value, and you must do something with that value: feed it to a command, or to another operation. That's why `print double double 5` works: the inner `double 5` makes `10`, the outer `double` makes `20`, and `print` shows it.

<div class="cmp">Python</div>

```python
def double(n):
    return n * 2

print(double(21))
print(double(double(5)))
```

Python's `return` does the same job as `output`. The difference is that Python doesn't distinguish "a function that returns something" from "a function that does something". Every Python function returns *something* (`None` if you don't say), and that blurs the line. Logo draws it clearly, and the error messages reflect this: see below.

<div class="cmp">Raku</div>

```raku
sub double($n) { $n * 2 }

say double 21;
say double double 5;
```

Raku's subs return the value of their last expression, so you don't even need a `return` keyword. Elegant, and it takes a moment to accept that the last line "is" the answer. It's the opposite of Logo's very explicit `output`.

Here's the Logo behavior that surprises people the first time. Try giving an operation's answer *no destination*:

```logo
double 21
```

Logo says **`You don't say what to do with 42`**. It computed 42, and there's nobody to give it to. This is a strict rule, and I love it: the most common beginner mistake in any language is computing something and forgetting to show it. Logo catches that mistake and says so in plain English. Python happily throws the answer away.

```logo
to describe :n
  if :n > 100 [output "big]
  output "small
end
print describe 500
print describe 3
```

Output: `big` then `small`. A procedure can have several `output` lines; the first one that runs ends the procedure immediately. That makes `output` inside an `if` a tidy way to return early.

<div class="cmp">Python</div>

```python
def describe(n):
    if n > 100:
        return "big"
    return "small"

print(describe(500))
print(describe(3))
```

Same shape. `return` inside `if` leaves the function at once. This is a case where Python and Logo are practically the same, and I'm happy to say so.

<div class="cmp">Raku</div>

```raku
sub describe($n) {
    return "big" if $n > 100;
    "small"
}

say describe 500;
say describe 3;
```

Raku has the "postfix if" (`return "big" if $n > 100`), which reads like an English sentence. A lovely touch. Logo doesn't have it, but its `if [ ... ]` is just as direct.

{{< quiz >}}
type: choice
q: Which of these is an *operation* (it produces a value)?
o: `print`
o*: `sqrt`
o: `make`
why: `sqrt 16` produces `4`. `print` and `make` just do something and produce nothing.
===
type: choice
q: What does `output` do?
o: Prints a value
o*: Ends the procedure and hands a value to its caller
o: Defines a new procedure
why: `output` is how a procedure answers back. Note that it doesn't print anything; you need `print` for that.
===
type: choice
q: What happens if you type just `sum 3 4` on a line by itself?
o: It prints `7`
o: Nothing happens
o*: Logo says `You don't say what to do with 7`
hint: Where does the 7 go?
why: Operations produce values that must be used. Logo reports a value with nowhere to go.
===
type: predict
q: Type what this prints.
pre: to triple :n
pre:   output :n * 3
pre: end
code: print triple 4
code: print triple triple 2
hint: Work from the inside out for the second line.
why: `triple 4` is 12. `triple 2` is 6, and `triple 6` is 18.
===
type: write
q: Define an operation `cube :n` that outputs `:n * :n * :n`, then print `cube 3`.
expect: 27
solution: to cube :n
solution:   output :n * :n * :n
solution: end
solution: print cube 3
hint: Use `output`, not `print`, inside `cube`.
why: 3 * 3 * 3 is 27.
{{< /quiz >}}
