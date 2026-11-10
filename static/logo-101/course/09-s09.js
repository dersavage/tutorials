COURSE.sections.push({
  id: "s09",
  title: "Making decisions",
  tagline: "if, ifelse, comparisons, true and false, and test with iftrue and iffalse",
  blocks: [
    { t: "text", html: `
      <p>Until now every program you wrote did the same thing every time. A program that cannot decide anything is a calculator with extra steps. This section fixes that.</p>
      <p>Logo's decision tools are small and regular. <code>if</code> takes a condition and a list of instructions, and runs the list only when the condition is true. <code>ifelse</code> takes a condition and <em>two</em> lists, and runs exactly one of them. The conditions come from comparisons: <code>=</code>, <code>&lt;</code>, <code>&gt;</code>, <code>&lt;=</code>, <code>&gt;=</code> and <code>&lt;&gt;</code> (not equal).</p>` },
    { t: "logo", code: `make "age 15
if :age > 12 [print [teenager]]
ifelse :age < 18 [print [minor]] [print [adult]]`,
      html: `
      <p>The first line stores 15 in <code>age</code>. The <code>if</code> line compares, finds the answer is true, and runs its list, so you see <code>teenager</code>. The <code>ifelse</code> line picks the first list, so you also see <code>minor</code>. Change 15 to 40 and you get only <code>adult</code>.</p>
      <p>Notice the instructions live inside square brackets. That is not decoration. A list is Logo's way of saying "here is some code, do not run it yet". <code>if</code> decides whether to run it. This is a quiet but powerful idea, and we will lean on it when we reach loops.</p>` },
    { t: "py", code: `age = 15
if age > 12:
    print("teenager")
if age < 18:
    print("minor")
else:
    print("adult")`,
      html: `
      <p>Python reads very well here, and I will not pretend otherwise. The colon and the indentation do the job of Logo's square brackets, and there is no separate <code>if</code> and <code>ifelse</code>: you add an <code>else</code> branch when you want one. For a beginner the indentation is a real advantage, because the layout on the page <em>is</em> the structure. Python also lets you chain comparisons, so <code>0 &lt; age &lt; 18</code> works the way a mathematician would write it. Logo cannot do that.</p>` },
    { t: "raku", code: `my $age = 15;
say "teenager" if $age > 12;
if $age < 18 { say "minor" }
else         { say "adult" }`,
      html: `
      <p>Raku gives you braces for blocks, and a postfix form: <code>say "teenager" if $age &gt; 12</code> reads almost like English. It also has <code>unless</code>, which is <code>if not</code>. Variables carry a <code>$</code> sigil. That is one more symbol than Python or Logo needs, and in return the sigil tells you the kind of thing you are looking at.</p>` },
    { t: "text", html: `
      <p>Now the part that surprises people. What does <code>3 = 3</code> actually <em>produce</em>? A value, like any other expression. In Logo, true and false are ordinary words: <code>true</code> and <code>false</code>. You can print them, store them, and hand them to a procedure.</p>` },
    { t: "logo", code: `print 3 = 3
print 2 <> 3
print equalp "abc "ABC
print equalp [a b] [a b]
make "ok 3 > 2
print :ok
print ifelse 3 > 2 [10] [20]`,
      html: `
      <p>Each comparison prints a word. <code>equalp</code> is the word-style spelling of <code>=</code>: it asks "are these two things equal?", and it works on lists as well as words. Note that it ignores upper and lower case by default, so <code>abc</code> and <code>ABC</code> count as equal. That is a friendly choice for beginners and an irritating one when you need exactness.</p>
      <p>The last line shows that <code>ifelse</code> can also <em>give back a value</em>: it runs one of the lists and returns what that list produces. Use that form sparingly. It is neat in one-liners and hard to read in long ones.</p>` },
    { t: "py", code: `ok = 3 > 2
print(3 == 3)
print(2 != 3)
print("abc" == "ABC")     # False: Python is case sensitive
print(["a", "b"] == ["a", "b"])
print(ok)
print(10 if 3 > 2 else 20)`,
      html: `
      <p>Python has real booleans, <code>True</code> and <code>False</code>, which are not strings. That is stricter than Logo, and it catches mistakes: you cannot confuse the word "true" with the boolean. The equality operator is <code>==</code>, because a single <code>=</code> is assignment. This is a classic trap for beginners. Logo avoids it by using <code>make</code> for assignment, so <code>=</code> only ever means "equal?". Score one for Logo on clarity.</p>` },
    { t: "raku", code: `my $ok = 3 > 2;
say 3 == 3;
say 2 != 3;
say "abc" eq "ABC";       # False
say [1, 2] eqv [1, 2];    # True
say $ok;
say 3 > 2 ?? 10 !! 20;`,
      html: `
      <p>Raku is the fussiest of the three, in a useful way. It has separate operators for numbers (<code>==</code>) and for text (<code>eq</code>), so it never has to guess whether <code>"10"</code> and <code>"10.0"</code> are the same. Its ternary operator is <code>?? !!</code>. If you ever write sorting or search code, that number-versus-text split saves you from a whole family of bugs. For a first lesson it is also one more thing to hold in your head.</p>` },
    { t: "logo", err: true, code: `print "abc < "abd`,
      html: `
      <p>Here is something honest to know early. In UCBLogo the order comparisons <code>&lt;</code> and <code>&gt;</code> only work on numbers, so asking whether one word comes before another is an error. Python happily compares strings alphabetically, and in that respect it is the more capable language. In Logo you would write the comparison yourself, or use <code>beforep</code>.</p>` },
    { t: "text", html: `
      <p>One more tool. Sometimes you test once and want to act on the result in several places. <code>test</code> records a true or false answer, and <code>iftrue</code> and <code>iffalse</code> (or <code>ift</code> and <code>iff</code>) use the most recent answer. Be careful: the remembered answer belongs to the procedure that ran <code>test</code>.</p>` },
    { t: "logo", code: `to check :n
  test :n > 10
  iftrue [print [big]]
  iffalse [print [small]]
end
check 50
check 3`,
      html: `
      <p>Run it and you see <code>big</code>, then <code>small</code>. For a plain two-way choice, <code>ifelse</code> is clearer and I use it nine times out of ten. <code>test</code> earns its keep when several unrelated commands all depend on one earlier check, because you evaluate the condition only once.</p>` },
    { t: "py", code: `def check(n):
    big = n > 10
    if big:
        print("big")
    if not big:
        print("small")

check(50)
check(3)`,
      html: `
      <p>Python has no <code>test</code>. You store the result in a variable and use it later, which is exactly what you would do in Logo too, with <code>make</code>. Honestly, that approach is more flexible, because the variable is visible and you can name it.</p>` },
    { t: "raku", code: `sub check(Int $n) {
    my $big = $n > 10;
    say "big"   if $big;
    say "small" unless $big;
}
check(50);
check(3);`,
      html: `
      <p>Same idea, and <code>unless</code> reads nicely here. Declaring the parameter as <code>Int</code> means Raku rejects <code>check("hello")</code> for you. Logo would try to run it and fail further in, with a less direct message.</p>` },
    { t: "text", h: "My take", html: `
      <p>Logo's decisions are not as elegant as Python's, but they are consistent: a condition is just an expression that gives back a word, and the instructions are just lists. A learner who understands that has understood how <em>every</em> control structure in Logo works, loops included. Python's syntax is nicer to read. Logo's model is smaller to learn.</p>` }
  ],
  recap: `<ul><li><code>if</code> runs a list when the condition is true; <code>ifelse</code> chooses between two lists.</li><li>Comparisons give the words <code>true</code> or <code>false</code>; <code>=</code> only means "equal?", never assignment.</li><li><code>&lt;</code> and <code>&gt;</code> need numbers; <code>equalp</code> ignores case.</li><li><code>test</code> with <code>iftrue</code> and <code>iffalse</code> reuses one answer.</li></ul>`,
  exercises: [
    { type: "mc", q: "<p>What does this print?</p>", code: 'print 5 <> 5',
      options: ["<code>true</code>", "<code>false</code>", "<code>5</code>", "An error"], answer: 1,
      hint: "<code>&lt;&gt;</code> means \"is not equal to\".",
      explain: "<p>5 is equal to 5, so \"not equal\" is false. Comparisons are ordinary expressions and they print as the word <code>false</code>.</p>" },
    { type: "mc", q: "<p>What does <code>print equalp \"Logo \"logo</code> print in UCBLogo?</p>",
      options: ["<code>false</code>, because the capital letters differ", "<code>true</code>, because <code>equalp</code> ignores case by default", "An error, because <code>equalp</code> only takes numbers", "<code>Logo logo</code>"], answer: 1,
      hint: "Think about the friendly default the section mentioned.",
      explain: "<p>UCBLogo ignores case when comparing words with <code>equalp</code> and <code>=</code>, so the two words are equal. Python's <code>==</code> would say <code>False</code>, and that difference catches people moving between the languages.</p>" },
    { type: "predict", q: "<p>What does this program print? Put each output line on its own line.</p>",
      code: `make "n 7
ifelse :n > 5 [print "big] [print "small]
if :n = 7 [print "lucky]
print :n <> 7`,
      solution: "big\nlucky\nfalse",
      hint: "Work through the lines in order. The last line prints a comparison result.",
      explain: "<p>7 is greater than 5, so <code>ifelse</code> runs its first list and prints <code>big</code>. 7 equals 7, so <code>lucky</code> prints. The last line asks whether 7 is not equal to 7, which is <code>false</code>.</p>" },
    { type: "fill", q: "<p>Fill in the blank so the line prints <code>big</code>. Pick the comparison operator.</p>",
      before: 'print ifelse 10 ', after: ' 5 ["big] ["small]', expected: "big", solution: ">",
      hint: "10 compared with 5: which way does the comparison need to go?",
      explain: "<p><code>10 &gt; 5</code> is true, so <code>ifelse</code> gives back <code>big</code> and <code>print</code> shows it. <code>&gt;=</code> and <code>&lt;&gt;</code> would also work here, which is why the checker only compares output.</p>" },
    { type: "write", q: "<p>Write a procedure <code>describe</code> that takes one number and prints <code>big</code> if it is greater than 10, otherwise <code>small</code>. Then call it with 50 and then with 3.</p>",
      expected: "big\nsmall",
      solution: 'to describe :n\n  ifelse :n > 10 [print "big] [print "small]\nend\ndescribe 50\ndescribe 3',
      hint: "Use <code>ifelse</code> inside the procedure body, with one list for each branch.",
      explain: "<p>The procedure takes the input <code>:n</code>, and <code>ifelse</code> chooses one of the two <code>print</code> lists. Calling it twice gives <code>big</code> and then <code>small</code>.</p>" }
  ]
});
