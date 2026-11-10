S({
id: 19,
title: "Recursion I: counting down",
tagline: "A procedure that calls itself, and why that is not as crazy as it sounds",
blocks: [
P(`Time for the idea that scares people and shouldn't. <strong>Recursion</strong> is when a procedure uses itself to do part of its job. Everyone's first reaction is: surely that never ends? It does end, provided you follow one rule, and by the end of this lesson you will follow that rule without thinking about it.`),
P(`Let's start with a task you already know how to do with a loop: counting down from a number to 1.`),
L(`to countdown :n
  if :n = 0 [print "liftoff stop]
  print :n
  countdown :n - 1
end

countdown 3`, {"expect":"3\n2\n1\nliftoff"}),
P(`Read the procedure like a set of instructions to a friend. "If the number is zero, say liftoff and you're done. Otherwise, say the number, and then do <em>exactly the same thing</em> with the number one smaller." That second step is the recursion: <code>countdown</code> calls <code>countdown</code>, with a smaller input.`),
P(`There are two parts, and every recursive procedure has both.`),
P(`<ul><li>The <strong>base case</strong>: the situation so simple that you answer immediately, without any more calls. Here it is <code>:n = 0</code>, and the <code>stop</code> makes the procedure end.</li><li>The <strong>recursive step</strong>: do a little work, then call yourself on a problem that is <em>closer</em> to the base case. Here, <code>:n - 1</code> is closer to zero.</li></ul>`),
P(`The rule I promised: <em>each call must get closer to the base case.</em> That's it. If it does, the chain of calls has to end, because you can only get so close. Break the rule, for example by calling <code>countdown :n + 1</code>, and the calls go on forever. (Logo will stop you after a while with an error rather than crash.)`),
P(`<strong>Python</strong> writes the same function with the same two parts. The base case is a conditional <code>return</code>.`),
PY(`def countdown(n):
    if n == 0:
        print("liftoff")
        return
    print(n)
    countdown(n - 1)

countdown(3)`),
P(`Now here's a fact about Python that matters for a teaching comparison: Python limits recursion depth to about a thousand nested calls by default, and tells you so with a <code>RecursionError</code>. The language's culture leans toward loops. Logo, whose entire tradition grows out of Lisp, treats recursion as <em>the</em> natural way to repeat things. Raku is a more relaxed about it than Python, and lets you write it the way you would in Logo.`),
RK(`sub countdown($n) {
    if $n == 0 {
        say "liftoff";
        return;
    }
    say $n;
    countdown($n - 1);
}
countdown(3);`),
P(`I will not claim that recursion is better than a loop. Often it is not. But for a beginner, learning it in Logo, where lists are built to be taken apart one piece at a time and where the tradition supports it, is a happier experience than learning it in a language that keeps nudging you toward loops.`),
P(`How does it work on the machine? Let's walk through <code>countdown 2</code> as a story. Logo calls <code>countdown 2</code>. It prints 2, and then it calls <code>countdown 1</code>, and waits. That one prints 1, calls <code>countdown 0</code>, and waits. The last one prints <code>liftoff</code> and stops. Then the waiting calls, one after another, find they have nothing left to do and finish. The calls pile up and then unwind, like a stack of plates being put on and then taken off.`),
P(`What happens if you put the <code>print</code> <em>after</em> the recursive call? The order of the output flips. Try it and see.`),
L(`to countup :n
  if :n = 0 [stop]
  countup :n - 1
  print :n
end

countup 3`, {"expect":"1\n2\n3"}),
P(`This is one of my favourite surprises in all of programming. The numbers come out as 1, 2, 3, even though we count <em>down</em> in the calls. Why? Because <code>countup 3</code> calls <code>countup 2</code> before printing anything. That calls <code>countup 1</code>, which calls <code>countup 0</code>, which stops. Only then, as the stack unwinds, does <code>countup 1</code> print its 1, then <code>countup 2</code> prints 2, then <code>countup 3</code> prints 3. Work done <em>on the way down</em> comes out in one order; work done <em>on the way back up</em> comes out in the opposite order. Noice.`),
PY(`def countup(n):
    if n == 0:
        return
    countup(n - 1)
    print(n)

countup(3)   # prints 1, 2, 3`),
RK(`sub countup($n) {
    return if $n == 0;
    countup($n - 1);
    say $n;
}
countup(3);   # prints 1 2 3`),
P(`It is the same in all three languages, of course: recursion is a property of computation, not of Logo. What changes is how much ceremony surrounds it.<sup>[1]</sup>`),
P(`A recursive procedure can also take more than one input, and recursion can carry a running value along. Here is a procedure that counts <em>up</em> between two numbers, with the stopping rule as "once the start passes the end".`),
L(`to upto :from :to
  if :from > :to [stop]
  print :from
  upto :from + 1 :to
end

upto 4 7`, {"expect":"4\n5\n6\n7"}),
P(`Look at what changes between calls: <code>:from</code> grows by one, and <code>:to</code> stays the same. Eventually <code>:from</code> exceeds <code>:to</code>, and that is the base case. This is the same job as the <code>for</code> loop from lesson 13, done with a procedure instead. When you can do a loop both ways, you have understood both.`),
PY(`def upto(start, end):
    if start > end:
        return
    print(start)
    upto(start + 1, end)

upto(4, 7)`),
RK(`sub upto($from, $to) {
    return if $from > $to;
    say $from;
    upto($from + 1, $to);
}
upto(4, 7);`),
N(`<strong>Checklist for any recursive procedure:</strong> (1) What is the base case, and does the procedure stop there? (2) Does every recursive call move closer to the base case? If both answers are yes, it will work. Nice little language, isn't it?`),
],
fn: [
 "In Logo there is no ceremony at all. You call the procedure from inside itself. Compare that with languages where you wonder whether you are allowed to."
],
ex: [
MC(`What is the <em>base case</em> of a recursive procedure?`, ["The first call you make","The simplest situation, answered without another recursive call","The loop counter","The line that prints"], 1, `The base case is where the recursion stops, because the problem is simple enough to answer directly.`),
MC(`A procedure <code>bad :n</code> prints <code>:n</code> and then calls <code>bad :n + 1</code>, with no stopping rule. What happens when you run <code>bad 1</code>?`, ["It prints once","It stops at 10","The calls never get closer to a base case, so it never ends","Logo refuses to run it"], 2, `There is no stopping rule, and each call goes further away from any base case. Logo eventually gives up with an error.`),
PR(`What does this print? Type the output exactly.`,
  {before: `to show.back :n
  if :n = 0 [stop]
  show.back :n - 1
  print :n
end`,
     code: `show.back 3`,
     answer: `1
2
3`,
     hint: `The print comes after the recursive call.`,
     explain: `The innermost call prints first as the calls unwind, so the output is 1, 2, 3.`}),
FI(`Fill in the blank (the base case) so <code>shout 3</code> prints <code>3</code>, <code>2</code>, <code>1</code> and then stops.`,
  {template: `to shout :n
  if ___ [stop]
  print :n
  shout :n - 1
end
shout 3`,
     answer: `:n = 0`,
     expect: `3
2
1`,
     hint: `When should the recursion stop?`,
     explain: `Stop when <code>:n</code> reaches 0, after printing 3, 2 and 1.`}),
WR(`Write a recursive procedure <code>shrink :n</code> that prints <code>:n</code> stars on the first line, then <code>:n - 1</code> on the next, down to a single star. For example <code>shrink 3</code> prints <code>***</code>, <code>**</code>, <code>*</code>. A helper <code>row</code> that prints one row of stars is already defined for you.`,
  {before: `to row :n
  repeat :n [type "*]
  print []
end`,
     starter: `to shrink :n
  
end`,
     after: `shrink 3`,
     expect: `***
**
*`,
     solution: `to shrink :n
  if :n = 0 [stop]
  row :n
  shrink :n - 1
end`,
     hint: `Base case: :n = 0. Otherwise print one row of :n stars, then shrink :n - 1.`,
     explain: `<code>row</code> (already defined) prints one row. <code>shrink</code> prints a row and then recurses with one fewer.`}),
]});
