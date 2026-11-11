S({
id: 20,
title: "Recursion II: operations that answer",
tagline: "Last time a recursive procedure did something. This time it hands back a value, and that changes how you think",
blocks: [
P(`In the last lesson your recursive procedures were commands. <code>countdown</code> printed things and then called itself. That is a fine way to meet recursion, but it is the less interesting half. The real power shows up when a procedure <em>answers</em>: it uses <code>output</code> to hand a value back, and part of that value comes from the procedure calling itself.`),
P(`The classic example is factorial. The factorial of 5 is 5 × 4 × 3 × 2 × 1, which is 120. Look at that definition again and notice something: 5! is just 5 times 4!. And 4! is 4 times 3!. Each answer is built out of a slightly smaller version of the same question. That is the entire trick of recursion, and this is the cleanest place to see it.`),
L(`to factorial :n
  if :n = 0 [output 1]
  output :n * factorial :n - 1
end

print factorial 5`, {"expect":"120"}),
P(`Two lines of real work. The first is the <strong>base case</strong>: the factorial of 0 is 1, no further questions. Without it the procedure would call itself forever. The second is the <strong>recursive case</strong>: the answer is <code>:n</code> times the factorial of something smaller.`),
P(`One thing trips up everybody at least once. Read <code>factorial :n - 1</code> carefully. In UCBLogo, <code>factorial</code> takes one input, and that input is the whole expression <code>:n - 1</code>. So it means "factorial of (n minus 1)", not "(factorial of n) minus 1". Logo grabs the arithmetic that follows a name and treats it as the input. I find this friendlier than the alternative, because the procedure name works like a word in a sentence: "factorial of n minus one".`),
P(`<strong>In Python</strong> you write the same recursion, but the call needs parentheses, and the parentheses are what tell you where the input ends. That is clearer for the parser and a little noisier for the beginner.`),
PY(`def factorial(n):
    if n == 0:
        return 1
    return n * factorial(n - 1)

print(factorial(5))   # 120`),
P(`Python also has <code>return</code> where Logo has <code>output</code>. I prefer Logo's word. <code>output</code> says what is happening: the procedure is putting a value out into the world. <code>return</code> sounds like going back, which describes the mechanism rather than the result. Small thing, but beginners do read the names.`),
P(`<strong>In Raku</strong> the most natural way to say this is with <em>multi dispatch</em>: you write the base case and the recursive case as two separate definitions, and Raku picks the one that matches. This is lovely, and it reads almost like the mathematical definition.`),
RK(`multi factorial(0) { 1 }
multi factorial(Int $n) { $n * factorial($n - 1) }

say factorial(5);   # 120
say [*] 1..5;       # 120, no recursion at all`),
P(`And notice the last line: in real Raku you would probably never write this recursively. <code>[*] 1..5</code> multiplies the whole range. Python's idiom is the same story, <code>math.factorial</code>. Both languages have the answer ready-made. That is a good argument for using them at work and a poor argument for learning from them: a beginner who writes <code>[*] 1..5</code> has learned a spell, not an idea. Recursion is the idea.<sup>[1]</sup>`),
P(`Now the same pattern on a list. Adding up a list of numbers: the sum of an empty list is 0, and the sum of any other list is its first item plus the sum of the rest.`),
L(`to sumlist :l
  if emptyp :l [output 0]
  output (first :l) + sumlist butfirst :l
end

print sumlist [1 2 3 4]`, {"expect":"10"}),
P(`This is the shape you will use again and again for lists: test <code>emptyp</code> for the base case, use <code>first</code> for the piece you handle now, and use <code>butfirst</code> for the rest, which you hand to the recursive call. The list gets shorter by one each time, so it must eventually be empty, and the recursion must stop. Learn to see that shrinking. If your input does not get smaller, your procedure does not end. Noice.`),
P(`<strong>Python</strong> can slice a list, so the same logic looks like this. It works, but nobody would write it for real, because the built-in <code>sum</code> exists and because slicing copies the list on every call.`),
PY(`def sumlist(items):
    if not items:
        return 0
    return items[0] + sumlist(items[1:])

print(sumlist([1, 2, 3, 4]))   # 10
print(sum([1, 2, 3, 4]))       # 10, what you would actually write`),
P(`<strong>Raku</strong> offers <code>.sum</code> and the reduction metaoperator, and it can also do the head/tail split by hand if you want the lesson. Slicing with <code>1..*</code> means "from index 1 to the end".`),
RK(`sub sum-list(@l) {
    @l.elems == 0 ?? 0 !! @l[0] + sum-list(@l[1..*]);
}

say sum-list([1, 2, 3, 4]);   # 10
say [+] 1, 2, 3, 4;           # 10
say (1, 2, 3, 4).sum;         # 10`),
P(`Here is a third problem, with two inputs: raising a number to a power. Logo already has a primitive called <code>power</code>, so I will name mine <code>raise</code> to avoid stepping on it. The idea: anything to the power 0 is 1, and <code>b</code> to the power <code>e</code> is <code>b</code> times <code>b</code> to the power <code>e - 1</code>.`),
L(`to raise :b :e
  if :e = 0 [output 1]
  output :b * raise :b :e - 1
end

print raise 2 10
print raise 3 4`, {"expect":"1024\n81"}),
P(`Notice that only <code>:e</code> shrinks. <code>:b</code> comes along unchanged for the ride. That is normal. When a procedure has several inputs, usually one of them is the "countdown" that guarantees you reach the base case, and the others carry whatever the answer needs.`),
P(`<strong>Python</strong> already has <code>**</code> for this, and <code>pow</code>. The recursive version is just practice.`),
PY(`def raise_(b, e):
    if e == 0:
        return 1
    return b * raise_(b, e - 1)

print(raise_(2, 10))   # 1024
print(2 ** 10)         # 1024`),
P(`I had to call it <code>raise_</code> because <code>raise</code> is a reserved word in Python. Logo has no reserved words at all in this sense: you can define things however you like, and the system will tell you if you collide with a primitive. Fewer reserved words means fewer surprises on day one.`),
P(`<strong>Raku</strong> has the <code>**</code> operator too. The recursive version, with a multi.`),
RK(`multi raise($b, 0) { 1 }
multi raise($b, $e) { $b * raise($b, $e - 1) }

say raise(2, 10);   # 1024
say 2 ** 10;        # 1024`),
P(`A habit worth building right now: before you trust a recursive procedure, try the smallest input by hand. What is <code>factorial 0</code>? What is <code>sumlist []</code>? What is <code>raise 5 0</code>? If the base cases are right and each step moves toward them, the rest takes care of itself. That is not magic, it is the same argument as mathematical induction, and it is the reason recursion is easier to <em>trust</em> than a loop once you have the knack.`),
N(`<strong>Big numbers.</strong> Factorials grow fast. This interpreter, like UCBLogo, uses ordinary floating-point numbers, so <code>factorial 20</code> prints in scientific notation. Python's integers never overflow, which is lovely, and Raku's <code>Int</code> is arbitrary precision too. That is one place where both comparison languages are simply better engineered than Logo. Fair is fair.`),
],
fn: [
 "If you remember one thing from this lesson, let it be the difference between knowing a spell and knowing an idea. Spells expire. Ideas port."
],
ex: [
MC(`Which line of <code>factorial</code> is the base case?`, ["<code>output :n * factorial :n - 1</code>","<code>if :n = 0 [output 1]</code>","<code>to factorial :n</code>","<code>end</code>"], 1, `The base case is the one that answers directly, without calling the procedure again. Everything else is the recursive case.`),
MC(`In <code>output :n * factorial :n - 1</code>, what is the input of <code>factorial</code>?`, ["<code>:n</code> only","<code>:n - 1</code>","The whole expression, <code>:n * factorial :n - 1</code>","<code>1</code>"], 1, `A procedure name grabs the arithmetic that follows it. So this is <code>:n</code> times (factorial of (<code>:n - 1</code>)).`),
PR(`Type what Logo prints. The definition of <code>sumlist</code> is already loaded.`,
  {before: `to sumlist :l
  if emptyp :l [output 0]
  output (first :l) + sumlist butfirst :l
end`,
     code: `print sumlist [1 2 3]
print sumlist []`,
     answer: `6
0`,
     hint: `What is the answer for an empty list?`,
     explain: `<code>sumlist [1 2 3]</code> is 1 + 2 + 3 = 6, and the empty list is the base case, which answers 0.`}),
FI(`Complete the base case so that <code>raise 2 5</code> prints 32.`,
  {template: `to raise :b :e
  if :e = 0 [output ___]
  output :b * raise :b :e - 1
end
print raise 2 5`,
     answer: `1`,
     expect: `32`,
     hint: `Any number to the power 0 is the same value. Which one?`,
     explain: `Anything to the power 0 is 1. If you put 0 there, every answer would be 0.`}),
WR(`Write a procedure <code>product.list</code> that takes a list of numbers and outputs their product. Use recursion: the product of an empty list is 1.`,
  {starter: ``,
     after: `print product.list [2 3 4]
print product.list []`,
     expect: `24
1`,
     solution: `to product.list :l
  if emptyp :l [output 1]
  output (first :l) * product.list butfirst :l
end`,
     hint: `It is almost exactly sumlist. What changes in the base case, and what changes in the operator?`,
     explain: `The base case is 1, not 0, because 1 is what you multiply by without changing anything. The operator is <code>*</code> instead of <code>+</code>.`}),
]});
