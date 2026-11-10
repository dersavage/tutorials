COURSE.sections.push({
  id: "s02",
  title: "Words, numbers, lists, arrays",
  tagline: "the four kinds of data, and the predicates that tell them apart",
  blocks: [
    { t: "text", html:
      "<p>Logo has fewer data types than most languages, and I count that as a feature. You get <strong>words</strong>, <strong>numbers</strong>, <strong>lists</strong> and <strong>arrays</strong>. Numbers are really a special case of words, so some people say three kinds. I say four, because you will treat them as four.</p>" +
      "<p>A <em>word</em> is a string of characters: <code>\"hello</code>. A <em>number</em> is what you expect: <code>42</code> or <code>3.5</code>. A <em>list</em> is an ordered collection in square brackets, and it can hold words, numbers and other lists. An <em>array</em> is a fixed-size collection with fast access by position. We meet arrays properly in section 19; today we only need to know they exist.</p>" +
      "<p>The question you will ask constantly is: what kind of thing am I holding? Logo answers with <strong>predicates</strong>, operations whose names end in <code>p</code> and which output <code>true</code> or <code>false</code>.</p>" },
    { t: "logo", code: 'print wordp "hello\nprint wordp [hello]\nprint listp [hello]\nprint numberp 42\nprint numberp "hello',
      html:
      "<p>Each predicate takes one input and answers a yes or no question. <code>wordp</code> asks \"is this a word?\", <code>listp</code> asks \"is this a list?\", <code>numberp</code> asks \"is this a number?\". The output is, in order: <code>true</code>, <code>false</code>, <code>true</code>, <code>true</code>, <code>false</code>.</p>" +
      "<p>Notice <code>[hello]</code> is a list that contains one word. It is not a word. Beginners trip on this a lot, and I do not think it is silly: in English, a sentence with one word in it feels like the word. Logo is stricter, and the strictness is useful.</p>" +
      "<p>The trailing <code>p</code> is a convention that goes back to Lisp, where it stands for \"predicate\". You will write your own predicates later in the course and give them the same ending.</p>" },
    { t: "py", code: 'print(isinstance("hello", str))\nprint(isinstance(["hello"], list))\nprint(isinstance(42, int))\nprint(isinstance("hello", int))',
      html:
      "<p>Python does the same job with <code>isinstance(value, type)</code>. It is more general: it works for any class, including ones you define. It is also two arguments and a type name, where Logo gives you one short word per question. For a first week of programming, I prefer Logo's version. For a third year of programming, I prefer Python's.</p>" +
      "<p>One real difference: in Python the string <code>\"42\"</code> is a string and never a number. Logo is looser, as we will see in a moment.</p>" },
    { t: "raku", code: 'say "hello" ~~ Str;\nsay <hello> ~~ Str;\nsay 42 ~~ Int;\nsay (1, 2, 3) ~~ List;',
      html:
      "<p>Raku uses the smartmatch operator <code>~~</code>: \"does this value match this type?\". It reads nicely once you know it, and it does far more than type checks (it also matches patterns and ranges). The cost is that you have to know about <code>Str</code>, <code>Int</code>, <code>Rat</code>, <code>Num</code> and <code>List</code> as separate types, because Raku really does distinguish them. Logo's four kinds are easier to hold in your head.</p>" },
    { t: "logo", code: 'print numberp "42\nprint wordp 42\nprint emptyp []\nprint emptyp "\nprint emptyp [a]\nprint equalp "abc "abc\nprint equalp [a b] [a b]\nprint equalp 3 3.0',
      html:
      "<p>Here is the looseness. <code>\"42</code> is a word, but its characters look like a number, so <code>numberp</code> says <code>true</code>. And <code>wordp 42</code> is also <code>true</code>: every number is a word. Logo does not make you convert text to numbers before you do arithmetic, which is convenient for a learner reading input, and occasionally surprising for a programmer who wanted a strict boundary.</p>" +
      "<p><code>emptyp</code> is true for the empty list <code>[]</code> and for the empty word (a lone <code>\"</code>). It is the predicate behind almost every recursive procedure you will write, so remember it.</p>" +
      "<p><code>equalp</code> compares two values for sameness. Lists are compared item by item, and numbers are compared as numbers, so <code>3</code> and <code>3.0</code> are equal. Words are compared ignoring case, which I will show you in a later section.</p>" },
    { t: "py", code: 'print("42".isdigit())        # looks like a number\nprint(isinstance("42", int))  # but is not one\nprint(not [])                 # an empty list is falsy\nprint(["a", "b"] == ["a", "b"])\nprint(3 == 3.0)',
      html:
      "<p>Python splits the two questions that Logo blurs. <code>\"42\".isdigit()</code> asks whether the characters are digits, and <code>isinstance</code> asks about the type. Empty collections are \"falsy\", so <code>not []</code> works, and idiomatic Python tests emptiness that way rather than with a named predicate. And <code>==</code> compares lists element by element, as <code>equalp</code> does.</p>" +
      "<p>Honest take: Python's strictness catches bugs in big programs. Logo's looseness removes friction in small ones. Both are right for their audience.</p>" },
    { t: "raku", code: 'say "42".Int + 1;\nsay [].elems == 0;\nsay <a b> eqv <a b>;\nsay 3 == 3.0;',
      html:
      "<p>Raku converts on request: <code>\"42\".Int</code> turns the string into a number, and then <code>+ 1</code> works. Emptiness is a question you ask with <code>.elems</code>, the count of elements. For comparing two lists as whole values Raku has <code>eqv</code>, a separate operator for \"equivalent values\". Numeric <code>==</code> treats <code>3</code> and <code>3.0</code> as equal, just like Logo.</p>" },
    { t: "text", h: "A word of warning about arrays", html:
      "<p>You may be tempted to treat arrays as \"lists but faster\". They are not interchangeable. <code>arrayp</code> is true only for arrays, and <code>listp</code> is false for them. We will build them in section 19, where the reason they exist will make sense. For now: four kinds of data, one predicate for each kind, and <code>emptyp</code> and <code>equalp</code> for the two questions you will ask most.</p>" }
  ],
  recap: "<ul><li>Four kinds of data: word, number, list, array.</li><li>Predicates end in <code>p</code> and output <code>true</code> or <code>false</code>: <code>wordp</code>, <code>numberp</code>, <code>listp</code>, <code>arrayp</code>, <code>emptyp</code>, <code>equalp</code>.</li><li>Every number is a word, and a list holding one word is still a list.</li></ul>",
  exercises: [
    { type: "mc", q: "<p>What does this print?</p>", code: 'print wordp 12',
      options: ["<code>true</code>", "<code>false</code>", "An error, because 12 is not quoted", "<code>12</code>"], answer: 0,
      hint: "Think about whether a number counts as a special kind of word.",
      explain: "<p>In Logo every number is also a word, so <code>wordp 12</code> is <code>true</code>. Numbers do not need a quote, because Logo knows a bare number is data and not a procedure name.</p>" },
    { type: "mc", q: "<p>Which of these prints <code>true</code>?</p>",
      options: ["<code>print emptyp [a]</code>", "<code>print emptyp \"</code>", "<code>print listp \"hello</code>", "<code>print wordp [hello]</code>"], answer: 1,
      hint: "Three of these are about a thing that is not empty, or not the kind asked about.",
      explain: "<p>A lone <code>\"</code> is the empty word, so <code>emptyp</code> says <code>true</code>. <code>[a]</code> has one item, <code>\"hello</code> is a word and not a list, and <code>[hello]</code> is a list and not a word.</p>" },
    { type: "predict", q: "<p>What does this print? Put each output on its own line.</p>",
      code: 'print numberp "42\nprint wordp 42\nprint equalp 3 3.0\nprint equalp "a "b', solution: "true\ntrue\ntrue\nfalse",
      hint: "A word that looks like a number is still accepted by numberp.",
      explain: "<p><code>\"42</code> looks like a number, so <code>numberp</code> says true. <code>42</code> is a number and numbers are words. <code>3</code> and <code>3.0</code> are equal as numbers. <code>a</code> and <code>b</code> are different words.</p>" },
    { type: "fill", q: "<p>Fill in the predicate so the program prints <code>true</code>.</p>",
      before: "print ", after: " [a b]", expected: "true", solution: "listp",
      hint: "The input is in square brackets.",
      explain: "<p><code>[a b]</code> is a list, so <code>listp</code> answers <code>true</code>. <code>wordp</code>, <code>numberp</code> and <code>emptyp</code> would all say <code>false</code>.</p>" },
    { type: "write", q: "<p>Write two lines. The first prints whether <code>hello</code> (as a word) is a word. The second prints whether the list <code>[hello]</code> is a word.</p>",
      expected: "true\nfalse", solution: "print wordp \"hello\nprint wordp [hello]",
      hint: "The word needs a leading quote. The list needs square brackets.",
      explain: "<p><code>\"hello</code> is a word, so the first line prints <code>true</code>. <code>[hello]</code> is a list holding one word, so the second prints <code>false</code>. That difference is the one beginners miss most often.</p>" }
  ]
});
