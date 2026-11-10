S({
id: 6,
title: "Your first procedure",
tagline: "Teach Logo a new word with to ... end",
blocks: [
P(`Here is the moment that separates "typing commands" from "programming". You are going to teach Logo a new word.`),
P(`Until now every command you used was built in. A <strong>procedure</strong> is a command you define yourself, by giving a name to a sequence of instructions. In UCBLogo you write <code>to</code>, then the name, then the instructions, then <code>end</code>. Logo answers with <code>name defined</code>, and from then on the name works like any built-in.`),
L(`to hello
  print "hello
  print "world
end
hello
hello`, {expect: "hello\nworld\nhello\nworld"}),
P(`The definition itself produces no output apart from Logo's acknowledgement (that <code>hello defined</code> line the page hides for you), and then each use of <code>hello</code> runs both prints. We defined once and used twice. That is already the whole point of abstraction: write it once, name it, reuse it.`),
P(`I want to stress how <em>cheap</em> this is in Logo. There is no <code>def</code> with parentheses and a colon, no <code>sub</code> with braces, no return type, no file to save. You type <code>to</code>, you type <code>end</code>, you are done. A seven-year-old can do this. I have watched them do it.`),
P(`<strong>Python</strong> reaches the same place with the <code>def</code> keyword, a pair of parentheses, a colon, and <em>significant indentation</em>. Forget the indentation and the program does not run or does something subtly different.`),
PY(`def hello():
    print("hello")
    print("world")

hello()
hello()`),
P(`Note that in Python defining and using look different from how Logo does it: the definition ends when the indentation does, and you must write <code>()</code> to call. Drop the parentheses on a call and Python does not complain: <code>hello</code> by itself is a valid expression that does nothing. That is one of the most common beginner bugs I see.`),
P(`<strong>Raku</strong> has the <code>sub</code> keyword and braces:`),
RK(`sub hello {
    say "hello";
    say "world";
}

hello;
hello;`),
P(`Raku lets you call a no-argument sub without parentheses, which is pleasant and close to Logo. The braces delimit the body explicitly, so indentation is a style choice rather than a rule. Good design, and I prefer it to Python's whitespace for teaching, since the structure is visible regardless of how tidy the student is.`),
P(`Procedures can call other procedures. This is how you build big things from small things, and it is the main skill in all of programming. Define a small piece, trust it, and build on it.`),
L(`to line
  print "----------
end
to greeting
  line
  print "welcome
  line
end
greeting`, {expect: "----------\nwelcome\n----------"}),
P(`<code>greeting</code> uses <code>line</code> twice. If we later change <code>line</code> to draw stars instead of dashes, both lines in <code>greeting</code> change automatically. That is what "name a piece and reuse it" buys you.`),
PY(`def line():
    print("----------")

def greeting():
    line()
    print("welcome")
    line()

greeting()`),
P(`One subtle thing: in Python the order of definitions matters only at the moment of the call, so <code>greeting</code> could be defined before <code>line</code> as long as <code>line</code> exists when <code>greeting()</code> runs. Logo is the same. People often worry about this unnecessarily.`),
RK(`sub line { say "----------" }
sub greeting {
    line;
    say "welcome";
    line;
}
greeting;`),
P(`Now, a practical question: what happens if you define a procedure with a name that exists? In UCBLogo you may redefine your own procedures freely. The new definition replaces the old one.`),
L(`to hi
  print "hello
end
hi
to hi
  print "bye
end
hi`, {expect: "hello\nbye"}),
P(`Same name, two definitions, and the later one wins. (UCBLogo does not let you redefine its <em>primitives</em> such as <code>print</code> without special care; it will tell you the name is a primitive. Pick your own names with that in mind.) This makes experimenting very comfortable: change something, re-type the definition, run it again.`),
PY(`def hi():
    print("hello")

hi()

def hi():          # a new definition replaces the old
    print("bye")

hi()`),
P(`Python behaves identically here: the second <code>def</code> rebinds the name. Raku is stricter: redefining a <code>sub</code> in the same scope is an error at compile time unless you take special steps. Nice for catching accidents, less nice for quick experiments.`),
P(`Two housekeeping commands. <code>po "name</code> ("print out") shows you a procedure's definition, and <code>erase "name</code> removes it. Notice the quoted name: the procedure's name is data here, just like a variable's name in <code>make</code>.`),
L(`to sq
  print 2 * 2
end
po "sq
erase "sq`, {expect: "to sq\n  print 2 * 2\nend"}),
P(`After <code>erase "sq</code> the name is gone, and calling <code>sq</code> gives <code>I don't know how to sq</code>. That is exactly what Logo says whenever you type a word that is neither a command nor a procedure, which is also what you see when you mistype a command. Typos in Logo are very forgiving: nothing is damaged, you simply get the message.`),
PY(`def sq():
    print(2 * 2)

import inspect
print(inspect.getsource(sq))   # the closest to po
del sq                         # the closest to erase`),
P(`Python has no tiny equivalent of <code>po</code>; looking at your own source takes the <code>inspect</code> module, which tells you how seldom people do it. In Logo, procedures live in the interpreter's workspace and you can browse them, a feature I miss every time I use other languages.`),
RK(`sub sq { say 2 * 2 }
say &sq.perl;   # a rough peek at the sub object`),
P(`Raku can show you the sub object, though not neatly as source. That is fine; it is a compiled language and I do not hold it against them. The cosy "everything lives in a workspace" feel is Logo's own, and a big part of why it is pleasant to teach with.`),
P(`Take-away: <code>to name ... end</code> defines; the name then works like any command; define small procedures and build bigger ones from them.`),
],
ex: [
MC(`Which line finishes a procedure definition in UCBLogo?`,
  ["<code>stop</code>", "<code>end</code>", "<code>done</code>", "A closing brace"], 1,
  `A definition is wrapped by <code>to name</code> at the top and <code>end</code> at the bottom.`),
MC(`You define <code>to hi</code> printing "hello", then define <code>to hi</code> again printing "bye". What does <code>hi</code> do afterwards?`,
  ["Prints hello", "Prints bye", "Prints both", "Gives an error because hi already exists"], 1,
  `The latest definition replaces the earlier one, so <code>hi</code> prints <code>bye</code>.`),
PR(`What does Logo print? Type it exactly.`,
  {before: `to a
  print "one
end
to b
  a
  print "two
  a
end`, code: `b`, answer: "one\ntwo\none",
   hint: "Follow b line by line: it calls a, prints, then calls a again.",
   explain: `<code>b</code> runs <code>a</code> (prints one), then prints two, then runs <code>a</code> again (prints one).`}),
FI(`Fill in the blank so the procedure is defined properly and <code>hey</code> prints <code>hey</code>.`,
  {template: `to hey
  print "hey
___
hey`, answer: "end", expect: "hey",
   hint: "What closes a procedure?",
   explain: `<code>end</code> finishes the definition; then <code>hey</code> calls it.`}),
WR(`Define a procedure called <code>twice</code> that prints <code>go</code> two times (two lines). It will then be called for you.`,
  {starter: "", after: "twice", expect: "go\ngo", solution: `to twice\n  print "go\n  print "go\nend`,
   hint: "to twice, two print instructions, end.",
   explain: `Two prints inside <code>to twice ... end</code>. The checker calls <code>twice</code> afterwards.`}),
]});
