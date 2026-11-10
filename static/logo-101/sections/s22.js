S({
id: 22,
title: "Recursion IV: two recursive calls",
tagline: "Fibonacci, the first recursion that can hurt, and how to watch what it is doing",
blocks: [
P(`Every recursive procedure so far called itself once. This lesson is about the moment a procedure calls itself <em>twice</em>, because that is where recursion gets both powerful and dangerous. The famous example is the Fibonacci sequence: 0, 1, 1, 2, 3, 5, 8, 13, 21 and so on. Each number is the sum of the two before it.`),
P(`Say it recursively. <code>fib 0</code> is 0. <code>fib 1</code> is 1. For anything bigger, <code>fib n</code> is <code>fib (n-1)</code> plus <code>fib (n-2)</code>. Two base cases, because the rule looks back two steps, and two recursive calls.`),
L(`to fib :n
  if :n < 2 [output :n]
  output (fib :n - 1) + (fib :n - 2)
end

print fib 10
show map "fib [0 1 2 3 4 5 6 7]`, {expect: "55\n[0 1 1 2 3 5 8 13]"}),
P(`I used a base case that covers both 0 and 1 at once: "if n is less than 2, the answer is n itself". That works because <code>fib 0</code> is 0 and <code>fib 1</code> is 1. The parentheses around each recursive call are needed: without them Logo would try to read <code>fib :n - 1 + ...</code> as one long input, which is not what we mean.`),
P(`The last line used <code>map</code>, which runs a procedure on every item of a list. We will meet it properly in two lessons. For now just enjoy the first eight Fibonacci numbers in one go.`),
P(`<strong>Python</strong> beginners write exactly this, and it is correct:`),
PY(`def fib(n):
    if n < 2:
        return n
    return fib(n - 1) + fib(n - 2)

print(fib(10))                      # 55
print([fib(i) for i in range(8)])   # [0, 1, 1, 2, 3, 5, 8, 13]`),
P(`The list comprehension at the bottom is Python's version of <code>map</code>. It is a lovely feature, though I notice students who learn it too early stop thinking about what is being repeated.`),
P(`<strong>Raku</strong> can write the same recursion. It can also do something wonderful: define the whole infinite sequence lazily, and pick items out of it. The <code>*+*</code> means "add the previous two", and <code>...</code> means "keep going".`),
RK(`sub fib(Int $n) { $n < 2 ?? $n !! fib($n - 1) + fib($n - 2) }

say fib(10);                          # 55
my @fib = 0, 1, *+* ... *;
say @fib[10];                         # 55
say @fib[^8];                         # (0 1 1 2 3 5 8 13)`),
P(`That sequence line is the kind of thing that makes people fall in love with Raku, and I understand why. It is also a line you can only appreciate once you know what the recursive version is doing, which is the case for a good deal of the language.`),
P(`Now for the bad news. The code above is <em>slow</em>, and the reason is worth understanding. Let me count how many times the procedure runs. I will add a global counter, a variable that every call bumps by one.`),
L(`make "calls 0

to fib.counted :n
  make "calls :calls + 1
  if :n < 2 [output :n]
  output (fib.counted :n - 1) + (fib.counted :n - 2)
end

print fib.counted 10
print :calls`, {expect: "55\n177"}),
P(`To compute a number as small as <code>fib 10</code>, the procedure ran 177 times. Try <code>fib.counted 20</code> and you will see about 22,000 calls. Try 30 and you will wait a while. The count roughly multiplies by 1.6 every time <code>n</code> goes up by one.`),
P(`Why? Because the calls overlap. To get <code>fib 5</code> it computes <code>fib 4</code> and <code>fib 3</code>. But <code>fib 4</code> <em>also</em> computes <code>fib 3</code>, and the two calculations know nothing of each other. The same small answers are recomputed again and again. It is like looking up the same phone number fifty times because you never wrote it down.`),
N(`<strong>Watching the calls.</strong> Real UCBLogo has a command <code>trace</code>. Type <code>trace "fib</code> and every call and every answer is printed, indented, as it happens. Type <code>untrace "fib</code> to turn it off. For <code>fib 3</code> you would see something like: <code>fib 3</code>, then <code>fib 2</code>, <code>fib 1</code> answering 1, <code>fib 0</code> answering 0, <code>fib 2</code> answering 1, then <code>fib 1</code> again answering 1, and finally <code>fib 3</code> answering 2. Notice that <code>fib 1</code> appears twice. This page's interpreter keeps that output hidden, but try it in a real UCBLogo: it is the best way to understand a recursive procedure.`),
P(`<strong>Python</strong> shows the same problem, and offers a one-line cure that I think is both brilliant and a little bit of a cheat: a cache decorator.`),
PY(`from functools import lru_cache

calls = 0

def fib(n):
    global calls
    calls += 1
    if n < 2:
        return n
    return fib(n - 1) + fib(n - 2)

print(fib(10), calls)   # 55 177

@lru_cache(maxsize=None)
def fast_fib(n):
    return n if n < 2 else fast_fib(n - 1) + fast_fib(n - 2)

print(fast_fib(80))     # 23416728348467685`),
P(`The decorator remembers each answer so it is never computed twice. It works, and I use it at work. But a beginner who adds <code>@lru_cache</code> without understanding why the program was slow has fixed nothing in their head. The Logo way to fix it is to change the <em>shape</em> of the recursion, which I will show next.`),
P(`<strong>Raku</strong>'s lazy sequence avoids the problem entirely, because each element of the sequence is computed exactly once from the two before it. The sequence is the "memory".`),
RK(`my @fib = 0, 1, *+* ... *;
say @fib[80];   # 23416728348467685`),
P(`There is a way to keep the recursion and still be fast, and it has a lovely idea in it: carry the two previous values along as extra inputs. Instead of asking "what are the two numbers behind me", you <em>hand them forward</em>. We call such inputs accumulators.`),
L(`to fibfast :n :a :b
  if :n = 0 [output :a]
  output fibfast (:n - 1) :b (:a + :b)
end

print fibfast 10 0 1
print fibfast 80 0 1`, {expect: "55\n23416728348467685"}),
P(`Read it as a little machine. It holds two numbers, <code>:a</code> and <code>:b</code>, which start as 0 and 1. Each step, it shifts: the new <code>:a</code> is the old <code>:b</code>, and the new <code>:b</code> is the sum of both. After <code>n</code> steps, <code>:a</code> is the answer. Only <code>n</code> calls, not thousands. One recursive call per step instead of two, and a procedure that was exponentially slow is now fast.`),
P(`That is the lesson I want you to take from Fibonacci. Recursion is not slow, but <em>naive double recursion</em> can be, and the fix is usually to think about what information you are throwing away and carry it forward instead. You will meet this idea again as "dynamic programming" if you ever study algorithms. You have just done it.`),
PY(`def fibfast(n, a=0, b=1):
    if n == 0:
        return a
    return fibfast(n - 1, b, a + b)

print(fibfast(80))   # 23416728348467685`),
RK(`sub fibfast(Int $n, $a = 0, $b = 1) {
    $n == 0 ?? $a !! fibfast($n - 1, $b, $a + $b)
}

say fibfast(80);   # 23416728348467685`),
P(`Python gives you default values for <code>a</code> and <code>b</code> so you can call <code>fibfast(80)</code> with one argument. Raku does the same with <code>$a = 0</code>. UCBLogo can do this too with optional inputs, but I am keeping it simple. A beginner calling <code>fibfast 80 0 1</code> knows exactly what the machine starts with.`),
],
ex: [
MC(`In <code>fib 4</code> (which calls <code>fib 3</code> and <code>fib 2</code>), how many times is <code>fib 2</code> computed in total?`,
  ["Once", "Twice", "Three times", "Four times"], 1,
  `<code>fib 4</code> calls <code>fib 2</code> directly, and <code>fib 3</code> calls it again. Same answer, computed twice. That wasted repetition is why double recursion gets slow.`),
MC(`Why is <code>fib 30</code> so much slower than <code>fibfast 30 0 1</code>?`,
  ["Logo is bad at addition", "<code>fib</code> recomputes the same smaller answers many times over", "<code>fibfast</code> is not recursive", "<code>fib</code> uses more variables"], 1,
  `The overlapping calls repeat work exponentially. <code>fibfast</code> still recurses, but once per step, carrying forward what it already knows.`),
PR(`Type what Logo prints. <code>:calls</code> is a global variable that every call increases by one.`,
  {before: `to fib.counted :n
  make "calls :calls + 1
  if :n < 2 [output :n]
  output (fib.counted :n - 1) + (fib.counted :n - 2)
end`, code: `make "calls 0
print fib.counted 5
print :calls`, answer: "5\n15",
   hint: "fib 5 is 5. For the call count, add up every call including the base cases.",
   explain: `<code>fib 5</code> is 5. The number of calls follows c(n) = 1 + c(n-1) + c(n-2) with c(0) = c(1) = 1, which gives 1, 1, 3, 5, 9, 15. So 15 calls.`}),
FI(`Complete the recursive call so that <code>fibfast 10 0 1</code> prints 55. The new <code>:b</code> must be the sum of the old two.`,
  {template: `to fibfast :n :a :b
  if :n = 0 [output :a]
  output fibfast (:n - 1) :b (___)
end
print fibfast 10 0 1`, answer: ":a + :b", expect: "55",
   hint: "The two numbers being carried are :a and :b. What is the next one?",
   explain: `The next Fibonacci number is the sum of the two latest ones, so the new <code>:b</code> is <code>:a + :b</code>.`}),
WR(`The Lucas numbers start 2, 1, 3, 4, 7, 11, ... Each is the sum of the two before it, like Fibonacci, but the first two are different. Write <code>lucas</code> so that <code>lucas 0</code> is 2, <code>lucas 1</code> is 1, and every other value is the sum of the previous two.`,
  {starter: "", after: `print lucas 0
print lucas 1
print lucas 5`, expect: "2\n1\n11",
   solution: `to lucas :n
  if :n = 0 [output 2]
  if :n = 1 [output 1]
  output (lucas :n - 1) + (lucas :n - 2)
end`,
   hint: "Two separate base cases this time, because the starting values are different.",
   explain: `The skeleton is <code>fib</code>, but you cannot use "output :n" as the base case any more, since <code>lucas 0</code> is 2. So each base case gets its own line.`}),
]});
