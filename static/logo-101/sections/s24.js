S({
id: 24,
title: "filter, reduce and apply",
tagline: "Keep some, boil many down to one, and call a procedure on a list of inputs",
blocks: [
P(`<code>map</code> gives you a list the <em>same size</em> as the one you started with. Two close relatives change the size. <code>filter</code> gives back a <em>shorter</em> list, keeping only the members that pass a test. <code>reduce</code> boils the whole list down to a <em>single</em> answer, like a total. Together with <code>map</code> they make the trio that does most of the everyday data-wrangling in real programs.`),
L(`show filter [? > 2] [1 2 3 4 5]
show filter "numberp [a 1 b 2]
print count filter [? > 2] [1 2 3 4 5]`, {expect: "[3 4 5]\n[1 2]\n3"}),
P(`<code>filter</code> takes a test, which is a recipe that answers true or false for the current member, and a list. It keeps exactly the members for which the test is true. The second line uses the predicate <code>numberp</code> by name, as we did with <code>map</code>. The third counts how many members passed: "how many numbers are greater than 2?" is one line, with no loop in sight.`),
P(`<strong>Python</strong> filters with a comprehension and an <code>if</code> at the end (or the built-in <code>filter</code>, which almost nobody uses on purpose):`),
PY(`nums = [1, 2, 3, 4, 5]
print([n for n in nums if n > 2])                     # [3, 4, 5]
print([x for x in ["a", 1, "b", 2] if isinstance(x, int)])  # [1, 2]
print(len([n for n in nums if n > 2]))                # 3`),
P(`<strong>Raku</strong> has <code>grep</code>, which is the same word as the Unix tool and, by now, the same idea in every language that cares about text:`),
RK(`say (1..5).grep(* > 2);                      # (3 4 5)
say ("a", 1, "b", 2).grep(Int);                 # (1 2)   (a type as the test!)
say (1..5).grep(* > 2).elems;                   # 3`),
P(`That <code>grep(Int)</code> is delightful: in Raku, a <em>type</em> can be a test. Raku wins this round on sheer expressive power. Logo's version is plainer, and plain is what a beginner needs.`),
P(`Now <code>reduce</code>. It takes a recipe with <em>two</em> blanks, written <code>?1</code> and <code>?2</code>, and a list. It starts with the first two members, applies the recipe, and then combines that result with the next member, and so on until one value is left.`),
L(`show reduce [?1 + ?2] [1 2 3 4]
show reduce [?1 * ?2] [1 2 3 4 5]
show reduce "sum [10 20 30]`, {expect: "10\n120\n60"}),
P(`The first line adds: ((1 + 2) + 3) + 4 = 10. The second multiplies the numbers 1 to 5, which is a factorial: 120. The third passes <code>sum</code> by name, and that works because <code>sum</code> takes two inputs. This is the way to total up a list, and once you have <code>reduce</code> you rarely need to write a counting loop for sums, products, longest words and the like.`),
PY(`from functools import reduce
import operator

print(reduce(lambda a, b: a + b, [1, 2, 3, 4]))      # 10
print(reduce(operator.mul, [1, 2, 3, 4, 5]))         # 120
print(sum([10, 20, 30]))                             # 60 (the idiomatic way)`),
P(`Python hid <code>reduce</code> in <code>functools</code> in version 3 on purpose; the language's creator didn't love it, and said so. In practice, Python gives you <code>sum</code>, <code>max</code>, <code>min</code> and a few friends for the most common reductions, and you reach for <code>reduce</code> only for the odd ones. That's pragmatic. It also means a Python beginner meets the general idea late, if at all.`),
RK(`say [+] 1, 2, 3, 4;        # 10   (the reduction metaoperator)
say [*] 1..5;              # 120
say [+] 10, 20, 30;        # 60`),
P(`Raku makes the reduction a first-class bit of syntax: put an operator in square brackets, and it is applied between all the items. <code>[+] 1, 2, 3</code> is the best piece of notation in this lesson. If you remember one thing about Raku, remember that: it's what happens when a designer takes <code>reduce</code> seriously.`),
P(`The third command is <code>apply</code>. It calls a procedure, using the members of a list as the procedure's inputs. This is useful when the data arrives as a list but the procedure wants separate inputs.`),
L(`show apply "sum [3 4]
show apply [?1 * ?2] [6 7]
show invoke [? + 1] 5`, {expect: "7\n42\n6"}),
P(`<code>apply "sum [3 4]</code> is the same as <code>sum 3 4</code>, only the inputs came packaged as a list. The last line uses <code>invoke</code>, a close cousin that takes the inputs as separate items instead of a list. These two are less common for beginners, but you will see them in other people's code.`),
PY(`print(sum([3, 4]))          # 7
args = (6, 7)
print((lambda a, b: a * b)(*args))   # 42  (* unpacks the list into separate inputs)`),
RK(`my @args = 6, 7;
say sub ($a, $b) { $a * $b }(|@args);   # 42   (| slips the list in as inputs)`),
P(`Python's <code>*args</code> and Raku's <code>|@args</code> do the same job as Logo's <code>apply</code>: spread a list across the inputs of a call. Logo spells it with a word you can look up in the reference; the other two spell it with punctuation. Words are friendlier to search for.`),
P(`Let's combine all three on one tiny problem: the total length of all the long words in a sentence.`),
L(`make "words [a quick brown fox jumped over the lazy dog]
make "long filter [(count ?) > 3] :words
show :long
show map [count ?] :long
print reduce [?1 + ?2] map [count ?] :long`, {expect: "[quick brown jumped over lazy]\n[5 5 6 4 4]\n24"}),
P(`Filter to the long words; map each to its length; reduce the lengths to a total. Three small steps, each of which you can test on its own, and none needs a counter variable or a base case. This pipeline style is how a great deal of real data processing is written, in every language.`),
PY(`words = "a quick brown fox jumped over the lazy dog".split()
long_words = [w for w in words if len(w) > 3]
print(long_words)
print(sum(len(w) for w in long_words))   # 24`),
RK(`my @words = "a quick brown fox jumped over the lazy dog".words;
my @long = @words.grep(*.chars > 3);
say @long;                       # [quick brown jumped over lazy]
say [+] @long.map(*.chars);      # 24`),
N(`<strong>Edge case:</strong> <code>reduce</code> on an empty list is an error in UCBLogo, because there is nothing to start with. If your list might be empty, check with <code>emptyp</code> first.`),
],
ex: [
MC(`Which command keeps only the members that pass a test?`, ["<code>map</code>", "<code>filter</code>", "<code>reduce</code>", "<code>apply</code>"], 1,
  `<code>filter</code> keeps the members for which the test is true.`),
MC(`What does <code>reduce [?1 * ?2] [2 3 4]</code> give?`, ["9", "24", "[6 12]", "234"], 1,
  `2 × 3 = 6, then 6 × 4 = 24.`),
PR(`What does this print? Type the output exactly.`,
  {code: `show filter [? < 3] [5 1 4 2 3]\nshow reduce [?1 + ?2] [5 1 4 2 3]\nshow apply "sum [10 5]`, answer: "[1 2]\n15\n15",
   hint: "Keep the members less than 3; total all five; sum of two inputs.",
   explain: `Only 1 and 2 are less than 3. The five numbers total 15. And 10 + 5 is 15.`}),
FI(`Fill in the blank so Logo shows only the <em>even</em> numbers, <code>[2 4]</code>.`,
  {template: `show filter [(remainder ? ___) = 0] [1 2 3 4 5]`, answer: "2", expect: "[2 4]",
   hint: "Even numbers have remainder zero when divided by what?",
   explain: `<code>remainder ? 2</code> is 0 exactly when the number is even.`}),
WR(`Write a procedure <code>total.of.evens :list</code> that outputs the sum of just the even numbers in <code>:list</code>. For <code>[1 2 3 4]</code> the answer is 6. (Assume the list contains at least one even number.)`,
  {starter: "to total.of.evens :list\n  \nend", after: "print total.of.evens [1 2 3 4]\nprint total.of.evens [10 5 20]", expect: "6\n30",
   solution: "to total.of.evens :list\n  output reduce [?1 + ?2] filter [(remainder ? 2) = 0] :list\nend",
   hint: "Filter first, then reduce what is left.",
   explain: `<code>filter</code> keeps the evens and <code>reduce</code> adds them.`}),
]});
