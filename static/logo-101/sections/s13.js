S({
id: 13,
title: "for, while and until",
tagline: "Three more ways to repeat, for when you need a counter or a condition",
blocks: [
P(`<code>repeat</code> is perfect when you know how many times. But often you want something slightly different: "do this for each number from 1 to 10", or "keep going until the water boils". UCBLogo gives you three loops for those jobs: <code>for</code>, <code>while</code> and <code>until</code>.`),
L(`for [i 1 5] [print :i * :i]`, {expect: "1\n4\n9\n16\n25"}),
P(`The first input to <code>for</code> is a little list of settings: the name of a variable (<code>i</code>), where it starts (1), and where it ends (5). The second input is the list of instructions to run for each value. Inside the loop, <code>:i</code> holds the current number. Here we print the squares of 1 to 5.`),
P(`Notice something nice: the variable name sits in the list without a colon or a quote, because <code>for</code> is the one defining it. It is the single place where a Logo variable gets named in bare form, and it is worth a moment of attention.`),
P(`<strong>Python</strong>'s <code>for</code> loop looks like this. It's good, and I use it constantly. Yes, the end of <code>range</code> is exclusive; that is the price.`),
PY(`for i in range(1, 6):
    print(i * i)`),
P(`<strong>Raku</strong> keeps the inclusive range, and the loop variable is declared with a pointy block:`),
RK(`for 1..5 -> $i {
    say $i * $i;
}`),
P(`A step is optional. Add a third number to the settings list and <code>for</code> counts by that amount, even downwards:`),
L(`for [i 10 0 -5] [print :i]
for [i 1 2 0.5] [print :i]`, {expect: "10\n5\n0\n1\n1.5\n2"}),
P(`Counting from 10 down to 0 in steps of -5, and from 1 to 2 in halves. Decimal steps work, which is a feature many languages make surprisingly awkward.`),
PY(`for i in range(10, -1, -5):   # 10, 5, 0
    print(i)
# range() only takes whole numbers, so halves need another approach
x = 1.0
while x <= 2:
    print(x)
    x += 0.5`),
RK(`for 10, 5 ... 0 -> $i { say $i }     # a sequence: 10, 5, 0
for 1, 1.5 ... 2 -> $i { say $i }      # 1, 1.5, 2`),
P(`Python's <code>range</code> refuses decimals, so you fall back on a different loop. Raku's sequence operator <code>...</code> is wonderful: you show it the first couple of values and it works out the pattern. It's a better idea than Logo's, I'll concede, but it is also one more thing to learn.`),
P(`Now for the other two loops. <code>for</code> counts; <code>while</code> and <code>until</code> <em>wait for a condition</em>. They each take a condition list and an instruction list, and they re-check the condition every time round:`),
L(`make "n 3
while [:n > 0] [print :n make "n :n - 1]
print "liftoff`, {expect: "3\n2\n1\nliftoff"}),
P(`<code>while</code> means: keep running the instructions as long as the condition stays true. Each time we print <code>:n</code> and then reduce it by one. When <code>:n</code> reaches 0, the condition <code>:n > 0</code> is false and the loop stops. If you forget the <code>make "n :n - 1</code> line, the condition never changes and Logo loops forever. (This interpreter gives up after four million steps and tells you so.)`),
PY(`n = 3
while n > 0:
    print(n)
    n -= 1
print("liftoff")`),
RK(`my $n = 3;
while $n > 0 {
    say $n;
    $n--;
}
say "liftoff";`),
P(`Python and Raku have nice little shorthands here (<code>-=</code> and <code>--</code>). Logo has no such operator: you write the whole thing out, <code>make "n :n - 1</code>. I find that wordy but oddly clarifying: it makes you see that you are replacing the old value of <code>n</code> with a new one.`),
P(`<code>until</code> is just <code>while</code> turned inside out. It keeps going <em>until</em> the condition becomes true:`),
L(`make "n 0
until [:n = 3] [print :n make "n :n + 1]`, {expect: "0\n1\n2"}),
P(`Same machinery, opposite test. Use whichever one reads better as a sentence. "While there are tickets left" and "until the queue is empty" are both perfectly good English, and you should pick the one that matches how you think about the problem.`),
P(`Python has no <code>until</code>; you write <code>while not</code>. Raku does have it (<code>until</code>), and so does Perl, its ancestor:`),
PY(`n = 0
while not n == 3:
    print(n)
    n += 1`),
RK(`my $n = 0;
until $n == 3 {
    say $n;
    $n++;
}`),
P(`Let's put <code>for</code> and a procedure together. A times table:`),
L(`to table :n
  for [i 1 5] [print (word :i "x :n "= :i * :n)]
end

table 7`, {expect: "1x7=7\n2x7=14\n3x7=21\n4x7=28\n5x7=35"}),
P(`The <code>word</code> command glues pieces into a single word, which is why there are no spaces in the output. The last bit, <code>:i * :n</code>, is evaluated, not quoted, so each line shows the real product. You build something useful from a loop, an operator and a procedure, and it all fits in four lines.`),
PY(`def table(n):
    for i in range(1, 6):
        print(f"{i}x{n}={i * n}")

table(7)`),
RK(`sub table($n) {
    say "{$_}x$n={$_ * $n}" for 1..5;
}
table(7);`),
N(`<strong>Which loop?</strong> Know the count: <code>repeat</code>. Need a counter variable: <code>for</code>. Waiting on a condition: <code>while</code> or <code>until</code>. When in doubt, try <code>repeat</code> first; it is the simplest.`),
],
ex: [
MC(`Which loop would you pick to print the numbers 1 to 100?`, ["<code>until</code>", "<code>for</code>", "<code>if</code>", "<code>stop</code>"], 1,
  `<code>for [i 1 100] [print :i]</code> does it in one line. <code>repeat</code> would also work with <code>repcount</code>.`),
MC(`What happens to a <code>while</code> loop whose instructions never change the condition?`, ["It runs once", "It never runs", "It runs forever (until the sandbox stops it)", "Logo changes the condition for you"], 2,
  `Nothing inside the loop makes the condition false, so it repeats indefinitely. This is the classic infinite loop.`),
PR(`What does this print? Type the output exactly.`,
  {code: `for [i 2 10 4] [print :i]`, answer: "2\n6\n10",
   hint: "The third number is the step.",
   explain: `Counting from 2 up to 10 in steps of 4: 2, 6, 10.`}),
FI(`Fill in the blank so the loop prints <code>1</code> to <code>5</code> on separate lines.`,
  {template: `for [i 1 ___] [print :i]`, answer: "5", expect: "1\n2\n3\n4\n5",
   hint: "It is the last value of the counter.",
   explain: `The settings list is <code>[name start end]</code>, so the end is 5.`}),
WR(`Write a procedure <code>sumto :n</code> that prints the total of the whole numbers from 1 up to <code>:n</code>. For example, <code>sumto 4</code> prints 10. Use a loop and a variable.`,
  {starter: "to sumto :n\n  \nend", after: "sumto 4\nsumto 10", expect: "10\n55",
   solution: "to sumto :n\n  make \"total 0\n  for [i 1 :n] [make \"total :total + :i]\n  print :total\nend",
   hint: "Start a total at 0, then add each :i to it inside a for loop. Print it at the end.",
   explain: `Start from <code>0</code>, add each number as the loop counts, print the total after the loop ends.`}),
]});
