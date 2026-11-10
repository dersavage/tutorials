---
title: "18. Recursion that answers back"
weight: 18
---

Last section's recursion *did* things. This section's recursion *answers questions*. The pattern is the one from section 9, `output`, joined to the pattern from section 17, a procedure that uses itself.

The classic first example is the factorial: `5!` is `5 * 4 * 3 * 2 * 1`.

```logo
to factorial :n
  if :n = 0 [output 1]
  output :n * factorial :n - 1
end
print factorial 5
print factorial 10
```

Output: `120` and `3628800`. The base case is `:n = 0`, whose answer is 1, by definition. The step says: "the factorial of n is n times the factorial of n minus one". That sentence is the *whole program*.

I want you to feel what's going on. To answer `factorial 5`, Logo needs `factorial 4`. To answer that, it needs `factorial 3`, and so on down to `factorial 0`, which it knows is 1. Only then does the work run backwards up the chain: `1`, then `1 * 1`, then `2 * 1`, `3 * 2`, `4 * 6`, `5 * 24`, and the answer comes out. Each call waits patiently for the one below it.

<div class="cmp">Python</div>

```python
def factorial(n):
    if n == 0:
        return 1
    return n * factorial(n - 1)

print(factorial(5))
print(factorial(10))
```

Python's version is a line-for-line match for Logo's, which is the point: recursion is recursion. (In real Python code you'd call `math.factorial`, or use a loop.)

<div class="cmp">Raku</div>

```raku
sub factorial($n) { $n == 0 ?? 1 !! $n * factorial($n - 1) }
say factorial 5;
say [*] 1..5;    # the reduction operator again
```

Raku's reduction operator makes the factorial a one-liner: `[*] 1..5` means "put `*` between 1, 2, 3, 4 and 5". That's the idiomatic way, and it's shorter than any recursion. A fine reminder that "teachable" and "idiomatic" aren't always the same thing.

Here's the other famous one. The Fibonacci numbers go `0 1 1 2 3 5 8 13 ...`, where each is the sum of the two before it.

```logo
to fib :n
  if :n < 2 [output :n]
  output (fib :n - 1) + (fib :n - 2)
end
print fib 10
trace "fib
print fib 3
untrace "fib
```

Output: `55`, then a *trace* of `fib 3`. `trace` makes Logo print every call and every answer, which is the best way to see recursion happen. Read the trace slowly, and you'll see `fib 3` calling `fib 2` and `fib 1`, and `fib 2` calling `fib 1` and `fib 0`.

This version has two recursive calls, so the number of calls explodes as `n` grows. `fib 30` would take a noticeable amount of time. We'll fix that in section 28, using a technique with a very scary name.

<div class="cmp">Python</div>

```python
def fib(n):
    if n < 2:
        return n
    return fib(n - 1) + fib(n - 2)

print(fib(10))
```

Same again. Python has no built-in `trace`, though you can see the calls with a debugger, or a decorator you'd write yourself, and I think that's a real loss for learners.

<div class="cmp">Raku</div>

```raku
multi fib(0) { 0 }
multi fib(1) { 1 }
multi fib($n) { fib($n - 1) + fib($n - 2) }
say fib 10;
```

This is Raku at its most beautiful. Instead of an `if`, you write one definition for each *case*: "fib of 0 is 0, fib of 1 is 1, fib of anything else is...". It reads like the maths textbook. If I were designing a *second* language course, I'd show this on day one.

{{< quiz >}}
type: choice
q: What is the base case of `factorial`?
o: `:n = 5`
o*: `:n = 0`, where the answer is 1
o: There is none
why: At zero the answer is given directly, with no recursion.
===
type: choice
q: What does `trace "fib` do?
o: Deletes `fib`
o*: Makes Logo print each call to `fib` and each answer
o: Speeds it up
why: Tracing is a window into recursion: it shows every call and what it returned.
===
type: choice
q: Why is the two-call `fib` slow for big inputs?
o: Logo is slow
o*: It recomputes the same values again and again
o: Because `output` is slow
why: `fib 30` calls `fib 29` and `fib 28`, and each of those repeats a lot of work. Section 28 fixes that.
===
type: predict
q: Type what this prints.
pre: to factorial :n
pre:   if :n = 0 [output 1]
pre:   output :n * factorial :n - 1
pre: end
code: print factorial 4
code: print factorial 0
hint: 4 * 3 * 2 * 1 and the base case.
why: `factorial 4` is 24, and `factorial 0` is the base case, 1.
===
type: write
q: Define `sumto :n` that outputs the sum 1 + 2 + ... + :n by recursion (the sum to 0 is 0). Then print `sumto 4`.
expect: 10
solution: to sumto :n
solution:   if :n = 0 [output 0]
solution:   output :n + sumto :n - 1
solution: end
solution: print sumto 4
hint: Base case 0 outputs 0. The step is `:n + sumto :n - 1`.
why: 4 + 3 + 2 + 1 is 10.
{{< /quiz >}}
