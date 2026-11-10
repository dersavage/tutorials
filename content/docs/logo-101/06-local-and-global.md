---
title: "6. Local and global variables"
weight: 6
---

Before we write procedures properly, we need to settle a question: *where do variables live?* A variable you create at the top level is **global**: every procedure can see it. A variable you declare `local` lives only inside one procedure, and, this is the part that surprises Python people, inside *anything that procedure calls*.

(Procedures themselves are coming in the next section; for now, read the `to ... end` blocks as "teach Logo a new word". I'll explain them properly in a minute.)

```logo
make "x 1
to show.x
  print :x
end
to try.it
  local "x
  make "x 99
  show.x
end
try.it
print :x
```

Press Run. You get `99` and then `1`. The procedure `show.x` has no `x` of its own, so it looks at the procedure that *called* it, `try.it`, finds `x = 99`, and prints that. Back at the top level, the global `x` was never touched, so it's still `1`.

That rule, "look in whoever called me", is called **dynamic scope**. It's how Logo, and the first Lisps, worked. Nearly every modern language chose something else.

<div class="cmp">Python</div>

```python
x = 1
def show_x():
    print(x)
def try_it():
    x = 99
    show_x()
try_it()
print(x)
```

This prints `1` and `1`. Python uses **lexical scope**: `show_x` looks for `x` in the place where it was *written*, not where it was *called from*. Lexical scope is the better default for big programs, because you can understand a function by reading it. Dynamic scope is better for a beginner at a prompt, because "the variable I just set is the one that gets used" needs no theory.

<div class="cmp">Raku</div>

```raku
my $x = 1;
sub show-x { say $x }
sub try-it { my $x = 99; show-x }
try-it;
say $x;
```

Raku is lexical too: `1` and `1`. It has a dynamic option (`my $*x`, with a star), which tells you the Raku designers knew exactly what they were giving up. Look at that star: dynamic scope is something you have to opt in to, and mark every time.

Now the second rule. Inputs to a procedure are automatically local. But a plain `make` inside a procedure, for a name that already exists, changes the *existing* variable.

```logo
make "count 0
to bump
  make "count :count + 1
end
bump
bump
print :count
```

`bump` runs twice, and `count` goes up each time, because `make` found the global and updated it. The output is `2`. If you'd written `local "count` first, the change would have vanished when the procedure ended.

Is that dangerous? Of course. A procedure that silently changes a global is the source of countless bugs in programs of every language. My honest advice: use `local` (or better, `localmake "name value`, which does both in one step) for anything that isn't meant to leave the procedure, and reserve globals for settings you really want everyone to share.

<div class="cmp">Python</div>

```python
count = 0
def bump():
    global count
    count = count + 1
bump()
bump()
print(count)
```

Python flips the default. Without the `global count` line, `count = count + 1` is a *crash* (`UnboundLocalError`), since Python decides `count` is local the moment you assign to it. Safer, but it's a confusing error for a beginner.

<div class="cmp">Raku</div>

```raku
my $count = 0;
sub bump { $count = $count + 1 }
bump; bump;
say $count;
```

In Raku the closure just sees the `$count` variable from where it was written and updates it. No `global` keyword needed, because lexical scoping already makes the right variable visible.

{{< quiz >}}
type: choice
q: What does `local "x` do inside a procedure?
o: Prints the value of x
o*: Makes a new x that exists only while that procedure (and what it calls) runs
o: Deletes the global x
why: `local` creates a fresh variable that hides any outer `x` and disappears when the procedure ends.
===
type: choice
q: Logo's scope rule is called…
o: Lexical scope
o*: Dynamic scope
o: Block scope
why: In dynamic scope a procedure sees the variables of whoever called it. Python and Raku use lexical scope instead.
===
type: choice
q: A procedure runs `make "total :total + 1` and never declares `total` local. A global `total` exists. What happens?
o: An error, because `total` isn't declared
o: A new local `total` is made
o*: The global `total` goes up by one
why: Without `local`, `make` updates the variable that already exists.
===
type: predict
q: Type what this prints.
pre: make "x 10
pre: to inner
pre:   print :x
pre: end
pre: to outer
pre:   local "x
pre:   make "x 20
pre:   inner
pre: end
code: outer
code: print :x
hint: `inner` sees the `x` of whoever called it.
why: `inner` is called from `outer`, which has its own `x = 20`. After `outer` finishes, the global `x` is still 10.
===
type: write
q: Write code that makes a variable `total` with the value 5, then adds 3 to it, then prints it.
expect: 8
solution: make "total 5
solution: make "total :total + 3
solution: print :total
hint: Three commands. The second reads the old value and writes the new one.
why: `make "total :total + 3` reads, adds and writes back in one go.
{{< /quiz >}}
