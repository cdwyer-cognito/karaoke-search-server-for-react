(window["webpackJsonpkaraoke-search-client"]=window["webpackJsonpkaraoke-search-client"]||[]).push([[4],{223:function(e,t,a){"use strict";a.r(t);var n=a(16),l=a(31),s=a(0),r=a.n(s),i=a(49),c=a(100),o=a(218),u=a(205),d=a(191),m=a(114),p=a(198),f=a(54),g=a(222),b=a(206),v=a(212),h=a(8),E=a(97),q=Object(c.a)((function(e){return{requests:{minHeight:"calc(100vh - ".concat(h.q,"px - ").concat(e.spacing(3),"px)")},headerContainer:{position:"sticky",top:h.q,width:"100%",paddingTop:e.spacing(3),paddingBottom:e.spacing(3),backgroundColor:e.palette.background.paper,zIndex:100},titleContainer:{display:"flex",justifyContent:"space-between",alignItems:"baseline"},hint:{display:"flex",alignItems:"center"},filterContainer:{width:"100%",display:"flex",justifyContent:"center",flexWrap:"wrap",marginBottom:e.spacing(1)},textField:{maxWidth:"50vw",marginRight:e.spacing(3)},label:{display:"flex",alignItems:"center"},resultsListContainer:{display:"flex",flexDirection:"column"},resultsList:{flexGrow:1,width:"100%"},requestTables:{minHeight:"50px",width:"100%"},pending:{display:"flex",justifyContent:"space-between",alignItems:"flex-end"},empty:{marginTop:e.spacing(4),marginBottom:e.spacing(4)}}})),w=Object(i.f)((function(e){var t=e.songRequests,a=e.completedSongRequests,n=e.setSelectedButton,s=e.startPollForRequests,i=e.stopPollForRequests,c=e.pollStatus,w=e.history,C=q(),x=r.a.useState(""),y=Object(l.a)(x,2),j=y[0],S=y[1],k=r.a.useState(0),R=Object(l.a)(k,2),O=R[0],N=R[1],L=r.a.useState(t),I=Object(l.a)(L,2),T=I[0],F=I[1],P=r.a.useState(a),B=Object(l.a)(P,2),A=B[0],D=B[1];r.a.useEffect((function(){return n(h.j),s(),function(){n(null),i()}}),[]),r.a.useEffect((function(){F(t),D(a)}),[t,a]);r.a.useEffect((function(){0===j.length?(F(t),D(a)):j.length>=1&&function(){var e=j.toLowerCase();F(t.filter((function(t){var a=t.Artist,n=t.Title,l=t.Singer.toLowerCase().includes(e),s=n.toLowerCase().includes(e),r=a.toLowerCase().includes(e);return 0===O&&l||1===O&&s||2===O&&r?t:null}))),D(a.filter((function(t){var a=t.Artist,n=t.Title,l=t.Singer.toLowerCase().includes(e),s=n.toLowerCase().includes(e),r=a.toLowerCase().includes(e);return 0===O&&l||1===O&&s||2===O&&r?t:null})))}()}),[j,O]);var W=Object(f.a)({onSwipedLeft:function(){return w.push(h.n)},onSwipedRight:function(){return w.push(h.b)},preventDefaultTouchmoveEvent:!0,trackMouse:!0});return r.a.createElement("div",Object.assign({className:C.requests},W),r.a.createElement("div",{id:"header-container",className:C.headerContainer},r.a.createElement("div",{id:"search=box",className:C.filterContainer},r.a.createElement(o.a,{id:"filter-text-field",label:"Filter results",value:j,onChange:function(e){return S(e.target.value)},className:C.textField,variant:"outlined",fullWidth:!0,InputProps:{endAdornment:r.a.createElement(u.a,{position:"end"},r.a.createElement(d.a,{disabled:!j,onClick:function(){return S("")}},r.a.createElement(v.a,null)))}}),r.a.createElement(g.a,{size:"large",value:O,exclusive:!0,onChange:function(e,t){return function(e){null!==e&&N(e)}(t)}},r.a.createElement(b.a,{key:"singer",value:0},r.a.createElement(m.a,null,"Singer")),r.a.createElement(b.a,{key:"title",value:1},r.a.createElement(m.a,null,"Title")),r.a.createElement(b.a,{key:"artist",value:2},r.a.createElement(m.a,null,"Artist"))))),r.a.createElement("div",{id:"results-list-container",className:C.resultsListContainer},r.a.createElement("div",{className:C.pending},r.a.createElement(m.a,{variant:"h6"},"Pending Requests"),r.a.createElement(m.a,{variant:"body1"},c)),r.a.createElement("div",{id:"pending-requests",className:C.requestTables},t.length>0?r.a.createElement(p.a,null,T.map((function(e){return r.a.createElement(E.a,{key:e.RequestID,songObj:e})}))):r.a.createElement(m.a,{className:C.empty,align:"center"},"No requests available")),r.a.createElement(m.a,{variant:"h6"},"Completed Requests"),r.a.createElement("div",{id:"completed-requests",className:C.requestTables},a.length>0?r.a.createElement(p.a,null,A.map((function(e){return r.a.createElement(E.a,{key:e.RequestID,songObj:e})}))):r.a.createElement(m.a,{className:C.empty,align:"center"},"No completed requests available"))))})),C=a(5);t.default=Object(n.b)((function(e){var t=e.results,a=e.api;return{songRequests:t.songRequests,completedSongRequests:t.completedSongRequests,pollStatus:a.pollStatus}}),(function(e){return{setSelectedButton:function(t){return e(Object(C.w)(t))},startPollForRequests:function(){return e(Object(C.G)())},stopPollForRequests:function(){return e(Object(C.I)())}}}))(w)}}]);
//# sourceMappingURL=4.9d8807f2.chunk.js.map