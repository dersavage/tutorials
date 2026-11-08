---
title: "Logo 101"
weight: 10
---

# Logo 101

A short, hands-on introduction to programming in Logo (UCBLogo). Type the examples into a Logo interpreter; the `?` is the prompt, so don't type it. Lines without a `?` show what Logo prints back.

This tutorial follows the order of *How to Think Like a Computer Scientist: Logo Version* by Allen Downey and Lynn Andrea Stein, Logo version adapted by Gay, which is free under the GNU Free Documentation License. The explanations here are written fresh.

## 1. Talking to Logo

Logo reads a line, runs it, and prints a result if there is one.

```logo
? print "Hello
Hello
? print [Hello, world]
Hello, world
? show [Hello, world]
[Hello, world]
? print 2 + 3
5
```

- `print` shows its input without the outer brackets; `show` shows it exactly as Logo stores it.
- A **word** starts with a quote: `"Hello`. A **list** sits in square brackets.
- `type` is like `print` but doesn't start a new line.

## 2. Data: words, numbers, lists, arrays

```logo
? print 3.14          ; a number
? print "apple        ; a word
? show [a b [c d]]    ; a list, which can hold lists
? show {1 2 3}        ; an array
```

Everything after a `;` is a **comment**: Logo ignores it.

Ask Logo what something is with predicates (commands whose names end in `p`):

```logo
? show numberp 5
true
? show wordp "apple
true
? show listp [1 2]
true
? show arrayp {1 2}
true
```

## 3. Variables

`make` gives a name to a value; `:name` (or `thing "name`) reads it back.

```logo
? make "x 7
? print :x
7
? make "x :x + 1
? print :x
8
? make "greeting [good morning]
? print :greeting
good morning
```

## 4. Operators

```logo
? print 7 + 2 * 3
13
? print (7 + 2) * 3
27
? print 17 / 5
3.4
? print remainder 17 5
2
? print quotient 17 5
3.4
? print int 3.9
3
? print sqrt 16
4
? print 2 = 2
true
? print (3 < 5) and (5 < 4)
false
? print not (3 < 5)
false
```

`remainder` is the key to "is it even?" tests: `remainder :n 2` is `0` for even numbers.

## 5. Procedures

Define your own commands with `to ... end`. Inputs are variables written after the name.

```logo
to greet :name
  print (sentence [Hello,] :name)
end

to square :n
  print :n * :n
end
```

```logo
? greet "Ada
Hello, Ada
? square 12
144
```

A procedure can call other procedures. Variables created with `make` inside a procedure are global unless you declare them `local`:

```logo
to demo
  local "temp
  make "temp 99
  print :temp
end
```

You can list your definitions with `po "square` (print out), delete one with `erase "square`, and wipe everything with `erall`.

## 6. Making decisions

`if` runs a list of instructions when a condition is true. `ifelse` chooses between two lists. `stop` ends a procedure early.

```logo
to sign :n
  if :n > 0 [print "positive stop]
  if :n < 0 [print "negative stop]
  print "zero
end

to parity :n
  ifelse (remainder :n 2) = 0 [print "even] [print "odd]
end
```

Combine conditions with `and`, `or` and `not`:

```logo
? print and (3 > 1) (4 > 2)
true
? print or "false "true
true
```

## 7. Recursion

A procedure may call itself. A good recursive procedure has a **base case** that stops, and a step that moves toward it.

```logo
to countdown :n
  if :n = 0 [print [Liftoff!] stop]
  print :n
  countdown :n - 1
end
```

```logo
? countdown 3
3
2
1
Liftoff!
```

Use `trace "countdown` to watch each call (and `untrace "countdown` to stop).

## 8. Procedures that give back values

A command *does* something; an **operation** *outputs* a value with `output` (or `op`). Operations can be used as inputs to other procedures.

```logo
to factorial :n
  if :n = 0 [output 1]
  output :n * factorial :n - 1
end

to fib :n
  if :n < 2 [output :n]
  output (fib :n - 1) + (fib :n - 2)
end
```

```logo
? print factorial 5
120
? print fib 10
55
```

Predicates are operations that output `true` or `false`:

```logo
to divisiblep :a :b
  output (remainder :a :b) = 0
end

? print divisiblep 12 4
true
```

Note that `fib` calls itself twice per step, so large inputs are slow. We fix that in section 13.

## 9. Loops

Recursion is not the only way to repeat.

```logo
? repeat 3 [print "hi]
hi
hi
hi

? foreach [red green blue] [print ?]
red
green
blue

? make "i 1
? while [:i <= 5] [print :i * :i make "i :i + 1]
1
4
9
16
25
```

Inside `foreach`, `?` is the current item, and `#` its position (starting at 1). `localmake "name value` is shorthand for `local "name` followed by `make "name value`.

A multiplication table is a loop inside a loop:

```logo
to table :n
  for [i 1 10] [print (sentence :i "x :n "= :i * :n)]
end

? table 7
```

## 10. Words and characters

```logo
? print first "banana
b
? print butfirst "banana
anana
? print last "banana
a
? print butlast "banana
banan
? print item 3 "banana
n
? print count "banana
6
? print word "sun "flower
sunflower
```

Words behave like lists of letters. A simple scramble that walks a word letter by letter:

```logo
to reverse :w
  if emptyp :w [output "]
  output word (reverse butfirst :w) first :w
end

? print reverse "logo
ogol
```

A classic exercise is ROT13: replace each letter by the one 13 places later. It is its own inverse, so applying it twice gives back the original. You can build it with a lookup of the alphabet (`item` and `count`), or with a property list (section 13).

## 11. Lists

```logo
? make "shopping [eggs milk bread]
? print first :shopping
eggs
? print butfirst :shopping
milk bread
? print fput "tea :shopping       ; add at the front
tea eggs milk bread
? print lput "jam :shopping       ; add at the end
eggs milk bread jam
? print sentence [a b] [c d]
a b c d
? print list [a b] [c d]
[a b] [c d]
? print item 2 :shopping
milk
```

`sentence` flattens, `list` nests. Compare `sentence [a b] [c d]` with `list [a b] [c d]`.

A list can also be a *queue*: take items from the front, add at the back.

```logo
to sum.list :l
  if emptyp :l [output 0]
  output (first :l) + sum.list butfirst :l
end

? print sum.list [3 4 5]
12
```

Random numbers are handy for games: `random 6` gives 0 to 5, so `1 + random 6` simulates a die. Use `iseq 1 5` to build `[1 2 3 4 5]`.

## 12. Arrays

An array is a fixed-size collection with fast access by position.

```logo
? make "a array 5            ; five slots, starting at 1
? setitem 1 :a "x
? setitem 2 :a "y
? print item 1 :a
x
? show {10 20 30}
{10 20 30}
```

Lists are easy to grow; arrays are quick to read and change a slot. Use an array of counters to tabulate data, for instance counting how many times each face of a die appears in 100 rolls:

```logo
to rolls :n
  local "counts
  make "counts array 6
  for [i 1 6] [setitem :i :counts 0]
  repeat :n [
    localmake "d 1 + random 6
    setitem :d :counts (item :d :counts) + 1
  ]
  output :counts
end

? show rolls 100
```

## 13. Property lists

A property list stores *name → value* pairs under a list name.

```logo
? pprop "fruit "apple 3       ; put apple = 3 in list "fruit"
? pprop "fruit "pear 5
? print gprop "fruit "apple   ; get a value
3
? show plist "fruit           ; the whole list
[pear 5 apple 3]
? remprop "fruit "pear
? erpl "fruit                 ; erase the whole property list
```

Property lists are perfect for **counting how often things occur**, such as words in a sentence:

```logo
to count.words :text
  erpl "wc
  foreach :text [
    pprop "wc ? ifelse emptyp gprop "wc ? [1] [(gprop "wc ?) + 1]
  ]
  output plist "wc
end

? show count.words [the cat saw the dog and the bird]
```

You get each distinct word paired with its count; `the` appears 3 times.

They are also useful for **memoization**: remember answers you already computed, so a slow recursive procedure runs fast.

```logo
to fastfib :n
  if :n < 2 [output :n]
  if not emptyp gprop "fibs :n [output gprop "fibs :n]
  localmake "r (fastfib :n - 1) + (fastfib :n - 2)
  pprop "fibs :n :r
  output :r
end

? print fastfib 30
832040
```

## 14. Files

Logo can save data to disk and read it back.

```logo
? openwrite "out.txt
? setwrite "out.txt
? print [This goes into the file]
? setwrite []                  ; back to the screen
? close "out.txt

? openread "out.txt
? setread "out.txt
? make "line readlist
? setread []
? close "out.txt
? show :line
[This goes into the file]
```

Reading helpers:

- `readlist` reads a line as a list; `readword` reads a line as a word; `readchars 5` reads five characters.
- `eofp` is true when there is nothing left to read.
- `setprefix "/some/dir` sets the folder Logo looks in.

Copy a file in 50-character chunks:

```logo
to copyfile :in :out
  openread :in
  setread :in
  openwrite :out
  setwrite :out
  local "text
  while [not eofp] [
    make "text readchars 50
    type :text
  ]
  close :in
  close :out
  setread []
  setwrite []
end
```

Save your whole workspace with `save "session.lgo`, clear it with `erall`, and restore it with `load "session.lgo`. `dribble "log.txt` records everything you type afterwards.

## 15. Putting it together: a frequency table

Combine property lists and files. Given a file with one record per line, such as `m 38` or `f 40` (sex and shoe size), count each distinct line:

```logo
to freqfile :file
  openread :file
  setread :file
  erpl "freq
  freqloop
  setread []
  close :file
  output plist "freq
end

to freqloop
  if eofp [stop]
  localmake "key butlast list2word readlist
  pprop "freq :key ifelse emptyp gprop "freq :key [1] [(gprop "freq :key) + 1]
  freqloop
end

to list2word :l
  if emptyp :l [output "]
  output (word first :l ": list2word butfirst :l)
end
```

The result is a list like `[f:38 359 m:42 212 ...]`: each combination followed by its frequency.

## Cheat sheet

| Idea | Commands |
|---|---|
| Output | `print` `show` `type` |
| Data tests | `numberp` `wordp` `listp` `arrayp` `emptyp` `equalp` |
| Variables | `make` `thing` `:x` `local` `localmake` |
| Procedures | `to ... end` `output` `stop` `po` `erase` `erall` |
| Control | `if` `ifelse` `repeat` `while` `for` `foreach` |
| Words/lists | `first` `last` `butfirst` `butlast` `item` `count` `word` `sentence` `list` `fput` `lput` |
| Arrays | `array` `setitem` `item` |
| Property lists | `pprop` `gprop` `plist` `remprop` `erpl` |
| Files | `openread` `openwrite` `setread` `setwrite` `readlist` `readword` `readchars` `eofp` `close` `save` `load` |

## Exercises

1. Write `power :base :exp` recursively (`power 2 10` is 1024).
2. Write `palindromep :word` that outputs `true` for `"level`.
3. Write `average :list` using `sum.list` and `count`.
4. Count the vowels in a word with `foreach`.
5. Roll two dice 1000 times and tabulate the totals with a property list.

Want to try these live? The [Logo tutorial with interpreter](https://jansavagelogo.surge.sh/) runs in your browser.
