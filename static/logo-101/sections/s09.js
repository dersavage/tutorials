S({
id: 9,
title: "Local variables and scope",
tagline: "where a variable lives, who can see it, and why UCBLogo's answer differs from Python's",
blocks: [
P(`In lesson 4 you learned <code>make</code> and <code>:name</code>. Now that you can write procedures, a question appears that never came up at the keyboard: <strong>when a procedure makes a variable, who gets to see it, and how long does it live?</strong> The technical word is <em>scope</em>. It sounds like computer-science jargon, but it is just the answer to "where can I use this name?"`),
P(`I will give you the Logo answer first and the surprise second. UCBLogo's answer is the opposite of what Python and Raku do by default, and that is worth understanding on its own. (It is also the kind of thing that has started many a quarrel between language designers, so if it feels odd, you are in good company.)`),
P(`Start with the case you already know. An input to a procedure is a variable that belongs to that procedure, and it hides any outside variable with the same name while the procedure runs.`),
L(`make "x 10

to bump :x
  make "x :x + 1
  print :x
end

bump 5
print :x`, {"expect":"6\n10"}),
P(`The procedure's <code>:x</code> started life as 5, became 6, and was printed. After the call, the top-level <code>x</code> is still 10. The input <em>shadowed</em> the outer one: inside <code>bump</code>, the name <code>x</code> meant the input. When <code>bump</code> finished, its <code>x</code> vanished. So far, so good, and identical to what you would expect from Python.`),
PY(`x = 10

def bump(x):
    x = x + 1
    print(x)

bump(5)   # 6
print(x)  # 10`),
RK(`my $x = 10;

sub bump($x is copy) {
    $x += 1;
    say $x;
}

bump(5);   # 6
say $x;    # 10`),
P(`(The Raku <code>is copy</code> is needed because sub parameters are read-only by default. A nice safety feature, though it means one more thing to explain to a beginner.)`),
P(`Now the first difference. What happens when a procedure uses <code>make</code> on a name that is <em>not</em> one of its inputs?`),
L(`to setit
  make "y 99
end

setit
print :y`, {"expect":"99"}),
P(`In UCBLogo, <code>make</code> inside a procedure creates a <strong>global</strong> variable unless you say otherwise. After <code>setit</code> has finished, <code>y</code> is still there, visible everywhere. Some people consider that dangerous. I consider it honest: it is the simplest possible rule, it makes a procedure's side effects visible at the prompt, and a beginner can poke at the variable after the procedure ran. But it does mean your procedures can step on each other's variables, so we need a way to say "this one is private". Your mileage may vary, and so may your opinions.`),
P(`Python goes the other way. Assigning inside a function creates a <em>local</em> variable by default, and you must say <code>global y</code> to reach out.`),
PY(`def setit():
    y = 99        # a new local variable, gone when the function ends

setit()
print(y)          # NameError: name 'y' is not defined

def setit_global():
    global y
    y = 99

setit_global()
print(y)          # 99`),
P(`Raku sides with Python: <code>my</code> declares a lexical variable, and nothing is created implicitly. Without <code>my</code> the compiler refuses to run the program at all, under its default <code>strict</code> mode.`),
RK(`sub setit { my $y = 99; }   # $y exists only inside the sub

our $z;                  # a package-global, declared explicitly
sub set-global { $z = 99 }
set-global;
say $z;                  # 99`),
P(`In Logo the way to get a private variable is the command <code>local</code>, which creates a variable that belongs to the running procedure and disappears when it ends.`),
L(`to try.local
  local "z
  make "z 1
  print :z
end

try.local
print namep "z`, {"expect":"1\nfalse"}),
P(`<code>namep</code> is the predicate that asks "does a variable with this name exist?". After the procedure ended, <code>z</code> was gone, so it answers false. The two-step form (declare, then assign) is so common that UCBLogo offers a shorthand, <code>localmake</code>, which does both.`),
L(`to area :w :h
  localmake "a :w * :h
  output :a
end

print area 3 4
print namep "a`, {"expect":"12\nfalse"}),
P(`Noice. Use <code>localmake</code> for every temporary value you need inside a procedure. It keeps your helper names from leaking into the rest of the program. If you keep one habit from this lesson, keep that one.`),
P(`Now the really interesting difference. Here is a procedure that makes a local variable and then calls <em>another</em> procedure. Does the called procedure see the variable?`),
L(`to outer
  local "v
  make "v 1
  inner
  print :v
end

to inner
  print :v
  make "v 2
end

outer
print namep "v`, {"expect":"1\n2\nfalse"}),
P(`Yes. <code>inner</code> printed 1, even though <code>v</code> was never passed to it, and it even <em>changed</em> the variable: when <code>outer</code> printed <code>:v</code> afterwards it saw 2. This is <strong>dynamic scope</strong>: a procedure can see the variables of whoever called it. The variable lives as long as <code>outer</code> is running, and everything <code>outer</code> calls can use it.<sup>[1]</sup>`),
P(`Python and Raku use <strong>lexical scope</strong>: what you can see depends on where the code is <em>written</em>, not on who called whom. In the Python version, <code>inner</code> cannot see <code>outer</code>'s <code>v</code>, because it is written outside it.`),
PY(`def inner():
    print(v)      # NameError: v is not defined (outer's v is invisible here)

def outer():
    v = 1
    inner()

outer()`),
P(`Raku has lexical scope too, but it also offers dynamic variables on purpose, marked with the <code>*</code> twigil. That is the closest relative to Logo's behaviour, and the fact that it needs special syntax tells you how unusual it is today.`),
RK(`sub inner { say $*v }          # looks for a dynamic variable $*v in the caller
sub outer { my $*v = 1; inner() }

outer;                           # 1`),
P(`So which is better for a beginner? Honestly, lexical scope is better for large programs, because you can understand a function by reading it alone. Dynamic scope is better for a lesson like this one, because it matches how a person traces a program: "while <code>outer</code> is running, <code>v</code> is 1". For the small programs in this course you will rarely depend on it. The takeaway is simpler: use <code>localmake</code> for temporaries, use inputs for things passed in, and avoid reaching for globals unless you mean to. Nice little language, isn't it?`),
],
fn: [
 "Dynamic scope is the older way. Early Lisps worked like this, and later Lisps and most modern languages moved to lexical scope. Logo, as Lisp's friendly cousin, kept the old way, so it still shows you what the old way felt like."
],
ex: [
MC(`In UCBLogo, what does <code>make "y 5</code> do when it appears inside a procedure and <code>y</code> is not one of its inputs and was not declared <code>local</code>?`, ["Creates a variable that exists only until the procedure ends","Creates (or changes) a global variable that remains after the procedure ends","Causes an error","Does nothing"], 1, `<code>make</code> creates or changes a global variable unless the name is an input or has been declared <code>local</code>. That is the opposite of Python's default.`),
MC(`<code>outer</code> declares a <code>local "v</code>, gives it a value, then calls <code>inner</code>. Can <code>inner</code> read <code>:v</code> in UCBLogo?`, ["No: only outer can see its own local variable","Yes: UCBLogo uses dynamic scope, so callees can see the caller's locals","Only if v is passed as an input","Only if inner is defined first"], 1, `Logo's scope is dynamic. While <code>outer</code> is running, its local variables are visible to every procedure it calls.`),
PR(`What does Logo print? (Remember that an input hides the global with the same name.)`,
  {before: `to f :x
  make "x :x * 2
  print :x
end
make "x 3`,
     code: `f 5
print :x`,
     answer: `10
3`,
     hint: `Inside f, x means the input, not the global.`,
     explain: `Inside <code>f</code>, <code>x</code> is the input 5, which becomes 10 and is printed. The global <code>x</code> was never touched, so the last line prints 3.`}),
FI(`Fill in the blank so the variable <code>c</code> disappears after <code>count.up</code> finishes.`,
  {template: `to count.up
  ___ "c
  make "c 5
  print :c
end

count.up
print namep "c`,
     answer: `local`,
     expect: `5
false`,
     hint: `Declare c as private to the procedure before assigning it.`,
     explain: `<code>local "c</code> makes <code>c</code> belong to the running procedure. After <code>count.up</code> ends the variable no longer exists, so <code>namep "c</code> is false.`}),
WR(`Write a command <code>box :n</code> that uses <code>localmake</code> to store <code>:n * :n</code> in a variable called <code>sq</code> and prints it. Afterwards, <code>sq</code> must not exist.`,
  {starter: ``,
     after: `box 6
print namep "sq`,
     expect: `36
false`,
     solution: `to box :n
  localmake "sq :n * :n
  print :sq
end`,
     hint: `localmake takes a quoted name and a value.`,
     explain: `<code>localmake "sq :n * :n</code> creates the local and gives it a value in one step. Since it is local, <code>namep "sq</code> is false afterwards.`}),
]});
