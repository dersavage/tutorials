---
title: "5. Variables"
weight: 5
---

A **variable** is a name for a value. In Logo you create one with `make`, and read it back with a colon in front of the name.

```logo
make "x 7
print :x
make "x :x + 1
print :x
print thing "x
```

Output: `7`, `8`, `8`. Look at the quote and the colon, because they do different jobs. `"x` is the *name* itself, a word, so `make` knows which variable to set. `:x` means "the *value* of x". And `thing "x` is the long way of writing `:x`; the colon is a shortcut that Logo's inventors added because they got tired of typing `thing`.

So `make "x :x + 1` reads, in English: "make the variable called x equal to the value of x, plus one". Once you see the name and the value as different things, you understand every assignment you'll ever write.

<div class="cmp">Python</div>

```python
x = 7
print(x)
x = x + 1
print(x)
```

Python's `x = 7` is cleaner to read. It also quietly mixes up the name (left of `=`) and the value (right of `=`) in one symbol, and `x = x + 1` trips up every beginner because it looks like false algebra. Logo's `make "x :x + 1` is wordier, but it never looks like a false equation.

<div class="cmp">Raku</div>

```raku
my $x = 7;
say $x;
$x = $x + 1;
say $x;
```

Raku needs `my` the first time, and a **sigil** (`$`) on every use. The sigil is useful (it tells you at a glance that `$x` is a single value) but it's one more thing for a beginner to type correctly.

Variables can hold anything: numbers, words, lists. And asking about a variable that doesn't exist is an error you should meet early.

```logo
make "pets [cat dog bird]
print count :pets
print namep "pets
print namep "unicorn
print :unicorn
```

`namep` asks "does a variable with this name exist?", so `true` then `false`. And the last line shows what Logo says if you use a name you never made: **`unicorn has no value`**. Read error messages like that out loud. They are written for you, in plain words, and Logo's are among the best I know.

<div class="cmp">Python</div>

```python
pets = ["cat", "dog", "bird"]
print(len(pets))
print("unicorn" in dir())   # the ugly way to ask
print(unicorn)              # NameError: name 'unicorn' is not defined
```

Python's `NameError: name 'unicorn' is not defined` is perfectly clear too, followed by a traceback with file and line numbers. And "is a variable defined?" has no friendly built-in answer, so you reach for `dir()` or a `try`/`except`.

<div class="cmp">Raku</div>

```raku
my @pets = <cat dog bird>;
say @pets.elems;
say $unicorn;      # compile error: Variable '$unicorn' is not declared
```

Raku catches this before the program even runs, which is the strictest of the three. Fantastic for large programs. For someone typing a single line to see what happens, it's a lot of ceremony.

{{< quiz >}}
type: choice
q: In `make "score 10`, what does `"score` mean?
o*: The *name* of the variable
o: The value 10
o: A string that must be closed
why: The quote makes `score` a plain word, which `make` uses as the variable's name.
===
type: choice
q: What does `:score` mean?
o: The word `score`
o: Make a new variable called score
o*: The current value of the variable named score
why: The colon means "the value of". It's short for `thing "score`.
===
type: choice
q: What does `make "n :n + 1` do?
o: Reports an error, because it is a false equation
o*: Makes `n` one bigger than it was
o: Prints the new value of `n`
hint: Read it as "make the name n equal to the value of n plus one".
why: It's the standard "increment" pattern. It doesn't print anything.
===
type: predict
q: Type what this prints.
pre: make "a 5
code: make "b :a * 2
code: make "a :b + 1
code: print :a
code: print :b
why: `b` becomes 10, then `a` becomes 11.
===
type: write
q: Make a variable called `age` with the value 42, then print its value.
expect: 42
solution: make "age 42
solution: print :age
hint: Two commands, one after the other. Use the quote for the name, the colon for the value.
why: `make "age 42` creates it and `print :age` reads it.
{{< /quiz >}}
