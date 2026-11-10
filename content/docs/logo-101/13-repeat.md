---
title: "13. Doing it again: repeat"
weight: 13
---

Computers are good at one thing humans are bad at: doing the same thing many times without getting bored. Logo's simplest loop is `repeat`.

```logo
repeat 3 [print "hi]
repeat 5 [type "*]
print []
```

Output: `hi` three times, then `*****` on a line. `repeat` takes a **count** and a **list of instructions**, and runs the list that many times. It's the same list-as-code idea you met with `if`.

Logo's loop doesn't have a variable you set up, a condition, an increment or a block. It's *repeat this, three times*, which is how you'd say it to a person. I've watched seven-year-olds use this correctly on day one. No other language I teach gets there that fast.

<div class="cmp">Python</div>

```python
for _ in range(3):
    print("hi")

print("*" * 5)
```

Python's `for _ in range(3):` needs you to know what `range` is, why it starts at 0, and what `_` means (a throwaway name). It's the right tool and a poor first impression. And note that Python can print five stars without a loop at all: `"*" * 5`. That's clever, and a topic for lesson 30.

<div class="cmp">Raku</div>

```raku
for ^3 { say "hi" }
3.times: { say "hi" }
print "*" x 5;
say "";
```

Raku shines here: `3.times: { ... }` is almost as direct as Logo's `repeat 3 [ ... ]`, and `^3` is a range from 0 up to (not including) 3. The `x` operator repeats a string. Good, expressive stuff.

Often you want to know which time round you're on. Logo gives you a built-in counter called `repcount`.

```logo
repeat 4 [print repcount * repcount]
```

Output: `1`, `4`, `9`, `16`. `repcount` is `1` on the first pass, `2` on the second, and so on, counting from one. It's a loop variable you didn't have to declare.

Loops can nest, and nesting is how you get two-dimensional patterns.

```logo
repeat 3 [repeat 4 [type "x] print []]
```

That prints a 3-row, 4-column block of `x` characters. The inner `repeat` types four `x`s; `print []` finishes the line; the outer loop does it all three times.

<div class="cmp">Python</div>

```python
for i in range(1, 5):
    print(i * i)

for _ in range(3):
    print("x" * 4)
```

In Python you choose a name for the counter (`i` here), and choose where it starts. `range(1, 5)` gives 1, 2, 3, 4: it stops *before* 5. The half-open range is a consistent and useful rule, and it still catches out beginners again and again.

<div class="cmp">Raku</div>

```raku
say $_ * $_ for 1..4;
say "x" x 4 for ^3;
```

Raku's `1..4` is inclusive (1, 2, 3, 4) and `$_` is the implicit "current item". Sentences like `say $_ * $_ for 1..4` read almost like English. Raku really does fit lots of things in few characters.

{{< quiz >}}
type: choice
q: What does `repeat 3 [print "hi]` do?
o: Prints `hi` once
o*: Prints `hi` three times
o: Prints `hihihi` on one line
why: `repeat` runs the list of instructions the given number of times. `print` ends each line.
===
type: choice
q: What is `repcount` on the *first* pass through a `repeat` loop?
o: 0
o*: 1
o: The repeat count
why: `repcount` counts from one, matching how people count.
===
type: choice
q: What does `repeat 4 [type "a]` print?
o: `a` four times, one per line
o*: `aaaa` on a single line
o: Nothing
why: `type` doesn't end the line.
===
type: predict
q: Type what this prints.
code: repeat 3 [print repcount + 10]
hint: `repcount` is 1, 2, 3.
why: 11, 12, 13.
===
type: write
q: Write a command that prints the word `go` five times, one per line.
expect: go
expect: go
expect: go
expect: go
expect: go
solution: repeat 5 [print "go]
hint: `repeat`, a count, and a list.
why: `repeat 5 [print "go]` does it.
{{< /quiz >}}
