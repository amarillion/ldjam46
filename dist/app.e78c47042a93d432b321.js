!function(t){function e(e){for(var i,n,a=e[0],h=e[1],c=e[2],l=0,p=[];l<a.length;l++)n=a[l],Object.prototype.hasOwnProperty.call(o,n)&&o[n]&&p.push(o[n][0]),o[n]=0;for(i in h)Object.prototype.hasOwnProperty.call(h,i)&&(t[i]=h[i]);for(d&&d(e);p.length;)p.shift()();return r.push.apply(r,c||[]),s()}function s(){for(var t,e=0;e<r.length;e++){for(var s=r[e],i=!0,a=1;a<s.length;a++){var h=s[a];0!==o[h]&&(i=!1)}i&&(r.splice(e--,1),t=n(n.s=s[0]))}return t}var i={},o={0:0},r=[];function n(e){if(i[e])return i[e].exports;var s=i[e]={i:e,l:!1,exports:{}};return t[e].call(s.exports,s,s.exports,n),s.l=!0,s.exports}n.m=t,n.c=i,n.d=function(t,e,s){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:s})},n.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var s=Object.create(null);if(n.r(s),Object.defineProperty(s,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var i in t)n.d(s,i,function(e){return t[e]}.bind(null,i));return s},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="";var a=window.webpackJsonp=window.webpackJsonp||[],h=a.push.bind(a);a.push=e,a=a.slice();for(var c=0;c<a.length;c++)e(a[c]);var d=h;r.push([1468,1]),s()}({1468:function(t,e,s){"use strict";s.r(e);var i=s(32),o=s.n(i),r=s(550),n=s.n(r),a=class extends o.a.Scene{constructor(){super({key:"BootScene"})}preload(){this.fontsReady=!1,this.fontsLoaded=this.fontsLoaded.bind(this),this.add.text(100,100,"loading fonts..."),this.load.image("loaderBg","./assets/images/loader-bg.png"),this.load.image("loaderBar","./assets/images/loader-bar.png"),n.a.load({google:{families:["Bangers"]},active:this.fontsLoaded})}update(){this.fontsReady&&this.scene.start("SplashScene")}fontsLoaded(){this.fontsReady=!0}},h=class extends o.a.Scene{constructor(){super({key:"SplashScene"})}preload(){this.load.image("mushroom","assets/images/mushroom2.png")}create(){this.scene.start("GameScene")}update(){}};function c(t){return Math.floor(Math.random()*Math.floor(t))}class d{constructor(t,e){this.x=t,this.y=e,this.deadBiomass=100,this.co2=100,this.o2=100,this.h2o=100,this.temperature=200,this.solarEnergy=1,this._species=[]}sumLivingBiomass(){return this._species.reduce((t,e)=>t+e.biomass,0)}addSpecies(t,e){const s=this._species.find(e=>e.speciesId===t);s?(s.biomass+=e,this.sortSpecies()):(this._species.push({speciesId:t,biomass:e}),this.maxSpeciesCheck())}maxSpeciesCheck(){if(this.sortSpecies(),this._species.length>8){const t=this._species.pop();this.deadBiomass+=t.biomass}}sortSpecies(){this._species.sort((t,e)=>t.biomass-e.biomass)}speciesToString(){return this._species.map(t=>`${t.speciesId}: ${t.biomass.toFixed(1)} `).join()}toString(){return`[${this.x}, ${this.y}] CO2: ${this.co2.toFixed(1)} H2O: ${this.h2o.toFixed(1)} O2: ${this.o2.toFixed(1)} Organic: ${this.deadBiomass.toFixed(1)} Species: `+this.speciesToString()}growAndDie(){for(const t of this._species){const e=.001*Math.min(this.co2,this.h2o),s=t.biomass*e;this.o2+=s,this.co2-=s,this.h2o-=s,t.biomass+=s}this.sortSpecies()}migrateTo(t){if(0===this._species.length)return;const e=this._species[0],s=.01*e.biomass;t.addSpecies(e.speciesId,s),e.biomass-=s}}const l=(t,e)=>new d(t,e);class p{constructor(t,e,s=l){this.cellFactory=s,this.width=t,this.height=e,this._prepareGrid()}_prepareGrid(){this._data=new Array(this.width*this.height);for(let t=0;t<this.width;++t)for(let e=0;e<this.height;++e)this._data[this._index(t,e)]=this.cellFactory(t,e)}randomCell(){let t=c(this._data.length);return this._data[t]}_index(t,e){return t+e*this.width}get(t,e){return this.inRange(t,e)?this._data[this._index(t,e)]:null}inRange(t,e){return t>=0&&e>=0&&t<this.width&&e<this.height}*eachNode(){for(const t of this._data)t&&(yield t)}*getAdjacent(t){let e=0,s=-1;const i=t.x,o=t.y;for(const t of[1,2,4,8]){const r=(i+e+this.width)%this.width,n=o+s;if(n>=0&&n<this.height){const e=this._data[this._index(r,n)];yield[t,e]}[e,s]=[-s,e]}}}class u{}let g=0;class f{constructor(){this.id=g++,this.dna="",this.calculateProperties()}calculateProperties(){}}class m{constructor(){this.grid=new p(20,10),this.species={},this.planet=new u,this.init(),this.tickCounter=0}init(){const t=this.createSpecies();this.grid.randomCell().addSpecies(t.id,100)}createSpecies(){const t=new f;return this.species[t.id]=t,t}tick(){this.growAndDie(),this.interact(),this.evolve(),this.migrate(),this.updatePlanet(),this.tickCounter+=1}growAndDie(){for(const t of this.grid.eachNode())t.growAndDie()}interact(){}evolve(){}migrate(){for(const t of this.grid.eachNode())for(const[,e]of this.grid.getAdjacent(t))t.migrateTo(e)}updatePlanet(){}}class y extends o.a.GameObjects.Graphics{constructor(t,e,s){super(t,s),this.grid=e,this.prop=()=>1,this.colorMap=t=>131329*Math.floor(127*t),this.update()}setProp(t){this.prop=t}setColorMap(t){this.colorMap=t}minMax(t){let e=1/0,s=-1/0;for(const i of this.grid.eachNode()){const o=t(i);o<e&&(e=o),o>s&&(s=o)}return{min:e,max:s}}update(){function t(t,e,s){const i=s-e;return i?(t-e)/i:0}this.clear();const e=this.prop,s=this.colorMap,{min:i,max:o}=this.minMax(e);for(const r of this.grid.eachNode()){const n=32*r.x,a=32*r.y,h=s(t(e(r),i,o));this.fillStyle(h,1),this.fillRect(n,a,31,31)}}}var b=class extends o.a.Scene{constructor(){super({key:"GameScene"})}init(){this.sim=new m,this.time.addEvent({delay:500,callback:()=>this.tickAndLog(),loop:!0}),this.currentCell=this.sim.grid.get(0,0)}preload(){}create(){this.add.text(0,0,"Exo Keeper",{font:"32px Bangers",fill:"#7744ff"}),this.logElement=document.getElementById("log"),this.gridView=new y(this,this.sim.grid,{x:100,y:100}),this.gridView.setProp(t=>t.sumLivingBiomass()),this.add.existing(this.gridView)}tickAndLog(){this.sim.tick(),this.gridView.update(),this.logElement.innerText=`Tick: ${this.sim.tickCounter}\n${this.currentCell}`}update(){}},w={type:o.a.AUTO,parent:"content",width:800,height:600,localStorageName:"phaseres6webpack"};const x=Object.assign(w,{scene:[a,h,b]});class S extends o.a.Game{constructor(){super(x)}}window.game=new S}});