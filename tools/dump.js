const {load}=require("./lib");
const s=load(process.argv[2]);let pi=0;
console.log("# "+s.id+" "+s.title+" | "+s.tagline);
s.blocks.forEach((b,i)=>{
  if(b.t==="p"||b.t==="note")console.log("["+(pi++)+"] "+(b.t==="note"?"(NOTE) ":"")+b.html);
  else console.log("   <"+b.t+": "+b.code.split("\n")[0].slice(0,60)+">");
});
