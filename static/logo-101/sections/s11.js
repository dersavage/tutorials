S({
id: 11,
title: "Boolean logic and remainder",
tagline: "and, or, not: combining questions, and the one arithmetic trick every programmer needs",
blocks: [
P(`In the last lesson you made Logo choose with <code>if</code> and <code>ifelse</code>. Every one of those choices hung on a single question: is this bigger than that, is this word empty. Real decisions are rarely that simple. "Can I buy the ticket?" means <em>am I old enough</em> and <em>do I have the money</em>. "Is the shop closed?" means <em>is it Sunday</em> or <em>is it after six</em>. To ask compound questions, you combine yes-or-no answers with three little words: <code>and</code>, <code>or</code> and <code>not</code>.`),
L(`print and (3 > 1) (2 > 1)
print and (3 > 1) (2 > 5)
print or (3 > 5) (2 > 1)
print or (3 > 5) (2 > 5)
print not (3 > 5)`, {expect: "true\nfalse\ntrue\nfalse\ntrue"}),
P(`Read those five lines slowly. <code>and</code> is true only when <em>both</em> of its inputs are true. <code>or</code> is true when <em>at least one</em> is. <code>not</code> flips true to false and false to true. The comparisons <code>3 > 1</code> and so on each produce the words <code>true</code> or <code>false</code>, and the combiners work on those.`),
P(`Notice the shape: <code>and</code> is written <em>in front of</em> its two inputs, like <code>sum</code> was. Each comparison sits in its own parentheses so Logo can see where one input ends and the next begins. In UCBLogo, <code>and</code> and <code>or</code> take exactly two inputs unless you wrap the whole thing in parentheses and give them more.`),
P(`<strong>Python</strong> does it the other way round: the operator sits between the questions, and the words are lowercase <code>and</code>, <code>or</code>, <code>not</code>. This is readable, I'll admit. "3 > 1 and 2 > 1" reads like English.`),
PY(`print(3 > 1 and 2 > 1)    # True
print(3 > 5 or 2 > 1)     # True
print(not 3 > 5)          # True`),
P(`Python prints <code>True</code> with a capital T, because <code>True</code> is a real value of a real type. In Logo, <code>true</code> is just a word that happens to mean yes. Raku is closer to Python here, and spells booleans with a capital letter too:`),
RK(`say (3 > 1) && (2 > 1);     # True
say (3 > 5) || (2 > 1);     # True
say !(3 > 5);               # True`),
P(`Raku gives you symbolic <code>&&</code>, <code>||</code> and <code>!</code> and also the low-precedence word forms <code>and</code>, <code>or</code>, <code>not</code>. The symbolic ones bind tightly; the word ones bind loosely, which is a trap I have watched many students fall into. Logo has only the words, and they always behave as ordinary prefix operations. Fewer choices, fewer traps.`),
P(`Now let's use them for something. In UCBLogo, <code>remainder</code> gives what is left over after division. It is how a program asks "does this divide evenly?":`),
L(`print remainder 10 3
print remainder 10 5
print remainder 7 2`, {expect: "1\n0\n1"}),
P(`Ten divided by 3 is 3 with 1 left over. Ten divided by 5 has nothing left over. A remainder of 0 means "divides evenly". And a remainder of 1 after dividing by 2 means the number is odd. That single trick, remainder by 2, is how nearly every program on earth tests for even and odd.`),
P(`<strong>Python</strong> calls the same operation <code>%</code>, and it is probably the most-used operator after plus:`),
PY(`print(10 % 3)   # 1
print(10 % 5)   # 0
print(7 % 2)    # 1`),
P(`<strong>Raku</strong> uses <code>%</code> as well, and adds <code>%%</code>, a "divisible by" operator that returns a yes-or-no answer directly. That is a lovely idea, and a good example of Raku giving a common question a name:`),
RK(`say 10 % 3;     # 1
say 10 %% 5;    # True
say 7 %% 2;     # False`),
P(`Logo has no divisible-by operator, but we can build our own in three lines, which is precisely the point of the language. Here is a procedure that answers yes or no, using the pieces from the last few lessons:`),
L(`to divisiblep :a :b
  output (remainder :a :b) = 0
end

print divisiblep 12 4
print divisiblep 12 5`, {expect: "true\nfalse"}),
P(`The name ends in <code>p</code>, which is the Logo convention for a procedure that answers yes or no, exactly like <code>numberp</code> and <code>emptyp</code>. Once you've written it, it is a first-class citizen: you can use it inside <code>if</code>, or combine it with <code>and</code>.`),
L(`to fizz :n
  if divisiblep :n 3 [print "fizz]
end

to leap :y
  output and (divisiblep :y 4) (or (not divisiblep :y 100) (divisiblep :y 400))
end

fizz 9
fizz 10
print leap 2024
print leap 1900
print leap 2000`, {expect: "fizz\ntrue\nfalse\ntrue"}),
P(`<code>fizz 9</code> prints; <code>fizz 10</code> does nothing, because 10 isn't divisible by 3. The leap-year rule is the classic compound question: divisible by 4, <em>except</em> centuries, <em>unless</em> divisible by 400. Notice how it reads when you build the answer from small, well-named pieces. This is what I mean when I say Logo teaches decomposition: you do not need a special trick, you just keep naming things.`),
P(`In <strong>Python</strong>, the same rule is one expression, and honestly it is tidy:`),
PY(`def leap(y):
    return y % 4 == 0 and (y % 100 != 0 or y % 400 == 0)

print(leap(2024), leap(1900), leap(2000))   # True False True`),
P(`And in <strong>Raku</strong>, the <code>%%</code> operator earns its keep:`),
RK(`sub leap($y) { $y %% 4 && ($y % 100 != 0 || $y %% 400) }
say leap(2024), leap(1900), leap(2000);   # TrueFalseTrue`),
P(`Both are shorter than the Logo. I will not pretend otherwise. But the Logo version had three named steps, and a beginner can read each one aloud. Shorter is not always clearer when you are learning, and I would rather my students be able to read the code than admire it.`),
N(`<strong>Gotcha:</strong> <code>and</code> with a single input is an error in UCBLogo, because it needs two things to combine. If you want three or more, wrap the call in parentheses: <code>(and a b c)</code>.`),
],
ex: [
MC(`What does <code>print or (3 > 5) (2 > 1)</code> print?`, ["true", "false", "an error", "nothing"], 0,
  `<code>or</code> is true when at least one input is true. <code>2 > 1</code> is true, so the answer is <code>true</code>.`),
MC(`A number divided by 2 leaves <code>remainder 1</code>. What kind of number is it?`, ["even", "odd", "negative", "a decimal"], 1,
  `Even numbers divide evenly by 2 (remainder 0). A remainder of 1 means odd.`),
PR(`What does this print? Type the output exactly.`,
  {code: `print and (4 > 2) (not 3 = 3)\nprint or (4 > 2) (not 3 = 3)\nprint remainder 17 5`, answer: "false\ntrue\n2",
   hint: "not 3 = 3 is false, because 3 = 3 is true.",
   explain: `<code>and</code> needs both true, but <code>not 3 = 3</code> is false, so false. <code>or</code> only needs one: true. And 17 = 3×5 + 2, so the remainder is 2.`}),
FI(`Fill in the blank so Logo prints <code>true</code> for an odd number.`,
  {template: `print (remainder 9 2) = ___`, answer: "1", expect: "true",
   hint: "What is left over when you divide an odd number by 2?",
   explain: `Odd numbers leave a remainder of 1 when divided by 2.`}),
WR(`Write a procedure <code>evenp :n</code> that outputs <code>true</code> when <code>:n</code> is even and <code>false</code> otherwise.`,
  {before: "", starter: "to evenp :n\n  \nend", after: "print evenp 10\nprint evenp 7\nprint evenp 0",
   expect: "true\nfalse\ntrue", solution: "to evenp :n\n  output (remainder :n 2) = 0\nend",
   hint: "Output the answer to the question: is the remainder of :n divided by 2 equal to 0?",
   explain: `A remainder of 0 after dividing by 2 is the whole definition of even. Notice you can <code>output</code> a comparison directly.`}),
]});
