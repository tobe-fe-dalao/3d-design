import{m as f}from"./index.1e04769c.js";import{_ as m,d as C,u as h,o as w,r as x,v as o,f as l,g as r,a as c,w as u,n as y,q as S,s as b,F,i as A,h as I,z as D,t as N}from"./index.51e65985.js";const V=e=>(S("data-v-76ca11c9"),e=e(),b(),e),k=V(()=>I("canvas",{id:"businessCanvas"},null,-1)),B=C({setup(e){const _=h();w(async()=>{let a;try{a=JSON.parse(localStorage.getItem("businessAllData")||"")}catch{console.warn("\u6CA1\u6709\u914D\u7F6E")}await f.ins.createEngine("businessCanvas",a),_.toggleLoading(!1)});const t=x("0"),p=["\u573A\u666F1","\u573A\u666F2","\u573A\u666F3"];function i(a){}return(a,n)=>{const d=o("a-select-option"),v=o("a-select");return l(),r("div",{class:y(["banner-wrap",`bg-${t.value}`])},[k,c(v,{class:"banner-wrap-select",value:t.value,"onUpdate:value":n[0]||(n[0]=s=>t.value=s),onChange:i},{default:u(()=>[(l(),r(F,null,A(p,(s,g)=>c(d,{value:`${g}`,key:s},{default:u(()=>[D(N(s),1)]),_:2},1032,["value"])),64))]),_:1},8,["value"])],2)}}});var L=m(B,[["__scopeId","data-v-76ca11c9"]]);export{L as default};