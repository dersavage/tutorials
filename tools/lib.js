const fs=require("fs"),vm=require("vm"),path=require("path");
const dir=path.join(__dirname,"../static/logo-101");
function load(n){
  global.window=undefined;global.LOGO101=[];
  vm.runInThisContext(fs.readFileSync(path.join(dir,"helpers.js"),"utf8"));
  vm.runInThisContext(fs.readFileSync(path.join(dir,"sections/s"+String(n).padStart(2,"0")+".js"),"utf8"));
  return LOGO101[0];
}
const q=s=>"`"+String(s).replace(/\\/g,"\\\\").replace(/`/g,"\\`").replace(/\$\{/g,"\\${")+"`";
const key=(k,v)=>k+": "+(typeof v==="string"?q(v):JSON.stringify(v));
function ser(s){
  const o=[];
  o.push("S({","id: "+s.id+",","title: "+JSON.stringify(s.title)+",","tagline: "+JSON.stringify(s.tagline)+",","blocks: [");
  for(const b of s.blocks){
    if(b.t==="p")o.push("P("+q(b.html)+"),");
    else if(b.t==="note")o.push("N("+q(b.html)+"),");
    else if(b.t==="py")o.push("PY("+q(b.code)+"),");
    else if(b.t==="raku")o.push("RK("+q(b.code)+"),");
    else{const {t,code,...r}=b;o.push("L("+q(code)+(Object.keys(r).length?", "+JSON.stringify(r):"")+"),");}
  }
  o.push("],");
  if(s.fn)o.push("fn: "+JSON.stringify(s.fn,null,1)+",");
  o.push("ex: [");
  const fn={choice:"MC",predict:"PR",fill:"FI",write:"WR"};
  for(const e of s.ex){
    if(e.type==="choice")o.push("MC("+q(e.q)+", "+JSON.stringify(e.options)+", "+e.answer+", "+q(e.explain)+"),");
    else{const {type,q:qq,...r}=e;const parts=Object.entries(r).map(([k,v])=>"  "+key(k,v));o.push(fn[type]+"("+q(qq)+",\n  {"+parts.join(",\n   ").trim()+"}),");}
  }
  o.push("]});","");
  return o.join("\n");
}
module.exports={load,ser,dir};
