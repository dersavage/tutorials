---
title: "19. Taking words apart"
weight: 19
---

In section 3 you took lists apart with `first`, `last`, `butfirst`, `butlast`, `item` and `count`. The surprise: the same six words work on **words**, letter by letter.

```logo
print first "banana
print last "banana
print butfirst "banana
print butlast "banana
print item 3 "banana
print count "banana
```

Output: `b`, `a`, `anana`, `banan`, `n`, `6`. A word is a sequence of characters, and Logo lets you treat it like any other sequence. You've now learned one vocabulary that works on both lists and words. In other languages, string functions and list functions are two separate worlds.

<div class="cmp">Python</div>

```python
w = "banana"
print(w[0])
print(w[-1])
print(w[1:])
print(w[:-1])
print(w[2])
print(len(w))
```

I want to be fair here: Python's indexing works the same way on strings and lists too, which is very much in the spirit of Logo. The notation `w[1:]` and `w[:-1]` takes some learning (what is that colon? what does -1 mean?) while `butfirst` and `butlast` are just English.

<div class="cmp">Raku</div>

```raku
my $w = "banana";
say $w.substr(0, 1);
say $w.substr(*-1);
say $w.substr(1);
say $w.chop;           # all but the last
say $w.substr(2, 1);
say $w.chars;
```

Raku has its own set of string methods, each with its own name and its own argument conventions. Nothing wrong with it. It's just more vocabulary than Logo's six words.

Since `butfirst` shrinks a word by one letter, and `first` grabs the leading letter, you can walk down a word with **recursion**, the same way you walked down a countdown.

```logo
to backwards :w
  if emptyp :w [output "]
  output word (backwards butfirst :w) first :w
end
print backwards "logo
print backwards "stressed
```

Output: `ogol` and `desserts`. The base case is the empty word: backwards of nothing is nothing (a quote with nothing after it is the empty word). The step: reverse everything *except* the first letter, then stick the first letter on the end.

And once you can reverse, a **palindrome** test is a one-liner. A palindrome reads the same both ways:

```logo
to palindromep :w
  output equalp :w backwards :w
end
print palindromep "level
print palindromep "logo
```

Output: `true` and `false`. Look at what happened. We wrote small procedures, each doing one thing, and the third one, `palindromep`, *reads like the definition*: a palindrome is a word that equals its own reverse.

<div class="cmp">Python</div>

```python
def backwards(w):
    if w == "":
        return ""
    return backwards(w[1:]) + w[0]

def is_palindrome(w):
    return w == w[::-1]
```

Python's recursive `backwards` is the same as Logo's. But the idiomatic way to reverse a string is the slice `w[::-1]`: a cryptic spell that does the whole job. Concise, and impossible to understand until someone explains it.

<div class="cmp">Raku</div>

```raku
sub is-palindrome($w) { $w eq $w.flip }
say is-palindrome "level";
say is-palindrome "logo";
```

Raku's `.flip` reverses a string and the name says what it does. That's a better bit of design than Python's `[::-1]`. In real work I'd write the Raku version. In a *classroom*, I'd still ask students to build `backwards` themselves, because building it is how you learn to think about it.

{{< quiz >}}
type: choice
q: What is `butlast "banana`?
o: `a`
o: `anana`
o*: `banan`
why: `butlast` outputs everything except the last character.
===
type: choice
q: Which words work on both words and lists?
o: Only `first` and `last`
o*: `first`, `last`, `butfirst`, `butlast`, `item` and `count`
o: None of them
why: Logo treats words and lists as sequences, so one vocabulary works for both.
===
type: choice
q: What is the base case of `backwards`?
o: A word of length 1
o*: The empty word
o: The word `logo`
hint: Which word can't be split any further?
why: `emptyp :w` catches the empty word. A one-letter word is handled by the step.
===
type: predict
q: Type what this prints.
code: print first "cat
code: print butfirst "cat
code: print last "cat
code: print count "cat
why: `c`, then `at`, then `t`, then 3.
===
type: write
q: Print the second letter of the word `planet`.
expect: l
solution: print item 2 "planet
hint: `item 2` picks the second.
why: `item` works on words as well as lists.
{{< /quiz >}}
