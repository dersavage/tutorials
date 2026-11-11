S({
id: 15,
title: "Words: count, item, word, case and characters",
tagline: "Measuring words, picking letters by position, gluing them together and changing their case",
blocks: [
P(`Last lesson you learned to take a word apart one end at a time. That is the right way to <em>think</em>, but sometimes you simply want to know how long a word is, or what its fourth letter is, without peeling anything. UCBLogo has plain, small primitives for exactly this. We will meet five of them: <code>count</code>, <code>item</code>, <code>word</code>, <code>uppercase</code> and <code>lowercase</code>, and then two that connect letters to numbers, <code>ascii</code> and <code>char</code>.`),
P(`<code>count</code> outputs how many things are in its input. For a word that means characters. For a list it means items. For a number it means digits, because a number is just a word that happens to look like a number.`),
L(`show count "hello
show count [a b c]
show count 12345
show count []`, {"expect":"5\n3\n5\n0"}),
P(`One word, four jobs, and it never asks you which kind of thing you gave it. That is Logo's design philosophy in miniature: if the question makes sense, the answer works.`),
P(`<strong>Python</strong> gives you <code>len</code>, which works for strings and lists alike, just as Logo's <code>count</code> does. The one difference is the number case. You cannot take the length of an integer; you have to turn it into a string first, and that small tax catches every beginner once.`),
PY(`print(len("hello"))       # 5
print(len(["a", "b", "c"]))   # 3
print(len(str(12345)))    # 5
# len(12345) is a TypeError`),
P(`<strong>Raku</strong> splits the idea in two. <code>.chars</code> counts the characters of a string and <code>.elems</code> counts the elements of a list. Raku is careful about this, because it knows that "how many characters" in a Unicode string and "how many items" in a list are different questions.`),
RK(`say "hello".chars;     # 5
say <a b c>.elems;    # 3
say 12345.chars;      # 5`),
P(`The Raku split is more precise and the Logo version is more welcoming. For a first course I side with welcoming, and I will tell you why: a beginner has no need yet to distinguish "characters" from "graphemes". They need to count the letters in a name. Logo lets them, with one word.`),
P(`Next, <code>item</code>. It takes a position and a thing, and outputs whatever is at that position. And here is the important bit: <strong>in Logo, counting starts at 1</strong>. The first item is item 1, the way a human would number it.`),
L(`show item 1 "hello
show item 4 "hello
show item 2 [a b c]`, {"expect":"h\nl\nb"}),
P(`The first line gives <code>h</code>, the fourth gives <code>l</code> (h-e-l-l-o, the second <code>l</code> is number four), and the list version gives its second item. If you ask for an item that is not there, say <code>item 9 "hello</code>, Logo complains. Same philosophy as before.`),
P(`<strong>Python</strong> counts from zero, so the same letters sit at different numbers. Experienced programmers defend this with some conviction, and they have decent arguments, mostly about offsets and slicing arithmetic. But watch what it does to a newcomer.`),
PY(`s = "hello"
print(s[0])   # h  -- position 0 is the first letter
print(s[3])   # l  -- position 3 is the fourth letter`),
P(`<strong>Raku</strong> also counts from zero. The syntax for strings goes through <code>.substr</code> (position, then length), and for lists it is the bracket syntax.`),
RK(`say "hello".substr(3, 1);   # l
say <a b c>[1];             # b`),
P(`I want to be fair here. Zero-based indexing is not a mistake; it is a convention with a real history in how computers address memory. But it is a convention you must <em>memorize</em>, and every off-by-one error you will ever write comes out of the gap between "the third letter" in English and "index 2" in code. Logo simply does not have that gap. When you later learn Python, you will meet zero-based counting as an extra rule with a reason, instead of as your first confusing experience with a computer.<sup>[1]</sup>`),
P(`Now <code>word</code>. It glues two things into one word. With the parentheses trick you can glue more than two.`),
L(`show word "sun "flower
show (word "a "b "c)
show word "room 101`, {"expect":"sunflower\nabc\nroom101"}),
P(`You met the parentheses in lesson 3 for adding more than two numbers. The rule is the same here: <code>word</code> normally wants two inputs, and when you want more you wrap the whole instruction in parentheses. Notice also that <code>101</code> is a number and <code>word</code> glues it on without complaint. The result is a word, and that word happens to look like <code>room101</code>. Noice.`),
P(`<strong>Python</strong> glues strings with <code>+</code>, but only if every piece is already a string. Add a string to an integer and you get an error. The cure is an f-string or an explicit <code>str()</code>.`),
PY(`print("sun" + "flower")      # sunflower
print("a" + "b" + "c")       # abc
print("room" + str(101))     # room101
print(f"room{101}")          # room101`),
P(`<strong>Raku</strong> has a dedicated string-concatenation operator, the tilde. It is a nice piece of design: <code>+</code> always means arithmetic and <code>~</code> always means text, so Raku never has to guess what you meant, and it will happily turn the number into text for you.`),
RK(`say "sun" ~ "flower";   # sunflower
say "room" ~ 101;       # room101`),
P(`I find Raku's answer elegant, and it is a good reminder that Logo's blurring of "word" and "number" has a cost: <code>word 1 2</code> makes <code>12</code>, not <code>3</code>. In Logo, you pick the operation, not the type, and the operation tells Logo how to treat the pieces.`),
P(`Now case. <code>uppercase</code> and <code>lowercase</code> do what the names say. Combine them with the tools from last lesson and you can capitalize a word, which is a classic little exercise.`),
L(`show uppercase "hello
show lowercase "HeLLo
show uppercase first "logo
show (word uppercase first "logo bf "logo)`, {"expect":"HELLO\nhello\nL\nLogo"}),
P(`Read the last line from the inside out. <code>first "logo</code> is <code>l</code>, <code>uppercase</code> makes it <code>L</code>, and <code>bf "logo</code> is <code>ogo</code>. <code>word</code> glues them: <code>Logo</code>. Four primitives, one tiny program, no loops, no indexes. Nice, right?`),
P(`<strong>Python</strong> uses methods on the string. Same idea, with the dot syntax. Python even has a built-in for this exact job, <code>capitalize</code>, which is convenient and which also hides the whole lesson in one word.`),
PY(`print("hello".upper())          # HELLO
print("HeLLo".lower())          # hello
print("logo".capitalize())      # Logo
w = "logo"
print(w[0].upper() + w[1:])     # Logo`),
P(`<strong>Raku</strong> keeps methods too, and gives them the short names <code>uc</code> and <code>lc</code>, plus <code>tc</code> for title case.`),
RK(`say "hello".uc;     # HELLO
say "HeLLo".lc;     # hello
say "logo".tc;      # Logo`),
P(`Two last primitives, and they connect letters to numbers. Every character has a code. <code>ascii</code> outputs the code of a character, and <code>char</code> outputs the character for a code. Capital <code>A</code> is 65, lowercase <code>a</code> is 97.`),
L(`show ascii "A
show char 97
show char 1 + ascii "a`, {"expect":"65\na\nb"}),
P(`The last line asks for "the character one after <code>a</code>", and the answer is <code>b</code>. This is the whole secret behind every substitution cipher you will ever write. We will use it later in the course.`),
P(`<strong>Python</strong> calls them <code>ord</code> and <code>chr</code>, which are sound names with a long pedigree and an unhelpful look.`),
PY(`print(ord("A"))        # 65
print(chr(97))         # a
print(chr(ord("a") + 1))   # b`),
P(`<strong>Raku</strong> makes them methods, <code>.ord</code> on a character and <code>.chr</code> on a number.`),
RK(`say "A".ord;    # 65
say 97.chr;     # a`),
P(`And one more check you will use constantly: <code>substringp</code> asks whether the first thing appears inside the second. The "p" ending, as you saw in lesson 5, means it is a predicate and outputs <code>true</code> or <code>false</code>.`),
L(`show substringp "ell "hello
show substringp "xyz "hello`, {"expect":"true\nfalse"}),
P(`Mind the order: the little thing comes first, the big thing second. <code>substringp "ell "hello</code> reads "is <em>ell</em> a substring of <em>hello</em>?" Python says it as <code>"ell" in "hello"</code>, in the same order a human would, and Raku as <code>"hello".contains("ell")</code>, which flips it.`),
PY(`print("ell" in "hello")      # True
print("xyz" in "hello")      # False`),
RK(`say "hello".contains("ell");   # True
say "hello".contains("xyz");   # False`),
P(`That is a full toolbox for words. You can measure them, pick letters from them, glue them, change their case and look at their codes. Nothing else in a first course needs more.`),
],
fn: [
 "The classic counter-argument is that zero-based indexing makes slice arithmetic cleaner. It does. Keep that in your pocket for week six."
],
ex: [
MC(`What does <code>count [[a b] c]</code> output?`, ["<code>3</code>","<code>2</code>","<code>1</code>","<code>4</code>"], 1, `The list has two <em>items</em>: the inner list <code>[a b]</code> and the word <code>c</code>. <code>count</code> does not reach inside the inner list.`),
MC(`In UCBLogo, what does <code>item 1 "cat</code> output?`, ["<code>a</code>","<code>c</code>","<code>t</code>","An error, because there is no item 0"], 1, `Logo counts from 1, so item 1 is the first character: <code>c</code>. Python and Raku count from zero, which is a very common source of off-by-one errors.`),
PR(`What does Logo print? Type the four lines exactly.`,
  {code: `show count "banana
show item 3 "banana
show uppercase "banana
show word "ban "ana`,
     answer: `6
n
BANANA
banana`,
     hint: `b-a-n-a-n-a: the third letter is the first n.`,
     explain: `Six letters; the third is <code>n</code>; <code>uppercase</code> gives <code>BANANA</code>; and <code>word</code> glues <code>ban</code> and <code>ana</code> into <code>banana</code>.`}),
FI(`Fill in the blank to print the character code of <code>Z</code>.`,
  {template: `show ___ "Z`,
     answer: `ascii`,
     expect: `90`,
     hint: `You are going from a letter to a number.`,
     explain: `<code>ascii "Z</code> outputs <code>90</code>. The opposite direction is <code>char</code>.`}),
WR(`Write a procedure called <code>shout</code> that takes a word and <em>prints</em> it in uppercase with an exclamation mark on the end, so that <code>shout "hello</code> prints <code>HELLO!</code>.`,
  {starter: ``,
     after: `shout "hello`,
     expect: `HELLO!`,
     solution: `to shout :w
  print word uppercase :w "!
end`,
     hint: `Two primitives from this lesson, one nested inside the other. The exclamation mark is a quoted word too.`,
     explain: `<code>uppercase :w</code> produces the loud word, and <code>word</code> glues the quoted word <code>"!</code> onto it before <code>print</code> shows it.`}),
]});
