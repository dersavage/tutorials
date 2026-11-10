S({
id: 28,
title: "Random numbers and simulation",
tagline: "Let the computer roll the dice, and learn what you can and cannot say about the result",
blocks: [
P(`Games need dice. Simulations need chance. Even testing a program is better with a few surprising inputs. All of it starts with a command that gives you a number you cannot predict. In UCBLogo that command is <code>random</code>.`),
L(`make "r random 6
print and (:r >= 0) (:r < 6)`, {expect: "true"}),
P(`<code>random 6</code> gives a whole number from <strong>0 up to 5</strong>: it never reaches 6. I have not printed the number itself, because it would be different each time you press <strong>Run ▶</strong>. Instead I tested a fact about it that is always true: it is at least 0 and below 6. That is how you test randomness: you check what <em>must</em> hold, not what happened to come out.`),
P(`If you want a die that gives 1 to 6, shift the answer up by one:`),
L(`to roll
  output 1 + random 6
end

make "d roll
print and (:d >= 1) (:d <= 6)`, {expect: "true"}),
P(`<strong>Python</strong> has a <code>random</code> module that hands you the die directly: <code>randint(1, 6)</code> includes both ends. That's friendlier than Logo's "0 up to n-1", though Python's own <code>randrange(6)</code> and list indexing follow the same zero-based habit:`),
PY(`import random

d = random.randint(1, 6)     # 1..6, both ends included
r = random.randrange(6)      # 0..5, like Logo's  random 6
print(1 <= d <= 6, 0 <= r < 6)   # True True`),
P(`<strong>Raku</strong> keeps the idea simple: a range has a <code>.pick</code> method that chooses a random member, and <code>rand</code> gives a fraction. The die is a one-liner:`),
RK(`my $d = (1..6).pick;          # 1..6, both ends included
my $r = (^6).pick;             # 0..5, like Logo's  random 6
say 1 <= $d <= 6;             # True`),
P(`Raku's chained comparison <code>1 <= $d <= 6</code> reads exactly the way a mathematician writes it, which Python also allows. Logo wants you to spell the two halves out with <code>and</code>. Wordier, but you cannot get it wrong by misreading precedence.`),
P(`Now, a puzzle. A program whose answers change every run is hard to debug: when a bug appears, you cannot make it appear again. The remedy is to <em>seed</em> the generator. In UCBLogo that is <code>rerandom</code>: it starts the sequence of "random" numbers from a known place, so you get the <em>same</em> sequence every time. (Real randomness comes from the sequence being started somewhere unpredictable, which is what happens by default.)`),
L(`rerandom
repeat 3 [type random 10 type "| |]
print []
rerandom
repeat 3 [type random 10 type "| |]
print []`, {expect: "9 3 4\n9 3 4"}),
P(`The same three "random" numbers appear after each <code>rerandom</code>. That is a pseudo-random generator at work: a fixed recipe that produces numbers that <em>look</em> unpredictable. For testing and for teaching, repeatability is a gift. (A caution: the numbers you see here belong to this page's interpreter. A copy of UCBLogo on your own computer will give a different, but equally repeatable, sequence.)`),
PY(`import random

random.seed(42)
a = [random.randint(1, 6) for _ in range(3)]
random.seed(42)
b = [random.randint(1, 6) for _ in range(3)]
print(a == b)    # True: same seed, same sequence`),
RK(`srand(42);
my @a = (1..6).roll(3);
srand(42);
my @b = (1..6).roll(3);
say @a eqv @b;       # True`),
P(`Python's <code>seed</code> and Raku's <code>srand</code> do the same job as <code>rerandom</code>. In Raku, <code>.roll(3)</code> is "roll a die three times", picking with replacement; its sibling <code>.pick(3)</code> picks <em>without</em> replacement, like drawing cards from a deck. Raku has a good ear for the difference.`),
P(`Now a simulation. Roll a die many times and count how often each face comes up. Here we count only the sixes, over 600 rolls. You'd expect about 100, but the exact number will vary, so what we can safely check is a loose bound:`),
L(`to count.sixes :n
  local "sixes
  make "sixes 0
  repeat :n [if roll = 6 [make "sixes :sixes + 1]]
  output :sixes
end

make "s count.sixes 600
print and (:s > 50) (:s < 150)`, {expect: "true"}),
P(`This is the law of large numbers in action: the more you roll, the closer the fraction of sixes gets to one in six. On 600 rolls we expect about 100, and we are almost certain to land somewhere between 50 and 150. "Almost certain" is the right phrase. A randomised test that can very rarely fail is a bug waiting for a bad night, so for a real test, seed the generator.`),
PY(`import random

def count_sixes(n):
    return sum(1 for _ in range(n) if random.randint(1, 6) == 6)

s = count_sixes(600)
print(50 < s < 150)   # True (almost certainly)`),
RK(`sub count-sixes($n) { (1..$n).map({ (1..6).pick }).grep(* == 6).elems }
my $s = count-sixes(600);
say 50 < $s < 150;    # True (almost certainly)`),
P(`One last handy tool: choosing a random member of a list. You use <code>random</code> to pick a position, then <code>item</code> to fetch it. Note the <code>1 +</code>, because <code>item</code> counts from one:`),
L(`to pick.one :list
  output item 1 + random count :list :list
end

make "colour pick.one [red green blue]
print memberp :colour [red green blue]`, {expect: "true"}),
P(`UCBLogo also has a built-in <code>pick</code> that does the same job, but writing it yourself is a good way to see how the pieces fit: a random number in range, a shift by one, an <code>item</code>.`),
PY(`import random
colour = random.choice(["red", "green", "blue"])
print(colour in ["red", "green", "blue"])   # True`),
RK(`my $colour = <red green blue>.pick;
say $colour (elem) <red green blue>;    # True`),
N(`<strong>Testing random code:</strong> check properties that must always hold (a range, a count, membership), or seed the generator with <code>rerandom</code> so the sequence repeats.`),
],
ex: [
MC(`What range of numbers can <code>random 10</code> give?`, ["1 to 10", "0 to 9", "0 to 10", "1 to 9"], 1,
  `<code>random n</code> gives whole numbers from 0 up to n - 1.`),
MC(`What is <code>rerandom</code> useful for?`, ["Making numbers more random", "Making the sequence of random numbers repeat the same way", "Rolling two dice", "Printing random numbers"], 1,
  `It restarts the generator from a known place, so a program is repeatable, which makes bugs easier to find.`),
PR(`What does this print? (After <code>rerandom</code> the numbers are repeatable in this page.) Type the output exactly.`,
  {code: `rerandom\nrepeat 3 [type random 10 type "| |]\nprint []`, answer: "9 3 4",
   hint: "You can run it in the playground below the lesson to check, but the point is: after rerandom the sequence is the same every time.",
   explain: `After <code>rerandom</code> the sequence is always the same in this interpreter: 9, 3, 4.`}),
FI(`Fill in the blank so <code>roll</code> always gives a number from 1 to 6.`,
  {template: `to roll\n  output ___ + random 6\nend\nmake "d roll\nprint and (:d >= 1) (:d <= 6)`, answer: "1", expect: "true",
   hint: "random 6 gives 0 to 5. How much do you shift it up?",
   explain: `<code>1 + random 6</code> gives 1 to 6.`}),
WR(`Write a procedure <code>coin</code> that outputs <code>heads</code> or <code>tails</code> at random.`,
  {starter: "to coin\n  \nend", after: "make \"c coin\nprint memberp :c [heads tails]", expect: "true",
   solution: "to coin\n  ifelse (random 2) = 0 [output \"heads] [output \"tails]\nend",
   hint: "random 2 gives 0 or 1. Use ifelse to turn it into a word.",
   explain: `<code>random 2</code> is 0 or 1; map each to a word with <code>ifelse</code>.`}),
]});
