// node tools/patch.js N patch.js ; patch.js exports {i: {pre, post, sub:[[a,b],...], set}} keyed by prose-block index; fn array optional under key "fn"
const fs=require("fs"),path=require("path");const {load,ser,dir}=require("./lib");
const n=process.argv[2],P=require(path.resolve(process.argv[3]));const s=load(n);let k=0,miss=0;
s.blocks.forEach(b=>{if(b.t!=="p"&&b.t!=="note")return;const e=P[k++];if(!e)return;
 if(e.set!==undefined)b.html=e.set;
 (e.sub||[]).forEach(([a,c])=>{if(!b.html.includes(a)){console.error("no match in ["+(k-1)+"]: "+a.slice(0,50));miss++;}b.html=b.html.replace(a,c);});
 if(e.pre)b.html=e.pre+b.html;if(e.post)b.html+=e.post;});
if(P.fn)s.fn=P.fn;
if(miss){process.exit(1)}
fs.writeFileSync(path.join(dir,"sections/s"+String(n).padStart(2,"0")+".js"),ser(s));
