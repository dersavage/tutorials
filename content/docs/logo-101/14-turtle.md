---
title: "14. Meet the turtle"
weight: 14
---

Logo is famous for the turtle, and I'm not going to pretend it's a gimmick. The turtle is the reason Logo exists. Seymour Papert, who built Logo with colleagues at MIT in the 1960s, wanted children to **think about their own movement** to learn geometry. You tell the turtle to walk forward; it draws a line; you can see what you did.

```logo
fd 50
rt 90
fd 50
print pos
print heading
```

Run it, and a drawing appears under the output. `fd 50` moves forward 50 steps (`forward` also works), `rt 90` turns right 90 degrees. `pos` is the turtle's position and `heading` is the direction it's facing: `0` is straight up, `90` is right.

The turtle starts in the middle, at `[0 0]`, facing up. After `fd 50 rt 90 fd 50`, it's at `[50 50]` and facing right.

What makes the turtle work is that its commands are **relative to the turtle**, not to the screen. "Forward" means forward *from where the turtle's pointing*. If you were the turtle, you'd work it out by walking the path. Papert called this *body-syntonic* learning, and it's why seven-year-olds who can't do coordinate geometry can draw a perfect square on the first try.

<div class="cmp">Python</div>

```python
import turtle

t = turtle.Turtle()
t.forward(50)
t.right(90)
t.forward(50)
print(t.pos())
print(t.heading())
```

I'll give Python full credit: it has a turtle module in the standard library, and it's a direct descendant of Logo's. But look at the cost. You `import` a module, make a turtle object, and call *methods* with dots and brackets. Python's turtle also heads *east* (`0` degrees) at the start, where Logo's heads *north*. Different convention, same idea.

<div class="cmp">Raku</div>

Raku doesn't ship a turtle in its standard distribution. If you wanted one, you'd reach for a module from the ecosystem or write SVG output by hand. That isn't a criticism of Raku, which was never meant to be a teaching language, but it makes the point: Logo's turtle isn't an add-on. It's baked in from the first prompt.

Now more turtle vocabulary. The pen can be lifted so the turtle moves without drawing, and you can pick a colour.

```logo
cs
setpc 4
repeat 3 [fd 60 rt 120]
pu
fd 20
pd
setpc 2
repeat 4 [fd 40 rt 90]
```

`cs` clears the screen and sends the turtle home. `setpc 4` sets the pen colour (4 is red; 2 is green). The first `repeat` draws a triangle: three sides, turning 120 degrees each time. `pu` lifts the pen up, `fd 20` moves without drawing, `pd` puts the pen down, and the second `repeat` draws a green square.

Notice that `repeat` is working on turtle commands just as happily as on `print`. The same `repeat` you learned in section 13 now draws shapes, and you didn't learn a single new rule. Logo is mostly this: a small number of ideas that combine freely.

<div class="cmp">Python</div>

```python
import turtle
t = turtle.Turtle()
t.pencolor("red")
for _ in range(3):
    t.forward(60)
    t.right(120)
t.penup()
t.forward(20)
t.pendown()
t.pencolor("green")
for _ in range(4):
    t.forward(40)
    t.right(90)
```

It works, and it's more typing than the Logo, with `t.` in front of every command. Python also lets you use colour names (`"red"`), which is friendlier than Logo's colour *numbers*. I'll concede that one.

<div class="cmp">Raku</div>

There's no counterpart to show here, but here's the arithmetic that makes the triangle work, in Raku:

```raku
say 360 / 3;   # 120, the turn for each corner of a triangle
say 360 / 4;   # 90, for a square
```

Every closed polygon with equal sides turns a total of 360 degrees. That's the observation we'll turn into a procedure in the next section.

{{< quiz >}}
type: choice
q: Where does the turtle start?
o: At the top left, facing right
o*: In the middle of the screen, facing up
o: Off screen
why: The turtle starts at `[0 0]` with heading `0`, pointing straight up.
===
type: choice
q: What does `rt 90` do?
o: Moves the turtle right by 90 steps
o*: Turns the turtle 90 degrees to its right
o: Rotates the screen
why: `rt` is a turn. Moving forward is `fd`.
===
type: choice
q: Which pair lifts the pen so the turtle can move without drawing, then puts it back?
o: `up` and `down`
o: `penoff` and `penon`
o*: `pu` and `pd`
why: `pu` is pen up and `pd` is pen down.
===
type: predict
q: Type what this prints. (The turtle starts at `[0 0]` facing up.)
code: fd 100
code: rt 90
code: fd 50
code: print pos
hint: Up 100, then turn to face right and go 50.
why: After going up 100 the turtle is at `[0 100]`. Facing right, 50 more steps takes it to `[50 100]`.
===
type: write
q: Turn the turtle right by 90 degrees and then print its `heading`.
expect: 90
solution: rt 90
solution: print heading
hint: Two commands.
why: The turtle began facing 0 (up), and turning right by 90 makes it face 90.
{{< /quiz >}}
