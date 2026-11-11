S({
id: 8,
title: "Operations: procedures that answer",
tagline: "output hands a value back to whoever asked, and that one idea is what lets small procedures snap together",
blocks: [
P(`Up to now every procedure you wrote <em>did</em> something: it printed a line, or changed a variable. Those are called <strong>commands</strong>. This lesson is about the other kind of procedure, the kind that <em>answers</em>. In Logo an answering procedure is called an <strong>operation</strong>, and you have been using built-in ones since lesson 3. <code>sum 2 3</code> does not print anything. It <em>is</em> 5, and something else (usually <code>print</code>) decides what to do with it. Remember the two kinds of things from lesson one, those that act and those that are acted upon? An operation is the interesting hybrid: it acts on its inputs, and then it <em>becomes</em> the thing the next command acts on.`),
P(`I am spending a whole lesson on this, because it is the single most useful distinction in the language, and the one beginners fumble hardest. Get it now, and recursion, loops and data processing will all feel natural later. Miss it, and they will feel like magic spells. Not nice.`),
P(`Here is an operation of our own. The new word is <code>output</code> (you can abbreviate it to <code>op</code>, but spell it out while you are learning).`),
L(`to double :n
  output :n * 2
end

print double 4`, {"expect":"8"}),
P(`Read it aloud: "to double, given n, output n times two". When Logo reaches <code>output</code> it works out the value, hands it to whoever called <code>double</code>, and <em>leaves the procedure right there</em>. The call <code>double 4</code> is replaced by the value 8, and then <code>print</code> prints it. Notice that <code>double</code> itself never printed anything. That is the point. A procedure that answers is more reusable than one that prints, because the caller decides what to do with the answer.`),
P(`<strong>In Python</strong> the same job is done by <code>return</code>. Nothing surprising, except one thing: a Python function that does not return anything quietly returns <code>None</code>, so the language never tells you that you mixed up the two kinds of procedure.<sup>[1]</sup>`),
PY(`def double(n):
    return n * 2

print(double(4))   # 8`),
P(`<strong>In Raku</strong> a sub gives back the value of its last statement even without a <code>return</code>, which is actually closest in spirit to Logo's "this procedure is an answer". You can still write <code>return</code> when you want an early exit.`),
RK(`sub double($n) { $n * 2 }

say double(4);   # 8`),
P(`Because <code>double 4</code> is just a value, you can use it anywhere a value fits: as input to another instruction, inside arithmetic, even as input to <code>double</code> itself.`),
L(`print (double 4) + 1
print double double 3`, {"expect":"9\n12"}),
P(`Look at the second line. Logo reads left to right: <code>print</code> wants one input, so it looks at what follows; <code>double</code> wants one input, so it looks further; and the inner <code>double 3</code> is 6, which feeds the outer <code>double</code> to give 12. No parentheses were needed. That works because every procedure has a fixed number of inputs, and Logo always knows how many to grab. (The parentheses in the first line are there because I wanted <code>+ 1</code> to apply to the answer of <code>double 4</code>, not to its input.) Still clear, isn't it?`),
P(`Python needs parentheses around every call, so nested calls pile up brackets at the end. Both styles are fine; you simply read them differently.`),
PY(`print(double(double(3)))   # 12`),
P(`Raku lets you drop the parentheses if you use the colon form or method syntax. The most idiomatic way to chain operations is the method style, reading left to right.`),
RK(`say double(double(3));    # 12
say 3.&double.&double;    # 12  (call double as a method, twice)`),
P(`Now the mistake everybody makes. Suppose you write the "doubler" so that it <em>prints</em> its answer instead of outputting it, and then try to use it as a value.`),
L(`to show.double :n
  print :n * 2
end

show.double 4
print show.double 4`, {"error":true}),
P(`The first call works: it prints 8. The second does not. Logo stops and tells you <code>show.double didn't output to print</code>. Look at that message: it is crystal clear. Read it as "print asked <code>show.double</code> for a value, and <code>show.double</code> never gave one". If you ever see an error like that, you used a command where an operation was needed. Python lets you make the same mistake silently, which is one reason I think Logo's strictness is a feature.`),
PY(`def show_double(n):
    print(n * 2)

print(show_double(4))   # prints 8, then prints None`),
P(`And Raku, similarly, will happily print the return value of <code>say</code> (which is <code>True</code>).`),
RK(`sub show-double($n) { say $n * 2 }

say show-double(4);   # prints 8, then True`),
P(`Rule of thumb: <strong>if a procedure's job is to produce a value, use <code>output</code>. If its job is to show something to a person, use <code>print</code>.</strong> Mixing them up is the commonest reason a beginner's program "almost works". Burn that in. :)`),
P(`One more detail. <code>output</code> ends the procedure immediately, so any lines after it are never reached.`),
L(`to early :n
  output :n
  print "never
end

print early 3`, {"expect":"3"}),
P(`The line <code>print "never</code> is dead code. Python's <code>return</code> and Raku's <code>return</code> behave the same way. This will matter a lot when we reach decisions and recursion, because "output as soon as you know the answer" is how most clean procedures are written.`),
P(`Finally, an operation whose answer is true or false is called a <strong>predicate</strong>. You met the built-in ones in lesson 5 (<code>numberp</code>, <code>emptyp</code>). By convention Logo predicates end in <code>p</code>, and now you can write your own.`),
L(`to bigp :n
  output :n > 100
end

print bigp 5
print bigp 500`, {"expect":"false\ntrue"}),
P(`The expression <code>:n > 100</code> already <em>is</em> true or false, so we can output it directly. A beginner often writes an <code>if</code> to output <code>true</code> or <code>false</code> by hand, which is just a long way of saying the same thing. In Python you would write <code>return n > 100</code>, and in Raku just <code>$n &gt; 100</code> as the last statement of the sub; the lesson is language-neutral. Name your yes/no operations well and the code reads like English: <code>if bigp :score [...]</code>. Noice.`),
P(`To finish, here is an operation with two inputs that does something a bit more interesting, and a variable collecting its answer.`),
L(`to average :a :b
  output (:a + :b) / 2
end

make "avg average 10 20
print :avg
print average 3 8`, {"expect":"15\n5.5"}),
P(`<code>make "avg average 10 20</code> reads: call <code>average</code> with 10 and 20, and store whatever comes back in <code>avg</code>. That is the whole trick behind every program you will ever write: operations produce values, and values get named, printed, or fed to the next operation.`),
RK(`sub average($a, $b) { ($a + $b) / 2 }

my $avg = average(10, 20);
say $avg;              # 15
say average(3, 8);     # 5.5`),
PY(`def average(a, b):
    return (a + b) / 2

avg = average(10, 20)
print(avg)            # 15.0   (Python's / always gives a float)
print(average(3, 8))  # 5.5`),
P(`Small footnote on the Python side: <code>/</code> always produces a float, so the first line prints <code>15.0</code>, not <code>15</code>. UCBLogo prints a whole-number result as a whole number. Neither is wrong, but a beginner will wonder where the <code>.0</code> came from. Nobody should have to explain floats on day one.`),
],
fn: [
 "A very common beginner question is \"why does my function print <code>None</code>?\" The answer is always the same: it printed something, but it never returned anything."
],
ex: [
MC(`What is the difference between a <em>command</em> and an <em>operation</em> in Logo?`, ["A command takes inputs and an operation does not","A command does something; an operation outputs a value to its caller","An operation can only do arithmetic","There is no difference; the names are interchangeable"], 1, `Commands (like <code>print</code>) perform an action. Operations (like <code>sum</code> or your own <code>double</code>) hand a value back with <code>output</code>.`),
MC(`A procedure contains <code>print :x</code> but you call it as <code>print myproc 3</code>. What does UCBLogo do?`, ["Prints the value twice","Prints nothing at all","Reports that myproc didn't output to print","Converts the printed text to a value"], 2, `The outer <code>print</code> needs a value, but <code>myproc</code> only prints. Logo says <code>myproc didn't output to print</code>.`),
PR(`Here is the definition of <code>triple</code>, then the calls. What does Logo print? Type each line.`,
  {before: `to triple :n
  output :n * 3
end`,
     code: `print (triple 2) + 1
print triple triple 1`,
     answer: `7
9`,
     hint: `Work out the inner call first. (triple 2) is 6.`,
     explain: `<code>(triple 2) + 1</code> is 6 + 1 = 7. For the second line, <code>triple 1</code> is 3, and <code>triple 3</code> is 9.`}),
FI(`Fill in the blank so <code>half</code> is an operation that answers instead of printing.`,
  {template: `to half :n
  ___ :n / 2
end

print half 9`,
     answer: `output`,
     expect: `4.5`,
     hint: `The word that hands a value back (not the one that shows it).`,
     explain: `<code>output</code> (or <code>op</code>) is what turns a command-style procedure into an operation. <code>op</code> works too.`}),
WR(`Write an operation called <code>cube</code> that outputs its input multiplied by itself three times.`,
  {starter: ``,
     after: `print cube 3
print (cube 2) + 1`,
     expect: `27
9`,
     solution: `to cube :n
  output :n * :n * :n
end`,
     hint: `Start with to cube :n, use output on one line, and finish with end.`,
     explain: `Any version that outputs the right number works, for example <code>output :n * :n * :n</code> or <code>output product :n :n :n</code>.`}),
]});
