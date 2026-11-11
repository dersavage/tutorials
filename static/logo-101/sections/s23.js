S({
id: 23,
title: "foreach and map",
tagline: "Do something to every member of a list, without writing the loop yourself",
blocks: [
P(`By now you have written a few loops that walk through a list: a recursive procedure that peels off the first item each time, or a <code>for</code> loop that counts positions. They work, but they are fiddly. Most of the time what you actually mean is far simpler: "do this thing to every member". Logo has a command for exactly that sentence, and it is called <code>foreach</code>.`),
L(`foreach [red green blue] [print ?]`, {"expect":"red\ngreen\nblue"}),
P(`<code>foreach</code> takes a list of data and a list of instructions. It runs the instructions once for each member, and the question mark <code>?</code> stands for "the member I'm up to right now". No counter, no <code>first</code>, no <code>butfirst</code>, no base case. You said what you wanted. Noice.`),
P(`<strong>Python</strong> has the same shape, and the same "the thing I'm up to" idea, except you pick the name of the stand-in yourself.`),
PY(`for colour in ["red", "green", "blue"]:
    print(colour)`),
P(`That's better than Logo in one respect: <code>colour</code> is a meaningful name, where a question mark says nothing. In a long loop body, a good name beats <code>?</code> every time. In Logo, the question mark wins on brevity and loses on clarity; it is fine for a one-liner and a poor habit for anything bigger.`),
P(`<strong>Raku</strong> has the <code>for</code> loop and a topic variable <code>$_</code> that works much like Logo's <code>?</code>. If you don't name the stand-in, <code>$_</code> is used. Raku's designers and Logo's designers arrived at the same shortcut.`),
RK(`for <red green blue> {
    say $_;
}
# or, naming the stand-in:
for <red green blue> -> $colour { say $colour }`),
P(`Now a refinement that changes everything. <code>foreach</code> <em>does</em> things. Often you want a new list instead: a version of the old list with each member transformed. That is <code>map</code>. It takes a recipe and a list, and <em>answers</em> with a new list.`),
L(`show map [? * 2] [1 2 3 4]
show map [word ? "s] [cat dog bird]
show map "uppercase [a b c]`, {"expect":"[2 4 6 8]\n[cats dogs birds]\n[A B C]"}),
P(`Notice the three different ways to say what to do. In the first two, the recipe is a list of instructions where <code>?</code> is the current member: double it, add an <code>s</code> to it. In the third, I gave the <em>name</em> of a procedure in quotes: <code>"uppercase</code>. Logo calls <code>uppercase</code> on each member for me. Both styles are common.`),
P(`Pause on what has just happened. In the recipe <code>[? * 2]</code>, the instructions are written as a <em>list</em>, which is just data, and handed to <code>map</code> like any other input. This is why I said earlier that Logo treats programs as data. It is a deep idea, and you are now using it without having had to learn a single new rule.<sup>[1]</sup>`),
P(`<strong>Python</strong> gives you two ways to map: the built-in <code>map</code> function, and a list comprehension. The comprehension is the one people actually use.`),
PY(`print([n * 2 for n in [1, 2, 3, 4]])              # [2, 4, 6, 8]
print([w + "s" for w in ["cat", "dog", "bird"]])   # ['cats', 'dogs', 'birds']
print([c.upper() for c in "abc"])                  # ['A', 'B', 'C']

# the built-in form
print(list(map(str.upper, "abc")))`),
P(`Python's comprehension is a nice piece of design, I will say that plainly. It reads inside out, and takes a minute to get used to, but then it clicks. I'd still argue Logo's <code>map [? * 2] [1 2 3 4]</code>, "map this recipe over that list", is the more direct statement of the idea.`),
P(`<strong>Raku</strong> makes <code>map</code> a method and has the "whatever star", which creates a one-argument recipe from an expression with <code>*</code> as the hole.`),
RK(`say (1, 2, 3, 4).map(* * 2);          # (2 4 6 8)
say <cat dog bird>.map(* ~ "s");        # (cats dogs birds)
say <a b c>.map(*.uc);                  # (A B C)`),
P(`That star is Raku's <code>?</code>. It's compact and powerful. It also takes a while to read fluently when you meet <code>* * 2</code>: a star that's a hole, then a multiplication, then a literal two. LOL.`),
P(`You can also use <code>map</code> with <em>your own</em> procedures, which is where it gets powerful. Here is a procedure that adds an exclamation mark to a word, and then a map over a list of words.`),
L(`to shout :w
  output word :w "!
end

show map "shout [hi there]
show map [count ?] [apple fig banana]`, {"expect":"[hi! there!]\n[5 3 6]"}),
P(`First we wrote a tiny procedure for one word, then <code>map</code> applied it to every word in the list. That is the way to think about <code>map</code>: <em>write the single-item version first, then let map do the rest</em>. Small procedures that do one job, plus a command to apply them to a whole list, scale to nearly any data-processing task.`),
PY(`def shout(w):
    return w + "!"

print([shout(w) for w in ["hi", "there"]])   # ['hi!', 'there!']
print([len(w) for w in ["apple", "fig", "banana"]])  # [5, 3, 6]`),
RK(`sub shout($w) { $w ~ "!" }
say <hi there>.map(&shout);                 # (hi! there!)
say <apple fig banana>.map(*.chars);        # (5 3 6)`),
P(`The Raku <code>&amp;shout</code> is the name of the procedure as a thing you can pass around, in the same way that Logo passes <code>"shout</code> as a quoted name. The idea is shared across all three languages; each one just spells the "here is a procedure, don't call it yet" gesture in its own way.`),
N(`<strong>foreach vs map.</strong> Use <code>foreach</code> when you want something <em>done</em> for each item (printing, say). Use <code>map</code> when you want a new <em>list of answers</em>. If you catch yourself building a list inside a <code>foreach</code> with <code>lput</code>, you probably wanted <code>map</code>. Nice little language, isn't it?`),
],
fn: [
 "If this sounds like Lisp, that is because it is. Logo kept the good part, the programs-are-lists part, and left the parentheses at the door."
],
ex: [
MC(`What does <code>show map [? * ?] [1 2 3]</code> print?`, ["[1 2 3]","[1 4 9]","[2 4 6]","[3 6 9]"], 1, `Each member is multiplied by itself: 1, 4, 9.`),
MC(`You want a <em>new list</em> containing the length of each word in a list of words. Which command?`, ["<code>foreach</code>","<code>map</code>","<code>repeat</code>","<code>stop</code>"], 1, `<code>map</code> answers with a new list. <code>foreach</code> only performs actions.`),
PR(`What does this print? Type the output exactly.`,
  {code: `show map [? + 10] [1 2 3]
foreach [a b] [print word ? ?]`,
     answer: `[11 12 13]
aa
bb`,
     hint: `word glues two pieces into one word.`,
     explain: `Ten added to each; then for <code>a</code> and <code>b</code> the member is doubled into a single word.`}),
FI(`Fill in the blank so Logo shows <code>[2 4 6]</code>.`,
  {template: `show map [? * ___] [1 2 3]`,
     answer: `2`,
     expect: `[2 4 6]`,
     hint: `What do you multiply by to double?`,
     explain: `Multiplying each member by 2 doubles it.`}),
WR(`Write a procedure <code>plural :words</code> that outputs a new list where each word in <code>:words</code> has an <code>s</code> added at the end. <code>plural [cat dog]</code> should be <code>[cats dogs]</code>.`,
  {starter: `to plural :words
  
end`,
     after: `show plural [cat dog]
show plural [book]`,
     expect: `[cats dogs]
[books]`,
     solution: `to plural :words
  output map [word ? "s] :words
end`,
     hint: `map with a recipe that glues an s onto each member.`,
     explain: `<code>map [word ? "s] :words</code> does it in one line.`}),
]});
