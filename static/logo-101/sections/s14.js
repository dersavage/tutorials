S({
id: 14,
title: "Words: first, last, butfirst, butlast",
tagline: "Four small tools that take any word apart, one end at a time",
blocks: [
P(`Most languages hand you a word as a block of text and then make you learn an indexing syntax to get at the pieces. Logo does something different, and I think it is the single best idea in the whole language: it gives you four verbs for taking a word apart, and every one of them works on the <em>ends</em>. You never say "give me the character at position 3". You say "give me the first one", or "give me everything but the first one".`),
P(`Here are the first two. In UCBLogo, <code>first</code> outputs the first character of a word and <code>last</code> outputs the last one.`),
L(`show first "hello
show last "hello`, {"expect":"h\no"}),
P(`Nothing mysterious. <code>"hello</code> is a quoted word, <code>first</code> grabs the left end, <code>last</code> grabs the right end. Notice that Logo does not care that the input is "text". A word is a word, and a number is a word too, so <code>first 345</code> gives you <code>3</code>. Try that yourself in the playground at the bottom.`),
P(`<strong>In Python</strong>, a string is a sequence, and you reach into it with square brackets. Index zero is the first character. A negative index counts from the end, which is a lovely trick once you know it and a baffling one before.`),
PY(`s = "hello"
print(s[0])    # h
print(s[-1])   # o`),
P(`<strong>In Raku</strong>, a string is not directly indexable like that. You either chop it into characters with <code>.comb</code> and take the ends, or use <code>.substr</code>. Both are fine, and both are longer than Python.`),
RK(`say "hello".comb.head;   # h
say "hello".comb.tail;   # o`),
P(`I will be honest: for someone who already knows what an index is, <code>s[0]</code> is perfectly good. But look at what you need to know first. You need to know that counting starts at zero, that negative numbers mean "from the right", and that square brackets are the indexing operator. That is three ideas before you have taken apart a single word. In Logo the words <em>first</em> and <em>last</em> already mean what they say.<sup>[1]</sup>`),
P(`Now the other two. <code>butfirst</code> outputs everything <em>except</em> the first character, and <code>butlast</code> outputs everything except the last. UCBLogo lets you abbreviate them to <code>bf</code> and <code>bl</code>, and you will see the short forms everywhere in real Logo code.`),
L(`show butfirst "hello
show butlast "hello
show bf "hello
show bl "hello`, {"expect":"ello\nhell\nello\nhell"}),
P(`Think of these as "what is left over". <code>first "hello</code> is the thing you took, <code>butfirst "hello</code> is the pile you did not take. Put them together and you have the whole word again: <code>h</code> plus <code>ello</code>. That pairing, the piece and the leftover, is the engine behind almost every list and word algorithm you will write in Logo, and it is how you will do recursion in a few lessons. Noice.`),
P(`<strong>Python</strong> spells "everything but the first" as a slice. The colon is doing real work: <code>s[1:]</code> means "from position 1 to the end", and <code>s[:-1]</code> means "from the start up to, but not including, the last".`),
PY(`s = "hello"
print(s[1:])    # ello
print(s[:-1])   # hell`),
P(`Slices are powerful. They can take any middle chunk, step by twos, even reverse a string with <code>s[::-1]</code>. That is where Python is stronger than Logo: Logo has no slice syntax at all. But it is also where a beginner gets lost. Is the end included? Which side of the colon is which? Logo's <code>butfirst</code> has no such questions.`),
P(`<strong>In Raku</strong>, <code>.substr(1)</code> starts at position 1 and runs to the end, and <code>.chop</code> removes the final character.`),
RK(`say "hello".substr(1);   # ello
say "hello".chop;        # hell`),
P(`Raku's names are good here, honestly. <code>chop</code> is a nice little word. The trouble is that there is no matching method for "drop the first character", so you fall back to <code>substr</code> and its numbers. Logo has a complete set: two ends, two leftovers, four words, no numbers.`),
P(`Everything above works on lists too, and the behavior is the same, which is the point. A list is a row of items, and <code>first</code> takes the leftmost item, not the leftmost character.`),
L(`show first [a b c]
show last [a b c]
show bf [a b c]
show bl [a b c]`, {"expect":"a\nc\n[b c]\n[a b]"}),
P(`Look carefully at the last two lines. <code>first</code> and <code>last</code> give back a single item, so there are no brackets. <code>butfirst</code> and <code>butlast</code> give back a <em>list</em>, because what is left over is still a row of items, so the brackets stay. This trips people up the first time, so check it with <code>show</code> when you are not sure. Remember from lesson 1 that <code>show</code> tells you the truth.`),
P(`<strong>Python</strong> uses the same square brackets for lists as for strings, so the code from before just works. Indexing a list gives you an item; slicing a list gives you a list. It is the same distinction Logo makes, spelled with different punctuation.`),
PY(`xs = ["a", "b", "c"]
print(xs[0])     # a
print(xs[-1])    # c
print(xs[1:])    # ['b', 'c']
print(xs[:-1])   # ['a', 'b']`),
P(`<strong>In Raku</strong>, arrays are indexed with the same square brackets, and the <code>*</code> inside the brackets means "the end", so <code>*-1</code> is the last element.`),
RK(`my @xs = <a b c>;
say @xs[0];         # a
say @xs[*-1];       # c
say @xs[1..*];      # (b c)
say @xs[0..*-2];    # (a b)`),
P(`That last line is correct Raku and I would not wish it on a beginner. <code>0..*-2</code> means "from zero to two before the end". It works, and it is also exactly the kind of expression you have to stop and decode. Compare it with <code>bl</code>. LOL.`),
P(`What happens at the edges? Take the first of nothing and Logo complains, loudly and helpfully. But taking the butfirst of a one-character word is fine; you just get the empty word, which shows as a blank line.`),
L(`show bf "a
print count bf "a`, {"expect":"\n0"}),
P(`The empty word is a real thing in Logo, with a count of zero. And <code>first</code> of the empty word is an error, because there is no first character to give you.`),
L(`show first []`, {"error":true}),
P(`The error message is useful: <code>first doesn't like [] as input</code>. Look at that: Logo tells you the primitive that complained and the input it did not like. A message a beginner can actually read. You will learn to love those messages, and in lesson 29 we spend a whole lesson on reading them.`),
P(`<strong>Python</strong> is inconsistent in a way that bites. Indexing an empty string raises an <code>IndexError</code>, but slicing it quietly returns another empty string.`),
PY(`s = ""
print(s[1:])      # prints an empty line, no error
print(s[0])       # IndexError: string index out of range`),
P(`<strong>Raku</strong> is more forgiving. Ask for an element that is not there and you get an undefined value rather than a crash.`),
RK(`my @e;
say @e[0];    # (Any)`),
P(`Both choices are defensible. Python's slicing rule is deliberate and handy once you know it. Raku's undefined values are a design decision with a long history. But I prefer Logo's stance for a first language: if you ask for something that cannot exist, you hear about it right away, and the message names the guilty word.`),
P(`Finally, because each of these four verbs outputs a value, you can nest them. To get the third character of a word, take the first of the butfirst of the butfirst. Read it from the right: peel two off the front, then take the first of what is left.`),
L(`show first bf bf "hello`, {"expect":"l"}),
P(`Is that the fastest way to get the third character? No. Lesson 15 gives you <code>item</code>, which is. But peeling is the way of thinking you need for recursion, and you will use it constantly by lesson 19. Python would write <code>"hello"[2]</code> and Raku would write <code>"hello".substr(2, 1)</code>, both shorter, and both teaching you less about the shape of the problem. Nice little language, isn't it?`),
],
fn: [
 "Yes, I know. Programmers count from zero for good reasons, and I have defended them at length elsewhere. I just do not think zero belongs in the first ten minutes."
],
ex: [
MC(`What does <code>butlast "hello</code> output?`, ["<code>o</code>","<code>ello</code>","<code>hell</code>","<code>h</code>"], 2, `<code>butlast</code> outputs everything except the last character, so you are left with <code>hell</code>. <code>ello</code> is what <code>butfirst</code> gives you.`),
MC(`What does <code>first [[a b] c]</code> output?`, ["<code>a</code>","<code>[a b]</code>","<code>[[a b] c]</code>","<code>c</code>"], 1, `The list has two items: the list <code>[a b]</code> and the word <code>c</code>. <code>first</code> gives you the first <em>item</em>, which is the whole inner list. Logo does not reach inside it.`),
PR(`What does Logo print? Type the four lines exactly.`,
  {code: `show first "logo
show last "logo
show bf "logo
show bl "logo`,
     answer: `l
o
ogo
log`,
     hint: `first and last give one character; butfirst and butlast give what is left over.`,
     explain: `<code>first</code> gives <code>l</code>, <code>last</code> gives <code>o</code>, <code>bf</code> drops the <code>l</code> to leave <code>ogo</code>, and <code>bl</code> drops the final <code>o</code> to leave <code>log</code>.`}),
FI(`Fill in the blank so Logo prints the <em>last</em> letter of the word.`,
  {template: `show ___ "planet`,
     answer: `last`,
     expect: `t`,
     hint: `You want the right end of the word, not the left.`,
     explain: `<code>last "planet</code> outputs <code>t</code>.`}),
WR(`Write a procedure called <code>second</code> that takes one input and <em>outputs</em> the second character of a word. Hint: peel, then take.`,
  {starter: ``,
     after: `print second "hello`,
     expect: `e`,
     solution: `to second :w
  output first bf :w
end`,
     hint: `Take the butfirst of the word, then take the first of that. Use output, not print.`,
     explain: `<code>bf :w</code> drops the first character, and <code>first</code> of what remains is the second character of the original.`}),
]});
