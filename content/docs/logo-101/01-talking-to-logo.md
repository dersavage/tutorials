---
title: "1. Talking to Logo"
weight: 1
---

Logo reads a line, runs it, and prints a result if there is one. That's the entire user interface. No `main`, no imports, no boilerplate. You type a command and something happens.

```logo
print "hello
print [hello, world]
print 2 + 3
```

Press **Run**. Three lines of output: `hello`, `hello, world`, `5`.

Notice what you *didn't* have to write: no parentheses, no semicolons, no closing quote. `print` is a **command**; it takes one input and shows it. The quote mark in front of `hello` means "this is the word itself, don't go looking for a command called hello". A list goes in square brackets. And `2 + 3` is just evaluated before `print` sees it.

In UCBLogo's own window you'd see a `?` prompt before each line. That's the interpreter saying "your turn". I've left the prompt out so you can copy snippets straight into a real UCBLogo.

<div class="cmp">Python</div>

```python
print("hello")
print("hello, world")
print(2 + 3)
```

Python wants parentheses around the input and quotes at *both* ends of a string. Neither is hard, but that's already two rules before you've printed anything, and the second one (matching quotes) is the one beginners get wrong most.

<div class="cmp">Raku</div>

```raku
say "hello";
say "hello, world";
say 2 + 3;
```

Raku is closer to Logo here: no parentheses needed. But it still wants a closing quote and a semicolon after every statement, and it calls the command `say`, not `print`. (Raku does have a `print`; it doesn't add a newline. More on that in a moment.)

Now the part that confuses people: Logo has *three* printing commands.

```logo
type "ab
type "cd
print "ef
show [a b [c d]]
print [a b [c d]]
```

`type` prints without starting a new line, so `ab` and `cd` run together; `print "ef` finishes the line with `abcdef`. Then the interesting pair: `show` prints a list *exactly as Logo stores it*, outer brackets included. `print` strips the outermost brackets, because it assumes you're printing a sentence for a human, not inspecting data.

That distinction is small but useful. Use `print` for output people read, and `show` when you're debugging and want to see the real structure.

<div class="cmp">Python</div>

```python
print("ab", end="")
print("cd", end="")
print("ef")
print(["a", "b", ["c", "d"]])
```

To suppress Python's newline you pass a keyword argument, `end=""`. A beginner meets keyword arguments on day one just to print without a line break. And Python prints the list with commas and quotes, which is the `repr` view. There is no built-in "print it like a sentence" version.

<div class="cmp">Raku</div>

```raku
print "ab";
print "cd";
say "ef";
say [<a b>, [<c d>]];   # [(a b) [c d]]
```

Raku's split is the same idea as Logo's: `print` doesn't add a newline, `say` does. Its `say` also tidies up lists. Raku, to its credit, has thought about this problem too.

Logo's version is the easiest to learn because the three commands are named for what they do and take the same kind of input. No flags.

{{< quiz >}}
type: choice
q: Which command prints a list *without* the outer square brackets?
o: `show`
o*: `print`
o: `type` always shows the brackets
why: `print` is the one meant for human-readable output, so it drops the outer brackets. `show` keeps them so you can see the real structure of the data.
===
type: choice
q: What does the quote mark in `print "hello` tell Logo?
o: That the line is a comment
o: That a string begins and must be closed with another quote
o*: That `hello` is a word to be used as it is, not a command to run
why: The quote means "the word itself". There is no closing quote, because a word ends at the next space.
===
type: choice
q: After `type "ab` and then `type "cd`, what is on screen?
o: `ab` on one line and `cd` on the next
o*: `abcd` on one line
o: Nothing, because `type` needs brackets
hint: Think about what `type` does *not* do after printing.
why: `type` prints without moving to a new line, so the two words run together.
===
type: predict
q: Type exactly what this prints, line by line.
code: type "ab
code: print "cd
code: show [x y]
hint: `type` doesn't end the line, `print` does. `show` keeps the brackets.
why: `ab` and `cd` share a line, and `show` prints the list with its brackets.
===
type: write
q: Write one Logo command that prints the word `hello` on its own line.
expect: hello
solution: print "hello
hint: A command, a quote, then the word.
why: Any of `print "hello`, `pr "hello` or `show "hello` works, because all three finish the line after printing a plain word.
{{< /quiz >}}
