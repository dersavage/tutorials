---
title: "15. Teaching the turtle new words"
weight: 15
---

Here's where Logo's two big ideas meet: the turtle, and procedures. You can teach the turtle to draw a shape once, give it a name, and use that name for the rest of your life.

```logo
to square :size
  repeat 4 [fd :size rt 90]
end
cs
square 50
square 20
```

Two squares of different sizes, sharing a corner. `square` takes one input, `:size`, and inside the body that input controls how far to move. Calling `square 50` and `square 20` is one definition giving two answers.

This is the exact moment I wait for in any Logo class. A child realises they can make the language bigger. Not "write a function", just *add a word*. And the word they add is as real as `forward`.

<div class="cmp">Python</div>

```python
import turtle

def square(t, size):
    for _ in range(4):
        t.forward(size)
        t.right(90)

t = turtle.Turtle()
square(t, 50)
square(t, 20)
```

In Python you pass the turtle itself as an input, because the turtle is an *object* and the function needs to be told which one to use. It's more flexible, since you could have five turtles drawing at once, and it demands that the beginner understands what an object is before they've drawn a square. Logo has one turtle and a global state, so there's nothing to pass.

<div class="cmp">Raku</div>

No standard turtle, as before, so here is the same *shape* of idea, a procedure with one input, that you'd use for any repeated job:

```raku
sub square($size) {
    for ^4 { say "forward $size, turn right 90" }
}
square 50;
```

Same structure: input in the title, repeat four times. The only thing missing is the turtle.

Now generalise. A square is four sides with 90-degree turns, a triangle is three sides with 120, a hexagon is six with 60. The turn is always `360 / sides`.

```logo
to polygon :sides :size
  repeat :sides [fd :size rt 360 / :sides]
end
cs
polygon 3 60
polygon 6 40
polygon 8 25
```

One procedure, any regular polygon. `rt 360 / :sides` works because the division happens before `rt` gets its input. Try `polygon 36 10` yourself. A shape with 36 sides is, to the eye, a circle.

That is the moment I want every student to have: noticing that a *circle* is just a polygon with too many sides to see. Mathematicians call that a limit. A ten-year-old with a turtle calls it "a circle".

<div class="cmp">Python</div>

```python
def polygon(t, sides, size):
    for _ in range(sides):
        t.forward(size)
        t.right(360 / sides)
```

Python's version carries on being a good one. I'd only note that `t.right(360 / sides)` needs brackets around the division, and Logo's `rt 360 / :sides` doesn't.

<div class="cmp">Raku</div>

```raku
sub polygon($sides, $size) {
    my $turn = 360 / $sides;
    say "{$sides} sides, turn {$turn} each";
}
polygon 6, 40;     # 6 sides, turn 60 each
```

Without a turtle the output is just numbers. But the key idea, the exterior angle of a regular polygon is `360 / sides`, comes through in any language, and Logo is the only one in which you'd *see* it before you understood it.

{{< quiz >}}
type: choice
q: In `to square :size`, how does the body know how far to move?
o: It always moves 50
o*: It uses the input `:size`
o: It asks the user
why: The input is a variable, and the body uses it in `fd :size`.
===
type: choice
q: In `polygon`, why is the turn `360 / :sides`?
o: It's a guess
o*: The turns around the shape always add up to 360 degrees
o: Because 360 is the default angle
why: Walking all the way round a closed shape turns you through one full revolution, so each corner takes an equal share.
===
type: choice
q: What does `polygon 36 10` look like?
o: A square
o*: Close to a circle
o: A star
hint: Thirty-six very small turns of ten degrees each.
why: With many short sides and small turns, the polygon is effectively round.
===
type: predict
q: Type what this prints.
pre: to polygon :sides :size
pre:   repeat :sides [fd :size rt 360 / :sides]
pre: end
code: polygon 4 10
code: print heading
hint: Four turns of 90 bring the turtle back to where it started.
why: After a full 360 degrees of turning, the turtle is facing its original direction, which is 0.
===
type: write
q: Define `triangle :size` that draws an equilateral triangle (three sides, 120-degree turns), then call `triangle 30` and print the turtle's `heading`.
expect: 0
solution: to triangle :size
solution:   repeat 3 [fd :size rt 120]
solution: end
solution: triangle 30
solution: print heading
hint: Use `repeat 3 [fd :size rt 120]`.
why: Three turns of 120 total 360, so the turtle ends up facing 0 again.
{{< /quiz >}}
