---
title: "4. Arithmetic"
weight: 4
---

Logo does arithmetic two ways. You can write it the way you learned in school, with the operator in the middle (**infix**), or as a command with its inputs after it (**prefix**).

```logo
print 3 + 4
print sum 3 4
print 2 + 3 * 4
print (2 + 3) * 4
```

Output: `7`, `7`, `14`, `20`. The first two are the same thing in two spellings. Multiplication happens before addition, and brackets override that, just like on paper.

Why two spellings? Because Logo's *real* syntax is prefix: a command name, then its inputs. Infix operators are a convenience Logo bolted on so that `2 + 3` reads normally. Once you see that `sum 3 4` is the "true" form, a lot of Logo's later behavior makes sense.

<div class="cmp">Python</div>

```python
print(3 + 4)
print(2 + 3 * 4)
print((2 + 3) * 4)
```

Python has only the infix form, with the same precedence rules. There is nothing to compare here except that Python has no `sum 3 4` form (and its `sum()` function adds up a *collection*, so `sum(3, 4)` is a mistake).

<div class="cmp">Raku</div>

```raku
say 3 + 4;
say [+] 3, 4;      # reduction operator
say 2 + 3 * 4;
```

Raku has the same infix operators, and it adds something Logo has no equivalent for: `[+]` is a *reduction*, "put `+` between every item". It's a beautiful idea, and we'll build the Logo equivalent ourselves in section 23.

Now the other arithmetic words.

```logo
print 7 / 2
print quotient 7 2
print int 3.9
print remainder 17 5
print sqrt 16
print power 2 10
```

Results: `3.5`, `3.5`, `3`, `2`, `4`, `1024`. Two surprises. First, `quotient 7 2` is `3.5`, not `3`: Logo's division is ordinary division. Use `int` to chop off the fractional part. Second, `remainder` is how you ask "is this number even?", because `remainder :n 2` is `0` exactly when `:n` is even.

<div class="cmp">Python</div>

```python
print(7 / 2)       # 3.5
print(7 // 2)      # 3  (floor division)
print(int(3.9))    # 3
print(17 % 5)      # 2
print(16 ** 0.5)   # 4.0
print(2 ** 10)     # 1024
```

Python has three division-ish operators to learn (`/`, `//`, `%`), and a square root written as a power. It also prints `4.0` for the square root, because the answer is a float. Logo prints `4`. For a beginner, that's less noise.

<div class="cmp">Raku</div>

```raku
say 7 / 2;         # 3.5
say 7 div 2;       # 3
say 17 % 5;        # 2
say sqrt 16;       # 4
say 2 ** 10;       # 1024
```

Raku reads like Logo here: `sqrt 16` with no brackets, and `div` is a word instead of a doubled slash. Raku's design choices are often close to Logo's, which isn't an accident; both languages care about readable code.

{{< quiz >}}
type: choice
q: What is `2 + 3 * 4` in Logo?
o: `20`
o*: `14`
o: `24`
why: Multiplication binds tighter than addition, so it is `2 + 12`.
===
type: choice
q: Which command tells you whether a number is even?
o: `quotient :n 2`
o*: `remainder :n 2`, which is `0` for even numbers
o: `int :n 2`
why: An even number leaves a remainder of 0 when divided by 2.
===
type: choice
q: What does `print quotient 7 2` print in UCBLogo?
o: `3`
o*: `3.5`
o: `4`
why: `quotient` is plain division. If you want `3`, wrap it: `int quotient 7 2`.
===
type: predict
q: Type what this prints.
code: print sum 3 4
code: print 10 - 4 * 2
code: print remainder 20 6
code: print power 3 2
hint: `10 - 4 * 2` does the multiplication first.
why: `sum 3 4` is 7, `10 - 8` is 2, 20 leaves 2 when divided by 6, and 3 squared is 9.
===
type: write
q: Write a command that prints the square root of 81.
expect: 9
solution: print sqrt 81
hint: There's a command called `sqrt`.
why: `sqrt` outputs a square root.
{{< /quiz >}}
