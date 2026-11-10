---
title: "21. Walking down a list"
weight: 21
---

You know how to walk down a word with recursion, and a list is no different. The pattern is the same every time, and you'll write it dozens of times, so let me spell it out:

1. If the list is empty, give the base-case answer.
2. Otherwise, do something with `first`, and recurse on `butfirst`.

```logo
to total :l
  if emptyp :l [output 0]
  output (first :l) + total butfirst :l
end
print total [3 4 5]
print total []
```

Output: `12`, then `0`. The sum of an empty list is zero, and the sum of any other list is its first item plus the sum of the rest. The second sentence is exactly what the code says. Notice the brackets round `(first :l)`: without them, `first :l + total ...` would try to add inside the `first`. When in doubt, bracket.

Make sure you notice what the base case does. `total []` returning 0 isn't a trick: it's the *identity* for addition, the value that changes nothing when you add it. Whenever you write a recursion over a list, ask what the right "nothing" answer is. For sums it's 0, for products it's 1, for "how many" it's 0, for "is it in there?" it's `false`.

<div class="cmp">Python</div>

```python
def total(l):
    if not l:
        return 0
    return l[0] + total(l[1:])

print(total([3, 4, 5]))
print(sum([3, 4, 5]))
```

You can write it recursively in Python, with `l[0]` and `l[1:]` where Logo has `first` and `butfirst`. But nobody *would*, since `sum([3, 4, 5])` is built in. That's the honest truth about teaching with Logo: you write by hand what other languages give you free. I count that as a feature for a first course, and a bug for production code.

<div class="cmp">Raku</div>

```raku
say [3, 4, 5].sum;
say [+] 3, 4, 5;
```

Raku has `.sum` and the `[+]` reduction, and either one makes the hand-written loop unnecessary. Using them well is a sign that you've grown out of beginner code.

Here's the second classic pattern: searching.

```logo
to contains :thing :l
  if emptyp :l [output "false]
  if equalp :thing first :l [output "true]
  output contains :thing butfirst :l
end
print contains "c [a b c d]
print contains "z [a b c d]
```

Output: `true`, then `false`. Two base cases this time. If the list is empty, the thing isn't there. If the first item matches, it is. Otherwise, we keep looking in the rest. (Logo already has `memberp` for this. We're writing it by hand to see how a built-in works.)

The recursive structure here, "check the first, then look at the rest", is *the* most common way to process a list in Logo, and in Lisp, Scheme, Haskell and every language descended from them. If you understand it, you understand a big part of how functional programmers think.

<div class="cmp">Python</div>

```python
def contains(thing, l):
    if not l:
        return False
    if l[0] == thing:
        return True
    return contains(thing, l[1:])

print("c" in ["a", "b", "c", "d"])
```

Again, the idiomatic version is the one-liner: `"c" in [...]`. The recursive one works, and it copies the list at every step with `l[1:]`, which is wasteful. Logo's lists are linked lists, so `butfirst` can share the rest of the list instead of copying it. For a beginner, either is fine.

<div class="cmp">Raku</div>

```raku
say "c" (elem) <a b c d>;
say "z" (elem) <a b c d>;
```

Raku has set operators (`(elem)`, or the Unicode `∈`) for membership. It's another instance of a feature Logo teaches you to build from parts.

{{< quiz >}}
type: choice
q: What should `total []` output, and why?
o: An error, because the list is empty
o*: `0`, since adding nothing changes nothing
o: `1`
why: Zero is the identity for addition, so it's the right base-case answer for a sum.
===
type: choice
q: In the recursive step of `total`, what does `total butfirst :l` compute?
o: The sum of the whole list
o*: The sum of everything except the first item
o: The sum of the first item
why: `butfirst` removes the first item, and `total` sums what's left.
===
type: choice
q: What should the base-case answer be for a recursive *product* of a list?
o: 0
o*: 1
o: `[]`
hint: Which number leaves a product unchanged?
why: One is the identity for multiplication.
===
type: predict
q: Type what this prints.
pre: to howmany :l
pre:   if emptyp :l [output 0]
pre:   output 1 + howmany butfirst :l
pre: end
code: print howmany [a b c d]
code: print howmany []
why: It adds 1 for each item. Four items, then zero.
===
type: write
q: Define `product.of :l` that outputs the product of all the numbers in a list (the product of `[]` is 1). Then print `product.of [2 3 4]`.
expect: 24
solution: to product.of :l
solution:   if emptyp :l [output 1]
solution:   output (first :l) * product.of butfirst :l
solution: end
solution: print product.of [2 3 4]
hint: Same shape as `total`, with 1 as the base case and `*` instead of `+`.
why: 2 * 3 * 4 is 24.
{{< /quiz >}}
