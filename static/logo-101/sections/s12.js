S({
id: 12,
title: "repeat",
tagline: "Making Logo do something again and again, without typing it again and again",
blocks: [
P(`Here is the problem. You want Logo to say hello three times. You could type <code>print "hello</code> three times, and for three it is fine. For a thousand it is absurd. Computers are good at exactly one thing: doing the same task over and over without getting bored. Loops are how you ask for that. In Logo, the friendliest loop is <code>repeat</code>.`),
L(`repeat 3 [print "hello]`, {"expect":"hello\nhello\nhello"}),
P(`<code>repeat</code> takes two inputs: a number, and a <strong>list of instructions</strong> in square brackets. It runs those instructions that many times. Notice that the list is just a list, the same kind of thing you've been using for data since lesson 2. Instructions are data in Logo. We will come back to why that is such a big deal.`),
P(`<strong>Python</strong> has no <code>repeat</code>. It has <code>for</code>, which loops over a sequence, so to repeat something three times you loop over a sequence of three things and ignore them.`),
PY(`for _ in range(3):
    print("hello")`),
P(`Look at what a beginner must absorb: <code>for</code>, a throwaway variable named <code>_</code>, the function <code>range</code> (which does not produce the numbers 1 to 3, but 0 to 2), a colon, and an indented block. All to say "three times". Python's indentation is genuinely elegant once you know it, and I use it daily, but as a first encounter with repetition it is heavier than it needs to be. The poor beginner has no idea why they are looping over numbers they never use.`),
P(`<strong>Raku</strong> improves on this. There is a postfix <code>for</code> and a range operator, and you can say it almost as plainly as Logo.`),
RK(`say "hello" for 1..3;

# or, with a block
for 1..3 { say "hello" }`),
P(`That first form is nice. A statement, then <code>for</code>, then a range. It reads like a sentence. Raku has a knack for this. Still, <code>1..3</code> is a range of numbers that you then ignore, which is the same small conceptual detour Python makes.`),
P(`Now, <code>repeat</code> keeps count for you in a variable called <code>repcount</code>. On the first pass it is 1, on the second it is 2, and so on.`),
L(`repeat 4 [print repcount]`, {"expect":"1\n2\n3\n4"}),
P(`Unlike Python's <code>range</code>, it counts from 1, which is how people count. I think this is a small but real kindness. Anyone who has taught a room of ten-year-olds that the first item is number zero knows the confusion I mean.<sup>[1]</sup>`),
PY(`for i in range(1, 5):   # you must remember: the end is exclusive
    print(i)`),
RK(`say $_ for 1..4;`),
P(`Python needs you to remember that the end of the range is exclusive, so <code>range(1, 5)</code> gives 1 to 4. Raku's <code>1..4</code> is inclusive, which is easier, and the <code>$_</code> is the "current thing" topic variable. Different philosophies, both defensible. In Logo, <code>repcount</code> just is the answer.`),
P(`Let's use repeat to build something: a procedure that draws a row of stars.`),
L(`to stars :n
  repeat :n [type "*]
  print []
end

stars 5`, {"expect":"*****"}),
P(`<code>type</code> prints without a newline (you met it in lesson 1), so the stars stay on one line. Then <code>print []</code> prints an empty list, which is nothing, followed by the new line that finishes the row. It is a handy idiom: "end the line now". Because the repeat count is <code>:n</code>, the same procedure makes rows of any length. Noice.`),
P(`In Python the neat version uses string multiplication, which is genuinely clever, but is a different idea (strings repeating) from loops repeating.`),
PY(`def stars(n):
    print("*" * n)

stars(5)   # *****`),
RK(`sub stars($n) { say "*" x $n }
stars(5);   # *****`),
P(`Both the <code>*</code> in Python and Raku's <code>x</code> operator are real conveniences and I use them. They also hide the loop, which is a loss if the thing you are trying to learn <em>is</em> the loop. When you teach repetition, show the repetition.`),
P(`Loops can sit inside loops. The inner loop runs completely for every step of the outer one.`),
L(`repeat 3 [repeat 4 [type "#] print []]`, {"expect":"####\n####\n####"}),
P(`The outer <code>repeat 3</code> runs three times. Each time, the inner <code>repeat 4</code> types four hash marks, and then <code>print []</code> finishes the line. Three rows of four: a rectangle. Count the total hash marks, 3 × 4 = 12. That multiplication is the cost of nested loops, and it is worth noticing early, because it is where programs start to get slow.`),
PY(`for _ in range(3):
    for _ in range(4):
        print("#", end="")
    print()`),
RK(`for 1..3 {
    print "#" x 4;
    say "";
}`),
N(`<strong>Remember:</strong> the thing inside the square brackets of <code>repeat</code> is a list of instructions, so a missing <code>]</code> is the most common error. Count your brackets. LOL, I still do.`),
],
fn: [
 "Zero-based counting is useful for machines, and I will defend it to anyone. I just do not think a first lesson is the place for it."
],
ex: [
MC(`How many times does <code>repeat 5 [print "go]</code> print <code>go</code>?`, ["4","5","6","Once, then it waits"], 1, `The first input is the number of repetitions: five.`),
MC(`What is the value of <code>repcount</code> on the very first pass through a <code>repeat</code>?`, ["0","1","The repeat count","It has no value"], 1, `UCBLogo counts passes starting from 1.`),
PR(`What does this print? Type the output exactly.`,
  {code: `repeat 3 [type repcount * 2]
print "!`,
     answer: `246!`,
     hint: `type does not start a new line. repcount is 1, 2, 3.`,
     explain: `Each pass types <code>repcount * 2</code>: 2, 4, 6, with no spaces, then the final <code>print</code> continues on the same line, adds <code>!</code>, and finishes the line.`}),
FI(`Fill in the blank to print the word <code>ha</code> four times, one per line.`,
  {template: `repeat ___ [print "ha]`,
     answer: `4`,
     expect: `ha
ha
ha
ha`,
     hint: `How many times should it repeat?`,
     explain: `The first input of <code>repeat</code> is the count.`}),
WR(`Write a procedure <code>square.of.hashes :n</code> that prints a square of <code>#</code> characters with <code>:n</code> rows and <code>:n</code> columns. For 3 it should print three lines of <code>###</code>.`,
  {starter: `to square.of.hashes :n
  
end`,
     after: `square.of.hashes 3`,
     expect: `###
###
###`,
     solution: `to square.of.hashes :n
  repeat :n [repeat :n [type "#] print []]
end`,
     hint: `A repeat inside a repeat. The inner one types, the outer one ends the line.`,
     explain: `Outer repeat: rows. Inner repeat: one row of characters. The <code>print []</code> after the inner loop is what ends each row.`}),
]});
