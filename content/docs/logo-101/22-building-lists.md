---
title: "22. Building lists"
weight: 22
---

Taking lists apart is half the story. To *build* them, Logo has four words. Two of them stick one thing on the end, and two of them combine whole lists.

```logo
make "shopping [eggs milk]
show fput "tea :shopping
show lput "jam :shopping
show :shopping
```

Output: `[tea eggs milk]`, `[eggs milk jam]`, and then... `[eggs milk]`. That last line is the important one. `fput` ("first put") puts something on the front, and `lput` ("last put") puts it on the back, but **neither changes the list you gave them**. They make a *new* list and leave the old one alone. `:shopping` is still `[eggs milk]`.

That's a deep design decision. Logo's list operations are **non-destructive**: they never change their inputs. It makes programs easier to reason about, because when you write `fput "tea :shopping` you know nothing else in the program just changed behind your back.

<div class="cmp">Python</div>

```python
shopping = ["eggs", "milk"]
print(["tea"] + shopping)
print(shopping + ["jam"])
print(shopping)

shopping.append("jam")      # this one CHANGES the list
print(shopping)
```

Python gives you both worlds. `+` makes a new list, and `.append` *modifies* the one it's called on. Python's `append` is the habit most people use, and it's the source of a famous class of bugs, where two variables turn out to be the same list, and changing one changes the other. Logo's default makes that mistake harder to make.

<div class="cmp">Raku</div>

```raku
my @shopping = <eggs milk>;
say ('tea', |@shopping);
say (|@shopping, 'jam');
say @shopping;

@shopping.push('jam');      # changes it
```

Raku likewise lets you build new lists (that `|` flattens `@shopping` into the new list) or change in place with `push` or `unshift`. It's flexible, and it leaves the choice to you.

Now the two that combine lists. They look alike and do very different things.

```logo
show sentence [a b] [c d]
show list [a b] [c d]
show reverse [1 2 3]
```

Output: `[a b c d]`, then `[[a b] [c d]]`, then `[3 2 1]`. `sentence` **flattens**: it joins the items together into one list. `list` **nests**: it makes a list *of* the two inputs. This is the single biggest confusion for new Logo programmers, so memorise it: *sentence* flattens, *list* nests.

Now let's put them together. A procedure that builds a new list by processing each item:

```logo
to squares :l
  if emptyp :l [output []]
  output fput (first :l) * (first :l) squares butfirst :l
end
show squares [1 2 3 4]
```

Output: `[1 4 9 16]`. The base case is the empty list, and the step builds a new list: the first item squared goes on the front (`fput`) of the squares of everything else. You can see the whole structure in one line. This "take the first, transform it, `fput` it onto the recursive result" is a pattern you'll use over and over.

<div class="cmp">Python</div>

```python
def squares(l):
    if not l:
        return []
    return [l[0] * l[0]] + squares(l[1:])

print(squares([1, 2, 3, 4]))
print([x * x for x in [1, 2, 3, 4]])
```

The first version mirrors Logo's. The second, a **list comprehension**, is the idiom every Python programmer uses, and it's one of Python's best features: it packs the whole process into one readable line. Logo's equivalent, `map`, is next.

<div class="cmp">Raku</div>

```raku
say [1, 2, 3, 4].map(* ** 2);
say (1..4).map({ $_ ** 2 });
```

Raku's `map` with the "whatever star" `*` is wonderfully short. `* ** 2` means "a function that squares its input". Terse, and quite readable once you've seen it.

{{< quiz >}}
type: choice
q: After `make "l [a b]` and `show fput "z :l`, what does `show :l` print?
o: `[z a b]`
o*: `[a b]`
o: `[b]`
why: `fput` builds a new list. The original is unchanged.
===
type: choice
q: What does `show list [1 2] [3 4]` print?
o: `[1 2 3 4]`
o*: `[[1 2] [3 4]]`
o: `[1 2]`
why: `list` nests its inputs. `sentence` would have flattened them.
===
type: choice
q: Which command joins two lists into one flat list?
o*: `sentence`
o: `list`
o: `fput`
why: `sentence [a b] [c d]` gives `[a b c d]`.
===
type: predict
q: Type what this prints.
code: show fput "x [y z]
code: show lput "x [y z]
code: show sentence [1 2] [3]
hint: `show` keeps the brackets.
why: `[x y z]` puts x on the front, `[y z x]` puts it on the back, and `sentence` flattens.
===
type: write
q: Define `doubles :l` that outputs a new list where every number in `:l` has been doubled (the doubles of `[]` is `[]`). Then show `doubles [1 2 3]`.
expect: [2 4 6]
solution: to doubles :l
solution:   if emptyp :l [output []]
solution:   output fput 2 * first :l doubles butfirst :l
solution: end
solution: show doubles [1 2 3]
hint: It's the `squares` pattern with a different calculation.
why: The same pattern as `squares`: transform the first, `fput` it onto the recursive result.
{{< /quiz >}}
