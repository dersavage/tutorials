S({
id: 4,
title: "Variables",
tagline: "make a name, use the name, change the name",
blocks: [
P(`A variable is a name attached to a value. That is all it is. Teachers sometimes describe it as a "box with a label", which is not terrible, but I prefer the image of a <em>sticky note</em>: you write a name on it and stick it to a value, and later you can peel it off and stick it on something else.`),
P(`In UCBLogo you create a variable with <code>make</code>. It takes two inputs: the name (quoted, because it is data, not a command to run) and the value. To read the value back you put a colon in front of the name. Read the colon as "the contents of".`),
L(`make "name "ada
print :name
make "age 36
print :age + 1`, {expect: "ada\n37"}),
P(`Two details to burn in. First, <code>make "age 36</code> has a quote on the name because <code>make</code> needs the <em>name itself</em>, not whatever the name currently holds. Second, <code>:age</code> has a colon and no quote, because there we do want the contents. Quote means "the name", colon means "what it holds". Confuse them and you get errors such as <code>age has no value</code>.`),
P(`<strong>Python</strong> uses a plain <code>=</code> and does not distinguish the name from its contents by notation at all: the context decides.`),
PY(`name = "ada"
print(name)
age = 36
print(age + 1)   # 37`),
P(`That is shorter, and I will not pretend otherwise. But the Logo notation teaches something the Python one hides: there are two different things, the <em>name</em> and the <em>value</em>, and a program constantly moves between them. Python's syntax makes you absorb that by osmosis; Logo's makes it explicit and then you never lose it.`),
P(`<strong>Raku</strong> sits in between: variables have a <em>sigil</em> (<code>$</code> for a single thing) that is part of the name, and you declare them with <code>my</code>.`),
RK(`my $name = "ada";
say $name;
my $age = 36;
say $age + 1;   # 37`),
P(`The Raku sigil is the closest cousin to Logo's colon: it is visible every time you use the variable, and it tells you a bit about what it holds. A good design, and fair warning that Raku also has <code>@</code> for lists and <code>%</code> for hash tables, so it pays to learn them gradually.`),
P(`Variables can be <em>changed</em>. Giving a name a new value is just another <code>make</code>. The right-hand side can use the old value, which is how counters work:`),
L(`make "n 5
make "n :n + 1
make "n :n * 2
print :n`, {expect: "12"}),
P(`Walk through it slowly. <code>n</code> is 5. Then Logo works out <code>:n + 1</code>, which is 6, and re-sticks the name <code>n</code> onto 6. Then it works out <code>:n * 2</code>, which is 12, and re-sticks again. Only the final value survives. Note that Logo does not say "reassign": it says <code>make</code> again, because there is only one verb for both creating and changing.`),
PY(`n = 5
n = n + 1
n = n * 2
print(n)   # 12
n += 1     # shorthand for n = n + 1`),
P(`Python has the augmented shorthand <code>+=</code>, which you will see everywhere. Logo has no such thing in UCBLogo; you write the longer form. I count that as a small price for a smaller language.`),
RK(`my $n = 5;
$n = $n + 1;
$n *= 2;
say $n;   # 12`),
P(`Raku has the same shorthands as Python. One more difference: <code>my</code> declares the variable the first time, and after that you simply assign. Logo does not have that two-step: <code>make</code> works whether or not the name exists. Convenient for beginners, though in larger programs you would want the declaration to catch typos.`),
P(`Variables can hold anything, including lists. And there is a second way to read a variable: the command <code>thing</code>, which takes the quoted name. <code>:x</code> is just a shorthand for <code>thing "x</code>. Use <code>namep</code> to ask whether a name exists at all.`),
L(`make "colors [red green blue]
print :colors
print thing "colors
print namep "colors
print namep "nothing`, {expect: "red green blue\nred green blue\ntrue\nfalse"}),
P(`<code>thing "colors</code> and <code>:colors</code> are the same. The long form matters when the name itself is computed, which is a topic for later. <code>namep</code> is a predicate (note the <code>p</code>): it answers <code>true</code> if there is a variable of that name and <code>false</code> if not. Asking about a variable that does not exist is a safe question; <em>using</em> one is an error.`),
L(`print :missing`, {error: true}),
P(`UCBLogo's message is <code>missing has no value</code>. That is a good error: it names the culprit and says what is wrong. Beginners fear error messages. I tell them to treat each one as the interpreter doing them a favour.`),
PY(`colors = ["red", "green", "blue"]
print(colors)
print("colors" in globals())    # True, the closest to namep
print("nothing" in globals())   # False`),
P(`Python's nearest equivalent to <code>namep</code> is poking at <code>globals()</code>, which tells you how rarely working programmers ask that question. In Logo it is a one-word predicate because Logo treats variables as ordinary named things you can inspect.`),
RK(`my @colors = <red green blue>;
say @colors;
say @colors.elems;   # 3`),
P(`The Raku version uses an <code>@</code> array and the quote-words shorthand <code>&lt;red green blue&gt;</code>. Notice that Raku has no direct <code>namep</code> either; declared variables are resolved when the program is compiled, so a typo is caught before it runs. That is a real advantage on larger programs, and it is one of the places where Logo's friendliness has a cost.`),
P(`Take-away: <code>make "x value</code> to set, <code>:x</code> to read, <code>namep "x</code> to ask if it exists. Quote for the name, colon for the contents.`),
],
ex: [
MC(`In <code>make "score 10</code>, why is there a quote mark before <code>score</code>?`,
  ["It makes score a number", "make needs the name itself, so the name is given as data", "It marks a comment", "It reads the old value of score"], 1,
  `<code>make</code> needs the <em>name</em>, so you give it as a quoted word. A colon would give it the variable's current contents instead.`),
MC(`What does <code>print :x</code> do when no variable called <code>x</code> exists?`,
  ["Prints 0", "Prints nothing", "Reports that x has no value", "Creates x"], 2,
  `Using a missing variable is an error: <code>x has no value</code>. Only <code>namep "x</code> is a safe way to ask.`),
PR(`What does Logo print? Type it exactly.`,
  {code: `make "a 4
make "b :a * 3
make "a 1
print :b
print :a + :b`, answer: "12\n13",
   hint: "b was computed when it was made. Changing a afterwards does not recompute b.",
   explain: `<code>b</code> became 12 at the moment it was made and stayed 12 when <code>a</code> changed to 1. So <code>:a + :b</code> is 1 + 12 = 13.`}),
FI(`Fill in the blank so Logo prints <code>20</code>.`,
  {before: `make "price 5`, template: `make "total :price * ___
print :total`, answer: "4", expect: "20",
   hint: "5 times what is 20?",
   explain: `<code>:price * 4</code> is 20, which <code>make</code> stores as <code>total</code>.`}),
WR(`Write Logo that makes a variable <code>x</code> equal to 10, then adds 5 to it using <code>make</code>, then prints it.`,
  {starter: "", expect: "15", solution: `make "x 10\nmake "x :x + 5\nprint :x`,
   hint: "Two makes: one to create x and one to change it using :x.",
   explain: `<code>make "x :x + 5</code> reads the old value, adds 5, and re-sticks the name on the result.`}),
]});
