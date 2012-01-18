var Tanchor=(function(window,document){var isObject=function(o){return typeof o==="object"&&o!==null;};var isArray=function(o){return Object.prototype.toString.call(o)==="[object Array]";};var extend=function(o,o2){var args=Array.prototype.slice.call(arguments,2),i;for(i in o2){if(o2.hasOwnProperty(i)){o[i]=o2[i];}}if(args.length){args.unshift(o);extend.apply(this,args);}return o;};var append=function(o,key,val){if(isObject(o)&&o.hasOwnProperty(key)){if(isArray(o[key])){o[key].push(val);}else{o[key]=[o[key],val];}}else{o[key]=val;}};var stringify=function(key,val,eq,sep){var s="",i,l;if(isArray(val)){for(i=0,l=val.length;i<l;i++){s+=sep+key+eq+val[i];}}else{s+=sep+key+eq+val;}return s;};var update=function(o,key,val){if(isObject(o)){if(typeof val==="undefined"){delete o[key];}else{o[key]=val;}}};var privateMethods={toObject_:function(type){var str,eq,sep,list,map,i,l,pair;if(type==="search"){str=this.anchor.search.replace(/^\?/,"");eq=this.seq;sep=this.ssp;}else{str=this.anchor.hash.replace(/^\#/,"");eq=this.heq;sep=this.hsp;}list=str.split(sep);map={};for(i=0,l=list.length;i<l;i++){pair=list[i].split(eq);if(pair[0]!==""){append(map,pair[0],pair[1]);}}return map;},toString_:function(type,map){var str="",eq,sep,i;if(type==="search"){eq=this.seq;sep=this.ssp;}else{eq=this.heq;sep=this.hsp;}for(i in map){if(map.hasOwnProperty(i)){str+=stringify(i,map[i],eq,sep);}}return str.replace(new RegExp("^\\"+sep),"");},getUrlVars_:function(type){var vars;vars={search:this.toObject_("search"),hash:this.toObject_("hash")};return type?vars[type]:vars;},setUrlVars_:function(type,map){var vars=this.getUrlVars_(type),i;for(i in map){if(map.hasOwnProperty(i)){update(vars,i,map[i]);}}return this.toString_(type,vars);}};var publicMethods={getSearchVars:function(){return this.getUrlVars_("search");},getHashVars:function(){return this.getUrlVars_("hash");},getUrlVars:function(hashFirst){var vars=this.getUrlVars_(),search=vars.search,hash=vars.hash,combined;if(hashFirst){combined=extend(hash,search);}else{combined=extend(search,hash);}return combined;},setSearchVars:function(map){this.anchor.search=this.setUrlVars_("search",map);return this;},setSearchVar:function(key,val){var o={};o[key]=val;return this.setSearchVars(o);},setHashVars:function(map){this.anchor.hash=this.setUrlVars_("hash",map);return this;},setHashVar:function(key,val){var o={};o[key]=val;return this.setHashVars(o);},delSearchVar:function(key){return this.setSearchVar(key);},delHashVar:function(key){return this.setHashVar(key);},toString:function(){return this.anchor.href;}};var nativeGetter=function(prop){return function(){return this.anchor[prop];};};var nativeMethods=(function(){var methods={},props,prop,i,l;props=["href","protocol","host","hostname","port","pathname","search","hash"];for(i=0,l=props.length;i<l;i++){prop=props[i];methods[prop]=nativeGetter(prop);}return methods;}());var regexP=/^(http|https|ftp):/;var regexPD=/^(http|https|ftp):\/\/([\w\-\d]+\.)+[\w\-\d]+/;var Anchor=function(href,searchEq,searchSep,hashEq,hashSep){if(typeof href==="undefined"||href===""){throw new Error("The href argument must be defined and non-empty.");}this.anchor=this.a=document.createElement("a");this.anchor.href=href;if(!regexP.test(this.anchor.protocol)){this.anchor.protocol=location.protocol;}if(!this.anchor.hostname){this.anchor.hostname=location.hostname;}this.seq=searchEq||"=";this.ssp=searchSep||"&";this.heq=hashEq||"=";this.hsp=hashSep||"&";};Anchor.prototype=extend({},nativeMethods,privateMethods,publicMethods);Anchor.factory=function(href,searchEq,searchSep,hashEq,hashSep){return new Anchor(href,searchEq,searchSep,hashEq,hashSep);};Anchor.factory.getQuery=function(key){var href=window.location.href,t=new Anchor(href),vars=t.getUrlVars(),result={},l;if(typeof key==="string"&&vars[key]){return vars[key];}if(isArray(key)){for(l=key.length;l--;){result[key[l]]=false;if(vars[key[l]]){result[key[l]]=vars[key[l]];}}return result;}if(typeof key==="undefined"){return vars;}return false;};return Anchor.factory;}(window,document));