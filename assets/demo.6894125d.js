import{d as t,h as e,e as n,f as o,r as a,o as r,c as s}from"./app.12c58a71.js";async function i(t,...e){for(const n of e)switch(typeof n){case"string":await c(t,n);break;case"number":await l(n);break;case"function":await n(t,...e);break;default:await n}}async function c(t,e){const n=function(t,[...e]){return[...t,NaN].findIndex(((t,n)=>e[n]!==t))}(t.textContent,e);await async function(t,e,n=60){for(const o of function*(t){for(const e of t)yield t=>requestAnimationFrame((()=>t.textContent=e))}(e))o(t),await l(n+n*(Math.random()-.5))}(t,[...p(t.textContent,n),...f(e,n)])}async function l(t){await new Promise((e=>setTimeout(e,t)))}function*f([...t],e=0,n=t.length){for(;e<n;)yield t.slice(0,++e).join("")}function*p([...t],e=0,n=t.length){for(;n>e;)yield t.slice(0,--n).join("")}const u=i;var y={components:{VTypical:t({name:"Typical",props:{steps:{type:Array,required:!0},wrapper:{type:String,default:"div"},loop:{type:Number,default:1}},render(){return e(this.wrapper,{ref:"myRef"})},setup:({steps:t,loop:e})=>{const a=n(null);return o((()=>{const n=a.value;e===1/0?i(n,...t,u):"number"==typeof e&&e>0?i(n,...Array(e).fill(t).flat()):i(n,...t)})),{myRef:a}}})}};y.render=function(t,e,n,o,i,c){const l=a("v-typical");return r(),s(l,{class:"blink",steps:["Hello",1e3,"Hello World !",500,"Hello World ! 👋",1e3],loop:1/0,wrapper:"h2"})};export{y as _};
