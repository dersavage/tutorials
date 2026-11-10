S({
id: 10,
title: "Making choices: if and ifelse",
tagline: "teaching a program to do one thing or another, and to leave early when there is nothing left to do",
blocks: [
P(`So far every program you have written does the same thing every time. That is fine for a calculator, but the whole point of a program is that it can <em>decide</em>. In this lesson you will learn Logo's three decision tools: <code>if</code>, <code>ifelse</code>, and <code>stop</code>. They are small, and they are enough to write quite serious programs. Decisions are where a program stops being a recipe and starts being a little robot.`),
P(`The simplest decision is "do this only if something is true". It takes a condition and a <em>list</em> of instructions.`),
L(`if 3 > 2 [print "ok]
if 2 > 3 [print "never]
print "done`, {"expect":"ok\ndone"}),
P(`The first <code>if</code> sees a true condition, so it runs the list. The second sees a false one, so it skips the list entirely and nothing is printed. Then <code>print "done</code> runs no matter what. The list in square brackets is a chunk of code waiting to be run; Logo treats instructions as data, a theme that will keep coming back. For now just remember: <strong>the thing after the condition goes in square brackets</strong>.`),
P(`<strong>Python</strong> does it with a colon and indentation instead of brackets. Notice how much of the meaning is carried by whitespace: a beginner who misindents gets an error or, worse, a program that quietly does the wrong thing. Oh no, and Python will not tell them which.`),
PY(`if 3 > 2:
    print("ok")
if 2 > 3:
    print("never")
print("done")`),
P(`<strong>Raku</strong> uses curly braces and needs no parentheses around the condition, which many people find cleaner than C-style languages.`),
RK(`if 3 > 2 { say "ok" }
if 2 > 3 { say "never" }
say "done";`),
P(`When you want one thing <em>or</em> another, you use <code>ifelse</code>, which takes a condition and <em>two</em> lists.`),
L(`to describe :n
  ifelse :n > 0 [print "positive] [print "zero.or.negative]
end

describe 5
describe -2`, {"expect":"positive\nzero.or.negative"}),
P(`Exactly one of the two lists runs, never both and never neither. That symmetry is why I like <code>ifelse</code> for teaching: the shape of the code on the page matches the shape of the decision. A very common beginner bug in other languages is writing two separate <code>if</code> statements that overlap, so that sometimes both branches run. <code>ifelse</code> rules that out by construction.`),
PY(`def describe(n):
    if n > 0:
        print("positive")
    else:
        print("zero or negative")`),
RK(`sub describe($n) {
    if $n > 0 { say "positive" }
    else      { say "zero or negative" }
}`),
P(`Python and Raku say <code>else</code> on its own line, attached to the preceding <code>if</code>. That is natural once you know it, but notice that Logo needs a separate primitive name (<code>ifelse</code>) while the others reuse one keyword. Different design choice, no winner.`),
P(`Here is where Logo gets interesting: <code>ifelse</code> can also be used as an <em>operation</em>, producing a value. When both lists contain just a value instead of instructions, it picks one of them.`),
L(`to bigger :a :b
  output ifelse :a > :b [:a] [:b]
end

print bigger 3 9
print bigger 20 4`, {"expect":"9\n20"}),
P(`Read it out: "output (if a is greater than b, then a, else b)". The answer is a single value, chosen by a test. <code>bigger</code> is a perfect little operation: it asks a question, picks one of two answers, and hands it back. Noice.`),
P(`<strong>Python</strong> has a separate expression form for this, the conditional expression, which reads in a slightly odd order: the answer first, the question in the middle.`),
PY(`def bigger(a, b):
    return a if a > b else b

print(bigger(3, 9))    # 9`),
P(`<strong>Raku</strong> uses the ternary operator <code>??</code> and <code>!!</code>, which is compact but is exactly the kind of punctuation puzzle that Logo avoids. (Raku also has a built-in <code>max</code>, as does Python, so in real code you would not write this at all.)`),
RK(`sub bigger($a, $b) { $a > $b ?? $a !! $b }

say bigger(3, 9);      # 9`),
P(`Now the third tool. <code>stop</code> ends the current procedure immediately, which is the command version of <code>output</code>. It is perfect for "bail out early if the input is no good".`),
L(`to guard :n
  if :n < 0 [print [negative input] stop]
  print :n * 2
end

guard -1
guard 4`, {"expect":"negative input\n8"}),
P(`Try it with a bad value and a good one. When the condition is true, the list runs: it prints a message and then <code>stop</code> leaves the procedure before the last line can happen. When the condition is false the list is skipped, and the procedure carries on to the end. Notice that the code after the <code>if</code> needs no <code>else</code> at all. That is the whole charm of early exit.`),
P(`In Python and Raku, early exit is spelled <code>return</code> (with no value). Same idea, same placement, so this technique transfers directly.`),
PY(`def guard(n):
    if n < 0:
        print("negative input")
        return
    print(n * 2)`),
RK(`sub guard($n) {
    if $n < 0 {
        say "negative input";
        return;
    }
    say $n * 2;
}`),
P(`Finally, decisions nest. When you have more than two outcomes, put an <code>ifelse</code> inside the second list of another one.`),
L(`to grade :s
  ifelse :s >= 90 [print "A] [ifelse :s >= 80 [print "B] [print "C]]
end

grade 95
grade 85
grade 50`, {"expect":"A\nB\nC"}),
P(`Count the brackets: the first <code>ifelse</code> takes <code>[print "A]</code> and then a second list that happens to contain a whole other <code>ifelse</code>. It works, but I will be honest: past two or three levels it becomes hard to read, and this is one place where Python's <code>elif</code> and Raku's <code>elsif</code> are friendlier.<sup>[1]</sup>`),
PY(`def grade(s):
    if s >= 90:
        print("A")
    elif s >= 80:
        print("B")
    else:
        print("C")`),
RK(`sub grade($s) {
    if    $s >= 90 { say "A" }
    elsif $s >= 80 { say "B" }
    else           { say "C" }
}`),
P(`That is a fair point in their favour. The compensation, in Logo, is that you can always split a long decision into several small procedures, each with a name, and I would argue that is better design anyway. A last tip: put the interesting test <em>first</em> and the default <em>last</em>, and every branch of your decision will explain itself. Nice little language, isn't it?`),
],
fn: [
 "Other languages let you flatten this with an <code>else if</code> keyword, and I will admit that is a real convenience. Logo's answer, as the next paragraph says, is to split the decision into small named procedures."
],
ex: [
MC(`What happens when the condition of an <code>if</code> is false?`, ["Logo reports an error","Logo runs the list anyway","The list is skipped and execution continues with the next instruction","The procedure stops"], 2, `A false condition skips the list. Only <code>stop</code> or <code>output</code> would end the procedure.`),
MC(`Which description of <code>ifelse</code> is right?`, ["It takes a condition and two lists, and runs exactly one of them","It takes a condition and runs both lists in order","It takes two conditions and one list","It can only be used inside a procedure"], 0, `<code>ifelse</code> takes a condition, a list for the true case and a list for the false case. Exactly one runs.`),
PR(`Here is a procedure with <code>stop</code> in it. What does Logo print?`,
  {before: `to g :n
  if :n = 0 [stop]
  print :n
end`,
     code: `g 0
g 2
g 0
g 3`,
     answer: `2
3`,
     hint: `When n is zero, stop leaves the procedure before print is reached.`,
     explain: `The calls with 0 stop immediately and print nothing. The calls with 2 and 3 reach <code>print</code>.`}),
FI(`Fill in the blank so <code>max.of</code> outputs the larger of its two inputs.`,
  {template: `to max.of :a :b
  output ___ :a > :b [:a] [:b]
end

print max.of 4 9`,
     answer: `ifelse`,
     expect: `9`,
     hint: `It chooses between two values and takes a condition and two lists.`,
     explain: `<code>ifelse</code> used as an operation picks one of two values. <code>max.of 4 9</code> gives 9.`}),
WR(`Write a command <code>classify :n</code> that prints <code>small</code> if <code>:n</code> is less than 10, and <code>big</code> otherwise.`,
  {starter: ``,
     after: `classify 3
classify 50
classify 10`,
     expect: `small
big
big`,
     solution: `to classify :n
  ifelse :n < 10 [print "small] [print "big]
end`,
     hint: `Exactly one of two things should happen, so use ifelse. Note that 10 itself is big.`,
     explain: `<code>ifelse :n < 10 [print "small] [print "big]</code> does it. Two separate <code>if</code> commands would also work if written carefully, but <code>ifelse</code> guarantees exactly one branch.`}),
]});
