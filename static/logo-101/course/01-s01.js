COURSE.sections.push({
  id: "s01",
  title: "Talking to Logo",
  tagline: "print, show, type, and the difference between a word and a list",
  blocks: [
    { t: "text", html:
      "<p>Let me start with an opinion: the first ten minutes of any language should let you <em>do something and see it</em>. No project folder, no imports, no boilerplate. Logo is very good at this. You type a line, Logo runs it, and if the line produces a value, Logo shows it to you.</p>" +
      "<p>We are using <strong>UCBLogo</strong> throughout, and I will say so again later because it matters. Here is the first thing to try.</p>" },
    { t: "logo", code: 'print "Hello\nprint [Hello, world]\nshow [Hello, world]',
      html:
      "<p>Three lines, three small lessons. <code>print</code> is a <strong>command</strong>: it shows its input and moves to a new line. The first line gives it a <em>word</em>, and a word starts with a double quote and has no closing one. The second line gives it a <em>list</em>, which is anything in square brackets.</p>" +
      "<p>The third line is the interesting one. <code>show</code> prints the value the way Logo stores it, brackets included. <code>print</code> trims the outermost brackets, because it assumes you want something readable. When you are debugging, <code>show</code> tells the truth and <code>print</code> tells you a tidy story.</p>" },
    { t: "py", code: 'print("Hello")\nprint(["Hello", "world"])      # shows brackets and quotes\nprint("Hello, world")',
      html:
      "<p>Python has only one flavour of <code>print</code>, and it always calls <code>str()</code> on whatever you hand it. Print a list and you see the brackets and the quote marks, which is what Logo's <code>show</code> does. To get the tidy version you have to build the string yourself. There is no rule here, just a habit: Python wants you to be explicit about types, Logo lets one command work on many shapes of data.</p>" },
    { t: "raku", code: 'say "Hello";\nsay <Hello world>;      # a list of words\nput "Hello, world";',
      html:
      "<p>Raku is the one that surprised me. It has two printers, much like Logo. <code>say</code> prints a value in its \"gist\" form (a list comes out in parentheses, like <code>(Hello world)</code>), while <code>put</code> prints the plain string form. <code>&lt;Hello world&gt;</code> is a quote-words list. If you like Logo's casual attitude to lists of words, Raku will feel familiar. It also makes you end statements with a semicolon, which Logo never asks of you.</p>" },
    { t: "logo", code: 'type "ab\ntype "cd\nprint "\nprint [one two three]',
      html:
      "<p><code>type</code> prints without moving to the next line. Two <code>type</code> commands in a row glue their output together on one line: <code>abcd</code>. The bare <code>print \"</code> prints an empty word, which is a neat way to end the line.</p>" +
      "<p>That is the whole output story. Everything else in Logo's printing is a variation on <code>print</code>, <code>show</code> and <code>type</code>.</p>" },
    { t: "py", code: 'print("ab", end="")\nprint("cd", end="")\nprint()\nprint("one two three")',
      html:
      "<p>Python has no separate <code>type</code> command. Instead <code>print</code> takes a keyword argument, <code>end</code>, that decides what to put after the text. It works, but it is an extra idea to learn on day one, and the default is hidden. In Logo the two behaviours have two names.</p>" },
    { t: "raku", code: 'print "ab";\nprint "cd";\nput "";\nput "one two three";',
      html:
      "<p>Raku's <code>print</code> is the no-newline version, so it lines up with Logo's <code>type</code>. A trailing <code>put</code> gives you the newline back. Raku and Logo both give the \"no newline\" case its own verb; Python makes you remember a keyword.</p>" },
    { t: "text", h: "Why this is a good first lesson", html:
      "<p>A beginner can read <code>print [Hello, world]</code> and guess what happens. There is no <code>main</code>, no class, no type declaration. The language gets out of the way. That is the whole case for Logo as a teaching language, and I will keep coming back to it as the sections go on.</p>" }
  ],
  recap: "<ul><li><code>print</code> trims the outer brackets; <code>show</code> keeps them; <code>type</code> doesn't end the line.</li><li>A word starts with <code>\"</code>. A list sits in <code>[ ]</code>.</li></ul>",
  exercises: [
    { type: "mc", q: "<p>Which command prints a list <em>with</em> its outer square brackets?</p>",
      options: ["<code>print</code>", "<code>show</code>", "<code>type</code>", "<code>say</code>"], answer: 1,
      hint: "One of them shows the value the way Logo stores it.",
      explain: "<p><code>show</code> prints the value in its stored shape, brackets included. <code>print</code> removes the outermost brackets, and <code>type</code> prints like <code>print</code> but without ending the line. <code>say</code> is Raku, not Logo.</p>" },
    { type: "mc", q: "<p>How do you write the single word <code>hello</code> as data in Logo?</p>",
      options: ["<code>\"hello\"</code>", "<code>\"hello</code>", "<code>'hello'</code>", "<code>hello</code>"], answer: 1,
      hint: "Logo only opens the quote; it never closes it.",
      explain: "<p>A Logo word starts with a double quote and has no closing quote: <code>\"hello</code>. A bare <code>hello</code> would be treated as the name of a procedure.</p>" },
    { type: "predict", q: "<p>What does this print? Type each output line on its own line.</p>",
      code: 'type "ab\ntype "cd\nprint "xy', solution: "abcdxy",
      hint: "type does not start a new line, so the three outputs run together.",
      explain: "<p>Nothing starts a new line until <code>print</code>, so <code>ab</code>, <code>cd</code> and <code>xy</code> arrive on the same line. The line ends after <code>xy</code>.</p>" },
    { type: "fill", q: "<p>Fill in the blank so the program prints <code>[a b c]</code> with its brackets.</p>",
      before: "", after: " [a b c]", expected: "[a b c]", solution: "show",
      hint: "You want the command that keeps the brackets.",
      explain: "<p><code>show [a b c]</code> prints <code>[a b c]</code>. With <code>print</code> you would get <code>a b c</code>.</p>" },
    { type: "write", q: "<p>Write one instruction that prints <code>Hello, world</code> exactly. Remember what holds several words together.</p>",
      expected: "Hello, world", solution: "print [Hello, world]",
      hint: "A quoted word stops at the first space, so you need a list.",
      explain: "<p>The list <code>[Hello, world]</code> keeps both words together, and <code>print</code> drops the outer brackets. This is the very first program most people write in Logo.</p>" }
  ]
});
