// Regenerates the <script> list for course/*.js inside static/logo-101/index.html
const fs=require("fs"),p="static/logo-101/";
const files=fs.readdirSync(p+"course").filter(f=>/^\d\d-.*\.js$/.test(f)&&f!=="00-parts.js").sort();
let h=fs.readFileSync(p+"index.html","utf8");
h=h.replace(/<!--COURSE-FILES-->[\s\S]*?<!--\/COURSE-FILES-->|<!--COURSE-FILES-->/,
  "<!--COURSE-FILES-->\n"+files.map(f=>'<script src="course/'+f+'"></script>').join("\n")+"\n<!--/COURSE-FILES-->");
fs.writeFileSync(p+"index.html",h);console.log(files.length+" section files");
