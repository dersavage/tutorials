S({
id: 26,
title: "Property lists",
tagline: "A key-value store that has been hiding inside UCBLogo since the beginning",
blocks: [
P(`Sooner or later every program needs to remember facts about things. Ann is 31. Bob is 27. There are four apples on the shelf and nine pears. You could keep two parallel lists, one of names and one of numbers, and hunt through both with <code>item</code> and <code>member</code>. I have seen people do exactly that, and I have seen the bug reports that follow when somebody sorts one list and forgets the other.`),
P(`UCBLogo has a better answer, and it has had it for decades: the <strong>property list</strong>. Think of it as a tiny named filing cabinet. You give the cabinet a name, you file a fact under a label, and you ask for it back by the same label. Three words are enough to get going: <code>pprop</code> (put a property), <code>gprop</code> (get a property) and <code>plist</code> (show the whole cabinet).`),
L(`pprop "ages "ann 31
pprop "ages "bob 27
print gprop "ages "ann
print gprop "ages "bob`, {expect: "31\n27"}),
P(`Read the first line left to right. <code>pprop</code> takes three inputs: the name of the cabinet (<code>"ages</code>), the label (<code>"ann</code>), and the value (<code>31</code>). Nothing is printed, because filing a fact is a command, not a question. Then <code>gprop</code> takes two inputs, the cabinet and the label, and <em>outputs</em> the value, so <code>print</code> can show it.`),
P(`Notice what we did not have to do: we never created the cabinet. The first <code>pprop</code> brought <code>"ages</code> into existence. That is very Logo. It trusts you.`),
P(`<strong>In Python</strong> the same idea is the dictionary, and it is one of the best-designed things in the language. You create it with braces and look things up with square brackets:`),
PY(`ages = {"ann": 31, "bob": 27}
print(ages["ann"])   # 31
print(ages["bob"])   # 27`),
P(`Python's dict is a <em>value</em>: you can pass it around, copy it, return it from a function. Logo's property list is not a value. It lives in a global namespace by name, and you can only talk about it with <code>pprop</code> and <code>gprop</code>. That is the one honest criticism of the Logo version, and I will come back to it.`),
P(`<strong>In Raku</strong> the equivalent is the <code>Hash</code>, and the sigil <code>%</code> announces that you have one. The angle brackets are a neat shortcut for quoted keys:`),
RK(`my %ages = ann => 31, bob => 27;
say %ages<ann>;   # 31
say %ages<bob>;   # 27`),
P(`Both languages give you a collection <em>object</em>. Logo gives you a collection <em>by name</em>. For a beginner that is actually easier to hold in the head, because there is nothing to construct and nothing to pass. You say what you know and you ask what you want.`),
P(`Now the interesting questions. What happens when you ask for a label that was never filed, and what happens when you file the same label twice?`),
L(`pprop "ages "ann 32
print gprop "ages "ann
print gprop "ages "zed
print emptyp gprop "ages "zed`, {expect: "32\n\ntrue"}),
P(`Filing <code>"ann</code> a second time does not add a second entry. It <strong>replaces</strong> the old value, which is exactly what you want when Ann has a birthday. And asking for <code>"zed</code>, who was never filed, does not crash. You get back the empty list, which <code>print</code> shows as a blank line. That is why the last line prints <code>true</code>: <code>emptyp</code> is how you test for "not there".`),
P(`I want you to notice the design choice here. Logo could have raised an error for a missing label. It chose to return an empty list instead. For a quick program that is friendly. For a large one it can hide typos, because a misspelled label looks exactly like a missing one. Keep that in the back of your mind.`),
P(`<strong>Python</strong> makes the opposite choice by default. Square brackets on a missing key raise a <code>KeyError</code>, and if you want the forgiving behaviour you ask for it with <code>.get</code>:`),
PY(`ages = {"ann": 31, "bob": 27}
ages["ann"] = 32            # replaces the old value
print(ages["ann"])          # 32
print(ages.get("zed"))      # None  (ages["zed"] would raise KeyError)`),
P(`I think Python's default is better for real software, because a missing key is usually a bug and Python tells you so loudly. I think Logo's default is better for a ten-year-old, because the program keeps running while she works out what she did wrong. Neither is wrong. They are answers to different questions.`),
P(`<strong>Raku</strong> sits in between. A missing key gives you an undefined value rather than an exception, and you can test for it with <code>:exists</code>:`),
RK(`my %ages = ann => 31, bob => 27;
%ages<ann> = 32;
say %ages<ann>;            # 32
say %ages<zed>:exists;     # False`),
P(`To take a fact back out of a property list there is <code>remprop</code>, and to see everything in one go there is <code>plist</code>. Let's build a small shelf inventory and use all of it:`),
L(`pprop "shelf "apple 4
pprop "shelf "pear 9
pprop "shelf "plum 2
remprop "shelf "plum
print emptyp gprop "shelf "plum
print gprop "shelf "pear`, {expect: "true\n9"}),
P(`After <code>remprop</code> the plum is gone, so asking for it gives the empty list again. <code>plist "shelf</code> would give you every label and value as one flat list, alternating label, value, label, value. The order of that list is not something to build a program on, so I keep my code to <code>gprop</code> and treat <code>plist</code> as a debugging window.`),
P(`<strong>Python</strong> removes with <code>del</code> or <code>pop</code>, and hands you the whole thing as <code>.items()</code>:`),
PY(`shelf = {"apple": 4, "pear": 9, "plum": 2}
del shelf["plum"]
print("plum" in shelf)    # False
print(shelf["pear"])      # 9`),
P(`<strong>Raku</strong> has a delete adverb that reads almost like English:`),
RK(`my %shelf = apple => 4, pear => 9, plum => 2;
%shelf<plum>:delete;
say %shelf<plum>:exists;   # False
say %shelf<pear>;          # 9`),
P(`Now let's put property lists to work inside procedures, because that is where they earn their keep. A common job is "change a number by one". Here is a procedure that adds to a stock count, and a second that asks about it:`),
L(`to restock :item :n
  pprop "shelf :item (:n + gprop "shelf :item)
end

to howmany :item
  output ifelse emptyp gprop "shelf :item [0] [gprop "shelf :item]
end

restock "apple 6
print howmany "apple
print howmany "kiwi`, {expect: "10\n0"}),
P(`<code>howmany</code> is a tiny wrapper that turns the empty list into a <code>0</code>. I write that wrapper every time. It is the single most useful habit with property lists: put the "what if it isn't there" decision in one place, give it a good name, and use that name everywhere else.`),
P(`And here is the criticism I promised. <code>"shelf</code> is a global name. Two different programs that both choose <code>"shelf</code> will happily trample each other's facts. Python and Raku don't have that problem, because their dictionaries are values that live in variables with local scope. When you are teaching, I would still start with property lists. A beginner can model a real database in an afternoon with three commands. Once the habit of "a fact has a label" is in place, moving to Python's dict or Raku's Hash is a matter of syntax.`),
],
ex: [
MC(`What does <code>gprop</code> output when the label was never filed?`,
  ["It stops the program with an error", "The number 0", "The empty list", "The word <code>nothing</code>"], 2,
  `<code>gprop</code> outputs the empty list when there is nothing under that label. That is why <code>emptyp gprop ...</code> is the usual "is it there?" test.`),
MC(`You run <code>pprop "pet "rex "dog</code> and later <code>pprop "pet "rex "wolf</code>. What does <code>gprop "pet "rex</code> output?`,
  ["<code>dog</code>", "<code>wolf</code>", "<code>dog wolf</code>", "An error, because the label is already used"], 1,
  `Filing the same label again replaces the old value. A property list holds one value per label.`),
PR(`What does Logo print here? Type the output exactly, one line per line.`,
  {code: `pprop "pet "rex "dog
pprop "pet "tom "cat
pprop "pet "rex "wolf
print gprop "pet "rex
print gprop "pet "tom
remprop "pet "tom
print emptyp gprop "pet "tom`, answer: "wolf\ncat\ntrue",
   hint: "rex is filed twice, and tom is removed before the last line.",
   explain: `<code>rex</code> was replaced by <code>wolf</code>. <code>tom</code> is <code>cat</code> until <code>remprop</code> removes it, after which <code>gprop</code> gives the empty list, so <code>emptyp</code> says <code>true</code>.`}),
FI(`The pear count should go up by one. Fill in the blank so Logo prints <code>10</code>.`,
  {before: `pprop "stock "pear 9`, template: `pprop "stock "pear (gprop "stock "pear) ___ 1
print gprop "stock "pear`, answer: "+", expect: "10",
   hint: "You want the old value plus one.",
   explain: `Reading the old value with <code>gprop</code>, adding one, and filing it back with <code>pprop</code> is the standard update pattern.`}),
WR(`Write a procedure <code>addpoint</code> that takes a name and adds 1 to that person's score, which is stored in the property list <code>"score</code>.`,
  {before: `pprop "score "ann 10`, starter: `to addpoint :who

end`,
   after: `addpoint "ann
addpoint "ann
print gprop "score "ann`, expect: "12",
   solution: `to addpoint :who
  pprop "score :who (gprop "score :who) + 1
end`,
   hint: "Read the old score with gprop, add 1, and write it back with pprop under the same label.",
   explain: `The same read, add, write pattern as before, wrapped in a procedure so you can call it again and again.`}),
]});
