S({
id: 1,
title: "Talking to Logo",
tagline: "print, show and type: your first three words in a language that answers back",
blocks: [
P(`Let me start with a confession: I have taught programming to people who had never seen a command line, and the ones who did best were never the ones who got the most clever early. They were the ones who got an answer back fast, and often. Logo is built for exactly that. You type a line, Logo does it, and you see what happened. No <code>main</code>, no imports, no project folder. Just you and the interpreter.`),
N(`<strong>Which Logo is this?</strong> Logo is a family of languages. This course teaches <strong>UCBLogo</strong>, also called Berkeley Logo, which is the version Brian Harvey's group at UC Berkeley wrote and which is still the one most people mean today. The interpreter running in this page understands a large, carefully tested subset of it. When a lesson says "Logo", it means UCBLogo.`),
P(`Here is the whole of your first program. The <code>?</code> in the left margin is Logo's prompt in the real UCBLogo; I leave it out of the runnable boxes so you can press <strong>Run ▶</strong> and watch.`),
L(`print "hello`, {expect: "hello"}),
P(`That is one instruction. <code>print</code> is the command, and <code>"hello</code> is its input. The quote mark in front of <code>hello</code> means "take this literally: it is a word, not a command I should go and run". Notice there is no closing quote. A Logo word ends at the next space, so the quote only ever goes on the front.`),
P(`<strong>In Python</strong>, the equivalent is one line too, but look at what you had to learn to write it: a function call with parentheses, and a string with quotes on <em>both</em> ends.`),
PY(`print("hello")`),
P(`<strong>In Raku</strong>, you have a choice of <code>say</code> (adds a newline) or <code>print</code> (doesn't). Quotes on both ends again, and a statement-terminating semicolon if more code follows.`),
RK(`say "hello";`),
P(`None of that is wrong. But count the symbols a beginner has to get right before anything appears on screen: Python wants two parentheses and two quotes, Raku wants two quotes and a semicolon. Logo wants one quote. That is not a small difference when you are eleven, or fifty.`),
P(`Now a list. Square brackets hold a list of things, and a list is Logo's natural way of holding a sentence:`),
L(`print [hello, world]
show [hello, world]`, {expect: "hello, world\n[hello, world]"}),
P(`Same input, two different outputs, and the difference is the whole lesson. <code>print</code> is for people: it strips the outer brackets and gives you something that reads like English. <code>show</code> is for programmers: it shows the thing exactly as Logo stores it, brackets and all. When you are debugging, <code>show</code> tells you the truth. When you are writing for a user, <code>print</code> is what you want.`),
P(`<strong>Python</strong> makes you choose the representation yourself. <code>print</code> of a list shows the brackets and quotes, because that is the list's <code>repr</code>. To get the "reads like English" version you have to build it.`),
PY(`words = ["hello,", "world"]
print(words)            # ['hello,', 'world']  (the repr)
print(" ".join(words))  # hello, world         (you built it)`),
P(`<strong>Raku</strong> has the same split, but spelled as two methods: <code>say</code> uses the <code>.gist</code> form (human-friendly) and <code>.raku</code> gives the programmer's form that you could paste back into code.`),
RK(`my @words = "hello,", "world";
say @words;        # [hello, world]
say @words.raku;   # ["hello,", "world"]`),
P(`I like that Raku has noticed the distinction and named both halves. But Logo got there first, with two short words, and a beginner meets the idea on day one instead of week six.`),
P(`Arithmetic works the way you hope. Logo even accepts the infix form you learned in school:`),
L(`print 2 + 3
print sum 2 3`, {expect: "5\n5"}),
P(`The two lines do the same thing. <code>sum 2 3</code> is the "prefix" style, where the operation comes first and its inputs follow. You will see why Logo cares about that style later; for now it is enough to know both work.`),
P(`<strong>Python</strong> has exactly one way to write it, and it is the school way:`),
PY(`print(2 + 3)   # 5`),
P(`<strong>Raku</strong> has the infix form too, and it also lets you call the operator in prefix form, which will look odd today and obvious in a few lessons:`),
RK(`say 2 + 3;        # 5
say [+] 2, 3;     # 5  (the [+] reduction operator)`),
P(`One more command. <code>type</code> prints without starting a new line, so you can build up a line piece by piece:`),
L(`type "ab
type "cd
print "ef`, {expect: "abcdef"}),
P(`<code>type</code> twice, then <code>print</code> to finish the line. In Python you reach for the <code>end=""</code> keyword; in Raku you reach for <code>print</code> instead of <code>say</code>.`),
PY(`print("ab", end="")
print("cd", end="")
print("ef")`),
RK(`print "ab";
print "cd";
say "ef";`),
P(`Python's version asks you to know about keyword arguments and an empty string, before you've seen a function. Raku's is neat, but you have to know <code>say</code> and <code>print</code> differ only by that trailing newline. Logo spends three different words on three different jobs, and each does one thing. That is what I mean when I say Logo is a good teaching language: the vocabulary is small and the words do what they say.`),
],
ex: [
MC(`Which command shows a list <em>exactly</em> as Logo stores it, outer brackets included?`,
  ["<code>print</code>", "<code>show</code>", "<code>type</code>", "<code>say</code>"], 1,
  `<code>show</code> keeps the brackets. <code>print</code> removes the outer pair because it is aimed at human readers.`),
MC(`In <code>print "hello</code>, what does the quote mark in front of <code>hello</code> tell Logo?`,
  ["The word is the name of a command to run", "The word is a literal piece of data, not a command", "The word is a number", "The line is finished"], 1,
  `A quoted word is data. Without the quote Logo would try to run <code>hello</code> as a command and complain that it doesn't know how.`),
PR(`What does Logo print for these two lines? Type the output exactly.`,
  {code: `print [a b c]\nshow [a b c]`, answer: "a b c\n[a b c]",
   hint: "One of the two removes the outer brackets.",
   explain: `<code>print</code> gives <code>a b c</code> and <code>show</code> gives <code>[a b c]</code>.`}),
FI(`Fill in the blank so Logo prints <code>10</code>.`,
  {template: `print 4 ___ 6`, answer: "+", expect: "10",
   hint: "A single arithmetic symbol.",
   explain: `<code>4 + 6</code> is 10. (<code>print sum 4 6</code> would work too.)`}),
WR(`Write one line of Logo that makes this output, on two lines: <code>one</code> and then <code>two</code>. You may use more than one instruction on the line.`,
  {starter: "", expect: "one\ntwo", solution: `print "one\nprint "two`,
   hint: "Two print commands, each with its own quoted word.",
   explain: `Any two <code>print</code> instructions will do. Remember the quote goes only on the front of the word.`}),
]});
