---
title: "8. Procedures with inputs"
weight: 8
---

A procedure that does the same thing every time is a bit dull. Let's give it **inputs**, the values it works on. In Logo, you list them after the name, each starting with a colon.

```logo
to greet :name
  print sentence [Hello,] :name
end
greet "Ada
greet "Grace
```

Output: `Hello, Ada` and `Hello, Grace`. The `:name` in the title line is a variable that gets its value from whatever you type after the procedure's name. Inside the body, `:name` is the same variable you already know from section 5, and it is automatically local.

Two things to notice. First, `sentence` joins things into one flat list, so `[Hello,]` and `Ada` become `Hello, Ada`. (We'll look at `sentence` closely in section 22.) Second, `sentence` normally takes two inputs, and that's exactly what it got. If you ever want more, you wrap the whole call in brackets, like `(sentence [a] [b] [c])`. You'll rarely need to.

Now look at how you *call* it. `greet "Ada`. No brackets round the input and no commas. Logo knows `greet` takes one input, so it takes the next thing.

<div class="cmp">Python</div>

```python
def greet(name):
    print("Hello,", name)

greet("Ada")
greet("Grace")
```

Python puts the input names in brackets in the definition and in the call, and the string needs quotes round it. Python's `print` adds the space between its inputs for you. Readable, and I'd never fault it. Just more symbols.

<div class="cmp">Raku</div>

```raku
sub greet($name) {
    say "Hello, $name";
}

greet "Ada";
greet "Grace";
```

Raku's string interpolation (`"Hello, $name"`) is more elegant than Logo's `sentence`. It's one of the genuinely nice things about Raku, and Logo has no real equivalent. Logo's answer is "use `sentence` or `word`", which is less compact but needs no special quoting rules inside strings.

Several inputs? Just list more.

```logo
to rectangle.area :w :h
  print :w * :h
end
rectangle.area 3 4
rectangle.area 10 2.5
```

Output: `12` and `25`. The inputs are matched to `:w` and `:h` in order. And because Logo knows `rectangle.area` takes exactly two inputs, you can nest calls without a single bracket: something like `print sum 1 product 2 3` works, because each command grabs exactly as many inputs as it needs.

That "fixed number of inputs" is the secret of Logo's clean look. It's a trade: you get no brackets and no commas, and the price is that a command can't quietly take a variable number of inputs (unless you ask with brackets).

<div class="cmp">Python</div>

```python
def rectangle_area(w, h):
    print(w * h)

rectangle_area(3, 4)
rectangle_area(10, 2.5)
```

Python, in exchange for commas and brackets, gives you much more: default values (`h=1`), keyword calls (`rectangle_area(h=2, w=5)`), and variable numbers of arguments with `*args`. That flexibility is why Python is a good *second* language. For a first, it's a lot of doors to leave open.

<div class="cmp">Raku</div>

```raku
sub rectangle-area($w, $h) {
    say $w * $h;
}

rectangle-area 3, 4;
rectangle-area 10, 2.5;
```

Raku shares Python's flexibility, and has named arguments and a type system you can add (`Int $w`). It still needs commas between inputs.

{{< quiz >}}
type: choice
q: In `to square :n`, what is `:n`?
o*: An input: a variable that gets its value when the procedure is called
o: A global variable
o: A comment
why: The names with colons after the procedure's name are its inputs.
===
type: choice
q: How do you call `rectangle.area` with the inputs 3 and 4?
o: `rectangle.area(3, 4)`
o*: `rectangle.area 3 4`
o: `rectangle.area 3, 4`
why: Logo inputs are separated by spaces, with no brackets or commas.
===
type: choice
q: Why does Logo need no brackets when you write `print sum 1 product 2 3`?
o: It guesses
o*: Every command knows how many inputs it takes, so it grabs exactly that many
o: Because `print` is special
hint: Think about fixed numbers of inputs.
why: Because each procedure has a fixed number of inputs, the reader can always tell where one call ends and the next begins.
===
type: predict
q: Type what this prints.
pre: to show.sum :a :b
pre:   print :a + :b
pre: end
code: show.sum 2 3
code: show.sum 10 20
code: show.sum 0.5 0.25
hint: Three calls, three lines.
why: 2 + 3 = 5, 10 + 20 = 30, 0.5 + 0.25 = 0.75.
===
type: write
q: Define `square :n` that prints `:n` times itself, then call it with `7`.
expect: 49
solution: to square :n
solution:   print :n * :n
solution: end
solution: square 7
hint: The body is `print :n * :n`.
why: `7 * 7` is 49.
{{< /quiz >}}
