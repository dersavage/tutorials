---
title: "11. Making decisions"
weight: 11
---

A program that does the same thing no matter what is a calculator with extra steps. To do anything interesting you need to make decisions, and Logo's tool for that is `if`.

```logo
to verdict :n
  if :n > 0 [print "positive]
  if :n < 0 [print "negative]
  if :n = 0 [print "zero]
end
verdict 5
verdict -3
verdict 0
```

Output: `positive`, `negative`, `zero`. Look at the shape of `if`: a condition, then a **list** of instructions in square brackets. If the condition is `true`, Logo runs what's in the list. Otherwise it skips it.

I want to point out something quietly profound. The thing in the square brackets is an ordinary Logo list. It's the same square-bracket list from section 3, and Logo is treating it as code *because `if` asked it to*. In most languages, code and data are two different worlds. In Logo, they're the same world, and that idea is what lets you build your own control structures later.

<div class="cmp">Python</div>

```python
def verdict(n):
    if n > 0:
        print("positive")
    elif n < 0:
        print("negative")
    else:
        print("zero")

verdict(5)
verdict(-3)
verdict(0)
```

Python gives you `if`, `elif` and `else` as one connected statement, with a colon and indentation. It's tidy, and I like it better than three separate `if` lines. It's also three keywords to learn where Logo has `if` and `ifelse`. Meanwhile Logo's three `if`s each get checked, so a number that matches more than one would print more than once. Python's `elif` stops at the first match. Know the difference.

<div class="cmp">Raku</div>

```raku
sub verdict($n) {
    if    $n > 0 { say "positive" }
    elsif $n < 0 { say "negative" }
    else         { say "zero" }
}

verdict 5;
verdict -3;
verdict 0;
```

Raku has the same shape with braces, and doesn't need brackets round the condition (Perl and C programmers will notice that). It's close to Python in what it gives you, and close to Logo in how little punctuation it asks for.

When you have exactly two choices, Logo has `ifelse`, which takes a condition and *two* lists.

```logo
to parity :n
  ifelse (remainder :n 2) = 0 [print "even] [print "odd]
end
parity 10
parity 7
print ifelse 5 > 3 ["yes] ["no]
```

Output: `even`, `odd`, `yes`. The first two use `ifelse` as a **command**, choosing what to do. The last line uses it as an **operation**, choosing a *value* to hand to `print`. Same word, both roles, and that tells you something about how flexible Logo's grammar is.

Remember the rule from section 9: operations must go somewhere. In `print ifelse 5 > 3 ["yes] ["no]`, the answer goes to `print`. Perfect.

<div class="cmp">Python</div>

```python
def parity(n):
    if n % 2 == 0:
        print("even")
    else:
        print("odd")

print("yes" if 5 > 3 else "no")
```

Python's one-line form, `"yes" if 5 > 3 else "no"`, reads backwards, with the result first and the condition in the middle. It's an acquired taste, and plenty of Python teachers tell students to avoid it. Logo's `ifelse` has the same name and the same position whether it's used as a command or a value, so you only learn it once.

<div class="cmp">Raku</div>

```raku
sub parity($n) {
    if $n %% 2 { say "even" } else { say "odd" }
}

say 5 > 3 ?? "yes" !! "no";
```

Raku's conditional operator is `?? !!`: `condition ?? this !! that`. Looks odd, though it's easy to remember once you've seen "yes ?? no". Different punctuation, same idea.

{{< quiz >}}
type: choice
q: What goes between the square brackets of `if :n > 0 [ ... ]`?
o: A condition
o*: The instructions to run when the condition is true
o: A comment
why: `if` takes a condition and then a list of instructions.
===
type: choice
q: What does `ifelse` take?
o: A condition and one list
o*: A condition and two lists (for true, then for false)
o: Two conditions
why: The first list runs if the condition is true, the second if it is false.
===
type: choice
q: What does `print ifelse 2 > 5 ["yes] ["no]` print?
o: `yes`
o*: `no`
o: An error
hint: Is 2 greater than 5?
why: `2 > 5` is false, so `ifelse` produces `no`.
===
type: predict
q: Type what this prints.
pre: to check :n
pre:   if :n > 10 [print "big]
pre:   if :n > 100 [print "huge]
pre:   if :n < 5 [print "tiny]
pre: end
code: check 3
code: check 50
code: check 500
hint: Each `if` is checked on its own. A number can pass more than one.
why: 3 is only `tiny`. 50 is only `big`. 500 is both `big` and `huge`.
===
type: write
q: Define `adult :age` that prints `adult` if age is 18 or more, otherwise `minor`. Then call `adult 20`.
expect: adult
solution: to adult :age
solution:   ifelse :age >= 18 [print "adult] [print "minor]
solution: end
solution: adult 20
hint: Use `ifelse` with `>=`.
why: 20 is at least 18, so `adult` is printed.
{{< /quiz >}}
