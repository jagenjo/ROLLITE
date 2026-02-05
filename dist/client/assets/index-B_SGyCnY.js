var Ar=Object.defineProperty;var Er=(s,e,t)=>e in s?Ar(s,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):s[e]=t;var x=(s,e,t)=>Er(s,typeof e!="symbol"?e+"":e,t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))r(i);new MutationObserver(i=>{for(const n of i)if(n.type==="childList")for(const o of n.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&r(o)}).observe(document,{childList:!0,subtree:!0});function t(i){const n={};return i.integrity&&(n.integrity=i.integrity),i.referrerPolicy&&(n.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?n.credentials="include":i.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function r(i){if(i.ep)return;i.ep=!0;const n=t(i);fetch(i.href,n)}})();/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ge=globalThis,Ct=Ge.ShadowRoot&&(Ge.ShadyCSS===void 0||Ge.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Tt=Symbol(),$s=new WeakMap;let Ws=class{constructor(e,t,r){if(this._$cssResult$=!0,r!==Tt)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const t=this.t;if(Ct&&e===void 0){const r=t!==void 0&&t.length===1;r&&(e=$s.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),r&&$s.set(t,e))}return e}toString(){return this.cssText}};const Rr=s=>new Ws(typeof s=="string"?s:s+"",void 0,Tt),U=(s,...e)=>{const t=s.length===1?s[0]:e.reduce((r,i,n)=>r+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+s[n+1],s[0]);return new Ws(t,s,Tt)},Pr=(s,e)=>{if(Ct)s.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const t of e){const r=document.createElement("style"),i=Ge.litNonce;i!==void 0&&r.setAttribute("nonce",i),r.textContent=t.cssText,s.appendChild(r)}},Ss=Ct?s=>s:s=>s instanceof CSSStyleSheet?(e=>{let t="";for(const r of e.cssRules)t+=r.cssText;return Rr(t)})(s):s;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:Ir,defineProperty:Cr,getOwnPropertyDescriptor:Tr,getOwnPropertyNames:Or,getOwnPropertySymbols:Nr,getPrototypeOf:Br}=Object,ne=globalThis,As=ne.trustedTypes,Dr=As?As.emptyScript:"",pt=ne.reactiveElementPolyfillSupport,Oe=(s,e)=>s,Xe={toAttribute(s,e){switch(e){case Boolean:s=s?Dr:null;break;case Object:case Array:s=s==null?s:JSON.stringify(s)}return s},fromAttribute(s,e){let t=s;switch(e){case Boolean:t=s!==null;break;case Number:t=s===null?null:Number(s);break;case Object:case Array:try{t=JSON.parse(s)}catch{t=null}}return t}},Ot=(s,e)=>!Ir(s,e),Es={attribute:!0,type:String,converter:Xe,reflect:!1,useDefault:!1,hasChanged:Ot};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),ne.litPropertyMetadata??(ne.litPropertyMetadata=new WeakMap);let me=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??(this.l=[])).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=Es){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){const r=Symbol(),i=this.getPropertyDescriptor(e,r,t);i!==void 0&&Cr(this.prototype,e,i)}}static getPropertyDescriptor(e,t,r){const{get:i,set:n}=Tr(this.prototype,e)??{get(){return this[t]},set(o){this[t]=o}};return{get:i,set(o){const a=i==null?void 0:i.call(this);n==null||n.call(this,o),this.requestUpdate(e,a,r)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??Es}static _$Ei(){if(this.hasOwnProperty(Oe("elementProperties")))return;const e=Br(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(Oe("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(Oe("properties"))){const t=this.properties,r=[...Or(t),...Nr(t)];for(const i of r)this.createProperty(i,t[i])}const e=this[Symbol.metadata];if(e!==null){const t=litPropertyMetadata.get(e);if(t!==void 0)for(const[r,i]of t)this.elementProperties.set(r,i)}this._$Eh=new Map;for(const[t,r]of this.elementProperties){const i=this._$Eu(t,r);i!==void 0&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const r=new Set(e.flat(1/0).reverse());for(const i of r)t.unshift(Ss(i))}else e!==void 0&&t.push(Ss(e));return t}static _$Eu(e,t){const r=t.attribute;return r===!1?void 0:typeof r=="string"?r:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var e;this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),(e=this.constructor.l)==null||e.forEach(t=>t(this))}addController(e){var t;(this._$EO??(this._$EO=new Set)).add(e),this.renderRoot!==void 0&&this.isConnected&&((t=e.hostConnected)==null||t.call(e))}removeController(e){var t;(t=this._$EO)==null||t.delete(e)}_$E_(){const e=new Map,t=this.constructor.elementProperties;for(const r of t.keys())this.hasOwnProperty(r)&&(e.set(r,this[r]),delete this[r]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Pr(e,this.constructor.elementStyles),e}connectedCallback(){var e;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(e=this._$EO)==null||e.forEach(t=>{var r;return(r=t.hostConnected)==null?void 0:r.call(t)})}enableUpdating(e){}disconnectedCallback(){var e;(e=this._$EO)==null||e.forEach(t=>{var r;return(r=t.hostDisconnected)==null?void 0:r.call(t)})}attributeChangedCallback(e,t,r){this._$AK(e,r)}_$ET(e,t){var n;const r=this.constructor.elementProperties.get(e),i=this.constructor._$Eu(e,r);if(i!==void 0&&r.reflect===!0){const o=(((n=r.converter)==null?void 0:n.toAttribute)!==void 0?r.converter:Xe).toAttribute(t,r.type);this._$Em=e,o==null?this.removeAttribute(i):this.setAttribute(i,o),this._$Em=null}}_$AK(e,t){var n,o;const r=this.constructor,i=r._$Eh.get(e);if(i!==void 0&&this._$Em!==i){const a=r.getPropertyOptions(i),l=typeof a.converter=="function"?{fromAttribute:a.converter}:((n=a.converter)==null?void 0:n.fromAttribute)!==void 0?a.converter:Xe;this._$Em=i;const c=l.fromAttribute(t,a.type);this[i]=c??((o=this._$Ej)==null?void 0:o.get(i))??c,this._$Em=null}}requestUpdate(e,t,r,i=!1,n){var o;if(e!==void 0){const a=this.constructor;if(i===!1&&(n=this[e]),r??(r=a.getPropertyOptions(e)),!((r.hasChanged??Ot)(n,t)||r.useDefault&&r.reflect&&n===((o=this._$Ej)==null?void 0:o.get(e))&&!this.hasAttribute(a._$Eu(e,r))))return;this.C(e,t,r)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,t,{useDefault:r,reflect:i,wrapped:n},o){r&&!(this._$Ej??(this._$Ej=new Map)).has(e)&&(this._$Ej.set(e,o??t??this[e]),n!==!0||o!==void 0)||(this._$AL.has(e)||(this.hasUpdated||r||(t=void 0),this._$AL.set(e,t)),i===!0&&this._$Em!==e&&(this._$Eq??(this._$Eq=new Set)).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var r;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[n,o]of this._$Ep)this[n]=o;this._$Ep=void 0}const i=this.constructor.elementProperties;if(i.size>0)for(const[n,o]of i){const{wrapped:a}=o,l=this[n];a!==!0||this._$AL.has(n)||l===void 0||this.C(n,void 0,o,l)}}let e=!1;const t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),(r=this._$EO)==null||r.forEach(i=>{var n;return(n=i.hostUpdate)==null?void 0:n.call(i)}),this.update(t)):this._$EM()}catch(i){throw e=!1,this._$EM(),i}e&&this._$AE(t)}willUpdate(e){}_$AE(e){var t;(t=this._$EO)==null||t.forEach(r=>{var i;return(i=r.hostUpdated)==null?void 0:i.call(r)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&(this._$Eq=this._$Eq.forEach(t=>this._$ET(t,this[t]))),this._$EM()}updated(e){}firstUpdated(e){}};me.elementStyles=[],me.shadowRootOptions={mode:"open"},me[Oe("elementProperties")]=new Map,me[Oe("finalized")]=new Map,pt==null||pt({ReactiveElement:me}),(ne.reactiveElementVersions??(ne.reactiveElementVersions=[])).push("2.1.2");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ne=globalThis,Rs=s=>s,et=Ne.trustedTypes,Ps=et?et.createPolicy("lit-html",{createHTML:s=>s}):void 0,Ks="$lit$",ie=`lit$${Math.random().toFixed(9).slice(2)}$`,Gs="?"+ie,Mr=`<${Gs}>`,de=document,De=()=>de.createComment(""),Me=s=>s===null||typeof s!="object"&&typeof s!="function",Nt=Array.isArray,zr=s=>Nt(s)||typeof(s==null?void 0:s[Symbol.iterator])=="function",ut=`[ 	
\f\r]`,Ee=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Is=/-->/g,Cs=/>/g,le=RegExp(`>|${ut}(?:([^\\s"'>=/]+)(${ut}*=${ut}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Ts=/'/g,Os=/"/g,Zs=/^(?:script|style|textarea|title)$/i,Lr=s=>(e,...t)=>({_$litType$:s,strings:e,values:t}),u=Lr(1),pe=Symbol.for("lit-noChange"),A=Symbol.for("lit-nothing"),Ns=new WeakMap,ce=de.createTreeWalker(de,129);function Qs(s,e){if(!Nt(s)||!s.hasOwnProperty("raw"))throw Error("invalid template strings array");return Ps!==void 0?Ps.createHTML(e):e}const Ur=(s,e)=>{const t=s.length-1,r=[];let i,n=e===2?"<svg>":e===3?"<math>":"",o=Ee;for(let a=0;a<t;a++){const l=s[a];let c,d,p=-1,f=0;for(;f<l.length&&(o.lastIndex=f,d=o.exec(l),d!==null);)f=o.lastIndex,o===Ee?d[1]==="!--"?o=Is:d[1]!==void 0?o=Cs:d[2]!==void 0?(Zs.test(d[2])&&(i=RegExp("</"+d[2],"g")),o=le):d[3]!==void 0&&(o=le):o===le?d[0]===">"?(o=i??Ee,p=-1):d[1]===void 0?p=-2:(p=o.lastIndex-d[2].length,c=d[1],o=d[3]===void 0?le:d[3]==='"'?Os:Ts):o===Os||o===Ts?o=le:o===Is||o===Cs?o=Ee:(o=le,i=void 0);const h=o===le&&s[a+1].startsWith("/>")?" ":"";n+=o===Ee?l+Mr:p>=0?(r.push(c),l.slice(0,p)+Ks+l.slice(p)+ie+h):l+ie+(p===-2?a:h)}return[Qs(s,n+(s[t]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),r]};let _t=class Ys{constructor({strings:e,_$litType$:t},r){let i;this.parts=[];let n=0,o=0;const a=e.length-1,l=this.parts,[c,d]=Ur(e,t);if(this.el=Ys.createElement(c,r),ce.currentNode=this.el.content,t===2||t===3){const p=this.el.content.firstChild;p.replaceWith(...p.childNodes)}for(;(i=ce.nextNode())!==null&&l.length<a;){if(i.nodeType===1){if(i.hasAttributes())for(const p of i.getAttributeNames())if(p.endsWith(Ks)){const f=d[o++],h=i.getAttribute(p).split(ie),y=/([.?@])?(.*)/.exec(f);l.push({type:1,index:n,name:y[2],strings:h,ctor:y[1]==="."?jr:y[1]==="?"?Hr:y[1]==="@"?Vr:at}),i.removeAttribute(p)}else p.startsWith(ie)&&(l.push({type:6,index:n}),i.removeAttribute(p));if(Zs.test(i.tagName)){const p=i.textContent.split(ie),f=p.length-1;if(f>0){i.textContent=et?et.emptyScript:"";for(let h=0;h<f;h++)i.append(p[h],De()),ce.nextNode(),l.push({type:2,index:++n});i.append(p[f],De())}}}else if(i.nodeType===8)if(i.data===Gs)l.push({type:2,index:n});else{let p=-1;for(;(p=i.data.indexOf(ie,p+1))!==-1;)l.push({type:7,index:n}),p+=ie.length-1}n++}}static createElement(e,t){const r=de.createElement("template");return r.innerHTML=e,r}};function be(s,e,t=s,r){var o,a;if(e===pe)return e;let i=r!==void 0?(o=t._$Co)==null?void 0:o[r]:t._$Cl;const n=Me(e)?void 0:e._$litDirective$;return(i==null?void 0:i.constructor)!==n&&((a=i==null?void 0:i._$AO)==null||a.call(i,!1),n===void 0?i=void 0:(i=new n(s),i._$AT(s,t,r)),r!==void 0?(t._$Co??(t._$Co=[]))[r]=i:t._$Cl=i),i!==void 0&&(e=be(s,i._$AS(s,e.values),i,r)),e}class qr{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:t},parts:r}=this._$AD,i=((e==null?void 0:e.creationScope)??de).importNode(t,!0);ce.currentNode=i;let n=ce.nextNode(),o=0,a=0,l=r[0];for(;l!==void 0;){if(o===l.index){let c;l.type===2?c=new Bt(n,n.nextSibling,this,e):l.type===1?c=new l.ctor(n,l.name,l.strings,this,e):l.type===6&&(c=new Fr(n,this,e)),this._$AV.push(c),l=r[++a]}o!==(l==null?void 0:l.index)&&(n=ce.nextNode(),o++)}return ce.currentNode=de,i}p(e){let t=0;for(const r of this._$AV)r!==void 0&&(r.strings!==void 0?(r._$AI(e,r,t),t+=r.strings.length-2):r._$AI(e[t])),t++}}let Bt=class Js{get _$AU(){var e;return((e=this._$AM)==null?void 0:e._$AU)??this._$Cv}constructor(e,t,r,i){this.type=2,this._$AH=A,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=r,this.options=i,this._$Cv=(i==null?void 0:i.isConnected)??!0}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return t!==void 0&&(e==null?void 0:e.nodeType)===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=be(this,e,t),Me(e)?e===A||e==null||e===""?(this._$AH!==A&&this._$AR(),this._$AH=A):e!==this._$AH&&e!==pe&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):zr(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==A&&Me(this._$AH)?this._$AA.nextSibling.data=e:this.T(de.createTextNode(e)),this._$AH=e}$(e){var n;const{values:t,_$litType$:r}=e,i=typeof r=="number"?this._$AC(e):(r.el===void 0&&(r.el=_t.createElement(Qs(r.h,r.h[0]),this.options)),r);if(((n=this._$AH)==null?void 0:n._$AD)===i)this._$AH.p(t);else{const o=new qr(i,this),a=o.u(this.options);o.p(t),this.T(a),this._$AH=o}}_$AC(e){let t=Ns.get(e.strings);return t===void 0&&Ns.set(e.strings,t=new _t(e)),t}k(e){Nt(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let r,i=0;for(const n of e)i===t.length?t.push(r=new Js(this.O(De()),this.O(De()),this,this.options)):r=t[i],r._$AI(n),i++;i<t.length&&(this._$AR(r&&r._$AB.nextSibling,i),t.length=i)}_$AR(e=this._$AA.nextSibling,t){var r;for((r=this._$AP)==null?void 0:r.call(this,!1,!0,t);e!==this._$AB;){const i=Rs(e).nextSibling;Rs(e).remove(),e=i}}setConnected(e){var t;this._$AM===void 0&&(this._$Cv=e,(t=this._$AP)==null||t.call(this,e))}};class at{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,r,i,n){this.type=1,this._$AH=A,this._$AN=void 0,this.element=e,this.name=t,this._$AM=i,this.options=n,r.length>2||r[0]!==""||r[1]!==""?(this._$AH=Array(r.length-1).fill(new String),this.strings=r):this._$AH=A}_$AI(e,t=this,r,i){const n=this.strings;let o=!1;if(n===void 0)e=be(this,e,t,0),o=!Me(e)||e!==this._$AH&&e!==pe,o&&(this._$AH=e);else{const a=e;let l,c;for(e=n[0],l=0;l<n.length-1;l++)c=be(this,a[r+l],t,l),c===pe&&(c=this._$AH[l]),o||(o=!Me(c)||c!==this._$AH[l]),c===A?e=A:e!==A&&(e+=(c??"")+n[l+1]),this._$AH[l]=c}o&&!i&&this.j(e)}j(e){e===A?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}let jr=class extends at{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===A?void 0:e}},Hr=class extends at{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==A)}},Vr=class extends at{constructor(e,t,r,i,n){super(e,t,r,i,n),this.type=5}_$AI(e,t=this){if((e=be(this,e,t,0)??A)===pe)return;const r=this._$AH,i=e===A&&r!==A||e.capture!==r.capture||e.once!==r.once||e.passive!==r.passive,n=e!==A&&(r===A||i);i&&this.element.removeEventListener(this.name,this,r),n&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){var t;typeof this._$AH=="function"?this._$AH.call(((t=this.options)==null?void 0:t.host)??this.element,e):this._$AH.handleEvent(e)}},Fr=class{constructor(e,t,r){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=r}get _$AU(){return this._$AM._$AU}_$AI(e){be(this,e)}};const ft=Ne.litHtmlPolyfillSupport;ft==null||ft(_t,Bt),(Ne.litHtmlVersions??(Ne.litHtmlVersions=[])).push("3.3.2");const Wr=(s,e,t)=>{const r=(t==null?void 0:t.renderBefore)??e;let i=r._$litPart$;if(i===void 0){const n=(t==null?void 0:t.renderBefore)??null;r._$litPart$=i=new Bt(e.insertBefore(De(),n),n,void 0,t??{})}return i._$AI(s),i};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const he=globalThis;let I=class extends me{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var t;const e=super.createRenderRoot();return(t=this.renderOptions).renderBefore??(t.renderBefore=e.firstChild),e}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=Wr(t,this.renderRoot,this.renderOptions)}connectedCallback(){var e;super.connectedCallback(),(e=this._$Do)==null||e.setConnected(!0)}disconnectedCallback(){var e;super.disconnectedCallback(),(e=this._$Do)==null||e.setConnected(!1)}render(){return pe}};var Fs;I._$litElement$=!0,I.finalized=!0,(Fs=he.litElementHydrateSupport)==null||Fs.call(he,{LitElement:I});const gt=he.litElementPolyfillSupport;gt==null||gt({LitElement:I});(he.litElementVersions??(he.litElementVersions=[])).push("4.2.2");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const q=s=>(e,t)=>{t!==void 0?t.addInitializer(()=>{customElements.define(s,e)}):customElements.define(s,e)};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Kr={attribute:!0,type:String,converter:Xe,reflect:!1,hasChanged:Ot},Gr=(s=Kr,e,t)=>{const{kind:r,metadata:i}=t;let n=globalThis.litPropertyMetadata.get(i);if(n===void 0&&globalThis.litPropertyMetadata.set(i,n=new Map),r==="setter"&&((s=Object.create(s)).wrapped=!0),n.set(t.name,s),r==="accessor"){const{name:o}=t;return{set(a){const l=e.get.call(this);e.set.call(this,a),this.requestUpdate(o,l,s,!0,a)},init(a){return a!==void 0&&this.C(o,void 0,s,a),a}}}if(r==="setter"){const{name:o}=t;return function(a){const l=this[o];e.call(this,a),this.requestUpdate(o,l,s,!0,a)}}throw Error("Unsupported decorator location: "+r)};function g(s){return(e,t)=>typeof t=="object"?Gr(s,e,t):((r,i,n)=>{const o=i.hasOwnProperty(n);return i.constructor.createProperty(n,r),o?Object.getOwnPropertyDescriptor(i,n):void 0})(s,e,t)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function v(s){return g({...s,state:!0,attribute:!1})}const J=Object.create(null);J.open="0";J.close="1";J.ping="2";J.pong="3";J.message="4";J.upgrade="5";J.noop="6";const Ze=Object.create(null);Object.keys(J).forEach(s=>{Ze[J[s]]=s});const vt={type:"error",data:"parser error"},Xs=typeof Blob=="function"||typeof Blob<"u"&&Object.prototype.toString.call(Blob)==="[object BlobConstructor]",er=typeof ArrayBuffer=="function",tr=s=>typeof ArrayBuffer.isView=="function"?ArrayBuffer.isView(s):s&&s.buffer instanceof ArrayBuffer,Dt=({type:s,data:e},t,r)=>Xs&&e instanceof Blob?t?r(e):Bs(e,r):er&&(e instanceof ArrayBuffer||tr(e))?t?r(e):Bs(new Blob([e]),r):r(J[s]+(e||"")),Bs=(s,e)=>{const t=new FileReader;return t.onload=function(){const r=t.result.split(",")[1];e("b"+(r||""))},t.readAsDataURL(s)};function Ds(s){return s instanceof Uint8Array?s:s instanceof ArrayBuffer?new Uint8Array(s):new Uint8Array(s.buffer,s.byteOffset,s.byteLength)}let mt;function Zr(s,e){if(Xs&&s.data instanceof Blob)return s.data.arrayBuffer().then(Ds).then(e);if(er&&(s.data instanceof ArrayBuffer||tr(s.data)))return e(Ds(s.data));Dt(s,!1,t=>{mt||(mt=new TextEncoder),e(mt.encode(t))})}const Ms="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",Ce=typeof Uint8Array>"u"?[]:new Uint8Array(256);for(let s=0;s<Ms.length;s++)Ce[Ms.charCodeAt(s)]=s;const Qr=s=>{let e=s.length*.75,t=s.length,r,i=0,n,o,a,l;s[s.length-1]==="="&&(e--,s[s.length-2]==="="&&e--);const c=new ArrayBuffer(e),d=new Uint8Array(c);for(r=0;r<t;r+=4)n=Ce[s.charCodeAt(r)],o=Ce[s.charCodeAt(r+1)],a=Ce[s.charCodeAt(r+2)],l=Ce[s.charCodeAt(r+3)],d[i++]=n<<2|o>>4,d[i++]=(o&15)<<4|a>>2,d[i++]=(a&3)<<6|l&63;return c},Yr=typeof ArrayBuffer=="function",Mt=(s,e)=>{if(typeof s!="string")return{type:"message",data:sr(s,e)};const t=s.charAt(0);return t==="b"?{type:"message",data:Jr(s.substring(1),e)}:Ze[t]?s.length>1?{type:Ze[t],data:s.substring(1)}:{type:Ze[t]}:vt},Jr=(s,e)=>{if(Yr){const t=Qr(s);return sr(t,e)}else return{base64:!0,data:s}},sr=(s,e)=>{switch(e){case"blob":return s instanceof Blob?s:new Blob([s]);case"arraybuffer":default:return s instanceof ArrayBuffer?s:s.buffer}},rr="",Xr=(s,e)=>{const t=s.length,r=new Array(t);let i=0;s.forEach((n,o)=>{Dt(n,!1,a=>{r[o]=a,++i===t&&e(r.join(rr))})})},ei=(s,e)=>{const t=s.split(rr),r=[];for(let i=0;i<t.length;i++){const n=Mt(t[i],e);if(r.push(n),n.type==="error")break}return r};function ti(){return new TransformStream({transform(s,e){Zr(s,t=>{const r=t.length;let i;if(r<126)i=new Uint8Array(1),new DataView(i.buffer).setUint8(0,r);else if(r<65536){i=new Uint8Array(3);const n=new DataView(i.buffer);n.setUint8(0,126),n.setUint16(1,r)}else{i=new Uint8Array(9);const n=new DataView(i.buffer);n.setUint8(0,127),n.setBigUint64(1,BigInt(r))}s.data&&typeof s.data!="string"&&(i[0]|=128),e.enqueue(i),e.enqueue(t)})}})}let bt;function Ve(s){return s.reduce((e,t)=>e+t.length,0)}function Fe(s,e){if(s[0].length===e)return s.shift();const t=new Uint8Array(e);let r=0;for(let i=0;i<e;i++)t[i]=s[0][r++],r===s[0].length&&(s.shift(),r=0);return s.length&&r<s[0].length&&(s[0]=s[0].slice(r)),t}function si(s,e){bt||(bt=new TextDecoder);const t=[];let r=0,i=-1,n=!1;return new TransformStream({transform(o,a){for(t.push(o);;){if(r===0){if(Ve(t)<1)break;const l=Fe(t,1);n=(l[0]&128)===128,i=l[0]&127,i<126?r=3:i===126?r=1:r=2}else if(r===1){if(Ve(t)<2)break;const l=Fe(t,2);i=new DataView(l.buffer,l.byteOffset,l.length).getUint16(0),r=3}else if(r===2){if(Ve(t)<8)break;const l=Fe(t,8),c=new DataView(l.buffer,l.byteOffset,l.length),d=c.getUint32(0);if(d>Math.pow(2,21)-1){a.enqueue(vt);break}i=d*Math.pow(2,32)+c.getUint32(4),r=3}else{if(Ve(t)<i)break;const l=Fe(t,i);a.enqueue(Mt(n?l:bt.decode(l),e)),r=0}if(i===0||i>s){a.enqueue(vt);break}}}})}const ir=4;function E(s){if(s)return ri(s)}function ri(s){for(var e in E.prototype)s[e]=E.prototype[e];return s}E.prototype.on=E.prototype.addEventListener=function(s,e){return this._callbacks=this._callbacks||{},(this._callbacks["$"+s]=this._callbacks["$"+s]||[]).push(e),this};E.prototype.once=function(s,e){function t(){this.off(s,t),e.apply(this,arguments)}return t.fn=e,this.on(s,t),this};E.prototype.off=E.prototype.removeListener=E.prototype.removeAllListeners=E.prototype.removeEventListener=function(s,e){if(this._callbacks=this._callbacks||{},arguments.length==0)return this._callbacks={},this;var t=this._callbacks["$"+s];if(!t)return this;if(arguments.length==1)return delete this._callbacks["$"+s],this;for(var r,i=0;i<t.length;i++)if(r=t[i],r===e||r.fn===e){t.splice(i,1);break}return t.length===0&&delete this._callbacks["$"+s],this};E.prototype.emit=function(s){this._callbacks=this._callbacks||{};for(var e=new Array(arguments.length-1),t=this._callbacks["$"+s],r=1;r<arguments.length;r++)e[r-1]=arguments[r];if(t){t=t.slice(0);for(var r=0,i=t.length;r<i;++r)t[r].apply(this,e)}return this};E.prototype.emitReserved=E.prototype.emit;E.prototype.listeners=function(s){return this._callbacks=this._callbacks||{},this._callbacks["$"+s]||[]};E.prototype.hasListeners=function(s){return!!this.listeners(s).length};const lt=typeof Promise=="function"&&typeof Promise.resolve=="function"?e=>Promise.resolve().then(e):(e,t)=>t(e,0),j=typeof self<"u"?self:typeof window<"u"?window:Function("return this")(),ii="arraybuffer";function nr(s,...e){return e.reduce((t,r)=>(s.hasOwnProperty(r)&&(t[r]=s[r]),t),{})}const ni=j.setTimeout,oi=j.clearTimeout;function ct(s,e){e.useNativeTimers?(s.setTimeoutFn=ni.bind(j),s.clearTimeoutFn=oi.bind(j)):(s.setTimeoutFn=j.setTimeout.bind(j),s.clearTimeoutFn=j.clearTimeout.bind(j))}const ai=1.33;function li(s){return typeof s=="string"?ci(s):Math.ceil((s.byteLength||s.size)*ai)}function ci(s){let e=0,t=0;for(let r=0,i=s.length;r<i;r++)e=s.charCodeAt(r),e<128?t+=1:e<2048?t+=2:e<55296||e>=57344?t+=3:(r++,t+=4);return t}function or(){return Date.now().toString(36).substring(3)+Math.random().toString(36).substring(2,5)}function hi(s){let e="";for(let t in s)s.hasOwnProperty(t)&&(e.length&&(e+="&"),e+=encodeURIComponent(t)+"="+encodeURIComponent(s[t]));return e}function di(s){let e={},t=s.split("&");for(let r=0,i=t.length;r<i;r++){let n=t[r].split("=");e[decodeURIComponent(n[0])]=decodeURIComponent(n[1])}return e}class pi extends Error{constructor(e,t,r){super(e),this.description=t,this.context=r,this.type="TransportError"}}class zt extends E{constructor(e){super(),this.writable=!1,ct(this,e),this.opts=e,this.query=e.query,this.socket=e.socket,this.supportsBinary=!e.forceBase64}onError(e,t,r){return super.emitReserved("error",new pi(e,t,r)),this}open(){return this.readyState="opening",this.doOpen(),this}close(){return(this.readyState==="opening"||this.readyState==="open")&&(this.doClose(),this.onClose()),this}send(e){this.readyState==="open"&&this.write(e)}onOpen(){this.readyState="open",this.writable=!0,super.emitReserved("open")}onData(e){const t=Mt(e,this.socket.binaryType);this.onPacket(t)}onPacket(e){super.emitReserved("packet",e)}onClose(e){this.readyState="closed",super.emitReserved("close",e)}pause(e){}createUri(e,t={}){return e+"://"+this._hostname()+this._port()+this.opts.path+this._query(t)}_hostname(){const e=this.opts.hostname;return e.indexOf(":")===-1?e:"["+e+"]"}_port(){return this.opts.port&&(this.opts.secure&&Number(this.opts.port)!==443||!this.opts.secure&&Number(this.opts.port)!==80)?":"+this.opts.port:""}_query(e){const t=hi(e);return t.length?"?"+t:""}}class ui extends zt{constructor(){super(...arguments),this._polling=!1}get name(){return"polling"}doOpen(){this._poll()}pause(e){this.readyState="pausing";const t=()=>{this.readyState="paused",e()};if(this._polling||!this.writable){let r=0;this._polling&&(r++,this.once("pollComplete",function(){--r||t()})),this.writable||(r++,this.once("drain",function(){--r||t()}))}else t()}_poll(){this._polling=!0,this.doPoll(),this.emitReserved("poll")}onData(e){const t=r=>{if(this.readyState==="opening"&&r.type==="open"&&this.onOpen(),r.type==="close")return this.onClose({description:"transport closed by the server"}),!1;this.onPacket(r)};ei(e,this.socket.binaryType).forEach(t),this.readyState!=="closed"&&(this._polling=!1,this.emitReserved("pollComplete"),this.readyState==="open"&&this._poll())}doClose(){const e=()=>{this.write([{type:"close"}])};this.readyState==="open"?e():this.once("open",e)}write(e){this.writable=!1,Xr(e,t=>{this.doWrite(t,()=>{this.writable=!0,this.emitReserved("drain")})})}uri(){const e=this.opts.secure?"https":"http",t=this.query||{};return this.opts.timestampRequests!==!1&&(t[this.opts.timestampParam]=or()),!this.supportsBinary&&!t.sid&&(t.b64=1),this.createUri(e,t)}}let ar=!1;try{ar=typeof XMLHttpRequest<"u"&&"withCredentials"in new XMLHttpRequest}catch{}const fi=ar;function gi(){}class mi extends ui{constructor(e){if(super(e),typeof location<"u"){const t=location.protocol==="https:";let r=location.port;r||(r=t?"443":"80"),this.xd=typeof location<"u"&&e.hostname!==location.hostname||r!==e.port}}doWrite(e,t){const r=this.request({method:"POST",data:e});r.on("success",t),r.on("error",(i,n)=>{this.onError("xhr post error",i,n)})}doPoll(){const e=this.request();e.on("data",this.onData.bind(this)),e.on("error",(t,r)=>{this.onError("xhr poll error",t,r)}),this.pollXhr=e}}class Y extends E{constructor(e,t,r){super(),this.createRequest=e,ct(this,r),this._opts=r,this._method=r.method||"GET",this._uri=t,this._data=r.data!==void 0?r.data:null,this._create()}_create(){var e;const t=nr(this._opts,"agent","pfx","key","passphrase","cert","ca","ciphers","rejectUnauthorized","autoUnref");t.xdomain=!!this._opts.xd;const r=this._xhr=this.createRequest(t);try{r.open(this._method,this._uri,!0);try{if(this._opts.extraHeaders){r.setDisableHeaderCheck&&r.setDisableHeaderCheck(!0);for(let i in this._opts.extraHeaders)this._opts.extraHeaders.hasOwnProperty(i)&&r.setRequestHeader(i,this._opts.extraHeaders[i])}}catch{}if(this._method==="POST")try{r.setRequestHeader("Content-type","text/plain;charset=UTF-8")}catch{}try{r.setRequestHeader("Accept","*/*")}catch{}(e=this._opts.cookieJar)===null||e===void 0||e.addCookies(r),"withCredentials"in r&&(r.withCredentials=this._opts.withCredentials),this._opts.requestTimeout&&(r.timeout=this._opts.requestTimeout),r.onreadystatechange=()=>{var i;r.readyState===3&&((i=this._opts.cookieJar)===null||i===void 0||i.parseCookies(r.getResponseHeader("set-cookie"))),r.readyState===4&&(r.status===200||r.status===1223?this._onLoad():this.setTimeoutFn(()=>{this._onError(typeof r.status=="number"?r.status:0)},0))},r.send(this._data)}catch(i){this.setTimeoutFn(()=>{this._onError(i)},0);return}typeof document<"u"&&(this._index=Y.requestsCount++,Y.requests[this._index]=this)}_onError(e){this.emitReserved("error",e,this._xhr),this._cleanup(!0)}_cleanup(e){if(!(typeof this._xhr>"u"||this._xhr===null)){if(this._xhr.onreadystatechange=gi,e)try{this._xhr.abort()}catch{}typeof document<"u"&&delete Y.requests[this._index],this._xhr=null}}_onLoad(){const e=this._xhr.responseText;e!==null&&(this.emitReserved("data",e),this.emitReserved("success"),this._cleanup())}abort(){this._cleanup()}}Y.requestsCount=0;Y.requests={};if(typeof document<"u"){if(typeof attachEvent=="function")attachEvent("onunload",zs);else if(typeof addEventListener=="function"){const s="onpagehide"in j?"pagehide":"unload";addEventListener(s,zs,!1)}}function zs(){for(let s in Y.requests)Y.requests.hasOwnProperty(s)&&Y.requests[s].abort()}const bi=function(){const s=lr({xdomain:!1});return s&&s.responseType!==null}();class yi extends mi{constructor(e){super(e);const t=e&&e.forceBase64;this.supportsBinary=bi&&!t}request(e={}){return Object.assign(e,{xd:this.xd},this.opts),new Y(lr,this.uri(),e)}}function lr(s){const e=s.xdomain;try{if(typeof XMLHttpRequest<"u"&&(!e||fi))return new XMLHttpRequest}catch{}if(!e)try{return new j[["Active"].concat("Object").join("X")]("Microsoft.XMLHTTP")}catch{}}const cr=typeof navigator<"u"&&typeof navigator.product=="string"&&navigator.product.toLowerCase()==="reactnative";class _i extends zt{get name(){return"websocket"}doOpen(){const e=this.uri(),t=this.opts.protocols,r=cr?{}:nr(this.opts,"agent","perMessageDeflate","pfx","key","passphrase","cert","ca","ciphers","rejectUnauthorized","localAddress","protocolVersion","origin","maxPayload","family","checkServerIdentity");this.opts.extraHeaders&&(r.headers=this.opts.extraHeaders);try{this.ws=this.createSocket(e,t,r)}catch(i){return this.emitReserved("error",i)}this.ws.binaryType=this.socket.binaryType,this.addEventListeners()}addEventListeners(){this.ws.onopen=()=>{this.opts.autoUnref&&this.ws._socket.unref(),this.onOpen()},this.ws.onclose=e=>this.onClose({description:"websocket connection closed",context:e}),this.ws.onmessage=e=>this.onData(e.data),this.ws.onerror=e=>this.onError("websocket error",e)}write(e){this.writable=!1;for(let t=0;t<e.length;t++){const r=e[t],i=t===e.length-1;Dt(r,this.supportsBinary,n=>{try{this.doWrite(r,n)}catch{}i&&lt(()=>{this.writable=!0,this.emitReserved("drain")},this.setTimeoutFn)})}}doClose(){typeof this.ws<"u"&&(this.ws.onerror=()=>{},this.ws.close(),this.ws=null)}uri(){const e=this.opts.secure?"wss":"ws",t=this.query||{};return this.opts.timestampRequests&&(t[this.opts.timestampParam]=or()),this.supportsBinary||(t.b64=1),this.createUri(e,t)}}const yt=j.WebSocket||j.MozWebSocket;class vi extends _i{createSocket(e,t,r){return cr?new yt(e,t,r):t?new yt(e,t):new yt(e)}doWrite(e,t){this.ws.send(t)}}class wi extends zt{get name(){return"webtransport"}doOpen(){try{this._transport=new WebTransport(this.createUri("https"),this.opts.transportOptions[this.name])}catch(e){return this.emitReserved("error",e)}this._transport.closed.then(()=>{this.onClose()}).catch(e=>{this.onError("webtransport error",e)}),this._transport.ready.then(()=>{this._transport.createBidirectionalStream().then(e=>{const t=si(Number.MAX_SAFE_INTEGER,this.socket.binaryType),r=e.readable.pipeThrough(t).getReader(),i=ti();i.readable.pipeTo(e.writable),this._writer=i.writable.getWriter();const n=()=>{r.read().then(({done:a,value:l})=>{a||(this.onPacket(l),n())}).catch(a=>{})};n();const o={type:"open"};this.query.sid&&(o.data=`{"sid":"${this.query.sid}"}`),this._writer.write(o).then(()=>this.onOpen())})})}write(e){this.writable=!1;for(let t=0;t<e.length;t++){const r=e[t],i=t===e.length-1;this._writer.write(r).then(()=>{i&&lt(()=>{this.writable=!0,this.emitReserved("drain")},this.setTimeoutFn)})}}doClose(){var e;(e=this._transport)===null||e===void 0||e.close()}}const xi={websocket:vi,webtransport:wi,polling:yi},ki=/^(?:(?![^:@\/?#]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@\/?#]*)(?::([^:@\/?#]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/,$i=["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"];function wt(s){if(s.length>8e3)throw"URI too long";const e=s,t=s.indexOf("["),r=s.indexOf("]");t!=-1&&r!=-1&&(s=s.substring(0,t)+s.substring(t,r).replace(/:/g,";")+s.substring(r,s.length));let i=ki.exec(s||""),n={},o=14;for(;o--;)n[$i[o]]=i[o]||"";return t!=-1&&r!=-1&&(n.source=e,n.host=n.host.substring(1,n.host.length-1).replace(/;/g,":"),n.authority=n.authority.replace("[","").replace("]","").replace(/;/g,":"),n.ipv6uri=!0),n.pathNames=Si(n,n.path),n.queryKey=Ai(n,n.query),n}function Si(s,e){const t=/\/{2,9}/g,r=e.replace(t,"/").split("/");return(e.slice(0,1)=="/"||e.length===0)&&r.splice(0,1),e.slice(-1)=="/"&&r.splice(r.length-1,1),r}function Ai(s,e){const t={};return e.replace(/(?:^|&)([^&=]*)=?([^&]*)/g,function(r,i,n){i&&(t[i]=n)}),t}const xt=typeof addEventListener=="function"&&typeof removeEventListener=="function",Qe=[];xt&&addEventListener("offline",()=>{Qe.forEach(s=>s())},!1);class oe extends E{constructor(e,t){if(super(),this.binaryType=ii,this.writeBuffer=[],this._prevBufferLen=0,this._pingInterval=-1,this._pingTimeout=-1,this._maxPayload=-1,this._pingTimeoutTime=1/0,e&&typeof e=="object"&&(t=e,e=null),e){const r=wt(e);t.hostname=r.host,t.secure=r.protocol==="https"||r.protocol==="wss",t.port=r.port,r.query&&(t.query=r.query)}else t.host&&(t.hostname=wt(t.host).host);ct(this,t),this.secure=t.secure!=null?t.secure:typeof location<"u"&&location.protocol==="https:",t.hostname&&!t.port&&(t.port=this.secure?"443":"80"),this.hostname=t.hostname||(typeof location<"u"?location.hostname:"localhost"),this.port=t.port||(typeof location<"u"&&location.port?location.port:this.secure?"443":"80"),this.transports=[],this._transportsByName={},t.transports.forEach(r=>{const i=r.prototype.name;this.transports.push(i),this._transportsByName[i]=r}),this.opts=Object.assign({path:"/engine.io",agent:!1,withCredentials:!1,upgrade:!0,timestampParam:"t",rememberUpgrade:!1,addTrailingSlash:!0,rejectUnauthorized:!0,perMessageDeflate:{threshold:1024},transportOptions:{},closeOnBeforeunload:!1},t),this.opts.path=this.opts.path.replace(/\/$/,"")+(this.opts.addTrailingSlash?"/":""),typeof this.opts.query=="string"&&(this.opts.query=di(this.opts.query)),xt&&(this.opts.closeOnBeforeunload&&(this._beforeunloadEventListener=()=>{this.transport&&(this.transport.removeAllListeners(),this.transport.close())},addEventListener("beforeunload",this._beforeunloadEventListener,!1)),this.hostname!=="localhost"&&(this._offlineEventListener=()=>{this._onClose("transport close",{description:"network connection lost"})},Qe.push(this._offlineEventListener))),this.opts.withCredentials&&(this._cookieJar=void 0),this._open()}createTransport(e){const t=Object.assign({},this.opts.query);t.EIO=ir,t.transport=e,this.id&&(t.sid=this.id);const r=Object.assign({},this.opts,{query:t,socket:this,hostname:this.hostname,secure:this.secure,port:this.port},this.opts.transportOptions[e]);return new this._transportsByName[e](r)}_open(){if(this.transports.length===0){this.setTimeoutFn(()=>{this.emitReserved("error","No transports available")},0);return}const e=this.opts.rememberUpgrade&&oe.priorWebsocketSuccess&&this.transports.indexOf("websocket")!==-1?"websocket":this.transports[0];this.readyState="opening";const t=this.createTransport(e);t.open(),this.setTransport(t)}setTransport(e){this.transport&&this.transport.removeAllListeners(),this.transport=e,e.on("drain",this._onDrain.bind(this)).on("packet",this._onPacket.bind(this)).on("error",this._onError.bind(this)).on("close",t=>this._onClose("transport close",t))}onOpen(){this.readyState="open",oe.priorWebsocketSuccess=this.transport.name==="websocket",this.emitReserved("open"),this.flush()}_onPacket(e){if(this.readyState==="opening"||this.readyState==="open"||this.readyState==="closing")switch(this.emitReserved("packet",e),this.emitReserved("heartbeat"),e.type){case"open":this.onHandshake(JSON.parse(e.data));break;case"ping":this._sendPacket("pong"),this.emitReserved("ping"),this.emitReserved("pong"),this._resetPingTimeout();break;case"error":const t=new Error("server error");t.code=e.data,this._onError(t);break;case"message":this.emitReserved("data",e.data),this.emitReserved("message",e.data);break}}onHandshake(e){this.emitReserved("handshake",e),this.id=e.sid,this.transport.query.sid=e.sid,this._pingInterval=e.pingInterval,this._pingTimeout=e.pingTimeout,this._maxPayload=e.maxPayload,this.onOpen(),this.readyState!=="closed"&&this._resetPingTimeout()}_resetPingTimeout(){this.clearTimeoutFn(this._pingTimeoutTimer);const e=this._pingInterval+this._pingTimeout;this._pingTimeoutTime=Date.now()+e,this._pingTimeoutTimer=this.setTimeoutFn(()=>{this._onClose("ping timeout")},e),this.opts.autoUnref&&this._pingTimeoutTimer.unref()}_onDrain(){this.writeBuffer.splice(0,this._prevBufferLen),this._prevBufferLen=0,this.writeBuffer.length===0?this.emitReserved("drain"):this.flush()}flush(){if(this.readyState!=="closed"&&this.transport.writable&&!this.upgrading&&this.writeBuffer.length){const e=this._getWritablePackets();this.transport.send(e),this._prevBufferLen=e.length,this.emitReserved("flush")}}_getWritablePackets(){if(!(this._maxPayload&&this.transport.name==="polling"&&this.writeBuffer.length>1))return this.writeBuffer;let t=1;for(let r=0;r<this.writeBuffer.length;r++){const i=this.writeBuffer[r].data;if(i&&(t+=li(i)),r>0&&t>this._maxPayload)return this.writeBuffer.slice(0,r);t+=2}return this.writeBuffer}_hasPingExpired(){if(!this._pingTimeoutTime)return!0;const e=Date.now()>this._pingTimeoutTime;return e&&(this._pingTimeoutTime=0,lt(()=>{this._onClose("ping timeout")},this.setTimeoutFn)),e}write(e,t,r){return this._sendPacket("message",e,t,r),this}send(e,t,r){return this._sendPacket("message",e,t,r),this}_sendPacket(e,t,r,i){if(typeof t=="function"&&(i=t,t=void 0),typeof r=="function"&&(i=r,r=null),this.readyState==="closing"||this.readyState==="closed")return;r=r||{},r.compress=r.compress!==!1;const n={type:e,data:t,options:r};this.emitReserved("packetCreate",n),this.writeBuffer.push(n),i&&this.once("flush",i),this.flush()}close(){const e=()=>{this._onClose("forced close"),this.transport.close()},t=()=>{this.off("upgrade",t),this.off("upgradeError",t),e()},r=()=>{this.once("upgrade",t),this.once("upgradeError",t)};return(this.readyState==="opening"||this.readyState==="open")&&(this.readyState="closing",this.writeBuffer.length?this.once("drain",()=>{this.upgrading?r():e()}):this.upgrading?r():e()),this}_onError(e){if(oe.priorWebsocketSuccess=!1,this.opts.tryAllTransports&&this.transports.length>1&&this.readyState==="opening")return this.transports.shift(),this._open();this.emitReserved("error",e),this._onClose("transport error",e)}_onClose(e,t){if(this.readyState==="opening"||this.readyState==="open"||this.readyState==="closing"){if(this.clearTimeoutFn(this._pingTimeoutTimer),this.transport.removeAllListeners("close"),this.transport.close(),this.transport.removeAllListeners(),xt&&(this._beforeunloadEventListener&&removeEventListener("beforeunload",this._beforeunloadEventListener,!1),this._offlineEventListener)){const r=Qe.indexOf(this._offlineEventListener);r!==-1&&Qe.splice(r,1)}this.readyState="closed",this.id=null,this.emitReserved("close",e,t),this.writeBuffer=[],this._prevBufferLen=0}}}oe.protocol=ir;class Ei extends oe{constructor(){super(...arguments),this._upgrades=[]}onOpen(){if(super.onOpen(),this.readyState==="open"&&this.opts.upgrade)for(let e=0;e<this._upgrades.length;e++)this._probe(this._upgrades[e])}_probe(e){let t=this.createTransport(e),r=!1;oe.priorWebsocketSuccess=!1;const i=()=>{r||(t.send([{type:"ping",data:"probe"}]),t.once("packet",p=>{if(!r)if(p.type==="pong"&&p.data==="probe"){if(this.upgrading=!0,this.emitReserved("upgrading",t),!t)return;oe.priorWebsocketSuccess=t.name==="websocket",this.transport.pause(()=>{r||this.readyState!=="closed"&&(d(),this.setTransport(t),t.send([{type:"upgrade"}]),this.emitReserved("upgrade",t),t=null,this.upgrading=!1,this.flush())})}else{const f=new Error("probe error");f.transport=t.name,this.emitReserved("upgradeError",f)}}))};function n(){r||(r=!0,d(),t.close(),t=null)}const o=p=>{const f=new Error("probe error: "+p);f.transport=t.name,n(),this.emitReserved("upgradeError",f)};function a(){o("transport closed")}function l(){o("socket closed")}function c(p){t&&p.name!==t.name&&n()}const d=()=>{t.removeListener("open",i),t.removeListener("error",o),t.removeListener("close",a),this.off("close",l),this.off("upgrading",c)};t.once("open",i),t.once("error",o),t.once("close",a),this.once("close",l),this.once("upgrading",c),this._upgrades.indexOf("webtransport")!==-1&&e!=="webtransport"?this.setTimeoutFn(()=>{r||t.open()},200):t.open()}onHandshake(e){this._upgrades=this._filterUpgrades(e.upgrades),super.onHandshake(e)}_filterUpgrades(e){const t=[];for(let r=0;r<e.length;r++)~this.transports.indexOf(e[r])&&t.push(e[r]);return t}}let Ri=class extends Ei{constructor(e,t={}){const r=typeof e=="object"?e:t;(!r.transports||r.transports&&typeof r.transports[0]=="string")&&(r.transports=(r.transports||["polling","websocket","webtransport"]).map(i=>xi[i]).filter(i=>!!i)),super(e,r)}};function Pi(s,e="",t){let r=s;t=t||typeof location<"u"&&location,s==null&&(s=t.protocol+"//"+t.host),typeof s=="string"&&(s.charAt(0)==="/"&&(s.charAt(1)==="/"?s=t.protocol+s:s=t.host+s),/^(https?|wss?):\/\//.test(s)||(typeof t<"u"?s=t.protocol+"//"+s:s="https://"+s),r=wt(s)),r.port||(/^(http|ws)$/.test(r.protocol)?r.port="80":/^(http|ws)s$/.test(r.protocol)&&(r.port="443")),r.path=r.path||"/";const n=r.host.indexOf(":")!==-1?"["+r.host+"]":r.host;return r.id=r.protocol+"://"+n+":"+r.port+e,r.href=r.protocol+"://"+n+(t&&t.port===r.port?"":":"+r.port),r}const Ii=typeof ArrayBuffer=="function",Ci=s=>typeof ArrayBuffer.isView=="function"?ArrayBuffer.isView(s):s.buffer instanceof ArrayBuffer,hr=Object.prototype.toString,Ti=typeof Blob=="function"||typeof Blob<"u"&&hr.call(Blob)==="[object BlobConstructor]",Oi=typeof File=="function"||typeof File<"u"&&hr.call(File)==="[object FileConstructor]";function Lt(s){return Ii&&(s instanceof ArrayBuffer||Ci(s))||Ti&&s instanceof Blob||Oi&&s instanceof File}function Ye(s,e){if(!s||typeof s!="object")return!1;if(Array.isArray(s)){for(let t=0,r=s.length;t<r;t++)if(Ye(s[t]))return!0;return!1}if(Lt(s))return!0;if(s.toJSON&&typeof s.toJSON=="function"&&arguments.length===1)return Ye(s.toJSON(),!0);for(const t in s)if(Object.prototype.hasOwnProperty.call(s,t)&&Ye(s[t]))return!0;return!1}function Ni(s){const e=[],t=s.data,r=s;return r.data=kt(t,e),r.attachments=e.length,{packet:r,buffers:e}}function kt(s,e){if(!s)return s;if(Lt(s)){const t={_placeholder:!0,num:e.length};return e.push(s),t}else if(Array.isArray(s)){const t=new Array(s.length);for(let r=0;r<s.length;r++)t[r]=kt(s[r],e);return t}else if(typeof s=="object"&&!(s instanceof Date)){const t={};for(const r in s)Object.prototype.hasOwnProperty.call(s,r)&&(t[r]=kt(s[r],e));return t}return s}function Bi(s,e){return s.data=$t(s.data,e),delete s.attachments,s}function $t(s,e){if(!s)return s;if(s&&s._placeholder===!0){if(typeof s.num=="number"&&s.num>=0&&s.num<e.length)return e[s.num];throw new Error("illegal attachments")}else if(Array.isArray(s))for(let t=0;t<s.length;t++)s[t]=$t(s[t],e);else if(typeof s=="object")for(const t in s)Object.prototype.hasOwnProperty.call(s,t)&&(s[t]=$t(s[t],e));return s}const dr=["connect","connect_error","disconnect","disconnecting","newListener","removeListener"],Di=5;var b;(function(s){s[s.CONNECT=0]="CONNECT",s[s.DISCONNECT=1]="DISCONNECT",s[s.EVENT=2]="EVENT",s[s.ACK=3]="ACK",s[s.CONNECT_ERROR=4]="CONNECT_ERROR",s[s.BINARY_EVENT=5]="BINARY_EVENT",s[s.BINARY_ACK=6]="BINARY_ACK"})(b||(b={}));class Mi{constructor(e){this.replacer=e}encode(e){return(e.type===b.EVENT||e.type===b.ACK)&&Ye(e)?this.encodeAsBinary({type:e.type===b.EVENT?b.BINARY_EVENT:b.BINARY_ACK,nsp:e.nsp,data:e.data,id:e.id}):[this.encodeAsString(e)]}encodeAsString(e){let t=""+e.type;return(e.type===b.BINARY_EVENT||e.type===b.BINARY_ACK)&&(t+=e.attachments+"-"),e.nsp&&e.nsp!=="/"&&(t+=e.nsp+","),e.id!=null&&(t+=e.id),e.data!=null&&(t+=JSON.stringify(e.data,this.replacer)),t}encodeAsBinary(e){const t=Ni(e),r=this.encodeAsString(t.packet),i=t.buffers;return i.unshift(r),i}}class Ut extends E{constructor(e){super(),this.reviver=e}add(e){let t;if(typeof e=="string"){if(this.reconstructor)throw new Error("got plaintext data when reconstructing a packet");t=this.decodeString(e);const r=t.type===b.BINARY_EVENT;r||t.type===b.BINARY_ACK?(t.type=r?b.EVENT:b.ACK,this.reconstructor=new zi(t),t.attachments===0&&super.emitReserved("decoded",t)):super.emitReserved("decoded",t)}else if(Lt(e)||e.base64)if(this.reconstructor)t=this.reconstructor.takeBinaryData(e),t&&(this.reconstructor=null,super.emitReserved("decoded",t));else throw new Error("got binary data when not reconstructing a packet");else throw new Error("Unknown type: "+e)}decodeString(e){let t=0;const r={type:Number(e.charAt(0))};if(b[r.type]===void 0)throw new Error("unknown packet type "+r.type);if(r.type===b.BINARY_EVENT||r.type===b.BINARY_ACK){const n=t+1;for(;e.charAt(++t)!=="-"&&t!=e.length;);const o=e.substring(n,t);if(o!=Number(o)||e.charAt(t)!=="-")throw new Error("Illegal attachments");r.attachments=Number(o)}if(e.charAt(t+1)==="/"){const n=t+1;for(;++t&&!(e.charAt(t)===","||t===e.length););r.nsp=e.substring(n,t)}else r.nsp="/";const i=e.charAt(t+1);if(i!==""&&Number(i)==i){const n=t+1;for(;++t;){const o=e.charAt(t);if(o==null||Number(o)!=o){--t;break}if(t===e.length)break}r.id=Number(e.substring(n,t+1))}if(e.charAt(++t)){const n=this.tryParse(e.substr(t));if(Ut.isPayloadValid(r.type,n))r.data=n;else throw new Error("invalid payload")}return r}tryParse(e){try{return JSON.parse(e,this.reviver)}catch{return!1}}static isPayloadValid(e,t){switch(e){case b.CONNECT:return tt(t);case b.DISCONNECT:return t===void 0;case b.CONNECT_ERROR:return typeof t=="string"||tt(t);case b.EVENT:case b.BINARY_EVENT:return Array.isArray(t)&&(typeof t[0]=="number"||typeof t[0]=="string"&&dr.indexOf(t[0])===-1);case b.ACK:case b.BINARY_ACK:return Array.isArray(t)}}destroy(){this.reconstructor&&(this.reconstructor.finishedReconstruction(),this.reconstructor=null)}}class zi{constructor(e){this.packet=e,this.buffers=[],this.reconPack=e}takeBinaryData(e){if(this.buffers.push(e),this.buffers.length===this.reconPack.attachments){const t=Bi(this.reconPack,this.buffers);return this.finishedReconstruction(),t}return null}finishedReconstruction(){this.reconPack=null,this.buffers=[]}}function Li(s){return typeof s=="string"}const Ui=Number.isInteger||function(s){return typeof s=="number"&&isFinite(s)&&Math.floor(s)===s};function qi(s){return s===void 0||Ui(s)}function tt(s){return Object.prototype.toString.call(s)==="[object Object]"}function ji(s,e){switch(s){case b.CONNECT:return e===void 0||tt(e);case b.DISCONNECT:return e===void 0;case b.EVENT:return Array.isArray(e)&&(typeof e[0]=="number"||typeof e[0]=="string"&&dr.indexOf(e[0])===-1);case b.ACK:return Array.isArray(e);case b.CONNECT_ERROR:return typeof e=="string"||tt(e);default:return!1}}function Hi(s){return Li(s.nsp)&&qi(s.id)&&ji(s.type,s.data)}const Vi=Object.freeze(Object.defineProperty({__proto__:null,Decoder:Ut,Encoder:Mi,get PacketType(){return b},isPacketValid:Hi,protocol:Di},Symbol.toStringTag,{value:"Module"}));function W(s,e,t){return s.on(e,t),function(){s.off(e,t)}}const Fi=Object.freeze({connect:1,connect_error:1,disconnect:1,disconnecting:1,newListener:1,removeListener:1});class pr extends E{constructor(e,t,r){super(),this.connected=!1,this.recovered=!1,this.receiveBuffer=[],this.sendBuffer=[],this._queue=[],this._queueSeq=0,this.ids=0,this.acks={},this.flags={},this.io=e,this.nsp=t,r&&r.auth&&(this.auth=r.auth),this._opts=Object.assign({},r),this.io._autoConnect&&this.open()}get disconnected(){return!this.connected}subEvents(){if(this.subs)return;const e=this.io;this.subs=[W(e,"open",this.onopen.bind(this)),W(e,"packet",this.onpacket.bind(this)),W(e,"error",this.onerror.bind(this)),W(e,"close",this.onclose.bind(this))]}get active(){return!!this.subs}connect(){return this.connected?this:(this.subEvents(),this.io._reconnecting||this.io.open(),this.io._readyState==="open"&&this.onopen(),this)}open(){return this.connect()}send(...e){return e.unshift("message"),this.emit.apply(this,e),this}emit(e,...t){var r,i,n;if(Fi.hasOwnProperty(e))throw new Error('"'+e.toString()+'" is a reserved event name');if(t.unshift(e),this._opts.retries&&!this.flags.fromQueue&&!this.flags.volatile)return this._addToQueue(t),this;const o={type:b.EVENT,data:t};if(o.options={},o.options.compress=this.flags.compress!==!1,typeof t[t.length-1]=="function"){const d=this.ids++,p=t.pop();this._registerAckCallback(d,p),o.id=d}const a=(i=(r=this.io.engine)===null||r===void 0?void 0:r.transport)===null||i===void 0?void 0:i.writable,l=this.connected&&!(!((n=this.io.engine)===null||n===void 0)&&n._hasPingExpired());return this.flags.volatile&&!a||(l?(this.notifyOutgoingListeners(o),this.packet(o)):this.sendBuffer.push(o)),this.flags={},this}_registerAckCallback(e,t){var r;const i=(r=this.flags.timeout)!==null&&r!==void 0?r:this._opts.ackTimeout;if(i===void 0){this.acks[e]=t;return}const n=this.io.setTimeoutFn(()=>{delete this.acks[e];for(let a=0;a<this.sendBuffer.length;a++)this.sendBuffer[a].id===e&&this.sendBuffer.splice(a,1);t.call(this,new Error("operation has timed out"))},i),o=(...a)=>{this.io.clearTimeoutFn(n),t.apply(this,a)};o.withError=!0,this.acks[e]=o}emitWithAck(e,...t){return new Promise((r,i)=>{const n=(o,a)=>o?i(o):r(a);n.withError=!0,t.push(n),this.emit(e,...t)})}_addToQueue(e){let t;typeof e[e.length-1]=="function"&&(t=e.pop());const r={id:this._queueSeq++,tryCount:0,pending:!1,args:e,flags:Object.assign({fromQueue:!0},this.flags)};e.push((i,...n)=>(this._queue[0],i!==null?r.tryCount>this._opts.retries&&(this._queue.shift(),t&&t(i)):(this._queue.shift(),t&&t(null,...n)),r.pending=!1,this._drainQueue())),this._queue.push(r),this._drainQueue()}_drainQueue(e=!1){if(!this.connected||this._queue.length===0)return;const t=this._queue[0];t.pending&&!e||(t.pending=!0,t.tryCount++,this.flags=t.flags,this.emit.apply(this,t.args))}packet(e){e.nsp=this.nsp,this.io._packet(e)}onopen(){typeof this.auth=="function"?this.auth(e=>{this._sendConnectPacket(e)}):this._sendConnectPacket(this.auth)}_sendConnectPacket(e){this.packet({type:b.CONNECT,data:this._pid?Object.assign({pid:this._pid,offset:this._lastOffset},e):e})}onerror(e){this.connected||this.emitReserved("connect_error",e)}onclose(e,t){this.connected=!1,delete this.id,this.emitReserved("disconnect",e,t),this._clearAcks()}_clearAcks(){Object.keys(this.acks).forEach(e=>{if(!this.sendBuffer.some(r=>String(r.id)===e)){const r=this.acks[e];delete this.acks[e],r.withError&&r.call(this,new Error("socket has been disconnected"))}})}onpacket(e){if(e.nsp===this.nsp)switch(e.type){case b.CONNECT:e.data&&e.data.sid?this.onconnect(e.data.sid,e.data.pid):this.emitReserved("connect_error",new Error("It seems you are trying to reach a Socket.IO server in v2.x with a v3.x client, but they are not compatible (more information here: https://socket.io/docs/v3/migrating-from-2-x-to-3-0/)"));break;case b.EVENT:case b.BINARY_EVENT:this.onevent(e);break;case b.ACK:case b.BINARY_ACK:this.onack(e);break;case b.DISCONNECT:this.ondisconnect();break;case b.CONNECT_ERROR:this.destroy();const r=new Error(e.data.message);r.data=e.data.data,this.emitReserved("connect_error",r);break}}onevent(e){const t=e.data||[];e.id!=null&&t.push(this.ack(e.id)),this.connected?this.emitEvent(t):this.receiveBuffer.push(Object.freeze(t))}emitEvent(e){if(this._anyListeners&&this._anyListeners.length){const t=this._anyListeners.slice();for(const r of t)r.apply(this,e)}super.emit.apply(this,e),this._pid&&e.length&&typeof e[e.length-1]=="string"&&(this._lastOffset=e[e.length-1])}ack(e){const t=this;let r=!1;return function(...i){r||(r=!0,t.packet({type:b.ACK,id:e,data:i}))}}onack(e){const t=this.acks[e.id];typeof t=="function"&&(delete this.acks[e.id],t.withError&&e.data.unshift(null),t.apply(this,e.data))}onconnect(e,t){this.id=e,this.recovered=t&&this._pid===t,this._pid=t,this.connected=!0,this.emitBuffered(),this._drainQueue(!0),this.emitReserved("connect")}emitBuffered(){this.receiveBuffer.forEach(e=>this.emitEvent(e)),this.receiveBuffer=[],this.sendBuffer.forEach(e=>{this.notifyOutgoingListeners(e),this.packet(e)}),this.sendBuffer=[]}ondisconnect(){this.destroy(),this.onclose("io server disconnect")}destroy(){this.subs&&(this.subs.forEach(e=>e()),this.subs=void 0),this.io._destroy(this)}disconnect(){return this.connected&&this.packet({type:b.DISCONNECT}),this.destroy(),this.connected&&this.onclose("io client disconnect"),this}close(){return this.disconnect()}compress(e){return this.flags.compress=e,this}get volatile(){return this.flags.volatile=!0,this}timeout(e){return this.flags.timeout=e,this}onAny(e){return this._anyListeners=this._anyListeners||[],this._anyListeners.push(e),this}prependAny(e){return this._anyListeners=this._anyListeners||[],this._anyListeners.unshift(e),this}offAny(e){if(!this._anyListeners)return this;if(e){const t=this._anyListeners;for(let r=0;r<t.length;r++)if(e===t[r])return t.splice(r,1),this}else this._anyListeners=[];return this}listenersAny(){return this._anyListeners||[]}onAnyOutgoing(e){return this._anyOutgoingListeners=this._anyOutgoingListeners||[],this._anyOutgoingListeners.push(e),this}prependAnyOutgoing(e){return this._anyOutgoingListeners=this._anyOutgoingListeners||[],this._anyOutgoingListeners.unshift(e),this}offAnyOutgoing(e){if(!this._anyOutgoingListeners)return this;if(e){const t=this._anyOutgoingListeners;for(let r=0;r<t.length;r++)if(e===t[r])return t.splice(r,1),this}else this._anyOutgoingListeners=[];return this}listenersAnyOutgoing(){return this._anyOutgoingListeners||[]}notifyOutgoingListeners(e){if(this._anyOutgoingListeners&&this._anyOutgoingListeners.length){const t=this._anyOutgoingListeners.slice();for(const r of t)r.apply(this,e.data)}}}function ye(s){s=s||{},this.ms=s.min||100,this.max=s.max||1e4,this.factor=s.factor||2,this.jitter=s.jitter>0&&s.jitter<=1?s.jitter:0,this.attempts=0}ye.prototype.duration=function(){var s=this.ms*Math.pow(this.factor,this.attempts++);if(this.jitter){var e=Math.random(),t=Math.floor(e*this.jitter*s);s=Math.floor(e*10)&1?s+t:s-t}return Math.min(s,this.max)|0};ye.prototype.reset=function(){this.attempts=0};ye.prototype.setMin=function(s){this.ms=s};ye.prototype.setMax=function(s){this.max=s};ye.prototype.setJitter=function(s){this.jitter=s};class St extends E{constructor(e,t){var r;super(),this.nsps={},this.subs=[],e&&typeof e=="object"&&(t=e,e=void 0),t=t||{},t.path=t.path||"/socket.io",this.opts=t,ct(this,t),this.reconnection(t.reconnection!==!1),this.reconnectionAttempts(t.reconnectionAttempts||1/0),this.reconnectionDelay(t.reconnectionDelay||1e3),this.reconnectionDelayMax(t.reconnectionDelayMax||5e3),this.randomizationFactor((r=t.randomizationFactor)!==null&&r!==void 0?r:.5),this.backoff=new ye({min:this.reconnectionDelay(),max:this.reconnectionDelayMax(),jitter:this.randomizationFactor()}),this.timeout(t.timeout==null?2e4:t.timeout),this._readyState="closed",this.uri=e;const i=t.parser||Vi;this.encoder=new i.Encoder,this.decoder=new i.Decoder,this._autoConnect=t.autoConnect!==!1,this._autoConnect&&this.open()}reconnection(e){return arguments.length?(this._reconnection=!!e,e||(this.skipReconnect=!0),this):this._reconnection}reconnectionAttempts(e){return e===void 0?this._reconnectionAttempts:(this._reconnectionAttempts=e,this)}reconnectionDelay(e){var t;return e===void 0?this._reconnectionDelay:(this._reconnectionDelay=e,(t=this.backoff)===null||t===void 0||t.setMin(e),this)}randomizationFactor(e){var t;return e===void 0?this._randomizationFactor:(this._randomizationFactor=e,(t=this.backoff)===null||t===void 0||t.setJitter(e),this)}reconnectionDelayMax(e){var t;return e===void 0?this._reconnectionDelayMax:(this._reconnectionDelayMax=e,(t=this.backoff)===null||t===void 0||t.setMax(e),this)}timeout(e){return arguments.length?(this._timeout=e,this):this._timeout}maybeReconnectOnOpen(){!this._reconnecting&&this._reconnection&&this.backoff.attempts===0&&this.reconnect()}open(e){if(~this._readyState.indexOf("open"))return this;this.engine=new Ri(this.uri,this.opts);const t=this.engine,r=this;this._readyState="opening",this.skipReconnect=!1;const i=W(t,"open",function(){r.onopen(),e&&e()}),n=a=>{this.cleanup(),this._readyState="closed",this.emitReserved("error",a),e?e(a):this.maybeReconnectOnOpen()},o=W(t,"error",n);if(this._timeout!==!1){const a=this._timeout,l=this.setTimeoutFn(()=>{i(),n(new Error("timeout")),t.close()},a);this.opts.autoUnref&&l.unref(),this.subs.push(()=>{this.clearTimeoutFn(l)})}return this.subs.push(i),this.subs.push(o),this}connect(e){return this.open(e)}onopen(){this.cleanup(),this._readyState="open",this.emitReserved("open");const e=this.engine;this.subs.push(W(e,"ping",this.onping.bind(this)),W(e,"data",this.ondata.bind(this)),W(e,"error",this.onerror.bind(this)),W(e,"close",this.onclose.bind(this)),W(this.decoder,"decoded",this.ondecoded.bind(this)))}onping(){this.emitReserved("ping")}ondata(e){try{this.decoder.add(e)}catch(t){this.onclose("parse error",t)}}ondecoded(e){lt(()=>{this.emitReserved("packet",e)},this.setTimeoutFn)}onerror(e){this.emitReserved("error",e)}socket(e,t){let r=this.nsps[e];return r?this._autoConnect&&!r.active&&r.connect():(r=new pr(this,e,t),this.nsps[e]=r),r}_destroy(e){const t=Object.keys(this.nsps);for(const r of t)if(this.nsps[r].active)return;this._close()}_packet(e){const t=this.encoder.encode(e);for(let r=0;r<t.length;r++)this.engine.write(t[r],e.options)}cleanup(){this.subs.forEach(e=>e()),this.subs.length=0,this.decoder.destroy()}_close(){this.skipReconnect=!0,this._reconnecting=!1,this.onclose("forced close")}disconnect(){return this._close()}onclose(e,t){var r;this.cleanup(),(r=this.engine)===null||r===void 0||r.close(),this.backoff.reset(),this._readyState="closed",this.emitReserved("close",e,t),this._reconnection&&!this.skipReconnect&&this.reconnect()}reconnect(){if(this._reconnecting||this.skipReconnect)return this;const e=this;if(this.backoff.attempts>=this._reconnectionAttempts)this.backoff.reset(),this.emitReserved("reconnect_failed"),this._reconnecting=!1;else{const t=this.backoff.duration();this._reconnecting=!0;const r=this.setTimeoutFn(()=>{e.skipReconnect||(this.emitReserved("reconnect_attempt",e.backoff.attempts),!e.skipReconnect&&e.open(i=>{i?(e._reconnecting=!1,e.reconnect(),this.emitReserved("reconnect_error",i)):e.onreconnect()}))},t);this.opts.autoUnref&&r.unref(),this.subs.push(()=>{this.clearTimeoutFn(r)})}}onreconnect(){const e=this.backoff.attempts;this._reconnecting=!1,this.backoff.reset(),this.emitReserved("reconnect",e)}}const Re={};function Je(s,e){typeof s=="object"&&(e=s,s=void 0),e=e||{};const t=Pi(s,e.path||"/socket.io"),r=t.source,i=t.id,n=t.path,o=Re[i]&&n in Re[i].nsps,a=e.forceNew||e["force new connection"]||e.multiplex===!1||o;let l;return a?l=new St(r,e):(Re[i]||(Re[i]=new St(r,e)),l=Re[i]),t.query&&!e.query&&(e.query=t.queryKey),l.socket(t.path,e)}Object.assign(Je,{Manager:St,Socket:pr,io:Je,connect:Je});var Wi=Object.defineProperty,Ki=Object.getOwnPropertyDescriptor,qe=(s,e,t,r)=>{for(var i=r>1?void 0:r?Ki(e,t):e,n=s.length-1,o;n>=0;n--)(o=s[n])&&(i=(r?o(e,t,i):o(i))||i);return r&&i&&Wi(e,t,i),i};let ue=class extends I{constructor(){super(...arguments),this.name="",this.avatarIndex=0,this.online=!1,this.isDirector=!1}render(){const s=this.avatarIndex%8,e=Math.floor(this.avatarIndex/8),t=-(s*48),r=-(e*48);return u`
      <div class="player-card">
        <div class="avatar-wrapper">
            <div class="status-dot ${this.online?"online":""}"></div>
            <!-- Avatar Slot allows overriding behavior (like click-to-edit) -->
            <div class="avatar-container">
                <slot name="avatar">
                    <img 
                        src="/characters.jpg" 
                        class="avatar-image" 
                        style="transform: translate(${t}px, ${r}px);"
                        alt="Avatar"
                    >
                </slot>
            </div>
        </div>

        <div class="player-info">
            <div class="header-row">
                <div class="name-area">
                    <slot name="name">
                        <span class="player-name" style="${this.online?"":"opacity: 0.5;"}">${this.name}</span>
                    </slot>
                    <slot name="name-extras"></slot>
                </div>
            </div>
            <slot name="status"></slot>
            <div class="badges-container">
                <slot name="badges"></slot>
            </div>
        </div>

        <div class="actions-container">
            <slot name="actions"></slot>
        </div>
      </div>
    `}};ue.styles=U`
    :host {
      display: block;
      width: calc( 100% - 4px );
    }

    .player-card {
      background: #374151;
      padding: 0.75rem;
      border-radius: 0.5rem;
      display: grid;
      grid-template-columns: auto 1fr auto;
      align-items: center;
      gap: 0.75rem;
      position: relative;
      margin-bottom: 0.5rem;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
    }

    .player-card.is-me {
      border: 1px solid #f6ca3bff;
      box-shadow: 0 0 0 1px #f6ca3bff;
    }

    /* Online Status Dot */
    .status-dot {
        position: absolute;
        top: -2px;
        left: -2px;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background-color: #9ca3af; /* Gray/Offline */
        border: 2px solid #1f2937;
        z-index: 10;
    }
    
    .status-dot.online {
        background-color: #10b981; /* Green/Online */
        box-shadow: 0 0 4px #10b981;
    }

    .avatar-wrapper {
      position: relative;
      width: 48px;
      height: 48px;
    }

    .avatar-container {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      overflow: hidden;
      background-color: #111827;
      position: relative;
    }

    .avatar-image {
      width: 384px; /* 8 cols * 48px */
      height: auto; 
      image-rendering: pixelated;
      position: absolute;
    }

    .player-info {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      min-width: 0; /* Crucial for text truncation in grid/flex */
      width: 100%;
    }

    .header-row {
        display: flex;
        align-items: center;
        width: 100%;
        gap: 0.5rem;
    }

    .name-area {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        flex: 1;
        min-width: 0;
    }

    .player-name {
      font-weight: bold;
      font-size: 0.95rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      color: white;
    }

    ::slotted([slot="status"]) {
        font-size: 0.8rem;
        color: #9ca3af;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 100%;
    }

    .badges-container {
        display: flex;
        flex-wrap: wrap;
        gap: 0.25rem;
    }
    
    .actions-container {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        justify-content: center;
        gap: 0.25rem;
    }
  `;qe([g({type:String})],ue.prototype,"name",2);qe([g({type:Number})],ue.prototype,"avatarIndex",2);qe([g({type:Boolean})],ue.prototype,"online",2);qe([g({type:Boolean})],ue.prototype,"isDirector",2);ue=qe([q("player-card")],ue);var Gi=Object.defineProperty,Zi=Object.getOwnPropertyDescriptor,ur=(s,e,t,r)=>{for(var i=r>1?void 0:r?Zi(e,t):e,n=s.length-1,o;n>=0;n--)(o=s[n])&&(i=(r?o(e,t,i):o(i))||i);return r&&i&&Gi(e,t,i),i};let st=class extends I{constructor(){super(...arguments),this.selectedAvatarIndex=0}_handleSelect(s){this.dispatchEvent(new CustomEvent("avatar-selected",{detail:{index:s},bubbles:!0,composed:!0}))}_close(){this.dispatchEvent(new CustomEvent("close",{bubbles:!0,composed:!0}))}render(){return u`
      <div class="modal-overlay" @click="${this._close}">
        <div class="modal-content" @click="${s=>s.stopPropagation()}">
            <h3>Choose an Avatar</h3>
            <div class="avatar-grid">
                ${Array.from({length:64}).map((s,e)=>{const t=e%8,r=Math.floor(e/8),i=-(t*48),n=-(r*48);return u`
                    <div 
                        class="avatar-option ${this.selectedAvatarIndex===e?"selected":""}"
                        @click="${()=>this._handleSelect(e)}"
                    >
                        <img 
                            src="/characters.jpg" 
                            class="avatar-image"
                            style="transform: translate(${i}px, ${n}px);" 
                            alt="Avatar ${e}" 
                        />
                    </div>
                  `})}
            </div>
            <button @click="${this._close}">Close</button>
        </div>
      </div>
    `}};st.styles=U`
    :host {
      display: block;
    }

    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.7);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 3000;
    }

    .modal-content {
      background: #1f2937;
      padding: 1.5rem;
      border-radius: 0.5rem;
      max-width: 90vw;
      max-height: 90vh;
      overflow: auto;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    h3 {
        margin: 0;
        color: white;
    }

    .avatar-grid {
      display: grid;
      grid-template-columns: repeat(8, 1fr);
      gap: 5px;
      margin-bottom: 1rem;
      max-height: 200px;
      overflow-y: auto;
      border: 1px solid #374151;
      padding: 5px;
    }

    .avatar-option {
      width: 48px;
      height: 48px;
      border: 2px solid transparent;
      border-radius: 50%;
      cursor: pointer;
      overflow: hidden;
      position: relative;
      background-color: #111827;
    }

    .avatar-option.selected {
      border-color: #3b82f6;
      box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
    }

    .avatar-image {
      width: 384px; /* 8 cols * 48px */
      height: auto; 
      image-rendering: pixelated;
      position: absolute;
    }

    button {
      padding: 0.5rem 1rem;
      background-color: #4b5563; 
      color: white;
      border: none;
      border-radius: 0.25rem;
      cursor: pointer;
      font-weight: bold;
      align-self: flex-end;
    }

    button:hover {
        background-color: #374151;
    }
  `;ur([g({type:Number})],st.prototype,"selectedAvatarIndex",2);st=ur([q("avatar-selector")],st);var Qi=Object.defineProperty,Yi=Object.getOwnPropertyDescriptor,Q=(s,e,t,r)=>{for(var i=r>1?void 0:r?Yi(e,t):e,n=s.length-1,o;n>=0;n--)(o=s[n])&&(i=(r?o(e,t,i):o(i))||i);return r&&i&&Qi(e,t,i),i};let L=class extends I{constructor(){super(...arguments),this.player=null,this.isDirector=!1,this.isOpen=!1,this.badges=[],this.statusText="",this.background="",this.sessionId="",this._showAvatarSelector=!1,this._isEditingName=!1,this._newBadgeName=""}async _copyInviteLink(){if(!this.sessionId||!this.player)return;const s=`${window.location.origin}/?session=${this.sessionId}&player=${this.player.id}`;try{await navigator.clipboard.writeText(s),alert("Invite link copied!")}catch(e){console.error("Failed to copy: ",e),prompt("Copy this link:",s)}}_addBadge(){if(this.player&&this._newBadgeName.trim()){const s=this._newBadgeName.trim(),e=s.startsWith("_");this.dispatchEvent(new CustomEvent("add-badge",{detail:{playerId:this.player.id,badge:s,hidden:e},bubbles:!0,composed:!0})),this._newBadgeName=""}}_close(){this.dispatchEvent(new CustomEvent("close"))}_handleBackdropClick(s){s.target.classList.contains("modal-overlay")&&this._close()}_handleAvatarClick(){this.isDirector&&(this._showAvatarSelector=!0)}_onAvatarSelected(s){this.player&&this.dispatchEvent(new CustomEvent("update-player-avatar",{detail:{playerId:this.player.id,avatarIndex:s.detail.index},bubbles:!0,composed:!0})),this._showAvatarSelector=!1}_removeBadge(s){this.player&&this.dispatchEvent(new CustomEvent("remove-badge",{detail:{playerId:this.player.id,index:s},bubbles:!0,composed:!0}))}_saveName(s){const t=s.target.value.trim();this.player&&t&&t!==this.player.name&&this.dispatchEvent(new CustomEvent("update-player-name",{detail:{playerId:this.player.id,name:t},bubbles:!0,composed:!0})),this._isEditingName=!1}_handleNameClick(){this.isDirector&&(this._isEditingName=!0,setTimeout(()=>{var e;const s=(e=this.shadowRoot)==null?void 0:e.querySelector(".name-edit-input");s&&s.focus()},0))}render(){if(!this.isOpen||!this.player)return null;const s=this.player.avatarIndex||0,e=this.isDirector?this.badges:this.badges.filter(t=>!t.name.startsWith("_"));return u`
            <div class="modal-overlay" @click="${this._handleBackdropClick}">
                <div class="sheet-container">
                    <div class="header">
                        <div style="font-size: 1.5rem; font-weight: bold;">Character Sheet</div>
                        <button class="close-btn" @click="${this._close}">&times;</button>
                    </div>

                    <div class="content">

                        <div class="profile-header">
                            <div class="avatar-wrapper" @click="${this._handleAvatarClick}" title="${this.isDirector?"Click to change avatar":""}">
                                <div class="avatar-container">
                                    <img 
                                        src="/characters.jpg"
                                        class="avatar-image"
                                        style="transform: translate(-${s%8*120}px, -${Math.floor(s/8)*120}px);"
                                    >
                                </div>
                                ${this.isDirector?u`<div class="edit-overlay">✎</div>`:""}
                            </div>

                            <div class="info-section">
                                ${this._isEditingName?u`
                                        <input 
                                            class="name-edit-input"
                                            style="font-size: 1.5rem; font-weight: bold; background: #374151; color: white; border: 1px solid #4b5563; padding: 0.25rem; width: 100%; box-sizing: border-box; border-radius: 0.25rem;"
                                            .value="${this.player.name}"
                                            @blur="${this._saveName}"
                                            @keydown="${t=>t.key==="Enter"&&this._saveName(t)}"
                                        />
                                    `:u`
                                        <div style="display: flex; align-items: center; gap: 0.5rem;">
                                            <div class="name-display" @click="${this._handleNameClick}" style="${this.isDirector?"cursor: pointer; border: 1px dashed transparent; transition: border-color 0.2s;":""}" title="${this.isDirector?"Click to edit name":""}">
                                                ${this.player.name} ${this.isDirector?"✎":""}
                                            </div>
                                            ${this.isDirector?u`
                                                <button 
                                                    class="btn"
                                                    style="padding: 0.25rem; background: transparent; color: #3b82f6; border: 1px solid #3b82f6;"
                                                    @click="${this._copyInviteLink}"
                                                    title="Copy Invite Link"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                                        <path stroke-linecap="round" stroke-linejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                                    </svg>
                                                </button>
                                            `:""}
                                        </div>
                                    `}

                                <!-- Status Section -->
                                <div style="margin-top: 0.5rem;">
                                    ${this.isDirector?u`
                                        <input 
                                            class="edit-input" 
                                            .value="${this.statusText}"
                                            @change="${t=>this.dispatchEvent(new CustomEvent("update-player-status",{detail:{playerId:this.player.id,status:t.target.value},bubbles:!0,composed:!0}))}"
                                            placeholder="Current status..."
                                        >
                                    `:u`
                                        <div style="font-style: italic; color: #fbbf24;">${this.statusText||u`<span style="color: #6b7280; font-size: 0.9rem;">No status set</span>`}</div>
                                    `}
                                </div>
                            </div>
                        </div>

                        <!-- Badges Section -->
                        <div>
                            <div class="badges-list">
                                ${e.map((t,r)=>u`
                                    <div class="badge ${t.hidden?"hidden":""}">
                                        ${t.name}
                                        ${this.isDirector?u`
                                            <span class="remove-badge" @click="${()=>this._removeBadge(r)}">&times;</span>
                                        `:""}
                                    </div>
                                `)}
                                ${e.length===0?u`<span style="color: #6b7280; font-size: 0.9rem;">No badges</span>`:""}
                            </div>
                            
                            ${this.isDirector?u`
                                <div class="add-badge-container">
                                    <input 
                                        class="edit-input" 
                                        placeholder="Add badge... (_ for hidden)"
                                        .value="${this._newBadgeName}"
                                        @input="${t=>this._newBadgeName=t.target.value}"
                                        @keydown="${t=>t.key==="Enter"&&this._addBadge()}"
                                    >
                                    <button class="btn btn-primary" @click="${this._addBadge}">Add</button>
                                </div>
                            `:""}
                        </div>

                        <!-- Background Section -->
                        <div style="flex: 1; display: flex; flex-direction: column;">
                            <div class="section-title">Background</div>
                            ${this.isDirector?u`
                                <textarea 
                                    class="edit-input" 
                                    style="flex: 1;"
                                    .value="${this.player.background||""}"
                                    @change="${t=>this.dispatchEvent(new CustomEvent("update-player-background",{detail:{playerId:this.player.id,background:t.target.value},bubbles:!0,composed:!0}))}"
                                    placeholder="Write character background here..."
                                ></textarea>
                            `:u`
                                <div style="text-align: left; line-height: 1.5; color: #d1d5db;">
                                    ${this.player.background||u`<span style="color: #6b7280; font-size: 0.9rem;">No background information available.</span>`}
                                </div>
                            `}
                        </div>

                    </div>
                </div>
            </div>
        ${this._showAvatarSelector?u`
             <avatar-selector
                .selectedAvatarIndex="${this.player.avatarIndex||0}"
                @close="${()=>this._showAvatarSelector=!1}"
                @avatar-selected="${this._onAvatarSelected}"
            ></avatar-selector>
        `:""}
        `}};L.styles=U`
        :host {
            display: block;
        }

        .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 2000;
            backdrop-filter: blur(2px);
        }

        .sheet-container {
            background: #1f2937;
            color: white;
            width: 90%;
            max-width: 600px;
            max-height: 90vh;
            border-radius: 0.75rem;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
            border: 1px solid #374151;
        }

        .header {
            background: #111827;
            padding: 1.5rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid #374151;
        }

        .close-btn {
            background: none;
            border: none;
            color: #9ca3af;
            cursor: pointer;
            font-size: 1.5rem;
            line-height: 1;
        }
        .close-btn:hover { color: white; }

        .content {
            padding: 1.5rem;
            overflow-y: auto;
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
        }

        .profile-header {
            display: flex;
            gap: 1.5rem;
            align-items: flex-start;
        }

        .avatar-wrapper {
            position: relative;
            cursor: pointer;
            width: 120px;
            height: 120px;
            flex-shrink: 0;
        }

        .avatar-container {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            overflow: hidden;
            border: 4px solid #374151;
            background: #000;
        }

        .avatar-image {
            width: 960px; /* 8 * 120px */
            image-rendering: pixelated;
        }

        .edit-overlay {
            position: absolute;
            top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0, 0, 0, 0.5);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 0.2s;
        }
        .avatar-wrapper:hover .edit-overlay { opacity: 1; }

        .info-section {
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
        }

        .name-display {
            font-size: 1.5rem;
            font-weight: bold;
        }

        input.edit-input, textarea.edit-input {
            background: #374151;
            border: 1px solid #4b5563;
            color: white;
            padding: 0.5rem;
            border-radius: 0.25rem;
            width: 100%;
            box-sizing: border-box;
            font-family: inherit;
        }

        textarea.edit-input {
            min-height: 100px;
            resize: vertical;
        }

        .section-title {
            font-size: 0.9rem;
            text-transform: uppercase;
            color: #9ca3af;
            letter-spacing: 0.05em;
            margin-bottom: 0.5rem;
            border-bottom: 1px solid #374151;
            padding-bottom: 0.25rem;
        }

        .badges-list {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
        }

        .badge {
            background: #374151;
            padding: 0.25rem 0.5rem;
            border-radius: 0.25rem;
            font-size: 0.85rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        .badge.hidden {
            border: 1px dashed #fbbf24;
            color: #fbbf24;
        }
        
        .remove-badge {
            color: #f87171;
            cursor: pointer;
            font-weight: bold;
        }
        .remove-badge:hover { color: #ef4444; }

        .btn {
            padding: 0.5rem 1rem;
            border-radius: 0.25rem;
            border: none;
            cursor: pointer;
            font-weight: bold;
        }
        .btn-primary { background: #3b82f6; color: white; }
        .btn-primary:hover { background: #2563eb; }

        .add-badge-container {
            margin-top: 0.5rem;
            display: flex;
            gap: 0.5rem;
        }

        ::-webkit-scrollbar {
            width: 8px;
        }
        ::-webkit-scrollbar-track {
            background: #1f2937;
        }
        ::-webkit-scrollbar-thumb {
            background: #4b5563;
            border-radius: 4px;
        }
    `;Q([g({type:Object})],L.prototype,"player",2);Q([g({type:Boolean})],L.prototype,"isDirector",2);Q([g({type:Boolean})],L.prototype,"isOpen",2);Q([g({type:Array})],L.prototype,"badges",2);Q([g({type:String})],L.prototype,"statusText",2);Q([g({type:String})],L.prototype,"background",2);Q([g({type:String})],L.prototype,"sessionId",2);Q([v()],L.prototype,"_showAvatarSelector",2);Q([v()],L.prototype,"_isEditingName",2);Q([v()],L.prototype,"_newBadgeName",2);L=Q([q("character-sheet")],L);var Ji=Object.defineProperty,Xi=Object.getOwnPropertyDescriptor,S=(s,e,t,r)=>{for(var i=r>1?void 0:r?Xi(e,t):e,n=s.length-1,o;n>=0;n--)(o=s[n])&&(i=(r?o(e,t,i):o(i))||i);return r&&i&&Ji(e,t,i),i};let $=class extends I{constructor(){super(...arguments),this.messages=[],this.history=[],this.players=[],this.round=1,this.viewingRound=1,this.isRoundActive=!1,this.sessionId="",this.directorId="",this.isEnded=!1,this.currentScene=null,this.pendingScene=null,this.playersOnline=[],this._newPlayerName="",this._newPlayerAvatar=0,this._newPlayerBadges="",this._showPlayerManagement=!1,this._showAvatarModal=!1,this._selectedPlayerId=null,this._editingPrivateMsgId=null,this._tempPrivateMsg=""}get _isAvatarModalOpen(){return this._showAvatarModal}_openCharacterSheet(s){this._selectedPlayerId=s}_closeCharacterSheet(){this._selectedPlayerId=null}_onAvatarSelected(s){const e=s.detail.index;this._newPlayerAvatar=e,this._showAvatarModal=!1}_startEditingMsg(s){var e,t;this._editingPrivateMsgId=s,this._tempPrivateMsg=((t=(e=this.pendingScene)==null?void 0:e.privateMessages)==null?void 0:t[s])||""}_cancelPrivateMsg(){this._editingPrivateMsgId=null,this._tempPrivateMsg=""}_savePrivateMsg(){this._editingPrivateMsgId&&(this.dispatchEvent(new CustomEvent("set-pending-private-message",{detail:{playerId:this._editingPrivateMsgId,message:this._tempPrivateMsg},bubbles:!0,composed:!0})),this._editingPrivateMsgId=null,this._tempPrivateMsg="")}_renderPrivateMsgForm(){return u`
      <div style="margin-top: 0.5rem; background: #111827; padding: 0.5rem; border-radius: 0.25rem;">
        <textarea
            style="width: 100%; min-height: 60px; margin-bottom: 0.5rem; resize: vertical;"
            .value="${this._tempPrivateMsg}"
            @input="${s=>this._tempPrivateMsg=s.target.value}"
            placeholder="Write a private message..."
        ></textarea>
        <div style="display: flex; gap: 0.5rem; justify-content: flex-end;">
            <button @click="${this._cancelPrivateMsg}" style="background-color: #4b5563; font-size: 0.75rem;">Cancel</button>
            <button @click="${this._savePrivateMsg}" style="background-color: #8b5cf6; font-size: 0.75rem;">Save</button>
        </div>
      </div>
    `}_createPlayer(){if(!this._newPlayerName)return;this._showPlayerManagement=!1;const s=this._newPlayerBadges.split(",").map(e=>e.trim()).filter(e=>e).map(e=>({name:e,hidden:!1}));this.dispatchEvent(new CustomEvent("create-player",{detail:{name:this._newPlayerName,avatarIndex:this._newPlayerAvatar,badges:s},bubbles:!0,composed:!0})),this._newPlayerName="",this._newPlayerBadges="",this._newPlayerAvatar=0}async _copyInviteLink(s){if(!this.sessionId)return;const e=`${window.location.origin}/?session=${this.sessionId}&player=${s}`;try{await navigator.clipboard.writeText(e),alert("Invite link copied!")}catch(t){console.error("Failed to copy: ",t),prompt("Copy this link:",e)}}render(){var a,l,c,d,p,f;const s=this.viewingRound,e=s===this.round;let t=s;e&&!this.isRoundActive&&this.round>1&&(t=this.round-1);const r=this._selectedPlayerId&&this.players.find(h=>h.id===this._selectedPlayerId)||null,n=(r?((l=(a=this.pendingScene)==null?void 0:a.playerBadges)==null?void 0:l[r.id])||((d=(c=this.currentScene)==null?void 0:c.playerBadges)==null?void 0:d[r.id])||[]:[]).map(h=>typeof h=="string"?{name:h,hidden:!1}:h),o=r&&(((f=(p=this.pendingScene)==null?void 0:p.playerStatuses)==null?void 0:f[r.id])||r.statusText)||"";return u`
      <div class="panel">
        <div style="display: flex; justify-content: space-between; align-items: center;">
            <h2>Characters</h2>
            <div style="display: flex; align-items: center; gap: 1rem;">
            </div>
        </div>

            <div class="player-list">
                ${this.players.filter(h=>h.id!==this.directorId).map(h=>{var P,M,H,V,z,F,N,_e,ve,we,xe,ke,$e,Se;const y=h.avatarIndex||0,m=this.playersOnline.some(T=>T.id===h.id),k=this.messages.find(T=>T.isAction&&T.senderId===h.id&&T.round===t);return u`
                      <player-card 
                        .name="${h.name}" 
                        .avatarIndex="${y}" 
                        .online="${m}"
                        style="cursor: pointer;"
                        @click="${()=>this._openCharacterSheet(h.id)}"
                      >
                            <div 
                                slot="avatar"
                                class="avatar-container"
                                style="position: relative;"
                            >
                                <img 
                                    src="/characters.jpg" 
                                    class="avatar-image" 
                                    style="transform: translate(-${y%8*48}px, -${Math.floor(y/8)*48}px); width: 384px;"
                                >
                            </div>

                            <div slot="status">
                                <div 
                                    class="status-text" 
                                    style="font-size: 0.8rem; margin-bottom: 0.25rem;"
                                >
                                    ${(M=(P=this.pendingScene)==null?void 0:P.playerStatuses)!=null&&M[h.id]?u`<span style="color: #fbbf24; font-style: italic;">${this.pendingScene.playerStatuses[h.id]}</span>`:h.statusText||"No status"}
                                </div>
                            </div>

                                  <div slot="badges" style="font-size: 0.75rem; color: #9ca3af; display: flex; flex-direction: column; gap: 0.25rem;">
                                      <div style="display: flex; flex-wrap: wrap; gap: 0.25rem; align-items: center;">
                                          ${(((V=(H=this.pendingScene)==null?void 0:H.playerBadges)==null?void 0:V[h.id])||((F=(z=this.currentScene)==null?void 0:z.playerBadges)==null?void 0:F[h.id])||[]).map(T=>{const He=typeof T=="string"?T:T.name,Ae=typeof T=="string"?!1:T.hidden;return u`
                                                  <span class="badge ${Ae?"hidden":""}" title="${Ae?"Hidden Badge":""}">
                                                      ${He}
                                                  </span>
                                              `})}
                                      </div>

                                  ${k?u`
                                      <div style="color: #e5e7eb; font-size: 0.9rem; background: #374151; padding: 0.25rem 0.5rem; border-radius: 0.25rem; border-left: 2px solid #3b82f6; margin-top: 0.25rem;">
                                        ${k.content}
                                      </div>
                                  `:""}
                              </div>
                              <div slot="actions" @click="${T=>T.stopPropagation()}">
                                  ${this._editingPrivateMsgId===h.id?this._renderPrivateMsgForm():u`
                                      <div style="display: flex; gap: 0.5rem; align-items: center;">
                                          ${(_e=(N=this.pendingScene)==null?void 0:N.privateMessages)!=null&&_e[h.id]?u`
                                              <div style="font-size: 0.75rem; color: #a78bfa; font-style: italic; margin-right: 0.5rem; max-width: 200px; text-align: right;">
                                                  Pending: "${(we=(ve=this.pendingScene)==null?void 0:ve.privateMessages)==null?void 0:we[h.id]}"
                                              </div>
                                          `:""}
                                          <button 
                                              @click="${()=>this._startEditingMsg(h.id)}" 
                                              style="background-color: ${(ke=(xe=this.pendingScene)==null?void 0:xe.privateMessages)!=null&&ke[h.id]?"#8b5cf6":"#4b5563"}; padding: 0.25rem; display: flex; align-items: center; justify-content: center;"
                                              title="${(Se=($e=this.pendingScene)==null?void 0:$e.privateMessages)!=null&&Se[h.id]?"Edit Private Message":"Send Private Message"}"
                                          >
                                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                                  <path stroke-linecap="round" stroke-linejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                              </svg>
                                          </button>
                                      </div>
                                  `}
                              </div>
                          </player-card>
                  `})}
       
        ${this._showPlayerManagement?u`
                <player-card .name="${this._newPlayerName}" .avatarIndex="${this._newPlayerAvatar}">
                    <!-- Avatar Selection -->
                    <div 
                        slot="avatar"
                        class="avatar-container"
                        style="cursor: pointer; border: 2px solid #3b82f6; width: 48px; height: 48px; border-radius: 50%; overflow: hidden; position: relative;"
                        @click="${()=>this._showAvatarModal=!0}"
                        title="Click to change avatar"
                    >
                         <img 
                            src="/characters.jpg" 
                            class="avatar-image"
                            style="width: 384px; transform: translate(-${this._newPlayerAvatar%8*48}px, -${Math.floor(this._newPlayerAvatar/8)*48}px);" 
                            alt="Selected Avatar" 
                        >
                    </div>

                    <!-- Player Info Inputs -->
                    <div slot="name" style="width: 100%;">
                        <input 
                            type="text" 
                            class="card-input name-input"
                            placeholder="Character Name" 
                            .value="${this._newPlayerName}"
                            @input="${h=>this._newPlayerName=h.target.value}"
                        />
                    </div>
                    <!-- Actions -->
                    <div slot="actions">
                        <button class="btn-primary" @click="${this._createPlayer}" ?disabled="${!this._newPlayerName}" style="padding: 0.25rem 0.75rem; font-size: 0.8rem;">Create</button>
                        <button class="btn-primary" @click="${()=>this._showPlayerManagement=!1}" style="padding: 0.25rem 0.75rem; font-size: 0.8rem;">Cancel</button>
                    </div>
                </player-card>
            </div>
        `:""} <!--show player management-->
        
        ${this._showPlayerManagement?"":u`<button class="new_player" @click="${()=>this._showPlayerManagement=!this._showPlayerManagement}">+</button>`}
        </div>        

      </div>
      
      <!-- Character Sheet Modal -->
      <character-sheet
        .player="${r}"
        .isOpen="${!!r}"
        .isDirector="${!0}"
        .badges="${n}"
        .statusText="${o}"
        .sessionId="${this.sessionId}"
        @close="${this._closeCharacterSheet}"
      ></character-sheet>
      
      <!-- Avatar Selection Modal (Global) -->
      ${this._isAvatarModalOpen?u`
        <avatar-selector
            .selectedAvatarIndex="${this._newPlayerAvatar}"
            @close="${()=>this._showAvatarModal=!1}"
            @avatar-selected="${this._onAvatarSelected}"
        ></avatar-selector>
      `:""}
      
    `}};$.styles=U`
    :host {
      display: block;
      padding: 1rem;
      color: white;
    }

    .panel {
      background-color: #1f2937;
      padding: 1.5rem;
      border-radius: 0.5rem;
      margin-bottom: 1rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }

    h2 {
      margin-top: 0;
      margin-bottom: 1rem;
      color: #3b82f6; /* blue-500 */
      font-size: 1.25rem;
    }

    .player-list {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    button {
        padding: 0.5rem 1rem;
        border-radius: 0.25rem;
        border: none;
        cursor: pointer;
        font-weight: bold;
        transition: background-color 0.2s;
        color: white;
    }

    .btn-primary {
      background-color: #3b82f6;
    }
    .btn-primary:hover {
      background-color: #2563eb;
    }

    .new_player {
        background-color: #10b981;
        width: 100%;
        margin-top: 0.5rem;
    }
    .new_player:hover {
        background-color: #059669;
    }
    
    .card-input {
        background: #111827; 
        border: 1px solid #4b5563; 
        color: white; 
        padding: 0.25rem; 
        border-radius: 0.25rem; 
        width: 100%; 
        box-sizing: border-box;
    }
    .name-input {
      font-weight: bold;
    }
    .badges-input {
      font-size: 0.8rem;
    }

    .badge {
        background-color: #4b5563;
        color: #e5e7eb;
        font-size: 0.6rem;
        padding: 0.1rem 0.3rem;
        border-radius: 0.2rem;
        display: flex;
        align-items: center;
        gap: 0.2rem;
    }

    .badge.hidden {
      border: 1px dashed #fbbf24; 
      background-color: #374151;
      color: #fbbf24;
    }

    .status-text {
      font-weight: bold;
    }

    .btn-cancel {
      background-color: #4b5563;
      color: white;
    }

    .btn-confirm {
      background-color: #3b82f6;
      color: white;
    }

    ::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }
    ::-webkit-scrollbar-track {
      background: #1f2937;
    }
    ::-webkit-scrollbar-thumb {
      background: #4b5563;
      border-radius: 4px;
    }
    ::-webkit-scrollbar-thumb:hover {
      background: #6b7280;
    }
  `;S([g({type:Array})],$.prototype,"messages",2);S([g({type:Array})],$.prototype,"history",2);S([g({type:Array})],$.prototype,"players",2);S([g({type:Number})],$.prototype,"round",2);S([g({type:Number})],$.prototype,"viewingRound",2);S([g({type:Boolean})],$.prototype,"isRoundActive",2);S([g({type:String})],$.prototype,"sessionId",2);S([g({type:String})],$.prototype,"directorId",2);S([g({type:Boolean})],$.prototype,"isEnded",2);S([g({type:Object})],$.prototype,"currentScene",2);S([g({type:Object})],$.prototype,"pendingScene",2);S([g({type:Array})],$.prototype,"playersOnline",2);S([v()],$.prototype,"_newPlayerName",2);S([v()],$.prototype,"_newPlayerAvatar",2);S([v()],$.prototype,"_newPlayerBadges",2);S([v()],$.prototype,"_showPlayerManagement",2);S([v()],$.prototype,"_showAvatarModal",2);S([v()],$.prototype,"_selectedPlayerId",2);S([v()],$.prototype,"_editingPrivateMsgId",2);S([v()],$.prototype,"_tempPrivateMsg",2);$=S([q("director-dashboard")],$);var en=Object.defineProperty,tn=Object.getOwnPropertyDescriptor,ae=(s,e,t,r)=>{for(var i=r>1?void 0:r?tn(e,t):e,n=s.length-1,o;n>=0;n--)(o=s[n])&&(i=(r?o(e,t,i):o(i))||i);return r&&i&&en(e,t,i),i};let X=class extends I{constructor(){super(...arguments),this.currentScene=null,this.isRoundActive=!1,this.round=1,this.messages=[],this.currentUserId="",this._action="",this.isEnded=!1}willUpdate(s){s.has("round")&&(this._action="")}_submitAction(){this._action.trim()&&this.dispatchEvent(new CustomEvent("submit-action",{detail:{action:this._action},bubbles:!0,composed:!0}))}render(){const s=this.messages.find(e=>e.isAction&&e.senderId===this.currentUserId&&e.round===this.round);return this.isEnded?u`
          <div class="panel">
            <!--<h2>Your Action</h2>-->
            <div class="status-message" style="color: #ef4444; font-weight: bold;">
                The game has ended. No further actions can be submitted.
            </div>
            ${s?u`
              <div class="submitted-action">
                  <strong>You:</strong> ${s.content}
              </div>
            `:""}
          </div>
        `:u`
      <div class="panel">
        <!--<h2>Your Action</h2>-->
        ${this.isRoundActive?u`
          ${s?u`
            <div class="status-message">Action submitted. Waiting for next round...</div>
          `:u`
            <textarea
              .value="${this._action}"
              @input="${e=>this._action=e.target.value}"
              placeholder="What do you want to do?"
            ></textarea>
            <button @click="${this._submitAction}">Submit Action</button>
          `}
        `:u`
          <div class="status-message">Waiting for the director to start the round...</div>
        `}
      </div>
    `}};X.styles=U`
    :host {
      display: block;
      padding-left: 1rem;
      padding-right: 1rem;
      color: white;
    }

    .panel {
      background-color: #1f2937;
      padding: 1.5rem;
      border-radius: 0.5rem;
      margin-bottom: 1rem;
    }

    h2 {
      margin-top: 0;
      margin-bottom: 1rem;
      font-size: 1.25rem;
      font-weight: bold;
    }

    textarea {
      width: 100%;
      padding: 0.5rem;
      border-radius: 0.25rem;
      border: 1px solid #374151;
      background-color: #111827;
      color: white;
      min-height: 100px;
      margin-bottom: 1rem;
    }

    button {
      padding: 0.5rem 1rem;
      background-color: #3b82f6; /* blue-500 */
      color: white;
      border: none;
      border-radius: 0.25rem;
      cursor: pointer;
      font-weight: bold;
    }

    button:disabled {
      background-color: #4b5563;
      cursor: not-allowed;
    }

    button:hover:not(:disabled) {
      background-color: #2563eb;
    }

    .status-message {
      margin-top: 1rem;
      font-style: italic;
      color: #9ca3af;
    }
    
    .submitted-action {
        background-color: #374151;
        padding: 1rem;
        border-radius: 0.25rem;
        margin-top: 1rem;
        border-left: 4px solid #10b981;
    }
  `;ae([g({type:Object})],X.prototype,"currentScene",2);ae([g({type:Boolean})],X.prototype,"isRoundActive",2);ae([g({type:Number})],X.prototype,"round",2);ae([g({type:Array})],X.prototype,"messages",2);ae([g({type:String})],X.prototype,"currentUserId",2);ae([v()],X.prototype,"_action",2);ae([g({type:Boolean})],X.prototype,"isEnded",2);X=ae([q("player-dashboard")],X);/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const sn={CHILD:2},rn=s=>(...e)=>({_$litDirective$:s,values:e});class nn{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,t,r){this._$Ct=e,this._$AM=t,this._$Ci=r}_$AS(e,t){return this.update(e,t)}update(e,t){return this.render(...t)}}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class At extends nn{constructor(e){if(super(e),this.it=A,e.type!==sn.CHILD)throw Error(this.constructor.directiveName+"() can only be used in child bindings")}render(e){if(e===A||e==null)return this._t=void 0,this.it=e;if(e===pe)return e;if(typeof e!="string")throw Error(this.constructor.directiveName+"() called with a non-string value");if(e===this.it)return this._t;this.it=e;const t=[e];return t.raw=t,this._t={_$litType$:this.constructor.resultType,strings:t,values:[]}}}At.directiveName="unsafeHTML",At.resultType=1;const on=rn(At);function qt(){return{async:!1,breaks:!1,extensions:null,gfm:!0,hooks:null,pedantic:!1,renderer:null,silent:!1,tokenizer:null,walkTokens:null}}var ge=qt();function fr(s){ge=s}var Be={exec:()=>null};function _(s,e=""){let t=typeof s=="string"?s:s.source,r={replace:(i,n)=>{let o=typeof n=="string"?n:n.source;return o=o.replace(B.caret,"$1"),t=t.replace(i,o),r},getRegex:()=>new RegExp(t,e)};return r}var an=(()=>{try{return!!new RegExp("(?<=1)(?<!1)")}catch{return!1}})(),B={codeRemoveIndent:/^(?: {1,4}| {0,3}\t)/gm,outputLinkReplace:/\\([\[\]])/g,indentCodeCompensation:/^(\s+)(?:```)/,beginningSpace:/^\s+/,endingHash:/#$/,startingSpaceChar:/^ /,endingSpaceChar:/ $/,nonSpaceChar:/[^ ]/,newLineCharGlobal:/\n/g,tabCharGlobal:/\t/g,multipleSpaceGlobal:/\s+/g,blankLine:/^[ \t]*$/,doubleBlankLine:/\n[ \t]*\n[ \t]*$/,blockquoteStart:/^ {0,3}>/,blockquoteSetextReplace:/\n {0,3}((?:=+|-+) *)(?=\n|$)/g,blockquoteSetextReplace2:/^ {0,3}>[ \t]?/gm,listReplaceTabs:/^\t+/,listReplaceNesting:/^ {1,4}(?=( {4})*[^ ])/g,listIsTask:/^\[[ xX]\] +\S/,listReplaceTask:/^\[[ xX]\] +/,listTaskCheckbox:/\[[ xX]\]/,anyLine:/\n.*\n/,hrefBrackets:/^<(.*)>$/,tableDelimiter:/[:|]/,tableAlignChars:/^\||\| *$/g,tableRowBlankLine:/\n[ \t]*$/,tableAlignRight:/^ *-+: *$/,tableAlignCenter:/^ *:-+: *$/,tableAlignLeft:/^ *:-+ *$/,startATag:/^<a /i,endATag:/^<\/a>/i,startPreScriptTag:/^<(pre|code|kbd|script)(\s|>)/i,endPreScriptTag:/^<\/(pre|code|kbd|script)(\s|>)/i,startAngleBracket:/^</,endAngleBracket:/>$/,pedanticHrefTitle:/^([^'"]*[^\s])\s+(['"])(.*)\2/,unicodeAlphaNumeric:/[\p{L}\p{N}]/u,escapeTest:/[&<>"']/,escapeReplace:/[&<>"']/g,escapeTestNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/,escapeReplaceNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g,unescapeTest:/&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/ig,caret:/(^|[^\[])\^/g,percentDecode:/%25/g,findPipe:/\|/g,splitPipe:/ \|/,slashPipe:/\\\|/g,carriageReturn:/\r\n|\r/g,spaceLine:/^ +$/gm,notSpaceStart:/^\S*/,endingNewline:/\n$/,listItemRegex:s=>new RegExp(`^( {0,3}${s})((?:[	 ][^\\n]*)?(?:\\n|$))`),nextBulletRegex:s=>new RegExp(`^ {0,${Math.min(3,s-1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`),hrRegex:s=>new RegExp(`^ {0,${Math.min(3,s-1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`),fencesBeginRegex:s=>new RegExp(`^ {0,${Math.min(3,s-1)}}(?:\`\`\`|~~~)`),headingBeginRegex:s=>new RegExp(`^ {0,${Math.min(3,s-1)}}#`),htmlBeginRegex:s=>new RegExp(`^ {0,${Math.min(3,s-1)}}<(?:[a-z].*>|!--)`,"i")},ln=/^(?:[ \t]*(?:\n|$))+/,cn=/^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/,hn=/^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/,je=/^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/,dn=/^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/,jt=/(?:[*+-]|\d{1,9}[.)])/,gr=/^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/,mr=_(gr).replace(/bull/g,jt).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).replace(/\|table/g,"").getRegex(),pn=_(gr).replace(/bull/g,jt).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).replace(/table/g,/ {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(),Ht=/^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/,un=/^[^\n]+/,Vt=/(?!\s*\])(?:\\[\s\S]|[^\[\]\\])+/,fn=_(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label",Vt).replace("title",/(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(),gn=_(/^( {0,3}bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g,jt).getRegex(),ht="address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul",Ft=/<!--(?:-?>|[\s\S]*?(?:-->|$))/,mn=_("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))","i").replace("comment",Ft).replace("tag",ht).replace("attribute",/ +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(),br=_(Ht).replace("hr",je).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("|table","").replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)]) ").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",ht).getRegex(),bn=_(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph",br).getRegex(),Wt={blockquote:bn,code:cn,def:fn,fences:hn,heading:dn,hr:je,html:mn,lheading:mr,list:gn,newline:ln,paragraph:br,table:Be,text:un},Ls=_("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr",je).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("blockquote"," {0,3}>").replace("code","(?: {4}| {0,3}	)[^\\n]").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)]) ").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",ht).getRegex(),yn={...Wt,lheading:pn,table:Ls,paragraph:_(Ht).replace("hr",je).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("table",Ls).replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)]) ").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",ht).getRegex()},_n={...Wt,html:_(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment",Ft).replace(/tag/g,"(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),def:/^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,heading:/^(#{1,6})(.*)(?:\n+|$)/,fences:Be,lheading:/^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,paragraph:_(Ht).replace("hr",je).replace("heading",` *#{1,6} *[^
]`).replace("lheading",mr).replace("|table","").replace("blockquote"," {0,3}>").replace("|fences","").replace("|list","").replace("|html","").replace("|tag","").getRegex()},vn=/^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,wn=/^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,yr=/^( {2,}|\\)\n(?!\s*$)/,xn=/^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/,dt=/[\p{P}\p{S}]/u,Kt=/[\s\p{P}\p{S}]/u,_r=/[^\s\p{P}\p{S}]/u,kn=_(/^((?![*_])punctSpace)/,"u").replace(/punctSpace/g,Kt).getRegex(),vr=/(?!~)[\p{P}\p{S}]/u,$n=/(?!~)[\s\p{P}\p{S}]/u,Sn=/(?:[^\s\p{P}\p{S}]|~)/u,An=_(/link|precode-code|html/,"g").replace("link",/\[(?:[^\[\]`]|(?<a>`+)[^`]+\k<a>(?!`))*?\]\((?:\\[\s\S]|[^\\\(\)]|\((?:\\[\s\S]|[^\\\(\)])*\))*\)/).replace("precode-",an?"(?<!`)()":"(^^|[^`])").replace("code",/(?<b>`+)[^`]+\k<b>(?!`)/).replace("html",/<(?! )[^<>]*?>/).getRegex(),wr=/^(?:\*+(?:((?!\*)punct)|[^\s*]))|^_+(?:((?!_)punct)|([^\s_]))/,En=_(wr,"u").replace(/punct/g,dt).getRegex(),Rn=_(wr,"u").replace(/punct/g,vr).getRegex(),xr="^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)",Pn=_(xr,"gu").replace(/notPunctSpace/g,_r).replace(/punctSpace/g,Kt).replace(/punct/g,dt).getRegex(),In=_(xr,"gu").replace(/notPunctSpace/g,Sn).replace(/punctSpace/g,$n).replace(/punct/g,vr).getRegex(),Cn=_("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)","gu").replace(/notPunctSpace/g,_r).replace(/punctSpace/g,Kt).replace(/punct/g,dt).getRegex(),Tn=_(/\\(punct)/,"gu").replace(/punct/g,dt).getRegex(),On=_(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme",/[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email",/[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(),Nn=_(Ft).replace("(?:-->|$)","-->").getRegex(),Bn=_("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment",Nn).replace("attribute",/\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(),rt=/(?:\[(?:\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+[^`]*?`+(?!`)|[^\[\]\\`])*?/,Dn=_(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]*(?:\n[ \t]*)?)(title))?\s*\)/).replace("label",rt).replace("href",/<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/).replace("title",/"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(),kr=_(/^!?\[(label)\]\[(ref)\]/).replace("label",rt).replace("ref",Vt).getRegex(),$r=_(/^!?\[(ref)\](?:\[\])?/).replace("ref",Vt).getRegex(),Mn=_("reflink|nolink(?!\\()","g").replace("reflink",kr).replace("nolink",$r).getRegex(),Us=/[hH][tT][tT][pP][sS]?|[fF][tT][pP]/,Gt={_backpedal:Be,anyPunctuation:Tn,autolink:On,blockSkip:An,br:yr,code:wn,del:Be,emStrongLDelim:En,emStrongRDelimAst:Pn,emStrongRDelimUnd:Cn,escape:vn,link:Dn,nolink:$r,punctuation:kn,reflink:kr,reflinkSearch:Mn,tag:Bn,text:xn,url:Be},zn={...Gt,link:_(/^!?\[(label)\]\((.*?)\)/).replace("label",rt).getRegex(),reflink:_(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label",rt).getRegex()},Et={...Gt,emStrongRDelimAst:In,emStrongLDelim:Rn,url:_(/^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace("protocol",Us).replace("email",/[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(),_backpedal:/(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,del:/^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/,text:_(/^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/).replace("protocol",Us).getRegex()},Ln={...Et,br:_(yr).replace("{2,}","*").getRegex(),text:_(Et.text).replace("\\b_","\\b_| {2,}\\n").replace(/\{2,\}/g,"*").getRegex()},We={normal:Wt,gfm:yn,pedantic:_n},Pe={normal:Gt,gfm:Et,breaks:Ln,pedantic:zn},Un={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"},qs=s=>Un[s];function te(s,e){if(e){if(B.escapeTest.test(s))return s.replace(B.escapeReplace,qs)}else if(B.escapeTestNoEncode.test(s))return s.replace(B.escapeReplaceNoEncode,qs);return s}function js(s){try{s=encodeURI(s).replace(B.percentDecode,"%")}catch{return null}return s}function Hs(s,e){var n;let t=s.replace(B.findPipe,(o,a,l)=>{let c=!1,d=a;for(;--d>=0&&l[d]==="\\";)c=!c;return c?"|":" |"}),r=t.split(B.splitPipe),i=0;if(r[0].trim()||r.shift(),r.length>0&&!((n=r.at(-1))!=null&&n.trim())&&r.pop(),e)if(r.length>e)r.splice(e);else for(;r.length<e;)r.push("");for(;i<r.length;i++)r[i]=r[i].trim().replace(B.slashPipe,"|");return r}function Ie(s,e,t){let r=s.length;if(r===0)return"";let i=0;for(;i<r&&s.charAt(r-i-1)===e;)i++;return s.slice(0,r-i)}function qn(s,e){if(s.indexOf(e[1])===-1)return-1;let t=0;for(let r=0;r<s.length;r++)if(s[r]==="\\")r++;else if(s[r]===e[0])t++;else if(s[r]===e[1]&&(t--,t<0))return r;return t>0?-2:-1}function Vs(s,e,t,r,i){let n=e.href,o=e.title||null,a=s[1].replace(i.other.outputLinkReplace,"$1");r.state.inLink=!0;let l={type:s[0].charAt(0)==="!"?"image":"link",raw:t,href:n,title:o,text:a,tokens:r.inlineTokens(a)};return r.state.inLink=!1,l}function jn(s,e,t){let r=s.match(t.other.indentCodeCompensation);if(r===null)return e;let i=r[1];return e.split(`
`).map(n=>{let o=n.match(t.other.beginningSpace);if(o===null)return n;let[a]=o;return a.length>=i.length?n.slice(i.length):n}).join(`
`)}var it=class{constructor(s){x(this,"options");x(this,"rules");x(this,"lexer");this.options=s||ge}space(s){let e=this.rules.block.newline.exec(s);if(e&&e[0].length>0)return{type:"space",raw:e[0]}}code(s){let e=this.rules.block.code.exec(s);if(e){let t=e[0].replace(this.rules.other.codeRemoveIndent,"");return{type:"code",raw:e[0],codeBlockStyle:"indented",text:this.options.pedantic?t:Ie(t,`
`)}}}fences(s){let e=this.rules.block.fences.exec(s);if(e){let t=e[0],r=jn(t,e[3]||"",this.rules);return{type:"code",raw:t,lang:e[2]?e[2].trim().replace(this.rules.inline.anyPunctuation,"$1"):e[2],text:r}}}heading(s){let e=this.rules.block.heading.exec(s);if(e){let t=e[2].trim();if(this.rules.other.endingHash.test(t)){let r=Ie(t,"#");(this.options.pedantic||!r||this.rules.other.endingSpaceChar.test(r))&&(t=r.trim())}return{type:"heading",raw:e[0],depth:e[1].length,text:t,tokens:this.lexer.inline(t)}}}hr(s){let e=this.rules.block.hr.exec(s);if(e)return{type:"hr",raw:Ie(e[0],`
`)}}blockquote(s){let e=this.rules.block.blockquote.exec(s);if(e){let t=Ie(e[0],`
`).split(`
`),r="",i="",n=[];for(;t.length>0;){let o=!1,a=[],l;for(l=0;l<t.length;l++)if(this.rules.other.blockquoteStart.test(t[l]))a.push(t[l]),o=!0;else if(!o)a.push(t[l]);else break;t=t.slice(l);let c=a.join(`
`),d=c.replace(this.rules.other.blockquoteSetextReplace,`
    $1`).replace(this.rules.other.blockquoteSetextReplace2,"");r=r?`${r}
${c}`:c,i=i?`${i}
${d}`:d;let p=this.lexer.state.top;if(this.lexer.state.top=!0,this.lexer.blockTokens(d,n,!0),this.lexer.state.top=p,t.length===0)break;let f=n.at(-1);if((f==null?void 0:f.type)==="code")break;if((f==null?void 0:f.type)==="blockquote"){let h=f,y=h.raw+`
`+t.join(`
`),m=this.blockquote(y);n[n.length-1]=m,r=r.substring(0,r.length-h.raw.length)+m.raw,i=i.substring(0,i.length-h.text.length)+m.text;break}else if((f==null?void 0:f.type)==="list"){let h=f,y=h.raw+`
`+t.join(`
`),m=this.list(y);n[n.length-1]=m,r=r.substring(0,r.length-f.raw.length)+m.raw,i=i.substring(0,i.length-h.raw.length)+m.raw,t=y.substring(n.at(-1).raw.length).split(`
`);continue}}return{type:"blockquote",raw:r,tokens:n,text:i}}}list(s){var t,r;let e=this.rules.block.list.exec(s);if(e){let i=e[1].trim(),n=i.length>1,o={type:"list",raw:"",ordered:n,start:n?+i.slice(0,-1):"",loose:!1,items:[]};i=n?`\\d{1,9}\\${i.slice(-1)}`:`\\${i}`,this.options.pedantic&&(i=n?i:"[*+-]");let a=this.rules.other.listItemRegex(i),l=!1;for(;s;){let d=!1,p="",f="";if(!(e=a.exec(s))||this.rules.block.hr.test(s))break;p=e[0],s=s.substring(p.length);let h=e[2].split(`
`,1)[0].replace(this.rules.other.listReplaceTabs,P=>" ".repeat(3*P.length)),y=s.split(`
`,1)[0],m=!h.trim(),k=0;if(this.options.pedantic?(k=2,f=h.trimStart()):m?k=e[1].length+1:(k=e[2].search(this.rules.other.nonSpaceChar),k=k>4?1:k,f=h.slice(k),k+=e[1].length),m&&this.rules.other.blankLine.test(y)&&(p+=y+`
`,s=s.substring(y.length+1),d=!0),!d){let P=this.rules.other.nextBulletRegex(k),M=this.rules.other.hrRegex(k),H=this.rules.other.fencesBeginRegex(k),V=this.rules.other.headingBeginRegex(k),z=this.rules.other.htmlBeginRegex(k);for(;s;){let F=s.split(`
`,1)[0],N;if(y=F,this.options.pedantic?(y=y.replace(this.rules.other.listReplaceNesting,"  "),N=y):N=y.replace(this.rules.other.tabCharGlobal,"    "),H.test(y)||V.test(y)||z.test(y)||P.test(y)||M.test(y))break;if(N.search(this.rules.other.nonSpaceChar)>=k||!y.trim())f+=`
`+N.slice(k);else{if(m||h.replace(this.rules.other.tabCharGlobal,"    ").search(this.rules.other.nonSpaceChar)>=4||H.test(h)||V.test(h)||M.test(h))break;f+=`
`+y}!m&&!y.trim()&&(m=!0),p+=F+`
`,s=s.substring(F.length+1),h=N.slice(k)}}o.loose||(l?o.loose=!0:this.rules.other.doubleBlankLine.test(p)&&(l=!0)),o.items.push({type:"list_item",raw:p,task:!!this.options.gfm&&this.rules.other.listIsTask.test(f),loose:!1,text:f,tokens:[]}),o.raw+=p}let c=o.items.at(-1);if(c)c.raw=c.raw.trimEnd(),c.text=c.text.trimEnd();else return;o.raw=o.raw.trimEnd();for(let d of o.items){if(this.lexer.state.top=!1,d.tokens=this.lexer.blockTokens(d.text,[]),d.task){if(d.text=d.text.replace(this.rules.other.listReplaceTask,""),((t=d.tokens[0])==null?void 0:t.type)==="text"||((r=d.tokens[0])==null?void 0:r.type)==="paragraph"){d.tokens[0].raw=d.tokens[0].raw.replace(this.rules.other.listReplaceTask,""),d.tokens[0].text=d.tokens[0].text.replace(this.rules.other.listReplaceTask,"");for(let f=this.lexer.inlineQueue.length-1;f>=0;f--)if(this.rules.other.listIsTask.test(this.lexer.inlineQueue[f].src)){this.lexer.inlineQueue[f].src=this.lexer.inlineQueue[f].src.replace(this.rules.other.listReplaceTask,"");break}}let p=this.rules.other.listTaskCheckbox.exec(d.raw);if(p){let f={type:"checkbox",raw:p[0]+" ",checked:p[0]!=="[ ]"};d.checked=f.checked,o.loose?d.tokens[0]&&["paragraph","text"].includes(d.tokens[0].type)&&"tokens"in d.tokens[0]&&d.tokens[0].tokens?(d.tokens[0].raw=f.raw+d.tokens[0].raw,d.tokens[0].text=f.raw+d.tokens[0].text,d.tokens[0].tokens.unshift(f)):d.tokens.unshift({type:"paragraph",raw:f.raw,text:f.raw,tokens:[f]}):d.tokens.unshift(f)}}if(!o.loose){let p=d.tokens.filter(h=>h.type==="space"),f=p.length>0&&p.some(h=>this.rules.other.anyLine.test(h.raw));o.loose=f}}if(o.loose)for(let d of o.items){d.loose=!0;for(let p of d.tokens)p.type==="text"&&(p.type="paragraph")}return o}}html(s){let e=this.rules.block.html.exec(s);if(e)return{type:"html",block:!0,raw:e[0],pre:e[1]==="pre"||e[1]==="script"||e[1]==="style",text:e[0]}}def(s){let e=this.rules.block.def.exec(s);if(e){let t=e[1].toLowerCase().replace(this.rules.other.multipleSpaceGlobal," "),r=e[2]?e[2].replace(this.rules.other.hrefBrackets,"$1").replace(this.rules.inline.anyPunctuation,"$1"):"",i=e[3]?e[3].substring(1,e[3].length-1).replace(this.rules.inline.anyPunctuation,"$1"):e[3];return{type:"def",tag:t,raw:e[0],href:r,title:i}}}table(s){var o;let e=this.rules.block.table.exec(s);if(!e||!this.rules.other.tableDelimiter.test(e[2]))return;let t=Hs(e[1]),r=e[2].replace(this.rules.other.tableAlignChars,"").split("|"),i=(o=e[3])!=null&&o.trim()?e[3].replace(this.rules.other.tableRowBlankLine,"").split(`
`):[],n={type:"table",raw:e[0],header:[],align:[],rows:[]};if(t.length===r.length){for(let a of r)this.rules.other.tableAlignRight.test(a)?n.align.push("right"):this.rules.other.tableAlignCenter.test(a)?n.align.push("center"):this.rules.other.tableAlignLeft.test(a)?n.align.push("left"):n.align.push(null);for(let a=0;a<t.length;a++)n.header.push({text:t[a],tokens:this.lexer.inline(t[a]),header:!0,align:n.align[a]});for(let a of i)n.rows.push(Hs(a,n.header.length).map((l,c)=>({text:l,tokens:this.lexer.inline(l),header:!1,align:n.align[c]})));return n}}lheading(s){let e=this.rules.block.lheading.exec(s);if(e)return{type:"heading",raw:e[0],depth:e[2].charAt(0)==="="?1:2,text:e[1],tokens:this.lexer.inline(e[1])}}paragraph(s){let e=this.rules.block.paragraph.exec(s);if(e){let t=e[1].charAt(e[1].length-1)===`
`?e[1].slice(0,-1):e[1];return{type:"paragraph",raw:e[0],text:t,tokens:this.lexer.inline(t)}}}text(s){let e=this.rules.block.text.exec(s);if(e)return{type:"text",raw:e[0],text:e[0],tokens:this.lexer.inline(e[0])}}escape(s){let e=this.rules.inline.escape.exec(s);if(e)return{type:"escape",raw:e[0],text:e[1]}}tag(s){let e=this.rules.inline.tag.exec(s);if(e)return!this.lexer.state.inLink&&this.rules.other.startATag.test(e[0])?this.lexer.state.inLink=!0:this.lexer.state.inLink&&this.rules.other.endATag.test(e[0])&&(this.lexer.state.inLink=!1),!this.lexer.state.inRawBlock&&this.rules.other.startPreScriptTag.test(e[0])?this.lexer.state.inRawBlock=!0:this.lexer.state.inRawBlock&&this.rules.other.endPreScriptTag.test(e[0])&&(this.lexer.state.inRawBlock=!1),{type:"html",raw:e[0],inLink:this.lexer.state.inLink,inRawBlock:this.lexer.state.inRawBlock,block:!1,text:e[0]}}link(s){let e=this.rules.inline.link.exec(s);if(e){let t=e[2].trim();if(!this.options.pedantic&&this.rules.other.startAngleBracket.test(t)){if(!this.rules.other.endAngleBracket.test(t))return;let n=Ie(t.slice(0,-1),"\\");if((t.length-n.length)%2===0)return}else{let n=qn(e[2],"()");if(n===-2)return;if(n>-1){let o=(e[0].indexOf("!")===0?5:4)+e[1].length+n;e[2]=e[2].substring(0,n),e[0]=e[0].substring(0,o).trim(),e[3]=""}}let r=e[2],i="";if(this.options.pedantic){let n=this.rules.other.pedanticHrefTitle.exec(r);n&&(r=n[1],i=n[3])}else i=e[3]?e[3].slice(1,-1):"";return r=r.trim(),this.rules.other.startAngleBracket.test(r)&&(this.options.pedantic&&!this.rules.other.endAngleBracket.test(t)?r=r.slice(1):r=r.slice(1,-1)),Vs(e,{href:r&&r.replace(this.rules.inline.anyPunctuation,"$1"),title:i&&i.replace(this.rules.inline.anyPunctuation,"$1")},e[0],this.lexer,this.rules)}}reflink(s,e){let t;if((t=this.rules.inline.reflink.exec(s))||(t=this.rules.inline.nolink.exec(s))){let r=(t[2]||t[1]).replace(this.rules.other.multipleSpaceGlobal," "),i=e[r.toLowerCase()];if(!i){let n=t[0].charAt(0);return{type:"text",raw:n,text:n}}return Vs(t,i,t[0],this.lexer,this.rules)}}emStrong(s,e,t=""){let r=this.rules.inline.emStrongLDelim.exec(s);if(!(!r||r[3]&&t.match(this.rules.other.unicodeAlphaNumeric))&&(!(r[1]||r[2])||!t||this.rules.inline.punctuation.exec(t))){let i=[...r[0]].length-1,n,o,a=i,l=0,c=r[0][0]==="*"?this.rules.inline.emStrongRDelimAst:this.rules.inline.emStrongRDelimUnd;for(c.lastIndex=0,e=e.slice(-1*s.length+i);(r=c.exec(e))!=null;){if(n=r[1]||r[2]||r[3]||r[4]||r[5]||r[6],!n)continue;if(o=[...n].length,r[3]||r[4]){a+=o;continue}else if((r[5]||r[6])&&i%3&&!((i+o)%3)){l+=o;continue}if(a-=o,a>0)continue;o=Math.min(o,o+a+l);let d=[...r[0]][0].length,p=s.slice(0,i+r.index+d+o);if(Math.min(i,o)%2){let h=p.slice(1,-1);return{type:"em",raw:p,text:h,tokens:this.lexer.inlineTokens(h)}}let f=p.slice(2,-2);return{type:"strong",raw:p,text:f,tokens:this.lexer.inlineTokens(f)}}}}codespan(s){let e=this.rules.inline.code.exec(s);if(e){let t=e[2].replace(this.rules.other.newLineCharGlobal," "),r=this.rules.other.nonSpaceChar.test(t),i=this.rules.other.startingSpaceChar.test(t)&&this.rules.other.endingSpaceChar.test(t);return r&&i&&(t=t.substring(1,t.length-1)),{type:"codespan",raw:e[0],text:t}}}br(s){let e=this.rules.inline.br.exec(s);if(e)return{type:"br",raw:e[0]}}del(s){let e=this.rules.inline.del.exec(s);if(e)return{type:"del",raw:e[0],text:e[2],tokens:this.lexer.inlineTokens(e[2])}}autolink(s){let e=this.rules.inline.autolink.exec(s);if(e){let t,r;return e[2]==="@"?(t=e[1],r="mailto:"+t):(t=e[1],r=t),{type:"link",raw:e[0],text:t,href:r,tokens:[{type:"text",raw:t,text:t}]}}}url(s){var t;let e;if(e=this.rules.inline.url.exec(s)){let r,i;if(e[2]==="@")r=e[0],i="mailto:"+r;else{let n;do n=e[0],e[0]=((t=this.rules.inline._backpedal.exec(e[0]))==null?void 0:t[0])??"";while(n!==e[0]);r=e[0],e[1]==="www."?i="http://"+e[0]:i=e[0]}return{type:"link",raw:e[0],text:r,href:i,tokens:[{type:"text",raw:r,text:r}]}}}inlineText(s){let e=this.rules.inline.text.exec(s);if(e){let t=this.lexer.state.inRawBlock;return{type:"text",raw:e[0],text:e[0],escaped:t}}}},K=class Rt{constructor(e){x(this,"tokens");x(this,"options");x(this,"state");x(this,"inlineQueue");x(this,"tokenizer");this.tokens=[],this.tokens.links=Object.create(null),this.options=e||ge,this.options.tokenizer=this.options.tokenizer||new it,this.tokenizer=this.options.tokenizer,this.tokenizer.options=this.options,this.tokenizer.lexer=this,this.inlineQueue=[],this.state={inLink:!1,inRawBlock:!1,top:!0};let t={other:B,block:We.normal,inline:Pe.normal};this.options.pedantic?(t.block=We.pedantic,t.inline=Pe.pedantic):this.options.gfm&&(t.block=We.gfm,this.options.breaks?t.inline=Pe.breaks:t.inline=Pe.gfm),this.tokenizer.rules=t}static get rules(){return{block:We,inline:Pe}}static lex(e,t){return new Rt(t).lex(e)}static lexInline(e,t){return new Rt(t).inlineTokens(e)}lex(e){e=e.replace(B.carriageReturn,`
`),this.blockTokens(e,this.tokens);for(let t=0;t<this.inlineQueue.length;t++){let r=this.inlineQueue[t];this.inlineTokens(r.src,r.tokens)}return this.inlineQueue=[],this.tokens}blockTokens(e,t=[],r=!1){var i,n,o;for(this.options.pedantic&&(e=e.replace(B.tabCharGlobal,"    ").replace(B.spaceLine,""));e;){let a;if((n=(i=this.options.extensions)==null?void 0:i.block)!=null&&n.some(c=>(a=c.call({lexer:this},e,t))?(e=e.substring(a.raw.length),t.push(a),!0):!1))continue;if(a=this.tokenizer.space(e)){e=e.substring(a.raw.length);let c=t.at(-1);a.raw.length===1&&c!==void 0?c.raw+=`
`:t.push(a);continue}if(a=this.tokenizer.code(e)){e=e.substring(a.raw.length);let c=t.at(-1);(c==null?void 0:c.type)==="paragraph"||(c==null?void 0:c.type)==="text"?(c.raw+=(c.raw.endsWith(`
`)?"":`
`)+a.raw,c.text+=`
`+a.text,this.inlineQueue.at(-1).src=c.text):t.push(a);continue}if(a=this.tokenizer.fences(e)){e=e.substring(a.raw.length),t.push(a);continue}if(a=this.tokenizer.heading(e)){e=e.substring(a.raw.length),t.push(a);continue}if(a=this.tokenizer.hr(e)){e=e.substring(a.raw.length),t.push(a);continue}if(a=this.tokenizer.blockquote(e)){e=e.substring(a.raw.length),t.push(a);continue}if(a=this.tokenizer.list(e)){e=e.substring(a.raw.length),t.push(a);continue}if(a=this.tokenizer.html(e)){e=e.substring(a.raw.length),t.push(a);continue}if(a=this.tokenizer.def(e)){e=e.substring(a.raw.length);let c=t.at(-1);(c==null?void 0:c.type)==="paragraph"||(c==null?void 0:c.type)==="text"?(c.raw+=(c.raw.endsWith(`
`)?"":`
`)+a.raw,c.text+=`
`+a.raw,this.inlineQueue.at(-1).src=c.text):this.tokens.links[a.tag]||(this.tokens.links[a.tag]={href:a.href,title:a.title},t.push(a));continue}if(a=this.tokenizer.table(e)){e=e.substring(a.raw.length),t.push(a);continue}if(a=this.tokenizer.lheading(e)){e=e.substring(a.raw.length),t.push(a);continue}let l=e;if((o=this.options.extensions)!=null&&o.startBlock){let c=1/0,d=e.slice(1),p;this.options.extensions.startBlock.forEach(f=>{p=f.call({lexer:this},d),typeof p=="number"&&p>=0&&(c=Math.min(c,p))}),c<1/0&&c>=0&&(l=e.substring(0,c+1))}if(this.state.top&&(a=this.tokenizer.paragraph(l))){let c=t.at(-1);r&&(c==null?void 0:c.type)==="paragraph"?(c.raw+=(c.raw.endsWith(`
`)?"":`
`)+a.raw,c.text+=`
`+a.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=c.text):t.push(a),r=l.length!==e.length,e=e.substring(a.raw.length);continue}if(a=this.tokenizer.text(e)){e=e.substring(a.raw.length);let c=t.at(-1);(c==null?void 0:c.type)==="text"?(c.raw+=(c.raw.endsWith(`
`)?"":`
`)+a.raw,c.text+=`
`+a.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=c.text):t.push(a);continue}if(e){let c="Infinite loop on byte: "+e.charCodeAt(0);if(this.options.silent){console.error(c);break}else throw new Error(c)}}return this.state.top=!0,t}inline(e,t=[]){return this.inlineQueue.push({src:e,tokens:t}),t}inlineTokens(e,t=[]){var l,c,d,p,f;let r=e,i=null;if(this.tokens.links){let h=Object.keys(this.tokens.links);if(h.length>0)for(;(i=this.tokenizer.rules.inline.reflinkSearch.exec(r))!=null;)h.includes(i[0].slice(i[0].lastIndexOf("[")+1,-1))&&(r=r.slice(0,i.index)+"["+"a".repeat(i[0].length-2)+"]"+r.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex))}for(;(i=this.tokenizer.rules.inline.anyPunctuation.exec(r))!=null;)r=r.slice(0,i.index)+"++"+r.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);let n;for(;(i=this.tokenizer.rules.inline.blockSkip.exec(r))!=null;)n=i[2]?i[2].length:0,r=r.slice(0,i.index+n)+"["+"a".repeat(i[0].length-n-2)+"]"+r.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);r=((c=(l=this.options.hooks)==null?void 0:l.emStrongMask)==null?void 0:c.call({lexer:this},r))??r;let o=!1,a="";for(;e;){o||(a=""),o=!1;let h;if((p=(d=this.options.extensions)==null?void 0:d.inline)!=null&&p.some(m=>(h=m.call({lexer:this},e,t))?(e=e.substring(h.raw.length),t.push(h),!0):!1))continue;if(h=this.tokenizer.escape(e)){e=e.substring(h.raw.length),t.push(h);continue}if(h=this.tokenizer.tag(e)){e=e.substring(h.raw.length),t.push(h);continue}if(h=this.tokenizer.link(e)){e=e.substring(h.raw.length),t.push(h);continue}if(h=this.tokenizer.reflink(e,this.tokens.links)){e=e.substring(h.raw.length);let m=t.at(-1);h.type==="text"&&(m==null?void 0:m.type)==="text"?(m.raw+=h.raw,m.text+=h.text):t.push(h);continue}if(h=this.tokenizer.emStrong(e,r,a)){e=e.substring(h.raw.length),t.push(h);continue}if(h=this.tokenizer.codespan(e)){e=e.substring(h.raw.length),t.push(h);continue}if(h=this.tokenizer.br(e)){e=e.substring(h.raw.length),t.push(h);continue}if(h=this.tokenizer.del(e)){e=e.substring(h.raw.length),t.push(h);continue}if(h=this.tokenizer.autolink(e)){e=e.substring(h.raw.length),t.push(h);continue}if(!this.state.inLink&&(h=this.tokenizer.url(e))){e=e.substring(h.raw.length),t.push(h);continue}let y=e;if((f=this.options.extensions)!=null&&f.startInline){let m=1/0,k=e.slice(1),P;this.options.extensions.startInline.forEach(M=>{P=M.call({lexer:this},k),typeof P=="number"&&P>=0&&(m=Math.min(m,P))}),m<1/0&&m>=0&&(y=e.substring(0,m+1))}if(h=this.tokenizer.inlineText(y)){e=e.substring(h.raw.length),h.raw.slice(-1)!=="_"&&(a=h.raw.slice(-1)),o=!0;let m=t.at(-1);(m==null?void 0:m.type)==="text"?(m.raw+=h.raw,m.text+=h.text):t.push(h);continue}if(e){let m="Infinite loop on byte: "+e.charCodeAt(0);if(this.options.silent){console.error(m);break}else throw new Error(m)}}return t}},nt=class{constructor(s){x(this,"options");x(this,"parser");this.options=s||ge}space(s){return""}code({text:s,lang:e,escaped:t}){var n;let r=(n=(e||"").match(B.notSpaceStart))==null?void 0:n[0],i=s.replace(B.endingNewline,"")+`
`;return r?'<pre><code class="language-'+te(r)+'">'+(t?i:te(i,!0))+`</code></pre>
`:"<pre><code>"+(t?i:te(i,!0))+`</code></pre>
`}blockquote({tokens:s}){return`<blockquote>
${this.parser.parse(s)}</blockquote>
`}html({text:s}){return s}def(s){return""}heading({tokens:s,depth:e}){return`<h${e}>${this.parser.parseInline(s)}</h${e}>
`}hr(s){return`<hr>
`}list(s){let e=s.ordered,t=s.start,r="";for(let o=0;o<s.items.length;o++){let a=s.items[o];r+=this.listitem(a)}let i=e?"ol":"ul",n=e&&t!==1?' start="'+t+'"':"";return"<"+i+n+`>
`+r+"</"+i+`>
`}listitem(s){return`<li>${this.parser.parse(s.tokens)}</li>
`}checkbox({checked:s}){return"<input "+(s?'checked="" ':"")+'disabled="" type="checkbox"> '}paragraph({tokens:s}){return`<p>${this.parser.parseInline(s)}</p>
`}table(s){let e="",t="";for(let i=0;i<s.header.length;i++)t+=this.tablecell(s.header[i]);e+=this.tablerow({text:t});let r="";for(let i=0;i<s.rows.length;i++){let n=s.rows[i];t="";for(let o=0;o<n.length;o++)t+=this.tablecell(n[o]);r+=this.tablerow({text:t})}return r&&(r=`<tbody>${r}</tbody>`),`<table>
<thead>
`+e+`</thead>
`+r+`</table>
`}tablerow({text:s}){return`<tr>
${s}</tr>
`}tablecell(s){let e=this.parser.parseInline(s.tokens),t=s.header?"th":"td";return(s.align?`<${t} align="${s.align}">`:`<${t}>`)+e+`</${t}>
`}strong({tokens:s}){return`<strong>${this.parser.parseInline(s)}</strong>`}em({tokens:s}){return`<em>${this.parser.parseInline(s)}</em>`}codespan({text:s}){return`<code>${te(s,!0)}</code>`}br(s){return"<br>"}del({tokens:s}){return`<del>${this.parser.parseInline(s)}</del>`}link({href:s,title:e,tokens:t}){let r=this.parser.parseInline(t),i=js(s);if(i===null)return r;s=i;let n='<a href="'+s+'"';return e&&(n+=' title="'+te(e)+'"'),n+=">"+r+"</a>",n}image({href:s,title:e,text:t,tokens:r}){r&&(t=this.parser.parseInline(r,this.parser.textRenderer));let i=js(s);if(i===null)return te(t);s=i;let n=`<img src="${s}" alt="${t}"`;return e&&(n+=` title="${te(e)}"`),n+=">",n}text(s){return"tokens"in s&&s.tokens?this.parser.parseInline(s.tokens):"escaped"in s&&s.escaped?s.text:te(s.text)}},Zt=class{strong({text:s}){return s}em({text:s}){return s}codespan({text:s}){return s}del({text:s}){return s}html({text:s}){return s}text({text:s}){return s}link({text:s}){return""+s}image({text:s}){return""+s}br(){return""}checkbox({raw:s}){return s}},G=class Pt{constructor(e){x(this,"options");x(this,"renderer");x(this,"textRenderer");this.options=e||ge,this.options.renderer=this.options.renderer||new nt,this.renderer=this.options.renderer,this.renderer.options=this.options,this.renderer.parser=this,this.textRenderer=new Zt}static parse(e,t){return new Pt(t).parse(e)}static parseInline(e,t){return new Pt(t).parseInline(e)}parse(e){var r,i;let t="";for(let n=0;n<e.length;n++){let o=e[n];if((i=(r=this.options.extensions)==null?void 0:r.renderers)!=null&&i[o.type]){let l=o,c=this.options.extensions.renderers[l.type].call({parser:this},l);if(c!==!1||!["space","hr","heading","code","table","blockquote","list","html","def","paragraph","text"].includes(l.type)){t+=c||"";continue}}let a=o;switch(a.type){case"space":{t+=this.renderer.space(a);break}case"hr":{t+=this.renderer.hr(a);break}case"heading":{t+=this.renderer.heading(a);break}case"code":{t+=this.renderer.code(a);break}case"table":{t+=this.renderer.table(a);break}case"blockquote":{t+=this.renderer.blockquote(a);break}case"list":{t+=this.renderer.list(a);break}case"checkbox":{t+=this.renderer.checkbox(a);break}case"html":{t+=this.renderer.html(a);break}case"def":{t+=this.renderer.def(a);break}case"paragraph":{t+=this.renderer.paragraph(a);break}case"text":{t+=this.renderer.text(a);break}default:{let l='Token with "'+a.type+'" type was not found.';if(this.options.silent)return console.error(l),"";throw new Error(l)}}}return t}parseInline(e,t=this.renderer){var i,n;let r="";for(let o=0;o<e.length;o++){let a=e[o];if((n=(i=this.options.extensions)==null?void 0:i.renderers)!=null&&n[a.type]){let c=this.options.extensions.renderers[a.type].call({parser:this},a);if(c!==!1||!["escape","html","link","image","strong","em","codespan","br","del","text"].includes(a.type)){r+=c||"";continue}}let l=a;switch(l.type){case"escape":{r+=t.text(l);break}case"html":{r+=t.html(l);break}case"link":{r+=t.link(l);break}case"image":{r+=t.image(l);break}case"checkbox":{r+=t.checkbox(l);break}case"strong":{r+=t.strong(l);break}case"em":{r+=t.em(l);break}case"codespan":{r+=t.codespan(l);break}case"br":{r+=t.br(l);break}case"del":{r+=t.del(l);break}case"text":{r+=t.text(l);break}default:{let c='Token with "'+l.type+'" type was not found.';if(this.options.silent)return console.error(c),"";throw new Error(c)}}}return r}},Ke,Te=(Ke=class{constructor(s){x(this,"options");x(this,"block");this.options=s||ge}preprocess(s){return s}postprocess(s){return s}processAllTokens(s){return s}emStrongMask(s){return s}provideLexer(){return this.block?K.lex:K.lexInline}provideParser(){return this.block?G.parse:G.parseInline}},x(Ke,"passThroughHooks",new Set(["preprocess","postprocess","processAllTokens","emStrongMask"])),x(Ke,"passThroughHooksRespectAsync",new Set(["preprocess","postprocess","processAllTokens"])),Ke),Hn=class{constructor(...s){x(this,"defaults",qt());x(this,"options",this.setOptions);x(this,"parse",this.parseMarkdown(!0));x(this,"parseInline",this.parseMarkdown(!1));x(this,"Parser",G);x(this,"Renderer",nt);x(this,"TextRenderer",Zt);x(this,"Lexer",K);x(this,"Tokenizer",it);x(this,"Hooks",Te);this.use(...s)}walkTokens(s,e){var r,i;let t=[];for(let n of s)switch(t=t.concat(e.call(this,n)),n.type){case"table":{let o=n;for(let a of o.header)t=t.concat(this.walkTokens(a.tokens,e));for(let a of o.rows)for(let l of a)t=t.concat(this.walkTokens(l.tokens,e));break}case"list":{let o=n;t=t.concat(this.walkTokens(o.items,e));break}default:{let o=n;(i=(r=this.defaults.extensions)==null?void 0:r.childTokens)!=null&&i[o.type]?this.defaults.extensions.childTokens[o.type].forEach(a=>{let l=o[a].flat(1/0);t=t.concat(this.walkTokens(l,e))}):o.tokens&&(t=t.concat(this.walkTokens(o.tokens,e)))}}return t}use(...s){let e=this.defaults.extensions||{renderers:{},childTokens:{}};return s.forEach(t=>{let r={...t};if(r.async=this.defaults.async||r.async||!1,t.extensions&&(t.extensions.forEach(i=>{if(!i.name)throw new Error("extension name required");if("renderer"in i){let n=e.renderers[i.name];n?e.renderers[i.name]=function(...o){let a=i.renderer.apply(this,o);return a===!1&&(a=n.apply(this,o)),a}:e.renderers[i.name]=i.renderer}if("tokenizer"in i){if(!i.level||i.level!=="block"&&i.level!=="inline")throw new Error("extension level must be 'block' or 'inline'");let n=e[i.level];n?n.unshift(i.tokenizer):e[i.level]=[i.tokenizer],i.start&&(i.level==="block"?e.startBlock?e.startBlock.push(i.start):e.startBlock=[i.start]:i.level==="inline"&&(e.startInline?e.startInline.push(i.start):e.startInline=[i.start]))}"childTokens"in i&&i.childTokens&&(e.childTokens[i.name]=i.childTokens)}),r.extensions=e),t.renderer){let i=this.defaults.renderer||new nt(this.defaults);for(let n in t.renderer){if(!(n in i))throw new Error(`renderer '${n}' does not exist`);if(["options","parser"].includes(n))continue;let o=n,a=t.renderer[o],l=i[o];i[o]=(...c)=>{let d=a.apply(i,c);return d===!1&&(d=l.apply(i,c)),d||""}}r.renderer=i}if(t.tokenizer){let i=this.defaults.tokenizer||new it(this.defaults);for(let n in t.tokenizer){if(!(n in i))throw new Error(`tokenizer '${n}' does not exist`);if(["options","rules","lexer"].includes(n))continue;let o=n,a=t.tokenizer[o],l=i[o];i[o]=(...c)=>{let d=a.apply(i,c);return d===!1&&(d=l.apply(i,c)),d}}r.tokenizer=i}if(t.hooks){let i=this.defaults.hooks||new Te;for(let n in t.hooks){if(!(n in i))throw new Error(`hook '${n}' does not exist`);if(["options","block"].includes(n))continue;let o=n,a=t.hooks[o],l=i[o];Te.passThroughHooks.has(n)?i[o]=c=>{if(this.defaults.async&&Te.passThroughHooksRespectAsync.has(n))return(async()=>{let p=await a.call(i,c);return l.call(i,p)})();let d=a.call(i,c);return l.call(i,d)}:i[o]=(...c)=>{if(this.defaults.async)return(async()=>{let p=await a.apply(i,c);return p===!1&&(p=await l.apply(i,c)),p})();let d=a.apply(i,c);return d===!1&&(d=l.apply(i,c)),d}}r.hooks=i}if(t.walkTokens){let i=this.defaults.walkTokens,n=t.walkTokens;r.walkTokens=function(o){let a=[];return a.push(n.call(this,o)),i&&(a=a.concat(i.call(this,o))),a}}this.defaults={...this.defaults,...r}}),this}setOptions(s){return this.defaults={...this.defaults,...s},this}lexer(s,e){return K.lex(s,e??this.defaults)}parser(s,e){return G.parse(s,e??this.defaults)}parseMarkdown(s){return(e,t)=>{let r={...t},i={...this.defaults,...r},n=this.onError(!!i.silent,!!i.async);if(this.defaults.async===!0&&r.async===!1)return n(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));if(typeof e>"u"||e===null)return n(new Error("marked(): input parameter is undefined or null"));if(typeof e!="string")return n(new Error("marked(): input parameter is of type "+Object.prototype.toString.call(e)+", string expected"));if(i.hooks&&(i.hooks.options=i,i.hooks.block=s),i.async)return(async()=>{let o=i.hooks?await i.hooks.preprocess(e):e,a=await(i.hooks?await i.hooks.provideLexer():s?K.lex:K.lexInline)(o,i),l=i.hooks?await i.hooks.processAllTokens(a):a;i.walkTokens&&await Promise.all(this.walkTokens(l,i.walkTokens));let c=await(i.hooks?await i.hooks.provideParser():s?G.parse:G.parseInline)(l,i);return i.hooks?await i.hooks.postprocess(c):c})().catch(n);try{i.hooks&&(e=i.hooks.preprocess(e));let o=(i.hooks?i.hooks.provideLexer():s?K.lex:K.lexInline)(e,i);i.hooks&&(o=i.hooks.processAllTokens(o)),i.walkTokens&&this.walkTokens(o,i.walkTokens);let a=(i.hooks?i.hooks.provideParser():s?G.parse:G.parseInline)(o,i);return i.hooks&&(a=i.hooks.postprocess(a)),a}catch(o){return n(o)}}}onError(s,e){return t=>{if(t.message+=`
Please report this to https://github.com/markedjs/marked.`,s){let r="<p>An error occurred:</p><pre>"+te(t.message+"",!0)+"</pre>";return e?Promise.resolve(r):r}if(e)return Promise.reject(t);throw t}}},fe=new Hn;function w(s,e){return fe.parse(s,e)}w.options=w.setOptions=function(s){return fe.setOptions(s),w.defaults=fe.defaults,fr(w.defaults),w};w.getDefaults=qt;w.defaults=ge;w.use=function(...s){return fe.use(...s),w.defaults=fe.defaults,fr(w.defaults),w};w.walkTokens=function(s,e){return fe.walkTokens(s,e)};w.parseInline=fe.parseInline;w.Parser=G;w.parser=G.parse;w.Renderer=nt;w.TextRenderer=Zt;w.Lexer=K;w.lexer=K.lex;w.Tokenizer=it;w.Hooks=Te;w.parse=w;w.options;w.setOptions;w.use;w.walkTokens;w.parseInline;G.parse;K.lex;var Vn=Object.defineProperty,Fn=Object.getOwnPropertyDescriptor,Qt=(s,e,t,r)=>{for(var i=r>1?void 0:r?Fn(e,t):e,n=s.length-1,o;n>=0;n--)(o=s[n])&&(i=(r?o(e,t,i):o(i))||i);return r&&i&&Vn(e,t,i),i};let ze=class extends I{constructor(){super(...arguments),this.currentRound=1,this.viewingRound=1}_prev(){this.viewingRound>1&&this.dispatchEvent(new CustomEvent("view-round-change",{detail:{round:this.viewingRound-1},bubbles:!0,composed:!0}))}_next(){this.viewingRound<this.currentRound&&this.dispatchEvent(new CustomEvent("view-round-change",{detail:{round:this.viewingRound+1},bubbles:!0,composed:!0}))}render(){return u`
            <div class="container">
                <button 
                    @click="${this._prev}" 
                    ?disabled="${this.viewingRound<=1}"
                    title="Previous Round"
                >
                    ❮
                </button>
                
                <div class="label">
                    Round 
                    <span class="${this.viewingRound!==this.currentRound?"highlight":""}">
                        ${this.viewingRound}
                    </span>
                    <span style="color: #6b7280; font-weight: normal; margin-left: 2px;">/ ${this.currentRound}</span>
                </div>

                <button 
                    @click="${this._next}" 
                    ?disabled="${this.viewingRound>=this.currentRound}"
                    title="Next Round"
                >
                    ❯
                </button>
            </div>
        `}};ze.styles=U`
        :host {
            display: inline-block;
        }

        .container {
            display: flex;
            align-items: center;
            background-color: #1f2937;
            border-radius: 9999px; /* Pill shape */
            padding: 0.125rem;
            border: 1px solid #4b5563;
        }

        button {
            background: transparent;
            border: none;
            color: #d1d5db;
            cursor: pointer;
            padding: 0.25rem 0.6rem;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 9999px;
            transition: all 0.2s;
            font-size: 0.875rem;
        }

        button:hover:not(:disabled) {
            background-color: #374151;
            color: white;
        }

        button:disabled {
            opacity: 0.3;
            cursor: not-allowed;
        }

        .label {
            padding: 0 0.75rem;
            color: #e5e7eb;
            font-weight: bold;
            font-size: 0.875rem;
            white-space: nowrap;
            user-select: none;
        }

        .highlight {
            color: #fbbf24; /* amber-400 */
        }
    `;Qt([g({type:Number})],ze.prototype,"currentRound",2);Qt([g({type:Number})],ze.prototype,"viewingRound",2);ze=Qt([q("round-selector")],ze);var Wn=Object.defineProperty,Kn=Object.getOwnPropertyDescriptor,O=(s,e,t,r)=>{for(var i=r>1?void 0:r?Kn(e,t):e,n=s.length-1,o;n>=0;n--)(o=s[n])&&(i=(r?o(e,t,i):o(i))||i);return r&&i&&Wn(e,t,i),i};let R=class extends I{constructor(){super(...arguments),this.scene=null,this.history=[],this.players=[],this.currentRound=1,this.viewingRound=1,this.isDirector=!1,this.messages=[],this.currentUserId="",this.directorId="",this.sessionId="",this.canChat=!1,this.isEnded=!1,this.isRoundActive=!1,this._isEditing=!1,this._editDescription="",this._chatInputValue=""}_startRound(){this.dispatchEvent(new CustomEvent("start-round",{bubbles:!0,composed:!0}))}_triggerNextRound(){this.dispatchEvent(new CustomEvent("next-round",{bubbles:!0,composed:!0}))}_startEditing(){this.scene?this._editDescription=this.scene.description:this._editDescription="",this._isEditing=!0}_cancelEditing(){this._isEditing=!1}_updateScene(){this.dispatchEvent(new CustomEvent("update-scene",{detail:{description:this._editDescription},bubbles:!0,composed:!0})),this._isEditing=!1}_handleDragOver(s){s.preventDefault(),s.stopPropagation()}async _handleDrop(s){if(s.preventDefault(),s.stopPropagation(),s.dataTransfer&&s.dataTransfer.files.length>0){const e=s.dataTransfer.files[0];e.type.startsWith("image/")&&await this._uploadImage(e)}}async _uploadImage(s){var t;if(!this.sessionId){console.error("No session ID available for upload"),alert("Cannot upload: Session ID missing");return}const e=new FormData;e.append("sessionId",this.sessionId),e.append("image",s);try{const r=await fetch("/upload",{method:"POST",body:e});if(r.ok){const n=`
![Image](${(await r.json()).url})
`,o=(t=this.shadowRoot)==null?void 0:t.querySelector("textarea");if(o){const a=o.selectionStart,l=o.selectionEnd,c=this._editDescription;this._editDescription=c.substring(0,a)+n+c.substring(l),this.requestUpdate()}else this._editDescription+=n}else console.error("Upload failed"),alert("Failed to upload image")}catch(r){console.error("Error uploading image:",r),alert("Error uploading image")}}_handleChatInput(s){this._chatInputValue=s.target.value}_handleChatKeyDown(s){s.key==="Enter"&&this._sendChatMessage()}_sendChatMessage(){this._chatInputValue.trim()&&(this.dispatchEvent(new CustomEvent("message-sent",{detail:{message:this._chatInputValue},bubbles:!0,composed:!0})),this._chatInputValue="")}updated(s){var e;(s.has("scene")||s.has("isDirector"))&&this.isDirector&&this.viewingRound===this.currentRound&&!((e=this.scene)!=null&&e.description)&&!this._isEditing&&this._startEditing()}render(){let s=this.scene;if(this.viewingRound<this.currentRound){const r=this.history.find(i=>i.round===this.viewingRound);r&&(s=r.scene)}const e=this.messages.filter(r=>r.round===this.viewingRound&&!r.isAction&&!r.recipientId),t=this.messages.filter(r=>r.round===this.viewingRound&&r.recipientId&&(r.recipientId===this.currentUserId||this.isDirector));return u`
      <div class="scene-container">
        <div class="header">
            <div style="display: flex; gap: 1rem; align-items: center;">
                <round-selector
                    .currentRound="${this.currentRound}"
                    .viewingRound="${this.viewingRound}"
                ></round-selector>

                ${this.isDirector&&this.viewingRound===this.currentRound&&!this.isEnded?u`
                    ${this.isRoundActive?u`
                         <button @click="${this._triggerNextRound}" style="background-color: #fbbf24; color: #1f2937; border: none; padding: 0.25rem 0.75rem; font-size: 0.875rem;">Next Round</button>
                    `:u`
                        <button @click="${this._startRound}" style="background-color: #3b82f6; border: none; padding: 0.25rem 0.75rem; font-size: 0.875rem;">Start Round</button>
                    `}
                    ${this._isEditing?"":u`
                        <button @click="${this._startEditing}" style="padding: 0.25rem 0.75rem; font-size: 0.875rem;">Edit Scene</button>
                    `}
                `:""}
                ${this.isEnded?u`<span style="color: #ef4444; font-weight: bold; margin-left: 1rem;">(GAME ENDED)</span>`:""}
            </div>
        </div>

        ${this._isEditing&&this.viewingRound===this.currentRound?u`
            <div 
                class="edit-form" 
                @dragover="${this._handleDragOver}" 
                @drop="${this._handleDrop}"
            >
                <div class="form-group">
                    <label>Scene Description (Drag & Drop images here)</label>
                    <textarea
                        .value="${this._editDescription}"
                        @input="${r=>this._editDescription=r.target.value}"
                        placeholder="Describe the scene..."
                    ></textarea>
                </div>

                <div class="button-row">
                    <button @click="${this._updateScene}" style="background-color: #10b981; border: none;">Save Changes</button>
                    <button @click="${this._cancelEditing}">Cancel</button>
                </div>
            </div>
        `:""}

        ${this._isEditing?"":u`

            <div class="description">
            ${s!=null&&s.description?on(w.parse(s.description)):u`<span class="placeholder">Waiting for the director to set the scene...</span>`}

            ${t.length>0?u`
                ${t.map(r=>{var i;return u`
                  <div class="private-message">
                    ${this.isDirector?u`<div class="info">Secret for ${((i=this.players.find(n=>n.id===r.recipientId))==null?void 0:i.name)||"Unknown"}</div>`:""}
                    <div class="content">${r.content}</div>
                  </div>
                `})}
            `:""}

            ${this.messages.filter(r=>r.round===this.viewingRound&&r.isAction&&(this.isDirector||r.senderId===this.currentUserId)).map(r=>u`
                <div style="margin-top: 1rem; padding: 0.5rem; background: #374151; border-radius: 0.25rem; border-left: 3px solid #fbbf24;">
                     <div style="font-size: 0.75rem; color: #9ca3af; margin-bottom: 0.25rem; font-weight: bold;">
                        ${r.senderId===this.currentUserId?"YOUR ACTION":`ACTION: ${r.senderName}`}
                     </div>
                     <div style="color: #e5e7eb; font-style: italic;">
                        "${r.content}"
                     </div>
                </div>
            `)}


            </div>


            <!-- CHAT INTEGRATION -->
            <div class="chat-section">
                <div class="messages-list">
                    ${e.length===0?u`<div style="color: #6b7280; font-style: italic; font-size: 0.9rem;">No messages in this round.</div>`:""}
                    ${e.map(r=>{const i=this.players.find(d=>d.id===r.senderId),n=(i==null?void 0:i.avatarIndex)!==void 0?i.avatarIndex:0,o=n%8,a=Math.floor(n/8),l=-(o*32),c=-(a*32);return u`
                        <div class="message ${r.senderId===this.currentUserId?"own":r.senderId===this.directorId?"director":"other"}">
                            <div class="message-avatar-container">
                                <img 
                                    src="/characters.jpg" 
                                    class="message-avatar-image" 
                                    style="transform: translate(${l}px, ${c}px);"
                                    alt="Av"
                                >
                            </div>
                            <div class="message-content">
                                <div class="message-sender">${r.senderName}</div>
                                <div>${r.content}</div>
                            </div>
                        </div>
                    `})}
                </div>
                
                ${this.viewingRound===this.currentRound&&this.canChat&&!this.isEnded?u`
                    <div class="chat-input-area">
                        <input 
                            type="text" 
                            .value="${this._chatInputValue}" 
                            @input="${this._handleChatInput}"
                            @keydown="${this._handleChatKeyDown}"
                            placeholder="Type a message..."
                        />
                        <button @click="${this._sendChatMessage}">Send</button>
                    </div>
                `:""}
            </div>

        `}
        
      </div>
    `}};R.styles=U`
    :host {
      display: block;
      padding-left: 1rem;
      padding-right: 1rem;
      color: white;
    }

    .scene-container {
      background-color: #1f2937;
      border-radius: 0.5rem;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    .header {
        padding: 1rem 1.5rem;
        background-color: #374151;
        border-bottom: 1px solid #4b5563;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    h2 {
        margin: 0;
        font-size: 1.25rem;
        color: #e5e7eb;
    }

    .image-container {
      width: 100%;
      height: 300px;
      background-color: #111827;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .placeholder {
      color: #6b7280;
      font-style: italic;
    }

    .description {
      padding: 1rem;
      font-size: 1.125rem;
      color: #e5e7eb;
      background: #000;
      min-height: 400px;
    }

    .description img {
        max-width: 100%;
        height: auto;
        border-radius: 0.25rem;
        margin: 1rem 0;
    }

    button {
        padding: 0.5rem 1rem;
        border-radius: 0.25rem;
        border: 1px solid #4b5563;
        background-color: #1f2937;
        color: white;
        cursor: pointer;
        transition: all 0.2s;
    }

    button:hover:not(:disabled) {
        background-color: #4b5563;
    }

    button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    .edit-form {
      padding: 1.5rem;
      border-bottom: 1px solid #4b5563;
    }

    .form-group {
      margin-bottom: 1rem;
    }

    label {
      display: block;
      margin-bottom: 0.5rem;
      font-size: 0.875rem;
      color: #9ca3af;
    }

    input, textarea {
      width: 100%;
      padding: 0.5rem;
      border-radius: 0.25rem;
      border: 1px solid #222;
      background-color: #000;
      color: white;
      box-sizing: border-box;
      font-family: inherit;
    }

    textarea {
      min-height: 150px;
      resize: vertical;
    }

    .button-row {
      display: flex;
      gap: 0.5rem;
    }

    /* CHAT STYLES */
    .chat-section {
        padding: 1em 1.5rem 1.5rem 1.5rem;
        border-top: 1px solid #4b5563;
        margin-top: 0;
        background-color: #111;
    }

    .chat-header-text {
        font-size: 0.875rem;
        color: #9ca3af;
        margin-bottom: 1rem;
        text-transform: uppercase;
        font-weight: bold;
        padding-top: 1rem;
    }

    .messages-list {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        margin-bottom: 1rem;
    }

    .message {
      padding: 0.5rem 0.75rem;
      max-width: 90%;
      word-wrap: break-word;
      font-size: 0.95rem;
      display: flex;
      gap: 0.5rem;
      align-items: flex-start;
    }

    .message.own {
      align-self: flex-end;
      background-color: #3c3c3c;
      color: white;
      flex-direction: row-reverse;
    }
    
    .message.own .message-sender {
        color: #e0e7ff;
        text-align: right;
    }

    .message.other {
      align-self: flex-start;
      background-color: #242424;
      color: #aaa;
    }

    .message.director {
      background-color: #000;
      color: white;
    }

    .message.director .message-avatar-container, .message.director .message-sender {
      display: none;
    }

    .message-content {
        display: flex;
        flex-direction: column;
        min-width: 0;
    }

    .message-sender {
      font-size: 0.75rem;
      margin-bottom: 0.25rem;
      font-weight: bold;
      color: #d1d5db;
    }

    .chat-input-area {
        display: flex;
        gap: 0.5rem;
    }

    /* Message Avatar Styles */
    .message-avatar-container {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      overflow: hidden;
      background-color: #111827;
      position: relative;
      flex-shrink: 0;
      border: 1px solid #4b5563;
    }

    .message-avatar-image {
      width: 256px; 
      height: auto; 
      image-rendering: pixelated;
      position: absolute;
    }

    .private-message {
      color: #cdd379ff;
      margin-top:1em;
    }

    .private-message .content {
      padding: 0.2rem;
    }

    ::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }
    ::-webkit-scrollbar-track {
      background: #1f2937;
    }
    ::-webkit-scrollbar-thumb {
      background: #4b5563;
      border-radius: 4px;
    }
    ::-webkit-scrollbar-thumb:hover {
      background: #6b7280;
    }
  `;O([g({type:Object})],R.prototype,"scene",2);O([g({type:Array})],R.prototype,"history",2);O([g({type:Array})],R.prototype,"players",2);O([g({type:Number})],R.prototype,"currentRound",2);O([g({type:Number})],R.prototype,"viewingRound",2);O([g({type:Boolean})],R.prototype,"isDirector",2);O([g({type:Array})],R.prototype,"messages",2);O([g({type:String})],R.prototype,"currentUserId",2);O([g({type:String})],R.prototype,"directorId",2);O([g({type:String})],R.prototype,"sessionId",2);O([g({type:Boolean})],R.prototype,"canChat",2);O([g({type:Boolean})],R.prototype,"isEnded",2);O([g({type:Boolean})],R.prototype,"isRoundActive",2);O([v()],R.prototype,"_isEditing",2);O([v()],R.prototype,"_chatInputValue",2);R=O([q("scene-display")],R);var Gn=Object.defineProperty,Zn=Object.getOwnPropertyDescriptor,se=(s,e,t,r)=>{for(var i=r>1?void 0:r?Zn(e,t):e,n=s.length-1,o;n>=0;n--)(o=s[n])&&(i=(r?o(e,t,i):o(i))||i);return r&&i&&Gn(e,t,i),i};let Z=class extends I{constructor(){super(...arguments),this.players=[],this.playersOnline=[],this.director=null,this.currentUserId="",this.currentScene=null,this.pendingScene=null,this.sessionId="",this._selectedPlayerId=null}_openCharacterSheet(s){this._selectedPlayerId=s}_closeCharacterSheet(){this._selectedPlayerId=null}render(){var o,a,l,c,d;const s=p=>this.playersOnline.some(f=>f.id===p),e=this._selectedPlayerId&&this.players.find(p=>p.id===this._selectedPlayerId)||null,r=(e?((a=(o=this.currentScene)==null?void 0:o.playerBadges)==null?void 0:a[e.id])||[]:[]).map(p=>typeof p=="string"?{name:p,hidden:!1}:p),i=e&&(((c=(l=this.pendingScene)==null?void 0:l.playerStatuses)==null?void 0:c[e.id])||e.statusText)||"",n=this.currentUserId===((d=this.director)==null?void 0:d.id);return u`
      <div class="players-list-container">
        <div class="players-grid">
        ${this.players.map(p=>{var m,k,P,M,H,V;const f=p.avatarIndex!==void 0?p.avatarIndex:0,h=p.id===((m=this.director)==null?void 0:m.id),y=s(p.id);return u`
                <player-card 
                    .name="${p.name}" 
                    .avatarIndex="${f}" 
                    .online="${y}"
                    .isDirector="${h}"
                    class="${p.id===this.currentUserId?"is-me":""}"
                    style="cursor: pointer;"
                     @click="${()=>this._openCharacterSheet(p.id)}"
                >
                    <!-- Allow overriding avatar for Director case -->
                    ${h?u`
                        <div slot="avatar" style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background-color: #374151; color: #fbbf24; font-weight: bold; font-size: 0.8rem;">
                            DIR
                        </div>
                    `:""}

                    ${h?u`<span slot="name-extras" class="director-badge" title="Director">★</span>`:""}

                    ${h?"":u`
                        <div slot="status">
                            <div 
                                class="status-text"
                            >
                                ${(P=(k=this.pendingScene)==null?void 0:k.playerStatuses)!=null&&P[p.id]?u`<span style="color: #fbbf24; font-style: italic;">${this.pendingScene.playerStatuses[p.id]}</span>`:p.statusText||""}
                            </div>
                        </div>
                    `}

                    <div slot="badges">
                        ${((V=(H=(M=this.currentScene)==null?void 0:M.playerBadges)==null?void 0:H[p.id])==null?void 0:V.map(z=>{const F=typeof z=="string"?z:z.name,N=typeof z=="string"?!1:z.hidden;return N&&!n?null:u`
                                <span class="badge ${N?"hidden":""}" title="${N?"Hidden Badge":""}">
                                    ${F}
                                </span>
                            `}))||""}
                    </div>
                </player-card>
            `})}
        </div>
        ${this.players.length?"":u`<div style="color: #9ca3af; padding: 0.5rem; font-size: 0.8rem;">No players</div>`}
      </div>

      <character-sheet
        .player="${e}"
        .isOpen="${!!e}"
        .isDirector="${n}" 
        .badges="${r}"
        .statusText="${i}"
        .sessionId="${this.sessionId}"
        @close="${this._closeCharacterSheet}"
      ></character-sheet>
    `}};Z.styles=U`
    :host {
      display: block;
      background: #1f2937;
      padding: 2px;
      border-radius: 0.5rem;
      /*overflow-y: auto;*/
      min-height: 90px;
    }

    .players-grid {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .is-me {
        border: 2px solid #f6b53bff; /* blue-500 */
        border-radius: 0.5rem;
        box-shadow: 0 0 10px rgba(59, 130, 246, 0.3);
    }

    .director-badge {
      color: #fbbf24;
      font-size: 0.8rem;
    }

    .badge {
        background-color: #4b5563;
        color: #e5e7eb;
        font-size: 0.8rem;
        padding: 0.1rem 0.3rem;
        border-radius: 0.2rem;
        display: flex;
        align-items: center;
        gap: 0.2rem;
        border: 1px solid transparent;
    }

    .badge.hidden {
      border-color: #fbbf24; 
      background-color: #374151;
      color: #fbbf24; 
      border-style: dashed;
    }

    .status-text {
      opacity: 0.7;
    }
    
    ::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }
    ::-webkit-scrollbar-track {
      background: #1f2937;
    }
    ::-webkit-scrollbar-thumb {
      background: #4b5563;
      border-radius: 4px;
    }
    ::-webkit-scrollbar-thumb:hover {
      background: #6b7280;
    }
  `;se([g({type:Array})],Z.prototype,"players",2);se([g({type:Array})],Z.prototype,"playersOnline",2);se([g({type:Object})],Z.prototype,"director",2);se([g({type:String})],Z.prototype,"currentUserId",2);se([g({type:Object})],Z.prototype,"currentScene",2);se([g({type:Object})],Z.prototype,"pendingScene",2);se([g({type:String})],Z.prototype,"sessionId",2);se([v()],Z.prototype,"_selectedPlayerId",2);Z=se([q("players-list")],Z);var Qn=Object.defineProperty,Yn=Object.getOwnPropertyDescriptor,Yt=(s,e,t,r)=>{for(var i=r>1?void 0:r?Yn(e,t):e,n=s.length-1,o;n>=0;n--)(o=s[n])&&(i=(r?o(e,t,i):o(i))||i);return r&&i&&Qn(e,t,i),i};let Le=class extends I{constructor(){super(...arguments),this.stats=[],this._openMenuSessionId=null}_toggleMenu(s){this._openMenuSessionId===s?this._openMenuSessionId=null:this._openMenuSessionId=s,this.requestUpdate()}_enterAsDirector(s){s.directorId?window.open(`/?session=${s.sessionId}&player=${s.directorId}`,"_blank"):alert("Director ID not available"),this._openMenuSessionId=null,this.requestUpdate()}_saveSession(s){this.dispatchEvent(new CustomEvent("save-session",{detail:{sessionId:s},bubbles:!0,composed:!0})),this._openMenuSessionId=null,this.requestUpdate()}_endSession(s){confirm("Are you sure you want to END this session?")&&this.dispatchEvent(new CustomEvent("end-session",{detail:{sessionId:s},bubbles:!0,composed:!0})),this._openMenuSessionId=null,this.requestUpdate()}_deleteSession(s){confirm("Are you sure you want to DELETE this session? This cannot be undone.")&&this.dispatchEvent(new CustomEvent("delete-session",{detail:{sessionId:s},bubbles:!0,composed:!0})),this._openMenuSessionId=null,this.requestUpdate()}_spectate(s){window.open(`/?session=${s}&spectator=true`,"_blank")}render(){return u`
          <div class="admin-dashboard">
              <div class="header">
                  <h2>System Admin Dashboard</h2>
                  <button class="refresh-btn" @click="${()=>this.dispatchEvent(new CustomEvent("refresh-stats"))}">
                      Refresh Stats
                  </button>
              </div>

              <div class="stats-table">
                  <table>
                      <thead>
                          <tr>
                              <th>Session ID</th>
                              <th>Game Name</th>
                              <th>Round</th>
                              <th>Players/Online</th>
                              <th>Status</th>
                              <th>Actions</th>
                          </tr>
                      </thead>
                      <tbody>
                          ${this.stats.map(s=>u`
                              <tr class="${s.isEnded?"ended-session":""}">
                                  <td>${s.sessionId}</td>
                                  <td>${s.gameName}</td>
                                  <td>${s.round}</td>
                                  <td>${s.playerCount} / ${s.onlineCount}</td>
                                  <td>
                                      ${s.isEnded?u`<span style="color: #ef4444; font-weight: bold;">ENDED</span>`:u`<span style="color: #10b981; font-weight: bold;">ACTIVE</span>`}
                                  </td>
                                  <td class="last-col">
                                      <button class="spectate-btn" @click="${()=>this._spectate(s.sessionId)}">Spectate</button>
                                      
                                      <div class="menu-container">
                                          <button class="menu-btn" @click="${()=>this._toggleMenu(s.sessionId)}">⋮</button>
                                          ${this._openMenuSessionId===s.sessionId?u`
                                              <div class="dropdown-menu">
                                                  <button @click="${()=>this._enterAsDirector(s)}">Enter as Director</button>
                                                  <button @click="${()=>this._saveSession(s.sessionId)}">Save Game</button>
                                                  <button @click="${()=>this._endSession(s.sessionId)}">End Game</button>
                                                  <button class="delete-btn" @click="${()=>this._deleteSession(s.sessionId)}">Delete Game</button>
                                              </div>
                                              <div class="menu-overlay" @click="${()=>this._toggleMenu(s.sessionId)}"></div>
                                          `:""}
                                      </div>
                                  </td>
                              </tr>
                          `)}
                      </tbody>
                  </table>
                  ${this.stats.length===0?u`<p style="text-align: center; color: #9ca3af; padding: 2rem;">No active sessions found.</p>`:""}
              </div>
          </div>
      `}};Le.styles=U`
      .admin-dashboard {
          color: white;
          font-family: 'Inter', sans-serif;
      }
      .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
      }
      h2 { margin: 0; color: #3b82f6; }
      .refresh-btn {
          background-color: #374151;
          color: white;
          border: 1px solid #4b5563;
          padding: 0.5rem 1rem;
          border-radius: 0.25rem;
          cursor: pointer;
      }
      .refresh-btn:hover { background-color: #4b5563; }
      
      .stats-table {
          background-color: #1f2937;
          border-radius: 0.5rem;
          /* overflow: hidden; Removed to allow dropdown menu to overflow */
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      }
      table {
          width: 100%;
          border-collapse: collapse;
      }
      th {
          background-color: #374151;
          text-align: left;
          padding: 1rem;
          font-weight: 600;
          color: #d1d5db;
      }
      td {
          padding: 1rem;
          border-bottom: 1px solid #374151;
          color: #e5e7eb;
      }
      tr.ended-session td {
          color: #9ca3af;
          background-color: #2d313a;
      }
      tr:last-child td { border-bottom: none; }
      
      .last-col {
          display: flex;
          align-items: center;
          gap: 0.5rem;
      }

      .spectate-btn {
          background-color: #eab308; /* yellow-500 */
          color: white;
          border: none;
          padding: 0.25rem 0.75rem;
          border-radius: 0.25rem;
          cursor: pointer;
          font-size: 0.875rem;
          font-weight: 500;
      }
      .spectate-btn:hover { background-color: #ca8a04; }

      .menu-container {
          position: relative;
      }
      .menu-btn {
          background: none;
          border: none;
          color: white;
          font-size: 1.5rem;
          cursor: pointer;
          padding: 0 0.5rem;
          line-height: 1;
      }
      .menu-btn:hover { color: #3b82f6; }

      .dropdown-menu {
          position: absolute;
          right: 0;
          top: 100%;
          background-color: #374151;
          border: 1px solid #4b5563;
          border-radius: 0.375rem;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
          z-index: 50;
          min-width: 160px;
          display: flex;
          flex-direction: column;
          overflow: hidden;
      }
      .dropdown-menu button {
          background: none;
          border: none;
          color: white;
          padding: 0.75rem 1rem;
          text-align: left;
          cursor: pointer;
          font-size: 0.875rem;
          transition: background-color 0.1s;
          white-space: nowrap;
      }
      .dropdown-menu button:hover { background-color: #4b5563; }
      .dropdown-menu button.delete-btn { color: #ef4444; }
      .dropdown-menu button.delete-btn:hover { background-color: #fee2e2; color: #dc2626; }

      .menu-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          z-index: 40;
          cursor: default;
      }
  `;Yt([g({type:Array})],Le.prototype,"stats",2);Yt([v()],Le.prototype,"_openMenuSessionId",2);Le=Yt([q("admin-dashboard")],Le);var Jn=Object.defineProperty,Xn=Object.getOwnPropertyDescriptor,Sr=(s,e,t,r)=>{for(var i=r>1?void 0:r?Xn(e,t):e,n=s.length-1,o;n>=0;n--)(o=s[n])&&(i=(r?o(e,t,i):o(i))||i);return r&&i&&Jn(e,t,i),i};let ot=class extends I{constructor(){super(...arguments),this.player=null}render(){if(!this.player)return u``;const s=this.player.avatarIndex!==void 0?this.player.avatarIndex:0,e=s%8,t=Math.floor(s/8),r=-(e*32),i=-(t*32);return u`
      <div class="info">
        <span class="role-label" style="text-align: right;">Playing as</span>
        <span class="player-name">${this.player.name}</span>
      </div>
      <div class="avatar-container">
        <img 
            src="/characters.jpg" 
            class="avatar-image" 
            style="transform: translate(${r}px, ${i}px);"
            alt="Avatar"
        >
      </div>
    `}};ot.styles=U`
    :host {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      color: white;
    }

    .avatar-container {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      overflow: hidden;
      background-color: #374151;
      position: relative;
      border: 1px solid #4b5563;
    }

    .avatar-image {
      width: 256px; /* 8 cols * 32px */
      height: auto; 
      image-rendering: pixelated;
      position: absolute;
    }

    .info {
      display: flex;
      flex-direction: column;
      line-height: 1.2;
    }

    .role-label {
        font-size: 0.7rem;
        color: #9ca3af;
        text-transform: uppercase;
        font-weight: bold;
    }

    .player-name {
        font-weight: bold;
        font-size: 0.9rem;
    }
  `;Sr([g({type:Object})],ot.prototype,"player",2);ot=Sr([q("header-profile")],ot);var eo=Object.getOwnPropertyDescriptor,to=(s,e,t,r)=>{for(var i=r>1?void 0:r?eo(e,t):e,n=s.length-1,o;n>=0;n--)(o=s[n])&&(i=o(i)||i);return i};let It=class extends I{_handleClick(){this.dispatchEvent(new CustomEvent("exit-game",{bubbles:!0,composed:!0}))}render(){return u`
      <button @click="${this._handleClick}" title="Exit Game">
        Exit
      </button>
    `}};It.styles=U`
    button {
      background-color: #ef4444;
      color: white;
      padding: 0.25rem 0.5rem;
      font-size: 0.75rem;
      border-radius: 0.25rem;
      border: none;
      cursor: pointer;
      font-weight: bold;
      transition: background-color 0.2s;
      text-transform: uppercase;
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }

    button:hover {
      background-color: #dc2626;
    }
  `;It=to([q("exit-button")],It);var so=Object.defineProperty,ro=Object.getOwnPropertyDescriptor,Jt=(s,e,t,r)=>{for(var i=r>1?void 0:r?ro(e,t):e,n=s.length-1,o;n>=0;n--)(o=s[n])&&(i=(r?o(e,t,i):o(i))||i);return r&&i&&so(e,t,i),i};let Ue=class extends I{constructor(){super(...arguments),this.isEnded=!1,this._isOpen=!1}_toggleMenu(){this._isOpen=!this._isOpen}_closeMenu(){this._isOpen=!1}_handleSave(){this.dispatchEvent(new CustomEvent("save-session",{bubbles:!0,composed:!0})),this._closeMenu()}_handleDownload(){this.dispatchEvent(new CustomEvent("download-session",{bubbles:!0,composed:!0})),this._closeMenu()}_handleEnd(){confirm("Are you sure you want to END the game? This will disable player interactions.")&&this.dispatchEvent(new CustomEvent("end-session",{bubbles:!0,composed:!0})),this._closeMenu()}render(){return u`
            <div class="menu-container">
                <button class="menu-btn" @click="${this._toggleMenu}" title="Game Actions">⋮</button>
                
                ${this._isOpen?u`
                    <div class="menu-overlay" @click="${this._closeMenu}"></div>
                    <div class="dropdown-menu">
                        <button @click="${this._handleSave}">Save to Server</button>
                        <button @click="${this._handleDownload}">Download JSON</button>
                        ${this.isEnded?"":u`
                            <button class="delete-btn" @click="${this._handleEnd}">End Game</button>
                        `}
                    </div>
                `:""}
            </div>
        `}};Ue.styles=U`
        :host {
            display: block;
        }

        .menu-container {
            position: relative;
        }

        .menu-btn {
            background: none;
            border: none;
            color: #d1d5db;
            font-size: 1.5rem;
            cursor: pointer;
            padding: 0 0.5rem;
            line-height: 1;
            transition: color 0.2s;
        }

        .menu-btn:hover {
            color: #3b82f6;
        }

        .dropdown-menu {
            position: absolute;
            right: 0;
            top: 120%; /* Slight offset from button */
            background-color: #374151;
            border: 1px solid #4b5563;
            border-radius: 0.375rem;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
            z-index: 50;
            min-width: 160px;
            display: flex;
            flex-direction: column;
            overflow: hidden;
        }

        .dropdown-menu button {
            background: none;
            border: none;
            color: white;
            padding: 0.75rem 1rem;
            text-align: left;
            cursor: pointer;
            font-size: 0.875rem;
            font-family: inherit;
            transition: background-color 0.1s;
            white-space: nowrap;
        }

        .dropdown-menu button:hover {
            background-color: #4b5563;
        }

        .dropdown-menu button.delete-btn {
            color: #ef4444;
            border-top: 1px solid #4b5563;
        }

        .dropdown-menu button.delete-btn:hover {
            background-color: #fee2e2;
            color: #dc2626;
        }

        .menu-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            z-index: 40;
            cursor: default;
        }
    `;Jt([g({type:Boolean})],Ue.prototype,"isEnded",2);Jt([v()],Ue.prototype,"_isOpen",2);Ue=Jt([q("game-actions")],Ue);var io=Object.defineProperty,no=Object.getOwnPropertyDescriptor,D=(s,e,t,r)=>{for(var i=r>1?void 0:r?no(e,t):e,n=s.length-1,o;n>=0;n--)(o=s[n])&&(i=(r?o(e,t,i):o(i))||i);return r&&i&&io(e,t,i),i};const oo="/";let C=class extends I{constructor(){super(...arguments),this._socket=null,this._gameState=null,this._currentPlayer=null,this._playerName="",this._gameName="",this._sessionId="",this._selectedAvatarIndex=0,this._errorMessage="",this._isInLobby=!0,this._viewingRound=1,this._userToken="",this._isAdmin=!1,this._systemStats=[],this._isSpectator=!1}connectedCallback(){super.connectedCallback();const s=new URLSearchParams(window.location.search);s.get("admin")==="true"&&(this._isAdmin=!0),s.get("spectator")==="true"&&(this._isSpectator=!0),this._initToken(),this._initSocket();const e=localStorage.getItem("player_avatar");e&&(this._selectedAvatarIndex=parseInt(e,10))}_initToken(){let s=localStorage.getItem("user_token");s||(s=Math.random().toString(36).substring(2)+Date.now().toString(36),localStorage.setItem("user_token",s)),this._userToken=s}_initSocket(){this._socket=Je(oo),this._socket.on("connect",()=>{var s;console.log("Connected to server"),this._isAdmin?(s=this._socket)==null||s.emit("getSystemStats"):this._checkAutoJoin()}),this._socket.on("gameStateUpdate",s=>{console.log("Received gameStateUpdate:",s);const e=!this._gameState;if(this._gameState=s,s.director.id===this._userToken&&this._updateUrl(s.sessionId),this._isInLobby){const t=s.players.find(r=>r.id===this._userToken);t&&(this._currentPlayer=t,this._isInLobby=!1),this._isSpectator&&(this._isInLobby=!1)}this._viewingRound<s.round&&this._viewingRound===s.round-1&&(this._viewingRound=s.round),e&&(this._viewingRound=s.round),this._isSpectator&&this._viewingRound===1&&s.round>1&&(this._viewingRound=s.round)}),this._socket.on("newScene",s=>{this._gameState&&(this._gameState={...this._gameState,currentScene:s})}),this._socket.on("newMessage",s=>{this._gameState&&(this._gameState={...this._gameState,messages:[...this._gameState.messages,s]})}),this._socket.on("systemStatsUpdate",s=>{this._systemStats=s}),this._socket.on("error",s=>{console.error("Socket Error:",s),this._errorMessage=s,this._isInLobby=!0,this._sessionId=""})}_checkAutoJoin(){var r,i,n;const s=new URLSearchParams(window.location.search),e=s.get("session"),t=s.get("player");if(this._isSpectator&&e){this._sessionId=e,(r=this._socket)==null||r.emit("spectateSession",e);return}e&&(this._sessionId=e,t?(this._userToken=t,localStorage.setItem("user_token",t),(i=this._socket)==null||i.emit("joinSession",e,t)):this._userToken&&((n=this._socket)==null||n.emit("joinSession",e,this._userToken)))}_updateUrl(s,e){const t=new URL(window.location.href);t.searchParams.set("session",s),e&&t.searchParams.set("player",e),window.history.pushState({},"",t)}_savePlayerPrefs(){this._playerName&&localStorage.setItem("player_name",this._playerName),localStorage.setItem("player_avatar",this._selectedAvatarIndex.toString())}_handleInputKeydown(s){s.key==="Enter"&&this._createSession()}_createSession(){var s;this._playerName&&this._gameName&&(this._savePlayerPrefs(),(s=this._socket)==null||s.emit("createSession",this._userToken,this._playerName,this._gameName,this._selectedAvatarIndex))}_handleExit(){this._gameState=null,this._currentPlayer=null,this._sessionId="",this._isInLobby=!0,this._isSpectator=!1,this._isAdmin=!1;const s=new URL(window.location.href);s.searchParams.delete("session"),s.searchParams.delete("player"),s.searchParams.delete("spectator"),window.history.pushState({},"",s),window.location.href="/"}_handleUpdateScene(s){var e;(e=this._socket)==null||e.emit("updateScene",s.detail)}_handleSubmitAction(s){var e;(e=this._socket)==null||e.emit("submitAction",s.detail.action,this._userToken)}_handleNextRound(){var s;(s=this._socket)==null||s.emit("nextRound"),this._gameState&&(this._viewingRound=this._gameState.round+1)}_handleViewRoundChange(s){this._viewingRound=s.detail.round}_handleMessageSent(s){var e;(e=this._socket)==null||e.emit("postMessage",s.detail.message,this._userToken)}_handleAddBadge(s){var e;(e=this._socket)==null||e.emit("addBadge",s.detail.playerId,s.detail.badge,s.detail.hidden)}_handleRemoveBadge(s){var e;(e=this._socket)==null||e.emit("removeBadge",s.detail.playerId,s.detail.index)}_handleCreatePlayer(s){var i,n;if(!((i=this._gameState)!=null&&i.sessionId))return;const{name:e,avatarIndex:t,badges:r}=s.detail;(n=this._socket)==null||n.emit("createPlayer",this._gameState.sessionId,e,t,r)}_handleSetPendingPrivateMessage(s){var e;(e=this._gameState)!=null&&e.sessionId&&this._socket&&this._socket.emit("setPendingPrivateMessage",s.detail.playerId,s.detail.message)}_handleStartRound(){var s,e;(s=this._gameState)!=null&&s.sessionId&&((e=this._socket)==null||e.emit("startRound",this._gameState.sessionId))}_handleUpdatePlayerStatus(s){var e;(e=this._gameState)!=null&&e.sessionId&&this._socket&&this._socket.emit("updatePlayerStatus",s.detail.playerId,s.detail.status)}_handleUpdatePlayerAvatar(s){var e,t;!((e=this._gameState)!=null&&e.sessionId)&&this._socket||(t=this._socket)==null||t.emit("updatePlayerAvatar",s.detail.playerId,s.detail.avatarIndex)}_handleUpdatePlayerBackground(s){var e,t;(e=this._gameState)!=null&&e.sessionId&&((t=this._socket)==null||t.emit("updatePlayerBackground",s.detail.playerId,s.detail.background))}_handleUpdatePlayerName(s){var e,t;(e=this._gameState)!=null&&e.sessionId&&((t=this._socket)==null||t.emit("updatePlayerName",s.detail.playerId,s.detail.name))}_refreshStats(){var s;(s=this._socket)==null||s.emit("getSystemStats")}_handleSaveSession(s){var t,r,i;if(!((t=this._gameState)!=null&&t.sessionId))return;const e=((r=s.detail)==null?void 0:r.sessionId)||this._gameState.sessionId;(i=this._socket)==null||i.emit("saveSession",e)}_handleEndSession(s){var t,r,i;if(!((t=this._gameState)!=null&&t.sessionId))return;const e=((r=s.detail)==null?void 0:r.sessionId)||this._gameState.sessionId;(i=this._socket)==null||i.emit("endSession",e)}_handleDownloadSession(){if(!this._gameState)return;const s={sessionId:this._gameState.sessionId,directorId:this._gameState.director.id,messages:this._gameState.messages,history:this._gameState.history,players:this._gameState.players,currentScene:this._gameState.currentScene,round:this._gameState.round,isEnded:this._gameState.isEnded},e="data:text/json;charset=utf-8,"+encodeURIComponent(JSON.stringify(s,null,2)),t=document.createElement("a");t.setAttribute("href",e),t.setAttribute("download",`rollite_session_${this._gameState.sessionId}.json`),document.body.appendChild(t),t.click(),t.remove()}updated(s){var e,t;if(s.has("_isAdmin")||s.has("_isSpectator")||s.has("_gameState")||s.has("_currentPlayer")){let r="ROLLITE";this._isAdmin?r+=" - Admin":this._isSpectator?r+=" - Spectator":((e=this._gameState)==null?void 0:e.director.id)===((t=this._currentPlayer)==null?void 0:t.id)?r+=" - Director":this._currentPlayer&&(r+=" - Player"),document.title=r}}render(){var t,r,i,n,o,a,l,c,d,p,f,h,y,m,k,P,M,H,V,z,F,N,_e,ve,we,xe,ke,$e,Se,T,He,Ae,Xt,es,ts,ss,rs,is,ns,os,as,ls,cs,hs,ds,ps,us,fs,gs,ms,bs,ys,_s,vs,ws,xs,ks;if(this._isAdmin)return u`
          <div style="padding: 2rem; background-color: #111827; min-height: 100vh;">
              <admin-dashboard 
                  .stats="${this._systemStats}"
                  @refresh-stats="${this._refreshStats}"
                  @save-session="${ee=>{var re;return(re=this._socket)==null?void 0:re.emit("saveSession",ee.detail.sessionId)}}"
                  @end-session="${ee=>{var re;return(re=this._socket)==null?void 0:re.emit("endSession",ee.detail.sessionId)}}"
                  @delete-session="${ee=>{var re;return(re=this._socket)==null?void 0:re.emit("deleteSession",ee.detail.sessionId)}}"
              ></admin-dashboard>
          </div>
        `;if(this._isSpectator)return u`
            <div style="padding: 1rem; background-color: #1f2937; color: #fbbf24; text-align: center; font-weight: bold; border-bottom: 1px solid #374151;">
                SPECTATOR MODE - Viewing Session: ${this._sessionId}
            </div>
            <div class="container" style="height: calc(100vh - 50px);">
                <div class="main-content">
                  <scene-display 
                    .scene="${this._viewingRound===((t=this._gameState)==null?void 0:t.round)?(r=this._gameState)==null?void 0:r.currentScene:void 0}" 
                    .history="${((i=this._gameState)==null?void 0:i.history)||[]}"
                    .currentRound="${((n=this._gameState)==null?void 0:n.round)||1}"
                    .viewingRound="${this._viewingRound}"
                    ?isDirector="${!1}"
                    .messages="${((o=this._gameState)==null?void 0:o.messages)||[]}"
                    .players="${((a=this._gameState)==null?void 0:a.players)||[]}"
                    .directorId="${(l=this._gameState)==null?void 0:l.director.id}"
                    .currentUserId="${"SPECTATOR"}"
                    ?canChat="${!1}"
                    .isEnded="${!!((c=this._gameState)!=null&&c.isEnded)}"
                    @view-round-change="${this._handleViewRoundChange}"
                  ></scene-display>
                </div>
                <div class="sidebar">
                  <players-list
                    .players="${((d=this._gameState)==null?void 0:d.players)||[]}"
                    .playersOnline="${((p=this._gameState)==null?void 0:p.players_online)||[]}"
                    .director="${((f=this._gameState)==null?void 0:f.director)||null}"
                    .currentUserId="${"SPECTATOR"}"
                    .currentScene="${((h=this._gameState)==null?void 0:h.currentScene)||null}"
                  ></players-list>
                </div>
            </div>
        `;if(this._isInLobby)return u`
        <div class="lobby">
          <div class="lobby-card">
            <h1>RPG Inn</h1>
            
            ${this._sessionId?u`
                <div style="text-align: center;">
                    <p>Joining session...</p>
                    <p style="color: #9ca3af; font-size: 0.875rem;">${this._sessionId}</p>
                </div>
            `:u`
                ${this._errorMessage?u`
                    <div style="background-color: rgba(239, 68, 68, 0.2); border: 1px solid #ef4444; color: #fca5a5; padding: 0.75rem; border-radius: 0.25rem; margin-bottom: 1rem; text-align: center;">
                        ${this._errorMessage}
                    </div>
                `:""}
                <div style="margin-bottom: 2rem; text-align: center;">
                    <h2 style="font-size: 1.25rem; color: #9ca3af;">Director Setup</h2>
                </div>

                <input
                    type="text"
                    placeholder="Enter Game Name"
                    .value="${this._gameName}"
                    @input="${ee=>this._gameName=ee.target.value}"
                    @keydown="${this._handleInputKeydown}"
                />

                <input
                type="text"
                placeholder="Enter your name (Director)"
                .value="${this._playerName}"
                @input="${ee=>this._playerName=ee.target.value}"
                @keydown="${this._handleInputKeydown}"
                />
                <div class="button-group">
                    <button class="btn-secondary" @click="${this._createSession}" ?disabled="${!this._gameName||!this._playerName}">Create New Session</button>
                </div>
            `}
          </div>
        </div>
      `;const s=((y=this._gameState)==null?void 0:y.director.id)===((m=this._currentPlayer)==null?void 0:m.id),e=s&&((k=this._gameState)!=null&&k.pendingScene)?this._gameState.pendingScene:(P=this._gameState)==null?void 0:P.currentScene;return u`
      <header class="app-header">
          <div class="app-title">RPG Inn</div>
          <div class="game-title">${((M=this._gameState)==null?void 0:M.gameName)||"Untitled Game"}</div>
          <div class="header-right">
              <header-profile .player="${this._currentPlayer}"></header-profile>
              ${s?u`
                <game-actions 
                    .isEnded="${!!((H=this._gameState)!=null&&H.isEnded)}"
                    @save-session="${this._handleSaveSession}"
                    @download-session="${this._handleDownloadSession}"
                    @end-session="${this._handleEndSession}"
                ></game-actions>
              `:""}
              <exit-button @exit-game="${this._handleExit}"></exit-button>
          </div>
      </header>

      <div class="container">
        <div class="main-content">
          <scene-display 
            .scene="${e}"
            .history="${((V=this._gameState)==null?void 0:V.history)||[]}"
            .currentRound="${((z=this._gameState)==null?void 0:z.round)||1}"
            .viewingRound="${this._viewingRound}"
            ?isDirector="${((F=this._gameState)==null?void 0:F.director.id)===((N=this._currentPlayer)==null?void 0:N.id)}"
            .messages="${((_e=this._gameState)==null?void 0:_e.messages)||[]}"
            .players="${((ve=this._gameState)==null?void 0:ve.players)||[]}"
            .directorId="${(we=this._gameState)==null?void 0:we.director.id}"
            .currentUserId="${((xe=this._currentPlayer)==null?void 0:xe.id)||""}"
            ?canChat="${((ke=this._gameState)==null?void 0:ke.director.id)===(($e=this._currentPlayer)==null?void 0:$e.id)||((Se=this._gameState)==null?void 0:Se.isRoundActive)&&!((He=this._gameState)!=null&&He.submittedActions.includes(((T=this._currentPlayer)==null?void 0:T.id)||""))}"
            .isEnded="${!!((Ae=this._gameState)!=null&&Ae.isEnded)}"
            .isRoundActive="${((Xt=this._gameState)==null?void 0:Xt.isRoundActive)||!1}"
            .sessionId="${((es=this._gameState)==null?void 0:es.sessionId)||""}"
            @view-round-change="${this._handleViewRoundChange}"
            @update-scene="${this._handleUpdateScene}"
            @message-sent="${this._handleMessageSent}"
            @start-round="${this._handleStartRound}"
            @next-round="${this._handleNextRound}"
          ></scene-display>
          ${s?"":u`
            <player-dashboard
              .currentScene="${(ts=this._gameState)==null?void 0:ts.currentScene}"
              .isRoundActive="${(ss=this._gameState)==null?void 0:ss.isRoundActive}"
              .round="${((rs=this._gameState)==null?void 0:rs.round)||1}"
              .messages="${((is=this._gameState)==null?void 0:is.messages)||[]}"
              .currentUserId="${((ns=this._currentPlayer)==null?void 0:ns.id)||""}"
              .isEnded="${!!((os=this._gameState)!=null&&os.isEnded)}"
              @submit-action="${this._handleSubmitAction}"
            ></player-dashboard>
          `}
        </div>
        
        <div class="sidebar">
          ${s?u`
            <director-dashboard
              .currentScene="${(as=this._gameState)==null?void 0:as.currentScene}"
              .pendingScene="${(ls=this._gameState)==null?void 0:ls.pendingScene}"
              .messages="${((cs=this._gameState)==null?void 0:cs.messages)||[]}"
              .history="${((hs=this._gameState)==null?void 0:hs.history)||[]}"
              .players="${((ds=this._gameState)==null?void 0:ds.players)||[]}"
              .round="${((ps=this._gameState)==null?void 0:ps.round)||1}"
              .viewingRound="${this._viewingRound}"
              .sessionId="${((us=this._gameState)==null?void 0:us.sessionId)||""}"
              .directorId="${((fs=this._gameState)==null?void 0:fs.director.id)||""}"
              .isEnded="${!!((gs=this._gameState)!=null&&gs.isEnded)}"
              .playersOnline="${((ms=this._gameState)==null?void 0:ms.players_online)||[]}"
              @next-round="${this._handleNextRound}"
              @start-round="${this._handleStartRound}"
              @create-player="${this._handleCreatePlayer}"
              @set-pending-private-message="${this._handleSetPendingPrivateMessage}"
              @add-badge="${this._handleAddBadge}"
              @remove-badge="${this._handleRemoveBadge}"
              @update-player-status="${this._handleUpdatePlayerStatus}"
              @update-player-avatar="${this._handleUpdatePlayerAvatar}"
              @update-player-background="${this._handleUpdatePlayerBackground}"
              @update-player-name="${this._handleUpdatePlayerName}"
            ></director-dashboard>
          `:u`
            <players-list
              .players="${((bs=this._gameState)==null?void 0:bs.players)||[]}"
              .playersOnline="${((ys=this._gameState)==null?void 0:ys.players_online)||[]}"
              .director="${((_s=this._gameState)==null?void 0:_s.director)||null}"
              .currentUserId="${((vs=this._currentPlayer)==null?void 0:vs.id)||""}"
              .currentScene="${((ws=this._gameState)==null?void 0:ws.currentScene)||null}"
              .pendingScene="${((xs=this._gameState)==null?void 0:xs.pendingScene)||null}"
              .sessionId="${((ks=this._gameState)==null?void 0:ks.sessionId)||""}"
              @add-badge="${this._handleAddBadge}"
              @remove-badge="${this._handleRemoveBadge}"
              @update-player-status="${this._handleUpdatePlayerStatus}"
            ></players-list>
          `}
        </div>
      </div>
    `}};C.styles=U`
    :host {
      display: block;
      min-height: 100vh;
      background-color: #111827; /* gray-900 */
      color: white;
      /*font-family: "Jersey 10", sans-serif;*/
      font-family: "Inter", sans-serif;
    }
    
    .app-header {
        display: grid;
        grid-template-columns: 1fr auto 1fr;
        align-items: center;
        padding: 0.5rem 2rem;
        background-color: #1f2937;
        border-bottom: 1px solid #374151;
        position: sticky;
        top: 0;
        z-index: 50;
        width: 100%;
        box-sizing: border-box;
        height: 60px;
    }

    .app-title {
        font-weight: bold;
        font-size: 1.25rem;
        color: #3b82f6;
    }

    .game-title {
        font-weight: bold;
        font-size: 1.25rem;
        color: #e5e7eb;
        text-align: center;
    }

    .header-right {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        gap: 1.5rem;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 1rem;
      display: grid;
      grid-template-columns: 1fr 400px;
      gap: 1rem;
      height: calc(100vh - 60px);
      box-sizing: border-box;
    }
    
    .main-content {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      overflow-y: auto;
    }

    .sidebar {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      height: 100%;
      overflow-y: hidden;
    }

    .lobby {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
      gap: 1rem;
    }

    .lobby-card {
      background-color: #1f2937;
      padding: 2rem;
      border-radius: 0.5rem;
      width: 100%;
      max-width: 400px;
    }

    h1 {
      text-align: center;
      margin-bottom: 2rem;
      color: #3b82f6;
    }

    input {
      width: 100%;
      padding: 0.75rem;
      margin-bottom: 1rem;
      border-radius: 0.25rem;
      border: 1px solid #374151;
      background-color: #111827;
      color: white;
      box-sizing: border-box;
    }

    .button-group {
      display: flex;
      gap: 1rem;
    }

    button {
      flex: 1;
      padding: 0.75rem;
      border-radius: 0.25rem;
      border: none;
      cursor: pointer;
      font-weight: bold;
      transition: background-color 0.2s;
    }

    .btn-primary {
      background-color: #3b82f6;
      color: white;
    }

    .btn-primary:hover {
      background-color: #2563eb;
    }

    .btn-secondary {
      background-color: #10b981;
      color: white;
    }

    .btn-secondary:hover {
      background-color: #059669;
    }

    .btn-danger {
        background-color: #ef4444;
        color: white;
    }

    .btn-danger:hover {
        background-color: #dc2626;
    }

    /* Avatar Grid Styles */
    .avatar-grid {
      display: grid;
      grid-template-columns: repeat(8, 1fr);
      gap: 5px;
      margin-bottom: 1rem;
      max-height: 300px;
      overflow-y: auto;
    }

    .avatar-option {
      width: 40px;
      height: 40px;
      border: 2px solid transparent;
      border-radius: 50%;
      cursor: pointer;
      overflow: hidden;
      position: relative;
      background-color: #111827;
    }

    .avatar-option.selected {
      border-color: #3b82f6;
      box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
    }

    .avatar-option img {
      width: 320px; /* 8 * 40px */
      position: absolute;
      image-rendering: pixelated;
    }

    ::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }
    ::-webkit-scrollbar-track {
      background: #1f2937;
    }
    ::-webkit-scrollbar-thumb {
      background: #4b5563;
      border-radius: 4px;
    }
    ::-webkit-scrollbar-thumb:hover {
      background: #6b7280;
    }
  `;D([v()],C.prototype,"_socket",2);D([v()],C.prototype,"_gameState",2);D([v()],C.prototype,"_currentPlayer",2);D([v()],C.prototype,"_playerName",2);D([v()],C.prototype,"_gameName",2);D([v()],C.prototype,"_sessionId",2);D([v()],C.prototype,"_selectedAvatarIndex",2);D([v()],C.prototype,"_errorMessage",2);D([v()],C.prototype,"_isInLobby",2);D([v()],C.prototype,"_viewingRound",2);D([v()],C.prototype,"_userToken",2);D([v()],C.prototype,"_isAdmin",2);D([v()],C.prototype,"_systemStats",2);D([v()],C.prototype,"_isSpectator",2);C=D([q("my-app")],C);
