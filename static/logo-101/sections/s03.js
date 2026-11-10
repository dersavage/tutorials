S({
id: 3,
title: "Arithmetic",
tagline: "Prefix, infix, and the one place Logo trips everybody up",
blocks: [
P(`Every programming course has an arithmetic lesson, and most of them are dull because they only say "the computer can add". Fine. It can. What I want to show you is something more interesting: Logo lets you write the same calculation in <strong>two styles</strong>, and understanding why tells you a lot about how the language thinks.`),
P(`Style one is <strong>infix</strong>, the one from school: the operator sits between its two numbers. Style two is <strong>prefix</strong>: the operator's name comes first and the inputs follow. Same results:`),
L(`print 3 + 4
print sum 3 4
print 10 - 4
print difference 10 4
print 6 * 7
print product 6 7`, {expect: "7\n7\n6\n6\n42\n42"}),
P(`<code>sum</code>, <code>difference</code> and <code>product</code> are ordinary commands, no different from <code>print</code> except that they <em>give back</em> an answer, and <code>print</code> then does something with it. This is a big idea in Logo, and we will get to it properly in lesson 8: some commands <em>do</em> things, and some <em>answer</em>. Arithmetic is all answering.`),
P(`Why bother with prefix at all? Because it has no precedence puzzles. If you write <code>sum 3 4</code>, there is no question what binds to what. And because prefix is how every other Logo command works, learning it with <code>sum</code> makes the rest of the language feel consistent.`),
P(`<strong>Python</strong> has only the infix form. There is no <code>sum(3, 4)</code> in the sense you might hope: <code>sum</code> exists, but it takes one iterable, so you must write <code>sum([3, 4])</code>. For two numbers, infix is the way.`),
PY(`print(3 + 4)       # 7
print(10 - 4)      # 6
print(6 * 7)       # 42
print(sum([3, 4])) # 7  (sum wants a list, not two arguments)`),
P(`That last line is the kind of trap that makes beginners think Python is arbitrary. It is not arbitrary, <code>sum</code> adds up a whole collection, but it surprises you if you assumed it worked like Logo's.`),
P(`<strong>Raku</strong> goes further than either: every operator is also a function you can call by name, and there is even a reduction metaoperator that sums any list:`),
RK(`say 3 + 4;          # 7
say [+] 3, 4;       # 7
say (3, 4).sum;     # 7
say infix:<+>(3, 4); # 7`),
P(`Raku is wonderfully expressive here, and if you are ready for it, enjoy it. As a <em>first</em> language, though, four ways to add two numbers is three too many.`),
P(`Now division. Logo's <code>/</code> gives an exact answer, with a decimal part if needed. <code>quotient</code> is the prefix equivalent. To get the whole-number part you chop with <code>int</code>, or round with <code>round</code>. And <code>remainder</code> gives what is left over after dividing, which you will use more than you expect.`),
L(`print 7 / 2
print quotient 7 2
print int 7 / 2
print round 3.6
print remainder 17 5`, {expect: "3.5\n3.5\n3\n4\n2"}),
P(`Careful with the second line: <code>quotient 7 2</code> is <code>3.5</code> in UCBLogo, not <code>3</code>. It is plain division in prefix dress. If you want integer division, you say <code>int</code> of the result. And <code>int 7 / 2</code> works because Logo reads it as <code>int (7 / 2)</code>.`),
P(`<strong>Python</strong> splits this into two operators, which is a design choice I like: <code>/</code> is true division, <code>//</code> is floor division, and <code>%</code> is the remainder.`),
PY(`print(7 / 2)    # 3.5
print(7 // 2)   # 3
print(round(3.6))  # 4
print(17 % 5)   # 2`),
P(`Python's trio is tidy. The thing to watch is that <code>//</code> floors toward negative infinity, so <code>-7 // 2</code> is <code>-4</code>, not <code>-3</code>. Logo's <code>int</code> truncates toward zero. Different edge case, same everyday behaviour.`),
P(`<strong>Raku</strong> has the same trio, but with named operators for integer work: <code>div</code> for integer division and <code>%</code> for remainder, and <code>/</code> gives an exact rational (so <code>7 / 2</code> is exactly 3.5, no floating-point fuzz).`),
RK(`say 7 / 2;      # 3.5
say 7 div 2;    # 3
say 3.6.round;  # 4
say 17 % 5;     # 2`),
P(`Now two more: roots and powers. <code>sqrt</code> takes a square root and <code>power</code> raises one number to another.`),
L(`print sqrt 25
print power 2 8
print sqrt 2`, {expect: "5\n256\n1.4142135623731"}),
P(`UCBLogo prints about 15 significant digits, so <code>sqrt 2</code> comes out as <code>1.4142135623731</code>. (A real UCBLogo shows the same.) It is the nearest the computer can store, not the true root, which has infinitely many digits.`),
PY(`import math
print(math.sqrt(25))   # 5.0
print(2 ** 8)          # 256
print(math.sqrt(2))    # 1.4142135623730951`),
P(`Python needs an <code>import math</code> just to take a square root, and it prints <code>5.0</code> where Logo says <code>5</code>. Python distinguishes ints from floats visibly; Logo hides the distinction when it can. Raku builds the functions in:`),
RK(`say sqrt(25);   # 5
say 2 ** 8;      # 256
say sqrt(2);     # 1.4142135623730951`),
P(`And here is the trap I promised. Logo's infix operators have the usual precedence: multiplication before addition. But the <em>prefix</em> commands take whatever follows them, and spaces matter around minus signs. Look at this:`),
L(`print 2 + 3 * 4
print (2 + 3) * 4
print 10 - 2 - 3
print 2 * 3 + 4 * 5`, {expect: "14\n20\n5\n26"}),
P(`Multiplication wins, parentheses override, subtraction runs left to right. All as in school. Beware, though, of writing <code>2 -3</code> with a space before the minus and none after: Logo reads <code>-3</code> as a separate number and complains that you did not say what to do with it. Put spaces on both sides of the minus when you mean subtraction.`),
PY(`print(2 + 3 * 4)    # 14
print((2 + 3) * 4)  # 20
print(10 - 2 - 3)   # 5`),
RK(`say 2 + 3 * 4;    # 14
say (2 + 3) * 4;  # 20
say 10 - 2 - 3;   # 5`),
P(`On precedence all three languages agree, which is comforting. The difference is in the prefix commands, which Logo has and the others do not. My recommendation to learners: use infix for sums that look like sums, use prefix when passing an answer along to another command, and put spaces around every operator.`),
],
ex: [
MC(`In UCBLogo, what does <code>print quotient 7 2</code> print?`,
  ["3", "3.5", "4", "1"], 1,
  `<code>quotient</code> is ordinary division, so it gives 3.5. Use <code>int</code> if you want the whole-number part, and <code>remainder</code> for what is left over.`),
MC(`Which instruction prints the remainder of 17 divided by 5?`,
  ["<code>print 17 / 5</code>", "<code>print remainder 17 5</code>", "<code>print int 17 / 5</code>", "<code>print difference 17 5</code>"], 1,
  `<code>remainder 17 5</code> is 2. The others give 3.4, 3 and 12.`),
PR(`What does Logo print? Type the three lines exactly.`,
  {code: `print 2 + 3 * 4
print (2 + 3) * 4
print int 9 / 2`, answer: "14\n20\n4",
   hint: "Multiplication before addition, unless parentheses say otherwise. int chops the decimal part.",
   explain: `<code>2 + 3 * 4</code> is 14, the parenthesised version is 20, and <code>int 9 / 2</code> is <code>int 4.5</code>, which is 4.`}),
FI(`Fill in the blank so Logo prints <code>81</code>.`,
  {template: `print ___ 3 4`, answer: "power", expect: "81",
   hint: "3 to the fourth power.",
   explain: `<code>power 3 4</code> is 3 × 3 × 3 × 3 = 81.`}),
WR(`Write Logo that prints the square root of 144, then the remainder when 100 is divided by 7. Two lines of output.`,
  {starter: "", expect: "12\n2", solution: `print sqrt 144\nprint remainder 100 7`,
   hint: "One sqrt and one remainder, each inside its own print.",
   explain: `<code>sqrt 144</code> is 12. 100 = 14 × 7 + 2, so the remainder is 2.`}),
]});
