---
title: "23. Map, filter and reduce"
weight: 23
---

You've now written the same recursion three or four times: *walk down the list, do something with each item*. Programmers hate repeating themselves, so they gave the pattern a name. Logo has three of these **higher-order** commands, and between them they replace most of the recursion you've written so far.

```logo
print map [? * ?] [1 2 3 4]
print filter [? > 2] [1 2 3 4]
print reduce [?1 + ?2] [1 2 3 4]
```

Output: `1 4 9 16`, then `3 4`, then `10`.

- **`map`** applies a recipe to *every* item and gives back a list of the results. Here, square each.
- **`filter`** keeps only the items for which the recipe is *true*. Here, those bigger than 2.
- **`reduce`** squashes the whole list down to *one* value by combining items two at a time. Here, adding them up. `?1` and `?2` are the two things being combined.

In the first two, `?` is the current item, the same `?` as in `foreach`. The recipe is a list, and you know what Logo does with lists-as-code by now.

These three are the most important ideas in this whole tutorial, and I'll tell you why. Once you see "transform each", "keep some" and "combine all", you'll see them in almost every program ever written, in every language. They are a way of thinking.

<div class="cmp">Python</div>

```python
from functools import reduce

print([x * x for x in [1, 2, 3, 4]])
print([x for x in [1, 2, 3, 4] if x > 2])
print(reduce(lambda a, b: a + b, [1, 2, 3, 4]))

print(list(map(lambda x: x * x, [1, 2, 3, 4])))
print(list(filter(lambda x: x > 2, [1, 2, 3, 4])))
```

Python can do all three. Comprehensions are its preferred form for `map` and `filter`, and `reduce` has to be imported from `functools`: Guido van Rossum famously disliked it. You end up with three different notations, and `lambda` for the nameless function. Logo's `?` and list recipe are less pretty and more uniform.

<div class="cmp">Raku</div>

```raku
say (1, 2, 3, 4).map(* ** 2);
say (1, 2, 3, 4).grep(* > 2);
say (1, 2, 3, 4).reduce(* + *);
say [+] 1, 2, 3, 4;
```

Raku is the champion of this style: `map`, `grep` (its word for filter) and `reduce` are all built in, and the "whatever star" gives a very light notation for a recipe. This is the one place where I'd say Raku is simply *better designed* for the job than both Logo and Python.

The recipe doesn't have to be an anonymous list. You can hand over the **name** of a procedure you've already written.

```logo
to double :n
  output :n * 2
end
to evenp :n
  output (remainder :n 2) = 0
end
print map "double [1 2 3]
print filter "evenp [1 2 3 4 5 6]
print map "uppercase [red green blue]
```

Output: `2 4 6`, `2 4 6`, `RED GREEN BLUE`. Note the quote before each name: you're handing over the *word* `double`, the name of the procedure, and not calling it. That's why section 5's distinction between a name and its value matters. And you can combine them: `print reduce [?1 + ?2] filter "evenp [1 2 3 4 5 6]` adds up the even numbers.

This is **composition**, small pieces snapped together. The recipe for "the sum of the squares of the even numbers" is three words long: `reduce`, `map`, `filter`. And that's the payoff for all that work with recursion: now you know *what's happening inside*, so these tools are no longer magic.

<div class="cmp">Python</div>

```python
def double(n):
    return n * 2

print(list(map(double, [1, 2, 3])))
print([w.upper() for w in ["red", "green", "blue"]])
```

Python also takes a function by name, and without quotes: `map(double, ...)`, because functions are values. It's lovely, and it's another idea you must learn before you can use `map`. In Logo you learn "a name in quotes" in the first hour.

<div class="cmp">Raku</div>

```raku
sub double($n) { $n * 2 }
say (1, 2, 3).map(&double);
say <red green blue>.map(*.uc);
```

Raku passes subs with an ampersand (`&double`), and its `*.uc` is a recipe meaning "call `.uc` on whatever you get". Compact. The sigils are doing real work here.

{{< quiz >}}
type: choice
q: Which command keeps only the items that pass a test?
o: `map`
o*: `filter`
o: `reduce`
why: `filter` keeps the items for which the recipe is true.
===
type: choice
q: What does `reduce` do?
o: Makes a list shorter by deleting items
o*: Combines all the items into a single value
o: Sorts the list
why: `reduce [?1 + ?2] [1 2 3 4]` combines the items two at a time into one answer.
===
type: choice
q: Why is there a quote in `map "double [1 2 3]`?
o: It's a typo
o*: You're passing the word `double`, the procedure's name, rather than running it
o: It makes the numbers words
why: The quote makes `double` a plain word, which `map` then uses to look up the procedure.
===
type: predict
q: Type what this prints.
code: print map [? + 1] [10 20 30]
code: print filter [? < 3] [1 2 3 4 5]
code: print reduce [?1 * ?2] [1 2 3 4]
why: Add one to each; keep those under 3; multiply them all.
===
type: write
q: Use `map` to print the squares of `[5 6 7]` (squares of each item, as a list).
expect: 25 36 49
solution: print map [? * ?] [5 6 7]
hint: `map [? * ?] [...]`.
why: `?` is each item in turn.
{{< /quiz >}}
