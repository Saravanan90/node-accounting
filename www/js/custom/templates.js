this["App"] = this["App"] || {};
this["App"]["Templates"] = this["App"]["Templates"] || {};

this["App"]["Templates"]["client"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

_.forEach( clients, function(client, index) {;
__p += '\r\n\t<li class="listitem">\r\n\t\t<button class="floatRight js-editClient" data-index=' +
((__t = (index+lastIndex)) == null ? '' : __t) +
'>Edit</button>\r\n\t\t<p class="font24 bottomMargin-5">' +
((__t = (client.name)) == null ? '' : __t) +
'</p>\r\n\t\t<p class="bottomMargin-5">' +
((__t = (client.eMail)) == null ? '' : __t) +
'</p>\r\n\t\t<p>' +
((__t = (client.info)) == null ? '' : __t) +
'</p>\r\n\t</li>\r\n';
});


}
return __p
};

this["App"]["Templates"]["event"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

if(!_.isEmpty(projData)){;
__p += '\r\n<ul>\r\n\t<li>' +
((__t = (projData.name)) == null ? '' : __t) +
'</li>\r\n\t<li>' +
((__t = (projData.cost)) == null ? '' : __t) +
'</li>\r\n</ul>\r\n<ul id="eventlist">\r\n';
};
__p += '\r\n';
_.forEach( eventList, function(event) {;
__p += '\r\n\t<li class="listitem">\r\n\t\t<p class="font24 bottomMargin-5">' +
((__t = (event.name)) == null ? '' : __t) +
'</p>\r\n\t\t<p>' +
((__t = (event.time)) == null ? '' : __t) +
'</p>\r\n\t</li>\r\n';
});
__p += '\r\n';
if(!_.isEmpty(projData)){;
__p += '\r\n</ul>\r\n';
};


}
return __p
};

this["App"]["Templates"]["project"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

if(!_.isEmpty(clientData)){;
__p += '\r\n<ul>\r\n\t<li>' +
((__t = (clientData.name)) == null ? '' : __t) +
'</li>\r\n\t<li>' +
((__t = (clientData.eMail)) == null ? '' : __t) +
'</li>\r\n\t<li>' +
((__t = (clientData.info)) == null ? '' : __t) +
'</li>\r\n</ul>\r\n<ul id="projlist">\r\n';
};
__p += '\r\n';
_.forEach( projList, function(proj, index) {;
__p += '\r\n\t<li class="listitem">\r\n\t\t<button class="floatRight js-editClient" data-index=' +
((__t = (index+lastIndex)) == null ? '' : __t) +
'>Edit</button>\r\n\t\t<p class="font24 bottomMargin-5">' +
((__t = (proj.name)) == null ? '' : __t) +
'</p>\r\n\t\t<p>' +
((__t = (proj.cost)) == null ? '' : __t) +
'</p>\r\n\t</li>\r\n';
});
__p += '\r\n';
if(!_.isEmpty(clientData)){;
__p += '\r\n</ul>\r\n';
};


}
return __p
};

this["App"]["Templates"]["report"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

_.forEach( clients, function(client) {;
__p += '\r\n\t<ul>\r\n\t\t<li class="font24 textCenter bg-peachpuff listheader">' +
((__t = (client)) == null ? '' : __t) +
'</li>\r\n\t\t';
if( projects[client] ) {var projectList = projects[client];;
__p += '\r\n\t\t\t';
_.forEach( projectList, function(proj) {;
__p += '\r\n\t\t\t\t<li class="listitem">\r\n\t\t\t\t\t<p class="font18 bottomMargin-5">Project: ' +
((__t = (proj.name)) == null ? '' : __t) +
'</p>\r\n\t\t\t\t\t<p class="bottomMargin-5">Time Spent: ' +
((__t = (proj.totalTime)) == null ? '' : __t) +
'</p>\r\n\t\t\t\t\t<p>Earnings: ' +
((__t = (proj.totalCost)) == null ? '' : __t) +
'</p>\r\n\t\t\t\t</li>\r\n\t\t\t';
});
__p += '\r\n\t\t\t<li class="listitem bg-coral font-bold"><p>Total Earnings: ' +
((__t = (projectList.totalEarning)) == null ? '' : __t) +
'</p></li>\r\n\t\t';
}else{;
__p += '\r\n\t\t\t<li class="errorMsg listitem">Projects Not available</li>\r\n\t\t';
};
__p += '\r\n\t</ul>\r\n';
});


}
return __p
};

this["App"]["Templates"]["topClients"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

_.forEach( topClients, function(client) {;
__p += '\r\n\t<li class="font24 listitem">\r\n\t\t<span>' +
((__t = (client[0].client)) == null ? '' : __t) +
'</span>\r\n\t\t<span class="floatRight">' +
((__t = (client.totalEarning)) == null ? '' : __t) +
'</span>\r\n\t</li>\r\n';
});


}
return __p
};