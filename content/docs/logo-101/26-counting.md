---
title: "26. Counting things"
weight: 26
---

Here's a job that comes up in every field from biology to bookkeeping: *how many of each thing are there?* Count the letters in a book, the votes for each candidate, the rolls of each face of a die. The standard tool is a **tally**: an array with one slot per kind of thing, where you add one to the right slot each time you see something.

Let's count how many times each digit appears in a number.

```logo
to digitcount :num
  local "c
  make "c (array 10 0)
  for [i 0 9] [setitem :i :c 0]
  foreach :num [setitem ? :c (item ? :c) + 1]
  output :c
end
show digitcount 112358132134
```

Output: `{0 4 2 3 1 1 0 0 1 0}`. Read it as "zero 0 times, one 4 times, two 2 times, ...". Here, `(array 10 0)` makes an array whose indexes run from 0 to 9, so that the digit itself is the *index*, with no adding-one fiddling. The loop fills it with zeros, and then `foreach` walks over the digits of the number (remember, a number is a word, so `foreach` can go through it one character at a time). For each digit `?`, it reads the slot, adds one and writes it back.

This is the key trick. The data (a digit) *is* the address (an index). No searching, no `if` for each possible digit. Just: go straight to the right slot, and bump it. That's what arrays are for.

<div class="cmp">Python</div>

```python
def digitcount(num):
    c = [0] * 10
    for ch in str(num):
        c[int(ch)] += 1
    return c

print(digitcount(112358132134))
```

Python's version is close to Logo's. It needs `str(num)` to turn the number into something you can loop over, and `int(ch)` to turn each character back into a number, the two conversions that Logo's number-is-a-word idea saves you from. The `+= 1` is more compact than `setitem ... (item ...) + 1`, I'll grant you.

<div class="cmp">Raku</div>

```raku
say (112358132134.comb).Bag;
# Bag(1(4) 2(2) 3(3) 4 5 8)
```

Raku's `.Bag` does the whole job in a single word: it counts how many times each item occurs. That's lovely, and it hides everything we just learned. I'd teach the Logo way first and hand students `.Bag` after they've earned it.

Now let's *see* the tally. A histogram is a picture made of stars.

```logo
to bar :n
  repeat :n [type "*]
  print []
end
to histogram :c
  for [i 0 9] [type :i type "= bar item :i :c]
end
histogram digitcount 112358132134
```

Output: ten lines, `0=`, `1=****`, `2=**` and so on, with a row of stars for each digit. `bar` prints `:n` stars and ends the line. `histogram` walks through digits 0 to 9, prints the digit and an equals sign, then draws the bar for that slot.

Look at how little code that is, and how much it tells you. At a glance: the digit `1` appears more than anything else, and `0`, `6`, `7` and `9` never appear. A table of numbers would show the same thing, but your eye gets it from the shape.

<div class="cmp">Python</div>

```python
from collections import Counter

counts = Counter(str(112358132134))
for digit in "0123456789":
    print(f"{digit}={'*' * counts[digit]}")
```

Python's `Counter` is a dictionary that counts. The f-string and the `'*' * n` trick are good Python, and they're a bundle of ideas I'd rather not put in front of a beginner in one line. Logo's `bar` procedure takes more lines, and each one is plain.

<div class="cmp">Raku</div>

```raku
my %c = 112358132134.comb.Bag;
for 0..9 -> $d {
    say "$d=" ~ '*' x (%c{$d} // 0);
}
```

Raku's `x` operator repeats a string, and `//` supplies a default for a missing key. Nice short syntax. The Logo version spells out the loop and the stars, and you can see every step.

{{< quiz >}}
type: choice
q: What is the main idea of a tally array?
o: Store every item in order
o*: Use the item itself as the index, and add one to that slot
o: Sort the items first
why: The data is the address, so no searching is needed.
===
type: choice
q: What does `(array 10 0)` do?
o: Makes ten arrays
o*: Makes a ten-slot array whose first index is 0
o: Fills the array with zeros
why: The second input says where the indexes start. It doesn't fill the array: that's what the `for` loop is for.
===
type: choice
q: Why does `foreach :num [...]` work when `:num` is a number?
o: Numbers are special in `foreach`
o*: A number is a word, and `foreach` can go through a word one character at a time
o: It doesn't work
why: Logo makes no difference between a number and the word of its digits.
===
type: predict
q: Type what this prints.
pre: to bar :n
pre:   repeat :n [type "*]
pre:   print []
pre: end
code: bar 3
code: bar 0
code: bar 5
hint: `bar 0` prints just an empty line.
why: Three stars, an empty line, and five stars.
===
type: write
q: Define `tally.count :c :i` that outputs slot `:i` of the array `:c`. Then print `tally.count :a 2` for the array `a` already made.
pre: make "a (array 3 1)
pre: setitem 1 :a 5
pre: setitem 2 :a 7
pre: setitem 3 :a 9
expect: 7
solution: to tally.count :c :i
solution:   output item :i :c
solution: end
solution: print tally.count :a 2
hint: `item :i :c`: the index first, then the array.
why: It reads the second slot, which holds 7.
{{< /quiz >}}
