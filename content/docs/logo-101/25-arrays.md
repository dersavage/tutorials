---
title: "25. Arrays"
weight: 25
---

A list is great for building by adding to the front. But there's one thing it's bad at: looking at the *millionth* item. To reach it, Logo has to walk past the other 999,999. For jobs where you want fast access to any position, Logo has **arrays**.

```logo
make "a array 3
setitem 1 :a "x
setitem 2 :a "y
setitem 3 :a "z
print item 2 :a
show :a
print count :a
```

Output: `y`, then `{x y z}`, then `3`. `array 3` makes a three-slot array, all empty to begin with, and `setitem` fills a slot: *which slot, which array, what value*. Arrays are shown in curly braces, to tell you at a glance that it's not a list. `item` and `count` work exactly as they do on lists, and that's no accident.

Here's the thing to notice that sets arrays apart: **`setitem` changes the array it's given**. It is Logo's first *destructive* operation. Remember how `fput` made a new list and left the old one alone? An array is the opposite: it's a box with slots, and you open the box and change what's inside.

Logo arrays count from one, like everything else in Logo. (If you want zero-based, you write `(array 3 0)`. The `0` says where the first index is. It's a small kindness that no other language I know offers.)

<div class="cmp">Python</div>

```python
a = [None] * 3
a[0] = "x"
a[1] = "y"
a[2] = "z"
print(a[1])
print(a)
print(len(a))
```

Python doesn't have a separate "array" for beginners: its list is *both*, and it's mutable. That's convenient and it conflates two ideas. `a[1] = "y"` sets a slot in place, which looks like assignment, and which is easy to confuse with the `=` of algebra. Logo's `setitem 2 :a "y` says what it does.

<div class="cmp">Raku</div>

```raku
my @a = (Any) xx 3;
@a[0] = "x";
@a[1] = "y";
@a[2] = "z";
say @a[1];
say @a;
say @a.elems;
```

Raku's arrays are likewise flexible and mutable, with the `@` sigil announcing "this is a collection". The shape is much the same as Python's, with some added ceremony for making a three-slot array out of nothing.

Because arrays are changed in place, they bring a famous hazard. Watch.

```logo
make "b :a
setitem 1 :b "CHANGED
print item 1 :a
```

Output: `CHANGED`. We changed `b`, and `a` changed too, because `make "b :a` didn't make a copy. Both names point at the *same array*. This is called **aliasing**, and it's the source of an enormous number of real-world bugs.

It's a rare moment where I teach something because it will go wrong. If two names share one box, changing one changes both. If you want an independent copy, you'd make a new array and fill it in, or convert to a list and back: `listtoarray arraytolist :a`. Remember this section next time you're puzzled by a bug where "I didn't touch it, and it changed anyway".

<div class="cmp">Python</div>

```python
b = a
b[0] = "CHANGED"
print(a[0])          # CHANGED, the same list

c = a.copy()         # an independent copy
```

Python's lists alias in precisely the same way. This is the single most common "wait, what?" moment for new Python programmers, and every beginner meets it. The fix is `.copy()`, or `list(a)`.

<div class="cmp">Raku</div>

```raku
my @b = @a;          # a copy: assignment copies in Raku
@b[0] = "CHANGED";
say @a[0];           # still x

my @c := @a;         # binding: the same array
```

Raku makes the *safer* choice by default: `=` copies the array, and you have to write the special binding operator `:=` to alias it on purpose. It's a genuinely better design for this particular trap.

{{< quiz >}}
type: choice
q: Why use an array instead of a list?
o: Arrays can hold more kinds of data
o*: Reaching any position is quick, and slots can be changed in place
o: Arrays print more nicely
why: Arrays are for fast, direct access by position. Lists are for building up by adding to the front.
===
type: choice
q: Which command changes a slot of an array?
o: `item`
o*: `setitem`
o: `fput`
why: `setitem index array value` changes the array it's given.
===
type: choice
q: After `make "b :a` where `:a` is an array, what is `:b`?
o: An independent copy
o*: The same array under a second name
o: A list
hint: Think about aliasing.
why: Arrays aren't copied by `make`, so changing one changes both names.
===
type: predict
q: Type what this prints.
pre: make "a array 3
pre: setitem 1 :a 10
pre: setitem 2 :a 20
pre: setitem 3 :a 30
code: print item 2 :a
code: print count :a
code: setitem 2 :a 99
code: print item 2 :a
why: The second slot is 20, there are 3 slots, and after `setitem` it's 99.
===
type: write
q: Make an array `box` of 2 slots, put `hi` in slot 1, and print slot 1.
expect: hi
solution: make "box array 2
solution: setitem 1 :box "hi
solution: print item 1 :box
hint: `array`, `setitem`, `item`.
why: You must `setitem` before you `item`.
{{< /quiz >}}
