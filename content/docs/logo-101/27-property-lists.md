---
title: "27. Property lists"
weight: 27
---

Arrays are wonderful when the thing you're counting is a small whole number. But what if you want to count *words*? Or look up a phone number by name? Names aren't numbers, so you can't use them as array positions. You need a lookup table, and Logo's is called a **property list**.

```logo
pprop "fruit "apple 3
pprop "fruit "pear 5
print gprop "fruit "apple
print gprop "fruit "pear
print gprop "fruit "plum
```

Output: `3`, `5` and an empty line. `pprop` stores a value: *which property list, which name, which value*. `gprop` gets it back. And asking for something that isn't there doesn't crash. You get an empty list, which prints as an empty line, and can be tested with `emptyp`.

Think of `"fruit` as the name of a notebook, `apple` as a heading in it, and `3` as what's written under the heading. You can have as many notebooks as you like.

A word about history. Property lists are one of the oldest ideas in Lisp, and they live in a *global* space, shared by the whole program. In a modern language you'd use something more self-contained, a dictionary. I think that's fair to say about Logo: this is its weakest idea. It works, and it's good enough for what we're doing.

<div class="cmp">Python</div>

```python
fruit = {}
fruit["apple"] = 3
fruit["pear"] = 5
print(fruit["apple"])
print(fruit["pear"])
print(fruit.get("plum"))      # None
print(fruit["plum"])          # KeyError
```

Python's **dictionary** is the grown-up version of a property list: it's a value you hold in a variable, not a global notebook, and you can have as many as you like, nested inside one another. It's better in every way except that you have to learn the curly braces and the square-bracket syntax, plus the difference between `fruit["plum"]` (crashes) and `fruit.get("plum")` (gives `None`).

<div class="cmp">Raku</div>

```raku
my %fruit;
%fruit<apple> = 3;
%fruit<pear> = 5;
say %fruit<apple>;
say %fruit<plum>;      # (Any), no crash
```

Raku's hashes use `%` and the angle-bracket subscript `%fruit<apple>`, which is unusually tidy. A missing key gives you `(Any)`, an undefined value, rather than an error.

Now the payoff: counting *words*. This is how a search engine starts.

```logo
to count.words :text
  foreach :text [pprop "wc ? ifelse emptyp gprop "wc ? [1] [1 + gprop "wc ?]]
end
count.words [the cat saw the dog and the bird]
print gprop "wc "the
print gprop "wc "cat
print gprop "wc "fish
```

Output: `3`, `1` and an empty line. For each word `?`, we ask: *have we seen it before?* If the property is empty, this is the first time, so store 1. If not, store the old count plus one. That `ifelse` is an *operation* here (section 11), choosing the value to store.

Notice that this is the *tally* idea from the last section, but with words as the keys instead of digits as the indexes. The idea is identical. Only the container changed, and that's how you know it's a real idea and not a trick.

<div class="cmp">Python</div>

```python
from collections import Counter

words = "the cat saw the dog and the bird".split()
counts = Counter(words)
print(counts["the"])
print(counts["cat"])
print(counts["fish"])    # 0
```

Python's `Counter` does the entire thing, including the "never seen" case, which returns 0 instead of an error. In real work, that's what you'd use. The Logo version shows you what `Counter` is doing inside.

<div class="cmp">Raku</div>

```raku
my %count = <the cat saw the dog and the bird>.Bag;
say %count<the>;
say %count<cat>;
say %count<fish>;      # 0
```

Same story: `.Bag` counts for you. All three languages give you the same answers. What changes is how much of the machinery you see.

{{< quiz >}}
type: choice
q: What does `pprop "pets "dog 2` do?
o: Prints the number 2
o*: Stores the value 2 under the name `dog` in the property list `pets`
o: Makes a procedure called pets
why: `pprop` stands for "put property": which list, which name, which value.
===
type: choice
q: What does `gprop "pets "cat` give if `cat` was never stored?
o: An error
o*: The empty list
o: Zero
why: A missing property gives `[]`, which you can test with `emptyp`.
===
type: choice
q: Why use a property list for counting words instead of an array?
o: Arrays can't hold numbers
o*: Words aren't whole numbers, so they can't be array positions
o: Property lists are faster
why: A property list can look things up by name, and an array can only look them up by number.
===
type: predict
q: Type what this prints.
pre: pprop "ages "ann 30
pre: pprop "ages "bob 25
code: print gprop "ages "bob
code: pprop "ages "bob 26
code: print gprop "ages "bob
hint: Storing under an existing name replaces the value.
why: Bob's age starts as 25, and after the second `pprop` it's 26.
===
type: write
q: Store the number 7 under the name `lucky` in a property list called `nums`, then print it back.
expect: 7
solution: pprop "nums "lucky 7
solution: print gprop "nums "lucky
hint: `pprop`, then `gprop`.
why: Put it in, then get it out.
{{< /quiz >}}
