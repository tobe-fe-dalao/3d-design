import{_ as u,d as m,e as n,B as f,r as v,G as x,v as h,f as y,g as P,c as b,j as o}from"./index.bea1c1fb.js";import{a as I}from"./index.59677d6b.js";import"./index.5a07e93b.js";const k={class:"tree beauty-scroll"},g=m({props:{selectedModelPath:String,selectedPartIndex:Number},emits:["selectPart"],setup(c,{emit:l}){const s=c,r=n(()=>{var e,t;return((t=s.selectedModelPath)==null?void 0:t.slice(((e=s.selectedModelPath)==null?void 0:e.lastIndexOf("/"))+1))||""}),d=n(()=>[s.selectedPartIndex]),i=f("partsList",v([])),_=n(()=>{const e=[{title:r.value,key:r.value,children:[]}];return e[0].children=Array.from(i.value,(t,a)=>({title:t.name,icon:()=>x(I),key:a})),e});function p(e){l("selectPart",e[0])}return(e,t)=>{const a=h("a-tree");return y(),P("div",k,[b(a,{defaultExpandAll:"",treeData:o(_),selectedKeys:o(d),"block-node":"","show-icon":"",onSelect:p},null,8,["treeData","selectedKeys"])])}}});var M=u(g,[["__scopeId","data-v-bae7f522"]]);export{M as default};
