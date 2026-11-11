S({
id: 16,
title: "Lists: building them",
tagline: "fput, lput, sentence and list: four ways to put things together, and why they are not the same",
blocks: [
P(`You met lists in lesson 2 as things in square brackets. Now we are going to <em>build</em> them. Lists are Logo's workhorse data type, and the whole language was designed around them. (The name Logo comes from the Greek <em>logos</em>, "word", and its ancestor is Lisp, which stands for List Processing. You can feel the family resemblance.)`),
P(`There are four building tools to learn, and the interesting part is learning which one to reach for. Start with the two that add a single thing: <code>fput</code> puts a thing at the <em>front</em>, <code>lput</code> puts it at the <em>last</em> position.`),
L(`make "line [b c]
show fput "a :line
show lput "d :line
show :line`, {"expect":"[a b c]\n[b c d]\n[b c]"}),
P(`The last line is the surprise for many beginners: <code>:line</code> is unchanged. <code>fput</code> and <code>lput</code> do not alter the original list. They give you a <em>new</em> list as their answer, the way <code>sum 2 3</code> gives you 5 without changing 2 or 3. If you want to keep the new list, give it a name with <code>make</code>.`),
L(`make "line fput "a :line
show :line`, {"expect":"[a b c]"}),
P(`In <strong>Python</strong>, lists are <em>mutable</em>: <code>append</code> and <code>insert</code> change the list in place and return nothing. That is efficient, but it is a classic source of bugs when two names point at the same list, and the poor learner has no idea why a list changed behind their back. Python also has a non-mutating style, using <code>+</code>.`),
PY(`line = ["b", "c"]
line.insert(0, "a")      # changes line in place
line.append("d")         # changes line in place
print(line)              # ['a', 'b', 'c', 'd']

new = ["x"] + line       # builds a new list`),
P(`<strong>Raku</strong> offers the same pair: <code>unshift</code> and <code>push</code> change an array in place, and when you want a fresh list you build one with the comma.`),
RK(`my @line = "b", "c";
@line.unshift("a");        # in place, at the front
@line.push("d");           # in place, at the end
say @line;                 # [a b c d]

my @new = "x", |@line;     # a fresh list`),
P(`My view: the "returns a new list" behaviour of Logo is the safer default for a beginner, because nothing changes behind your back. The in-place behaviour of Python and Raku is faster, and you will want it eventually. But "functions give back answers and leave their inputs alone" is a habit worth having first.<sup>[1]</sup>`),
P(`Now the two that join <em>many</em> things. <code>sentence</code> (or <code>se</code>) glues lists together into one flat list. <code>list</code> collects its inputs as separate members, without flattening.`),
L(`show sentence [a b] [c d]
show list [a b] [c d]
show sentence "a "b
show list "a "b`, {"expect":"[a b c d]\n[[a b] [c d]]\n[a b]\n[a b]"}),
P(`Look at the first two lines, because this is the single most common point of confusion in Logo. Given two lists, <code>sentence</code> pours them into one list of four words, but <code>list</code> makes a list of <em>two</em> lists. One flattens, the other nests. You can tell by counting.`),
L(`print count sentence [a b] [c d]
print count list [a b] [c d]`, {"expect":"4\n2"}),
P(`<strong>Python</strong> draws exactly the same distinction, using different tools. <code>+</code> (or <code>extend</code>) flattens; putting lists inside a bracket nests.`),
PY(`a, b = ["a", "b"], ["c", "d"]
print(a + b)         # ['a', 'b', 'c', 'd']   like sentence
print([a, b])        # [['a', 'b'], ['c', 'd']]   like list
print(len(a + b), len([a, b]))   # 4 2`),
RK(`my @a = "a", "b";
my @b = "c", "d";
say (|@a, |@b);          # (a b c d)   like sentence
say (@a, @b);            # ([a b] [c d])   like list
say (|@a, |@b).elems, (@a, @b).elems;   # 42`),
P(`Raku's <code>|</code> (the "slip" prefix) is what flattens a list into its surroundings; without it the arrays stay as members. Same idea, one more symbol to learn. In Logo the <em>name</em> of the tool says which one you are getting, and I count that as a point for teaching. Noice.`),
P(`<code>sentence</code> also accepts words, which is handy for building messages. And when you want more than two inputs you wrap the call in parentheses. Remember lesson 3? Same rule.`),
L(`show (sentence "my "name "is "Ana)
show (list 1 2 3)`, {"expect":"[my name is Ana]\n[1 2 3]"}),
P(`One more thing worth knowing: a list can grow inside a procedure. Here is one that builds a list of the first <code>:n</code> squares by adding each new square to the end.`),
L(`to squares :n
  local "result
  make "result []
  for [i 1 :n] [make "result lput :i * :i :result]
  output :result
end

show squares 5`, {"expect":"[1 4 9 16 25]"}),
P(`Start with the empty list <code>[]</code>, then <code>lput</code> each new value on the end and name the result again. This pattern, "start empty, add as you go", is the heart of nearly every list-building program you will ever write.`),
PY(`def squares(n):
    result = []
    for i in range(1, n + 1):
        result.append(i * i)
    return result

# idiomatic Python would usually be a comprehension:
squares2 = lambda n: [i * i for i in range(1, n + 1)]`),
RK(`sub squares($n) { (1..$n).map(* ** 2).list }
say squares(5);    # (1 4 9 16 25)`),
P(`Python's comprehension and Raku's <code>map</code> are shorter, and professional programmers prefer them. They also hide the "start empty, add as you go" mechanism that Logo shows you. For learning, I'd rather you wrote the loop out a few times before you reach for the shorthand.`),
],
fn: [
 "The old Lisp programmers had a phrase for the in-place habit: \"spooky action at a distance\". It is not a compliment."
],
ex: [
MC(`After <code>make "a [1 2]</code> and then <code>print fput 0 :a</code>, what does <code>print :a</code> show?`, ["0 1 2","1 2","[0 1 2]","0"], 1, `<code>fput</code> returns a new list and leaves <code>:a</code> alone. To keep the new list you would write <code>make "a fput 0 :a</code>.`),
MC(`Which command gives <code>[[a b] [c d]]</code> from the inputs <code>[a b]</code> and <code>[c d]</code>?`, ["<code>sentence</code>","<code>list</code>","<code>fput</code>","<code>word</code>"], 1, `<code>list</code> keeps each input as a separate member; <code>sentence</code> would flatten them to <code>[a b c d]</code>.`),
PR(`What does this print? Type the output exactly.`,
  {code: `show sentence [a] [b c]
show list [a] [b c]
show lput "z [x y]`,
     answer: `[a b c]
[[a] [b c]]
[x y z]`,
     hint: `sentence flattens. list nests. lput adds at the end.`,
     explain: `First flattened, second nested, third a new list with <code>z</code> on the end.`}),
FI(`Fill in the blank so Logo shows <code>[1 2 3 4]</code>.`,
  {template: `show ___ 4 [1 2 3]`,
     answer: `lput`,
     expect: `[1 2 3 4]`,
     hint: `Add a single item at the end.`,
     explain: `<code>lput</code> takes the new item first and the list second, and adds the item at the end.`}),
WR(`Write a procedure <code>evens :n</code> that outputs a list of the even numbers from 2 up to <code>:n</code>. For example <code>evens 8</code> is <code>[2 4 6 8]</code>.`,
  {starter: `to evens :n
  
end`,
     after: `show evens 8
show evens 5`,
     expect: `[2 4 6 8]
[2 4]`,
     solution: `to evens :n
  local "result
  make "result []
  for [i 2 :n 2] [make "result lput :i :result]
  output :result
end`,
     hint: `Start with an empty list; use for with a step of 2; lput each value.`,
     explain: `<code>for [i 2 :n 2]</code> counts 2, 4, 6... up to <code>:n</code>, and <code>lput</code> adds each on the end.`}),
]});
