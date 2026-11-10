---
title: "20. Building words and characters"
weight: 20
---

Taking words apart is half the job. The other half is putting them together, and the key command is the one you met in section 2: `word`.

```logo
print word "sun "flower
print uppercase "hello
print lowercase "SHOUT
print ascii "A
print char 97
```

Output: `sunflower`, `HELLO`, `shout`, `65`, `a`. `uppercase` and `lowercase` do what they say. `ascii` turns a character into its number: every letter has a code, and `A` is 65. `char` goes the other way: code 97 is `a`.

That last pair is quietly the most important thing in the section. **A letter is a number.** Once you can turn a letter into a number and back, you can do arithmetic on letters, and arithmetic on letters is how all of cryptography starts.

<div class="cmp">Python</div>

```python
print("sun" + "flower")
print("hello".upper())
print("SHOUT".lower())
print(ord("A"))
print(chr(97))
```

Python's names are `ord` and `chr`, from the old C world. Logo's `ascii` and `char` are a little friendlier. Note too that Python wants `+` for joining strings and `.upper()` as a *method*, where Logo uses its usual prefix form `uppercase "hello`. Logo has one calling convention. Python has two, functions and methods, and you have to know which is which.

<div class="cmp">Raku</div>

```raku
say "sun" ~ "flower";
say "hello".uc;
say "SHOUT".lc;
say "A".ord;
say 97.chr;
```

Raku joins strings with `~`, a deliberate choice so that `+` always means maths. The methods are short (`.uc`, `.lc`, `.ord`, `.chr`) and they chain neatly. Raku's design here is clean and consistent.

Let's use letters-as-numbers to build a **Caesar cipher**, the code Julius Caesar supposedly used: shift every letter along the alphabet by a fixed amount.

```logo
to shift :letter :n
  output char 97 + remainder ((ascii :letter) - 97 + :n) 26
end
print shift "a 3
print shift "z 3
```

Output: `d` and `c`. The recipe: turn the letter into its code (`ascii`), subtract 97 so `a` becomes 0, add the shift, wrap round with `remainder ... 26` so `z` plus 3 goes back to the start, then add 97 again and turn it back into a letter with `char`. That's a lot of steps, and I find it satisfying every time: it's the first time a student sees maths *do something to text*.

Now the whole word, using recursion from the last section.

```logo
to caesar :w :n
  if emptyp :w [output "]
  output word (shift first :w :n) (caesar butfirst :w :n)
end
print caesar "hello 3
print caesar caesar "hello 3 23
```

Output: `khoor`, then `hello`. Encrypting with a shift of 3, then "decrypting" by shifting 23 more (3 + 23 is 26, a full lap), gets you back where you started. And with a shift of 13, you get the famous **ROT13**, which is its own inverse: apply it twice, and you're home.

<div class="cmp">Python</div>

```python
def shift(letter, n):
    return chr((ord(letter) - 97 + n) % 26 + 97)

def caesar(w, n):
    return "".join(shift(c, n) for c in w)

print(caesar("hello", 3))
```

Python's version uses `"".join(...)` and a generator expression, which is idiomatic and takes a lesson to explain. Logo's recursion is longer and, for a beginner, easier to follow: it is *exactly* what the words say.

<div class="cmp">Raku</div>

```raku
sub shift-letter($c, $n) { chr((ord($c) - 97 + $n) % 26 + 97) }
sub caesar($w, $n) { $w.comb.map({ shift-letter($_, $n) }).join }
say caesar "hello", 3;
```

Raku's `.comb` splits a string into letters, `.map` applies a function and `.join` puts it back. As with Python, a pipeline is the way to do it, and it's shorter than recursion once you're comfortable with it. We'll meet Logo's `map` in section 23.

{{< quiz >}}
type: choice
q: What does `print ascii "A` print?
o: `A`
o*: `65`
o: `97`
why: `ascii` turns a character into its code. The code for capital A is 65.
===
type: choice
q: What does `print char 98` print?
o*: `b`
o: `98`
o: An error
why: `char` is the opposite of `ascii`: code 98 is the letter `b`.
===
type: choice
q: Why does `shift` use `remainder ... 26`?
o: To make the answer smaller
o*: To wrap round, so `z` shifted by 3 goes back to the start of the alphabet
o: Because 26 is the code for `z`
why: There are 26 letters, so the remainder after dividing by 26 wraps the alphabet into a circle.
===
type: predict
q: Type what this prints.
code: print word "rain "bow
code: print uppercase "logo
code: print ascii "a
why: `rainbow`, `LOGO`, and the code for lowercase a, which is 97.
===
type: write
q: Write a command that prints the word `LOGO` in capitals, starting from the lowercase word `logo`.
expect: LOGO
solution: print uppercase "logo
hint: There is a command named `uppercase`.
why: `uppercase` converts every letter.
{{< /quiz >}}
