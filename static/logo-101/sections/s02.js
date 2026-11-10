S({
id: 2,
title: "Words, numbers, and lists",
tagline: "Logo has almost no types to learn, and that is the point",
blocks: [
P(`Ask a beginner what a program works with and they will say, "numbers, I guess". Ask a working programmer and you get a fifteen-minute lecture on integers, floats, strings, booleans, arrays, dictionaries, and the difference between a tuple and a list. Both answers are right, LOL. And the gap between them is where many beginners fall in and never climb out.`),
P(`Logo takes the opposite road. In Logo, as in Lisp, its great-grandparent, there are really only two kinds of data to think about: <strong>words</strong> and <strong>lists</strong>. That is it.<sup>[1]</sup> Remember the two kinds of things from lesson one? Things that act, and things that are acted upon. Words and lists are the second kind.`),
P(`A <strong>word</strong> is a chunk of characters with no spaces in it, and you write one with a quote mark in front. A <strong>list</strong> is a sequence of things in square brackets, and each thing is itself a word or another list. Let's print a word first, then a number for good measure.`),
L(`print "apple
print 42
print [apple 42 pear]`, {"expect":"apple\n42\napple 42 pear"}),
P(`Look at what is missing. I did not write <code>"42</code> with a quote, and nothing broke. Numbers quote themselves: Logo can see that <code>42</code> could never be the name of a command, so it treats it as data without being asked. Words need the quote because <code>apple</code> <em>could</em> be a command, and Logo wants you to say plainly what you mean. That is courtesy, not fussiness.`),
P(`Now here is the part that makes people sit up. In Logo, <strong>a number is just a word that happens to look like a number</strong>. Let's ask Logo what it thinks. The commands <code>wordp</code>, <code>numberp</code> and <code>listp</code> are "predicates": they answer <code>true</code> or <code>false</code>. (The <code>p</code> is for predicate. They get a whole lesson soon.)`),
L(`print wordp "apple
print wordp 42
print numberp 42
print numberp "42
print listp [apple]
print listp "apple`, {"expect":"true\ntrue\ntrue\ntrue\ntrue\nfalse"}),
P(`<code>wordp 42</code> is <code>true</code>: 42 is a word. And <code>numberp "42</code> is also <code>true</code>: the word <code>"42</code> <em>is</em> a number. Logo does not keep a "text 42" and an "integer 42" that you must convert between. Compare <strong>Python</strong>, where the two are different animals, and mixing them up is among the first errors every beginner hits. Oh no.`),
PY(`print(type(42))      # <class 'int'>
print(type("42"))    # <class 'str'>
print(42 == "42")    # False
print(int("42") + 1) # 43  (you must convert explicitly)
# print("42" + 1)    # TypeError: can only concatenate str to str`),
P(`Do not misunderstand me. Python is not wrong here. A firm line between text and numbers catches bugs in big programs, and I would not give it up in production code. But it is a lot of ceremony before a student has written anything interesting. Logo lets you postpone that conversation, and I count that as a gift.<sup>[2]</sup>`),
P(`<strong>Raku</strong> sits in between. It has real types (<code>Int</code>, <code>Str</code>) but it is relaxed about moving between them, and its quote-words syntax <code>&lt;...&gt;</code> even makes "numeric-looking words" that act as both.`),
RK(`say 42.WHAT;       # (Int)
say "42".WHAT;     # (Str)
say 42 == "42";    # True  (== is numeric, so "42" is coerced)
say 42 eq "42";    # True  (eq is string comparison)
say <42>.WHAT;     # (IntStr)`),
P(`Raku gives you two equality operators so it can ask which comparison you mean. Clever, honest, and a great deal to explain to a nine-year-old. Logo shrugs and gives you one <code>=</code> that does the sensible thing. Keep that in mind; we will come back to it in the predicates lesson.`),
P(`Now lists. A list can hold words, numbers, <em>and other lists</em>, to any depth. Use <code>show</code> when you want to see the nesting, and <code>count</code> to ask how many items sit at the top level.`),
L(`show [a [b c] d]
print count [a [b c] d]
show [1 [2 [3 [4]]]]`, {"expect":"[a [b c] d]\n3\n[1 [2 [3 [4]]]]"}),
P(`Three items, not four: <code>a</code>, the list <code>[b c]</code>, and <code>d</code>. The inner list counts as one item no matter how much is inside it. This is the single most important thing to understand about nesting, and Logo makes it visible because <code>show</code> prints the brackets. Notice also: no commas, no quotes around the words. Just things, separated by spaces.`),
P(`<strong>Python</strong> lists nest in exactly the same way, with noisier syntax: commas between the items and quotes around every piece of text.`),
PY(`nested = ["a", ["b", "c"], "d"]
print(len(nested))   # 3
print(nested)        # ['a', ['b', 'c'], 'd']`),
P(`Look at the quotes in the output. Python is showing you the <code>repr</code> of each string, and every beginner has to learn, usually the hard way, that those quotes are decoration and not part of the data. And Google will not tell them that on the first try.`),
P(`<strong>Raku</strong> arrays nest too. One gotcha worth knowing: a bare comma list can flatten in some contexts, so you wrap inner arrays in square brackets to keep each one a single item.`),
RK(`my @nested = "a", ["b", "c"], "d";
say @nested.elems;   # 3
say @nested;         # [a [b c] d]`),
P(`Interesting: Raku's <code>say</code> output looks almost exactly like Logo's <code>show</code>. A happy coincidence. Noice.`),
P(`Last concept: <strong>emptiness</strong>. There are two empties in Logo, the empty list <code>[]</code> and the empty word, which you write as a lone quote mark. Both have a count of zero.`),
L(`print count []
print count "
print emptyp []
print emptyp [a]`, {"expect":"0\n0\ntrue\nfalse"}),
P(`<code>emptyp</code> asks "is there nothing here?", and you will use it constantly once you start writing recursive procedures. For now, just remember that empty things exist and you are allowed to ask about them.`),
P(`In <strong>Python</strong> emptiness is usually tested by truthiness: an empty list or string counts as false inside an <code>if</code>. Idiomatic, short, and a little bit magical. :)`),
PY(`items = []
print(len(items))   # 0
print(not items)    # True  (empty containers are falsy)
print("" == "")     # True`),
P(`In <strong>Raku</strong> you ask for <code>.elems</code>, or coerce to a boolean. Here is the straightforward version.`),
RK(`my @items;
say @items.elems;    # 0
say @items.Bool;     # False  (empty means false)
say "".chars;        # 0`),
P(`So: words, numbers (which are words), and lists (which nest). If you take one idea away, take this one: <em>a list item is always one thing, however big it looks</em>. Everything in the next twenty-eight lessons stands on it.`),
],
fn: [
 "I am slightly exaggerating, because arrays exist too. But we will not meet them until lesson 25, and you can write real programs for a long time without them.",
 "Python's \"easy for beginners\" pitch was, as far as I can tell, an afterthought. It was designed for people who already knew what a type was."
],
ex: [
MC(`How many items are at the top level of <code>[a [b c] d]</code>?`, ["2","3","4","5"], 1, `<code>a</code>, <code>[b c]</code> and <code>d</code>: three. The inner list is one item, however much it contains.`),
MC(`What does <code>print numberp "42</code> print in UCBLogo?`, ["<code>false</code>, because it is quoted so it must be a string","<code>true</code>, because the word 42 is a number","An error","<code>42</code>"], 1, `Numbers are words that look like numbers. A quoted <code>"42</code> is still the number 42.`),
PR(`What does Logo print? Type it exactly.`,
  {code: `print count [a b [c d e] f]
print wordp 7
print listp "hello`,
     answer: `4
true
false`,
     hint: `Count the top-level items only. And remember numbers are words.`,
     explain: `There are 4 top-level items (<code>a</code>, <code>b</code>, <code>[c d e]</code>, <code>f</code>). <code>wordp 7</code> is <code>true</code>. <code>"hello</code> is a word, so <code>listp</code> says <code>false</code>.`}),
FI(`Fill in the blank so Logo prints <code>3</code>.`,
  {template: `print count ___`,
     answer: `[x [y z] w]`,
     expect: `3`,
     hint: `A list whose top level has three items. One of them may be a nested list.`,
     explain: `Any list with three top-level items works, for example <code>[x [y z] w]</code> or <code>[1 2 3]</code>.`}),
WR(`Write Logo that prints, on separate lines, the number of items in <code>[red green blue]</code> and then <code>true</code> if <code>[red green blue]</code> is a list.`,
  {starter: ``,
     expect: `3
true`,
     solution: `print count [red green blue]
print listp [red green blue]`,
     hint: `Two print instructions: one with count, one with listp.`,
     explain: `<code>count</code> gives 3, and <code>listp</code> gives <code>true</code> for anything in square brackets.`}),
]});
