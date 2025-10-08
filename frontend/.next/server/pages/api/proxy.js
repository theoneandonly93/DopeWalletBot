"use strict";(()=>{var e={};e.id=774,e.ids=[774],e.modules={7831:e=>{e.exports=require("@solana/web3.js")},145:e=>{e.exports=require("next/dist/compiled/next-server/pages-api.runtime.prod.js")},6249:(e,t)=>{Object.defineProperty(t,"l",{enumerable:!0,get:function(){return function e(t,n){return n in t?t[n]:"then"in t&&"function"==typeof t.then?t.then(t=>e(t,n)):"function"==typeof t&&"default"===n?t:void 0}}})},6581:(e,t,n)=>{n.r(t),n.d(t,{config:()=>d,default:()=>u,routeModule:()=>c});var r={};n.r(r),n.d(r,{default:()=>o});var i=n(1802),s=n(7153),a=n(6249);async function o(e,t){let{url:n}=e.query;if(!n||"string"!=typeof n)return t.status(400).send("missing url");try{let e=decodeURIComponent(n);if(!e.startsWith("http://")&&!e.startsWith("https://"))return t.status(400).send("invalid url");let r=await fetch(e,{method:"GET"}),i=r.headers.get("content-type")||"";if(!i.includes("text/html")){let e=await r.arrayBuffer();return t.setHeader("content-type",i),t.status(r.status).send(Buffer.from(e))}let s=await r.text();try{let t=new URL(e).origin;s.includes("<base")||(s=s.replace(/<head(.*?)>/i,`<head$1><base href="${t}">`))}catch(e){}let a=`
      <script>
      (function(){
        function request(action, data){
          return new Promise((resolve, reject) => {
            const id = Math.random().toString(36).slice(2);
            function onmsg(e){
              try{
                if (e?.data && e.data.__DW_RESP__ === id){
                  window.removeEventListener('message', onmsg);
                  if (e.data.error) return reject(e.data.error);
                  return resolve(e.data.payload);
                }
              }catch(err){ }
            }
            window.addEventListener('message', onmsg);
            window.parent.postMessage({ __DW_REQ__: true, id, action, data }, '*');
          });
        }

        window.solana = {
          isPhantom: true,
          connect: function(){
            return request('connect').then(p => {
              if (p && p.publicKey) {
                window.solana.publicKey = { toString: () => p.publicKey };
              }
              return p;
            });
          },
          disconnect: function(){ return request('disconnect'); },
          signMessage: function(msg){ return request('signMessage', { msg }); },
          signTransaction: function(tx){ return request('signTransaction', { tx }); },
          signAllTransactions: function(txs){ return request('signAllTransactions', { txs }); },
          publicKey: { toString: function(){ return ''; } }
        };
        window.dispatchEvent(new Event('solana#initialized'));
      })();
      </script>
    `;return s=-1!==s.indexOf("</body>")?s.replace("</body>",a+"</body>"):-1!==s.indexOf("</head>")?s.replace("</head>",a+"</head>"):a+s,t.setHeader("content-type","text/html; charset=utf-8"),t.status(200).send(s)}catch(e){return console.error("proxy error",e?.message||e),t.status(500).send("proxy error")}}require("bs58"),require("bip39"),require("ed25519-hd-key"),n(7831);let u=(0,a.l)(r,"default"),d=(0,a.l)(r,"config"),c=new i.PagesAPIRouteModule({definition:{kind:s.x.PAGES_API,page:"/api/proxy",pathname:"/api/proxy",bundlePath:"",filename:""},userland:r})},7153:(e,t)=>{var n;Object.defineProperty(t,"x",{enumerable:!0,get:function(){return n}}),function(e){e.PAGES="PAGES",e.PAGES_API="PAGES_API",e.APP_PAGE="APP_PAGE",e.APP_ROUTE="APP_ROUTE"}(n||(n={}))},1802:(e,t,n)=>{e.exports=n(145)}};var t=require("../../webpack-api-runtime.js");t.C(e);var n=t(t.s=6581);module.exports=n})();