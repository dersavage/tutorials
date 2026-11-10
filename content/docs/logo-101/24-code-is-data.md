---
title: "24. Code is data"
weight: 24
---

I've been hinting at this for ten sections, and now we can say it out loud. In Logo, **a program is just a list**, and a list is just data. That sounds like a gimmick; it's actually the idea that made Lisp famous, and Logo is Lisp in disguise.

```logo
make "step [print "hello]
run :step
run :step
```

Output: `hello` twice. `:step` holds a list. We're not storing a message *about* the instruction; we're storing the instruction itself. `run` takes a list and does what it says. That's why `if`, `repeat` and `foreach` could take lists in square brackets. They're calling `run` on them behind the scenes.

Now the part that makes people sit up. If code is a list, you can *build* code with the same list tools you already know.

```logo
make "op "sum
print run (list :op 3 4)
print apply "sum [3 4]
print apply [? * ?] [7]
```

Output: `7`, `7`, `49`. The first line *builds* the list `[sum 3 4]` out of the pieces `sum`, `3` and `4`, then runs it. The second does the same with `apply`, which takes a procedure (by name, or as a list) and a list of its inputs. The third squares a number with an anonymous recipe.

Does that seem trivial? Think about what it means. The program can decide *at run time* which procedure to use. It could be a calculator, a game engine reading commands from a player, a rule engine. Logo calls this *reflection*, and nearly every Logo trick that looks like magic uses it.

<div class="cmp">Python</div>

```python
import operator

op = "sum"
print(eval("3 + 4"))                       # works, and dangerous
print(operator.add(3, 4))
print((lambda x: x * x)(7))
```

Python's `eval` can do this: run a string as code. It's also one of the most dangerous functions in the language, because if the string came from a user, they can run anything on your computer. The *safe* Python way is to pass functions around (`operator.add`, or a `lambda`), which is more like what Logo's `apply` does. Logo gets away with `run` because a Logo list can only contain Logo, in a sandbox.

<div class="cmp">Raku</div>

```raku
say EVAL "3 + 4";
say &infix:<+>(3, 4);
say (-> $x { $x * $x })(7);
```

Raku has `EVAL` (shouty on purpose, a warning), and also lets you reach into the language's own operators by name (`&infix:<+>`). A pointy block `-> $x { ... }` is its anonymous function. It's all there, and all more arcane than a list.

Let's put it to work with a procedure that takes the *operation itself* as an input.

```logo
to calc :op :a :b
  output apply :op list :a :b
end
print calc "sum 3 4
print calc "product 3 4
print calc "power 2 10
```

Output: `7`, `12`, `1024`. One procedure, any two-input operation you care to name. The name arrives as an ordinary input, and `apply` uses it. A beginner's first calculator has a pile of `if` statements ("if the operator is plus, then..."). This one has none, because it's *data-driven*: the data says what to do.

If you take one idea away from this section, take this one: **good programs often let the data decide, instead of writing a new `if` for every case.** It will save you from thousands of lines of code over a career.

<div class="cmp">Python</div>

```python
import operator

ops = {"sum": operator.add, "product": operator.mul, "power": operator.pow}

def calc(op, a, b):
    return ops[op](a, b)

print(calc("sum", 3, 4))
print(calc("power", 2, 10))
```

The idiomatic Python is a **dictionary of functions**: look the name up in a table, and call it. It's the same data-driven idea. You need to know what a dictionary is, what `operator` is and how to call the result, which makes it a lot to take in at once.

<div class="cmp">Raku</div>

```raku
my %ops = sum => &infix:<+>, product => &infix:<*>, power => &infix:<**>;
sub calc($op, $a, $b) { %ops{$op}($a, $b) }
say calc "sum", 3, 4;
say calc "power", 2, 10;
```

Raku's hash of functions is the same pattern with a slightly different spelling. Same idea in all three; Logo's version just has the fewest moving parts.

{{< quiz >}}
type: choice
q: What does `run` do?
o: Starts the turtle
o*: Treats a list as instructions and carries them out
o: Loops forever
why: `run` is how a list of data becomes running code.
===
type: choice
q: What does `apply "sum [3 4]` do?
o: Defines a procedure called sum
o*: Calls `sum` with the inputs 3 and 4, giving 7
o: Prints the list
why: `apply` takes a procedure and a list of its inputs.
===
type: choice
q: What does "data-driven" mean?
o: The program stores data on disk
o*: The data decides what the program does, instead of a new `if` for every case
o: The program has no procedures
why: Passing the operation as data lets one procedure handle many cases.
===
type: predict
q: Type what this prints.
code: make "cmd [print "hi]
code: run :cmd
code: print apply "sum [10 5]
hint: Two different ways of running something.
why: `hi`, then 15.
===
type: write
q: Use `apply` to print the product of 6 and 7.
expect: 42
solution: print apply "product [6 7]
hint: `apply "product [6 7]`.
why: `apply` gives the inputs to the named operation.
{{< /quiz >}}
