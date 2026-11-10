S({
id: 18,
title: "Lists of lists",
tagline: "A list can hold lists, and that is how a small program stores a small world",
blocks: [
P(`Here is a wonderful secret about Logo: a list can contain <em>anything</em>, including more lists. That single rule is enough to build address books, game boards, family trees and the structure of Logo's own programs. In this lesson we will use it to keep track of a few books.`),
L(`make "book [Dune Herbert 1965]
print item 1 :book
print item 3 :book`, {expect: "Dune\n1965"}),
P(`That is one <em>record</em>: a title, an author, a year, in a fixed order. It is just a list of three words. You and I agree that the first is the title, the second the author, the third the year. Logo does not know or care; the meaning lives in the agreement.`),
P(`Now make a shelf, which is a list of such records. Be careful with the brackets: the outer pair holds the shelf, each inner pair holds one book.`),
L(`make "shelf [[Dune Herbert 1965] [Emma Austen 1815] [Ulysses Joyce 1922]]
print count :shelf
show item 2 :shelf
show item 1 item 2 :shelf`, {expect: "3\n[Emma Austen 1815]\nEmma"}),
P(`Three books on the shelf (<code>count</code> counts the <em>members</em> of the outer list, not all the words), the second book is a list of its own, and <code>item 1 item 2 :shelf</code> reaches in: first get the second book, then take its first item. Read it from right to left, like function composition: inner thing first.`),
P(`<strong>Python</strong> uses exactly the same idea with nested lists, though Python's habit is to reach for a dictionary or a class once a record has several fields, because remembering that "index 2 is the year" gets tedious:`),
PY(`shelf = [["Dune", "Herbert", 1965],
         ["Emma", "Austen", 1815],
         ["Ulysses", "Joyce", 1922]]
print(len(shelf))        # 3
print(shelf[1])          # ['Emma', 'Austen', 1815]
print(shelf[1][0])       # Emma

# the more usual Python record:
book = {"title": "Dune", "author": "Herbert", "year": 1965}`),
RK(`my @shelf = [<Dune Herbert 1965>], [<Emma Austen 1815>], [<Ulysses Joyce 1922>];
say @shelf.elems;      # 3
say @shelf[1];         # [Emma Austen 1815]
say @shelf[1][0];      # Emma

# a Raku record might be a hash:
my %book = title => "Dune", author => "Herbert", year => 1965;`),
P(`Notice Python and Raku both write <code>shelf[1][0]</code>, left to right, with zero-based numbers, and Logo writes <code>item 1 item 2 :shelf</code>, right to left, with one-based ones. Neither is wrong. The bracket form is more compact; the Logo form requires no special syntax at all, which is the whole design goal. (Later, in the property-list lesson, we will see Logo's own answer to "give the fields names".)`),
P(`With a shelf, you will want to <em>do</em> something to every book. The loop to know here is <code>foreach</code>: it runs instructions for each member of a list, with <code>?</code> standing for the current member. We will study it properly later; for now, take it on trust.`),
L(`foreach :shelf [print item 1 ?]`, {expect: "Dune\nEmma\nUlysses"}),
P(`For each book in the shelf, print its first item, the title. And of course you can package this into a procedure that answers a real question. How about: "who wrote this book?"`),
L(`to author.of :title :shelf
  foreach :shelf [if (item 1 ?) = :title [output item 2 ?]]
  output "unknown
end

print author.of "Emma :shelf
print author.of "Ulysses :shelf
print author.of "Hamlet :shelf`, {expect: "Austen\nJoyce\nunknown"}),
P(`The loop checks each book. When the title matches, we <code>output</code> the author straight away, which also ends the whole procedure. If the loop finishes without a match, we fall through to the last line and output <code>unknown</code>. Searching a list of records is such a common job that you will write this shape of code a hundred times.`),
PY(`def author_of(title, shelf):
    for book in shelf:
        if book[0] == title:
            return book[1]
    return "unknown"

print(author_of("Emma", shelf))   # Austen`),
RK(`sub author-of($title, @shelf) {
    for @shelf -> @book {
        return @book[1] if @book[0] eq $title;
    }
    return "unknown";
}
say author-of("Emma", @shelf);   # Austen`),
P(`Almost line for line, the same. That's the point: once you have understood searching a list of lists in one language, you have understood it in all three. The skill transfers; only the punctuation changes.`),
P(`Last, adding a book. We want a new shelf that has one more record on the end. This is <code>lput</code> again, and the new record goes in as <em>one thing</em>, so we pass it as a list:`),
L(`make "shelf lput [Hamlet Shakespeare 1603] :shelf
print count :shelf
print author.of "Hamlet :shelf`, {expect: "4\nShakespeare"}),
N(`<strong>sentence vs list vs lput.</strong> To add a record to a shelf, use <code>lput record shelf</code>. If you used <code>sentence</code> you would flatten the record and end up with a flat list of words, which is the usual accident.`),
],
ex: [
MC(`If <code>:shelf</code> is <code>[[a b] [c d] [e f]]</code>, what is <code>count :shelf</code>?`, ["2", "3", "6", "1"], 1,
  `<code>count</code> counts the members of the outer list: three inner lists.`),
MC(`For <code>make "s [[a b] [c d]]</code>, what is <code>item 2 item 2 :s</code>?`, ["a", "b", "c", "d"], 3,
  `The inner <code>item 2 :s</code> is <code>[c d]</code>; the second item of that is <code>d</code>.`),
PR(`What does this print? Type the output exactly.`,
  {before: `make "pets [[Rex dog] [Tom cat] [Bo bird]]`, code: `print count :pets\nshow item 2 :pets\nprint item 2 item 3 :pets`, answer: "3\n[Tom cat]\nbird",
   hint: "Work from the inside out.",
   explain: `Three records; the second record; the second item of the third record.`}),
FI(`Fill in the blank so Logo prints the age of the second person (<code>41</code>).`,
  {before: `make "people [[Ann 33] [Bob 41] [Cy 27]]`, template: `print item 2 item ___ :people`, answer: "2", expect: "41",
   hint: "Which person is second?",
   explain: `<code>item 2 :people</code> is <code>[Bob 41]</code>; its second item is 41.`}),
WR(`Write a procedure <code>titles :shelf</code> that prints the first item of each record in <code>:shelf</code>, one per line.`,
  {before: `make "shelf [[Dune Herbert 1965] [Emma Austen 1815]]`, starter: "to titles :shelf\n  \nend", after: "titles :shelf", expect: "Dune\nEmma",
   solution: "to titles :shelf\n  foreach :shelf [print item 1 ?]\nend",
   hint: "foreach runs instructions for each member; ? is the current member.",
   explain: `<code>foreach</code> walks the shelf and <code>item 1 ?</code> picks the title of each record.`}),
]});
