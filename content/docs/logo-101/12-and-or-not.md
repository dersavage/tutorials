---
title: "12. And, or, not"
weight: 12
---

Real decisions rarely hang on one comparison. "Is it raining *and* am I outside?" "Is the number zero *or* negative?" Logo gives you three words for combining conditions: `and`, `or` and `not`.

```logo
print and (3 > 1) (4 > 2)
print or (1 > 2) (4 > 2)
print not (3 > 1)
print (and "true "true "false)
```

Output: `true`, `true`, `false`, `false`. Like everything else in Logo, these are **prefix** operations: the word comes first, then its inputs. `and` and `or` take two inputs by default, and, as you saw in section 8, you can wrap the whole thing in brackets to give them more, like `(and "true "true "false)`.

The brackets round the comparisons, `(3 > 1)`, are doing an important job. Without them, Logo's reading of `and 3 > 1 4 > 2` is confusing even for Logo, so a little punctuation up front saves a long debugging session.

<div class="cmp">Python</div>

```python
print(3 > 1 and 4 > 2)
print(1 > 2 or 4 > 2)
print(not 3 > 1)
print(True and True and False)
```

Python puts `and` and `or` *between* things, the way English does, and that does read nicely: `3 > 1 and 4 > 2`. Chaining three is natural too. One less-known feature that Logo can't match: Python lets you write `0 < x < 10` as one comparison.

<div class="cmp">Raku</div>

```raku
say 3 > 1 and 4 > 2;
say 1 > 2 or 4 > 2;
say not 3 > 1;
say 0 < 5 < 10;      # chained, like Python
```

Raku has both the word forms (`and`, `or`, `not`) and the symbol forms (`&&`, `||`, `!`), and the same chained comparisons as Python. More options; more to choose from.

Let's use `and` to write something useful: a procedure that asks "is this number in a range?"

```logo
to between :x :lo :hi
  output and :x >= :lo :x <= :hi
end
print between 5 1 10
print between 15 1 10
```

Output: `true` and `false`. This is a nice example of Logo's "no brackets needed" reading at work: `and :x >= :lo :x <= :hi` is two comparisons, and `and` takes exactly two inputs, so it grabs both. (Logo's infix operators bind tighter than prefix command inputs, which is why `:x >= :lo` is read as one input.)

Logo also has another style of making a decision, which splits the *test* from the *action*.

```logo
test 3 > 5
iftrue [print "big]
iffalse [print "small]
```

`test` remembers whether its condition was true or false. `iftrue` (or `ift`) and `iffalse` (or `iff`) then run their lists depending on what `test` remembered. Output: `small`. It's a little unusual, and handy when the same test needs to control several different actions further down.

<div class="cmp">Python</div>

```python
def between(x, lo, hi):
    return x >= lo and x <= hi
    # or, more idiomatically: return lo <= x <= hi

print(between(5, 1, 10))
print(between(15, 1, 10))
```

The Pythonic version is `lo <= x <= hi`, and I'll admit it's more elegant than Logo's. Python has no `test`/`iftrue` pair; you store the condition in a variable instead, and that is cleaner. This is one area where Python's design simply won.

<div class="cmp">Raku</div>

```raku
sub between($x, $lo, $hi) { $lo <= $x <= $hi }
say between 5, 1, 10;
say between 15, 1, 10;
```

Chaining again. Short, and reads like the maths you'd write on paper.

{{< quiz >}}
type: choice
q: What does `print and "true "false` print?
o: `true`
o*: `false`
o: `truefalse`
why: `and` is only true if both inputs are true.
===
type: choice
q: What does `print or "false "true` print?
o*: `true`
o: `false`
o: An error
why: `or` is true if at least one input is true.
===
type: choice
q: How would you give `and` three inputs?
o: `and a b c`
o*: `(and a b c)`, with the whole call in brackets
o: You can't
hint: Section 8 mentioned brackets.
why: Wrapping a call in brackets lets you give it more inputs than its default.
===
type: predict
q: Type what this prints.
code: print not (2 > 1)
code: print and (1 < 2) (2 < 3)
code: print or (5 < 1) (5 > 1)
why: `not true` is false. `and true true` is true. `or false true` is true.
===
type: write
q: Define `inrange :x` that outputs true when `:x` is at least 1 and at most 10, then print `inrange 7`.
expect: true
solution: to inrange :x
solution:   output and :x >= 1 :x <= 10
solution: end
solution: print inrange 7
hint: `and`, with two comparisons.
why: 7 is at least 1 and at most 10, so it prints `true`.
{{< /quiz >}}
