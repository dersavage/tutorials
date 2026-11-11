S({
id: 29,
title: "Errors and debugging",
tagline: "Every program you write will be wrong at first. Here is how to get comfortable being wrong",
blocks: [
P(`Nobody tells beginners this clearly enough, so I will: <strong>errors are normal</strong>. Professional programmers see error messages all day long. The difference between a beginner and an expert isn't that the expert makes fewer mistakes. It's that the expert reads the message calmly and knows where to look. UCBLogo's error messages are, in my opinion, some of the friendliest you'll find, and this lesson will teach you to read them.`),
P(`The most common one first. You typed a word Logo doesn't know:`),
L(`print foo`, {"error":true}),
P(`The message is <code>I don't know how to foo</code>. Look at that. It means exactly what it says: Logo reached the word <code>foo</code>, looked for a command or procedure of that name, and found none. Usually the cause is one of three things: a typo (<code>pritn</code>), a procedure you never defined or forgot to run the <code>to ... end</code> for, or a missing quote that makes Logo treat a word you meant as data as a command to run (<code>print hello</code> instead of <code>print "hello</code>). Crystal-clear.`),
P(`<strong>Python</strong> answers a similar mistake with a <code>NameError</code>, followed by a "traceback" that lists the chain of calls that led there. It's helpful for an expert, and a wall of text for a beginner. Oh no. The poor beginner:`),
PY(`print(foo)
# Traceback (most recent call last):
#   File "<stdin>", line 1, in <module>
# NameError: name 'foo' is not defined`),
RK(`say foo;
# ===SORRY!=== Error while compiling ...
# Undeclared routine:
#     foo used at line 1`),
P(`Raku's message is lovely and detailed, and it catches the mistake before anything runs, which is an advantage of its design. Logo catches it the moment it reaches the word. All three say the same thing; Logo's is the shortest, and short matters when you're nervous.`),
P(`Second error: a variable with no value.`),
L(`print :nope`, {"error":true}),
P(`<code>nope has no value</code>. You asked for <code>:nope</code>, but nobody ever did <code>make "nope</code> something. Check the spelling of the name, and check that the <code>make</code> actually ran before the line that uses it. A very common cause is a variable made inside a procedure with <code>local</code>, then used after the procedure has finished. It's gone by then.`),
P(`Third: a command that doesn't like what you gave it.`),
L(`print first []`, {"error":true}),
L(`print "a + 1`, {"error":true}),
P(`<code>first doesn't like [] as input</code>: there is no first thing in an empty list. <code>+ doesn't like a as input</code>: you can't add the word <code>a</code> to a number. The shape of this message is always "<em>command</em> doesn't like <em>value</em> as input". It tells you which command was unhappy and what it was handed. Work backwards: where did that value come from?`),
P(`And fourth, the quietest bug of all: not enough inputs.`),
L(`print sum 1`, {"error":true}),
P(`<code>not enough inputs to sum</code>. <code>sum</code> needs two numbers. Count the inputs the command wants, and count the ones you supplied.`),
PY(`print(1 + "a")
# TypeError: unsupported operand type(s) for +: 'int' and 'str'

print([][0])
# IndexError: list index out of range`),
RK(`say 1 + "a";
# Cannot convert string to number: base-10 number must begin with valid digits

say [][0];
# (Any)   -- Raku quietly gives you an undefined value instead of an error`),
P(`That last Raku line is a teaching moment. Some languages stop and tell you something is wrong; others hand you a "nothing" value and let the program carry on. Neither is universally right. For a learner, an early, loud error is a kindness, and Logo is generally on that side.`),
P(`Now, debugging. Reading a message is the first skill. The second is <em>finding out what your program is actually doing</em>, which is often different from what you think. The simplest tool, and the one professionals still use daily, is <strong>printing</strong>. If a procedure gives the wrong answer, print the values it is working with:`),
L(`to average :a :b
  print (sentence [a is] :a [b is] :b)
  output (:a + :b) / 2
end

print average 4 10`, {"expect":"a is 4 b is 10\n7"}),
P(`The first <code>print</code> is scaffolding: it shows the inputs as the procedure sees them. When you've found the bug, delete it. Printing is not shameful. It's the oldest debugging tool there is, and it works in every language ever invented.`),
PY(`def average(a, b):
    print("a is", a, "b is", b)   # scaffolding
    return (a + b) / 2

print(average(4, 10))`),
RK(`sub average($a, $b) {
    note "a is $a b is $b";     # note writes to stderr, so it won't mix with output
    ($a + $b) / 2
}
say average(4, 10);`),
P(`Raku's <code>note</code> prints to the error stream, so your debugging output doesn't get mixed up with the real output. A small touch, and the sort of detail that suggests a language designed by people who debug a lot.`),
P(`The other great technique is to <strong>test small pieces</strong>. Logo makes this easy, because every procedure can be called by itself, straight from the prompt. If <code>average</code> is wrong, try <code>average 2 2</code> (you expect 2), then <code>average 0 10</code> (you expect 5). A short procedure with a name is a testable unit. That's why we keep procedures small.`),
L(`print average 2 2
print average 0 10`, {"expect":"a is 2 b is 2\n2\na is 0 b is 10\n5"}),
P(`There is a third tool, special to UCBLogo and its relatives: <code>trace</code>. Turn it on for a procedure and Logo announces each call and each answer. In this page the trace messages are hidden, but in a desktop copy of UCBLogo you'd see each call and its answer indented, which makes recursion visible: <code>trace "factorial</code>, then run it, and watch the calls nest. When you're done, <code>untrace "factorial</code>.`),
P(`Last, a habit. When something goes wrong, <strong>reduce the problem</strong>. Delete lines until the error vanishes, then put the last one back. Replace the data with the smallest possible example. If the shortest input that fails is a three-item list, ask what's special about three items. Most bugs confess when you make them small.`),
N(`<strong>Reading an error:</strong> (1) read it aloud; (2) find the command named; (3) find the value; (4) trace the value back to where it came from. Nine times in ten, that's the bug.`),
],
fn: [],
ex: [
MC(`Logo says <code>I don't know how to foo</code>. Which is <em>not</em> a likely cause?`, ["A typo in the command name","A procedure that was never defined","A missing quote before a word meant as data","The number is too large"], 3, `That message is about an unknown command name, not about number size.`),
MC(`What does <code>nope has no value</code> mean?`, ["The variable is named nope and holds zero","You used a variable that was never given a value","nope is a reserved word","Logo ran out of memory"], 1, `<code>:nope</code> was read before any <code>make "nope</code> ran, or after a <code>local</code> variable had gone away.`),
PR(`What does this print? Type the output exactly. (The first line of output is the scaffolding.)`,
  {before: `to average :a :b
  print (sentence [a is] :a [b is] :b)
  output (:a + :b) / 2
end`,
     code: `print average 6 8`,
     answer: `a is 6 b is 8
7`,
     hint: `The print inside the procedure runs before the answer is printed.`,
     explain: `The scaffolding line prints first, then the answer 7 is printed by the outer <code>print</code>.`}),
FI(`Fill in the blank so the line stops giving an error and prints <code>3</code>.`,
  {template: `print ___ 1 2`,
     answer: `sum`,
     expect: `3`,
     hint: `A command that takes two numbers and answers with their total.`,
     explain: `<code>sum 1 2</code> is 3. (Without both inputs you get <em>not enough inputs to sum</em>.)`}),
WR(`The procedure below has a bug: <code>double.all [1 2 3]</code> should show <code>[2 4 6]</code>, but it fails. Write a corrected version that works.`,
  {before: `to double.all :list
  output map [? * 2] list
end`,
     starter: `to double.all :list
  output map [? * 2] list
end`,
     after: `show double.all [1 2 3]`,
     expect: `[2 4 6]`,
     solution: `to double.all :list
  output map [? * 2] :list
end`,
     hint: `Read the error. Which word is missing something in front of it?`,
     explain: `<code>list</code> was missing its colon, so Logo ran it as a command instead of reading the variable. It should be <code>:list</code>.`}),
]});
