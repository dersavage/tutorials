---
title: "17. Recursion: the idea"
weight: 17
---

Recursion has a reputation for being hard. It isn't. It's just a procedure that **uses itself**, plus a rule for when to stop. Logo is the best place I know to learn it, because Logo was *designed* for it.

```logo
to countdown :n
  if :n = 0 [print [Liftoff!] stop]
  print :n
  countdown :n - 1
end
countdown 3
```

Output: `3`, `2`, `1`, `Liftoff!`. Walk through it. `countdown 3` prints 3, then calls `countdown 2`. That prints 2 and calls `countdown 1`, which prints 1 and calls `countdown 0`. This time `:n = 0` is true: it prints `Liftoff!` and **`stop`s**, ending the whole chain.

Every recursive procedure has the same two parts:

1. **A base case**: a situation simple enough that you answer it directly, with no recursion. Here, `:n = 0`.
2. **A step**: do a little work, then call yourself on a *smaller* problem. Here, `:n - 1`.

If you forget the base case, the procedure runs forever. If your step doesn't make the problem smaller, same thing. Those two failure modes cover practically every recursion bug you'll ever write.

`stop` is a new command: it ends the *current procedure*, returning control to the caller, without a value. It's the command version of `output`.

<div class="cmp">Python</div>

```python
def countdown(n):
    if n == 0:
        print("Liftoff!")
        return
    print(n)
    countdown(n - 1)

countdown(3)
```

Same structure: `return` where Logo has `stop`. In practice, though, Python programmers seldom write *this* kind of recursion. Python has a recursion depth limit (1000 by default), and a loop is the idiomatic version of a countdown. Logo programmers reach for recursion more readily, because for Logo, recursion is the *main* way to repeat, and the language is shaped around it.

<div class="cmp">Raku</div>

```raku
sub countdown($n) {
    if $n == 0 { say "Liftoff!"; return }
    say $n;
    countdown($n - 1);
}

countdown 3;
```

Identical idea again. The difference is cultural rather than technical: Raku also gives you plenty of loop and sequence tools, so you won't usually need recursion for something this simple.

Now a deeper question: could you build `repeat` itself with recursion? You can.

```logo
to times :n :what
  if :n = 0 [stop]
  run :what
  times :n - 1 :what
end
times 3 [print "hi]
```

Output: `hi` three times. The new word is `run`, which takes a **list** and *runs it as code*. That's the "code is data" idea from section 11 in action: `:what` is a list holding an instruction, and `run` carries it out. The recursion counts the number down, and each time, it runs the instruction once.

So the loop that Logo builds in is not magic. You could write it yourself. And that's the sign of a well-designed teaching language: the built-in things are made of the same stuff as yours.

<div class="cmp">Python</div>

```python
def times(n, what):
    if n == 0:
        return
    what()
    times(n - 1, what)

times(3, lambda: print("hi"))
```

In Python, you pass a *function* (here an anonymous `lambda`), rather than a list of instructions. It's more powerful, and a beginner must learn what a function value is and the odd `lambda: ...` syntax. In Logo, `[print "hi]` is just a list.

<div class="cmp">Raku</div>

```raku
sub times($n, &what) {
    return if $n == 0;
    what();
    times($n - 1, &what);
}

times 3, { say "hi" };
```

Raku's blocks (`{ say "hi" }`) are the closest cousin to Logo's instruction lists: you pass a chunk of code around in curly braces. It's an elegant answer to the same problem.

{{< quiz >}}
type: choice
q: What are the two essential parts of a recursive procedure?
o: A loop and a counter
o*: A base case and a step that calls itself on a smaller problem
o: An input and an output
why: Without a base case it never ends, and without a smaller step it never makes progress.
===
type: choice
q: What does `stop` do?
o: Stops Logo completely
o*: Ends the procedure it is in
o: Pauses for a second
why: `stop` ends the current procedure, returning to whoever called it.
===
type: choice
q: What does `run` do with the list `[print "hi]`?
o: Prints the list
o*: Carries it out as an instruction
o: Defines a procedure
why: `run` takes a list and treats it as code.
===
type: predict
q: Type what this prints.
pre: to up :n :max
pre:   if :n > :max [stop]
pre:   print :n
pre:   up :n + 1 :max
pre: end
code: up 1 3
hint: It counts up until it passes the max.
why: It prints 1, 2, 3, and then stops when n becomes 4.
===
type: write
q: Define `countup :n` that prints `:n`, then calls itself with `:n + 1`, stopping when `:n` is greater than 3. Call `countup 1`.
expect: 1
expect: 2
expect: 3
solution: to countup :n
solution:   if :n > 3 [stop]
solution:   print :n
solution:   countup :n + 1
solution: end
solution: countup 1
hint: The base case is `if :n > 3 [stop]`.
why: The check comes first, so nothing prints after 3.
{{< /quiz >}}
