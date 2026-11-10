---
title: "28. Remembering answers"
weight: 28
---

In section 18, I said the two-call `fib` was slow, and promised a fix with a frightening name. Here it is: **memoization**. The word is just "memo": write the answer down so you don't work it out twice.

First, let's *measure* the problem. We'll count how many times `slowfib` gets called.

```logo
make "calls 0
to slowfib :n
  make "calls :calls + 1
  if :n < 2 [output :n]
  output (slowfib :n - 1) + (slowfib :n - 2)
end
print slowfib 15
print :calls
```

Output: `610`, then `1973`. To compute the fifteenth Fibonacci number, Logo called `slowfib` **1,973 times**. And it gets worse fast: `slowfib 30` needs about 2.7 million calls. Why? Because `slowfib 15` calls `slowfib 14` and `slowfib 13`, and `slowfib 14` *also* calls `slowfib 13`. The same work is done over and over.

I like this as a teaching moment because the slowness has an obvious cause. You can see it in the trace from section 18. A fix is to write each answer down the first time, and look it up thereafter. We'll use a property list as the notebook.

```logo
to fastfib :n
  if :n < 2 [output :n]
  if not emptyp gprop "fibs :n [output gprop "fibs :n]
  localmake "r (fastfib :n - 1) + (fastfib :n - 2)
  pprop "fibs :n :r
  output :r
end
print fastfib 30
print fastfib 50
```

Output: `832040` and `12586269025`. The new line, `if not emptyp gprop "fibs :n [output gprop "fibs :n]`, asks: "is there already an answer written down for n?" If so, output it and stop. If not, work it out the slow way, **write it down** with `pprop`, and output it.

The difference is staggering. `fastfib 50` is answered instantly, and `slowfib 50` would take hours. The number of calls drops from *exponential* to *linear*: each value of `n` gets computed exactly once.

This is one of the great ideas in computer science: **trade a little memory for a lot of time**. And look at how we did it. No new language feature, no cleverness. A notebook, and the discipline to check it before working.

<div class="cmp">Python</div>

```python
from functools import cache

@cache
def fib(n):
    if n < 2:
        return n
    return fib(n - 1) + fib(n - 2)

print(fib(50))
```

Python makes memoization a one-liner: `@cache` above the function. Since Python 3.9, that's all it takes. It is a **decorator**, which is a big topic of its own, and very elegant. Honestly, this is the example where Python's design wins hands down: Logo shows you *how*, Python gives you *the answer*.

<div class="cmp">Raku</div>

```raku
use experimental :cached;

sub fib($n) is cached {
    $n < 2 ?? $n !! fib($n - 1) + fib($n - 2)
}
say fib 50;
```

Raku has a `is cached` trait that does the same as Python's `@cache`, with a pragma to switch it on. Equivalent in effect.

Here's the honest comparison. In Python and Raku you ask the language to memoize for you, and that's the right call in real code. In Logo you do it by hand, and *that's* the right call when you're learning, because you now know what "caching" means. Next time you see a cache in a database, a browser or a web server, it's the same idea: write down the answer, check the notebook first.

Before you leave this section, try one thing yourself. Define a counter for `fastfib`, as we did for `slowfib`, and count the calls for `fastfib 15`. You'll find it's under thirty.

<div class="cmp">Python</div>

```python
calls = 0
def slowfib(n):
    global calls
    calls += 1
    return n if n < 2 else slowfib(n - 1) + slowfib(n - 2)

print(slowfib(15), calls)    # 610 1973
```

The same 1,973: because it's arithmetic, not the language. Whatever you write it in, the shape of the problem stays.

<div class="cmp">Raku</div>

```raku
my $calls = 0;
sub slowfib($n) { $calls++; $n < 2 ?? $n !! slowfib($n - 1) + slowfib($n - 2) }
say slowfib(15), " ", $calls;     # 610 1973
```

1,973 again. When three languages agree to the last digit, you've understood the algorithm.

{{< quiz >}}
type: choice
q: What is memoization?
o: Making a program shorter
o*: Remembering answers you've already worked out, so you don't repeat the work
o: Printing a memo
why: You write each answer down the first time, and look it up afterwards.
===
type: choice
q: Why is the two-call `fib` so slow?
o: Logo is slow at arithmetic
o*: It calculates the same smaller Fibonacci numbers over and over
o: `output` is slow
why: `fib 30` calls `fib 29` and `fib 28`, and those calls overlap hugely.
===
type: choice
q: What does memoization trade?
o: Memory for time
o: Time for memory
o: Accuracy for speed
hint: Where do the remembered answers go?
why: You use extra memory (the notebook) to save a lot of time.
===
type: predict
q: Type what this prints.
pre: make "calls 0
pre: to count.up :n
pre:   make "calls :calls + 1
pre:   if :n = 0 [stop]
pre:   count.up :n - 1
pre: end
code: count.up 4
code: print :calls
hint: How many times is `count.up` called, counting the one for 0?
why: It's called for 4, 3, 2, 1 and 0: five calls.
===
type: write
q: Define `fastsq.fib :n`... no, simply use what's given: `fastfib` is already defined. Print `fastfib 20`.
pre: to fastfib :n
pre:   if :n < 2 [output :n]
pre:   if not emptyp gprop "fibs :n [output gprop "fibs :n]
pre:   localmake "r (fastfib :n - 1) + (fastfib :n - 2)
pre:   pprop "fibs :n :r
pre:   output :r
pre: end
expect: 6765
solution: print fastfib 20
hint: Just call it, and `print` the answer.
why: The twentieth Fibonacci number is 6765.
{{< /quiz >}}
