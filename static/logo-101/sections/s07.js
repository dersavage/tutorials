S({
id: 7,
title: "Procedures with inputs",
tagline: "Make one procedure do many jobs by letting it take inputs",
blocks: [
P(`Last lesson's procedures always did exactly the same thing. That is like a calculator with one button. The next step is to let a procedure take <strong>inputs</strong>, so one definition can handle many cases.`),
P(`In UCBLogo you list inputs after the procedure name, each written with a colon. Inside the procedure, they behave just like variables: the colon reads them. When you call the procedure, you supply values after its name, in the same order.`),
L(`to greet :who
  print sentence "hello :who
end
greet "ada
greet "grace
greet [alan turing]`, {expect: "hello ada\nhello grace\nhello alan turing"}),
P(`<code>:who</code> is the input. Each call gives it a different value: a word, a word, then a list. <code>sentence</code> glues its inputs into one list (we will study it later), so <code>print</code> shows <code>hello ada</code>. Logo does not care whether <code>who</code> is a word or a list. That is the lack of type declarations again: the procedure works for anything that makes sense.`),
P(`In <strong>Python</strong>, inputs are called <em>parameters</em>, written inside parentheses and separated by commas:`),
PY(`def greet(who):
    print("hello", who)

greet("ada")
greet("grace")
greet("alan turing")`),
P(`Python's <code>print</code> puts a space between its arguments, so this works too. The Python reader sees parentheses and commas everywhere; Logo's version has only a colon. If you teach beginners, count the punctuation they have to type and you will see why I like Logo's version.`),
P(`<strong>Raku</strong> declares parameters in parentheses as well, with the sigil:`),
RK(`sub greet($who) {
    say "hello $who";
}

greet("ada");
greet("grace");
greet("alan turing");`),
P(`Raku interpolates variables into double-quoted strings, so <code>"hello $who"</code> inserts the value. Logo has no string interpolation; you build the result with <code>sentence</code> or <code>word</code>, which is more laborious but also more transparent.`),
P(`Procedures can take several inputs. List them in order, and supply that many values when you call. Here is a procedure that adds two numbers and prints the result, and one that computes a rectangle's area.`),
L(`to add :a :b
  print :a + :b
end
to area :w :h
  print :w * :h
end
add 2 3
area 4 5
add 10 area 2 3`, {error: true}),
P(`I made that last line wrong on purpose. <code>area</code> <em>prints</em> its answer; it does not <em>give it back</em>, so <code>add</code> cannot use it as an input. Logo reports that <code>area</code> did not output to <code>add</code>. We will fix this properly in the next lesson, with <code>output</code>. For now, learn to spot the message: it means a procedure that was expected to produce a value did not.`),
L(`add 2 3
area 4 5`, {expect: "5\n20"}),
P(`The error cost us the rest of that block, which is why I reran the good lines separately. In Logo an error stops the current line of work and returns you to the prompt. Nothing is broken; you fix and retry.`),
PY(`def add(a, b):
    print(a + b)

def area(w, h):
    print(w * h)

add(2, 3)      # 5
area(4, 5)     # 20
# add(10, area(2, 3))  # prints 6, then TypeError (None + 10 fails)`),
P(`Python makes the same mistake easy and the error message a bit stranger: <code>area</code> returns <code>None</code>, and trying to add that gives a type error. In both languages the cure is the same: make the procedure return its answer instead of printing it.`),
RK(`sub add($a, $b) { say $a + $b }
sub area($w, $h) { say $w * $h }

add(2, 3);     # 5
area(4, 5);    # 20`),
P(`What happens if you give the wrong number of inputs? Logo notices.`),
L(`to greet :who
  print sentence "hello :who
end
greet`, {error: true}),
P(`UCBLogo says <code>not enough inputs to greet</code>. Python says <code>greet() missing 1 required positional argument: 'who'</code>. Raku's message is similar. All three catch it, and all three are readable. Logo's is the shortest.`),
P(`A final point about names. The names of inputs are <em>local</em> to the procedure. If you have a global variable called <code>x</code> and a procedure with an input called <code>x</code>, they do not interfere: inside the procedure, <code>:x</code> is the input.`),
L(`make "x 100
to show.x :x
  print :x
end
show.x 5
print :x`, {expect: "5\n100"}),
P(`Inside <code>show.x</code>, <code>:x</code> was 5; outside, it was still 100. Logo's name for this is <em>scope</em>, and we will cover it carefully in lesson 9. For today, the useful rule is: inputs are private to their procedure.`),
PY(`x = 100
def show_x(x):
    print(x)

show_x(5)   # 5
print(x)    # 100`),
RK(`my $x = 100;
sub show-x($x) { say $x }

show-x(5);   # 5
say $x;      # 100`),
P(`All three agree. If I had to name the one thing to remember from this lesson: <em>an input is a variable that the caller fills in</em>. Write procedures that take inputs, name the inputs well, and each procedure becomes a tool you can reuse.`),
],
ex: [
MC(`How are the inputs of a Logo procedure written in its <code>to</code> line?`,
  ["In parentheses, separated by commas", "After the name, each with a colon", "In square brackets", "On the line after <code>end</code>"], 1,
  `For example <code>to add :a :b</code>. Inside the procedure, <code>:a</code> and <code>:b</code> read them.`),
MC(`A procedure <code>to greet :who</code> is called as just <code>greet</code>. What happens?`,
  ["It prints an empty greeting", "Logo reports not enough inputs to greet", "who becomes 0", "The procedure is erased"], 1,
  `UCBLogo complains: <code>not enough inputs to greet</code>.`),
PR(`What does Logo print? Type it exactly.`,
  {before: `to show.twice :w
  print :w
  print :w
end`, code: `show.twice "hi
show.twice 3 + 4`, answer: "hi\nhi\n7\n7",
   hint: "Logo works out 3 + 4 before the procedure starts.",
   explain: `The input is evaluated first: <code>:w</code> is 7 on the second call, printed twice.`}),
FI(`Fill in the blank so the call prints <code>12</code>.`,
  {before: `to mult :a :b
  print :a * :b
end`, template: `mult 3 ___`, answer: "4", expect: "12",
   hint: "3 times what is 12?",
   explain: `<code>mult 3 4</code> prints 12.`}),
WR(`Define a procedure <code>double</code> with one input <code>:n</code> that prints twice <code>:n</code>. It will then be called with 21.`,
  {starter: "", after: "double 21", expect: "42", solution: `to double :n\n  print :n * 2\nend`,
   hint: "to double :n ... end, with a print of :n * 2 inside.",
   explain: `<code>print :n * 2</code> prints 42 when <code>:n</code> is 21.`}),
]});
