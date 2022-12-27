"use strict";(self.webpackChunktradingview=self.webpackChunktradingview||[]).push([[8765],{36028:(e,t,n)=>{n.d(t,{TouchBackend:()=>m});var r,o=n(46123);!function(e){e.mouse="mouse",e.touch="touch",e.keyboard="keyboard"}(r||(r={}));var i=1,a=0;function s(e){return void 0===e.button||e.button===a}function c(e){return!!e.targetTouches}function u(e,t){return c(e)?function(e,t){return 1===e.targetTouches.length?u(e.targetTouches[0]):t&&1===e.touches.length&&e.touches[0].target===t.target?u(e.touches[0]):void 0}(e,t):{x:e.clientX,y:e.clientY}}var d=function(){var e=!1;try{addEventListener("test",(function(){}),Object.defineProperty({},"passive",{get:function(){return e=!0,!0}}))}catch(e){}return e}();function l(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}var h,p=function(){function e(t,n){var r=this;!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),this.enableTouchEvents=!0,this.enableMouseEvents=!1,this.enableKeyboardEvents=!1,this.ignoreContextMenu=!1,this.enableHoverOutsideTarget=!1,this.touchSlop=0,this.scrollAngleRanges=void 0,this.context=n,this.delayTouchStart=t.delayTouchStart||t.delay||0,this.delayMouseStart=t.delayMouseStart||t.delay||0,Object.keys(t).forEach((function(e){null!=t[e]&&(r[e]=t[e])}))}var t,n,r;return t=e,(n=[{key:"window",get:function(){return this.context&&this.context.window?this.context.window:"undefined"!=typeof window?window:void 0}},{key:"document",get:function(){var e;return null!==(e=this.context)&&void 0!==e&&e.document?this.context.document:this.window?this.window.document:void 0}}])&&l(t.prototype,n),r&&l(t,r),e}();function f(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function v(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}var g=(v(h={},r.mouse,{start:"mousedown",move:"mousemove",end:"mouseup",contextmenu:"contextmenu"}),v(h,r.touch,{start:"touchstart",move:"touchmove",end:"touchend"}),v(h,r.keyboard,{keydown:"keydown"}),h),y=function(){function e(t,n,o){var a=this;!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),this.getSourceClientOffset=function(e){var t=a.sourceNodes.get(e);return t&&function(e){var t=1===e.nodeType?e:e.parentElement;if(t){var n=t.getBoundingClientRect(),r=n.top;return{x:n.left,y:r}}}(t)},this.handleTopMoveStartCapture=function(e){s(e)&&(a.moveStartSourceIds=[])},this.handleMoveStart=function(e){Array.isArray(a.moveStartSourceIds)&&a.moveStartSourceIds.unshift(e)},this.handleTopMoveStart=function(e){if(s(e)){var t=u(e);t&&(c(e)&&(a.lastTargetTouchFallback=e.targetTouches[0]),a._mouseClientOffset=t),a.waitingForDelay=!1}},this.handleTopMoveStartDelay=function(e){if(s(e)){var t=e.type===g.touch.start?a.options.delayTouchStart:a.options.delayMouseStart
;a.timeout=setTimeout(a.handleTopMoveStart.bind(a,e),t),a.waitingForDelay=!0}},this.handleTopMoveCapture=function(){a.dragOverTargetIds=[]},this.handleMove=function(e,t){a.dragOverTargetIds&&a.dragOverTargetIds.unshift(t)},this.handleTopMove=function(e){if(a.timeout&&clearTimeout(a.timeout),a.document&&!a.waitingForDelay){var t,n,r,o,i=a.moveStartSourceIds,s=a.dragOverTargetIds,c=a.options.enableHoverOutsideTarget,d=u(e,a.lastTargetTouchFallback);if(d)if(a._isScrolling||!a.monitor.isDragging()&&function(e,t,n,r,o){if(!o)return!1;for(var i=180*Math.atan2(r-t,n-e)/Math.PI+180,a=0;a<o.length;++a)if((null==o[a].start||i>=o[a].start)&&(null==o[a].end||i<=o[a].end))return!0;return!1}(a._mouseClientOffset.x||0,a._mouseClientOffset.y||0,d.x,d.y,a.options.scrollAngleRanges))a._isScrolling=!0;else if(!a.monitor.isDragging()&&a._mouseClientOffset.hasOwnProperty("x")&&i&&(t=a._mouseClientOffset.x||0,n=a._mouseClientOffset.y||0,r=d.x,o=d.y,Math.sqrt(Math.pow(Math.abs(r-t),2)+Math.pow(Math.abs(o-n),2))>(a.options.touchSlop?a.options.touchSlop:0))&&(a.moveStartSourceIds=void 0,a.actions.beginDrag(i,{clientOffset:a._mouseClientOffset,getSourceClientOffset:a.getSourceClientOffset,publishSource:!1})),a.monitor.isDragging()){var l=a.sourceNodes.get(a.monitor.getSourceId());a.installSourceNodeRemovalObserver(l),a.actions.publishDragSource(),e.cancelable&&e.preventDefault();var h=(s||[]).map((function(e){return a.targetNodes.get(e)})).filter((function(e){return!!e})),p=a.options.getDropTargetElementsAtPoint?a.options.getDropTargetElementsAtPoint(d.x,d.y,h):a.document.elementsFromPoint(d.x,d.y),f=[];for(var v in p)if(p.hasOwnProperty(v)){var g=p[v];for(f.push(g);g;)(g=g.parentElement)&&-1===f.indexOf(g)&&f.push(g)}var y=f.filter((function(e){return h.indexOf(e)>-1})).map((function(e){return a._getDropTargetId(e)})).filter((function(e){return!!e})).filter((function(e,t,n){return n.indexOf(e)===t}));if(c)for(var m in a.targetNodes){var b=a.targetNodes.get(m);if(l&&b&&b.contains(l)&&-1===y.indexOf(m)){y.unshift(m);break}}y.reverse(),a.actions.hover(y,{clientOffset:d})}}},this._getDropTargetId=function(e){for(var t=a.targetNodes.keys(),n=t.next();!1===n.done;){var r=n.value;if(e===a.targetNodes.get(r))return r;n=t.next()}},this.handleTopMoveEndCapture=function(e){a._isScrolling=!1,a.lastTargetTouchFallback=void 0,function(e){return void 0===e.buttons||0==(e.buttons&i)}(e)&&(a.monitor.isDragging()&&!a.monitor.didDrop()?(e.cancelable&&e.preventDefault(),a._mouseClientOffset={},a.uninstallSourceNodeRemovalObserver(),a.actions.drop(),a.actions.endDrag()):a.moveStartSourceIds=void 0)},this.handleCancelOnEscape=function(e){"Escape"===e.key&&a.monitor.isDragging()&&(a._mouseClientOffset={},a.uninstallSourceNodeRemovalObserver(),a.actions.endDrag())},this.options=new p(o,n),this.actions=t.getActions(),this.monitor=t.getMonitor(),this.sourceNodes=new Map,this.sourcePreviewNodes=new Map,this.sourcePreviewNodeOptions=new Map,this.targetNodes=new Map,this.listenerTypes=[],this._mouseClientOffset={},this._isScrolling=!1,
this.options.enableMouseEvents&&this.listenerTypes.push(r.mouse),this.options.enableTouchEvents&&this.listenerTypes.push(r.touch),this.options.enableKeyboardEvents&&this.listenerTypes.push(r.keyboard)}var t,n,a;return t=e,(n=[{key:"profile",value:function(){var e;return{sourceNodes:this.sourceNodes.size,sourcePreviewNodes:this.sourcePreviewNodes.size,sourcePreviewNodeOptions:this.sourcePreviewNodeOptions.size,targetNodes:this.targetNodes.size,dragOverTargetIds:(null===(e=this.dragOverTargetIds)||void 0===e?void 0:e.length)||0}}},{key:"document",get:function(){return this.options.document}},{key:"setup",value:function(){this.document&&((0,o.invariant)(!e.isSetUp,"Cannot have two Touch backends at the same time."),e.isSetUp=!0,this.addEventListener(this.document,"start",this.getTopMoveStartHandler()),this.addEventListener(this.document,"start",this.handleTopMoveStartCapture,!0),this.addEventListener(this.document,"move",this.handleTopMove),this.addEventListener(this.document,"move",this.handleTopMoveCapture,!0),this.addEventListener(this.document,"end",this.handleTopMoveEndCapture,!0),this.options.enableMouseEvents&&!this.options.ignoreContextMenu&&this.addEventListener(this.document,"contextmenu",this.handleTopMoveEndCapture),this.options.enableKeyboardEvents&&this.addEventListener(this.document,"keydown",this.handleCancelOnEscape,!0))}},{key:"teardown",value:function(){this.document&&(e.isSetUp=!1,this._mouseClientOffset={},this.removeEventListener(this.document,"start",this.handleTopMoveStartCapture,!0),this.removeEventListener(this.document,"start",this.handleTopMoveStart),this.removeEventListener(this.document,"move",this.handleTopMoveCapture,!0),this.removeEventListener(this.document,"move",this.handleTopMove),this.removeEventListener(this.document,"end",this.handleTopMoveEndCapture,!0),this.options.enableMouseEvents&&!this.options.ignoreContextMenu&&this.removeEventListener(this.document,"contextmenu",this.handleTopMoveEndCapture),this.options.enableKeyboardEvents&&this.removeEventListener(this.document,"keydown",this.handleCancelOnEscape,!0),this.uninstallSourceNodeRemovalObserver())}},{key:"addEventListener",value:function(e,t,n,r){var o=d?{capture:r,passive:!1}:r;this.listenerTypes.forEach((function(r){var i=g[r][t];i&&e.addEventListener(i,n,o)}))}},{key:"removeEventListener",value:function(e,t,n,r){var o=d?{capture:r,passive:!1}:r;this.listenerTypes.forEach((function(r){var i=g[r][t];i&&e.removeEventListener(i,n,o)}))}},{key:"connectDragSource",value:function(e,t){var n=this,r=this.handleMoveStart.bind(this,e);return this.sourceNodes.set(e,t),this.addEventListener(t,"start",r),function(){n.sourceNodes.delete(e),n.removeEventListener(t,"start",r)}}},{key:"connectDragPreview",value:function(e,t,n){var r=this;return this.sourcePreviewNodeOptions.set(e,n),this.sourcePreviewNodes.set(e,t),function(){r.sourcePreviewNodes.delete(e),r.sourcePreviewNodeOptions.delete(e)}}},{key:"connectDropTarget",value:function(e,t){var n=this;if(!this.document)return function(){};var r=function(r){
if(n.document&&n.monitor.isDragging()){var o;switch(r.type){case g.mouse.move:o={x:r.clientX,y:r.clientY};break;case g.touch.move:o={x:r.touches[0].clientX,y:r.touches[0].clientY}}var i=null!=o?n.document.elementFromPoint(o.x,o.y):void 0,a=i&&t.contains(i);return i===t||a?n.handleMove(r,e):void 0}};return this.addEventListener(this.document.body,"move",r),this.targetNodes.set(e,t),function(){n.document&&(n.targetNodes.delete(e),n.removeEventListener(n.document.body,"move",r))}}},{key:"getTopMoveStartHandler",value:function(){return this.options.delayTouchStart||this.options.delayMouseStart?this.handleTopMoveStartDelay:this.handleTopMoveStart}},{key:"installSourceNodeRemovalObserver",value:function(e){var t=this;this.uninstallSourceNodeRemovalObserver(),this.draggedSourceNode=e,this.draggedSourceNodeRemovalObserver=new MutationObserver((function(){e&&!e.parentElement&&(t.resurrectSourceNode(),t.uninstallSourceNodeRemovalObserver())})),e&&e.parentElement&&this.draggedSourceNodeRemovalObserver.observe(e.parentElement,{childList:!0})}},{key:"resurrectSourceNode",value:function(){this.document&&this.draggedSourceNode&&(this.draggedSourceNode.style.display="none",this.draggedSourceNode.removeAttribute("data-reactid"),this.document.body.appendChild(this.draggedSourceNode))}},{key:"uninstallSourceNodeRemovalObserver",value:function(){this.draggedSourceNodeRemovalObserver&&this.draggedSourceNodeRemovalObserver.disconnect(),this.draggedSourceNodeRemovalObserver=void 0,this.draggedSourceNode=void 0}}])&&f(t.prototype,n),a&&f(t,a),e}(),m=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{};return new y(e,t,n)}},53614:(e,t,n)=>{n.d(t,{DragLayer:()=>w});var r=n(96349),o=n(59496),i=n(1633),a=n(46123),s=n(82118),c=n.n(s),u=n(89742),d=n(59885);function l(e){return(l="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function h(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function p(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function f(e,t,n){return t&&p(e.prototype,t),n&&p(e,n),e}function v(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&g(e,t)}function g(e,t){return(g=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function y(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,r=b(e);if(t){var o=b(this).constructor
;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return m(this,n)}}function m(e,t){return!t||"object"!==l(t)&&"function"!=typeof t?function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e):t}function b(e){return(b=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function w(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};return(0,d.checkDecoratorArguments)("DragLayer","collect[, options]",e,t),(0,a.invariant)("function"==typeof e,'Expected "collect" provided as the first argument to DragLayer to be a function that collects props to inject into the component. ',"Instead, received %s. Read more: http://react-dnd.github.io/react-dnd/docs/api/drag-layer",e),(0,a.invariant)((0,d.isPlainObject)(t),'Expected "options" provided as the second argument to DragLayer to be a plain object when specified. Instead, received %s. Read more: http://react-dnd.github.io/react-dnd/docs/api/drag-layer',t),function(n){var s=n,p=t.arePropsEqual,g=void 0===p?i.shallowEqual:p,m=s.displayName||s.name||"Component",b=function(t){v(c,t);var n=y(c);function c(){var e;return h(this,c),(e=n.apply(this,arguments)).isCurrentlyMounted=!1,e.ref=(0,o.createRef)(),e.handleChange=function(){if(e.isCurrentlyMounted){var t=e.getCurrentState();(0,i.shallowEqual)(t,e.state)||e.setState(t)}},e}return f(c,[{key:"getDecoratedComponentInstance",value:function(){return(0,a.invariant)(this.ref.current,"In order to access an instance of the decorated component, it must either be a class component or use React.forwardRef()"),this.ref.current}},{key:"shouldComponentUpdate",value:function(e,t){return!g(e,this.props)||!(0,i.shallowEqual)(t,this.state)}},{key:"componentDidMount",value:function(){this.isCurrentlyMounted=!0,this.handleChange()}},{key:"componentWillUnmount",value:function(){this.isCurrentlyMounted=!1,this.unsubscribeFromOffsetChange&&(this.unsubscribeFromOffsetChange(),this.unsubscribeFromOffsetChange=void 0),this.unsubscribeFromStateChange&&(this.unsubscribeFromStateChange(),this.unsubscribeFromStateChange=void 0)}},{key:"render",value:function(){var e=this;return(0,r.jsx)(u.DndContext.Consumer,{children:function(t){var n=t.dragDropManager;return void 0===n?null:(e.receiveDragDropManager(n),e.isCurrentlyMounted?(0,r.jsx)(s,Object.assign({},e.props,e.state,{ref:(0,d.isRefable)(s)?e.ref:null}),void 0):null)}},void 0)}},{key:"receiveDragDropManager",value:function(e){if(void 0===this.manager){this.manager=e,(0,a.invariant)("object"===l(e),"Could not find the drag and drop manager in the context of %s. Make sure to render a DndProvider component in your top-level component. Read more: http://react-dnd.github.io/react-dnd/docs/troubleshooting#could-not-find-the-drag-and-drop-manager-in-the-context",m,m);var t=this.manager.getMonitor();this.unsubscribeFromOffsetChange=t.subscribeToOffsetChange(this.handleChange),this.unsubscribeFromStateChange=t.subscribeToStateChange(this.handleChange)}}},{
key:"getCurrentState",value:function(){if(!this.manager)return{};var t=this.manager.getMonitor();return e(t,this.props)}}]),c}(o.Component);return b.displayName="DragLayer(".concat(m,")"),b.DecoratedComponent=n,c()(b,n)}}},73942:(e,t,n)=>{n.d(t,{DragSource:()=>f});var r=n(46123),o=n(83030),i=n(70494),a=n(55585),s=n(59885),c=n(57227);function u(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}var d=["canDrag","beginDrag","isDragging","endDrag"],l=["beginDrag"],h=function(){function e(t,n,r){var o=this;!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),this.props=null,this.beginDrag=function(){if(o.props)return o.spec.beginDrag(o.props,o.monitor,o.ref.current)},this.spec=t,this.monitor=n,this.ref=r}var t,n,r;return t=e,(n=[{key:"receiveProps",value:function(e){this.props=e}},{key:"canDrag",value:function(){return!!this.props&&(!this.spec.canDrag||this.spec.canDrag(this.props,this.monitor))}},{key:"isDragging",value:function(e,t){return!!this.props&&(this.spec.isDragging?this.spec.isDragging(this.props,this.monitor):t===e.getSourceId())}},{key:"endDrag",value:function(){this.props&&this.spec.endDrag&&this.spec.endDrag(this.props,this.monitor,(0,s.getDecoratedComponent)(this.ref))}}])&&u(t.prototype,n),r&&u(t,r),e}();function p(e){return Object.keys(e).forEach((function(t){(0,r.invariant)(d.indexOf(t)>-1,'Expected the drag source specification to only have some of the following keys: %s. Instead received a specification with an unexpected "%s" key. Read more: http://react-dnd.github.io/react-dnd/docs/api/drag-source',d.join(", "),t),(0,r.invariant)("function"==typeof e[t],"Expected %s in the drag source specification to be a function. Instead received a specification with %s: %s. Read more: http://react-dnd.github.io/react-dnd/docs/api/drag-source",t,t,e[t])})),l.forEach((function(t){(0,r.invariant)("function"==typeof e[t],"Expected %s in the drag source specification to be a function. Instead received a specification with %s: %s. Read more: http://react-dnd.github.io/react-dnd/docs/api/drag-source",t,t,e[t])})),function(t,n){return new h(e,t,n)}}function f(e,t,n){var u=arguments.length>3&&void 0!==arguments[3]?arguments[3]:{};(0,s.checkDecoratorArguments)("DragSource","type, spec, collect[, options]",e,t,n,u);var d=e;"function"!=typeof e&&((0,r.invariant)((0,s.isValidType)(e),'Expected "type" provided as the first argument to DragSource to be a string, or a function that returns a string given the current props. Instead, received %s. Read more: http://react-dnd.github.io/react-dnd/docs/api/drag-source',e),d=function(){return e}),(0,r.invariant)((0,s.isPlainObject)(t),'Expected "spec" provided as the second argument to DragSource to be a plain object. Instead, received %s. Read more: http://react-dnd.github.io/react-dnd/docs/api/drag-source',t);var l=p(t);return(0,
r.invariant)("function"==typeof n,'Expected "collect" provided as the third argument to DragSource to be a function that returns a plain object of props to inject. Instead, received %s. Read more: http://react-dnd.github.io/react-dnd/docs/api/drag-source',n),(0,r.invariant)((0,s.isPlainObject)(u),'Expected "options" provided as the fourth argument to DragSource to be a plain object when specified. Instead, received %s. Read more: http://react-dnd.github.io/react-dnd/docs/api/drag-source',n),function(e){return(0,c.decorateHandler)({containerDisplayName:"DragSource",createHandler:l,registerHandler:o.registerSource,createConnector:function(e){return new i.SourceConnector(e)},createMonitor:function(e){return new a.DragSourceMonitorImpl(e)},DecoratedComponent:e,getType:d,collect:n,options:u})}}},63318:(e,t,n)=>{n.d(t,{DropTarget:()=>p});var r=n(46123),o=n(83030),i=n(74584),a=n(92337),s=n(59885),c=n(57227);function u(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}var d=["canDrop","hover","drop"],l=function(){function e(t,n,r){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),this.props=null,this.spec=t,this.monitor=n,this.ref=r}var t,n,r;return t=e,(n=[{key:"receiveProps",value:function(e){this.props=e}},{key:"receiveMonitor",value:function(e){this.monitor=e}},{key:"canDrop",value:function(){return!this.spec.canDrop||this.spec.canDrop(this.props,this.monitor)}},{key:"hover",value:function(){this.spec.hover&&this.props&&this.spec.hover(this.props,this.monitor,(0,s.getDecoratedComponent)(this.ref))}},{key:"drop",value:function(){if(this.spec.drop)return this.spec.drop(this.props,this.monitor,this.ref.current)}}])&&u(t.prototype,n),r&&u(t,r),e}();function h(e){return Object.keys(e).forEach((function(t){(0,r.invariant)(d.indexOf(t)>-1,'Expected the drop target specification to only have some of the following keys: %s. Instead received a specification with an unexpected "%s" key. Read more: http://react-dnd.github.io/react-dnd/docs/api/drop-target',d.join(", "),t),(0,r.invariant)("function"==typeof e[t],"Expected %s in the drop target specification to be a function. Instead received a specification with %s: %s. Read more: http://react-dnd.github.io/react-dnd/docs/api/drop-target",t,t,e[t])})),function(t,n){return new l(e,t,n)}}function p(e,t,n){var u=arguments.length>3&&void 0!==arguments[3]?arguments[3]:{};(0,s.checkDecoratorArguments)("DropTarget","type, spec, collect[, options]",e,t,n,u);var d=e;"function"!=typeof e&&((0,r.invariant)((0,s.isValidType)(e,!0),'Expected "type" provided as the first argument to DropTarget to be a string, an array of strings, or a function that returns either given the current props. Instead, received %s. Read more: http://react-dnd.github.io/react-dnd/docs/api/drop-target',e),d=function(){return e}),(0,r.invariant)((0,
s.isPlainObject)(t),'Expected "spec" provided as the second argument to DropTarget to be a plain object. Instead, received %s. Read more: http://react-dnd.github.io/react-dnd/docs/api/drop-target',t);var l=h(t);return(0,r.invariant)("function"==typeof n,'Expected "collect" provided as the third argument to DropTarget to be a function that returns a plain object of props to inject. Instead, received %s. Read more: http://react-dnd.github.io/react-dnd/docs/api/drop-target',n),(0,r.invariant)((0,s.isPlainObject)(u),'Expected "options" provided as the fourth argument to DropTarget to be a plain object when specified. Instead, received %s. Read more: http://react-dnd.github.io/react-dnd/docs/api/drop-target',n),function(e){return(0,c.decorateHandler)({containerDisplayName:"DropTarget",createHandler:l,registerHandler:o.registerTarget,createMonitor:function(e){return new i.DropTargetMonitorImpl(e)},createConnector:function(e){return new a.TargetConnector(e)},DecoratedComponent:e,getType:d,collect:n,options:u})}}},57227:(e,t,n)=>{n.d(t,{decorateHandler:()=>k});var r=n(96349),o=n(59496),i=n(1633),a=n(46123),s=n(89742),c=n(59885);function u(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function d(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function l(e,t,n){return t&&d(e.prototype,t),n&&d(e,n),e}var h=function(){function e(t){u(this,e),this.isDisposed=!1,this.action=(0,c.isFunction)(t)?t:c.noop}return l(e,[{key:"dispose",value:function(){this.isDisposed||(this.action(),this.isDisposed=!0)}}],[{key:"isDisposable",value:function(e){return Boolean(e&&(0,c.isFunction)(e.dispose))}},{key:"_fixup",value:function(t){return e.isDisposable(t)?t:e.empty}},{key:"create",value:function(t){return new e(t)}}]),e}();h.empty={dispose:c.noop};var p=function(){function e(){u(this,e),this.isDisposed=!1;for(var t=arguments.length,n=new Array(t),r=0;r<t;r++)n[r]=arguments[r];this.disposables=n}return l(e,[{key:"add",value:function(e){this.isDisposed?e.dispose():this.disposables.push(e)}},{key:"remove",value:function(e){var t=!1;if(!this.isDisposed){var n=this.disposables.indexOf(e);-1!==n&&(t=!0,this.disposables.splice(n,1),e.dispose())}return t}},{key:"clear",value:function(){if(!this.isDisposed){for(var e=this.disposables.length,t=new Array(e),n=0;n<e;n++)t[n]=this.disposables[n];this.disposables=[];for(var r=0;r<e;r++)t[r].dispose()}}},{key:"dispose",value:function(){if(!this.isDisposed){this.isDisposed=!0;for(var e=this.disposables.length,t=new Array(e),n=0;n<e;n++)t[n]=this.disposables[n];this.disposables=[];for(var r=0;r<e;r++)t[r].dispose()}}}]),e}(),f=function(){function e(){u(this,e),this.isDisposed=!1}return l(e,[{key:"getDisposable",value:function(){return this.current}},{key:"setDisposable",value:function(e){var t=this.isDisposed;if(!t){var n=this.current;this.current=e,n&&n.dispose()}t&&e&&e.dispose()}},{key:"dispose",value:function(){if(!this.isDisposed){this.isDisposed=!0
;var e=this.current;this.current=void 0,e&&e.dispose()}}}]),e}(),v=n(82118),g=n.n(v);function y(e){return(y="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function m(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){if("undefined"==typeof Symbol||!(Symbol.iterator in Object(e)))return;var n=[],r=!0,o=!1,i=void 0;try{for(var a,s=e[Symbol.iterator]();!(r=(a=s.next()).done)&&(n.push(a.value),!t||n.length!==t);r=!0);}catch(e){o=!0,i=e}finally{try{r||null==s.return||s.return()}finally{if(o)throw i}}return n}(e,t)||function(e,t){if(!e)return;if("string"==typeof e)return b(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);"Object"===n&&e.constructor&&(n=e.constructor.name);if("Map"===n||"Set"===n)return Array.from(e);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return b(e,t)}(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function b(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=new Array(t);n<t;n++)r[n]=e[n];return r}function w(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function S(e,t){return(S=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function D(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,r=C(e);if(t){var o=C(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return O(this,n)}}function O(e,t){return!t||"object"!==y(t)&&"function"!=typeof t?function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e):t}function C(e){return(C=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function k(e){var t=e.DecoratedComponent,n=e.createHandler,u=e.createMonitor,d=e.createConnector,l=e.registerHandler,v=e.containerDisplayName,y=e.getType,b=e.collect,O=e.options.arePropsEqual,C=void 0===O?i.shallowEqual:O,k=t,T=t.displayName||t.name||"Component",E=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&S(e,t)}(E,e);var t,v,g,O=D(E);function E(e){var t;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,E),(t=O.call(this,e)).decoratedRef=(0,o.createRef)(),t.handleChange=function(){var e=t.getCurrentState();(0,
i.shallowEqual)(e,t.state)||t.setState(e)},t.disposable=new f,t.receiveProps(e),t.dispose(),t}return t=E,(v=[{key:"getHandlerId",value:function(){return this.handlerId}},{key:"getDecoratedComponentInstance",value:function(){return(0,a.invariant)(this.decoratedRef.current,"In order to access an instance of the decorated component, it must either be a class component or use React.forwardRef()"),this.decoratedRef.current}},{key:"shouldComponentUpdate",value:function(e,t){return!C(e,this.props)||!(0,i.shallowEqual)(t,this.state)}},{key:"componentDidMount",value:function(){this.disposable=new f,this.currentType=void 0,this.receiveProps(this.props),this.handleChange()}},{key:"componentDidUpdate",value:function(e){C(this.props,e)||(this.receiveProps(this.props),this.handleChange())}},{key:"componentWillUnmount",value:function(){this.dispose()}},{key:"receiveProps",value:function(e){this.handler&&(this.handler.receiveProps(e),this.receiveType(y(e)))}},{key:"receiveType",value:function(e){if(this.handlerMonitor&&this.manager&&this.handlerConnector&&e!==this.currentType){this.currentType=e;var t=m(l(e,this.handler,this.manager),2),n=t[0],r=t[1];this.handlerId=n,this.handlerMonitor.receiveHandlerId(n),this.handlerConnector.receiveHandlerId(n);var o=this.manager.getMonitor().subscribeToStateChange(this.handleChange,{handlerIds:[n]});this.disposable.setDisposable(new p(new h(o),new h(r)))}}},{key:"dispose",value:function(){this.disposable.dispose(),this.handlerConnector&&this.handlerConnector.receiveHandlerId(null)}},{key:"getCurrentState",value:function(){return this.handlerConnector?b(this.handlerConnector.hooks,this.handlerMonitor,this.props):{}}},{key:"render",value:function(){var e=this;return(0,r.jsx)(s.DndContext.Consumer,{children:function(t){var n=t.dragDropManager;return e.receiveDragDropManager(n),"undefined"!=typeof requestAnimationFrame&&requestAnimationFrame((function(){var t;return null===(t=e.handlerConnector)||void 0===t?void 0:t.reconnect()})),(0,r.jsx)(k,Object.assign({},e.props,e.getCurrentState(),{ref:(0,c.isRefable)(k)?e.decoratedRef:null}),void 0)}},void 0)}},{key:"receiveDragDropManager",value:function(e){void 0===this.manager&&((0,a.invariant)(void 0!==e,"Could not find the drag and drop manager in the context of %s. Make sure to render a DndProvider component in your top-level component. Read more: http://react-dnd.github.io/react-dnd/docs/troubleshooting#could-not-find-the-drag-and-drop-manager-in-the-context",T,T),void 0!==e&&(this.manager=e,this.handlerMonitor=u(e),this.handlerConnector=d(e.getBackend()),this.handler=n(this.handlerMonitor,this.decoratedRef)))}}])&&w(t.prototype,v),g&&w(t,g),E}(o.Component);return E.DecoratedComponent=t,E.displayName="".concat(v,"(").concat(T,")"),g()(E,t)}},59885:(e,t,n)=>{function r(e){return(r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function o(e){var t=e.current
;return null==t?null:t.decoratedRef?t.decoratedRef.current:t}function i(e){return(t=e)&&t.prototype&&"function"==typeof t.prototype.render||function(e){var t,n=e;return"Symbol(react.forward_ref)"===(null==n||null===(t=n.$$typeof)||void 0===t?void 0:t.toString())}(e);var t}function a(e,t){}function s(e){return"function"==typeof e}function c(){}function u(e){if(!function(e){return"object"===r(e)&&null!==e}(e))return!1;if(null===Object.getPrototypeOf(e))return!0;for(var t=e;null!==Object.getPrototypeOf(t);)t=Object.getPrototypeOf(t);return Object.getPrototypeOf(e)===t}function d(e,t){return"string"==typeof e||"symbol"===r(e)||!!t&&Array.isArray(e)&&e.every((function(e){return d(e,!1)}))}n.d(t,{getDecoratedComponent:()=>o,isRefable:()=>i,checkDecoratorArguments:()=>a,isFunction:()=>s,noop:()=>c,isPlainObject:()=>u,isValidType:()=>d})}}]);