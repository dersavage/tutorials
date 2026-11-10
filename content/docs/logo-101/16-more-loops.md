---
title: "16. More ways to loop"
weight: 16
---

`repeat` is wonderful when you know the count and don't care which pass you're on. For everything else, Logo has a handful of other loops.

```logo
for [i 1 5] [print :i * :i]
for [i 10 0 -5] [print :i]
```

Output: `1 4 9 16 25`, then `10 5 0`. The first argument is a little list: the **name** of the counter, where it starts, where it ends, and (optionally) the step. So `[i 10 0 -5]` means "i starts at 10, goes to 0, in steps of minus 5". Inside the second list, `:i` is the current value.

Notice that it's the same shape you've met three times now: a keyword, some setup, and a list of instructions to run. Once you know that shape, `for` needs no extra explaining.

<div class="cmp">Python</div>

```python
for i in range(1, 6):
    print(i * i)

for i in range(10, -1, -5):
    print(i)
```

Python's `range` stops *before* the end value, so `range(1, 6)` gives 1 to 5 and `range(10, -1, -5)` gives 10, 5, 0. You have to remember to add one at the end of an up-count and subtract one on a down-count. Logo's `for` is inclusive, which is how a human thinks about "one to five".

<div class="cmp">Raku</div>

```raku
for 1..5 -> $i { say $i * $i }
for 10, 5 ... 0 -> $i { say $i }
```

Raku's `1..5` is inclusive like Logo's, and its `...` operator builds a sequence by *inferring the pattern*: `10, 5 ... 0` works out that it's stepping down by 5. Clever, and more magic than I'd put in front of a beginner.

Sometimes you don't know in advance how many times to loop. You want to go until something becomes true. That's `while` and `until`.

```logo
make "n 1
while [:n < 100] [make "n :n * 2]
print :n
```

Output: `128`. The list in the first position is the **condition**, written as a list so that Logo can re-check it each time round. `n` doubles from 1 to 2, 4, 8, ..., 64, 128, and the loop stops when it's no longer under 100. `until` is the mirror image: it loops *until* its condition becomes true.

And when you want to do something with each item of a list, there's `foreach`.

```logo
foreach [red green blue] [print ?]
foreach [1 2 3] [print ? * 10]
```

Output: `red green blue`, then `10 20 30`. Inside the loop, `?` stands for the current item. I'll be honest about this one: `?` is terse, and it's the least readable part of Logo. It's hard to say what `?` means when you're reading someone's code cold. Newer Logos let you name the item.

<div class="cmp">Python</div>

```python
n = 1
while n < 100:
    n = n * 2
print(n)

for colour in ["red", "green", "blue"]:
    print(colour)
```

Python's `while` takes a plain condition with no extra brackets, and its `for x in items` lets you *name* the item, which is clearer than Logo's `?`. This is one of the few places where I think Python's design is simply nicer to read.

<div class="cmp">Raku</div>

```raku
my $n = 1;
$n *= 2 while $n < 100;
say $n;

for <red green blue> -> $colour { say $colour }
```

Raku has a postfix `while` (`$n *= 2 while $n < 100`) that reads like English, and the same named loop variable as Python.

{{< quiz >}}
type: choice
q: In `for [i 1 5] [print :i]`, what is `[i 1 5]`?
o: The instructions to run
o*: The counter's name, start and end
o: A list of three items to print
why: The first list names the counter and sets where it starts and ends.
===
type: choice
q: In `foreach [a b c] [print ?]`, what does `?` stand for?
o: A question about the list
o*: The current item
o: The whole list
why: Inside a `foreach`, `?` is the item currently being visited.
===
type: choice
q: Which loop keeps going while a condition is true?
o: `repeat`
o*: `while`
o: `for`
why: `while [condition] [instructions]` re-checks the condition before each pass.
===
type: predict
q: Type what this prints.
code: for [i 2 10 4] [print :i]
hint: Start at 2, step by 4.
why: 2, then 6, then 10. The next would be 14, which is past the end.
===
type: write
q: Use `for` to print the numbers 1 to 4 on separate lines.
expect: 1
expect: 2
expect: 3
expect: 4
solution: for [i 1 4] [print :i]
hint: `for [i 1 4] [ ... ]`.
why: `for` is inclusive of the end value.
{{< /quiz >}}
