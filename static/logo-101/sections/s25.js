S({
id: 25,
title: "Arrays",
tagline: "A fixed row of numbered boxes, for when you want to change one thing without rebuilding everything",
blocks: [
P(`Lists are Logo's favourite data type, but they have a weakness. To get the thousandth member you have to walk past the first 999. And to change one member you have to build a whole new list. An <strong>array</strong> trades flexibility for speed: it is a fixed number of numbered boxes, and you can look in any box, or change what's in it, instantly.`),
L(`make "box array 3
show :box
print count :box`, {expect: "{[] [] []}\n3"}),
P(`<code>array 3</code> makes an array with three empty slots. When Logo shows one, it uses curly braces instead of the square brackets of a list, so you can tell them apart at a glance: <code>{...}</code> is an array, <code>[...]</code> is a list. Every slot starts out holding the empty list.`),
P(`One practical note for this course: in UCBLogo you may write an array directly as <code>{a b c}</code>. The interpreter in this page does not accept that written form, so we will build arrays with <code>array</code> and <code>listtoarray</code> instead. Everything you learn carries over unchanged.`),
P(`Put things in the boxes with <code>setitem</code>, and look at them with <code>item</code>. Positions start at 1, like everything else in Logo.`),
L(`setitem 1 :box "x
setitem 2 :box "y
show :box
print item 1 :box
show item 3 :box`, {expect: "{x y []}\nx\n[]"}),
P(`Careful with the order of the inputs: <code>setitem</code> wants the position, then the array, then the new value. It changes the array in place and gives no answer. That is unlike <code>fput</code> and <code>lput</code>, which returned a new list and left the old one alone. Arrays are the first thing in this course where "change it where it sits" is the normal behaviour.`),
P(`<strong>Python</strong> has no separate array for everyday use: its list is already a row of numbered boxes that you can change in place, and it is fast to index. That is a big simplification, and the right one for a general language. The cost is that Python does not teach you the difference between the two ideas.`),
PY(`box = [None] * 3
box[0] = "x"
box[1] = "y"
print(box)        # ['x', 'y', None]
print(box[0])     # x     (index 0!)
print(len(box))   # 3`),
P(`<strong>Raku</strong> also has one growable <code>Array</code>, and, if you want fixed size, a typed shaped array that can be declared up front. Most Raku code just uses the ordinary one:`),
RK(`my @box = Nil xx 3;      # three empty slots
@box[0] = "x";
@box[1] = "y";
say @box.elems;       # 3
say @box[0];          # x`),
P(`So Logo makes a distinction that Python and Raku mostly hide. Is the distinction worth teaching? I think so, because every real programmer eventually meets it: "list" and "array" are different data structures in C, Java, JavaScript's typed arrays, and the guts of Python and Raku. But I would be dishonest if I said Logo's approach is more <em>convenient</em>. It isn't. It is more <em>honest</em>.`),
P(`Converting between the two is easy: <code>listtoarray</code> and <code>arraytolist</code>.`),
L(`make "a listtoarray [10 20 30]
show :a
show arraytolist :a
show item 2 :a`, {expect: "{10 20 30}\n[10 20 30]\n20"}),
P(`This gives you a route to the written form: build the data as a list (which is easy to type), then convert it into an array when you need fast changes. And going the other way lets you reuse everything you know about lists, such as <code>map</code> and <code>foreach</code>, on an array's contents.`),
L(`foreach arraytolist :a [print ? * 10]`, {expect: "100\n200\n300"}),
P(`Here is the thing that bites everyone once. Because an array changes in place, giving it a second name does not copy it. Both names point at the very same boxes:`),
L(`make "b :a
setitem 1 :b 99
show :a`, {expect: "{99 20 30}"}),
P(`We changed <code>:b</code> and found that <code>:a</code> changed too. They are two names for one array. With lists this can never happen, because lists never change in place. If you want a separate copy, convert to a list and back: <code>listtoarray arraytolist :a</code>.`),
PY(`a = [10, 20, 30]
b = a              # same list, two names
b[0] = 99
print(a)           # [99, 20, 30]   the same surprise!

c = a.copy()       # a real copy`),
RK(`my @a = 10, 20, 30;
my @b := @a;       # binding: two names, one array
@b[0] = 99;
say @a;            # [99 20 30]

my @c = @a;        # assignment copies the elements`),
P(`The same trap, three languages, three spellings of the fix. Raku is the most explicit: <code>:=</code> binds, <code>=</code> copies. If you remember nothing else about arrays, remember: <strong>changing things in place means everyone who shares them sees the change</strong>.`),
P(`Now a real use. Here is a procedure that counts how many times each number from 1 to 5 appears in a list, using an array of five counters. This pattern, "an array of tallies, indexed by what you are counting", is the kind of job arrays were invented for:`),
L(`to tally :nums
  local "counts
  make "counts array 5
  for [i 1 5] [setitem :i :counts 0]
  foreach :nums [setitem ? :counts (item ? :counts) + 1]
  output :counts
end

show tally [1 3 3 5 1 3]`, {expect: "{2 0 3 0 1}"}),
P(`First we fill all five boxes with zero (remember, they start out empty, not zero). Then for each number in the list, we add one to its box. The box numbered by the value itself does the counting. Two ones, no twos, three threes, no fours, one five. The array reads like a bar chart.`),
PY(`def tally(nums):
    counts = [0] * 5
    for n in nums:
        counts[n - 1] += 1     # minus 1 because Python counts from 0
    return counts

print(tally([1, 3, 3, 5, 1, 3]))   # [2, 0, 3, 0, 1]`),
RK(`sub tally(@nums) {
    my @counts = 0 xx 5;
    @counts[$_ - 1]++ for @nums;      # minus 1 because Raku counts from 0
    @counts
}
say tally([1, 3, 3, 5, 1, 3]);        # [2 0 3 0 1]`),
P(`Look at the <code>- 1</code> in the Python and Raku. Logo's one-based boxes make this code a little more direct: the value <em>is</em> the box number. In real life you would mostly use a dictionary for this job in Python and a Bag in Raku, and we'll meet the Logo equivalent in the next few lessons.`),
N(`<strong>Remember:</strong> <code>array</code> boxes start out empty, not zero. <code>setitem</code> changes the array in place and gives no answer. <code>make "b :a</code> does not copy an array.`),
],
ex: [
MC(`How does Logo show an array when you <code>show</code> it?`, ["In square brackets, like <code>[a b]</code>", "In curly braces, like <code>{a b}</code>", "In parentheses", "As a number"], 1,
  `Curly braces mark an array, square brackets mark a list.`),
MC(`After <code>make "x listtoarray [1 2 3]</code>, <code>make "y :x</code> and <code>setitem 1 :y 9</code>, what is <code>item 1 :x</code>?`, ["1", "9", "An error", "The empty list"], 1,
  `Both names refer to the same array, so changing it through <code>:y</code> changes it for <code>:x</code> too.`),
PR(`What does this print? Type the output exactly.`,
  {before: `make "a array 3`, code: `setitem 2 :a "hi\nshow :a\nprint count :a`, answer: "{[] hi []}\n3",
   hint: "Unset slots hold the empty list.",
   explain: `Only slot 2 is filled; the other two still hold the empty list.`}),
FI(`Fill in the blank so Logo prints <code>20</code>.`,
  {template: `make "a listtoarray [10 20 30]\nprint item ___ :a`, answer: "2", expect: "20",
   hint: "Logo counts from one.",
   explain: `<code>20</code> is in position 2.`}),
WR(`Write a procedure <code>zeros :n</code> that outputs an array of <code>:n</code> slots, every one set to <code>0</code>. <code>show zeros 3</code> should print <code>{0 0 0}</code>.`,
  {starter: "to zeros :n\n  \nend", after: "show zeros 3\nshow zeros 1", expect: "{0 0 0}\n{0}",
   solution: "to zeros :n\n  local \"a\n  make \"a array :n\n  for [i 1 :n] [setitem :i :a 0]\n  output :a\nend",
   hint: "Make the array, loop over its positions, setitem each one to 0, and output the array.",
   explain: `<code>array</code> makes the empty slots, the <code>for</code> loop fills each with 0, and <code>output</code> returns the array.`}),
]});
