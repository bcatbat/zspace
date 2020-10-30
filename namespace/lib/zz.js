var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var zz;
(function (zz) {
    function int(x) {
        return x | 0;
    }
    zz.int = int;
    function uint(x) {
        return x >>> 0;
    }
    zz.uint = uint;
    function int8(x) {
        return (x << 24) >> 24;
    }
    zz.int8 = int8;
    function int16(x) {
        return (x << 16) >> 16;
    }
    zz.int16 = int16;
    function int32(x) {
        return x | 0;
    }
    zz.int32 = int32;
    function uint8(x) {
        return x & 255;
    }
    zz.uint8 = uint8;
    function uint16(x) {
        return x & 65535;
    }
    zz.uint16 = uint16;
    function uint32(x) {
        return x >>> 0;
    }
    zz.uint32 = uint32;
    function float(x) {
        return Math.fround(x);
    }
    zz.float = float;
    function double(x) {
        return +x;
    }
    zz.double = double;
})(zz || (zz = {}));
window.zz = zz;
/// <reference path="zzType.ts" />
var zz;
(function (zz) {
    let BTState;
    (function (BTState) {
        BTState[BTState["Failure"] = 0] = "Failure";
        BTState[BTState["Success"] = 1] = "Success";
        BTState[BTState["Continue"] = 2] = "Continue";
        BTState[BTState["Abort"] = 3] = "Abort";
    })(BTState || (BTState = {}));
    /**Behavior Tree */
    class BT {
        static Root() {
            return new Root();
        }
        static Sequence() {
            return new Sequence();
        }
        static Selector(shuffle = false) {
            return new Selector(shuffle);
        }
        static Call(fn) {
            return new Action(fn);
        }
        static If(fn) {
            return new ConditionalBranch(fn);
        }
        static While(fn) {
            return new While(fn);
        }
        static Condition(fn) {
            return new Condition(fn);
        }
        static Repeat(count) {
            return new Repeat(count);
        }
        static Wait(seconds) {
            return new Wait(seconds);
        }
        static Terminate() {
            return new Terminate();
        }
        static Log(msg) {
            return new Log(msg);
        }
        static RandomSequence(weights = null) {
            return new RandomSequence(weights);
        }
    }
    zz.BT = BT;
    class BTNode {
    }
    class Branch extends BTNode {
        constructor() {
            super(...arguments);
            this.activeChild = 0;
            this.children = [];
        }
        OpenBranch(...children) {
            this.children.push(...children);
            return this;
        }
        Children() {
            return this.children;
        }
        ActiveChild() {
            return this.activeChild;
        }
        ResetChildren() {
            this.activeChild = 0;
            this.children.forEach(v => {
                if (v instanceof Branch) {
                    v.ResetChildren();
                }
            });
        }
    }
    class Decorator extends BTNode {
        Do(child) {
            this.child = child;
            return this;
        }
    }
    class Sequence extends Branch {
        Tick() {
            let childState = this.children[this.activeChild].Tick();
            switch (childState) {
                case BTState.Success:
                    this.activeChild++;
                    if (this.activeChild == this.children.length) {
                        this.activeChild = 0;
                        return BTState.Success;
                    }
                    else {
                        return BTState.Continue;
                    }
                case BTState.Failure:
                    this.activeChild = 0;
                    return BTState.Failure;
                case BTState.Continue:
                    return BTState.Continue;
                case BTState.Abort:
                    this.activeChild = 0;
                    return BTState.Abort;
            }
        }
    }
    class Selector extends Branch {
        constructor(shuffle) {
            super();
            if (shuffle) {
                let n = this.children.length;
                while (n > 1) {
                    n--;
                    let k = zz.int(Math.random() * (n + 1));
                    let val = this.children[k];
                    this.children[k] = this.children[n];
                    this.children[n] = val;
                }
            }
        }
        Tick() {
            let childState = this.children[this.activeChild].Tick();
            switch (childState) {
                case BTState.Success:
                    this.activeChild = 0;
                    return BTState.Success;
                case BTState.Failure:
                    this.activeChild++;
                    if (this.activeChild == this.children.length) {
                        this.activeChild = 0;
                        return BTState.Failure;
                    }
                    else {
                        return BTState.Continue;
                    }
                case BTState.Continue:
                    return BTState.Continue;
                case BTState.Abort:
                    return BTState.Abort;
            }
        }
    }
    class Block extends Branch {
        Tick() {
            switch (this.children[this.activeChild].Tick()) {
                case BTState.Continue:
                    return BTState.Continue;
                default:
                    this.activeChild++;
                    if (this.activeChild == this.children.length) {
                        this.activeChild = 0;
                        return BTState.Success;
                    }
                    return BTState.Continue;
            }
        }
    }
    class Action extends BTNode {
        constructor(fn) {
            super();
            this.fn = fn;
        }
        Tick() {
            if (this.fn) {
                this.fn();
                return BTState.Success;
            }
        }
        ToString() {
            return 'Action : ' + this.fn.name;
        }
    }
    class Condition extends BTNode {
        constructor(fn) {
            super();
            this.fn = fn;
        }
        Tick() {
            return this.fn() ? BTState.Success : BTState.Failure;
        }
        ToString() {
            return 'Conditon : ' + this.fn.name;
        }
    }
    class Wait extends BTNode {
        constructor(seconds) {
            super();
            this.seconds = 0;
            this.future = -1;
            this.seconds = seconds;
        }
        Tick() {
            if (this.future < 0) {
                this.future = Date.now() / 1000 + this.seconds;
            }
            if (Date.now() / 1000 >= this.future) {
                this.future = -1;
                return BTState.Success;
            }
            else {
                return BTState.Continue;
            }
        }
    }
    class ConditionalBranch extends Block {
        constructor(fn) {
            super();
            this.tested = false;
            this.fn = fn;
        }
        Tick() {
            if (!this.tested) {
                this.tested = this.fn();
            }
            if (this.tested) {
                let result = super.Tick();
                if (result == BTState.Continue) {
                    return BTState.Continue;
                }
                else {
                    this.tested = false;
                    return result;
                }
            }
            else {
                return BTState.Failure;
            }
        }
        ToString() {
            return 'ConditionalBranch : ' + this.fn.name;
        }
    }
    class While extends Block {
        constructor(fn) {
            super();
            this.fn = fn;
        }
        Tick() {
            if (this.fn()) {
                super.Tick();
            }
            else {
                // exit the loop
                this.ResetChildren();
                return BTState.Failure;
            }
            return BTState.Continue;
        }
        ToString() {
            return 'While : ' + this.fn.name;
        }
    }
    class Root extends Block {
        constructor() {
            super(...arguments);
            this.isTerminated = false;
        }
        Tick() {
            if (this.isTerminated)
                return BTState.Abort;
            while (true) {
                switch (this.children[this.activeChild].Tick()) {
                    case BTState.Continue:
                        return BTState.Continue;
                    case BTState.Abort:
                        this.isTerminated = true;
                        return BTState.Abort;
                    default:
                        this.activeChild++;
                        if (this.activeChild == this.children.length) {
                            this.activeChild = 0;
                            return BTState.Success;
                        }
                        continue;
                }
            }
        }
    }
    zz.Root = Root;
    class Repeat extends Block {
        constructor(count) {
            super();
            this.count = 1;
            this.currentCount = 0;
            this.count = count;
        }
        Tick() {
            if (this.count > 0 && this.currentCount < this.count) {
                let result = super.Tick();
                switch (result) {
                    case BTState.Continue:
                        return BTState.Continue;
                    default:
                        this.currentCount++;
                        if (this.currentCount == this.count) {
                            this.currentCount = 0;
                            return BTState.Success;
                        }
                        return BTState.Continue;
                }
            }
        }
        ToString() {
            return 'Repeat Until : ' + this.currentCount + ' / ' + this.count;
        }
    }
    class RandomSequence extends Block {
        /**
         *
         * @param weight Leave null so that all child node have the same weight
         */
        constructor(weight = null) {
            super();
            this.m_Weight = null;
            this.m_AddedWeight = null;
            this.activeChild = -1;
            this.m_Weight = weight;
        }
        OpenBranch(...children) {
            let len = children.length;
            this.m_AddedWeight = new Array(len);
            for (let i = 0; i < len; i++) {
                let weight = 0;
                let prevWeight = 0;
                if (this.m_Weight == null || this.m_Weight.length <= i) {
                    weight = 1;
                }
                else {
                    weight = this.m_Weight[i];
                }
                if (i > 0) {
                    prevWeight = this.m_AddedWeight[i - 1];
                }
                this.m_AddedWeight[i] = weight + prevWeight;
            }
            return super.OpenBranch(...children);
        }
        PickNewChild() {
            let choice = Math.random() * this.m_AddedWeight[this.m_AddedWeight.length - 1];
            for (let i = 0, len = this.m_AddedWeight.length; i < len; i++) {
                if (choice <= this.m_AddedWeight[i]) {
                    this.activeChild = i;
                    break;
                }
            }
        }
        Tick() {
            if (this.activeChild == -1) {
                this.PickNewChild();
            }
            let res = this.children[this.activeChild].Tick();
            switch (res) {
                case BTState.Continue:
                    return BTState.Continue;
                default:
                    this.PickNewChild();
                    return res;
            }
        }
        ToString() {
            return ('Random Sequence : ' + this.activeChild + ' / ' + this.children.length);
        }
    }
    class Terminate extends BTNode {
        Tick() {
            return BTState.Abort;
        }
    }
    class Log extends BTNode {
        constructor(msg) {
            super();
            this.msg = msg;
        }
        Tick() {
            console.log(this.msg);
            return BTState.Success;
        }
    }
})(zz || (zz = {}));
window.zz = zz;
var zz;
(function (zz) {
    class Delegate {
        constructor(callback, argArray, isOnce = false) {
            this.isOnce = false;
            this.callback = callback;
            this.argArray = argArray;
            this.isOnce = isOnce;
        }
        get Callback() {
            return this.callback;
        }
        get ArgArray() {
            return this.argArray;
        }
        get IsOnce() {
            return this.isOnce;
        }
        set IsOnce(v) {
            this.isOnce = v;
        }
    }
    class EventMgr {
        constructor() {
            this.mEventMap = new Map();
        }
        has(eventType, caller, callback) {
            return !!this.find(eventType, caller, callback);
        }
        fire(eventType, ...argArray) {
            if (!eventType) {
                console.error('Event eventType is null!');
                return false;
            }
            let delegateList = [];
            let callerList = [];
            let eventMap = this.mEventMap.get(eventType);
            if (eventMap) {
                eventMap.forEach((eventList, caller) => {
                    for (let delegate of eventList) {
                        delegateList.push(delegate);
                        callerList.push(caller);
                    }
                    for (let index = eventList.length - 1; index >= 0; --index) {
                        if (eventList[index].IsOnce) {
                            eventList.splice(index, 1);
                        }
                    }
                    if (eventList.length <= 0) {
                        eventMap.delete(caller);
                    }
                });
                if (eventMap.size <= 0) {
                    this.mEventMap.delete(eventType);
                }
            }
            let length = delegateList.length;
            for (let index = 0; index < length; index++) {
                let delegate = delegateList[index];
                delegate.Callback.call(callerList[index], ...delegate.ArgArray, ...argArray);
            }
            return length > 0;
        }
        register(eventType, caller, callback, ...argArray) {
            this.addListener(eventType, caller, callback, false, ...argArray);
        }
        registerOnce(eventType, caller, callback, ...argArray) {
            this.addListener(eventType, caller, callback, true, ...argArray);
        }
        delRegister(type, caller, callback, onceOnly) {
            this.removeBy((eventType, listenerCaller, delegate) => {
                if (type && type !== eventType) {
                    return false;
                }
                if (caller && caller !== listenerCaller) {
                    return false;
                }
                if (callback && callback !== delegate.Callback) {
                    return false;
                }
                if (onceOnly && !delegate.IsOnce) {
                    return false;
                }
                return true;
            });
        }
        delAllRegister(caller) {
            this.mEventMap.forEach((eventMap, type) => {
                eventMap.delete(caller);
                if (eventMap.size <= 0) {
                    this.mEventMap.delete(type);
                }
            });
        }
        find(eventType, caller, callback) {
            if (!eventType) {
                console.error('Event eventType is null!');
                return null;
            }
            if (!caller) {
                console.error('Caller eventType is null!');
                return null;
            }
            if (!callback) {
                console.error('Listener is null!');
                return null;
            }
            let eventMap;
            if (this.mEventMap.has(eventType)) {
                eventMap = this.mEventMap.get(eventType);
            }
            else {
                eventMap = new Map();
                this.mEventMap.set(eventType, eventMap);
            }
            let eventList;
            if (eventMap.has(caller)) {
                eventList = eventMap.get(caller);
            }
            else {
                eventList = [];
                eventMap.set(caller, eventList);
            }
            for (let delegate of eventList) {
                if (delegate.Callback === callback) {
                    return delegate;
                }
            }
            return null;
        }
        addListener(eventType, caller, callback, isOnce, ...argArray) {
            let delegate = this.find(eventType, caller, callback);
            if (delegate) {
                delegate.IsOnce = isOnce;
                console.error('Listener is already exist!');
            }
            else {
                let delegate = new Delegate(callback, argArray, isOnce);
                this.mEventMap.get(eventType).get(caller).push(delegate);
            }
        }
        removeBy(predicate) {
            if (!predicate) {
                return;
            }
            this.mEventMap.forEach((eventMap, eventType) => {
                eventMap.forEach((eventList, caller) => {
                    for (let index = eventList.length - 1; index >= 0; --index) {
                        let delegate = eventList[index];
                        if (predicate(eventType, caller, delegate)) {
                            eventList.splice(index, 1);
                        }
                    }
                    if (eventList.length <= 0) {
                        eventMap.delete(caller);
                    }
                });
                if (eventMap.size <= 0) {
                    this.mEventMap.delete(eventType);
                }
            });
        }
    }
    /**事件管理 */
    zz.event = new EventMgr();
})(zz || (zz = {}));
window.zz = zz;
var zz;
(function (zz) {
    let LogLevel;
    (function (LogLevel) {
        LogLevel[LogLevel["Log"] = 0] = "Log";
        LogLevel[LogLevel["Warn"] = 1] = "Warn";
        LogLevel[LogLevel["Error"] = 2] = "Error";
        LogLevel[LogLevel["No"] = 3] = "No";
    })(LogLevel = zz.LogLevel || (zz.LogLevel = {}));
    /**0 */
    zz.logLevel = LogLevel.Log;
    function log(...data) {
        if (zz.logLevel <= LogLevel.Log)
            console.log(...data);
    }
    zz.log = log;
    function warn(...data) {
        if (zz.logLevel <= LogLevel.Warn)
            console.warn(...data);
    }
    zz.warn = warn;
    function error(...data) {
        if (zz.logLevel <= LogLevel.Error)
            console.error(...data);
    }
    zz.error = error;
    function assertEqual(a, b, msg) {
        console.assert(a == b, msg);
    }
    zz.assertEqual = assertEqual;
})(zz || (zz = {}));
window.zz = zz;
/// <reference path="zzLog.ts" />
var zz;
(function (zz) {
    /**
     * 获取相对路径节点上的组件
     * @param type component类型
     * @param node 节点
     * @param path 相对于节点的路径
     * @returns {T}
     */
    function findCom(type, node, ...path) {
        return findNode(node, ...path).getComponent(type);
    }
    zz.findCom = findCom;
    /**
     * 获取相对路径上的节点; 记住cc是通过遍历获取的;
     * @param node 基准节点
     * @param path 相对路径
     * @returns {cc.Node}
     */
    function findNode(node, ...path) {
        return path.reduce((node, name) => node.getChildByName(name), node);
    }
    zz.findNode = findNode;
    let tipFn = (msg) => {
        zz.warn('没有注入tip方法', msg);
    };
    function setTipFn(fn) {
        tipFn = fn;
    }
    zz.setTipFn = setTipFn;
    /**
     * 弹出提示信息文字
     * @param msg 信息文字
     */
    function tipMsg(msg) {
        tipFn(msg);
    }
    zz.tipMsg = tipMsg;
    /**读条页帮助函数 */
    let loadingFn = (...loadingPageParam) => {
        zz.warn('没有注入loadingPage方法', loadingPageParam);
    };
    /**
     * 开关载入页;
     * @param parm 载入页参数
     */
    function loadingPage(...parm) {
        loadingFn(...parm);
    }
    zz.loadingPage = loadingPage;
    function setLoadingPageFn(func) {
        loadingFn = func;
    }
    zz.setLoadingPageFn = setLoadingPageFn;
})(zz || (zz = {}));
window.zz = zz;
var zz;
(function (zz) {
    var ts;
    (function (ts) {
        /**
         * Iterates through 'array' by index and performs the callback on each element of array until the callback
         * returns a truthy value, then returns that value.
         * If no such value is found, the callback is applied to each element of array and undefined is returned.
         */
        function forEach(array, callback) {
            if (array) {
                for (let i = 0; i < array.length; i++) {
                    const result = callback(array[i], i);
                    if (result) {
                        return result;
                    }
                }
            }
            return undefined;
        }
        ts.forEach = forEach;
        /**
         * Like `forEach`, but iterates in reverse order.
         */
        function forEachRight(array, callback) {
            if (array) {
                for (let i = array.length - 1; i >= 0; i--) {
                    const result = callback(array[i], i);
                    if (result) {
                        return result;
                    }
                }
            }
            return undefined;
        }
        ts.forEachRight = forEachRight;
        function zipWith(arrayA, arrayB, callback) {
            const result = [];
            for (let i = 0; i < arrayA.length; i++) {
                result.push(callback(arrayA[i], arrayB[i], i));
            }
            return result;
        }
        ts.zipWith = zipWith;
        function zipToMap(keys, values) {
            const map = new Map();
            for (let i = 0; i < keys.length; ++i) {
                map.set(keys[i], values[i]);
            }
            return map;
        }
        ts.zipToMap = zipToMap;
        /**
         * Creates a new array with `element` interspersed in between each element of `input`
         * if there is more than 1 value in `input`. Otherwise, returns the existing array.
         */
        function intersperse(input, element) {
            if (input.length <= 1) {
                return input;
            }
            const result = [];
            for (let i = 0, n = input.length; i < n; i++) {
                if (i)
                    result.push(element);
                result.push(input[i]);
            }
            return result;
        }
        ts.intersperse = intersperse;
        function countWhere(array, predicate) {
            let count = 0;
            if (array) {
                for (let i = 0; i < array.length; i++) {
                    const v = array[i];
                    if (predicate(v, i)) {
                        count++;
                    }
                }
            }
            return count;
        }
        ts.countWhere = countWhere;
        /**
         * Tests whether a value is an array.
         */
        function isArray(value) {
            return Array.isArray ? Array.isArray(value) : value instanceof Array;
        }
        ts.isArray = isArray;
        /**
         * Gets the actual offset into an array for a relative offset. Negative offsets indicate a
         * position offset from the end of the array.
         */
        function toOffset(array, offset) {
            return offset < 0 ? array.length + offset : offset;
        }
        function addRange(to, from, start, end) {
            if (from === undefined || from.length === 0)
                return to;
            if (to === undefined)
                return from.slice(start, end);
            start = start === undefined ? 0 : toOffset(from, start);
            end = end === undefined ? from.length : toOffset(from, end);
            for (let i = start; i < end && i < from.length; i++) {
                if (from[i] !== undefined) {
                    to.push(from[i]);
                }
            }
            return to;
        }
        ts.addRange = addRange;
        /**
         * Flattens an array containing a mix of array or non-array elements.
         *
         * @param array The array to flatten.
         */
        function flatten(array) {
            const result = [];
            for (const v of array) {
                if (v) {
                    if (isArray(v)) {
                        addRange(result, v);
                    }
                    else {
                        result.push(v);
                    }
                }
            }
            return result;
        }
        ts.flatten = flatten;
        function compact(array) {
            let result;
            if (array) {
                for (let i = 0; i < array.length; i++) {
                    const v = array[i];
                    if (result || !v) {
                        if (!result) {
                            result = array.slice(0, i);
                        }
                        if (v) {
                            result.push(v);
                        }
                    }
                }
            }
            return result || array;
        }
        ts.compact = compact;
        /**
         * Returns the first element of an array if non-empty, `undefined` otherwise.
         */
        function firstOrUndefined(array) {
            return array.length === 0 ? undefined : array[0];
        }
        ts.firstOrUndefined = firstOrUndefined;
        /**
         * Returns the last element of an array if non-empty, `undefined` otherwise.
         */
        function lastOrUndefined(array) {
            return array.length === 0 ? undefined : array[array.length - 1];
        }
        ts.lastOrUndefined = lastOrUndefined;
        /**
         * Returns the element at a specific offset in an array if non-empty, `undefined` otherwise.
         * A negative offset indicates the element should be retrieved from the end of the array.
         */
        function elementAt(array, offset) {
            if (array) {
                offset = toOffset(array, offset);
                if (offset < array.length) {
                    return array[offset];
                }
            }
            return undefined;
        }
        ts.elementAt = elementAt;
    })(ts = zz.ts || (zz.ts = {}));
})(zz || (zz = {}));
window.zz = zz;
/// <reference path="zzHelper.ts" />
/// <reference path="zzTs.ts" />
var zz;
(function (zz) {
    var extension;
    (function (extension) {
        //#region CCC
        cc.Node.prototype.findCom = function (type, ...path) {
            let node = this;
            if (!node)
                return undefined;
            return zz.findCom(type, node, ...path);
        };
        cc.Node.prototype.findNode = function (...path) {
            let node = this;
            if (!node)
                return undefined;
            return zz.findNode(node, ...path);
        };
        //#endregion
        Object.defineProperty(String.prototype, 'replaceAll', {
            enumerable: false,
            value: function (search, replace) {
                let str = this;
                if (str == null)
                    return;
                return str.replace(new RegExp(search, 'g'), replace);
            },
        });
        Object.defineProperty(Array.prototype, 'forEachLeft', {
            enumerable: false,
            value: function (callback) {
                let array = this;
                if (array) {
                    return zz.ts.forEach(array, callback);
                }
                return undefined;
            },
        });
        Object.defineProperty(Array.prototype, 'forEachRight', {
            enumerable: false,
            value: function (callback) {
                let array = this;
                if (array) {
                    return zz.ts.forEachRight(array, callback);
                }
                return undefined;
            },
        });
        Object.defineProperty(Array.prototype, 'intersperse', {
            enumerable: false,
            value: function (element) {
                let array = this;
                if (array) {
                    return zz.ts.intersperse(array, element);
                }
                else {
                    return array;
                }
            },
        });
        Object.defineProperty(Array.prototype, 'countWhere', {
            enumerable: false,
            value: function (predicate) {
                let array = this;
                if (array) {
                    return zz.ts.countWhere(array, predicate);
                }
                else {
                    return 0;
                }
            },
        });
        Object.defineProperty(Array.prototype, 'eleAt', {
            enumerable: false,
            value: function (offset) {
                let array = this;
                return zz.ts.elementAt(array, offset);
            },
        });
        Object.defineProperty(Array.prototype, 'compact', {
            enumerable: false,
            value: function () {
                let array = this;
                return zz.ts.compact(array);
            },
        });
        Object.defineProperty(Array.prototype, 'addRange', {
            enumerable: false,
            value: function (from, start, end) {
                let to = this;
                return zz.ts.addRange(to, from, start, end);
            },
        });
    })(extension = zz.extension || (zz.extension = {}));
})(zz || (zz = {}));
window.zz = zz;
/// <reference path="zzType.ts" />
var zz;
(function (zz) {
    var utils;
    (function (utils) {
        /**打乱字符串 */
        function upsetString(oStr) {
            let orginStr = oStr.split('');
            let len = orginStr.length;
            let result = '';
            let tmp;
            for (let i = len - 1; i > 0; i--) {
                let index = zz.int(len * Math.random()); //随机数的产生范围不变
                //每次与最后一位交换顺序
                tmp = orginStr[index];
                orginStr[index] = orginStr[i];
                orginStr[i] = tmp;
            }
            for (let node of orginStr) {
                result += node;
            }
            return result;
        }
        utils.upsetString = upsetString;
        /**字符串转unicode数字的累加和 */
        function str2Unicode2Number(str) {
            let num = 0;
            for (let i = 0, len = str.length; i < len; i++) {
                let strH = str.charCodeAt(i);
                num += +strH;
            }
            return num;
        }
        utils.str2Unicode2Number = str2Unicode2Number;
        /**
         * 字符串替换; 全体版本;
         * @param target 目标字符串
         * @param search 替换前
         * @param replace 替换后
         */
        function replaceAll(target, search, replace) {
            return target.replace(new RegExp(search, 'g'), replace);
        }
        utils.replaceAll = replaceAll;
        /**夹子; */
        function clamp(val, min, max) {
            if (val > max)
                return max;
            if (val < min)
                return min;
            return val;
        }
        utils.clamp = clamp;
        /**
         * 随机整数,区间[lowerValue,upperValue)
         * @param lowerValue {number} 下区间
         * @param upperValue {number} 上区间;不包括
         * @returns {number} 区间内的随机整数
         */
        function randomInt(lowerValue, upperValue) {
            return Math.floor(Math.random() * (upperValue - lowerValue) + lowerValue);
        }
        utils.randomInt = randomInt;
        /**
         * 获取随机索引号
         * @param arrOrLen 数组或是数组长度
         */
        function randomIndex(arrOrLen) {
            if (typeof arrOrLen == 'number') {
                return randomInt(0, arrOrLen);
            }
            if (arrOrLen instanceof Array) {
                return randomInt(0, arrOrLen.length);
            }
        }
        utils.randomIndex = randomIndex;
        /**
         * 计算随机权重;
         * @param {number[]} weightArr 权重数组
         * @returns {number} 权重数组中所选择的索引号;
         */
        function randomIndexFromWeight(weightArr) {
            let tol = weightArr.reduce((p, c) => p + c, 0);
            let rnd = Math.random() * tol;
            let acc = 0;
            let len = weightArr.length;
            for (let i = 0; i < len; i++) {
                acc += weightArr[i];
                if (rnd < acc)
                    return i;
            }
            return -1;
        }
        utils.randomIndexFromWeight = randomIndexFromWeight;
        /**
         * 随机数组项;
         * @param {T[]} arr 数组
         * @returns {T} 选择的元素; 如果是空数组,返回undefined
         */
        function randomItem(arr) {
            if (arr.length == 0)
                return undefined;
            return arr[randomIndex(arr.length)];
        }
        utils.randomItem = randomItem;
        /**
         * 二维数组转化成一维数组
         * @param arr {T[][]} 目标二维数组
         * @returns {T[]} 展开成的一维数组
         */
        function convertArrayD2toD1(arr) {
            return arr.reduce((p, c) => [...p, ...c], []);
        }
        utils.convertArrayD2toD1 = convertArrayD2toD1;
        /**
         * 一维数组转化成二维数组
         * @param arr {T[]} 一维数组
         * @param col {number} 目标二维数组的列数
         * @returns {T[][]} 二维数组
         */
        function convertArrayD1toD2(arr, col) {
            let len = arr.length;
            if (len % col != 0) {
                throw new Error('传入的二维数组不合格');
            }
            let res = [];
            for (let i = 0; i < len; i++) {
                res.push(arr.slice(i, i + col));
            }
            return res;
        }
        utils.convertArrayD1toD2 = convertArrayD1toD2;
        /**
         * 数组洗牌, 打乱顺序
         * @param arr {T[]} 目标数组
         * @param immutable {boolean} 是否保证原数组不变
         * @returns {T[]} 洗牌后的数组,immutable==true时,为新数组; immutable==false时,为原数组
         */
        function shuffleArray(arr, immutable = true) {
            let len = arr.length;
            let res = immutable ? Array.from(arr) : arr;
            for (let i = 0; i < len; i++) {
                let tar = randomIndex(len);
                [res[i], res[tar]] = [res[tar], res[i]];
            }
            return res;
        }
        utils.shuffleArray = shuffleArray;
        /**
         * 将秒数格式化为XX:XX的形式
         * @param seconds {number} 秒数
         * @returns {string} 格式为XX:XX的字符串
         */
        function formatSeconds(seconds) {
            if (seconds < 0)
                return '00:00';
            let min = zz.int(seconds / 60).toFixed(0);
            let sec = zz.int(seconds % 60).toFixed(0);
            if (min.length == 1)
                min = '0' + min;
            if (sec.length == 1)
                sec = '0' + sec;
            return min + ':' + sec;
        }
        utils.formatSeconds = formatSeconds;
        function getPosInMainCamera(node) {
            let p_w = node.convertToWorldSpaceAR(cc.v2());
            let p_c = cc.Camera.main.node.convertToNodeSpaceAR(p_w);
            return p_c;
        }
        utils.getPosInMainCamera = getPosInMainCamera;
        /**
         * 实例化一个预制体; 异步
         * @param prefab {cc.Prefab | cc.Node} 预制体或节点
         * @returns {Promise<cc.Node>}
         */
        function instantiatePrefab(prefab) {
            return __awaiter(this, void 0, void 0, function* () {
                return yield new Promise(resolve => {
                    if (prefab instanceof cc.Prefab) {
                        let node = cc.instantiate(prefab);
                        resolve(node);
                    }
                    if (prefab instanceof cc.Node) {
                        let node = cc.instantiate(prefab);
                        resolve(node);
                    }
                });
            });
        }
        utils.instantiatePrefab = instantiatePrefab;
        /**
         * 根据名称获取资源bundle
         * @param bundleName {string} bundle名称
         * @returns {Promise<cc.AssetManager.Bundle>}
         */
        function getBundle(bundleName) {
            return __awaiter(this, void 0, void 0, function* () {
                let bundle = cc.assetManager.getBundle(bundleName);
                if (!bundle) {
                    bundle = yield new Promise((resolve, reject) => {
                        cc.assetManager.loadBundle(bundleName, (err, bundle) => {
                            err ? reject(err) : resolve(bundle);
                        });
                    });
                }
                return bundle;
            });
        }
        utils.getBundle = getBundle;
        /**tan(pi/8)的值 */
        const TanOneEighthPi = Math.tan(Math.PI / 8);
        /**
         * 将二维方向向量转化成8个方向的字符串代号
         * @param dir {cc.Vec2} 方向向量
         * @returns {'S' | 'N' | 'E' | 'W' | 'SE' | 'NW' | 'NE' | 'SW'} 八方的字符代号
         */
        function getDirectionOct(dir) {
            let x = dir.x;
            let y = dir.y;
            let t = TanOneEighthPi;
            let r1 = x + y * t;
            let r2 = x - y * t;
            if (r1 < 0 && r2 >= 0)
                return 'S';
            if (r1 >= 0 && r2 < 0)
                return 'N';
            let r3 = t * x + y;
            let r4 = t * x - y;
            if (r3 >= 0 && r4 >= 0)
                return 'E';
            if (r3 < 0 && r4 < 0)
                return 'W';
            let r5 = x + t * y;
            let r6 = x * t + y;
            if (r5 >= 0 && r6 < 0)
                return 'SE';
            if (r5 < 0 && r6 >= 0)
                return 'NW';
            let r7 = x - y * t;
            let r8 = x * t - y;
            if (r7 >= 0 && r8 < 0)
                return 'NE';
            if (r7 < 0 && r8 >= 0)
                return 'SW';
            throw new Error('计算方向时,出现错误');
        }
        utils.getDirectionOct = getDirectionOct;
    })(utils = zz.utils || (zz.utils = {}));
})(zz || (zz = {}));
window.zz = zz;
/// <reference path="zzUtils.ts" />
var zz;
(function (zz) {
    const farPos = cc.v3(10000, 10000, 0);
    class NdPool {
        constructor(rootNd, prefab, defaultNum = 10) {
            this.rootNd = undefined;
            this.prefab = undefined;
            this.defaultNum = 10;
            /**true-可用,未借出; false-不可用,已借出 */
            // poolMap: Map<cc.Node, boolean> = new Map<cc.Node, boolean>();
            this.poolLeft = new Array();
            this.poolOut = new Array();
            this.rootNd = rootNd;
            this.prefab = prefab;
            this.defaultNum = defaultNum;
            this.initPool();
        }
        initPool() {
            return __awaiter(this, void 0, void 0, function* () {
                for (let i = 0; i < this.defaultNum; i++) {
                    let node = yield zz.utils.instantiatePrefab(this.prefab);
                    node.parent = this.rootNd;
                    this.poolLeft.push(node);
                    this.setActive(node, false);
                }
                // zz.log('[Pool] init complete!');
            });
        }
        /**异步方法 */
        borrowFromPoolAsync() {
            return __awaiter(this, void 0, void 0, function* () {
                let node = this.poolLeft.pop();
                if (node) {
                    node.parent = this.rootNd;
                    this.setActive(node, true);
                    return node;
                }
                else {
                    node = yield zz.utils.instantiatePrefab(this.prefab);
                    node.parent = this.rootNd;
                    this.setActive(node, true);
                    return node;
                }
            });
        }
        /**同步方法 */
        borrowFromPoolSync() {
            let node = this.poolLeft.pop();
            if (!node) {
                node = cc.instantiate(this.prefab);
                node.parent = this.rootNd;
            }
            node.parent = this.rootNd;
            this.setActive(node, true);
            return node;
        }
        returnBackToPool(node) {
            this.setActive(node, false);
            this.poolLeft.push(node);
        }
        returnAllNode() {
            this.poolOut.forEach(v => {
                this.returnBackToPool(v);
            });
            this.poolOut = [];
        }
        releasePool() {
            this.returnAllNode();
            this.poolLeft.forEach(v => {
                v.parent = null;
                v.destroy();
            });
            this.poolLeft = new Array();
        }
        setActive(node, active) {
            if (active) {
                this.poolOut.push(node);
                node.opacity = 255;
            }
            else {
                node.opacity = 0;
                node.position = cc.v3(farPos);
            }
        }
    }
    zz.NdPool = NdPool;
    class RandomNodePool {
        constructor(rootNd, prefabs, defaultNum = 2) {
            this.rootNd = undefined;
            this.defaultNum = 2;
            this.prefabs = [];
            this.poolLeft = new Array();
            this.poolOut = new Array();
            this.rootNd = rootNd;
            this.prefabs = prefabs;
            this.defaultNum = defaultNum;
            this.initPool();
        }
        initPool() {
            return __awaiter(this, void 0, void 0, function* () {
                for (let i = 0; i < this.defaultNum; i++) {
                    let rndPrefab = this.selectRandomPrefab();
                    let node = yield zz.utils.instantiatePrefab(rndPrefab);
                    node.parent = this.rootNd;
                    this.poolLeft.push(node);
                    this.setActive(node, false);
                }
            });
        }
        selectRandomPrefab() {
            return zz.utils.randomItem(this.prefabs);
        }
        borrowFromPool() {
            return __awaiter(this, void 0, void 0, function* () {
                let node = this.poolLeft.pop();
                if (node) {
                    this.setActive(node, true);
                    return node;
                }
                else {
                    let rndPrefab = this.selectRandomPrefab();
                    node = yield zz.utils.instantiatePrefab(rndPrefab);
                    node.parent = this.rootNd;
                    this.setActive(node, true);
                    return node;
                }
            });
        }
        /**同步方法 */
        borrowFromPoolSync() {
            let node = this.poolLeft.pop();
            if (!node) {
                let rndPrefb = this.selectRandomPrefab();
                node = cc.instantiate(rndPrefb);
                node.parent = this.rootNd;
            }
            node.parent = this.rootNd;
            this.setActive(node, true);
            return node;
        }
        returnBackToPool(node) {
            this.setActive(node, false);
            this.poolLeft.push(node);
        }
        returnAllNode() {
            this.poolOut.forEach(v => {
                this.returnBackToPool(v);
            });
            this.poolOut = [];
        }
        releasePool() {
            this.returnAllNode();
            this.poolLeft.forEach(v => {
                v.parent = undefined;
                v.destroy();
            });
            this.poolLeft = new Array();
        }
        setActive(node, active) {
            if (active) {
                this.poolOut.push(node);
                node.opacity = 255;
            }
            else {
                node.opacity = 0;
                node.position = cc.v3(farPos);
            }
        }
    }
    zz.RandomNodePool = RandomNodePool;
})(zz || (zz = {}));
window.zz = zz;
/// <reference path="zzLog.ts" />
var zz;
(function (zz) {
    /**流程管理;一条单通道管线 */
    class ProcedureMgr {
        constructor() {
            this.procedureMap = new Map();
            this.curProcedure = undefined;
        }
        get currentProcedure() {
            return this.curProcedure;
        }
        setProcedure(procName, procedure) {
            this.procedureMap.set(procName, procedure);
        }
        init(firstProc) {
            if (this.procedureMap.has(firstProc)) {
                this.curProcedure = firstProc;
                this.procedureMap.get(firstProc).onStart();
            }
        }
        changeProcedure(procName) {
            if (this.procedureMap.has(procName)) {
                this.procedureMap.get(this.curProcedure).onLeave();
                this.curProcedure = procName;
                this.procedureMap.get(procName).onStart();
            }
            else {
                zz.error('[changeProcedure] 不存在' + procName);
            }
        }
    }
    class ProcBase {
    }
    zz.ProcBase = ProcBase;
    /**流程管理 */
    zz.proc = new ProcedureMgr();
})(zz || (zz = {}));
var zz;
(function (zz) {
    let util;
    (function (util) {
        const _hasOwnProperty = Object.prototype.hasOwnProperty;
        util.has = function (obj, prop) {
            return _hasOwnProperty.call(obj, prop);
        };
        /**
         * Default function to compare element order.
         * @function
         */
        function defaultCompare(a, b) {
            if (a < b) {
                return -1;
            }
            else if (a === b) {
                return 0;
            }
            else {
                return 1;
            }
        }
        util.defaultCompare = defaultCompare;
        /**
         * Default function to test equality.
         * @function
         */
        function defaultEquals(a, b) {
            return a === b;
        }
        util.defaultEquals = defaultEquals;
        /**
         * Default function to convert an object to a string.
         * @function
         */
        function defaultToString(item) {
            if (item === null) {
                return 'COLLECTION_NULL';
            }
            else if (isUndefined(item)) {
                return 'COLLECTION_UNDEFINED';
            }
            else if (isString(item)) {
                return '$s' + item;
            }
            else {
                return '$o' + item.toString();
            }
        }
        util.defaultToString = defaultToString;
        /**
         * Joins all the properies of the object using the provided join string
         */
        function makeString(item, join = ',') {
            if (item === null) {
                return 'COLLECTION_NULL';
            }
            else if (isUndefined(item)) {
                return 'COLLECTION_UNDEFINED';
            }
            else if (isString(item)) {
                return item.toString();
            }
            else {
                let toret = '{';
                let first = true;
                for (const prop in item) {
                    if (util.has(item, prop)) {
                        if (first) {
                            first = false;
                        }
                        else {
                            toret = toret + join;
                        }
                        toret = toret + prop + ':' + item[prop];
                    }
                }
                return toret + '}';
            }
        }
        util.makeString = makeString;
        /**
         * Checks if the given argument is a function.
         * @function
         */
        function isFunction(func) {
            return typeof func === 'function';
        }
        util.isFunction = isFunction;
        /**
         * Checks if the given argument is undefined.
         * @function
         */
        function isUndefined(obj) {
            return typeof obj === 'undefined';
        }
        util.isUndefined = isUndefined;
        /**
         * Checks if the given argument is a string.
         * @function
         */
        function isString(obj) {
            return Object.prototype.toString.call(obj) === '[object String]';
        }
        util.isString = isString;
        /**
         * Reverses a compare function.
         * @function
         */
        function reverseCompareFunction(compareFunction) {
            if (!isFunction(compareFunction)) {
                return function (a, b) {
                    if (a < b) {
                        return 1;
                    }
                    else if (a === b) {
                        return 0;
                    }
                    else {
                        return -1;
                    }
                };
            }
            else {
                return function (d, v) {
                    return compareFunction(d, v) * -1;
                };
            }
        }
        util.reverseCompareFunction = reverseCompareFunction;
        /**
         * Returns an equal function given a compare function.
         * @function
         */
        function compareToEquals(compareFunction) {
            return function (a, b) {
                return compareFunction(a, b) === 0;
            };
        }
        util.compareToEquals = compareToEquals;
    })(util || (util = {}));
    let arrays;
    (function (arrays) {
        /**
         * Returns the position of the first occurrence of the specified item
         * within the specified array.4
         * @param {*} array the array in which to search the element.
         * @param {Object} item the element to search.
         * @param {function(Object,Object):boolean=} equalsFunction optional function used to
         * check equality between 2 elements.
         * @return {number} the position of the first occurrence of the specified element
         * within the specified array, or -1 if not found.
         */
        function indexOf(array, item, equalsFunction) {
            const equals = equalsFunction || util.defaultEquals;
            const length = array.length;
            for (let i = 0; i < length; i++) {
                if (equals(array[i], item)) {
                    return i;
                }
            }
            return -1;
        }
        arrays.indexOf = indexOf;
        /**
         * Returns the position of the last occurrence of the specified element
         * within the specified array.
         * @param {*} array the array in which to search the element.
         * @param {Object} item the element to search.
         * @param {function(Object,Object):boolean=} equalsFunction optional function used to
         * check equality between 2 elements.
         * @return {number} the position of the last occurrence of the specified element
         * within the specified array or -1 if not found.
         */
        function lastIndexOf(array, item, equalsFunction) {
            const equals = equalsFunction || util.defaultEquals;
            const length = array.length;
            for (let i = length - 1; i >= 0; i--) {
                if (equals(array[i], item)) {
                    return i;
                }
            }
            return -1;
        }
        arrays.lastIndexOf = lastIndexOf;
        /**
         * Returns true if the specified array contains the specified element.
         * @param {*} array the array in which to search the element.
         * @param {Object} item the element to search.
         * @param {function(Object,Object):boolean=} equalsFunction optional function to
         * check equality between 2 elements.
         * @return {boolean} true if the specified array contains the specified element.
         */
        function contains(array, item, equalsFunction) {
            return indexOf(array, item, equalsFunction) >= 0;
        }
        arrays.contains = contains;
        /**
         * Removes the first ocurrence of the specified element from the specified array.
         * @param {*} array the array in which to search element.
         * @param {Object} item the element to search.
         * @param {function(Object,Object):boolean=} equalsFunction optional function to
         * check equality between 2 elements.
         * @return {boolean} true if the array changed after this call.
         */
        function remove(array, item, equalsFunction) {
            const index = indexOf(array, item, equalsFunction);
            if (index < 0) {
                return false;
            }
            array.splice(index, 1);
            return true;
        }
        arrays.remove = remove;
        /**
         * Returns the number of elements in the specified array equal
         * to the specified object.
         * @param {Array} array the array in which to determine the frequency of the element.
         * @param {Object} item the element whose frequency is to be determined.
         * @param {function(Object,Object):boolean=} equalsFunction optional function used to
         * check equality between 2 elements.
         * @return {number} the number of elements in the specified array
         * equal to the specified object.
         */
        function frequency(array, item, equalsFunction) {
            const equals = equalsFunction || util.defaultEquals;
            const length = array.length;
            let freq = 0;
            for (let i = 0; i < length; i++) {
                if (equals(array[i], item)) {
                    freq++;
                }
            }
            return freq;
        }
        arrays.frequency = frequency;
        /**
         * Returns true if the two specified arrays are equal to one another.
         * Two arrays are considered equal if both arrays contain the same number
         * of elements, and all corresponding pairs of elements in the two
         * arrays are equal and are in the same order.
         * @param {Array} array1 one array to be tested for equality.
         * @param {Array} array2 the other array to be tested for equality.
         * @param {function(Object,Object):boolean=} equalsFunction optional function used to
         * check equality between elemements in the arrays.
         * @return {boolean} true if the two arrays are equal
         */
        function equals(array1, array2, equalsFunction) {
            const equals = equalsFunction || util.defaultEquals;
            if (array1.length !== array2.length) {
                return false;
            }
            const length = array1.length;
            for (let i = 0; i < length; i++) {
                if (!equals(array1[i], array2[i])) {
                    return false;
                }
            }
            return true;
        }
        arrays.equals = equals;
        /**
         * Returns shallow a copy of the specified array.
         * @param {*} array the array to copy.
         * @return {Array} a copy of the specified array
         */
        function copy(array) {
            return array.concat();
        }
        arrays.copy = copy;
        /**
         * Swaps the elements at the specified positions in the specified array.
         * @param {Array} array The array in which to swap elements.
         * @param {number} i the index of one element to be swapped.
         * @param {number} j the index of the other element to be swapped.
         * @return {boolean} true if the array is defined and the indexes are valid.
         */
        function swap(array, i, j) {
            if (i < 0 || i >= array.length || j < 0 || j >= array.length) {
                return false;
            }
            const temp = array[i];
            array[i] = array[j];
            array[j] = temp;
            return true;
        }
        arrays.swap = swap;
        function toString(array) {
            return '[' + array.toString() + ']';
        }
        arrays.toString = toString;
        /**
         * Executes the provided function once for each element present in this array
         * starting from index 0 to length - 1.
         * @param {Array} array The array in which to iterate.
         * @param {function(Object):*} callback function to execute, it is
         * invoked with one argument: the element value, to break the iteration you can
         * optionally return false.
         */
        function forEach(array, callback) {
            for (const ele of array) {
                if (callback(ele) === false) {
                    return;
                }
            }
        }
        arrays.forEach = forEach;
    })(arrays = zz.arrays || (zz.arrays = {}));
    class Dictionary {
        /**
         * Creates an empty dictionary.
         * @class <p>Dictionaries map keys to values; each key can map to at most one value.
         * This implementation accepts any kind of objects as keys.</p>
         *
         * <p>If the keys are custom objects a function which converts keys to unique
         * strings must be provided. Example:</p>
         * <pre>
         * function petToString(pet) {
         *  return pet.name;
         * }
         * </pre>
         * @constructor
         * @param {function(Object):string=} toStrFunction optional function used
         * to convert keys to strings. If the keys aren't strings or if toString()
         * is not appropriate, a custom function which receives a key and returns a
         * unique string must be provided.
         */
        constructor(toStrFunction) {
            this.table = {};
            this.nElements = 0;
            this.toStr = toStrFunction || util.defaultToString;
        }
        /**
         * Returns the value to which this dictionary maps the specified key.
         * Returns undefined if this dictionary contains no mapping for this key.
         * @param {Object} key key whose associated value is to be returned.
         * @return {*} the value to which this dictionary maps the specified key or
         * undefined if the map contains no mapping for this key.
         */
        getValue(key) {
            const pair = this.table['$' + this.toStr(key)];
            if (util.isUndefined(pair)) {
                return undefined;
            }
            return pair.value;
        }
        /**
         * Associates the specified value with the specified key in this dictionary.
         * If the dictionary previously contained a mapping for this key, the old
         * value is replaced by the specified value.
         * @param {Object} key key with which the specified value is to be
         * associated.
         * @param {Object} value value to be associated with the specified key.
         * @return {*} previous value associated with the specified key, or undefined if
         * there was no mapping for the key or if the key/value are undefined.
         */
        setValue(key, value) {
            if (util.isUndefined(key) || util.isUndefined(value)) {
                return undefined;
            }
            let ret;
            const k = '$' + this.toStr(key);
            const previousElement = this.table[k];
            if (util.isUndefined(previousElement)) {
                this.nElements++;
                ret = undefined;
            }
            else {
                ret = previousElement.value;
            }
            this.table[k] = {
                key: key,
                value: value,
            };
            return ret;
        }
        /**
         * Removes the mapping for this key from this dictionary if it is present.
         * @param {Object} key key whose mapping is to be removed from the
         * dictionary.
         * @return {*} previous value associated with specified key, or undefined if
         * there was no mapping for key.
         */
        remove(key) {
            const k = '$' + this.toStr(key);
            const previousElement = this.table[k];
            if (!util.isUndefined(previousElement)) {
                delete this.table[k];
                this.nElements--;
                return previousElement.value;
            }
            return undefined;
        }
        /**
         * Returns an array containing all of the keys in this dictionary.
         * @return {Array} an array containing all of the keys in this dictionary.
         */
        keys() {
            const array = [];
            for (const name in this.table) {
                if (util.has(this.table, name)) {
                    const pair = this.table[name];
                    array.push(pair.key);
                }
            }
            return array;
        }
        /**
         * Returns an array containing all of the values in this dictionary.
         * @return {Array} an array containing all of the values in this dictionary.
         */
        values() {
            const array = [];
            for (const name in this.table) {
                if (util.has(this.table, name)) {
                    const pair = this.table[name];
                    array.push(pair.value);
                }
            }
            return array;
        }
        /**
         * Executes the provided function once for each key-value pair
         * present in this dictionary.
         * @param {function(Object,Object):*} callback function to execute, it is
         * invoked with two arguments: key and value. To break the iteration you can
         * optionally return false.
         */
        forEach(callback) {
            for (const name in this.table) {
                if (util.has(this.table, name)) {
                    const pair = this.table[name];
                    const ret = callback(pair.key, pair.value);
                    if (ret === false) {
                        return;
                    }
                }
            }
        }
        /**
         * Returns true if this dictionary contains a mapping for the specified key.
         * @param {Object} key key whose presence in this dictionary is to be
         * tested.
         * @return {boolean} true if this dictionary contains a mapping for the
         * specified key.
         */
        containsKey(key) {
            let a = this.getValue(key);
            return !util.isUndefined(this.getValue(key));
        }
        /**
         * Removes all mappings from this dictionary.
         * @this {util.Dictionary}
         */
        clear() {
            this.table = {};
            this.nElements = 0;
        }
        /**
         * Returns the number of keys in this dictionary.
         * @return {number} the number of key-value mappings in this dictionary.
         */
        size() {
            return this.nElements;
        }
        /**
         * Returns true if this dictionary contains no mappings.
         * @return {boolean} true if this dictionary contains no mappings.
         */
        isEmpty() {
            return this.nElements <= 0;
        }
        toString() {
            let toret = '{';
            this.forEach((k, v) => {
                toret += `\n\t${k} : ${v}`;
            });
            return toret + '\n}';
        }
    }
    zz.Dictionary = Dictionary;
    class LinkedList {
        /**
         * Creates an empty Linked List.
         * @class A linked list is a data structure consisting of a group of nodes
         * which together represent a sequence.
         * @constructor
         */
        constructor() {
            /**
             * First node in the list
             * @type {Object}
             * @private
             */
            this.firstNode = null;
            /**
             * Last node in the list
             * @type {Object}
             * @private
             */
            this.lastNode = null;
            /**
             * Number of elements in the list
             * @type {number}
             * @private
             */
            this.nElements = 0;
        }
        /**
         * Adds an element to this list.
         * @param {Object} item element to be added.
         * @param {number=} index optional index to add the element. If no index is specified
         * the element is added to the end of this list.
         * @return {boolean} true if the element was added or false if the index is invalid
         * or if the element is undefined.
         */
        add(item, index) {
            if (util.isUndefined(index)) {
                index = this.nElements;
            }
            if (index < 0 || index > this.nElements || util.isUndefined(item)) {
                return false;
            }
            const newNode = this.createNode(item);
            if (this.nElements === 0) {
                // First node in the list.
                this.firstNode = newNode;
                this.lastNode = newNode;
            }
            else if (index === this.nElements) {
                // Insert at the end.
                this.lastNode.next = newNode;
                this.lastNode = newNode;
            }
            else if (index === 0) {
                // Change first node.
                newNode.next = this.firstNode;
                this.firstNode = newNode;
            }
            else {
                const prev = this.nodeAtIndex(index - 1);
                newNode.next = prev.next;
                prev.next = newNode;
            }
            this.nElements++;
            return true;
        }
        /**
         * Returns the first element in this list.
         * @return {*} the first element of the list or undefined if the list is
         * empty.
         */
        first() {
            if (this.firstNode !== null) {
                return this.firstNode.element;
            }
            return undefined;
        }
        /**
         * Returns the last element in this list.
         * @return {*} the last element in the list or undefined if the list is
         * empty.
         */
        last() {
            if (this.lastNode !== null) {
                return this.lastNode.element;
            }
            return undefined;
        }
        /**
         * Returns the element at the specified position in this list.
         * @param {number} index desired index.
         * @return {*} the element at the given index or undefined if the index is
         * out of bounds.
         */
        elementAtIndex(index) {
            const node = this.nodeAtIndex(index);
            if (node === null) {
                return undefined;
            }
            return node.element;
        }
        /**
         * Returns the index in this list of the first occurrence of the
         * specified element, or -1 if the List does not contain this element.
         * <p>If the elements inside this list are
         * not comparable with the === operator a custom equals function should be
         * provided to perform searches, the function must receive two arguments and
         * return true if they are equal, false otherwise. Example:</p>
         *
         * <pre>
         * const petsAreEqualByName = function(pet1, pet2) {
         *  return pet1.name === pet2.name;
         * }
         * </pre>
         * @param {Object} item element to search for.
         * @param {function(Object,Object):boolean=} equalsFunction Optional
         * function used to check if two elements are equal.
         * @return {number} the index in this list of the first occurrence
         * of the specified element, or -1 if this list does not contain the
         * element.
         */
        indexOf(item, equalsFunction) {
            const equalsF = equalsFunction || util.defaultEquals;
            if (util.isUndefined(item)) {
                return -1;
            }
            let currentNode = this.firstNode;
            let index = 0;
            while (currentNode !== null) {
                if (equalsF(currentNode.element, item)) {
                    return index;
                }
                index++;
                currentNode = currentNode.next;
            }
            return -1;
        }
        /**
         * Returns true if this list contains the specified element.
         * <p>If the elements inside the list are
         * not comparable with the === operator a custom equals function should be
         * provided to perform searches, the function must receive two arguments and
         * return true if they are equal, false otherwise. Example:</p>
         *
         * <pre>
         * const petsAreEqualByName = function(pet1, pet2) {
         *  return pet1.name === pet2.name;
         * }
         * </pre>
         * @param {Object} item element to search for.
         * @param {function(Object,Object):boolean=} equalsFunction Optional
         * function used to check if two elements are equal.
         * @return {boolean} true if this list contains the specified element, false
         * otherwise.
         */
        contains(item, equalsFunction) {
            return this.indexOf(item, equalsFunction) >= 0;
        }
        /**
         * Removes the first occurrence of the specified element in this list.
         * <p>If the elements inside the list are
         * not comparable with the === operator a custom equals function should be
         * provided to perform searches, the function must receive two arguments and
         * return true if they are equal, false otherwise. Example:</p>
         *
         * <pre>
         * const petsAreEqualByName = function(pet1, pet2) {
         *  return pet1.name === pet2.name;
         * }
         * </pre>
         * @param {Object} item element to be removed from this list, if present.
         * @return {boolean} true if the list contained the specified element.
         */
        remove(item, equalsFunction) {
            const equalsF = equalsFunction || util.defaultEquals;
            if (this.nElements < 1 || util.isUndefined(item)) {
                return false;
            }
            let previous = null;
            let currentNode = this.firstNode;
            while (currentNode !== null) {
                if (equalsF(currentNode.element, item)) {
                    if (currentNode === this.firstNode) {
                        this.firstNode = this.firstNode.next;
                        if (currentNode === this.lastNode) {
                            this.lastNode = null;
                        }
                    }
                    else if (currentNode === this.lastNode) {
                        this.lastNode = previous;
                        previous.next = currentNode.next;
                        currentNode.next = null;
                    }
                    else {
                        previous.next = currentNode.next;
                        currentNode.next = null;
                    }
                    this.nElements--;
                    return true;
                }
                previous = currentNode;
                currentNode = currentNode.next;
            }
            return false;
        }
        /**
         * Removes all of the elements from this list.
         */
        clear() {
            this.firstNode = null;
            this.lastNode = null;
            this.nElements = 0;
        }
        /**
         * Returns true if this list is equal to the given list.
         * Two lists are equal if they have the same elements in the same order.
         * @param {LinkedList} other the other list.
         * @param {function(Object,Object):boolean=} equalsFunction optional
         * function used to check if two elements are equal. If the elements in the lists
         * are custom objects you should provide a function, otherwise
         * the === operator is used to check equality between elements.
         * @return {boolean} true if this list is equal to the given list.
         */
        equals(other, equalsFunction) {
            const eqF = equalsFunction || util.defaultEquals;
            if (!(other instanceof LinkedList)) {
                return false;
            }
            if (this.size() !== other.size()) {
                return false;
            }
            return this.equalsAux(this.firstNode, other.firstNode, eqF);
        }
        /**
         * @private
         */
        equalsAux(n1, n2, eqF) {
            while (n1 !== null) {
                if (!eqF(n1.element, n2.element)) {
                    return false;
                }
                n1 = n1.next;
                n2 = n2.next;
            }
            return true;
        }
        /**
         * Removes the element at the specified position in this list.
         * @param {number} index given index.
         * @return {*} removed element or undefined if the index is out of bounds.
         */
        removeElementAtIndex(index) {
            if (index < 0 || index >= this.nElements) {
                return undefined;
            }
            let element;
            if (this.nElements === 1) {
                //First node in the list.
                element = this.firstNode.element;
                this.firstNode = null;
                this.lastNode = null;
            }
            else {
                const previous = this.nodeAtIndex(index - 1);
                if (previous === null) {
                    element = this.firstNode.element;
                    this.firstNode = this.firstNode.next;
                }
                else if (previous.next === this.lastNode) {
                    element = this.lastNode.element;
                    this.lastNode = previous;
                }
                if (previous !== null) {
                    element = previous.next.element;
                    previous.next = previous.next.next;
                }
            }
            this.nElements--;
            return element;
        }
        /**
         * Executes the provided function once for each element present in this list in order.
         * @param {function(Object):*} callback function to execute, it is
         * invoked with one argument: the element value, to break the iteration you can
         * optionally return false.
         */
        forEach(callback) {
            let currentNode = this.firstNode;
            while (currentNode !== null) {
                if (callback(currentNode.element) === false) {
                    break;
                }
                currentNode = currentNode.next;
            }
        }
        /**
         * Reverses the order of the elements in this linked list (makes the last
         * element first, and the first element last).
         */
        reverse() {
            let previous = null;
            let current = this.firstNode;
            let temp = null;
            while (current !== null) {
                temp = current.next;
                current.next = previous;
                previous = current;
                current = temp;
            }
            temp = this.firstNode;
            this.firstNode = this.lastNode;
            this.lastNode = temp;
        }
        /**
         * Returns an array containing all of the elements in this list in proper
         * sequence.
         * @return {Array.<*>} an array containing all of the elements in this list,
         * in proper sequence.
         */
        toArray() {
            const array = [];
            let currentNode = this.firstNode;
            while (currentNode !== null) {
                array.push(currentNode.element);
                currentNode = currentNode.next;
            }
            return array;
        }
        /**
         * Returns the number of elements in this list.
         * @return {number} the number of elements in this list.
         */
        size() {
            return this.nElements;
        }
        /**
         * Returns true if this list contains no elements.
         * @return {boolean} true if this list contains no elements.
         */
        isEmpty() {
            return this.nElements <= 0;
        }
        toString() {
            return arrays.toString(this.toArray());
        }
        /**
         * @private
         */
        nodeAtIndex(index) {
            if (index < 0 || index >= this.nElements) {
                return null;
            }
            if (index === this.nElements - 1) {
                return this.lastNode;
            }
            let node = this.firstNode;
            for (let i = 0; i < index; i++) {
                node = node.next;
            }
            return node;
        }
        /**
         * @private
         */
        createNode(item) {
            return {
                element: item,
                next: null,
            };
        }
    }
    zz.LinkedList = LinkedList;
    /**MinHeap default; MaxHeap for reverseComparison */
    class Heap {
        /**
         * Creates an empty Heap.
         * @class
         * <p>A heap is a binary tree, where the nodes maintain the heap property:
         * each node is smaller than each of its children and therefore a MinHeap
         * This implementation uses an array to store elements.</p>
         * <p>If the inserted elements are custom objects a compare function must be provided,
         *  at construction time, otherwise the <=, === and >= operators are
         * used to compare elements. Example:</p>
         *
         * <pre>
         * function compare(a, b) {
         *  if (a is less than b by some ordering criterion) {
         *     return -1;
         *  } if (a is greater than b by the ordering criterion) {
         *     return 1;
         *  }
         *  // a must be equal to b
         *  return 0;
         * }
         * </pre>
         *
         * <p>If a Max-Heap is wanted (greater elements on top) you can a provide a
         * reverse compare function to accomplish that behavior. Example:</p>
         *
         * <pre>
         * function reverseCompare(a, b) {
         *  if (a is less than b by some ordering criterion) {
         *     return 1;
         *  } if (a is greater than b by the ordering criterion) {
         *     return -1;
         *  }
         *  // a must be equal to b
         *  return 0;
         * }
         * </pre>
         *
         * @constructor
         * @param {function(Object,Object):number=} compareFunction optional
         * function used to compare two elements. Must return a negative integer,
         * zero, or a positive integer as the first argument is less than, equal to,
         * or greater than the second.
         */
        constructor(compareFunction) {
            /**
             * Array used to store the elements od the heap.
             * @type {Array.<Object>}
             * @private
             */
            this.data = [];
            this.compare = compareFunction || util.defaultCompare;
        }
        /**
         * Returns the index of the left child of the node at the given index.
         * @param {number} nodeIndex The index of the node to get the left child
         * for.
         * @return {number} The index of the left child.
         * @private
         */
        leftChildIndex(nodeIndex) {
            return 2 * nodeIndex + 1;
        }
        /**
         * Returns the index of the right child of the node at the given index.
         * @param {number} nodeIndex The index of the node to get the right child
         * for.
         * @return {number} The index of the right child.
         * @private
         */
        rightChildIndex(nodeIndex) {
            return 2 * nodeIndex + 2;
        }
        /**
         * Returns the index of the parent of the node at the given index.
         * @param {number} nodeIndex The index of the node to get the parent for.
         * @return {number} The index of the parent.
         * @private
         */
        parentIndex(nodeIndex) {
            return Math.floor((nodeIndex - 1) / 2);
        }
        /**
         * Returns the index of the smaller child node (if it exists).
         * @param {number} leftChild left child index.
         * @param {number} rightChild right child index.
         * @return {number} the index with the minimum value or -1 if it doesn't
         * exists.
         * @private
         */
        minIndex(leftChild, rightChild) {
            if (rightChild >= this.data.length) {
                if (leftChild >= this.data.length) {
                    return -1;
                }
                else {
                    return leftChild;
                }
            }
            else {
                if (this.compare(this.data[leftChild], this.data[rightChild]) <= 0) {
                    return leftChild;
                }
                else {
                    return rightChild;
                }
            }
        }
        /**
         * Moves the node at the given index up to its proper place in the heap.
         * @param {number} index The index of the node to move up.
         * @private
         */
        siftUp(index) {
            let parent = this.parentIndex(index);
            while (index > 0 &&
                this.compare(this.data[parent], this.data[index]) > 0) {
                arrays.swap(this.data, parent, index);
                index = parent;
                parent = this.parentIndex(index);
            }
        }
        /**
         * Moves the node at the given index down to its proper place in the heap.
         * @param {number} nodeIndex The index of the node to move down.
         * @private
         */
        siftDown(nodeIndex) {
            //smaller child index
            let min = this.minIndex(this.leftChildIndex(nodeIndex), this.rightChildIndex(nodeIndex));
            while (min >= 0 &&
                this.compare(this.data[nodeIndex], this.data[min]) > 0) {
                arrays.swap(this.data, min, nodeIndex);
                nodeIndex = min;
                min = this.minIndex(this.leftChildIndex(nodeIndex), this.rightChildIndex(nodeIndex));
            }
        }
        /**
         * Retrieves but does not remove the root element of this heap.
         * @return {*} The value at the root of the heap. Returns undefined if the
         * heap is empty.
         */
        peek() {
            if (this.data.length > 0) {
                return this.data[0];
            }
            else {
                return undefined;
            }
        }
        /**
         * Adds the given element into the heap.
         * @param {*} element the element.
         * @return true if the element was added or fals if it is undefined.
         */
        add(element) {
            if (util.isUndefined(element)) {
                return undefined;
            }
            this.data.push(element);
            this.siftUp(this.data.length - 1);
            return true;
        }
        /**
         * Retrieves and removes the root element of this heap.
         * @return {*} The value removed from the root of the heap. Returns
         * undefined if the heap is empty.
         */
        removeRoot() {
            if (this.data.length > 0) {
                const obj = this.data[0];
                this.data[0] = this.data[this.data.length - 1];
                this.data.splice(this.data.length - 1, 1);
                if (this.data.length > 0) {
                    this.siftDown(0);
                }
                return obj;
            }
            return undefined;
        }
        /**
         * Returns true if this heap contains the specified element.
         * @param {Object} element element to search for.
         * @return {boolean} true if this Heap contains the specified element, false
         * otherwise.
         */
        contains(element) {
            const equF = util.compareToEquals(this.compare);
            return arrays.contains(this.data, element, equF);
        }
        /**
         * Returns the number of elements in this heap.
         * @return {number} the number of elements in this heap.
         */
        size() {
            return this.data.length;
        }
        /**
         * Checks if this heap is empty.
         * @return {boolean} true if and only if this heap contains no items; false
         * otherwise.
         */
        isEmpty() {
            return this.data.length <= 0;
        }
        /**
         * Removes all of the elements from this heap.
         */
        clear() {
            this.data.length = 0;
        }
        /**
         * Executes the provided function once for each element present in this heap in
         * no particular order.
         * @param {function(Object):*} callback function to execute, it is
         * invoked with one argument: the element value, to break the iteration you can
         * optionally return false.
         */
        forEach(callback) {
            arrays.forEach(this.data, callback);
        }
    }
    zz.Heap = Heap;
    class Set {
        /**
         * Creates an empty set.
         * @class <p>A set is a data structure that contains no duplicate items.</p>
         * <p>If the inserted elements are custom objects a function
         * which converts elements to strings must be provided. Example:</p>
         *
         * <pre>
         * function petToString(pet) {
         *  return pet.name;
         * }
         * </pre>
         *
         * @constructor
         * @param {function(Object):string=} toStringFunction optional function used
         * to convert elements to strings. If the elements aren't strings or if toString()
         * is not appropriate, a custom function which receives a onject and returns a
         * unique string must be provided.
         */
        constructor(toStringFunction) {
            this.dictionary = new Dictionary(toStringFunction);
        }
        /**
         * Returns true if this set contains the specified element.
         * @param {Object} element element to search for.
         * @return {boolean} true if this set contains the specified element,
         * false otherwise.
         */
        contains(element) {
            return this.dictionary.containsKey(element);
        }
        /**
         * Adds the specified element to this set if it is not already present.
         * @param {Object} element the element to insert.
         * @return {boolean} true if this set did not already contain the specified element.
         */
        add(element) {
            if (this.contains(element) || util.isUndefined(element)) {
                return false;
            }
            else {
                this.dictionary.setValue(element, element);
                return true;
            }
        }
        /**
         * Performs an intersecion between this an another set.
         * Removes all values that are not present this set and the given set.
         * @param {collections.Set} otherSet other set.
         */
        intersection(otherSet) {
            const set = this;
            this.forEach(function (element) {
                if (!otherSet.contains(element)) {
                    set.remove(element);
                }
                return true;
            });
        }
        /**
         * Performs a union between this an another set.
         * Adds all values from the given set to this set.
         * @param {collections.Set} otherSet other set.
         */
        union(otherSet) {
            const set = this;
            otherSet.forEach(function (element) {
                set.add(element);
                return true;
            });
        }
        /**
         * Performs a difference between this an another set.
         * Removes from this set all the values that are present in the given set.
         * @param {collections.Set} otherSet other set.
         */
        difference(otherSet) {
            const set = this;
            otherSet.forEach(function (element) {
                set.remove(element);
                return true;
            });
        }
        /**
         * Checks whether the given set contains all the elements in this set.
         * @param {collections.Set} otherSet other set.
         * @return {boolean} true if this set is a subset of the given set.
         */
        isSubsetOf(otherSet) {
            if (this.size() > otherSet.size()) {
                return false;
            }
            let isSub = true;
            this.forEach(function (element) {
                if (!otherSet.contains(element)) {
                    isSub = false;
                    return false;
                }
                return true;
            });
            return isSub;
        }
        /**
         * Removes the specified element from this set if it is present.
         * @return {boolean} true if this set contained the specified element.
         */
        remove(element) {
            if (!this.contains(element)) {
                return false;
            }
            else {
                this.dictionary.remove(element);
                return true;
            }
        }
        /**
         * Executes the provided function once for each element
         * present in this set.
         * @param {function(Object):*} callback function to execute, it is
         * invoked with one arguments: the element. To break the iteration you can
         * optionally return false.
         */
        forEach(callback) {
            this.dictionary.forEach(function (k, v) {
                return callback(v);
            });
        }
        /**
         * Returns an array containing all of the elements in this set in arbitrary order.
         * @return {Array} an array containing all of the elements in this set.
         */
        toArray() {
            return this.dictionary.values();
        }
        /**
         * Returns true if this set contains no elements.
         * @return {boolean} true if this set contains no elements.
         */
        isEmpty() {
            return this.dictionary.isEmpty();
        }
        /**
         * Returns the number of elements in this set.
         * @return {number} the number of elements in this set.
         */
        size() {
            return this.dictionary.size();
        }
        /**
         * Removes all of the elements from this set.
         */
        clear() {
            this.dictionary.clear();
        }
        /*
         * Provides a string representation for display
         */
        toString() {
            return arrays.toString(this.toArray());
        }
    }
    zz.Set = Set;
    class Queue {
        /**
         * Creates an empty queue.
         * @class A queue is a First-In-First-Out (FIFO) data structure, the first
         * element added to the queue will be the first one to be removed. This
         * implementation uses a linked list as a container.
         * @constructor
         */
        constructor() {
            this.list = new LinkedList();
        }
        /**
         * Inserts the specified element into the end of this queue.
         * @param {Object} elem the element to insert.
         * @return {boolean} true if the element was inserted, or false if it is undefined.
         */
        enqueue(elem) {
            return this.list.add(elem);
        }
        /**
         * Inserts the specified element into the end of this queue.
         * @param {Object} elem the element to insert.
         * @return {boolean} true if the element was inserted, or false if it is undefined.
         */
        add(elem) {
            return this.list.add(elem);
        }
        /**
         * Retrieves and removes the head of this queue.
         * @return {*} the head of this queue, or undefined if this queue is empty.
         */
        dequeue() {
            if (this.list.size() !== 0) {
                const el = this.list.first();
                this.list.removeElementAtIndex(0);
                return el;
            }
            return undefined;
        }
        /**
         * Retrieves, but does not remove, the head of this queue.
         * @return {*} the head of this queue, or undefined if this queue is empty.
         */
        peek() {
            if (this.list.size() !== 0) {
                return this.list.first();
            }
            return undefined;
        }
        /**
         * Returns the number of elements in this queue.
         * @return {number} the number of elements in this queue.
         */
        size() {
            return this.list.size();
        }
        /**
         * Returns true if this queue contains the specified element.
         * <p>If the elements inside this stack are
         * not comparable with the === operator, a custom equals function should be
         * provided to perform searches, the function must receive two arguments and
         * return true if they are equal, false otherwise. Example:</p>
         *
         * <pre>
         * const petsAreEqualByName (pet1, pet2) {
         *  return pet1.name === pet2.name;
         * }
         * </pre>
         * @param {Object} elem element to search for.
         * @param {function(Object,Object):boolean=} equalsFunction optional
         * function to check if two elements are equal.
         * @return {boolean} true if this queue contains the specified element,
         * false otherwise.
         */
        contains(elem, equalsFunction) {
            return this.list.contains(elem, equalsFunction);
        }
        /**
         * Checks if this queue is empty.
         * @return {boolean} true if and only if this queue contains no items; false
         * otherwise.
         */
        isEmpty() {
            return this.list.size() <= 0;
        }
        /**
         * Removes all of the elements from this queue.
         */
        clear() {
            this.list.clear();
        }
        /**
         * Executes the provided function once for each element present in this queue in
         * FIFO order.
         * @param {function(Object):*} callback function to execute, it is
         * invoked with one argument: the element value, to break the iteration you can
         * optionally return false.
         */
        forEach(callback) {
            this.list.forEach(callback);
        }
    }
    zz.Queue = Queue;
    class PriorityQueue {
        /**
         * Creates an empty priority queue.
         * @class <p>In a priority queue each element is associated with a "priority",
         * elements are dequeued in highest-priority-first order (the elements with the
         * highest priority are dequeued first). Priority Queues are implemented as heaps.
         * If the inserted elements are custom objects a compare function must be provided,
         * otherwise the <=, === and >= operators are used to compare object priority.</p>
         * <pre>
         * function compare(a, b) {
         *  if (a is less than b by some ordering criterion) {
         *     return -1;
         *  } if (a is greater than b by the ordering criterion) {
         *     return 1;
         *  }
         *  // a must be equal to b
         *  return 0;
         * }
         * </pre>
         * @constructor
         * @param {function(Object,Object):number=} compareFunction optional
         * function used to compare two element priorities. Must return a negative integer,
         * zero, or a positive integer as the first argument is less than, equal to,
         * or greater than the second.
         */
        constructor(compareFunction) {
            this.heap = new Heap(util.reverseCompareFunction(compareFunction));
        }
        /**
         * Inserts the specified element into this priority queue.
         * @param {Object} element the element to insert.
         * @return {boolean} true if the element was inserted, or false if it is undefined.
         */
        enqueue(element) {
            return this.heap.add(element);
        }
        /**
         * Inserts the specified element into this priority queue.
         * @param {Object} element the element to insert.
         * @return {boolean} true if the element was inserted, or false if it is undefined.
         */
        add(element) {
            return this.heap.add(element);
        }
        /**
         * Retrieves and removes the highest priority element of this queue.
         * @return {*} the the highest priority element of this queue,
         *  or undefined if this queue is empty.
         */
        dequeue() {
            if (this.heap.size() !== 0) {
                const el = this.heap.peek();
                this.heap.removeRoot();
                return el;
            }
            return undefined;
        }
        /**
         * Retrieves, but does not remove, the highest priority element of this queue.
         * @return {*} the highest priority element of this queue, or undefined if this queue is empty.
         */
        peek() {
            return this.heap.peek();
        }
        /**
         * Returns true if this priority queue contains the specified element.
         * @param {Object} element element to search for.
         * @return {boolean} true if this priority queue contains the specified element,
         * false otherwise.
         */
        contains(element) {
            return this.heap.contains(element);
        }
        /**
         * Checks if this priority queue is empty.
         * @return {boolean} true if and only if this priority queue contains no items; false
         * otherwise.
         */
        isEmpty() {
            return this.heap.isEmpty();
        }
        /**
         * Returns the number of elements in this priority queue.
         * @return {number} the number of elements in this priority queue.
         */
        size() {
            return this.heap.size();
        }
        /**
         * Removes all of the elements from this priority queue.
         */
        clear() {
            this.heap.clear();
        }
        /**
         * Executes the provided function once for each element present in this queue in
         * no particular order.
         * @param {function(Object):*} callback function to execute, it is
         * invoked with one argument: the element value, to break the iteration you can
         * optionally return false.
         */
        forEach(callback) {
            this.heap.forEach(callback);
        }
    }
    zz.PriorityQueue = PriorityQueue;
    class Stack {
        /**
         * Creates an empty Stack.
         * @class A Stack is a Last-In-First-Out (LIFO) data structure, the last
         * element added to the stack will be the first one to be removed. This
         * implementation uses a linked list as a container.
         * @constructor
         */
        constructor() {
            this.list = new LinkedList();
        }
        /**
         * Pushes an item onto the top of this stack.
         * @param {Object} elem the element to be pushed onto this stack.
         * @return {boolean} true if the element was pushed or false if it is undefined.
         */
        push(elem) {
            return this.list.add(elem, 0);
        }
        /**
         * Pushes an item onto the top of this stack.
         * @param {Object} elem the element to be pushed onto this stack.
         * @return {boolean} true if the element was pushed or false if it is undefined.
         */
        add(elem) {
            return this.list.add(elem, 0);
        }
        /**
         * Removes the object at the top of this stack and returns that object.
         * @return {*} the object at the top of this stack or undefined if the
         * stack is empty.
         */
        pop() {
            return this.list.removeElementAtIndex(0);
        }
        /**
         * Looks at the object at the top of this stack without removing it from the
         * stack.
         * @return {*} the object at the top of this stack or undefined if the
         * stack is empty.
         */
        peek() {
            return this.list.first();
        }
        /**
         * Returns the number of elements in this stack.
         * @return {number} the number of elements in this stack.
         */
        size() {
            return this.list.size();
        }
        /**
         * Returns true if this stack contains the specified element.
         * <p>If the elements inside this stack are
         * not comparable with the === operator, a custom equals function should be
         * provided to perform searches, the function must receive two arguments and
         * return true if they are equal, false otherwise. Example:</p>
         *
         * <pre>
         * const petsAreEqualByName (pet1, pet2) {
         *  return pet1.name === pet2.name;
         * }
         * </pre>
         * @param {Object} elem element to search for.
         * @param {function(Object,Object):boolean=} equalsFunction optional
         * function to check if two elements are equal.
         * @return {boolean} true if this stack contains the specified element,
         * false otherwise.
         */
        contains(elem, equalsFunction) {
            return this.list.contains(elem, equalsFunction);
        }
        /**
         * Checks if this stack is empty.
         * @return {boolean} true if and only if this stack contains no items; false
         * otherwise.
         */
        isEmpty() {
            return this.list.isEmpty();
        }
        /**
         * Removes all of the elements from this stack.
         */
        clear() {
            this.list.clear();
        }
        /**
         * Executes the provided function once for each element present in this stack in
         * LIFO order.
         * @param {function(Object):*} callback function to execute, it is
         * invoked with one argument: the element value, to break the iteration you can
         * optionally return false.
         */
        forEach(callback) {
            this.list.forEach(callback);
        }
    }
    zz.Stack = Stack;
    class Bag {
        /**
         * Creates an empty bag.
         * @class <p>A bag is a special kind of set in which members are
         * allowed to appear more than once.</p>
         * <p>If the inserted elements are custom objects a function
         * which converts elements to unique strings must be provided. Example:</p>
         *
         * <pre>
         * function petToString(pet) {
         *  return pet.name;
         * }
         * </pre>
         *
         * @constructor
         * @param {function(Object):string=} toStrFunction optional function used
         * to convert elements to strings. If the elements aren't strings or if toString()
         * is not appropriate, a custom function which receives an object and returns a
         * unique string must be provided.
         */
        constructor(toStrFunction) {
            this.toStrF = toStrFunction || util.defaultToString;
            this.dictionary = new Dictionary(this.toStrF);
            this.nElements = 0;
        }
        /**
         * Adds nCopies of the specified object to this bag.
         * @param {Object} element element to add.
         * @param {number=} nCopies the number of copies to add, if this argument is
         * undefined 1 copy is added.
         * @return {boolean} true unless element is undefined.
         */
        add(element, nCopies = 1) {
            if (util.isUndefined(element) || nCopies <= 0) {
                return false;
            }
            if (!this.contains(element)) {
                const node = {
                    value: element,
                    copies: nCopies,
                };
                this.dictionary.setValue(element, node);
            }
            else {
                this.dictionary.getValue(element).copies += nCopies;
            }
            this.nElements += nCopies;
            return true;
        }
        /**
         * Counts the number of copies of the specified object in this bag.
         * @param {Object} element the object to search for..
         * @return {number} the number of copies of the object, 0 if not found
         */
        count(element) {
            if (!this.contains(element)) {
                return 0;
            }
            else {
                return this.dictionary.getValue(element).copies;
            }
        }
        /**
         * Returns true if this bag contains the specified element.
         * @param {Object} element element to search for.
         * @return {boolean} true if this bag contains the specified element,
         * false otherwise.
         */
        contains(element) {
            return this.dictionary.containsKey(element);
        }
        /**
         * Removes nCopies of the specified object to this bag.
         * If the number of copies to remove is greater than the actual number
         * of copies in the Bag, all copies are removed.
         * @param {Object} element element to remove.
         * @param {number=} nCopies the number of copies to remove, if this argument is
         * undefined 1 copy is removed.
         * @return {boolean} true if at least 1 element was removed.
         */
        remove(element, nCopies = 1) {
            if (util.isUndefined(element) || nCopies <= 0) {
                return false;
            }
            if (!this.contains(element)) {
                return false;
            }
            else {
                const node = this.dictionary.getValue(element);
                if (nCopies > node.copies) {
                    this.nElements -= node.copies;
                }
                else {
                    this.nElements -= nCopies;
                }
                node.copies -= nCopies;
                if (node.copies <= 0) {
                    this.dictionary.remove(element);
                }
                return true;
            }
        }
        /**
         * Returns an array containing all of the elements in this big in arbitrary order,
         * including multiple copies.
         * @return {Array} an array containing all of the elements in this bag.
         */
        toArray() {
            const a = [];
            const values = this.dictionary.values();
            for (const node of values) {
                const element = node.value;
                const copies = node.copies;
                for (let j = 0; j < copies; j++) {
                    a.push(element);
                }
            }
            return a;
        }
        /**
         * Returns a set of unique elements in this bag.
         * @return {collections.Set<T>} a set of unique elements in this bag.
         */
        toSet() {
            const toret = new Set(this.toStrF);
            const elements = this.dictionary.values();
            for (const ele of elements) {
                const value = ele.value;
                toret.add(value);
            }
            return toret;
        }
        /**
         * Executes the provided function once for each element
         * present in this bag, including multiple copies.
         * @param {function(Object):*} callback function to execute, it is
         * invoked with one argument: the element. To break the iteration you can
         * optionally return false.
         */
        forEach(callback) {
            this.dictionary.forEach(function (k, v) {
                const value = v.value;
                const copies = v.copies;
                for (let i = 0; i < copies; i++) {
                    if (callback(value) === false) {
                        return false;
                    }
                }
                return true;
            });
        }
        /**
         * Returns the number of elements in this bag.
         * @return {number} the number of elements in this bag.
         */
        size() {
            return this.nElements;
        }
        /**
         * Returns true if this bag contains no elements.
         * @return {boolean} true if this bag contains no elements.
         */
        isEmpty() {
            return this.nElements === 0;
        }
        /**
         * Removes all of the elements from this bag.
         */
        clear() {
            this.nElements = 0;
            this.dictionary.clear();
        }
    }
    zz.Bag = Bag;
    class BSTree {
        /**
         * Creates an empty binary search tree.
         * @class <p>A binary search tree is a binary tree in which each
         * internal node stores an element such that the elements stored in the
         * left subtree are less than it and the elements
         * stored in the right subtree are greater.</p>
         * <p>Formally, a binary search tree is a node-based binary tree data structure which
         * has the following properties:</p>
         * <ul>
         * <li>The left subtree of a node contains only nodes with elements less
         * than the node's element</li>
         * <li>The right subtree of a node contains only nodes with elements greater
         * than the node's element</li>
         * <li>Both the left and right subtrees must also be binary search trees.</li>
         * </ul>
         * <p>If the inserted elements are custom objects a compare function must
         * be provided at construction time, otherwise the <=, === and >= operators are
         * used to compare elements. Example:</p>
         * <pre>
         * function compare(a, b) {
         *  if (a is less than b by some ordering criterion) {
         *     return -1;
         *  } if (a is greater than b by the ordering criterion) {
         *     return 1;
         *  }
         *  // a must be equal to b
         *  return 0;
         * }
         * </pre>
         * @constructor
         * @param {function(Object,Object):number=} compareFunction optional
         * function used to compare two elements. Must return a negative integer,
         * zero, or a positive integer as the first argument is less than, equal to,
         * or greater than the second.
         */
        constructor(compareFunction) {
            this.root = null;
            this.compare = compareFunction || util.defaultCompare;
            this.nElements = 0;
        }
        /**
         * Adds the specified element to this tree if it is not already present.
         * @param {Object} element the element to insert.
         * @return {boolean} true if this tree did not already contain the specified element.
         */
        add(element) {
            if (util.isUndefined(element)) {
                return false;
            }
            if (this.insertNode(this.createNode(element)) !== null) {
                this.nElements++;
                return true;
            }
            return false;
        }
        /**
         * Removes all of the elements from this tree.
         */
        clear() {
            this.root = null;
            this.nElements = 0;
        }
        /**
         * Returns true if this tree contains no elements.
         * @return {boolean} true if this tree contains no elements.
         */
        isEmpty() {
            return this.nElements === 0;
        }
        /**
         * Returns the number of elements in this tree.
         * @return {number} the number of elements in this tree.
         */
        size() {
            return this.nElements;
        }
        /**
         * Returns true if this tree contains the specified element.
         * @param {Object} element element to search for.
         * @return {boolean} true if this tree contains the specified element,
         * false otherwise.
         */
        contains(element) {
            if (util.isUndefined(element)) {
                return false;
            }
            return this.searchNode(this.root, element) !== null;
        }
        /**
         * Removes the specified element from this tree if it is present.
         * @return {boolean} true if this tree contained the specified element.
         */
        remove(element) {
            const node = this.searchNode(this.root, element);
            if (node === null) {
                return false;
            }
            this.removeNode(node);
            this.nElements--;
            return true;
        }
        /**
         * Executes the provided function once for each element present in this tree in
         * in-order.
         * @param {function(Object):*} callback function to execute, it is invoked with one
         * argument: the element value, to break the iteration you can optionally return false.
         */
        inorderTraversal(callback) {
            this.inorderTraversalAux(this.root, callback, {
                stop: false,
            });
        }
        /**
         * Executes the provided function once for each element present in this tree in pre-order.
         * @param {function(Object):*} callback function to execute, it is invoked with one
         * argument: the element value, to break the iteration you can optionally return false.
         */
        preorderTraversal(callback) {
            this.preorderTraversalAux(this.root, callback, {
                stop: false,
            });
        }
        /**
         * Executes the provided function once for each element present in this tree in post-order.
         * @param {function(Object):*} callback function to execute, it is invoked with one
         * argument: the element value, to break the iteration you can optionally return false.
         */
        postorderTraversal(callback) {
            this.postorderTraversalAux(this.root, callback, {
                stop: false,
            });
        }
        /**
         * Executes the provided function once for each element present in this tree in
         * level-order.
         * @param {function(Object):*} callback function to execute, it is invoked with one
         * argument: the element value, to break the iteration you can optionally return false.
         */
        levelTraversal(callback) {
            this.levelTraversalAux(this.root, callback);
        }
        /**
         * Returns the minimum element of this tree.
         * @return {*} the minimum element of this tree or undefined if this tree is
         * is empty.
         */
        minimum() {
            if (this.isEmpty()) {
                return undefined;
            }
            return this.minimumAux(this.root).element;
        }
        /**
         * Returns the maximum element of this tree.
         * @return {*} the maximum element of this tree or undefined if this tree is
         * is empty.
         */
        maximum() {
            if (this.isEmpty()) {
                return undefined;
            }
            return this.maximumAux(this.root).element;
        }
        /**
         * Executes the provided function once for each element present in this tree in inorder.
         * Equivalent to inorderTraversal.
         * @param {function(Object):*} callback function to execute, it is
         * invoked with one argument: the element value, to break the iteration you can
         * optionally return false.
         */
        forEach(callback) {
            this.inorderTraversal(callback);
        }
        /**
         * Returns an array containing all of the elements in this tree in in-order.
         * @return {Array} an array containing all of the elements in this tree in in-order.
         */
        toArray() {
            const array = [];
            this.inorderTraversal(function (element) {
                array.push(element);
                return true;
            });
            return array;
        }
        /**
         * Returns the height of this tree.
         * @return {number} the height of this tree or -1 if is empty.
         */
        height() {
            return this.heightAux(this.root);
        }
        /**
         * @private
         */
        searchNode(node, element) {
            let cmp = null;
            while (node !== null && cmp !== 0) {
                cmp = this.compare(element, node.element);
                if (cmp < 0) {
                    node = node.leftCh;
                }
                else if (cmp > 0) {
                    node = node.rightCh;
                }
            }
            return node;
        }
        /**
         * @private
         */
        transplant(n1, n2) {
            if (n1.parent === null) {
                this.root = n2;
            }
            else if (n1 === n1.parent.leftCh) {
                n1.parent.leftCh = n2;
            }
            else {
                n1.parent.rightCh = n2;
            }
            if (n2 !== null) {
                n2.parent = n1.parent;
            }
        }
        /**
         * @private
         */
        removeNode(node) {
            if (node.leftCh === null) {
                this.transplant(node, node.rightCh);
            }
            else if (node.rightCh === null) {
                this.transplant(node, node.leftCh);
            }
            else {
                const y = this.minimumAux(node.rightCh);
                if (y.parent !== node) {
                    this.transplant(y, y.rightCh);
                    y.rightCh = node.rightCh;
                    y.rightCh.parent = y;
                }
                this.transplant(node, y);
                y.leftCh = node.leftCh;
                y.leftCh.parent = y;
            }
        }
        /**
         * @private
         */
        inorderTraversalAux(node, callback, signal) {
            if (node === null || signal.stop) {
                return;
            }
            this.inorderTraversalAux(node.leftCh, callback, signal);
            if (signal.stop) {
                return;
            }
            signal.stop = callback(node.element) === false;
            if (signal.stop) {
                return;
            }
            this.inorderTraversalAux(node.rightCh, callback, signal);
        }
        /**
         * @private
         */
        levelTraversalAux(node, callback) {
            const queue = new Queue();
            if (node !== null) {
                queue.enqueue(node);
            }
            while (!queue.isEmpty()) {
                node = queue.dequeue();
                if (callback(node.element) === false) {
                    return;
                }
                if (node.leftCh !== null) {
                    queue.enqueue(node.leftCh);
                }
                if (node.rightCh !== null) {
                    queue.enqueue(node.rightCh);
                }
            }
        }
        /**
         * @private
         */
        preorderTraversalAux(node, callback, signal) {
            if (node === null || signal.stop) {
                return;
            }
            signal.stop = callback(node.element) === false;
            if (signal.stop) {
                return;
            }
            this.preorderTraversalAux(node.leftCh, callback, signal);
            if (signal.stop) {
                return;
            }
            this.preorderTraversalAux(node.rightCh, callback, signal);
        }
        /**
         * @private
         */
        postorderTraversalAux(node, callback, signal) {
            if (node === null || signal.stop) {
                return;
            }
            this.postorderTraversalAux(node.leftCh, callback, signal);
            if (signal.stop) {
                return;
            }
            this.postorderTraversalAux(node.rightCh, callback, signal);
            if (signal.stop) {
                return;
            }
            signal.stop = callback(node.element) === false;
        }
        /**
         * @private
         */
        minimumAux(node) {
            while (node.leftCh !== null) {
                node = node.leftCh;
            }
            return node;
        }
        /**
         * @private
         */
        maximumAux(node) {
            while (node.rightCh !== null) {
                node = node.rightCh;
            }
            return node;
        }
        /**
         * @private
         */
        heightAux(node) {
            if (node === null) {
                return -1;
            }
            return (Math.max(this.heightAux(node.leftCh), this.heightAux(node.rightCh)) + 1);
        }
        /*
         * @private
         */
        insertNode(node) {
            let parent = null;
            let position = this.root;
            let cmp = null;
            while (position !== null) {
                cmp = this.compare(node.element, position.element);
                if (cmp === 0) {
                    return null;
                }
                else if (cmp < 0) {
                    parent = position;
                    position = position.leftCh;
                }
                else {
                    parent = position;
                    position = position.rightCh;
                }
            }
            node.parent = parent;
            if (parent === null) {
                // tree is empty
                this.root = node;
            }
            else if (this.compare(node.element, parent.element) < 0) {
                parent.leftCh = node;
            }
            else {
                parent.rightCh = node;
            }
            return node;
        }
        /**
         * @private
         */
        createNode(element) {
            return {
                element: element,
                leftCh: null,
                rightCh: null,
                parent: null,
            };
        }
    }
    zz.BSTree = BSTree;
    class FactoryDictionary extends Dictionary {
        /**
         * Creates an empty dictionary.
         * @class <p>Dictionaries map keys to values; each key can map to at most one value.
         * This implementation accepts any kind of objects as keys.</p>
         *
         * <p>The default factory function should return a new object of the provided
         * type. Example:</p>
         * <pre>
         * function petFactory() {
         *  return new Pet();
         * }
         * </pre>
         *
         * <p>If the keys are custom objects a function which converts keys to unique
         * strings must be provided. Example:</p>
         * <pre>
         * function petToString(pet) {
         *  return pet.name;
         * }
         * </pre>
         * @constructor
         * @param {function():V=} defaultFactoryFunction function used to create a
         * default object.
         * @param {function(Object):string=} toStrFunction optional function used
         * to convert keys to strings. If the keys aren't strings or if toString()
         * is not appropriate, a custom function which receives a key and returns a
         * unique string must be provided.
         */
        constructor(defaultFactoryFunction, toStrFunction) {
            super(toStrFunction);
            this.defaultFactoryFunction = defaultFactoryFunction;
        }
        /**
         * Associates the specified default value with the specified key in this dictionary,
         * if it didn't contain the key yet. If the key existed, the existing value will be used.
         * @param {Object} key key with which the specified value is to be
         * associated.
         * @param {Object} defaultValue default value to be associated with the specified key.
         * @return {*} previous value associated with the specified key, or the default value,
         * if the key didn't exist yet.
         */
        setDefault(key, defaultValue) {
            const currentValue = super.getValue(key);
            if (util.isUndefined(currentValue)) {
                this.setValue(key, defaultValue);
                return defaultValue;
            }
            return currentValue;
        }
        /**
         * Returns the value to which this dictionary maps the specified key.
         * Returns a default value created by the factory passed in the constructor,
         * if this dictionary contains no mapping for this key. The missing key will
         * automatically be added to the dictionary.
         * @param {Object} key key whose associated value is to be returned.
         * @return {*} the value to which this dictionary maps the specified key or
         * a default value if the map contains no mapping for this key.
         */
        getValue(key) {
            return this.setDefault(key, this.defaultFactoryFunction());
        }
    }
    zz.FactoryDictionary = FactoryDictionary;
    class MultiDictionary {
        /**
         * Creates an empty multi dictionary.
         * @class <p>A multi dictionary is a special kind of dictionary that holds
         * multiple values against each key. Setting a value into the dictionary will
         * add the value to an array at that key. Getting a key will return an array,
         * holding all the values set to that key.
         * You can configure to allow duplicates in the values.
         * This implementation accepts any kind of objects as keys.</p>
         *
         * <p>If the keys are custom objects a function which converts keys to strings must be
         * provided. Example:</p>
         *
         * <pre>
         * function petToString(pet) {
         *  return pet.name;
         * }
         * </pre>
         * <p>If the values are custom objects a function to check equality between values
         * must be provided. Example:</p>
         *
         * <pre>
         * function petsAreEqualByAge(pet1,pet2) {
         *  return pet1.age===pet2.age;
         * }
         * </pre>
         * @constructor
         * @param {function(Object):string=} toStrFunction optional function
         * to convert keys to strings. If the keys aren't strings or if toString()
         * is not appropriate, a custom function which receives a key and returns a
         * unique string must be provided.
         * @param {function(Object,Object):boolean=} valuesEqualsFunction optional
         * function to check if two values are equal.
         *
         * @param allowDuplicateValues
         */
        constructor(toStrFunction, valuesEqualsFunction, allowDuplicateValues = false) {
            this.dict = new Dictionary(toStrFunction);
            this.equalsF = valuesEqualsFunction || util.defaultEquals;
            this.allowDuplicate = allowDuplicateValues;
        }
        /**
         * Returns an array holding the values to which this dictionary maps
         * the specified key.
         * Returns an empty array if this dictionary contains no mappings for this key.
         * @param {Object} key key whose associated values are to be returned.
         * @return {Array} an array holding the values to which this dictionary maps
         * the specified key.
         */
        getValue(key) {
            const values = this.dict.getValue(key);
            if (util.isUndefined(values)) {
                return [];
            }
            return arrays.copy(values);
        }
        /**
         * Adds the value to the array associated with the specified key, if
         * it is not already present.
         * @param {Object} key key with which the specified value is to be
         * associated.
         * @param {Object} value the value to add to the array at the key
         * @return {boolean} true if the value was not already associated with that key.
         */
        setValue(key, value) {
            if (util.isUndefined(key) || util.isUndefined(value)) {
                return false;
            }
            if (!this.containsKey(key)) {
                this.dict.setValue(key, [value]);
                return true;
            }
            const array = this.dict.getValue(key);
            if (!this.allowDuplicate) {
                if (arrays.contains(array, value, this.equalsF)) {
                    return false;
                }
            }
            array.push(value);
            return true;
        }
        /**
         * Removes the specified values from the array of values associated with the
         * specified key. If a value isn't given, all values associated with the specified
         * key are removed.
         * @param {Object} key key whose mapping is to be removed from the
         * dictionary.
         * @param {Object=} value optional argument to specify the value to remove
         * from the array associated with the specified key.
         * @return {*} true if the dictionary changed, false if the key doesn't exist or
         * if the specified value isn't associated with the specified key.
         */
        remove(key, value) {
            if (util.isUndefined(value)) {
                const v = this.dict.remove(key);
                return !util.isUndefined(v);
            }
            const array = this.dict.getValue(key);
            if (arrays.remove(array, value, this.equalsF)) {
                if (array.length === 0) {
                    this.dict.remove(key);
                }
                return true;
            }
            return false;
        }
        /**
         * Returns an array containing all of the keys in this dictionary.
         * @return {Array} an array containing all of the keys in this dictionary.
         */
        keys() {
            return this.dict.keys();
        }
        /**
         * Returns an array containing all of the values in this dictionary.
         * @return {Array} an array containing all of the values in this dictionary.
         */
        values() {
            const values = this.dict.values();
            const array = [];
            for (const v of values) {
                for (const w of v) {
                    array.push(w);
                }
            }
            return array;
        }
        /**
         * Returns true if this dictionary at least one value associatted the specified key.
         * @param {Object} key key whose presence in this dictionary is to be
         * tested.
         * @return {boolean} true if this dictionary at least one value associatted
         * the specified key.
         */
        containsKey(key) {
            return this.dict.containsKey(key);
        }
        /**
         * Removes all mappings from this dictionary.
         */
        clear() {
            this.dict.clear();
        }
        /**
         * Returns the number of keys in this dictionary.
         * @return {number} the number of key-value mappings in this dictionary.
         */
        size() {
            return this.dict.size();
        }
        /**
         * Returns true if this dictionary contains no mappings.
         * @return {boolean} true if this dictionary contains no mappings.
         */
        isEmpty() {
            return this.dict.isEmpty();
        }
    }
    zz.MultiDictionary = MultiDictionary;
    let Direction;
    (function (Direction) {
        Direction[Direction["BEFORE"] = 0] = "BEFORE";
        Direction[Direction["AFTER"] = 1] = "AFTER";
        Direction[Direction["INSIDE_AT_END"] = 2] = "INSIDE_AT_END";
        Direction[Direction["INSIDE_AT_START"] = 3] = "INSIDE_AT_START";
    })(Direction || (Direction = {}));
    class MultiRootTree {
        constructor(rootIds = [], nodes = {}) {
            this.rootIds = rootIds;
            this.nodes = nodes;
            this.initRootIds();
            this.initNodes();
        }
        initRootIds() {
            for (let rootId of this.rootIds) {
                this.createEmptyNodeIfNotExist(rootId);
            }
        }
        initNodes() {
            for (let nodeKey in this.nodes) {
                if (this.nodes.hasOwnProperty(nodeKey)) {
                    for (let nodeListItem of this.nodes[nodeKey]) {
                        this.createEmptyNodeIfNotExist(nodeListItem);
                    }
                }
            }
        }
        createEmptyNodeIfNotExist(nodeKey) {
            if (!this.nodes[nodeKey]) {
                this.nodes[nodeKey] = [];
            }
        }
        getRootIds() {
            let clone = this.rootIds.slice();
            return clone;
        }
        getNodes() {
            let clone = {};
            for (let nodeKey in this.nodes) {
                if (this.nodes.hasOwnProperty(nodeKey)) {
                    clone[nodeKey] = this.nodes[nodeKey].slice();
                }
            }
            return clone;
        }
        getObject() {
            return {
                rootIds: this.getRootIds(),
                nodes: this.getNodes(),
            };
        }
        toObject() {
            return this.getObject();
        }
        flatten() {
            const _this = this;
            let extraPropsObject = [];
            for (let i = 0; i < this.rootIds.length; i++) {
                const rootId = this.rootIds[i];
                extraPropsObject.push({
                    id: rootId,
                    level: 0,
                    hasParent: false,
                    childrenCount: undefined,
                });
                traverse(rootId, this.nodes, extraPropsObject, 0);
            }
            for (let o of extraPropsObject) {
                o.childrenCount = countChildren(o.id);
            }
            return extraPropsObject;
            function countChildren(id) {
                if (!_this.nodes[id]) {
                    return 0;
                }
                else {
                    const childrenCount = _this.nodes[id].length;
                    return childrenCount;
                }
            }
            function traverse(startId, nodes, returnArray, level = 0) {
                if (!startId || !nodes || !returnArray || !nodes[startId]) {
                    return;
                }
                level++;
                let idsList = nodes[startId];
                for (let i = 0; i < idsList.length; i++) {
                    let id = idsList[i];
                    returnArray.push({ id, level, hasParent: true });
                    traverse(id, nodes, returnArray, level);
                }
                level--;
            }
        }
        moveIdBeforeId(moveId, beforeId) {
            return this.moveId(moveId, beforeId, Direction.BEFORE);
        }
        moveIdAfterId(moveId, afterId) {
            return this.moveId(moveId, afterId, Direction.AFTER);
        }
        moveIdIntoId(moveId, insideId, atStart = true) {
            if (atStart) {
                return this.moveId(moveId, insideId, Direction.INSIDE_AT_START);
            }
            else {
                return this.moveId(moveId, insideId, Direction.INSIDE_AT_END);
            }
        }
        deleteId(id) {
            this.rootDeleteId(id);
            this.nodeAndSubNodesDelete(id);
            this.nodeRefrencesDelete(id);
        }
        insertIdBeforeId(beforeId, insertId) {
            let foundRootIdIndex = this.findRootId(beforeId);
            if (foundRootIdIndex > -1) {
                this.insertIdIntoRoot(insertId, foundRootIdIndex);
            }
            for (let nodeKey in this.nodes) {
                if (this.nodes.hasOwnProperty(nodeKey)) {
                    let foundNodeIdIndex = this.findNodeId(nodeKey, beforeId);
                    if (foundNodeIdIndex > -1) {
                        this.insertIdIntoNode(nodeKey, insertId, foundNodeIdIndex);
                    }
                }
            }
        }
        insertIdAfterId(belowId, insertId) {
            let foundRootIdIndex = this.findRootId(belowId);
            if (foundRootIdIndex > -1) {
                this.insertIdIntoRoot(insertId, foundRootIdIndex + 1);
            }
            for (let nodeKey in this.nodes) {
                if (this.nodes.hasOwnProperty(nodeKey)) {
                    let foundNodeIdIndex = this.findNodeId(nodeKey, belowId);
                    if (foundNodeIdIndex > -1) {
                        this.insertIdIntoNode(nodeKey, insertId, foundNodeIdIndex + 1);
                    }
                }
            }
        }
        insertIdIntoId(insideId, insertId) {
            this.nodeInsertAtEnd(insideId, insertId);
            this.nodes[insertId] = [];
        }
        insertIdIntoRoot(id, position) {
            if (position === undefined) {
                this.rootInsertAtEnd(id);
            }
            else {
                if (position < 0) {
                    const length = this.rootIds.length;
                    this.rootIds.splice(position + length + 1, 0, id);
                }
                else {
                    this.rootIds.splice(position, 0, id);
                }
            }
            this.nodes[id] = this.nodes[id] || [];
        }
        insertIdIntoNode(nodeKey, id, position) {
            this.nodes[nodeKey] = this.nodes[nodeKey] || [];
            this.nodes[id] = this.nodes[id] || [];
            if (position === undefined) {
                this.nodeInsertAtEnd(nodeKey, id);
            }
            else {
                if (position < 0) {
                    const length = this.nodes[nodeKey].length;
                    this.nodes[nodeKey].splice(position + length + 1, 0, id);
                }
                else {
                    this.nodes[nodeKey].splice(position, 0, id);
                }
            }
        }
        moveId(moveId, beforeId, direction) {
            let sourceId = moveId;
            const sourceRootIndex = this.findRootId(sourceId);
            let sourceNodeKey;
            let sourceNodeIdIndex;
            if (this.nodes[beforeId]) {
                sourceNodeKey = beforeId;
            }
            for (let nodeKey in this.nodes) {
                if (this.nodes.hasOwnProperty(nodeKey)) {
                    sourceNodeIdIndex = this.findNodeId(nodeKey, beforeId);
                    break;
                }
            }
            // got all
            let targetId = beforeId;
            const targetRootIndex = this.findRootId(targetId);
            let targetNodeKey;
            let targetNodeIdIndex;
            if (this.nodes[beforeId]) {
                targetNodeKey = beforeId;
            }
            for (let nodeKey in this.nodes) {
                if (this.nodes.hasOwnProperty(nodeKey)) {
                    targetNodeIdIndex = this.findNodeId(nodeKey, beforeId);
                    break;
                }
            }
            // got all
            if (sourceRootIndex > -1) {
                if (targetRootIndex > -1) {
                    this.rootDelete(sourceRootIndex);
                    switch (direction) {
                        case Direction.BEFORE:
                            this.insertIdIntoRoot(sourceId, targetRootIndex);
                            break;
                        case Direction.AFTER:
                            this.insertIdIntoRoot(sourceId, targetRootIndex + 1);
                            break;
                        case Direction.INSIDE_AT_START:
                            this.nodeInsertAtStart(targetId, sourceId);
                            break;
                        case Direction.INSIDE_AT_END:
                            this.nodeInsertAtEnd(targetId, sourceId);
                            break;
                    }
                }
                else {
                    // moving root (source) ABOVE node (target)
                    // will remove one entry from roots
                    this.rootDelete(sourceRootIndex);
                    for (let nodeKey in this.nodes) {
                        if (this.nodes.hasOwnProperty(nodeKey)) {
                            let index = this.findNodeId(nodeKey, targetId);
                            if (index > -1) {
                                switch (direction) {
                                    case Direction.BEFORE:
                                        this.insertIdIntoNode(nodeKey, sourceId, index);
                                        break;
                                    case Direction.AFTER:
                                        this.insertIdIntoNode(nodeKey, sourceId, index + 1);
                                        break;
                                    case Direction.INSIDE_AT_START:
                                        this.nodeInsertAtStart(targetId, sourceId);
                                        break;
                                    case Direction.INSIDE_AT_END:
                                        this.nodeInsertAtEnd(targetId, sourceId);
                                        break;
                                }
                                break;
                            }
                        }
                    }
                }
            }
            else {
                if (targetRootIndex > -1) {
                    // moving node (source) ABOVE root (target)
                    // delete source id from each node
                    for (let nodeKey in this.nodes) {
                        if (this.nodes.hasOwnProperty(nodeKey)) {
                            let index = this.findNodeId(nodeKey, sourceId);
                            if (index > -1) {
                                // this.nodeInsertId(nodeKey, sourceId, index);
                                this.nodeDeleteAtIndex(nodeKey, index);
                                break;
                            }
                        }
                    }
                    switch (direction) {
                        case Direction.BEFORE:
                            this.insertIdIntoRoot(sourceId, targetRootIndex);
                            break;
                        case Direction.AFTER:
                            this.insertIdIntoRoot(sourceId, targetRootIndex + 1);
                            break;
                        case Direction.INSIDE_AT_START:
                            this.nodeInsertAtStart(targetId, sourceId);
                            break;
                        case Direction.INSIDE_AT_END:
                            this.nodeInsertAtEnd(targetId, sourceId);
                            break;
                    }
                }
                else {
                    // moving node (source) ABOVE node (target)
                    // delete source id from each node
                    for (let nodeKey in this.nodes) {
                        if (this.nodes.hasOwnProperty(nodeKey)) {
                            let index = this.findNodeId(nodeKey, sourceId);
                            if (index > -1) {
                                this.nodeDeleteAtIndex(nodeKey, index);
                                break;
                            }
                        }
                    }
                    for (let nodeKey in this.nodes) {
                        if (this.nodes.hasOwnProperty(nodeKey)) {
                            let index = this.findNodeId(nodeKey, targetId);
                            if (index > -1) {
                                switch (direction) {
                                    case Direction.BEFORE:
                                        this.insertIdIntoNode(nodeKey, sourceId, index);
                                        break;
                                    case Direction.AFTER:
                                        this.insertIdIntoNode(nodeKey, sourceId, index + 1);
                                        break;
                                    case Direction.INSIDE_AT_START:
                                        this.nodeInsertAtStart(targetId, sourceId);
                                        break;
                                    case Direction.INSIDE_AT_END:
                                        this.nodeInsertAtEnd(targetId, sourceId);
                                        break;
                                }
                                break;
                            }
                        }
                    }
                }
            }
        }
        swapArrayElements(arr, indexA, indexB) {
            var temp = arr[indexA];
            arr[indexA] = arr[indexB];
            arr[indexB] = temp;
            return arr;
        }
        rootDeleteId(id) {
            let index = this.findRootId(id);
            if (index > -1) {
                this.rootDelete(index);
            }
        }
        nodeAndSubNodesDelete(nodeKey) {
            let toDeleteLater = [];
            for (let i = 0; i < this.nodes[nodeKey].length; i++) {
                let id = this.nodes[nodeKey][i];
                this.nodeAndSubNodesDelete(id);
                toDeleteLater.push(nodeKey);
            }
            this.nodeDelete(nodeKey);
            for (let i = 0; i < toDeleteLater.length; i++) {
                this.nodeDelete(toDeleteLater[i]);
            }
        }
        nodeRefrencesDelete(id) {
            for (let nodeKey in this.nodes) {
                if (this.nodes.hasOwnProperty(nodeKey)) {
                    for (let i = 0; i < this.nodes[nodeKey].length; i++) {
                        let targetId = this.nodes[nodeKey][i];
                        if (targetId === id) {
                            this.nodeDeleteAtIndex(nodeKey, i);
                        }
                    }
                }
            }
        }
        nodeDelete(nodeKey) {
            delete this.nodes[nodeKey];
        }
        findRootId(id) {
            return this.rootIds.indexOf(id);
        }
        findNodeId(nodeKey, id) {
            return this.nodes[nodeKey].indexOf(id);
        }
        findNode(nodeKey) {
            return this.nodes[nodeKey];
        }
        nodeInsertAtStart(nodeKey, id) {
            this.nodes[nodeKey].unshift(id);
        }
        nodeInsertAtEnd(nodeKey, id) {
            this.nodes[nodeKey].push(id);
        }
        rootDelete(index) {
            this.rootIds.splice(index, 1);
        }
        nodeDeleteAtIndex(nodeKey, index) {
            this.nodes[nodeKey].splice(index, 1);
        }
        rootInsertAtStart(id) {
            this.rootIds.unshift(id);
        }
        rootInsertAtEnd(id) {
            this.rootIds.push(id);
        }
    }
    zz.MultiRootTree = MultiRootTree;
})(zz || (zz = {}));
window.zz = zz;
/// <reference path="zzUtils.ts" />
/// <reference path="zzStructure.ts" />
/// <reference path="zzLog.ts" />
var zz;
(function (zz) {
    /**
     * 资源加载管理; 包含预载字典和各种帮助方法;
     */
    class ResMgr {
        constructor() {
            this.prefabMap = new zz.Dictionary();
            this.spriteMap = new zz.Dictionary();
        }
        /**
         * 批量读取目录内资源
         * @param bundleName 资源包名
         * @param dirName 资源目录名
         * @param type 资源类型
         * @param assetDict 各类型对应存储
         */
        loadResDict(bundleName, dirName, type, assetDict) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    let bundle = yield zz.utils.getBundle(bundleName);
                    const asset_1 = yield new Promise((resolveFn, rejectFn) => {
                        bundle.loadDir(dirName, type, (err, res) => {
                            err ? rejectFn(err) : resolveFn(res);
                        });
                    });
                    let key = bundleName + '/' + dirName;
                    if (!assetDict.containsKey(key)) {
                        assetDict.setValue(key, new zz.Dictionary());
                    }
                    let subDict = assetDict.getValue(key);
                    asset_1.forEach(v => {
                        subDict.setValue(v.name, v);
                    });
                }
                catch (err_1) {
                    zz.error('[loadResDict] error:' + err_1);
                }
            });
        }
        loadPrefabs(bundleName, dirName) {
            this.loadResDict(bundleName, dirName, cc.Prefab, this.prefabMap);
        }
        loadSprites(bundleName, dirName) {
            this.loadResDict(bundleName, dirName, cc.SpriteFrame, this.spriteMap);
        }
        getPrefab(bundleName, dirName, name) {
            let key = bundleName + '/' + dirName;
            if (!this.prefabMap.containsKey(key)) {
                return undefined;
            }
            return this.prefabMap.getValue(key).getValue(name);
        }
        getSpriteframe(bundleName, dirName, name) {
            const key = bundleName + '/' + dirName;
            if (!this.spriteMap.containsKey(key)) {
                return undefined;
            }
            return this.spriteMap.getValue(key).getValue(name);
        }
    }
    /**动态资源管理 */
    zz.res = new ResMgr();
})(zz || (zz = {}));
/// <reference path="zzUtils.ts" />
/// <reference path="zzStructure.ts" />
/// <reference path="zzLog.ts" />
var zz;
(function (zz) {
    /**
     * 场景管理器
     * @classdesc 1.区别于cc场景;
     * 2.只有一层,一种场景只能存在一个,但可以有多个拼接;
     * 3.Main Camera管理
     * 4.层级最下
     * 5.以SceneRoot为根节点,锚点左下角(0,0),位置(0,0)
     * 6.所有自定场景均以左下角为世界原点,具体位置自定
     * 7.多场景以预制体管理;
     * 8.单场景可不用此管理器
     */
    class SceneMgr {
        constructor() {
            /**已显示的场景节点字典; */
            this.sceneDict = new zz.Dictionary();
            /**预载场景节点字典;未显示 */
            this.preloadDict = new zz.Dictionary();
            /**加载标记;防止重复加载 */
            this.loadingDict = new zz.Dictionary();
            /**打开中标记;用于预载过程中打开 */
            this.openningDict = new zz.Dictionary();
        }
        /**场景根节点 */
        get sceneRoot() {
            return this._sceneRoot;
        }
        /**设置场景根节点;在游戏开始时执行一次 */
        setSceneRoot(sceneRoot) {
            this._sceneRoot = sceneRoot;
        }
        /**
         * 加载场景
         * @param sceneName 场景预制体名
         * @param bundleName bundle名
         */
        loadScene(sceneName, bundleName) {
            return __awaiter(this, void 0, void 0, function* () {
                if (this.loadingDict.containsKey(sceneName)) {
                    zz.warn('[Scene] 正在加载' + sceneName);
                    this.openningDict.setValue(sceneName, 1);
                    return;
                }
                if (this.sceneDict.containsKey(sceneName)) {
                    zz.warn('[Scene] 已加载' + sceneName);
                    return;
                }
                if (this.preloadDict.containsKey(sceneName)) {
                    zz.warn('[Scene] 已预载' + sceneName);
                    let node = this.preloadDict.getValue(sceneName);
                    this.sceneRoot.addChild(node);
                    this.preloadDict.remove(sceneName);
                    return;
                }
                this.loadingDict.setValue(sceneName, 1);
                try {
                    let bundle = yield zz.utils.getBundle(bundleName);
                    let prefab_1 = yield new Promise((resolve, reject) => {
                        bundle.load(sceneName, (err, prefab) => {
                            err ? reject(err) : resolve(prefab);
                        });
                    });
                    this.loadingDict.remove(sceneName);
                    let node = yield zz.utils.instantiatePrefab(prefab_1);
                    this.sceneRoot.addChild(node);
                    if (this.openningDict.containsKey(sceneName)) {
                        this.openningDict.remove(sceneName);
                    }
                }
                catch (e) {
                    throw new Error(e);
                }
            });
        }
        /**销毁场景 */
        destroyScene(sceneName) {
            if (this.sceneDict.containsKey(sceneName)) {
                this.sceneDict.getValue(sceneName).destroy();
                this.sceneDict.remove(sceneName);
            }
        }
        /**预载场景节点 */
        preloadScene(sceneName, bundleName) {
            return __awaiter(this, void 0, void 0, function* () {
                if (this.sceneDict.containsKey(sceneName)) {
                    zz.warn('[Scene] 已加载' + sceneName);
                    return undefined;
                }
                if (this.loadingDict.containsKey(sceneName)) {
                    zz.warn('[Scene] 正在加载' + sceneName);
                    return undefined;
                }
                this.loadingDict.setValue(sceneName, 1);
                try {
                    const bundle = yield zz.utils.getBundle(bundleName);
                    const prefab_1 = yield new Promise((resolve, reject) => {
                        bundle.load(sceneName, (err, prefab) => {
                            err ? reject(err) : resolve(prefab);
                        });
                    });
                    this.loadingDict.remove(sceneName);
                    let node = yield zz.utils.instantiatePrefab(prefab_1);
                    if (this.openningDict.containsKey(sceneName)) {
                        //如果需要打开,则直接打开
                        this.openningDict.remove(sceneName);
                        this.sceneRoot.addChild(node);
                    }
                    else {
                        // 否则存储在预载中;
                        this.preloadDict.setValue(sceneName, node);
                    }
                }
                catch (e) {
                    throw new Error(e);
                }
            });
        }
    }
    /**场景管理 */
    zz.scene = new SceneMgr();
})(zz || (zz = {}));
/// <reference path="zzUtils.ts" />
/// <reference path="zzStructure.ts" />
/// <reference path="zzLog.ts" />
var zz;
(function (zz) {
    class SoundMgr {
        constructor() {
            this.dict_clip = new Map();
            this.dict_soundId = new zz.MultiDictionary();
            this.dict_musicID = new zz.MultiDictionary();
            this.dict_flag = new Map();
            this.soundVolume = 1.0;
            this.musicVolume = 0.5;
            this._isMusicOn = true;
            this._isSoundOn = true;
            this._isAllOn = true;
        }
        set SoundVolume(volume) {
            this.soundVolume = volume;
            cc.audioEngine.setEffectsVolume(volume);
        }
        get SoundVolume() {
            return this.soundVolume;
        }
        set MusicVolume(volume) {
            this.musicVolume = volume;
            cc.audioEngine.setMusicVolume(volume);
        }
        get MusicVolume() {
            return this.musicVolume;
        }
        /**音乐开关 */
        get isMusicOn() {
            return this._isMusicOn;
        }
        set isMusicOn(v) {
            if (v == false) {
                this.stopMusic();
            }
            this._isMusicOn = v;
        }
        /**音效开关 */
        get isSoundOn() {
            return this._isSoundOn;
        }
        set isSoundOn(v) {
            if (!v) {
                this.stopAllSounds();
            }
            this._isSoundOn = v;
        }
        /**声音是否打开 */
        get isAllOn() {
            return this._isAllOn;
        }
        set isAllOn(v) {
            this._isAllOn = v;
            if (!v) {
                this.stopAllSounds();
                this.stopMusic();
            }
        }
        playSound(soundName, loop = false) {
            return __awaiter(this, void 0, void 0, function* () {
                if (!this.isAllOn) {
                    return;
                }
                if (!this.isSoundOn) {
                    return;
                }
                this.dict_flag.set(soundName, 1);
                if (this.dict_clip.has(soundName)) {
                    let clip = this.dict_clip.get(soundName);
                    let soundID = cc.audioEngine.playEffect(clip, loop);
                    this.dict_soundId.setValue(soundName, soundID);
                    cc.audioEngine.setFinishCallback(soundID, () => {
                        if (!loop || !this.dict_flag.get(soundName)) {
                            this.dict_soundId.remove(soundName, soundID);
                        }
                    });
                }
                else {
                    let bundle = yield zz.utils.getBundle('audio');
                    bundle.load(soundName, cc.AudioClip, (err, clip) => {
                        if (this.dict_clip.get(soundName))
                            return;
                        if (!this.dict_flag.get(soundName))
                            return;
                        this.dict_clip.set(soundName, clip);
                        let soundID = cc.audioEngine.playEffect(clip, loop);
                        this.dict_soundId.setValue(soundName, soundID);
                        cc.audioEngine.setFinishCallback(soundID, () => {
                            if (!loop || !this.dict_flag.get(soundName)) {
                                this.dict_soundId.remove(soundName, soundID);
                            }
                        });
                    });
                }
            });
        }
        playMusic(musicName, loop = true) {
            return __awaiter(this, void 0, void 0, function* () {
                if (!this.isAllOn) {
                    return;
                }
                if (!this.isMusicOn) {
                    return;
                }
                if (this.dict_musicID.containsKey(musicName)) {
                    return;
                }
                if (this.dict_clip.has(musicName)) {
                    let clip = this.dict_clip.get(musicName);
                    let id = cc.audioEngine.playMusic(clip, loop);
                    this.dict_musicID.setValue(musicName, id);
                    cc.audioEngine.setFinishCallback(id, () => {
                        if (!loop) {
                            this.dict_musicID.remove(musicName, id);
                        }
                    });
                }
                else {
                    try {
                        let bundle = yield zz.utils.getBundle('audio');
                        bundle.load(musicName, cc.AudioClip, (err, clip) => {
                            if (err) {
                                zz.error(err);
                                return;
                            }
                            if (this.dict_clip.has(musicName))
                                return;
                            this.dict_clip.set(musicName, clip);
                            let id = cc.audioEngine.playMusic(clip, loop);
                            this.dict_musicID.setValue(musicName, id);
                            cc.audioEngine.setFinishCallback(id, () => {
                                if (!loop) {
                                    this.dict_musicID.remove(musicName, id);
                                }
                            });
                        });
                    }
                    catch (err) {
                        zz.error(err);
                    }
                }
            });
        }
        /**切换音乐; 模拟的渐变切换; 替换PlayMusic使用*/
        changeMusic(musicName, loop = true, inTime = 1, outTime = 1) {
            let iTime = inTime;
            let oTime = outTime;
            let it = 0.1;
            let iLen = iTime / it;
            let oLen = oTime / it;
            let volLmt = this.musicVolume;
            let iVolIt = volLmt / iLen;
            for (let i = 0; i < iLen; i++) {
                setTimeout(() => {
                    cc.audioEngine.setMusicVolume(volLmt - iVolIt * i);
                }, i * it * 1000);
            }
            setTimeout(() => {
                this.stopMusic();
                this.playMusic(musicName, loop);
            }, iTime * 1000);
            let oVolIt = volLmt / oLen;
            for (let i = 0; i < oLen; i++) {
                setTimeout(() => {
                    cc.audioEngine.setMusicVolume(oVolIt * i);
                }, (i * it + iTime) * 1000);
            }
        }
        stopSound(soundName) {
            this.dict_flag.set(soundName, 0);
            if (this.dict_soundId.containsKey(soundName)) {
                this.dict_soundId.getValue(soundName).forEach(v => {
                    cc.audioEngine.stopEffect(v);
                });
                this.dict_soundId.remove(soundName);
            }
        }
        stopMusic() {
            cc.audioEngine.stopMusic();
            this.dict_musicID.clear();
        }
        stopAllSounds() {
            cc.audioEngine.stopAllEffects();
            this.dict_soundId.keys().forEach(v => {
                this.dict_flag.set(v, 0);
            });
            this.dict_soundId.clear();
        }
        releaseSound(soundName) {
            this.stopSound(soundName);
            if (this.dict_clip.has(soundName)) {
                this.dict_clip.delete(soundName);
            }
            zz.utils.getBundle('audio').then(bundle => {
                bundle.release(soundName);
            });
        }
    }
    /**声音管理 */
    zz.sound = new SoundMgr();
})(zz || (zz = {}));
/// <reference path="zzType.ts" />
var zz;
(function (zz) {
    class StorageMgr {
        /**
         * 清理本地存储
         */
        clear() {
            cc.sys.localStorage.clear();
        }
        /**
         * 移除目标key值的存储
         * @param key {string} 存储的键值
         */
        remove(key) {
            cc.sys.localStorage.removeItem(key);
        }
        /**
         * 存储int32值
         * @param key {string} 存储键值
         * @param value {number} 数字,会被取整;
         */
        saveInt(key, value) {
            cc.sys.localStorage.setItem(key, zz.int(value));
        }
        /**
         * 获取存储的int32
         * @param key {string} 键值
         * @returns {number} int32值;默认为0
         */
        getInt(key) {
            let sto = cc.sys.localStorage.getItem(key);
            // null | undefine
            if (!sto)
                return 0;
            let n = parseInt(sto);
            // NaN
            if (!sto)
                return 0;
            return n;
        }
        /**
         * 存储数值
         * @param key {string} 键值
         * @param value {number} double值
         */
        saveNumber(key, value) {
            cc.sys.localStorage.setItem(key, value);
        }
        /**
         * 获取存储的数值
         * @param key {string} 键值
         * @returns {number} 数值,默认为0
         */
        getNumber(key) {
            let sto = cc.sys.localStorage.getItem(key);
            // null | undefine
            if (!sto)
                return 0;
            let n = parseFloat(sto);
            // NaN
            if (!sto)
                return 0;
            return n;
        }
        /**
         * 保存字符串
         * @param key {string} 键值
         * @param value {string} 字符串
         */
        saveString(key, value) {
            cc.sys.localStorage.setItem(key, value);
        }
        /**
         * 读取保存的字符串;
         * @param key {string} 键值
         * @returns {string} 字符串,默认为''
         */
        getString(key) {
            let sto = cc.sys.localStorage.getItem(key);
            if (!sto)
                return '';
            return sto;
        }
        /**
         * 保存对象
         * @param key {string} 键值
         * @param value {T} 对象,包括数组等各种带__proto__的
         */
        saveObject(key, value) {
            if (value) {
                this.saveString(key, JSON.stringify(value));
            }
        }
        /**
         * 读取对象
         * @param key {string} 键值
         * @returns {T} 对象,包括数组等
         */
        getObject(key) {
            let str = this.getString(key);
            if (str) {
                try {
                    return JSON.parse(str);
                }
                catch (e) {
                    throw new Error(e);
                }
            }
            else {
                return undefined;
            }
        }
    }
    /**存储管理 */
    zz.sto = new StorageMgr();
})(zz || (zz = {}));
/// <reference path="zzUtils.ts" />
/// <reference path="zzLog.ts" />
var zz;
(function (zz) {
    class TableMgr {
        constructor() {
            this.allTables = null;
            this.allTables = new Map();
        }
        loadConfig(tableType, bundleName) {
            return __awaiter(this, void 0, void 0, function* () {
                if (this.allTables.has(tableType)) {
                    this.allTables.set(tableType, new Map());
                }
                try {
                    let bundle = yield zz.utils.getBundle(bundleName);
                    const jsonAsset_1 = yield new Promise((resolveFn, rejectFn) => {
                        bundle.load(tableType, (err, jsonAsset) => {
                            err ? rejectFn(err) : resolveFn(jsonAsset);
                        });
                    });
                    let jsonObj = jsonAsset_1.json;
                    let tableMap = new Map();
                    for (let k in jsonObj) {
                        let obj = JSON.parse(JSON.stringify(jsonObj[k]));
                        tableMap.set(obj.id, obj);
                    }
                    this.allTables.set(tableType, tableMap);
                    bundle.release(tableType);
                }
                catch (err_1) {
                    zz.error('[Table] loading error! table:' + tableType + '; err:' + err_1);
                }
            });
        }
        /**
         * TableComponent：获取表所有数据
         * @param tableType 数据表类型名称
         */
        getTable(tableType) {
            if (this.allTables.has(tableType)) {
                return this.allTables.get(tableType);
            }
            return null;
        }
        /**
         * TableComponent：获取表数据项目
         * @param tableType 数据表类型名称
         * @param key 数据表id
         */
        getTableItem(tableType, key) {
            if (this.allTables.has(tableType)) {
                return this.allTables.get(tableType).get(key);
            }
            else {
                console.error('[Table] GetTableItem Error! tableType:' + tableType + '; key:' + key);
                return null;
            }
        }
        /**
         * TableComponent：表是否存在数据项目
         * @param tableType 数据表类型名称
         * @param key 数据表id
         */
        hasTableItem(tableType, key) {
            if (this.allTables.has(tableType)) {
                return this.allTables.get(tableType).has(key);
            }
            else {
                console.error('[Table] HasTableItem Error! tableType' + tableType + '; key:' + key);
                return false;
            }
        }
    }
    /**表格管理 */
    zz.table = new TableMgr();
})(zz || (zz = {}));
/// <reference path="zzLog.ts" />
/// <reference path="zzHelper.ts" />
/// <reference path="zzUtils.ts" />
var zz;
(function (zz) {
    const farPos = cc.v3(10000, 10000, 0);
    class UIBase extends cc.Component {
        /**
         * 在onLoad之后调用; 代替onLoad使用; 注意无法重置; 由于无法确保调用一次, 事件注册不宜置于此;
         * @param args 参数列表
         */
        onOpen(args) { }
        /**代替onDestroy使用 */
        onClose() { }
        /**代替onDiable使用 */
        onHide() { }
        /**代替onEnable使用 */
        onShow() { }
    }
    zz.UIBase = UIBase;
    /**
     * UI管理器;
     * @classdesc 1.以预制体的形式加载;
     * 2.预制体要求全铺居中;
     * 3.分层排布;
     * 4.根节点默认在最上层;
     * 5.需要在UIParam中注册UI枚举/名称/路径/层级;
     * 6.预制体为ui分组
     * 7.UI有专用UI Camera
     * 8.默认UIRoot为所有UI的根节点,位于最上方
     * 9.最上方UI默认为UICommon
     */
    class UIMgr {
        constructor() {
            /**UI根节点; 从外部注入; */
            this._uiRoot = undefined;
            this.uiMap = new Map();
            this.pathMap = new Map();
            this.layerMap = new Map();
            /**加载中标记 */
            this.loadingFlagMap = new Map();
            /**打开中标记; */
            this.openingMap = new Map();
            this.attachMapClient = new Map();
            this.attachMapHost = new Map();
            this.topZIndex = 0;
        }
        get uiRoot() {
            if (!this._uiRoot) {
                this._uiRoot = cc.Canvas.instance.node.getChildByName('UIRoot');
            }
            if (!this._uiRoot) {
                this._uiRoot = cc.director.getScene();
            }
            if (!this._uiRoot.isValid) {
                this._uiRoot = cc.Canvas.instance.node.getChildByName('UIRoot');
                if (!this._uiRoot) {
                    this._uiRoot = cc.director.getScene();
                }
            }
            return this._uiRoot;
        }
        setUIRoot(rootNd) {
            this._uiRoot = rootNd;
        }
        setUIParams(params) {
            params.forEach(v => {
                this.pathMap.set(v.uiName, v.path);
                this.layerMap.set(v.uiName, v.zIndex);
            });
        }
        openUI(uiArgs) {
            return __awaiter(this, void 0, void 0, function* () {
                let uiName = uiArgs.uiName;
                if (this.uiMap.has(uiName)) {
                    let ui = this.uiMap.get(uiName);
                    let uiNd = ui.node;
                    if (uiNd && uiNd.isValid) {
                        this.openUINode(uiNd, uiArgs);
                        this.openUIClass(ui, uiArgs);
                        return undefined;
                    }
                    else {
                        this.uiMap.delete(uiName);
                    }
                }
                if (this.loadingFlagMap.get(uiName)) {
                    zz.warn('[openUI] 正在加载' + uiName);
                    this.openingMap.set(uiName, uiArgs);
                    zz.loadingPage(true, Math.random(), '');
                    return undefined;
                }
                this.loadingFlagMap.set(uiName, true);
                try {
                    const bundle = yield this.getUIBundle(uiName);
                    const prefab_1 = yield new Promise((resolveFn, rejectFn) => {
                        bundle.load(uiName, (completedCount, totalCount, item) => {
                            if (uiArgs.progressArgs) {
                                if (uiArgs.progressArgs.showProgressUI) {
                                    zz.loadingPage(true, completedCount / totalCount, uiArgs.progressArgs.desTxt);
                                }
                            }
                        }, (err, prefab) => {
                            err ? rejectFn(err) : resolveFn(prefab);
                        });
                    });
                    zz.loadingPage(false, 0, '');
                    this.loadingFlagMap.delete(uiName);
                    let uiNode = yield zz.utils.instantiatePrefab(prefab_1);
                    uiNode.parent = this.uiRoot;
                    let ui_2 = uiNode.getComponent(uiName);
                    this.uiMap.set(uiName, ui_2);
                    this.openUINode(uiNode, uiArgs);
                    this.openUIClass(ui_2, uiArgs);
                    if (this.openingMap.has(uiName))
                        this.openingMap.delete(uiName);
                }
                catch (err_1) {
                    zz.error('[openUI] error:' + err_1);
                    return undefined;
                }
            });
        }
        openUINode(uiNd, uiArgs) {
            let uiName = uiArgs.uiName;
            if (!uiNd.parent) {
                uiNd.parent = this.uiRoot;
            }
            if (uiArgs.zIndex) {
                uiNd.zIndex = uiArgs.zIndex;
            }
            else {
                if (this.layerMap.has(uiName)) {
                    let z = this.layerMap.get(uiName);
                    uiNd.zIndex = z;
                    if (this.topZIndex < z)
                        this.topZIndex = z;
                }
                else {
                    uiNd.zIndex = ++this.topZIndex;
                }
            }
            uiNd.x = uiNd.y = 0;
        }
        openUIClass(ui, uiArgs) {
            var _a;
            ui.node.x = ui.node.y = 0;
            ui.node.opacity = 255;
            ui.onOpen(uiArgs.openArgs || []);
            ui.onShow();
            let widget = ui.node.getComponent(cc.Widget);
            if (widget)
                widget.updateAlignment();
            let cb = uiArgs.callbackArgs;
            (_a = cb === null || cb === void 0 ? void 0 : cb.fn) === null || _a === void 0 ? void 0 : _a.call(uiArgs.caller, ...cb.args);
        }
        getUIBundle(uiName) {
            return __awaiter(this, void 0, void 0, function* () {
                let path = this.pathMap.get(uiName);
                if (!path)
                    path = 'resources';
                let bundle = yield zz.utils.getBundle(path);
                return bundle;
            });
        }
        /**从场景中移除UI; 保留本地缓存; */
        closeUI(uiName) {
            if (this.uiMap.has(uiName)) {
                this.hideUI(uiName);
                let ui = this.uiMap.get(uiName);
                ui.node.parent = null;
                ui.onHide();
                ui.onClose();
                if (this.attachMapHost.has(uiName)) {
                    this.attachMapHost.get(uiName).forEach((v, k) => {
                        this.closeUI(k);
                    });
                }
                return true;
            }
            return false;
        }
        preloadUI(uiName) {
            return __awaiter(this, void 0, void 0, function* () {
                if (this.uiMap.has(uiName)) {
                    zz.warn('[preloadUI] 已经加载ui:' + uiName);
                    return undefined;
                }
                if (this.loadingFlagMap.get(uiName)) {
                    zz.warn('[preloadUI] 正在加载' + uiName);
                    return undefined;
                }
                this.loadingFlagMap.set(uiName, true);
                try {
                    const bundle = yield this.getUIBundle(uiName);
                    const prefab_1 = yield new Promise((resolveFn, rejectFn) => {
                        bundle.load(uiName, (err, prefab) => {
                            err ? rejectFn(err) : resolveFn(prefab);
                        });
                    });
                    this.loadingFlagMap.delete(uiName);
                    let uiNode = cc.instantiate(prefab_1);
                    let ui = uiNode.getComponent(uiName);
                    this.uiMap.set(uiName, ui);
                    if (this.openingMap.has(uiName)) {
                        let args = this.openingMap.get(uiName);
                        this.openingMap.delete(uiName);
                        zz.warn('[Preload] 预载中打开了UI:' + uiName + '; 直接打开');
                        zz.loadingPage(false, 0, '');
                        this.openUINode(uiNode, args);
                        this.openUIClass(ui, args);
                    }
                    return uiNode;
                }
                catch (err_1) {
                    zz.error('[preloadUI] error:' + err_1);
                    return undefined;
                }
            });
        }
        /**关闭ui; 移除本地缓存; */
        destroyUI(uiName, resRelease) {
            this.closeUI(uiName);
            let ui = this.uiMap.get(uiName);
            ui === null || ui === void 0 ? void 0 : ui.destroy();
            this.uiMap.delete(uiName);
            if (resRelease) {
                this.getUIBundle(uiName)
                    .then((bundle) => {
                    cc.assetManager.releaseAsset(bundle.get(uiName));
                    bundle.release(uiName, cc.Prefab);
                })
                    .catch(reason => {
                    zz.error('[UIMgr] release ' + uiName + ' fail; reason' + reason);
                });
            }
        }
        showUI(uiName) {
            if (this.uiMap.has(uiName)) {
                let ui = this.uiMap.get(uiName);
                let nd = ui.node;
                if (!nd) {
                    zz.warn('[showUI] ' + uiName + '被close过');
                    return false;
                }
                nd.x = nd.y = 0;
                nd.opacity = 255;
                ui.onShow();
                return true;
            }
            else {
                zz.error('[shouUI] 未加载的UI:' + uiName);
                return false;
            }
        }
        hideUI(uiName) {
            if (this.uiMap.has(uiName)) {
                let ui = this.uiMap.get(uiName);
                let nd = ui.node;
                if (nd) {
                    nd.position = cc.v3(farPos);
                    nd.opacity = 0;
                    ui.onHide();
                    if (this.attachMapHost.has(uiName)) {
                        this.attachMapHost.get(uiName).forEach((v, k) => {
                            this.hideUI(k);
                        });
                    }
                    return true;
                }
                else {
                    return false;
                }
            }
            return false;
        }
        getUI(uiName) {
            return this.uiMap.get(uiName);
        }
        isUIShown(uiName) {
            let ui = this.getUI(uiName);
            if (!ui)
                return false;
            if (!ui.node)
                return false;
            if (!ui.node.active)
                return false;
            if (!ui.node.opacity)
                return false;
            return true;
        }
        reloadUI(uiName) {
            this.destroyUI(uiName, false);
            this.openUI({ uiName: uiName, progressArgs: { showProgressUI: true } });
        }
        /**设置UI之间依附关系; 宿主UI关闭或隐藏时,同时关闭或隐藏附庸UI */
        setUIAttachment(hostUI, clientUI) {
            if (!this.attachMapClient.has(clientUI)) {
                this.attachMapClient.set(clientUI, new Map());
            }
            if (!this.attachMapHost.has(hostUI)) {
                this.attachMapHost.set(hostUI, new Map());
            }
            this.attachMapHost.get(hostUI).set(clientUI, true);
            this.attachMapClient.get(clientUI).set(hostUI, true);
        }
        /**移除UI之间的依附关系 */
        removeUIAttachment(hostUI, clientUI) {
            if (this.attachMapClient.has(clientUI)) {
                this.attachMapClient.get(clientUI).delete(hostUI);
            }
            if (this.attachMapHost.has(hostUI)) {
                this.attachMapHost.get(hostUI).delete(clientUI);
            }
        }
        releaseUI(uiName) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    let bundle = yield this.getUIBundle(uiName);
                    bundle.release(uiName);
                }
                catch (err) {
                    zz.error(err);
                }
            });
        }
    }
    /**UI管理 */
    zz.ui = new UIMgr();
})(zz || (zz = {}));
