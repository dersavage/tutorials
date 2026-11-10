S({
id: 17,
title: "Lists: searching and slicing",
tagline: "Is it in there? Which one is third? What if I turn it around?",
blocks: [
P(`Building a list is half the job. The other half is asking questions of it: is this thing in the list, what is the third item, how many are there, what does it look like backwards. UCBLogo gives you a compact toolkit for all of this, and in this lesson we will walk through it one question at a time.`),
P(`First question: <em>is it in there?</em> The predicate is <code>memberp</code>, and the <code>p</code> at the end tells you it answers true or false. You know the drill by now.`),
L(`print memberp "b [a b c]
print memberp "z [a b c]`, {"expect":"true\nfalse"}),
P(`Its close cousin <code>member</code> does something a little different, and more useful than it first looks: instead of true or false, it hands back <em>the rest of the list starting from the thing you found</em>. If the thing is not there, you get the empty list.`),
L(`show member "c [a b c d e]
show member "z [a b c d e]`, {"expect":"[c d e]\n[]"}),
P(`That is a surprisingly practical design. The answer is a "yes/no" (an empty list means no) <em>and</em> the position, all at once. We will use it later when we look things up.`),
P(`<strong>Python</strong> separates these two ideas. <code>in</code> asks the yes/no question, and <code>index</code> finds a position, and raises an error if the thing is missing, which is a rude way to answer "no".`),
PY(`letters = ["a", "b", "c", "d", "e"]
print("b" in letters)          # True
print("z" in letters)          # False
print(letters.index("c"))      # 2    (counting from 0!)
print(letters[letters.index("c"):])   # ['c', 'd', 'e']`),
P(`<strong>Raku</strong> offers the same yes/no with the "element of" operator, and a gentle way to find positions that gives a type-safe "nothing" rather than an exception.`),
RK(`my @letters = <a b c d e>;
say "b" (elem) @letters;        # True
say "z" (elem) @letters;        # False
say @letters.first("c", :k);    # 2   (the index; counting from 0)
say @letters.first(* eq "z");   # Nil`),
P(`I like <code>in</code> in Python; it reads naturally. Raku's <code>(elem)</code> uses the mathematical set symbol. Both of them make you do a bit more work to get "the rest of the list from here", which in Logo is one word.`),
P(`Second question: <em>what is in position n?</em> That is <code>item</code>. The first thing is position <em>one</em>, as a person would count.`),
L(`show item 1 [red green blue]
show item 3 [red green blue]
show count [red green blue]
show last [red green blue]`, {"expect":"red\nblue\n3\nblue"}),
P(`<code>item 1</code> is the same as <code>first</code>, and <code>item 3</code> on a three-item list is the same as <code>last</code>; use whichever says what you mean. <code>count</code> tells you how many members there are. Asking for an item beyond the end is an error, and that is correct: there is nothing there.`),
PY(`colours = ["red", "green", "blue"]
print(colours[0])    # red     (zero-based)
print(colours[2])    # blue
print(len(colours))  # 3
print(colours[-1])   # blue    (negative counts from the end: neat!)`),
RK(`my @colours = <red green blue>;
say @colours[0];       # red
say @colours[2];       # blue
say @colours.elems;    # 3
say @colours[*-1];     # blue  (last element)`),
P(`Python's negative index, and Raku's <code>*-1</code> for "from the end", are good tools that I use all the time. The thing I want you to notice is the position numbering: Python and Raku both begin at 0, so "the third colour" is <code>[2]</code>. That is a convention that serves machines and costs beginners. Logo's <code>item 3</code> is the third item. Teaching 0-based counting is a whole lesson of its own in the other languages, and it is entirely unnecessary here. LOL, and yes, I know I said this already.`),
P(`Third question: <em>can I turn it around, or take some out?</em> <code>reverse</code> flips a list. <code>remove</code> takes out every copy of something. <code>iseq</code> makes a list of whole numbers, which is a convenient way to get test data.`),
L(`show reverse [a b c d]
show remove "b [a b c b]
show iseq 3 7
show filter [? > 4] iseq 1 8`, {"expect":"[d c b a]\n[a c]\n[3 4 5 6 7]\n[5 6 7 8]"}),
P(`The last line anticipates a later lesson: <code>filter</code> keeps only the members for which the test is true. The question mark stands for "the current member". We will meet it properly when we get to higher-order commands, but you may enjoy the foreshadowing.`),
PY(`xs = ["a", "b", "c", "d"]
print(xs[::-1])                          # reversed copy
print([x for x in ["a","b","c","b"] if x != "b"])   # remove b
print(list(range(3, 8)))                 # [3, 4, 5, 6, 7]  (end is exclusive)
print([n for n in range(1, 9) if n > 4]) # [5, 6, 7, 8]`),
RK(`say <a b c d>.reverse;                    # (d c b a)
say <a b c b>.grep(* ne "b");              # (a c)
say (3..7).list;                           # (3 4 5 6 7)
say (1..8).grep(* > 4);                    # (5 6 7 8)`),
P(`Python's <code>[::-1]</code> is an extended slice, which is wonderfully concise and a dreadful thing to try to read aloud. Raku's methods read left to right and are close to Logo's spirit. Python's comprehension handles <code>filter</code> and <code>remove</code> alike, with a condition at the end.`),
P(`Put the toolkit to work. This procedure asks whether a letter is a "vowel": it just checks membership in a list of five letters. Noice.`),
L(`to vowelp :letter
  output memberp :letter [a e i o u]
end

print vowelp "e
print vowelp "k`, {"expect":"true\nfalse"}),
N(`<strong>Don't mix up</strong> <code>member</code> (gives the rest of the list) and <code>memberp</code> (gives true/false). In an <code>if</code>, use <code>memberp</code>. Nice little language, isn't it?`),
],
fn: [],
ex: [
MC(`What does <code>show member "c [a b c d]</code> print?`, ["true","c","[c d]","3"], 2, `<code>member</code> returns the list from the found thing onward: <code>[c d]</code>. <code>memberp</code> would give <code>true</code>.`),
MC(`In Logo, which command gives the <em>third</em> thing in a list?`, ["<code>item 2</code>","<code>item 3</code>","<code>item 0</code>","<code>third</code>"], 1, `Logo counts from 1, so <code>item 3</code> is the third thing. (Python and Raku would use <code>[2]</code>.)`),
PR(`What does this print? Type the output exactly.`,
  {code: `show reverse [1 2 3]
show item 2 [x y z]
show remove 2 [1 2 3 2]`,
     answer: `[3 2 1]
y
[1 3]`,
     hint: `remove takes out every copy.`,
     explain: `Reversed, the second item (<code>y</code>), and both 2s removed.`}),
FI(`Fill in the blank so Logo prints <code>blue</code>.`,
  {template: `print item ___ [red green blue]`,
     answer: `3`,
     expect: `blue`,
     hint: `Logo counts from one.`,
     explain: `<code>blue</code> is the third item.`}),
WR(`Write a procedure <code>penultimate :list</code> that outputs the second-to-last item. For <code>[a b c d]</code> it should output <code>c</code>.`,
  {starter: `to penultimate :list
  
end`,
     after: `print penultimate [a b c d]
print penultimate [1 2]`,
     expect: `c
1`,
     solution: `to penultimate :list
  output last butlast :list
end`,
     hint: `Remove the last item first, then take the last of what remains. (butlast removes the last item.)`,
     explain: `<code>butlast</code> drops the last item, so the last of that is the second-to-last of the original. Or: <code>item (count :list) - 1 :list</code>.`}),
]});
