S({
id: 27,
title: "Counting things: frequency tables",
tagline: "How many of each? One of the most useful questions in all of programming",
blocks: [
P(`"How many of each?" is the question behind a startling share of real software. Which word shows up most in a book? Which letter is commonest in a language? How many votes did each candidate get? The answer is always a <strong>frequency table</strong>: for each distinct thing, a count. You already own all the tools to build one. In this lesson we will put the property lists from the last lesson to their best use.`),
P(`The plan is simple. Keep a cabinet of counts, with the thing you're counting as the label. Each time you see a thing, look up its count, add one, and file it back. The first time you see a thing it has no count yet, so you start it at 1.`),
L(`to tally :cabinet :item
  if emptyp gprop :cabinet :item [pprop :cabinet :item 1 stop]
  pprop :cabinet :item (gprop :cabinet :item) + 1
end

tally "votes "ann
tally "votes "bob
tally "votes "ann
print gprop "votes "ann
print gprop "votes "bob`, {expect: "2\n1"}),
P(`Read <code>tally</code> as a sentence: "If there is no count yet, file a 1 and stop; otherwise file the old count plus one." A fresh label returns the empty list from <code>gprop</code>, which is how we detect "never seen". Two votes for Ann, one for Bob.`),
P(`<strong>Python</strong> has the pattern so deeply baked in that its standard library gives you a ready-made counter. But a beginner should see the manual version first, which uses a dictionary, and the <code>get</code> method's default value does the "never seen" check:`),
PY(`votes = {}
for name in ["ann", "bob", "ann"]:
    votes[name] = votes.get(name, 0) + 1
print(votes)             # {'ann': 2, 'bob': 1}

# the standard-library shortcut:
from collections import Counter
print(Counter(["ann", "bob", "ann"]))   # Counter({'ann': 2, 'bob': 1})`),
P(`<strong>Raku</strong> goes one step further: a <code>Bag</code> is a collection whose whole purpose is counting, and a <code>.Bag</code> method turns any list into one. This is a lovely idea; the data type <em>is</em> the frequency table.`),
RK(`my %votes;
%votes{$_}++ for <ann bob ann>;
say %votes;                  # {ann => 2, bob => 1}

say <ann bob ann>.Bag;       # Bag(ann(2) bob)`),
P(`Python's <code>Counter</code> and Raku's <code>Bag</code> are better tools than anything in Logo for this job, and I'd use them. The reason to build it by hand in Logo first is that you can see every moving part: look up, add one, put back. Those moving parts are what <code>Counter</code> and <code>Bag</code> are doing for you.`),
P(`Now count the words in a sentence. We loop over the words and tally each into a cabinet named for the occasion:`),
L(`to count.words :cabinet :text
  foreach :text [tally :cabinet ?]
end

count.words "wc [the cat and the dog and the bird]
print gprop "wc "the
print gprop "wc "and
print gprop "wc "cat`, {expect: "3\n2\n1"}),
P(`<code>the</code> appears three times, <code>and</code> twice, <code>cat</code> once. Notice how little code it took: a loop and the tally procedure from before. Small, named pieces compose, and you never had to stare at one large, intimidating function.`),
P(`What about seeing the whole table at once? <code>plist</code> lists every label together with its value, as one flat list of alternating labels and values:`),
L(`show plist "wc`, {expect: "[bird 1 dog 1 and 2 cat 1 the 3]"}),
P(`Read it in pairs: bird 1, dog 1, and 2, cat 1, the 3. The order is the order Logo happens to keep them in (the newest label first, here), which is not alphabetical and is not something to rely on. If order matters to you, sort or choose it yourself.`),
PY(`from collections import Counter
c = Counter("the cat and the dog and the bird".split())
print(c)                 # Counter({'the': 3, 'and': 2, 'cat': 1, 'dog': 1, 'bird': 1})
print(c.most_common(2))  # [('the', 3), ('and', 2)]`),
RK(`my $bag = "the cat and the dog and the bird".words.Bag;
say $bag;                    # Bag(and(2) bird cat dog the(3))
say $bag.sort(-*.value).head(2);   # (the => 3 and => 2)`),
P(`And there is the thing Python and Raku give you for free: <code>most_common</code> and a sort by count. In Logo you'd have to write that yourself. It's a good exercise; you will meet it in the exercises at the end.`),
P(`Counting letters is the same job, with one trick: a word in Logo is already a list of letters if you walk it with <code>first</code> and <code>butfirst</code>. A recursive procedure that tallies every letter of a word looks like this:`),
L(`to count.letters :cabinet :w
  if emptyp :w [stop]
  tally :cabinet first :w
  count.letters :cabinet butfirst :w
end

count.letters "letters "banana
print gprop "letters "a
print gprop "letters "n
print gprop "letters "b`, {expect: "3\n2\n1"}),
P(`The base case is the empty word. Otherwise tally the first letter and recurse on the rest. Three <code>a</code>s, two <code>n</code>s, one <code>b</code>: the word "banana" in numbers. This is exactly the sort of program that codebreakers use to attack simple ciphers: in English, <code>e</code> is the commonest letter, so the commonest letter in a message is probably <code>e</code> in disguise. A frequency table is a code-breaker's first tool.`),
PY(`from collections import Counter
print(Counter("banana"))     # Counter({'a': 3, 'n': 2, 'b': 1})`),
RK(`say "banana".comb.Bag;     # Bag(a(3) b n(2))`),
P(`Both of them are one line, and both are wonderful. But here's my argument for the Logo version in a beginner's course: when you've written <code>tally</code> yourself, "Counter" is no longer magic. You know what's inside it.`),
N(`<strong>Remember:</strong> <code>gprop</code> returns the empty list for a label that has never been filed. That is what makes "have I seen this before?" a one-line test with <code>emptyp</code>.`),
],
ex: [
MC(`What does <code>gprop "votes "zed</code> output if nobody has ever filed anything under <code>zed</code>?`, ["0", "An error", "The empty list", "The word zed"], 2,
  `A missing label gives the empty list, which is how <code>tally</code> knows it has never seen it.`),
MC(`In a frequency table of the letters of "banana", how many <code>a</code>s are there?`, ["1", "2", "3", "6"], 2,
  `b-a-n-a-n-a has three <code>a</code>s.`),
PR(`What does this print? Type the output exactly.`,
  {before: `to tally :c :i\n  if emptyp gprop :c :i [pprop :c :i 1 stop]\n  pprop :c :i (gprop :c :i) + 1\nend`, code: `foreach [x y x x] [tally "k ?]\nprint gprop "k "x\nprint gprop "k "y`, answer: "3\n1",
   hint: "How many times does each letter occur in [x y x x]?",
   explain: `<code>x</code> occurs three times and <code>y</code> once.`}),
FI(`Fill in the blank (the case where the label has never been seen) so the first tally files a <code>1</code>.`,
  {template: `to tally :c :i\n  if ___ gprop :c :i [pprop :c :i 1 stop]\n  pprop :c :i (gprop :c :i) + 1\nend\ntally "k "a\ntally "k "a\nprint gprop "k "a`, answer: "emptyp", expect: "2",
   hint: "A missing label comes back as the empty list. Which predicate tests for that?",
   explain: `<code>emptyp gprop :c :i</code> is true when the label has no count yet.`}),
WR(`Write a procedure <code>count.vowels :cabinet :w</code> that tallies every vowel (a, e, i, o, u) in a word into the cabinet and ignores every other letter. Use the <code>tally</code> procedure, which is already defined.`,
  {before: `to tally :c :i\n  if emptyp gprop :c :i [pprop :c :i 1 stop]\n  pprop :c :i (gprop :c :i) + 1\nend`, starter: "to count.vowels :cabinet :w\n  \nend", after: "count.vowels \"vv \"education\nprint gprop \"vv \"a\nprint gprop \"vv \"o\nshow gprop \"vv \"z", expect: "1\n1\n[]",
   solution: "to count.vowels :cabinet :w\n  if emptyp :w [stop]\n  if memberp first :w [a e i o u] [tally :cabinet first :w]\n  count.vowels :cabinet butfirst :w\nend",
   hint: "Recurse over the word. Tally the first letter only if memberp says it is in [a e i o u].",
   explain: `Base case: empty word. Otherwise, tally the first letter if it is a vowel, then recurse on the rest.`}),
]});
