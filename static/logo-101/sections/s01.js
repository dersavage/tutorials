S({
id: 1,
title: "Talking to Logo",
tagline: "print, show and type: your first three words in a language that answers back",
blocks: [
P(`Let me tell you something I have noticed after years of watching beginners. The ones who do well are not the cleverest. They are the ones who get an answer back quickly, and often. Logo was built for exactly this. You type a line, Logo does it, and you see what happened. No <code>main</code>, no imports, no project folder. Just you and the interpreter, having a conversation.`),
N(`<strong>Which Logo?</strong> Logo is a family of languages, not one language. This course teaches <strong>UCBLogo</strong>, also called Berkeley Logo, written by Brian Harvey's group at UC Berkeley, and still the one most people mean when they say "Logo". The interpreter running inside this page understands a large, carefully tested subset of it. Whenever I say "Logo" from here on, I mean UCBLogo. :)`),
P(`Here is your whole first program. In a real UCBLogo window you would see a <code>?</code> prompt on the left; I leave it out so you can press <strong>Run ▶</strong> and watch.`),
L(`print "hello`, {"expect":"hello"}),
P(`One instruction. <code>print</code> is the command, and <code>"hello</code> is what we hand to it. That quote mark in front of <code>hello</code> says: take this literally. It is a word, not a command I want you to go and run. Notice also that there is no closing quote. A Logo word ends at the next space, so the quote only ever goes on the front. Nice, right?`),
P(`Now let's see what the same job costs in Python, the lingua franca of beginner-land. It is also one line, but count what you had to know to write it: a function call with parentheses, and a string with quotes at <em>both</em> ends. Forget one of those and Python will tell you about it in words that mean nothing to a person who has been programming for four minutes.`),
PY(`print("hello")`),
P(`<strong>Raku</strong> offers <code>say</code>, which adds a newline, or <code>print</code>, which does not. Quotes at both ends again, and a semicolon if more code follows.`),
RK(`say "hello";`),
P(`None of this is wrong, mind you. But count the symbols a beginner must get right before anything appears on screen: Python wants two parentheses and two quotes, Raku wants two quotes and a semicolon, Logo wants one quote. When you are eleven, or fifty, that is not a small difference.<sup>[1]</sup>`),
P(`Next, a list. Square brackets make a list, and a list is Logo's natural way to hold a sentence. Look: no commas, and no quotes around each word either.`),
L(`print [hello, world]
show [hello, world]`, {"expect":"hello, world\n[hello, world]"}),
P(`Same input, two different outputs, and the difference is the whole lesson. <code>print</code> is for people: it strips the outer brackets and gives you something that reads like English. <code>show</code> is for programmers: it shows the thing exactly as Logo stores it, brackets and all. When you are debugging, <code>show</code> tells you the truth. When you are talking to a user, <code>print</code> is what you want.`),
P(`<strong>Python</strong> makes you choose the representation yourself. Printing a list shows brackets and quotes, because that is the list's <code>repr</code>. If you want the "reads like English" version, you have to build it by hand, with <code>join</code>, a method you meet on page one hundred of most books.`),
PY(`words = ["hello,", "world"]
print(words)            # ['hello,', 'world']  (the repr)
print(" ".join(words))  # hello, world         (you built it)`),
P(`<strong>Raku</strong> has the same split, spelled as two methods: <code>say</code> uses the <code>.gist</code> form (friendly), and <code>.raku</code> gives the programmer's form, the one you could paste straight back into code.`),
RK(`my @words = "hello,", "world";
say @words;        # [hello, world]
say @words.raku;   # ["hello,", "world"]`),
P(`I like that Raku noticed the distinction and named both halves. But Logo got there first, with two short words, and a beginner meets the idea on day one instead of in week six. Noice.`),
P(`Arithmetic works the way you hope. Logo even accepts the infix form you learned at school:`),
L(`print 2 + 3
print sum 2 3`, {"expect":"5\n5"}),
P(`Both lines do the same thing. <code>sum 2 3</code> is the prefix style: the name of the action first, then what it acts on. Here is a thing worth knowing early: in Logo, apart from the arithmetic symbols, <em>everything</em> is written this way, and the symbols are the one friendly exception. We will see why that choice matters soon. For now both work, and that is all you need.`),
P(`In <strong>Python</strong> there is exactly one way, and it is the school way. Fine, and no complaints.`),
PY(`print(2 + 3)   # 5`),
P(`<strong>Raku</strong> has the infix form too, and it will also let you call the operator in prefix form, which looks strange today and obvious in a few lessons. Hold that thought.`),
RK(`say 2 + 3;        # 5
say [+] 2, 3;     # 5  (the [+] reduction operator)`),
P(`One more command. <code>type</code> prints without starting a new line, so you can build a line piece by piece:`),
L(`type "ab
type "cd
print "ef`, {"expect":"abcdef"}),
P(`Two <code>type</code>s, then a <code>print</code> to finish the line. In Python you reach for the keyword argument <code>end=""</code>; in Raku you swap <code>say</code> for <code>print</code>.`),
PY(`print("ab", end="")
print("cd", end="")
print("ef")`),
RK(`print "ab";
print "cd";
say "ef";`),
P(`Python's version asks you to know about keyword arguments and the empty string before you have even seen a function. Raku's is tidy, but you have to remember that <code>say</code> and <code>print</code> differ only by a trailing newline. Logo spends three different words on three different jobs, and each does exactly one thing. That is what I mean when I call it a good teaching language: small vocabulary, and the words do what they say.`),
P(`That's lesson one. You have already met the idea that will carry us through the whole course: in Logo there are only two kinds of things, the things that <em>act</em> (<code>print</code>, <code>show</code>, <code>type</code>, <code>sum</code>) and the things that are <em>acted upon</em> (<code>"hello</code>, <code>[hello, world]</code>, <code>2</code>). Nothing else. Hold on to that.`),
],
fn: [
 "I am deliberately comparing the first thirty seconds. Over thirty years, of course, Python's reach wins easily. But nobody ever quit programming in the first thirty years."
],
ex: [
MC(`Which command shows a list <em>exactly</em> as Logo stores it, outer brackets included?`, ["<code>print</code>","<code>show</code>","<code>type</code>","<code>say</code>"], 1, `<code>show</code> keeps the brackets. <code>print</code> removes the outer pair because it is aimed at human readers.`),
MC(`In <code>print "hello</code>, what does the quote mark in front of <code>hello</code> tell Logo?`, ["The word is the name of a command to run","The word is a literal piece of data, not a command","The word is a number","The line is finished"], 1, `A quoted word is data. Without the quote Logo would try to run <code>hello</code> as a command and complain that it doesn't know how.`),
PR(`What does Logo print for these two lines? Type the output exactly.`,
  {code: `print [a b c]
show [a b c]`,
     answer: `a b c
[a b c]`,
     hint: `One of the two removes the outer brackets.`,
     explain: `<code>print</code> gives <code>a b c</code> and <code>show</code> gives <code>[a b c]</code>.`}),
FI(`Fill in the blank so Logo prints <code>10</code>.`,
  {template: `print 4 ___ 6`,
     answer: `+`,
     expect: `10`,
     hint: `A single arithmetic symbol.`,
     explain: `<code>4 + 6</code> is 10. (<code>print sum 4 6</code> would work too.)`}),
WR(`Write one line of Logo that makes this output, on two lines: <code>one</code> and then <code>two</code>. You may use more than one instruction on the line.`,
  {starter: ``,
     expect: `one
two`,
     solution: `print "one
print "two`,
     hint: `Two print commands, each with its own quoted word.`,
     explain: `Any two <code>print</code> instructions will do. Remember the quote goes only on the front of the word.`}),
]});
