S({
id: 5,
title: "Asking questions: predicates",
tagline: "Commands that answer true or false",
blocks: [
P(`Programs make decisions, and decisions need questions with yes-or-no answers. In Logo, a command whose job is to answer such a question is called a <strong>predicate</strong>, and by convention its name ends in a <code>p</code>: <code>numberp</code>, <code>wordp</code>, <code>listp</code>, <code>emptyp</code>, <code>equalp</code>, <code>memberp</code>, <code>beforep</code>. (UCBLogo lets you write some of these with a trailing question mark too, but the <code>p</code> form is the traditional one, and the one I will use.)`),
P(`I love this convention. When you read <code>emptyp :list</code> you hear a question, and the answer is a plain <code>true</code> or <code>false</code>. No special boolean type needed: they are just two words. Let's ask some questions about the types you already met.`),
L(`print numberp 5
print numberp "hello
print wordp "hello
print listp [1 2]
print emptyp []`, {"expect":"true\nfalse\ntrue\ntrue\ntrue"}),
P(`Each line is a question, each output an answer. <code>numberp "hello</code> is <code>false</code> because <code>hello</code> is not a number. <code>wordp "hello</code> is <code>true</code>. Nothing surprising, which is the point.`),
P(`<strong>Python</strong> has the same idea but spells it differently. The type questions are <code>isinstance</code> calls, and "is this string a number?" is surprisingly awkward: <code>"5".isdigit()</code> is a method on strings, and it has no answer for decimals or negatives.`),
PY(`print(isinstance(5, int))        # True
print("hello".isalpha())         # True
print(isinstance([1, 2], list))  # True
print(len([]) == 0)              # True  (or: not [])`),
P(`Four questions, four different spellings. In Logo one naming convention covers them all, and you can guess the name of a predicate you have never seen. That predictability is a real pedagogical win, and nobody had to write a style guide for it.`),
P(`<strong>Raku</strong> is more regular: smartmatch <code>~~</code> asks "does this fit that type?", and it works for a surprising number of questions.`),
RK(`say 5 ~~ Int;          # True
say "hello" ~~ Str;     # True
say [1, 2] ~~ Array;    # True
say [].elems == 0;      # True`),
P(`Raku is elegant here, but <code>~~</code> is a very powerful operator that matches types, regexes, ranges and more. A beginner meets all of that at once. Logo's seven little <code>p</code> words are easier to learn one at a time.`),
P(`Now comparing. In Logo, <code>=</code> is an infix predicate, and <code>equalp</code> is the prefix twin. The comparison operators <code>&lt;</code>, <code>&gt;</code>, <code>&lt;=</code>, <code>&gt;=</code> and <code>&lt;&gt;</code> (not equal) tell the same story.`),
L(`print 3 = 3
print equalp 3 4
print 3 < 4
print 3 >= 4
print 3 <> 4
print equalp [1 2] [1 2]
print "abc = "abc`, {"expect":"true\nfalse\ntrue\nfalse\ntrue\ntrue\ntrue"}),
P(`Notice that the one equality operator works on numbers, words and even whole lists: <code>equalp [1 2] [1 2]</code> is <code>true</code>. One operator, no "is this the same object or just the same value" riddle.`),
P(`In <strong>Python</strong>, <code>==</code> compares values and works for lists too. The separate <code>is</code> operator checks identity, which is a classic beginner trap.`),
PY(`print(3 == 3)             # True
print(3 < 4, 3 >= 4)      # True False
print(3 != 4)             # True
print([1, 2] == [1, 2])   # True  (equal values)
print([1, 2] is [1, 2])   # False (two different objects)`),
P(`The last line is not an error. It is a reminder that Python programmers carry a mental model of "objects" that Logo programmers can ignore for a long time. I find the Logo approach more honest at 101 level.`),
RK(`say 3 == 3;               # True
say 3 < 4, " ", 3 >= 4;    # True False
say 3 != 4;                # True
say [1, 2] eqv [1, 2];     # True
say "abc" eq "abc";        # True`),
P(`Raku makes you choose the right equality: <code>==</code> for numbers, <code>eq</code> for strings, <code>eqv</code> for structures. Each is precise. Each is also another thing to learn before you can do anything useful.`),
P(`Two more predicates with real use. <code>beforep</code> tells you whether one word comes before another in alphabetical order, and <code>memberp</code> asks whether something is an item of a list (inputs go thing first, list second).`),
L(`print beforep "apple "banana
print beforep "zebra "ant
print memberp "b [a b c]
print memberp "z [a b c]`, {"expect":"true\nfalse\ntrue\nfalse"}),
P(`The second input of <code>memberp</code> is the list to search. It can also search a word for a letter. Both are very common in the word games we will write soon.`),
PY(`print("apple" < "banana")        # True
print("zebra" < "ant")           # False
print("b" in ["a", "b", "c"])    # True
print("z" in ["a", "b", "c"])    # False`),
P(`Python's <code>in</code> is neat and reads like English. Credit where due: it is nicer than <code>memberp</code>, and I wish I had it in Logo. The comparison of strings with <code>&lt;</code> is the same alphabetical idea as <code>beforep</code>.`),
RK(`say "apple" lt "banana";          # True
say "zebra" lt "ant";             # False
say "b" ∈ <a b c>;                # True
say "z" (elem) <a b c>;           # False`),
P(`Raku has the set-theory operator <code>∈</code> (and an ASCII twin, <code>(elem)</code>) and the string comparison <code>lt</code>. Powerful, and fun if you like mathematical notation. For a first look at "does this thing belong", <code>memberp</code> is plain and does the job.`),
P(`Predicates are the bridge to making decisions: once you can ask a question, you can make a program choose. But first we need a way to package instructions under a name of our own. So that is the next lesson.`),
],
fn: [],
ex: [
MC(`By Logo convention, a command whose name ends in <code>p</code> (like <code>emptyp</code>) usually...`, ["prints something","answers true or false","makes a variable","repeats instructions"], 1, `The <code>p</code> stands for predicate: the command answers <code>true</code> or <code>false</code>.`),
MC(`What does <code>print equalp [1 2] [1 2]</code> print?`, ["<code>false</code>, because they are different objects","<code>true</code>, because the contents are equal","<code>[1 2]</code>","An error"], 1, `<code>equalp</code> compares contents, even for lists. There is no object-identity trap to worry about.`),
PR(`What does Logo print? Type it exactly.`,
  {code: `print memberp "c [a b c]
print beforep "dog "cat
print 5 <> 5
print numberp "7`,
     answer: `true
false
false
true`,
     hint: `memberp: thing first, list second. beforep: alphabetical order.`,
     explain: `<code>c</code> is in the list; <code>dog</code> does not come before <code>cat</code>; 5 is not unequal to 5; and the word <code>7</code> is a number.`}),
FI(`Fill in the blank so Logo prints <code>true</code>.`,
  {template: `print ___ "apple "pear`,
     answer: `beforep`,
     expect: `true`,
     hint: `Which predicate checks alphabetical order?`,
     explain: `<code>apple</code> comes before <code>pear</code>, so <code>beforep "apple "pear</code> is <code>true</code>.`}),
WR(`Write Logo that prints <code>true</code> if 10 is greater than 7, and then prints whether <code>"x</code> is a member of the list <code>[a b c]</code>.`,
  {starter: ``,
     expect: `true
false`,
     solution: `print 10 > 7
print memberp "x [a b c]`,
     hint: `One comparison with >, one memberp.`,
     explain: `<code>10 > 7</code> is <code>true</code> and <code>x</code> is not in the list, so the second answer is <code>false</code>.`}),
]});
