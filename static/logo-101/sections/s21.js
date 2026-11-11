S({
id: 21,
title: "Recursion III: words and lists",
tagline: "Chewing through a word one letter at a time, using first and butfirst",
blocks: [
P(`There is one pattern that does most of the work in Logo, and once you see it, you will see it everywhere. It is this: handle the <code>first</code> piece, hand the <code>butfirst</code> to yourself, and stop when nothing is left. It works on words, because a word is a string of letters, and it works on lists, because a list is a string of items. UCBLogo's <code>first</code> and <code>butfirst</code> (shortened to <code>bf</code>) work on both. One pair of words, two kinds of data. Nice, right?`),
P(`Let us reverse a word. The reverse of the empty word is the empty word. The reverse of anything else is the reverse of <em>everything but the first letter</em>, with the first letter stuck on the end.`),
L(`to reverse.word :w
  if emptyp :w [output "]
  output word (reverse.word bf :w) first :w
end

print reverse.word "logo
print reverse.word "stressed`, {"expect":"ogol\ndesserts"}),
P(`A few things to look at. First, the base case outputs <code>"</code> on its own, a quote mark with nothing after it. That is the empty word. Second, <code>word</code> glues two words together, so <code>word (reverse.word bf :w) first :w</code> takes the reversed tail and attaches the first letter to the back. Third, I named it <code>reverse.word</code> because UCBLogo already has a primitive <code>reverse</code> for lists. The dot in a name is allowed and is the Logo habit for "this is a variant of that".`),
P(`<strong>Python</strong> beginners almost never write this. They write <code>w[::-1]</code>, a slice with a step of -1, which is concise and totally opaque to someone seeing it for the first time. If you do want the recursion, strings slice just like lists.`),
PY(`def reverse_word(w):
    if w == "":
        return ""
    return reverse_word(w[1:]) + w[0]

print(reverse_word("logo"))   # ogol
print("logo"[::-1])           # ogol, the idiom`),
P(`Compare the shapes. <code>w[1:]</code> is "butfirst" and <code>w[0]</code> is "first", and they are two cryptic bits of punctuation where Logo uses two plain English words. The idiomatic one-liner is shorter. I would still teach the recursive one first, because you can say it out loud.`),
P(`<strong>Raku</strong> has a method that does it for you, <code>.flip</code>, and the recursive version looks like this. Raku's <code>substr</code> takes a start position and an optional length, counting from zero.`),
RK(`sub reverse-word(Str $w) {
    return '' if $w eq '';
    return reverse-word($w.substr(1)) ~ $w.substr(0, 1);
}

say reverse-word("logo");   # ogol
say "logo".flip;            # ogol`),
P(`The <code>~</code> is Raku's string-joining operator, which is a good idea: it keeps "add numbers" and "glue text" as different operators so you never have to guess whether <code>+</code> will add or concatenate. Logo gets the same clarity from using <code>sum</code> for numbers and <code>word</code> for text. Noice.`),
P(`Now a predicate, a procedure whose name ends in <code>p</code> and which outputs <code>true</code> or <code>false</code>. A <em>palindrome</em> reads the same both ways, like <code>level</code>. The recursive idea is lovely: a word is a palindrome if its first and last letters match and what is between them is also a palindrome. Words of length 0 or 1 are palindromes automatically.`),
L(`to palindromep :w
  if (count :w) < 2 [output "true]
  if (first :w) <> (last :w) [output "false]
  output palindromep butfirst butlast :w
end

print palindromep "level
print palindromep "banana
print palindromep "abba`, {"expect":"true\nfalse\ntrue"}),
P(`This one removes letters from <em>both</em> ends each time, with <code>butfirst butlast :w</code>. Read it right to left: take the butlast, then the butfirst of that. It still shrinks every call, so it still ends. Notice also the two base cases: one for "success, nothing left to compare", and one for "failure, mismatch found". Recursive procedures often have more than one way to stop.`),
P(`<strong>Python</strong> has the famous one-liner. It is wonderful and it hides every bit of the thinking.`),
PY(`def is_palindrome(w):
    return w == w[::-1]

print(is_palindrome("level"))    # True
print(is_palindrome("banana"))   # False`),
P(`This is the honest trade-off. In a job, the one-liner wins every time. In a classroom, the Logo version teaches you to break a problem into a small step plus a smaller problem, and that habit is what carries over to trees, parsers and every harder thing you will meet. A student who has only ever seen <code>w[::-1]</code> has nothing to carry.<sup>[1]</sup>`),
P(`<strong>Raku</strong> has the same shortcut with <code>.flip</code>, and because <code>eq</code> compares strings, it reads almost as English.`),
RK(`sub is-palindrome(Str $w) { $w eq $w.flip }

say is-palindrome("level");    # True
say is-palindrome("banana");   # False`),
P(`Last in this lesson, counting. How many vowels are in a word? The base case is zero for the empty word. Otherwise look at the first letter: if it is a vowel, the answer is one plus the count for the rest, and if it is not, the answer is just the count for the rest. First I need to know whether a letter is a vowel, and <code>memberp</code> tells me whether something is in a collection. It works on a word too, where the word is treated as a collection of letters.`),
L(`to vowelp :c
  output memberp :c "aeiou
end

to count.vowels :w
  if emptyp :w [output 0]
  ifelse vowelp first :w ~
    [output 1 + count.vowels bf :w] ~
    [output count.vowels bf :w]
end

print count.vowels "banana
print count.vowels "rhythm`, {"expect":"3\n0"}),
P(`The <code>~</code> at the end of a line means "this instruction continues on the next line", which keeps long <code>ifelse</code> lines tidy. Notice that <code>vowelp</code> is a small helper with a name that explains itself. I like building a program from little procedures like that: each one is easy to test by typing <code>print vowelp "e</code> and looking at the result.`),
P(`<strong>Python</strong> would count with a loop and a generator expression, and honestly that is the better tool here.`),
PY(`def count_vowels(w):
    return sum(1 for ch in w if ch in "aeiou")

print(count_vowels("banana"))   # 3
print(count_vowels("rhythm"))   # 0`),
P(`<strong>Raku</strong> would use a regex to pick out the vowels, then count the matches.`),
RK(`say "banana".comb(/<[aeiou]>/).elems;   # 3
say "rhythm".comb(/<[aeiou]>/).elems;   # 0`),
P(`The honest summary of this lesson: in both comparison languages, you would almost never recurse over letters, because they give you better tools. In Logo, recursion <em>is</em> the tool, and that is why it makes a good place to learn it. When you meet an iterator, a generator or a regex later, you will know what they are doing underneath.`),
],
fn: [
 "\"Nothing to carry\" is the whole argument. I have met people who can write the one-liner and cannot explain why it works."
],
ex: [
MC(`What does <code>bf "a</code> output (the <code>butfirst</code> of a one-letter word)?`, ["An error","The word <code>a</code>","The empty word","The number 0"], 2, `Removing the only letter leaves nothing: the empty word. That is why <code>emptyp</code> works as a base case when you chew through a word.`),
MC(`Why does <code>reverse.word</code> eventually stop?`, ["Logo stops after 100 calls","Each call passes a shorter word, and the empty word hits the base case","The <code>word</code> command ends it","It doesn't, it only seems to"], 1, `Each call gets <code>bf :w</code>, one letter shorter. After as many calls as there are letters, the word is empty and the base case answers.`),
PR(`Type what Logo prints. <code>reverse.word</code> is already defined.`,
  {before: `to reverse.word :w
  if emptyp :w [output "]
  output word (reverse.word bf :w) first :w
end`,
     code: `print reverse.word "abc
print count reverse.word "hello`,
     answer: `cba
5`,
     hint: `The second line counts letters in the reversed word.`,
     explain: `<code>reverse.word "abc</code> is <code>cba</code>. Reversing does not change the length of <code>hello</code>, so <code>count</code> gives 5.`}),
FI(`Complete the mismatch case so that <code>palindromep "hello</code> prints false.`,
  {template: `to palindromep :w
  if (count :w) < 2 [output "true]
  if (first :w) <> (last :w) [output ___]
  output palindromep butfirst butlast :w
end
print palindromep "level
print palindromep "hello`,
     answer: `"false`,
     expect: `true
false`,
     hint: `It is a quoted word, like the one in the line above.`,
     explain: `When the ends do not match, the answer is the word <code>false</code>. Written with a quote: <code>"false</code>.`}),
WR(`Write <code>doubleall</code>, which takes a word and outputs it with every letter doubled. For example <code>doubleall "abc</code> outputs <code>aabbcc</code>. Use recursion with <code>first</code> and <code>butfirst</code>.`,
  {starter: ``,
     after: `print doubleall "abc
print doubleall "hi`,
     expect: `aabbcc
hhii`,
     solution: `to doubleall :w
  if emptyp :w [output "]
  output (word first :w first :w doubleall bf :w)
end`,
     hint: `Same skeleton as reverse.word: empty word as base case. Use word with three inputs inside parentheses.`,
     explain: `Handle the first letter twice, then glue on the doubled version of the rest. The parentheses let <code>word</code> take three inputs.`}),
]});
