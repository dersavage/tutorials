---
title: "3. Lists"
weight: 3
---

A **list** is an ordered collection in square brackets, and it is the most important data structure in Logo. Almost everything Logo does with data is a list in disguise, including its own code.

```logo
print [apples bananas cherries]
print count [apples bananas cherries]
print first [apples bananas cherries]
print last [apples bananas cherries]
print item 2 [apples bananas cherries]
```

You get the whole list, then `3`, `apples`, `cherries`, `bananas`. Notice there are no commas and no quotes on the items. Spaces separate the items, and each item is already a word. Logo counts from **one**, the way humans count, so `item 2` is the second thing.

<div class="cmp">Python</div>

```python
fruit = ["apples", "bananas", "cherries"]
print(fruit)
print(len(fruit))
print(fruit[0])
print(fruit[-1])
print(fruit[1])
```

Python needs quotes around each item, commas between them, and the name of a variable before you can do anything useful. Then indexing: `fruit[0]` is the *first* item and `fruit[1]` is the *second*. Zero-based counting is the right call for professional programmers, and I'd never argue otherwise. For a ten-year-old, it's an obstacle that has nothing to do with the idea of a list.

<div class="cmp">Raku</div>

```raku
my @fruit = <apples bananas cherries>;
say @fruit;
say @fruit.elems;
say @fruit[0];
say @fruit[*-1];
```

Raku's `< >` quoting is nice: no commas, no quotes, just like Logo. It also counts from zero, and needs the `my @fruit` declaration and sigil first.

Lists can hold lists. That's what makes them powerful.

```logo
show [1 [2 3] 4]
print count [1 [2 3] 4]
print first [[a b] [c d]]
print butfirst [1 2 3 4]
```

The inner list `[2 3]` counts as **one** item, so the count is `3`. `first [[a b] [c d]]` is the whole list `[a b]`, and `butfirst` is "everything but the first item", so `2 3 4`. Those two words, `first` and `butfirst`, are the foundation of nearly every list algorithm you'll write in Logo, and we'll lean on them heavily.

<div class="cmp">Python</div>

```python
nested = [1, [2, 3], 4]
print(len(nested))     # 3
print(nested[1:])      # [[2, 3], 4]
```

Python's slice syntax `nested[1:]` does what `butfirst` does, and it is much more powerful. It's also a small language of its own with its own rules, including negative numbers and steps. Logo gives you one simple word for the common case.

<div class="cmp">Raku</div>

```raku
my @nested = 1, [2, 3], 4;
say @nested.elems;     # 3
say @nested[1..*];     # ([2 3] 4)
```

Raku has ranges for this (`1..*` means "from index 1 to the end"). It's concise, and it's a feature you have to be told about. `butfirst` explains itself.

{{< quiz >}}
type: choice
q: What does `print count [1 [2 3] 4]` print?
o*: `3`
o: `4`
o: `2`
hint: How many *top-level* items are there? An inner list counts as one.
why: The items are `1`, `[2 3]` and `4`. The inner list is a single item.
===
type: choice
q: In Logo, which item does `item 1` pick?
o: The zeroth item
o*: The first item
o: The last item
why: Logo counts from one, the way people count.
===
type: choice
q: What is `butfirst [a b c]`?
o: `[a]`
o: `a`
o*: `[b c]`
why: `butfirst` outputs everything except the first item, still as a list.
===
type: predict
q: Type what this prints.
code: print first [x y z]
code: print last [x y z]
code: print count [x y z]
code: print item 2 [x y z]
why: First `x`, last `z`, three items, and the second one is `y`.
===
type: write
q: Write a command that prints the *last* item of the list `[red green blue]`.
expect: blue
solution: print last [red green blue]
hint: There's a command called `last`.
why: `last` outputs the final item of a list or word.
{{< /quiz >}}
