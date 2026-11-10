---
title: "2. Words and numbers"
weight: 2
---

Logo has very few kinds of data. The two you'll use constantly are **words** and **numbers**, and the line between them is blurrier than in any other language you've met.

```logo
print "apple
print 3.14
print wordp "apple
print numberp 3.14
```

`wordp` and `numberp` are **predicates**: they answer a yes-or-no question and output `true` or `false`. In UCBLogo, predicates end in the letter `p`. It's a Lisp habit ("p" for predicate), and once you know it, you can guess dozens of command names.

<div class="cmp">Python</div>

```python
print("apple")
print(3.14)
print(isinstance("apple", str))
print(isinstance(3.14, float))
```

To ask the same question in Python you need to know `isinstance`, the name of the class (`str`, `float`), and that there are *several* number types. A beginner does not want to hear about `int` versus `float` in lesson two.

<div class="cmp">Raku</div>

```raku
say "apple".WHAT;   # (Str)
say 3.14.WHAT;      # (Rat)
```

Raku is the most honest of the three, and the most surprising: `3.14` is a `Rat`, a rational number, stored as exactly 314/100, so `0.1 + 0.2 == 0.3` is true in Raku. That's wonderful, but it's not what a first lesson needs to explain.

Now the Logo trick that makes people either smile or frown.

```logo
print "3 + "4
print numberp "3
print word 3 4
print count 12345
```

The answers are `7`, `true`, `34` and `5`. A word that *looks* like a number *is* a number, as far as Logo is concerned. `word 3 4` glues two things into the word `34`, and `count 12345` counts its characters, because a number is also a word. There is no `int()` or `str()` conversion step and no `TypeError`.

I find this lovely for beginners: you never have to convert anything. The price is that the language can't warn you when you accidentally add a name and an age. You pay a little for the convenience, and for a child learning to program, I'd pay it every time.

<div class="cmp">Python</div>

```python
print(int("3") + int("4"))   # 7
print("3" + "4")             # 34
print(len(str(12345)))       # 5
```

Python refuses to guess. `"3" + "4"` is `"34"` (string concatenation) and you have to convert with `int()` to add. This strictness catches bugs in big programs. In a first lesson it's a wall.

<div class="cmp">Raku</div>

```raku
say "3" + "4";        # 7
say "3" ~ "4";        # 34
say 12345.chars;      # 5
```

Raku sits in the middle: `+` always means numeric addition and coerces its arguments, while `~` always means string joining. Two different operators, so the *operator* tells you the type, not the data. That's a clever design. It does mean learning two operators where Logo has a command (`word`) and an operator (`+`).

{{< quiz >}}
type: choice
q: What does `print numberp "3` print?
o: `false`, because `"3` is a word
o*: `true`, because a word that looks like a number is a number
o: An error
why: Logo doesn't separate "text that looks like a number" from a number. Both are words, and arithmetic works on either.
===
type: choice
q: Which name tells you the command is a yes-or-no question?
o: `wordp`
o: `numberp`
o*: Both, because UCBLogo predicates end in `p`
why: Every predicate in UCBLogo ends in `p`: `wordp`, `numberp`, `listp`, `emptyp`, `equalp` and so on.
===
type: choice
q: What does `print word 3 4` print?
o: `7`
o: `3 4`
o*: `34`
hint: `word` glues its inputs together. It doesn't add them.
why: `word` joins its inputs into one word, here `34`. Use `sum` or `+` for adding.
===
type: predict
q: Type what this prints.
code: print "3 + "4
code: print count 12345
code: print word 12 34
hint: Three lines of output.
why: `"3 + "4` is addition. `count 12345` counts digits. `word 12 34` glues, giving `1234`.
===
type: write
q: Write a command that prints the *count* of characters in the number 9876543.
expect: 7
solution: print count 9876543
hint: A number is also a word, and `count` counts the characters in a word.
why: `count` works on any word, and a number is a word.
{{< /quiz >}}
