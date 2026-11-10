// node tools/rewrite.js N prose.json   -- prose.json: {"p":[html,...], "fn":[...]} replaces P/N blocks in order
const fs=require("fs"),path=require("path");const {load,ser,dir}=require("./lib");
const n=process.argv[2],f=path.resolve(process.argv[3]),j=f.endsWith(".js")?require(f):JSON.parse(fs.readFileSync(f,"utf8"));const s=load(n);
let k=0;const pb=s.blocks.filter(b=>b.t==="p"||b.t==="note");
if(pb.length!==j.p.length){console.error("expected "+pb.length+" prose blocks, got "+j.p.length);process.exit(1);}
s.blocks.forEach(b=>{if(b.t==="p"||b.t==="note")b.html=j.p[k++];});
if(j.fn)s.fn=j.fn;
fs.writeFileSync(path.join(dir,"sections/s"+String(n).padStart(2,"0")+".js"),ser(s));
