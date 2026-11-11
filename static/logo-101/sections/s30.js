S({
id: 30,
title: "Capstone: a word-game toolkit",
tagline: "Pig Latin and a secret code, built entirely from pieces you already know",
blocks: [
P(`You've come a long way. Thirty lessons ago you typed <code>print "hello</code>. Now you can write procedures, make decisions, loop, recurse, pull words and lists apart, use higher-order commands, and keep records in arrays and property lists. In this last lesson I want you to stop learning new things and just <em>use</em> what you have, to build two small word games. Nothing here needs a command you haven't met.`),
P(`<strong>Game one: Pig Latin.</strong> The rule: if a word starts with a vowel, add <code>ay</code> to the end. If it starts with consonants, move all the leading consonants to the end, then add <code>ay</code>. So <em>apple</em> becomes <em>appleay</em> and <em>string</em> becomes <em>ingstray</em>. Start with the smallest piece, a test for vowels, which you wrote in lesson 17:`),
L(`to vowelp :letter
  output memberp :letter [a e i o u]
end

print vowelp "a
print vowelp "z`, {"expect":"true\nfalse"}),
P(`Small, named, testable. Now the main idea, which is recursive. If the first letter is a vowel, we're done: tack on <code>ay</code>. Otherwise, move that first letter to the back and try again. Each trip around moves one consonant, so the word gets closer to starting with a vowel. That's the base case and the progress rule, straight out of lesson 19.`),
L(`to pig.word :w
  if vowelp first :w [output word :w "ay]
  output pig.word word butfirst :w first :w
end

print pig.word "apple
print pig.word "string
print pig.word "cat`, {"expect":"appleay\ningstray\natcay"}),
P(`Trace <code>pig.word "string</code> in your head. <code>s</code> is not a vowel, so it moves to the back: <code>trings</code>. Then <code>t</code> moves: <code>ringst</code>. Then <code>r</code> moves: <code>ingstr</code>. Now it starts with <code>i</code>, a vowel, so we add <code>ay</code>: <code>ingstray</code>. Noice.`),
PY(`def vowelp(letter):
    return letter in "aeiou"

def pig_word(w):
    if vowelp(w[0]):
        return w + "ay"
    return pig_word(w[1:] + w[0])

print(pig_word("string"))   # ingstray

# the loop version most Python programmers would write:
def pig_word2(w):
    i = 0
    while not vowelp(w[i]):
        i += 1
    return w[i:] + w[:i] + "ay"`),
RK(`sub pig-word($w) {
    return $w ~ "ay" if $w.substr(0, 1) (elem) <a e i o u>;
    pig-word($w.substr(1) ~ $w.substr(0, 1));
}
say pig-word("string");    # ingstray`),
P(`All three solve it the same way, and the Python and Raku code is just as short. The difference you should feel is in the <em>reading</em>: <code>word butfirst :w first :w</code> says "the rest of the word, then the first letter", with no indexes and no slicing. The tools Logo gave you in the first twenty lessons make this problem almost write itself.`),
P(`To handle a whole sentence, <code>map</code> does the work. A word-level procedure, plus <code>map</code>, gives a sentence-level one:`),
L(`to pig.sentence :s
  output map "pig.word :s
end

show pig.sentence [pig latin is fun]`, {"expect":"[igpay atinlay isay unfay]"}),
P(`One line. That's the payoff of the style you've been learning: write the small version, test it, then let <code>map</code> lift it over a list.`),
PY(`def pig_sentence(s):
    return [pig_word(w) for w in s.split()]

print(pig_sentence("pig latin is fun"))`),
RK(`sub pig-sentence($s) { $s.words.map(&pig-word) }
say pig-sentence("pig latin is fun");`),
P(`<strong>Game two: a secret code.</strong> A Caesar cipher shifts every letter a fixed number of places along the alphabet. With a shift of 3, <em>a</em> becomes <em>d</em>, <em>b</em> becomes <em>e</em>, and <em>z</em> wraps around to <em>c</em>. The wrapping is a job for <code>remainder</code> (lesson 11), and the conversion from a letter to a number and back is done with <code>ascii</code> and <code>char</code> (lesson 15).`),
L(`to shift.letter :c :n
  output char 97 + remainder ((ascii :c) - 97 + :n) 26
end

print shift.letter "a 3
print shift.letter "z 3`, {"expect":"d\nc"}),
P(`Unpack it from the inside out. <code>ascii :c</code> turns the letter into its code number (97 for <code>a</code>). Subtract 97 and you have a position in the alphabet, 0 to 25. Add the shift, take the remainder after dividing by 26 so that it wraps, add 97 again, and turn the number back into a letter with <code>char</code>. Real arithmetic, built from tools you can name.`),
P(`Now shift a whole word, recursively, with the same shape as every word-walking procedure you've written:`),
L(`to caesar.word :w :n
  if emptyp :w [output "]
  output word (shift.letter first :w :n) (caesar.word butfirst :w :n)
end

print caesar.word "hello 3
print caesar.word caesar.word "hello 3 23`, {"expect":"khoor\nhello"}),
P(`<code>hello</code> becomes <code>khoor</code>. To decode, you shift by the <em>rest of the way round</em>: 26 minus 3 is 23. Shifting by 3 and then by 23 totals 26, a complete lap, which is why <code>hello</code> comes back. You've just built, and broken, one of the oldest ciphers in history. (It's trivially easy to break, by the way: try each of the 25 shifts, or count letter frequencies as in lesson 27.)`),
PY(`def shift_letter(c, n):
    return chr(97 + (ord(c) - 97 + n) % 26)

def caesar(w, n):
    return "".join(shift_letter(c, n) for c in w)

print(caesar("hello", 3))          # khoor
print(caesar(caesar("hello", 3), 23))   # hello`),
RK(`sub shift-letter($c, $n) { chr(97 + (ord($c) - 97 + $n) % 26) }
sub caesar($w, $n) { $w.comb.map({ shift-letter($_, $n) }).join }
say caesar("hello", 3);               # khoor
say caesar(caesar("hello", 3), 23);   # hello`),
P(`Look at the three versions side by side. Python and Raku are compact, and you'd write them in a line or two. Logo is longer. But notice something: in every case you did exactly the same <em>thinking</em>. Break the problem into a letter-level piece and a word-level piece, and apply the first across the second. That thinking is the skill. The syntax around it is a coat you change when you change languages.`),
P(`<strong>So where does Logo stand?</strong> I'll be honest with you, because I promised to be from the first lesson. Logo is not what you'll be paid to write. It lacks the libraries, the web frameworks, and the vast community of Python. It doesn't have Raku's wonderful grammars and its astonishing range of ideas. If your goal is a job next month, learn Python next.`),
P(`But as a <em>first</em> language, Logo has qualities no other mainstream choice matches. The vocabulary is tiny and readable. Words, lists, procedures and recursion are all there in their purest form. The interpreter answers instantly, and its error messages talk like people. You never had to fight the syntax, and I think that's why you got as far as you did. The ideas you learned here (decomposition, recursion, lists of lists, mapping and filtering, testing small pieces) move into Python and Raku with almost no change. Only the spelling differs. Nice little language, isn't it? :)`),
P(`<strong>What next?</strong> Three suggestions. First, install a real copy of UCBLogo and try it on your own computer: it adds file handling and turtle graphics, which this course left out. Second, re-solve some of the exercises in Python and in Raku, and notice what's easier and what's harder. Third, write something of your own: a quiz, a word counter, a little text adventure. A program you wanted is worth ten you were assigned. Thank you for working through the course. Now go and make something.`),
N(`<strong>Challenge:</strong> extend <code>pig.word</code> so a word with <em>no</em> vowels (like "my" or "gym", if you treat y as a consonant) doesn't loop forever. What should the base case be?`),
],
fn: [],
ex: [
MC(`What is the base case of <code>pig.word</code>?`, ["The word is empty","The first letter is a vowel","The word has more than five letters","The word ends in ay"], 1, `Once the word starts with a vowel we stop moving letters and add <code>ay</code>.`),
MC(`In the Caesar cipher, why do we take <code>remainder ... 26</code>?`, ["To make the letters uppercase","To wrap around from z back to a","To count the vowels","To reverse the word"], 1, `The remainder after dividing by 26 keeps the position within 0 to 25, so <code>z</code> shifted by 3 wraps to <code>c</code>.`),
PR(`What does this print? Type the output exactly.`,
  {before: `to vowelp :letter
  output memberp :letter [a e i o u]
end
to pig.word :w
  if vowelp first :w [output word :w "ay]
  output pig.word word butfirst :w first :w
end`,
     code: `print pig.word "egg
print pig.word "plum`,
     answer: `eggay
umplay`,
     hint: `egg starts with a vowel. plum moves p, then l.`,
     explain: `<code>egg</code> + <code>ay</code>. For <code>plum</code>: p and l move to the end, giving <code>um</code> + <code>pl</code> + <code>ay</code>.`}),
FI(`Fill in the blank so that shifting <code>b</code> by 1 gives <code>c</code>.`,
  {before: `to shift.letter :c :n
  output char 97 + remainder ((ascii :c) - 97 + :n) 26
end`,
     template: `print shift.letter "b ___`,
     answer: `1`,
     expect: `c`,
     hint: `How far is it from b to c?`,
     explain: `A shift of 1 moves each letter one place along.`}),
WR(`Write <code>caesar.sentence :s :n</code>, which applies <code>caesar.word</code> with shift <code>:n</code> to every word in the list <code>:s</code> and outputs the new list. Use <code>map</code>. (<code>caesar.word</code> is already defined.)`,
  {before: `to shift.letter :c :n
  output char 97 + remainder ((ascii :c) - 97 + :n) 26
end
to caesar.word :w :n
  if emptyp :w [output "]
  output word (shift.letter first :w :n) (caesar.word butfirst :w :n)
end`,
     starter: `to caesar.sentence :s :n
  
end`,
     after: `show caesar.sentence [hello world] 1`,
     expect: `[ifmmp xpsme]`,
     solution: `to caesar.sentence :s :n
  output map [caesar.word ? :n] :s
end`,
     hint: `map with a recipe that calls caesar.word on the current member ?. The shift :n is an input of the enclosing procedure.`,
     explain: `<code>map [caesar.word ? :n] :s</code> applies the word shifter to each word, and <code>:n</code> is still visible inside the recipe.`}),
]});
