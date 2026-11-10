---
title: "10. True or false: predicates"
weight: 10
---

A **predicate** is an operation that answers a yes-or-no question: it outputs the word `true` or the word `false`. You've already met `wordp` and `numberp`. Here are the comparison ones.

```logo
print 3 < 5
print 3 = 3.0
print equalp "abc "abc
print emptyp []
print memberp "b [a b c]
print listp [1 2]
```

Everything prints `true`. A few notes. `=` and `equalp` are the same thing in two spellings, and Logo's equality doesn't fuss over `3` versus `3.0`. `emptyp` asks whether a word or list has nothing in it. `memberp` asks "is this thing one of the items in that list?"

The name ending in `p` is a promise: "I output true or false". Logo programmers follow it religiously, so reading a Logo program, you always know when a command is a question.

<div class="cmp">Python</div>

```python
print(3 < 5)
print(3 == 3.0)
print("abc" == "abc")
print([] == [])
print("b" in ["a", "b", "c"])
print(isinstance([1, 2], list))
```

Python spells these with `==` and `in` and `isinstance`: three different mechanisms, plus the difference between `=` (assign) and `==` (compare) that costs every beginner an afternoon. Python also outputs `True` with a capital T. Logo's `=` is only ever a question, since assignment is `make`.

<div class="cmp">Raku</div>

```raku
say 3 < 5;
say 3 == 3.0;
say "abc" eq "abc";
say [].elems == 0;
say "b" (elem) <a b c>;
say [1, 2] ~~ List;
```

Raku has *separate* operators for numeric equality (`==`) and string equality (`eq`), so the operator tells the language how to compare. That's a clean idea, and it's why Raku never needs to guess that `"3"` and `3.0` might be equal. Logo guesses, which is friendlier and less precise.

You can write your own predicates, and when you do, follow the naming rule.

```logo
to evenp :n
  output (remainder :n 2) = 0
end
print evenp 10
print evenp 7
```

Output: `true` and `false`. Look how short it is. The body is a single `output`, and the comparison is already a `true` or `false`, so there is no `if` needed. Beginners often write `ifelse (remainder :n 2) = 0 [output "true] [output "false]`, and it works, but it says in four steps what one comparison already says.

That last point is worth pausing on. A comparison *is* a value. Treating it as one, rather than as something you can only use inside an `if`, is a habit that pays off for the rest of your programming life.

<div class="cmp">Python</div>

```python
def is_even(n):
    return n % 2 == 0

print(is_even(10))
print(is_even(7))
```

Same idea. The expression after `return` is already a boolean. Python's convention is `is_` at the front, where Logo's is `p` at the end. (Python's `is_even` is one of the many functions Python programmers write that look identical in every language.)

<div class="cmp">Raku</div>

```raku
sub is-even($n) { $n %% 2 }
say is-even 10;
say is-even 7;
```

Raku has a built-in operator `%%` meaning "is divisible by", so `$n %% 2` is the whole test. It's a lovely little feature, and one of many reasons Raku programmers say the language "fits the problem".

{{< quiz >}}
type: choice
q: What do predicates in UCBLogo end with?
o: `?`
o*: `p`
o: `.bool`
why: By convention they end in `p`: `emptyp`, `numberp`, `equalp`, `memberp`.
===
type: choice
q: What does `print memberp "z [a b c]` print?
o: `true`
o*: `false`
o: `z`
why: `z` is not an item of `[a b c]`.
===
type: choice
q: Why is `output (remainder :n 2) = 0` enough, with no `if`?
o*: Because the comparison already produces `true` or `false`
o: Because `output` checks conditions
o: It isn't enough. You need `ifelse`
why: A comparison is a value. You can output it directly.
===
type: predict
q: Type what this prints.
code: print 4 > 2
code: print 4 = 5
code: print emptyp []
code: print equalp "cat "dog
why: Four yes-or-no questions: `true`, `false`, `true`, `false`.
===
type: write
q: Write a command that prints whether the word `cat` is a member of the list `[dog cat fish]`.
expect: true
solution: print memberp "cat [dog cat fish]
hint: `memberp` takes the thing first, then the list.
why: `memberp` outputs `true` here.
{{< /quiz >}}
