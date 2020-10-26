var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var zz;
(function (zz) {
    var BTState;
    (function (BTState) {
        BTState[BTState["Failure"] = 0] = "Failure";
        BTState[BTState["Success"] = 1] = "Success";
        BTState[BTState["Continue"] = 2] = "Continue";
        BTState[BTState["Abort"] = 3] = "Abort";
    })(BTState || (BTState = {}));
    /**Behavior Tree */
    var BT = /** @class */ (function () {
        function BT() {
        }
        BT.Root = function () {
            return new Root();
        };
        BT.Sequence = function () {
            return new Sequence();
        };
        BT.Selector = function (shuffle) {
            if (shuffle === void 0) { shuffle = false; }
            return new Selector(shuffle);
        };
        BT.Call = function (fn) {
            return new Action(fn);
        };
        BT.If = function (fn) {
            return new ConditionalBranch(fn);
        };
        BT.While = function (fn) {
            return new While(fn);
        };
        BT.Condition = function (fn) {
            return new Condition(fn);
        };
        BT.Repeat = function (count) {
            return new Repeat(count);
        };
        BT.Wait = function (seconds) {
            return new Wait(seconds);
        };
        BT.Terminate = function () {
            return new Terminate();
        };
        BT.Log = function (msg) {
            return new Log(msg);
        };
        BT.RandomSequence = function (weights) {
            if (weights === void 0) { weights = null; }
            return new RandomSequence(weights);
        };
        return BT;
    }());
    zz.BT = BT;
    var BTNode = /** @class */ (function () {
        function BTNode() {
        }
        return BTNode;
    }());
    var Branch = /** @class */ (function (_super) {
        __extends(Branch, _super);
        function Branch() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.activeChild = 0;
            _this.children = [];
            return _this;
        }
        Branch.prototype.OpenBranch = function () {
            var _a;
            var children = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                children[_i] = arguments[_i];
            }
            (_a = this.children).push.apply(_a, children);
            return this;
        };
        Branch.prototype.Children = function () {
            return this.children;
        };
        Branch.prototype.ActiveChild = function () {
            return this.activeChild;
        };
        Branch.prototype.ResetChildren = function () {
            this.activeChild = 0;
            this.children.forEach(function (v) {
                if (v instanceof Branch) {
                    v.ResetChildren();
                }
            });
        };
        return Branch;
    }(BTNode));
    var Decorator = /** @class */ (function (_super) {
        __extends(Decorator, _super);
        function Decorator() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Decorator.prototype.Do = function (child) {
            this.child = child;
            return this;
        };
        return Decorator;
    }(BTNode));
    var Sequence = /** @class */ (function (_super) {
        __extends(Sequence, _super);
        function Sequence() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Sequence.prototype.Tick = function () {
            var childState = this.children[this.activeChild].Tick();
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
        };
        return Sequence;
    }(Branch));
    var Selector = /** @class */ (function (_super) {
        __extends(Selector, _super);
        function Selector(shuffle) {
            var _this = _super.call(this) || this;
            if (shuffle) {
                var n = _this.children.length;
                while (n > 1) {
                    n--;
                    var k = zz.int(Math.random() * (n + 1));
                    var val = _this.children[k];
                    _this.children[k] = _this.children[n];
                    _this.children[n] = val;
                }
            }
            return _this;
        }
        Selector.prototype.Tick = function () {
            var childState = this.children[this.activeChild].Tick();
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
        };
        return Selector;
    }(Branch));
    var Block = /** @class */ (function (_super) {
        __extends(Block, _super);
        function Block() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Block.prototype.Tick = function () {
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
        };
        return Block;
    }(Branch));
    var Action = /** @class */ (function (_super) {
        __extends(Action, _super);
        function Action(fn) {
            var _this = _super.call(this) || this;
            _this.fn = fn;
            return _this;
        }
        Action.prototype.Tick = function () {
            if (this.fn) {
                this.fn();
                return BTState.Success;
            }
        };
        Action.prototype.ToString = function () {
            return 'Action : ' + this.fn.name;
        };
        return Action;
    }(BTNode));
    var Condition = /** @class */ (function (_super) {
        __extends(Condition, _super);
        function Condition(fn) {
            var _this = _super.call(this) || this;
            _this.fn = fn;
            return _this;
        }
        Condition.prototype.Tick = function () {
            return this.fn() ? BTState.Success : BTState.Failure;
        };
        Condition.prototype.ToString = function () {
            return 'Conditon : ' + this.fn.name;
        };
        return Condition;
    }(BTNode));
    var Wait = /** @class */ (function (_super) {
        __extends(Wait, _super);
        function Wait(seconds) {
            var _this = _super.call(this) || this;
            _this.seconds = 0;
            _this.future = -1;
            _this.seconds = seconds;
            return _this;
        }
        Wait.prototype.Tick = function () {
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
        };
        return Wait;
    }(BTNode));
    var ConditionalBranch = /** @class */ (function (_super) {
        __extends(ConditionalBranch, _super);
        function ConditionalBranch(fn) {
            var _this = _super.call(this) || this;
            _this.tested = false;
            _this.fn = fn;
            return _this;
        }
        ConditionalBranch.prototype.Tick = function () {
            if (!this.tested) {
                this.tested = this.fn();
            }
            if (this.tested) {
                var result = _super.prototype.Tick.call(this);
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
        };
        ConditionalBranch.prototype.ToString = function () {
            return 'ConditionalBranch : ' + this.fn.name;
        };
        return ConditionalBranch;
    }(Block));
    var While = /** @class */ (function (_super) {
        __extends(While, _super);
        function While(fn) {
            var _this = _super.call(this) || this;
            _this.fn = fn;
            return _this;
        }
        While.prototype.Tick = function () {
            if (this.fn()) {
                _super.prototype.Tick.call(this);
            }
            else {
                // exit the loop
                this.ResetChildren();
                return BTState.Failure;
            }
            return BTState.Continue;
        };
        While.prototype.ToString = function () {
            return 'While : ' + this.fn.name;
        };
        return While;
    }(Block));
    var Root = /** @class */ (function (_super) {
        __extends(Root, _super);
        function Root() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.isTerminated = false;
            return _this;
        }
        Root.prototype.Tick = function () {
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
        };
        return Root;
    }(Block));
    zz.Root = Root;
    var Repeat = /** @class */ (function (_super) {
        __extends(Repeat, _super);
        function Repeat(count) {
            var _this = _super.call(this) || this;
            _this.count = 1;
            _this.currentCount = 0;
            _this.count = count;
            return _this;
        }
        Repeat.prototype.Tick = function () {
            if (this.count > 0 && this.currentCount < this.count) {
                var result = _super.prototype.Tick.call(this);
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
        };
        Repeat.prototype.ToString = function () {
            return 'Repeat Until : ' + this.currentCount + ' / ' + this.count;
        };
        return Repeat;
    }(Block));
    var RandomSequence = /** @class */ (function (_super) {
        __extends(RandomSequence, _super);
        /**
         *
         * @param weight Leave null so that all child node have the same weight
         */
        function RandomSequence(weight) {
            if (weight === void 0) { weight = null; }
            var _this = _super.call(this) || this;
            _this.m_Weight = null;
            _this.m_AddedWeight = null;
            _this.activeChild = -1;
            _this.m_Weight = weight;
            return _this;
        }
        RandomSequence.prototype.OpenBranch = function () {
            var children = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                children[_i] = arguments[_i];
            }
            var len = children.length;
            this.m_AddedWeight = new Array(len);
            for (var i = 0; i < len; i++) {
                var weight = 0;
                var prevWeight = 0;
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
            return _super.prototype.OpenBranch.apply(this, children);
        };
        RandomSequence.prototype.PickNewChild = function () {
            var choice = Math.random() * this.m_AddedWeight[this.m_AddedWeight.length - 1];
            for (var i = 0, len = this.m_AddedWeight.length; i < len; i++) {
                if (choice <= this.m_AddedWeight[i]) {
                    this.activeChild = i;
                    break;
                }
            }
        };
        RandomSequence.prototype.Tick = function () {
            if (this.activeChild == -1) {
                this.PickNewChild();
            }
            var res = this.children[this.activeChild].Tick();
            switch (res) {
                case BTState.Continue:
                    return BTState.Continue;
                default:
                    this.PickNewChild();
                    return res;
            }
        };
        RandomSequence.prototype.ToString = function () {
            return ('Random Sequence : ' + this.activeChild + ' / ' + this.children.length);
        };
        return RandomSequence;
    }(Block));
    var Terminate = /** @class */ (function (_super) {
        __extends(Terminate, _super);
        function Terminate() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Terminate.prototype.Tick = function () {
            return BTState.Abort;
        };
        return Terminate;
    }(BTNode));
    var Log = /** @class */ (function (_super) {
        __extends(Log, _super);
        function Log(msg) {
            var _this = _super.call(this) || this;
            _this.msg = msg;
            return _this;
        }
        Log.prototype.Tick = function () {
            console.log(this.msg);
            return BTState.Success;
        };
        return Log;
    }(BTNode));
})(zz || (zz = {}));
var zz;
(function (zz) {
    /**
     * 获取相对路径节点上的组件
     * @param type component类型
     * @param node 节点
     * @param path 相对于节点的路径
     * @returns {T}
     */
    function findCom(type, node) {
        var path = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            path[_i - 2] = arguments[_i];
        }
        return findNode.apply(void 0, __spreadArrays([node], path)).getComponent(type);
    }
    zz.findCom = findCom;
    /**
     * 获取相对路径上的节点; 记住cc是通过遍历获取的;
     * @param node 基准节点
     * @param path 相对路径
     * @returns {cc.Node}
     */
    function findNode(node) {
        var path = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            path[_i - 1] = arguments[_i];
        }
        return path.reduce(function (node, name) { return node.getChildByName(name); }, node);
    }
    zz.findNode = findNode;
    var tipFn = function (msg) {
        zz.warn('没有注入tip方法');
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
    String.prototype.replaceAll = function (search, replace) {
        var str = this;
        return str.replace(new RegExp(search, 'g'), replace);
    };
    cc.Node.prototype.findCom = function (type) {
        var path = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            path[_i - 1] = arguments[_i];
        }
        var node = this;
        return findCom.apply(void 0, __spreadArrays([type, node], path));
    };
    cc.Node.prototype.findNode = function () {
        var path = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            path[_i] = arguments[_i];
        }
        var node = this;
        return findNode.apply(void 0, __spreadArrays([node], path));
    };
})(zz || (zz = {}));
var zz;
(function (zz) {
    var util;
    (function (util) {
        var _hasOwnProperty = Object.prototype.hasOwnProperty;
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
        function makeString(item, join) {
            if (join === void 0) { join = ','; }
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
                var toret = '{';
                var first = true;
                for (var prop in item) {
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
    var arrays;
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
            var equals = equalsFunction || util.defaultEquals;
            var length = array.length;
            for (var i = 0; i < length; i++) {
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
            var equals = equalsFunction || util.defaultEquals;
            var length = array.length;
            for (var i = length - 1; i >= 0; i--) {
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
            var index = indexOf(array, item, equalsFunction);
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
            var equals = equalsFunction || util.defaultEquals;
            var length = array.length;
            var freq = 0;
            for (var i = 0; i < length; i++) {
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
            var equals = equalsFunction || util.defaultEquals;
            if (array1.length !== array2.length) {
                return false;
            }
            var length = array1.length;
            for (var i = 0; i < length; i++) {
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
            var temp = array[i];
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
            for (var _i = 0, array_1 = array; _i < array_1.length; _i++) {
                var ele = array_1[_i];
                if (callback(ele) === false) {
                    return;
                }
            }
        }
        arrays.forEach = forEach;
    })(arrays = zz.arrays || (zz.arrays = {}));
    var Dictionary = /** @class */ (function () {
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
        function Dictionary(toStrFunction) {
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
        Dictionary.prototype.getValue = function (key) {
            var pair = this.table['$' + this.toStr(key)];
            if (util.isUndefined(pair)) {
                return undefined;
            }
            return pair.value;
        };
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
        Dictionary.prototype.setValue = function (key, value) {
            if (util.isUndefined(key) || util.isUndefined(value)) {
                return undefined;
            }
            var ret;
            var k = '$' + this.toStr(key);
            var previousElement = this.table[k];
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
        };
        /**
         * Removes the mapping for this key from this dictionary if it is present.
         * @param {Object} key key whose mapping is to be removed from the
         * dictionary.
         * @return {*} previous value associated with specified key, or undefined if
         * there was no mapping for key.
         */
        Dictionary.prototype.remove = function (key) {
            var k = '$' + this.toStr(key);
            var previousElement = this.table[k];
            if (!util.isUndefined(previousElement)) {
                delete this.table[k];
                this.nElements--;
                return previousElement.value;
            }
            return undefined;
        };
        /**
         * Returns an array containing all of the keys in this dictionary.
         * @return {Array} an array containing all of the keys in this dictionary.
         */
        Dictionary.prototype.keys = function () {
            var array = [];
            for (var name_1 in this.table) {
                if (util.has(this.table, name_1)) {
                    var pair = this.table[name_1];
                    array.push(pair.key);
                }
            }
            return array;
        };
        /**
         * Returns an array containing all of the values in this dictionary.
         * @return {Array} an array containing all of the values in this dictionary.
         */
        Dictionary.prototype.values = function () {
            var array = [];
            for (var name_2 in this.table) {
                if (util.has(this.table, name_2)) {
                    var pair = this.table[name_2];
                    array.push(pair.value);
                }
            }
            return array;
        };
        /**
         * Executes the provided function once for each key-value pair
         * present in this dictionary.
         * @param {function(Object,Object):*} callback function to execute, it is
         * invoked with two arguments: key and value. To break the iteration you can
         * optionally return false.
         */
        Dictionary.prototype.forEach = function (callback) {
            for (var name_3 in this.table) {
                if (util.has(this.table, name_3)) {
                    var pair = this.table[name_3];
                    var ret = callback(pair.key, pair.value);
                    if (ret === false) {
                        return;
                    }
                }
            }
        };
        /**
         * Returns true if this dictionary contains a mapping for the specified key.
         * @param {Object} key key whose presence in this dictionary is to be
         * tested.
         * @return {boolean} true if this dictionary contains a mapping for the
         * specified key.
         */
        Dictionary.prototype.containsKey = function (key) {
            var a = this.getValue(key);
            return !util.isUndefined(this.getValue(key));
        };
        /**
         * Removes all mappings from this dictionary.
         * @this {util.Dictionary}
         */
        Dictionary.prototype.clear = function () {
            this.table = {};
            this.nElements = 0;
        };
        /**
         * Returns the number of keys in this dictionary.
         * @return {number} the number of key-value mappings in this dictionary.
         */
        Dictionary.prototype.size = function () {
            return this.nElements;
        };
        /**
         * Returns true if this dictionary contains no mappings.
         * @return {boolean} true if this dictionary contains no mappings.
         */
        Dictionary.prototype.isEmpty = function () {
            return this.nElements <= 0;
        };
        Dictionary.prototype.toString = function () {
            var toret = '{';
            this.forEach(function (k, v) {
                toret += "\n\t" + k + " : " + v;
            });
            return toret + '\n}';
        };
        return Dictionary;
    }());
    zz.Dictionary = Dictionary;
    var LinkedList = /** @class */ (function () {
        /**
         * Creates an empty Linked List.
         * @class A linked list is a data structure consisting of a group of nodes
         * which together represent a sequence.
         * @constructor
         */
        function LinkedList() {
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
        LinkedList.prototype.add = function (item, index) {
            if (util.isUndefined(index)) {
                index = this.nElements;
            }
            if (index < 0 || index > this.nElements || util.isUndefined(item)) {
                return false;
            }
            var newNode = this.createNode(item);
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
                var prev = this.nodeAtIndex(index - 1);
                newNode.next = prev.next;
                prev.next = newNode;
            }
            this.nElements++;
            return true;
        };
        /**
         * Returns the first element in this list.
         * @return {*} the first element of the list or undefined if the list is
         * empty.
         */
        LinkedList.prototype.first = function () {
            if (this.firstNode !== null) {
                return this.firstNode.element;
            }
            return undefined;
        };
        /**
         * Returns the last element in this list.
         * @return {*} the last element in the list or undefined if the list is
         * empty.
         */
        LinkedList.prototype.last = function () {
            if (this.lastNode !== null) {
                return this.lastNode.element;
            }
            return undefined;
        };
        /**
         * Returns the element at the specified position in this list.
         * @param {number} index desired index.
         * @return {*} the element at the given index or undefined if the index is
         * out of bounds.
         */
        LinkedList.prototype.elementAtIndex = function (index) {
            var node = this.nodeAtIndex(index);
            if (node === null) {
                return undefined;
            }
            return node.element;
        };
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
        LinkedList.prototype.indexOf = function (item, equalsFunction) {
            var equalsF = equalsFunction || util.defaultEquals;
            if (util.isUndefined(item)) {
                return -1;
            }
            var currentNode = this.firstNode;
            var index = 0;
            while (currentNode !== null) {
                if (equalsF(currentNode.element, item)) {
                    return index;
                }
                index++;
                currentNode = currentNode.next;
            }
            return -1;
        };
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
        LinkedList.prototype.contains = function (item, equalsFunction) {
            return this.indexOf(item, equalsFunction) >= 0;
        };
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
        LinkedList.prototype.remove = function (item, equalsFunction) {
            var equalsF = equalsFunction || util.defaultEquals;
            if (this.nElements < 1 || util.isUndefined(item)) {
                return false;
            }
            var previous = null;
            var currentNode = this.firstNode;
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
        };
        /**
         * Removes all of the elements from this list.
         */
        LinkedList.prototype.clear = function () {
            this.firstNode = null;
            this.lastNode = null;
            this.nElements = 0;
        };
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
        LinkedList.prototype.equals = function (other, equalsFunction) {
            var eqF = equalsFunction || util.defaultEquals;
            if (!(other instanceof LinkedList)) {
                return false;
            }
            if (this.size() !== other.size()) {
                return false;
            }
            return this.equalsAux(this.firstNode, other.firstNode, eqF);
        };
        /**
         * @private
         */
        LinkedList.prototype.equalsAux = function (n1, n2, eqF) {
            while (n1 !== null) {
                if (!eqF(n1.element, n2.element)) {
                    return false;
                }
                n1 = n1.next;
                n2 = n2.next;
            }
            return true;
        };
        /**
         * Removes the element at the specified position in this list.
         * @param {number} index given index.
         * @return {*} removed element or undefined if the index is out of bounds.
         */
        LinkedList.prototype.removeElementAtIndex = function (index) {
            if (index < 0 || index >= this.nElements) {
                return undefined;
            }
            var element;
            if (this.nElements === 1) {
                //First node in the list.
                element = this.firstNode.element;
                this.firstNode = null;
                this.lastNode = null;
            }
            else {
                var previous = this.nodeAtIndex(index - 1);
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
        };
        /**
         * Executes the provided function once for each element present in this list in order.
         * @param {function(Object):*} callback function to execute, it is
         * invoked with one argument: the element value, to break the iteration you can
         * optionally return false.
         */
        LinkedList.prototype.forEach = function (callback) {
            var currentNode = this.firstNode;
            while (currentNode !== null) {
                if (callback(currentNode.element) === false) {
                    break;
                }
                currentNode = currentNode.next;
            }
        };
        /**
         * Reverses the order of the elements in this linked list (makes the last
         * element first, and the first element last).
         */
        LinkedList.prototype.reverse = function () {
            var previous = null;
            var current = this.firstNode;
            var temp = null;
            while (current !== null) {
                temp = current.next;
                current.next = previous;
                previous = current;
                current = temp;
            }
            temp = this.firstNode;
            this.firstNode = this.lastNode;
            this.lastNode = temp;
        };
        /**
         * Returns an array containing all of the elements in this list in proper
         * sequence.
         * @return {Array.<*>} an array containing all of the elements in this list,
         * in proper sequence.
         */
        LinkedList.prototype.toArray = function () {
            var array = [];
            var currentNode = this.firstNode;
            while (currentNode !== null) {
                array.push(currentNode.element);
                currentNode = currentNode.next;
            }
            return array;
        };
        /**
         * Returns the number of elements in this list.
         * @return {number} the number of elements in this list.
         */
        LinkedList.prototype.size = function () {
            return this.nElements;
        };
        /**
         * Returns true if this list contains no elements.
         * @return {boolean} true if this list contains no elements.
         */
        LinkedList.prototype.isEmpty = function () {
            return this.nElements <= 0;
        };
        LinkedList.prototype.toString = function () {
            return arrays.toString(this.toArray());
        };
        /**
         * @private
         */
        LinkedList.prototype.nodeAtIndex = function (index) {
            if (index < 0 || index >= this.nElements) {
                return null;
            }
            if (index === this.nElements - 1) {
                return this.lastNode;
            }
            var node = this.firstNode;
            for (var i = 0; i < index; i++) {
                node = node.next;
            }
            return node;
        };
        /**
         * @private
         */
        LinkedList.prototype.createNode = function (item) {
            return {
                element: item,
                next: null,
            };
        };
        return LinkedList;
    }());
    zz.LinkedList = LinkedList;
    /**MinHeap default; MaxHeap for reverseComparison */
    var Heap = /** @class */ (function () {
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
        function Heap(compareFunction) {
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
        Heap.prototype.leftChildIndex = function (nodeIndex) {
            return 2 * nodeIndex + 1;
        };
        /**
         * Returns the index of the right child of the node at the given index.
         * @param {number} nodeIndex The index of the node to get the right child
         * for.
         * @return {number} The index of the right child.
         * @private
         */
        Heap.prototype.rightChildIndex = function (nodeIndex) {
            return 2 * nodeIndex + 2;
        };
        /**
         * Returns the index of the parent of the node at the given index.
         * @param {number} nodeIndex The index of the node to get the parent for.
         * @return {number} The index of the parent.
         * @private
         */
        Heap.prototype.parentIndex = function (nodeIndex) {
            return Math.floor((nodeIndex - 1) / 2);
        };
        /**
         * Returns the index of the smaller child node (if it exists).
         * @param {number} leftChild left child index.
         * @param {number} rightChild right child index.
         * @return {number} the index with the minimum value or -1 if it doesn't
         * exists.
         * @private
         */
        Heap.prototype.minIndex = function (leftChild, rightChild) {
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
        };
        /**
         * Moves the node at the given index up to its proper place in the heap.
         * @param {number} index The index of the node to move up.
         * @private
         */
        Heap.prototype.siftUp = function (index) {
            var parent = this.parentIndex(index);
            while (index > 0 &&
                this.compare(this.data[parent], this.data[index]) > 0) {
                arrays.swap(this.data, parent, index);
                index = parent;
                parent = this.parentIndex(index);
            }
        };
        /**
         * Moves the node at the given index down to its proper place in the heap.
         * @param {number} nodeIndex The index of the node to move down.
         * @private
         */
        Heap.prototype.siftDown = function (nodeIndex) {
            //smaller child index
            var min = this.minIndex(this.leftChildIndex(nodeIndex), this.rightChildIndex(nodeIndex));
            while (min >= 0 &&
                this.compare(this.data[nodeIndex], this.data[min]) > 0) {
                arrays.swap(this.data, min, nodeIndex);
                nodeIndex = min;
                min = this.minIndex(this.leftChildIndex(nodeIndex), this.rightChildIndex(nodeIndex));
            }
        };
        /**
         * Retrieves but does not remove the root element of this heap.
         * @return {*} The value at the root of the heap. Returns undefined if the
         * heap is empty.
         */
        Heap.prototype.peek = function () {
            if (this.data.length > 0) {
                return this.data[0];
            }
            else {
                return undefined;
            }
        };
        /**
         * Adds the given element into the heap.
         * @param {*} element the element.
         * @return true if the element was added or fals if it is undefined.
         */
        Heap.prototype.add = function (element) {
            if (util.isUndefined(element)) {
                return undefined;
            }
            this.data.push(element);
            this.siftUp(this.data.length - 1);
            return true;
        };
        /**
         * Retrieves and removes the root element of this heap.
         * @return {*} The value removed from the root of the heap. Returns
         * undefined if the heap is empty.
         */
        Heap.prototype.removeRoot = function () {
            if (this.data.length > 0) {
                var obj = this.data[0];
                this.data[0] = this.data[this.data.length - 1];
                this.data.splice(this.data.length - 1, 1);
                if (this.data.length > 0) {
                    this.siftDown(0);
                }
                return obj;
            }
            return undefined;
        };
        /**
         * Returns true if this heap contains the specified element.
         * @param {Object} element element to search for.
         * @return {boolean} true if this Heap contains the specified element, false
         * otherwise.
         */
        Heap.prototype.contains = function (element) {
            var equF = util.compareToEquals(this.compare);
            return arrays.contains(this.data, element, equF);
        };
        /**
         * Returns the number of elements in this heap.
         * @return {number} the number of elements in this heap.
         */
        Heap.prototype.size = function () {
            return this.data.length;
        };
        /**
         * Checks if this heap is empty.
         * @return {boolean} true if and only if this heap contains no items; false
         * otherwise.
         */
        Heap.prototype.isEmpty = function () {
            return this.data.length <= 0;
        };
        /**
         * Removes all of the elements from this heap.
         */
        Heap.prototype.clear = function () {
            this.data.length = 0;
        };
        /**
         * Executes the provided function once for each element present in this heap in
         * no particular order.
         * @param {function(Object):*} callback function to execute, it is
         * invoked with one argument: the element value, to break the iteration you can
         * optionally return false.
         */
        Heap.prototype.forEach = function (callback) {
            arrays.forEach(this.data, callback);
        };
        return Heap;
    }());
    zz.Heap = Heap;
    var Set = /** @class */ (function () {
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
        function Set(toStringFunction) {
            this.dictionary = new Dictionary(toStringFunction);
        }
        /**
         * Returns true if this set contains the specified element.
         * @param {Object} element element to search for.
         * @return {boolean} true if this set contains the specified element,
         * false otherwise.
         */
        Set.prototype.contains = function (element) {
            return this.dictionary.containsKey(element);
        };
        /**
         * Adds the specified element to this set if it is not already present.
         * @param {Object} element the element to insert.
         * @return {boolean} true if this set did not already contain the specified element.
         */
        Set.prototype.add = function (element) {
            if (this.contains(element) || util.isUndefined(element)) {
                return false;
            }
            else {
                this.dictionary.setValue(element, element);
                return true;
            }
        };
        /**
         * Performs an intersecion between this an another set.
         * Removes all values that are not present this set and the given set.
         * @param {collections.Set} otherSet other set.
         */
        Set.prototype.intersection = function (otherSet) {
            var set = this;
            this.forEach(function (element) {
                if (!otherSet.contains(element)) {
                    set.remove(element);
                }
                return true;
            });
        };
        /**
         * Performs a union between this an another set.
         * Adds all values from the given set to this set.
         * @param {collections.Set} otherSet other set.
         */
        Set.prototype.union = function (otherSet) {
            var set = this;
            otherSet.forEach(function (element) {
                set.add(element);
                return true;
            });
        };
        /**
         * Performs a difference between this an another set.
         * Removes from this set all the values that are present in the given set.
         * @param {collections.Set} otherSet other set.
         */
        Set.prototype.difference = function (otherSet) {
            var set = this;
            otherSet.forEach(function (element) {
                set.remove(element);
                return true;
            });
        };
        /**
         * Checks whether the given set contains all the elements in this set.
         * @param {collections.Set} otherSet other set.
         * @return {boolean} true if this set is a subset of the given set.
         */
        Set.prototype.isSubsetOf = function (otherSet) {
            if (this.size() > otherSet.size()) {
                return false;
            }
            var isSub = true;
            this.forEach(function (element) {
                if (!otherSet.contains(element)) {
                    isSub = false;
                    return false;
                }
                return true;
            });
            return isSub;
        };
        /**
         * Removes the specified element from this set if it is present.
         * @return {boolean} true if this set contained the specified element.
         */
        Set.prototype.remove = function (element) {
            if (!this.contains(element)) {
                return false;
            }
            else {
                this.dictionary.remove(element);
                return true;
            }
        };
        /**
         * Executes the provided function once for each element
         * present in this set.
         * @param {function(Object):*} callback function to execute, it is
         * invoked with one arguments: the element. To break the iteration you can
         * optionally return false.
         */
        Set.prototype.forEach = function (callback) {
            this.dictionary.forEach(function (k, v) {
                return callback(v);
            });
        };
        /**
         * Returns an array containing all of the elements in this set in arbitrary order.
         * @return {Array} an array containing all of the elements in this set.
         */
        Set.prototype.toArray = function () {
            return this.dictionary.values();
        };
        /**
         * Returns true if this set contains no elements.
         * @return {boolean} true if this set contains no elements.
         */
        Set.prototype.isEmpty = function () {
            return this.dictionary.isEmpty();
        };
        /**
         * Returns the number of elements in this set.
         * @return {number} the number of elements in this set.
         */
        Set.prototype.size = function () {
            return this.dictionary.size();
        };
        /**
         * Removes all of the elements from this set.
         */
        Set.prototype.clear = function () {
            this.dictionary.clear();
        };
        /*
         * Provides a string representation for display
         */
        Set.prototype.toString = function () {
            return arrays.toString(this.toArray());
        };
        return Set;
    }());
    zz.Set = Set;
    var Queue = /** @class */ (function () {
        /**
         * Creates an empty queue.
         * @class A queue is a First-In-First-Out (FIFO) data structure, the first
         * element added to the queue will be the first one to be removed. This
         * implementation uses a linked list as a container.
         * @constructor
         */
        function Queue() {
            this.list = new LinkedList();
        }
        /**
         * Inserts the specified element into the end of this queue.
         * @param {Object} elem the element to insert.
         * @return {boolean} true if the element was inserted, or false if it is undefined.
         */
        Queue.prototype.enqueue = function (elem) {
            return this.list.add(elem);
        };
        /**
         * Inserts the specified element into the end of this queue.
         * @param {Object} elem the element to insert.
         * @return {boolean} true if the element was inserted, or false if it is undefined.
         */
        Queue.prototype.add = function (elem) {
            return this.list.add(elem);
        };
        /**
         * Retrieves and removes the head of this queue.
         * @return {*} the head of this queue, or undefined if this queue is empty.
         */
        Queue.prototype.dequeue = function () {
            if (this.list.size() !== 0) {
                var el = this.list.first();
                this.list.removeElementAtIndex(0);
                return el;
            }
            return undefined;
        };
        /**
         * Retrieves, but does not remove, the head of this queue.
         * @return {*} the head of this queue, or undefined if this queue is empty.
         */
        Queue.prototype.peek = function () {
            if (this.list.size() !== 0) {
                return this.list.first();
            }
            return undefined;
        };
        /**
         * Returns the number of elements in this queue.
         * @return {number} the number of elements in this queue.
         */
        Queue.prototype.size = function () {
            return this.list.size();
        };
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
        Queue.prototype.contains = function (elem, equalsFunction) {
            return this.list.contains(elem, equalsFunction);
        };
        /**
         * Checks if this queue is empty.
         * @return {boolean} true if and only if this queue contains no items; false
         * otherwise.
         */
        Queue.prototype.isEmpty = function () {
            return this.list.size() <= 0;
        };
        /**
         * Removes all of the elements from this queue.
         */
        Queue.prototype.clear = function () {
            this.list.clear();
        };
        /**
         * Executes the provided function once for each element present in this queue in
         * FIFO order.
         * @param {function(Object):*} callback function to execute, it is
         * invoked with one argument: the element value, to break the iteration you can
         * optionally return false.
         */
        Queue.prototype.forEach = function (callback) {
            this.list.forEach(callback);
        };
        return Queue;
    }());
    zz.Queue = Queue;
    var PriorityQueue = /** @class */ (function () {
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
        function PriorityQueue(compareFunction) {
            this.heap = new Heap(util.reverseCompareFunction(compareFunction));
        }
        /**
         * Inserts the specified element into this priority queue.
         * @param {Object} element the element to insert.
         * @return {boolean} true if the element was inserted, or false if it is undefined.
         */
        PriorityQueue.prototype.enqueue = function (element) {
            return this.heap.add(element);
        };
        /**
         * Inserts the specified element into this priority queue.
         * @param {Object} element the element to insert.
         * @return {boolean} true if the element was inserted, or false if it is undefined.
         */
        PriorityQueue.prototype.add = function (element) {
            return this.heap.add(element);
        };
        /**
         * Retrieves and removes the highest priority element of this queue.
         * @return {*} the the highest priority element of this queue,
         *  or undefined if this queue is empty.
         */
        PriorityQueue.prototype.dequeue = function () {
            if (this.heap.size() !== 0) {
                var el = this.heap.peek();
                this.heap.removeRoot();
                return el;
            }
            return undefined;
        };
        /**
         * Retrieves, but does not remove, the highest priority element of this queue.
         * @return {*} the highest priority element of this queue, or undefined if this queue is empty.
         */
        PriorityQueue.prototype.peek = function () {
            return this.heap.peek();
        };
        /**
         * Returns true if this priority queue contains the specified element.
         * @param {Object} element element to search for.
         * @return {boolean} true if this priority queue contains the specified element,
         * false otherwise.
         */
        PriorityQueue.prototype.contains = function (element) {
            return this.heap.contains(element);
        };
        /**
         * Checks if this priority queue is empty.
         * @return {boolean} true if and only if this priority queue contains no items; false
         * otherwise.
         */
        PriorityQueue.prototype.isEmpty = function () {
            return this.heap.isEmpty();
        };
        /**
         * Returns the number of elements in this priority queue.
         * @return {number} the number of elements in this priority queue.
         */
        PriorityQueue.prototype.size = function () {
            return this.heap.size();
        };
        /**
         * Removes all of the elements from this priority queue.
         */
        PriorityQueue.prototype.clear = function () {
            this.heap.clear();
        };
        /**
         * Executes the provided function once for each element present in this queue in
         * no particular order.
         * @param {function(Object):*} callback function to execute, it is
         * invoked with one argument: the element value, to break the iteration you can
         * optionally return false.
         */
        PriorityQueue.prototype.forEach = function (callback) {
            this.heap.forEach(callback);
        };
        return PriorityQueue;
    }());
    zz.PriorityQueue = PriorityQueue;
    var Stack = /** @class */ (function () {
        /**
         * Creates an empty Stack.
         * @class A Stack is a Last-In-First-Out (LIFO) data structure, the last
         * element added to the stack will be the first one to be removed. This
         * implementation uses a linked list as a container.
         * @constructor
         */
        function Stack() {
            this.list = new LinkedList();
        }
        /**
         * Pushes an item onto the top of this stack.
         * @param {Object} elem the element to be pushed onto this stack.
         * @return {boolean} true if the element was pushed or false if it is undefined.
         */
        Stack.prototype.push = function (elem) {
            return this.list.add(elem, 0);
        };
        /**
         * Pushes an item onto the top of this stack.
         * @param {Object} elem the element to be pushed onto this stack.
         * @return {boolean} true if the element was pushed or false if it is undefined.
         */
        Stack.prototype.add = function (elem) {
            return this.list.add(elem, 0);
        };
        /**
         * Removes the object at the top of this stack and returns that object.
         * @return {*} the object at the top of this stack or undefined if the
         * stack is empty.
         */
        Stack.prototype.pop = function () {
            return this.list.removeElementAtIndex(0);
        };
        /**
         * Looks at the object at the top of this stack without removing it from the
         * stack.
         * @return {*} the object at the top of this stack or undefined if the
         * stack is empty.
         */
        Stack.prototype.peek = function () {
            return this.list.first();
        };
        /**
         * Returns the number of elements in this stack.
         * @return {number} the number of elements in this stack.
         */
        Stack.prototype.size = function () {
            return this.list.size();
        };
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
        Stack.prototype.contains = function (elem, equalsFunction) {
            return this.list.contains(elem, equalsFunction);
        };
        /**
         * Checks if this stack is empty.
         * @return {boolean} true if and only if this stack contains no items; false
         * otherwise.
         */
        Stack.prototype.isEmpty = function () {
            return this.list.isEmpty();
        };
        /**
         * Removes all of the elements from this stack.
         */
        Stack.prototype.clear = function () {
            this.list.clear();
        };
        /**
         * Executes the provided function once for each element present in this stack in
         * LIFO order.
         * @param {function(Object):*} callback function to execute, it is
         * invoked with one argument: the element value, to break the iteration you can
         * optionally return false.
         */
        Stack.prototype.forEach = function (callback) {
            this.list.forEach(callback);
        };
        return Stack;
    }());
    zz.Stack = Stack;
    var Bag = /** @class */ (function () {
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
        function Bag(toStrFunction) {
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
        Bag.prototype.add = function (element, nCopies) {
            if (nCopies === void 0) { nCopies = 1; }
            if (util.isUndefined(element) || nCopies <= 0) {
                return false;
            }
            if (!this.contains(element)) {
                var node = {
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
        };
        /**
         * Counts the number of copies of the specified object in this bag.
         * @param {Object} element the object to search for..
         * @return {number} the number of copies of the object, 0 if not found
         */
        Bag.prototype.count = function (element) {
            if (!this.contains(element)) {
                return 0;
            }
            else {
                return this.dictionary.getValue(element).copies;
            }
        };
        /**
         * Returns true if this bag contains the specified element.
         * @param {Object} element element to search for.
         * @return {boolean} true if this bag contains the specified element,
         * false otherwise.
         */
        Bag.prototype.contains = function (element) {
            return this.dictionary.containsKey(element);
        };
        /**
         * Removes nCopies of the specified object to this bag.
         * If the number of copies to remove is greater than the actual number
         * of copies in the Bag, all copies are removed.
         * @param {Object} element element to remove.
         * @param {number=} nCopies the number of copies to remove, if this argument is
         * undefined 1 copy is removed.
         * @return {boolean} true if at least 1 element was removed.
         */
        Bag.prototype.remove = function (element, nCopies) {
            if (nCopies === void 0) { nCopies = 1; }
            if (util.isUndefined(element) || nCopies <= 0) {
                return false;
            }
            if (!this.contains(element)) {
                return false;
            }
            else {
                var node = this.dictionary.getValue(element);
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
        };
        /**
         * Returns an array containing all of the elements in this big in arbitrary order,
         * including multiple copies.
         * @return {Array} an array containing all of the elements in this bag.
         */
        Bag.prototype.toArray = function () {
            var a = [];
            var values = this.dictionary.values();
            for (var _i = 0, values_1 = values; _i < values_1.length; _i++) {
                var node = values_1[_i];
                var element = node.value;
                var copies = node.copies;
                for (var j = 0; j < copies; j++) {
                    a.push(element);
                }
            }
            return a;
        };
        /**
         * Returns a set of unique elements in this bag.
         * @return {collections.Set<T>} a set of unique elements in this bag.
         */
        Bag.prototype.toSet = function () {
            var toret = new Set(this.toStrF);
            var elements = this.dictionary.values();
            for (var _i = 0, elements_1 = elements; _i < elements_1.length; _i++) {
                var ele = elements_1[_i];
                var value = ele.value;
                toret.add(value);
            }
            return toret;
        };
        /**
         * Executes the provided function once for each element
         * present in this bag, including multiple copies.
         * @param {function(Object):*} callback function to execute, it is
         * invoked with one argument: the element. To break the iteration you can
         * optionally return false.
         */
        Bag.prototype.forEach = function (callback) {
            this.dictionary.forEach(function (k, v) {
                var value = v.value;
                var copies = v.copies;
                for (var i = 0; i < copies; i++) {
                    if (callback(value) === false) {
                        return false;
                    }
                }
                return true;
            });
        };
        /**
         * Returns the number of elements in this bag.
         * @return {number} the number of elements in this bag.
         */
        Bag.prototype.size = function () {
            return this.nElements;
        };
        /**
         * Returns true if this bag contains no elements.
         * @return {boolean} true if this bag contains no elements.
         */
        Bag.prototype.isEmpty = function () {
            return this.nElements === 0;
        };
        /**
         * Removes all of the elements from this bag.
         */
        Bag.prototype.clear = function () {
            this.nElements = 0;
            this.dictionary.clear();
        };
        return Bag;
    }());
    zz.Bag = Bag;
    var BSTree = /** @class */ (function () {
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
        function BSTree(compareFunction) {
            this.root = null;
            this.compare = compareFunction || util.defaultCompare;
            this.nElements = 0;
        }
        /**
         * Adds the specified element to this tree if it is not already present.
         * @param {Object} element the element to insert.
         * @return {boolean} true if this tree did not already contain the specified element.
         */
        BSTree.prototype.add = function (element) {
            if (util.isUndefined(element)) {
                return false;
            }
            if (this.insertNode(this.createNode(element)) !== null) {
                this.nElements++;
                return true;
            }
            return false;
        };
        /**
         * Removes all of the elements from this tree.
         */
        BSTree.prototype.clear = function () {
            this.root = null;
            this.nElements = 0;
        };
        /**
         * Returns true if this tree contains no elements.
         * @return {boolean} true if this tree contains no elements.
         */
        BSTree.prototype.isEmpty = function () {
            return this.nElements === 0;
        };
        /**
         * Returns the number of elements in this tree.
         * @return {number} the number of elements in this tree.
         */
        BSTree.prototype.size = function () {
            return this.nElements;
        };
        /**
         * Returns true if this tree contains the specified element.
         * @param {Object} element element to search for.
         * @return {boolean} true if this tree contains the specified element,
         * false otherwise.
         */
        BSTree.prototype.contains = function (element) {
            if (util.isUndefined(element)) {
                return false;
            }
            return this.searchNode(this.root, element) !== null;
        };
        /**
         * Removes the specified element from this tree if it is present.
         * @return {boolean} true if this tree contained the specified element.
         */
        BSTree.prototype.remove = function (element) {
            var node = this.searchNode(this.root, element);
            if (node === null) {
                return false;
            }
            this.removeNode(node);
            this.nElements--;
            return true;
        };
        /**
         * Executes the provided function once for each element present in this tree in
         * in-order.
         * @param {function(Object):*} callback function to execute, it is invoked with one
         * argument: the element value, to break the iteration you can optionally return false.
         */
        BSTree.prototype.inorderTraversal = function (callback) {
            this.inorderTraversalAux(this.root, callback, {
                stop: false,
            });
        };
        /**
         * Executes the provided function once for each element present in this tree in pre-order.
         * @param {function(Object):*} callback function to execute, it is invoked with one
         * argument: the element value, to break the iteration you can optionally return false.
         */
        BSTree.prototype.preorderTraversal = function (callback) {
            this.preorderTraversalAux(this.root, callback, {
                stop: false,
            });
        };
        /**
         * Executes the provided function once for each element present in this tree in post-order.
         * @param {function(Object):*} callback function to execute, it is invoked with one
         * argument: the element value, to break the iteration you can optionally return false.
         */
        BSTree.prototype.postorderTraversal = function (callback) {
            this.postorderTraversalAux(this.root, callback, {
                stop: false,
            });
        };
        /**
         * Executes the provided function once for each element present in this tree in
         * level-order.
         * @param {function(Object):*} callback function to execute, it is invoked with one
         * argument: the element value, to break the iteration you can optionally return false.
         */
        BSTree.prototype.levelTraversal = function (callback) {
            this.levelTraversalAux(this.root, callback);
        };
        /**
         * Returns the minimum element of this tree.
         * @return {*} the minimum element of this tree or undefined if this tree is
         * is empty.
         */
        BSTree.prototype.minimum = function () {
            if (this.isEmpty()) {
                return undefined;
            }
            return this.minimumAux(this.root).element;
        };
        /**
         * Returns the maximum element of this tree.
         * @return {*} the maximum element of this tree or undefined if this tree is
         * is empty.
         */
        BSTree.prototype.maximum = function () {
            if (this.isEmpty()) {
                return undefined;
            }
            return this.maximumAux(this.root).element;
        };
        /**
         * Executes the provided function once for each element present in this tree in inorder.
         * Equivalent to inorderTraversal.
         * @param {function(Object):*} callback function to execute, it is
         * invoked with one argument: the element value, to break the iteration you can
         * optionally return false.
         */
        BSTree.prototype.forEach = function (callback) {
            this.inorderTraversal(callback);
        };
        /**
         * Returns an array containing all of the elements in this tree in in-order.
         * @return {Array} an array containing all of the elements in this tree in in-order.
         */
        BSTree.prototype.toArray = function () {
            var array = [];
            this.inorderTraversal(function (element) {
                array.push(element);
                return true;
            });
            return array;
        };
        /**
         * Returns the height of this tree.
         * @return {number} the height of this tree or -1 if is empty.
         */
        BSTree.prototype.height = function () {
            return this.heightAux(this.root);
        };
        /**
         * @private
         */
        BSTree.prototype.searchNode = function (node, element) {
            var cmp = null;
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
        };
        /**
         * @private
         */
        BSTree.prototype.transplant = function (n1, n2) {
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
        };
        /**
         * @private
         */
        BSTree.prototype.removeNode = function (node) {
            if (node.leftCh === null) {
                this.transplant(node, node.rightCh);
            }
            else if (node.rightCh === null) {
                this.transplant(node, node.leftCh);
            }
            else {
                var y = this.minimumAux(node.rightCh);
                if (y.parent !== node) {
                    this.transplant(y, y.rightCh);
                    y.rightCh = node.rightCh;
                    y.rightCh.parent = y;
                }
                this.transplant(node, y);
                y.leftCh = node.leftCh;
                y.leftCh.parent = y;
            }
        };
        /**
         * @private
         */
        BSTree.prototype.inorderTraversalAux = function (node, callback, signal) {
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
        };
        /**
         * @private
         */
        BSTree.prototype.levelTraversalAux = function (node, callback) {
            var queue = new Queue();
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
        };
        /**
         * @private
         */
        BSTree.prototype.preorderTraversalAux = function (node, callback, signal) {
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
        };
        /**
         * @private
         */
        BSTree.prototype.postorderTraversalAux = function (node, callback, signal) {
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
        };
        /**
         * @private
         */
        BSTree.prototype.minimumAux = function (node) {
            while (node.leftCh !== null) {
                node = node.leftCh;
            }
            return node;
        };
        /**
         * @private
         */
        BSTree.prototype.maximumAux = function (node) {
            while (node.rightCh !== null) {
                node = node.rightCh;
            }
            return node;
        };
        /**
         * @private
         */
        BSTree.prototype.heightAux = function (node) {
            if (node === null) {
                return -1;
            }
            return (Math.max(this.heightAux(node.leftCh), this.heightAux(node.rightCh)) + 1);
        };
        /*
         * @private
         */
        BSTree.prototype.insertNode = function (node) {
            var parent = null;
            var position = this.root;
            var cmp = null;
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
        };
        /**
         * @private
         */
        BSTree.prototype.createNode = function (element) {
            return {
                element: element,
                leftCh: null,
                rightCh: null,
                parent: null,
            };
        };
        return BSTree;
    }());
    zz.BSTree = BSTree;
    var FactoryDictionary = /** @class */ (function (_super) {
        __extends(FactoryDictionary, _super);
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
        function FactoryDictionary(defaultFactoryFunction, toStrFunction) {
            var _this_1 = _super.call(this, toStrFunction) || this;
            _this_1.defaultFactoryFunction = defaultFactoryFunction;
            return _this_1;
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
        FactoryDictionary.prototype.setDefault = function (key, defaultValue) {
            var currentValue = _super.prototype.getValue.call(this, key);
            if (util.isUndefined(currentValue)) {
                this.setValue(key, defaultValue);
                return defaultValue;
            }
            return currentValue;
        };
        /**
         * Returns the value to which this dictionary maps the specified key.
         * Returns a default value created by the factory passed in the constructor,
         * if this dictionary contains no mapping for this key. The missing key will
         * automatically be added to the dictionary.
         * @param {Object} key key whose associated value is to be returned.
         * @return {*} the value to which this dictionary maps the specified key or
         * a default value if the map contains no mapping for this key.
         */
        FactoryDictionary.prototype.getValue = function (key) {
            return this.setDefault(key, this.defaultFactoryFunction());
        };
        return FactoryDictionary;
    }(Dictionary));
    zz.FactoryDictionary = FactoryDictionary;
    var MultiDictionary = /** @class */ (function () {
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
        function MultiDictionary(toStrFunction, valuesEqualsFunction, allowDuplicateValues) {
            if (allowDuplicateValues === void 0) { allowDuplicateValues = false; }
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
        MultiDictionary.prototype.getValue = function (key) {
            var values = this.dict.getValue(key);
            if (util.isUndefined(values)) {
                return [];
            }
            return arrays.copy(values);
        };
        /**
         * Adds the value to the array associated with the specified key, if
         * it is not already present.
         * @param {Object} key key with which the specified value is to be
         * associated.
         * @param {Object} value the value to add to the array at the key
         * @return {boolean} true if the value was not already associated with that key.
         */
        MultiDictionary.prototype.setValue = function (key, value) {
            if (util.isUndefined(key) || util.isUndefined(value)) {
                return false;
            }
            if (!this.containsKey(key)) {
                this.dict.setValue(key, [value]);
                return true;
            }
            var array = this.dict.getValue(key);
            if (!this.allowDuplicate) {
                if (arrays.contains(array, value, this.equalsF)) {
                    return false;
                }
            }
            array.push(value);
            return true;
        };
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
        MultiDictionary.prototype.remove = function (key, value) {
            if (util.isUndefined(value)) {
                var v = this.dict.remove(key);
                return !util.isUndefined(v);
            }
            var array = this.dict.getValue(key);
            if (arrays.remove(array, value, this.equalsF)) {
                if (array.length === 0) {
                    this.dict.remove(key);
                }
                return true;
            }
            return false;
        };
        /**
         * Returns an array containing all of the keys in this dictionary.
         * @return {Array} an array containing all of the keys in this dictionary.
         */
        MultiDictionary.prototype.keys = function () {
            return this.dict.keys();
        };
        /**
         * Returns an array containing all of the values in this dictionary.
         * @return {Array} an array containing all of the values in this dictionary.
         */
        MultiDictionary.prototype.values = function () {
            var values = this.dict.values();
            var array = [];
            for (var _i = 0, values_2 = values; _i < values_2.length; _i++) {
                var v = values_2[_i];
                for (var _a = 0, v_1 = v; _a < v_1.length; _a++) {
                    var w = v_1[_a];
                    array.push(w);
                }
            }
            return array;
        };
        /**
         * Returns true if this dictionary at least one value associatted the specified key.
         * @param {Object} key key whose presence in this dictionary is to be
         * tested.
         * @return {boolean} true if this dictionary at least one value associatted
         * the specified key.
         */
        MultiDictionary.prototype.containsKey = function (key) {
            return this.dict.containsKey(key);
        };
        /**
         * Removes all mappings from this dictionary.
         */
        MultiDictionary.prototype.clear = function () {
            this.dict.clear();
        };
        /**
         * Returns the number of keys in this dictionary.
         * @return {number} the number of key-value mappings in this dictionary.
         */
        MultiDictionary.prototype.size = function () {
            return this.dict.size();
        };
        /**
         * Returns true if this dictionary contains no mappings.
         * @return {boolean} true if this dictionary contains no mappings.
         */
        MultiDictionary.prototype.isEmpty = function () {
            return this.dict.isEmpty();
        };
        return MultiDictionary;
    }());
    zz.MultiDictionary = MultiDictionary;
    var Direction;
    (function (Direction) {
        Direction[Direction["BEFORE"] = 0] = "BEFORE";
        Direction[Direction["AFTER"] = 1] = "AFTER";
        Direction[Direction["INSIDE_AT_END"] = 2] = "INSIDE_AT_END";
        Direction[Direction["INSIDE_AT_START"] = 3] = "INSIDE_AT_START";
    })(Direction || (Direction = {}));
    var MultiRootTree = /** @class */ (function () {
        function MultiRootTree(rootIds, nodes) {
            if (rootIds === void 0) { rootIds = []; }
            if (nodes === void 0) { nodes = {}; }
            this.rootIds = rootIds;
            this.nodes = nodes;
            this.initRootIds();
            this.initNodes();
        }
        MultiRootTree.prototype.initRootIds = function () {
            for (var _i = 0, _a = this.rootIds; _i < _a.length; _i++) {
                var rootId = _a[_i];
                this.createEmptyNodeIfNotExist(rootId);
            }
        };
        MultiRootTree.prototype.initNodes = function () {
            for (var nodeKey in this.nodes) {
                if (this.nodes.hasOwnProperty(nodeKey)) {
                    for (var _i = 0, _a = this.nodes[nodeKey]; _i < _a.length; _i++) {
                        var nodeListItem = _a[_i];
                        this.createEmptyNodeIfNotExist(nodeListItem);
                    }
                }
            }
        };
        MultiRootTree.prototype.createEmptyNodeIfNotExist = function (nodeKey) {
            if (!this.nodes[nodeKey]) {
                this.nodes[nodeKey] = [];
            }
        };
        MultiRootTree.prototype.getRootIds = function () {
            var clone = this.rootIds.slice();
            return clone;
        };
        MultiRootTree.prototype.getNodes = function () {
            var clone = {};
            for (var nodeKey in this.nodes) {
                if (this.nodes.hasOwnProperty(nodeKey)) {
                    clone[nodeKey] = this.nodes[nodeKey].slice();
                }
            }
            return clone;
        };
        MultiRootTree.prototype.getObject = function () {
            return {
                rootIds: this.getRootIds(),
                nodes: this.getNodes(),
            };
        };
        MultiRootTree.prototype.toObject = function () {
            return this.getObject();
        };
        MultiRootTree.prototype.flatten = function () {
            var _this = this;
            var extraPropsObject = [];
            for (var i = 0; i < this.rootIds.length; i++) {
                var rootId = this.rootIds[i];
                extraPropsObject.push({
                    id: rootId,
                    level: 0,
                    hasParent: false,
                    childrenCount: undefined,
                });
                traverse(rootId, this.nodes, extraPropsObject, 0);
            }
            for (var _i = 0, extraPropsObject_1 = extraPropsObject; _i < extraPropsObject_1.length; _i++) {
                var o = extraPropsObject_1[_i];
                o.childrenCount = countChildren(o.id);
            }
            return extraPropsObject;
            function countChildren(id) {
                if (!_this.nodes[id]) {
                    return 0;
                }
                else {
                    var childrenCount = _this.nodes[id].length;
                    return childrenCount;
                }
            }
            function traverse(startId, nodes, returnArray, level) {
                if (level === void 0) { level = 0; }
                if (!startId || !nodes || !returnArray || !nodes[startId]) {
                    return;
                }
                level++;
                var idsList = nodes[startId];
                for (var i = 0; i < idsList.length; i++) {
                    var id = idsList[i];
                    returnArray.push({ id: id, level: level, hasParent: true });
                    traverse(id, nodes, returnArray, level);
                }
                level--;
            }
        };
        MultiRootTree.prototype.moveIdBeforeId = function (moveId, beforeId) {
            return this.moveId(moveId, beforeId, Direction.BEFORE);
        };
        MultiRootTree.prototype.moveIdAfterId = function (moveId, afterId) {
            return this.moveId(moveId, afterId, Direction.AFTER);
        };
        MultiRootTree.prototype.moveIdIntoId = function (moveId, insideId, atStart) {
            if (atStart === void 0) { atStart = true; }
            if (atStart) {
                return this.moveId(moveId, insideId, Direction.INSIDE_AT_START);
            }
            else {
                return this.moveId(moveId, insideId, Direction.INSIDE_AT_END);
            }
        };
        MultiRootTree.prototype.deleteId = function (id) {
            this.rootDeleteId(id);
            this.nodeAndSubNodesDelete(id);
            this.nodeRefrencesDelete(id);
        };
        MultiRootTree.prototype.insertIdBeforeId = function (beforeId, insertId) {
            var foundRootIdIndex = this.findRootId(beforeId);
            if (foundRootIdIndex > -1) {
                this.insertIdIntoRoot(insertId, foundRootIdIndex);
            }
            for (var nodeKey in this.nodes) {
                if (this.nodes.hasOwnProperty(nodeKey)) {
                    var foundNodeIdIndex = this.findNodeId(nodeKey, beforeId);
                    if (foundNodeIdIndex > -1) {
                        this.insertIdIntoNode(nodeKey, insertId, foundNodeIdIndex);
                    }
                }
            }
        };
        MultiRootTree.prototype.insertIdAfterId = function (belowId, insertId) {
            var foundRootIdIndex = this.findRootId(belowId);
            if (foundRootIdIndex > -1) {
                this.insertIdIntoRoot(insertId, foundRootIdIndex + 1);
            }
            for (var nodeKey in this.nodes) {
                if (this.nodes.hasOwnProperty(nodeKey)) {
                    var foundNodeIdIndex = this.findNodeId(nodeKey, belowId);
                    if (foundNodeIdIndex > -1) {
                        this.insertIdIntoNode(nodeKey, insertId, foundNodeIdIndex + 1);
                    }
                }
            }
        };
        MultiRootTree.prototype.insertIdIntoId = function (insideId, insertId) {
            this.nodeInsertAtEnd(insideId, insertId);
            this.nodes[insertId] = [];
        };
        MultiRootTree.prototype.insertIdIntoRoot = function (id, position) {
            if (position === undefined) {
                this.rootInsertAtEnd(id);
            }
            else {
                if (position < 0) {
                    var length_1 = this.rootIds.length;
                    this.rootIds.splice(position + length_1 + 1, 0, id);
                }
                else {
                    this.rootIds.splice(position, 0, id);
                }
            }
            this.nodes[id] = this.nodes[id] || [];
        };
        MultiRootTree.prototype.insertIdIntoNode = function (nodeKey, id, position) {
            this.nodes[nodeKey] = this.nodes[nodeKey] || [];
            this.nodes[id] = this.nodes[id] || [];
            if (position === undefined) {
                this.nodeInsertAtEnd(nodeKey, id);
            }
            else {
                if (position < 0) {
                    var length_2 = this.nodes[nodeKey].length;
                    this.nodes[nodeKey].splice(position + length_2 + 1, 0, id);
                }
                else {
                    this.nodes[nodeKey].splice(position, 0, id);
                }
            }
        };
        MultiRootTree.prototype.moveId = function (moveId, beforeId, direction) {
            var sourceId = moveId;
            var sourceRootIndex = this.findRootId(sourceId);
            var sourceNodeKey;
            var sourceNodeIdIndex;
            if (this.nodes[beforeId]) {
                sourceNodeKey = beforeId;
            }
            for (var nodeKey in this.nodes) {
                if (this.nodes.hasOwnProperty(nodeKey)) {
                    sourceNodeIdIndex = this.findNodeId(nodeKey, beforeId);
                    break;
                }
            }
            // got all
            var targetId = beforeId;
            var targetRootIndex = this.findRootId(targetId);
            var targetNodeKey;
            var targetNodeIdIndex;
            if (this.nodes[beforeId]) {
                targetNodeKey = beforeId;
            }
            for (var nodeKey in this.nodes) {
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
                    for (var nodeKey in this.nodes) {
                        if (this.nodes.hasOwnProperty(nodeKey)) {
                            var index = this.findNodeId(nodeKey, targetId);
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
                    for (var nodeKey in this.nodes) {
                        if (this.nodes.hasOwnProperty(nodeKey)) {
                            var index = this.findNodeId(nodeKey, sourceId);
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
                    for (var nodeKey in this.nodes) {
                        if (this.nodes.hasOwnProperty(nodeKey)) {
                            var index = this.findNodeId(nodeKey, sourceId);
                            if (index > -1) {
                                this.nodeDeleteAtIndex(nodeKey, index);
                                break;
                            }
                        }
                    }
                    for (var nodeKey in this.nodes) {
                        if (this.nodes.hasOwnProperty(nodeKey)) {
                            var index = this.findNodeId(nodeKey, targetId);
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
        };
        MultiRootTree.prototype.swapArrayElements = function (arr, indexA, indexB) {
            var temp = arr[indexA];
            arr[indexA] = arr[indexB];
            arr[indexB] = temp;
            return arr;
        };
        MultiRootTree.prototype.rootDeleteId = function (id) {
            var index = this.findRootId(id);
            if (index > -1) {
                this.rootDelete(index);
            }
        };
        MultiRootTree.prototype.nodeAndSubNodesDelete = function (nodeKey) {
            var toDeleteLater = [];
            for (var i = 0; i < this.nodes[nodeKey].length; i++) {
                var id = this.nodes[nodeKey][i];
                this.nodeAndSubNodesDelete(id);
                toDeleteLater.push(nodeKey);
            }
            this.nodeDelete(nodeKey);
            for (var i = 0; i < toDeleteLater.length; i++) {
                this.nodeDelete(toDeleteLater[i]);
            }
        };
        MultiRootTree.prototype.nodeRefrencesDelete = function (id) {
            for (var nodeKey in this.nodes) {
                if (this.nodes.hasOwnProperty(nodeKey)) {
                    for (var i = 0; i < this.nodes[nodeKey].length; i++) {
                        var targetId = this.nodes[nodeKey][i];
                        if (targetId === id) {
                            this.nodeDeleteAtIndex(nodeKey, i);
                        }
                    }
                }
            }
        };
        MultiRootTree.prototype.nodeDelete = function (nodeKey) {
            delete this.nodes[nodeKey];
        };
        MultiRootTree.prototype.findRootId = function (id) {
            return this.rootIds.indexOf(id);
        };
        MultiRootTree.prototype.findNodeId = function (nodeKey, id) {
            return this.nodes[nodeKey].indexOf(id);
        };
        MultiRootTree.prototype.findNode = function (nodeKey) {
            return this.nodes[nodeKey];
        };
        MultiRootTree.prototype.nodeInsertAtStart = function (nodeKey, id) {
            this.nodes[nodeKey].unshift(id);
        };
        MultiRootTree.prototype.nodeInsertAtEnd = function (nodeKey, id) {
            this.nodes[nodeKey].push(id);
        };
        MultiRootTree.prototype.rootDelete = function (index) {
            this.rootIds.splice(index, 1);
        };
        MultiRootTree.prototype.nodeDeleteAtIndex = function (nodeKey, index) {
            this.nodes[nodeKey].splice(index, 1);
        };
        MultiRootTree.prototype.rootInsertAtStart = function (id) {
            this.rootIds.unshift(id);
        };
        MultiRootTree.prototype.rootInsertAtEnd = function (id) {
            this.rootIds.push(id);
        };
        return MultiRootTree;
    }());
    zz.MultiRootTree = MultiRootTree;
})(zz || (zz = {}));
var zz;
(function (zz) {
    var LogLevel;
    (function (LogLevel) {
        LogLevel[LogLevel["Log"] = 0] = "Log";
        LogLevel[LogLevel["Warn"] = 1] = "Warn";
        LogLevel[LogLevel["Error"] = 2] = "Error";
        LogLevel[LogLevel["No"] = 3] = "No";
    })(LogLevel = zz.LogLevel || (zz.LogLevel = {}));
    /**0 */
    zz.logLevel = LogLevel.Log;
    function log() {
        var data = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            data[_i] = arguments[_i];
        }
        if (zz.logLevel <= LogLevel.Log)
            console.log.apply(console, data);
    }
    zz.log = log;
    function warn() {
        var data = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            data[_i] = arguments[_i];
        }
        if (zz.logLevel <= LogLevel.Warn)
            console.warn.apply(console, data);
    }
    zz.warn = warn;
    function error() {
        var data = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            data[_i] = arguments[_i];
        }
        if (zz.logLevel <= LogLevel.Error)
            console.error.apply(console, data);
    }
    zz.error = error;
    function assertEqual(a, b, msg) {
        console.assert(a == b, msg);
    }
    zz.assertEqual = assertEqual;
})(zz || (zz = {}));
var zz;
(function (zz) {
    var utils;
    (function (utils) {
        /**打乱字符串 */
        function upsetString(oStr) {
            var orginStr = oStr.split('');
            var len = orginStr.length;
            var result = '';
            var tmp;
            for (var i = len - 1; i > 0; i--) {
                var index = zz.int(len * Math.random()); //随机数的产生范围不变
                //每次与最后一位交换顺序
                tmp = orginStr[index];
                orginStr[index] = orginStr[i];
                orginStr[i] = tmp;
            }
            for (var _i = 0, orginStr_1 = orginStr; _i < orginStr_1.length; _i++) {
                var node = orginStr_1[_i];
                result += node;
            }
            return result;
        }
        utils.upsetString = upsetString;
        /**字符串转unicode数字的累加和 */
        function str2Unicode2Number(str) {
            var num = 0;
            for (var i = 0, len = str.length; i < len; i++) {
                var strH = str.charCodeAt(i);
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
            var tol = weightArr.reduce(function (p, c) { return p + c; }, 0);
            var rnd = Math.random() * tol;
            var acc = 0;
            var len = weightArr.length;
            for (var i = 0; i < len; i++) {
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
            return arr.reduce(function (p, c) { return __spreadArrays(p, c); }, []);
        }
        utils.convertArrayD2toD1 = convertArrayD2toD1;
        /**
         * 一维数组转化成二维数组
         * @param arr {T[]} 一维数组
         * @param col {number} 目标二维数组的列数
         * @returns {T[][]} 二维数组
         */
        function convertArrayD1toD2(arr, col) {
            var len = arr.length;
            if (len % col != 0) {
                throw new Error('传入的二维数组不合格');
            }
            var res = [];
            for (var i = 0; i < len; i++) {
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
        function shuffleArray(arr, immutable) {
            var _a;
            if (immutable === void 0) { immutable = true; }
            var len = arr.length;
            var res = immutable ? Array.from(arr) : arr;
            for (var i = 0; i < len; i++) {
                var tar = randomIndex(len);
                _a = [res[tar], res[i]], res[i] = _a[0], res[tar] = _a[1];
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
            var min = zz.int(seconds / 60).toFixed(0);
            var sec = zz.int(seconds % 60).toFixed(0);
            if (min.length == 1)
                min = '0' + min;
            if (sec.length == 1)
                sec = '0' + sec;
            return min + ':' + sec;
        }
        utils.formatSeconds = formatSeconds;
        function getPosInMainCamera(node) {
            var p_w = node.convertToWorldSpaceAR(cc.v2());
            var p_c = cc.Camera.main.node.convertToNodeSpaceAR(p_w);
            return p_c;
        }
        utils.getPosInMainCamera = getPosInMainCamera;
        /**
         * 实例化一个预制体; 异步
         * @param prefab {cc.Prefab | cc.Node} 预制体或节点
         * @returns {Promise<cc.Node>}
         */
        function instantiatePrefab(prefab) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, new Promise(function (resolve) {
                                if (prefab instanceof cc.Prefab) {
                                    var node = cc.instantiate(prefab);
                                    resolve(node);
                                }
                                if (prefab instanceof cc.Node) {
                                    var node = cc.instantiate(prefab);
                                    resolve(node);
                                }
                            })];
                        case 1: return [2 /*return*/, _a.sent()];
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
            return __awaiter(this, void 0, void 0, function () {
                var bundle;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            bundle = cc.assetManager.getBundle(bundleName);
                            if (!!bundle) return [3 /*break*/, 2];
                            return [4 /*yield*/, new Promise(function (resolve, reject) {
                                    cc.assetManager.loadBundle(bundleName, function (err, bundle) {
                                        err ? reject(err) : resolve(bundle);
                                    });
                                })];
                        case 1:
                            bundle = _a.sent();
                            _a.label = 2;
                        case 2: return [2 /*return*/, bundle];
                    }
                });
            });
        }
        utils.getBundle = getBundle;
        /**tan(pi/8)的值 */
        var TanOneEighthPi = Math.tan(Math.PI / 8);
        /**
         * 将二维方向向量转化成8个方向的字符串代号
         * @param dir {cc.Vec2} 方向向量
         * @returns {'S' | 'N' | 'E' | 'W' | 'SE' | 'NW' | 'NE' | 'SW'} 八方的字符代号
         */
        function getDirectionOct(dir) {
            var x = dir.x;
            var y = dir.y;
            var t = TanOneEighthPi;
            var r1 = x + y * t;
            var r2 = x - y * t;
            if (r1 < 0 && r2 >= 0)
                return 'S';
            if (r1 >= 0 && r2 < 0)
                return 'N';
            var r3 = t * x + y;
            var r4 = t * x - y;
            if (r3 >= 0 && r4 >= 0)
                return 'E';
            if (r3 < 0 && r4 < 0)
                return 'W';
            var r5 = x + t * y;
            var r6 = x * t + y;
            if (r5 >= 0 && r6 < 0)
                return 'SE';
            if (r5 < 0 && r6 >= 0)
                return 'NW';
            var r7 = x - y * t;
            var r8 = x * t - y;
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
/// <reference path="zzStructure.ts" />
/// <reference path="zzLog.ts" />
/// <reference path="zzUtils.ts" />
var zz;
(function (zz) {
    var Delegate = /** @class */ (function () {
        function Delegate(callback, argArray, isOnce) {
            if (isOnce === void 0) { isOnce = false; }
            this.isOnce = false;
            this.callback = callback;
            this.argArray = argArray;
            this.isOnce = isOnce;
        }
        Object.defineProperty(Delegate.prototype, "Callback", {
            get: function () {
                return this.callback;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Delegate.prototype, "ArgArray", {
            get: function () {
                return this.argArray;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Delegate.prototype, "IsOnce", {
            get: function () {
                return this.isOnce;
            },
            set: function (v) {
                this.isOnce = v;
            },
            enumerable: false,
            configurable: true
        });
        return Delegate;
    }());
    var EventMgr = /** @class */ (function () {
        function EventMgr() {
            this.mEventMap = new Map();
        }
        EventMgr.prototype.has = function (eventType, caller, callback) {
            return !!this.find(eventType, caller, callback);
        };
        EventMgr.prototype.fire = function (eventType) {
            var _a;
            var argArray = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                argArray[_i - 1] = arguments[_i];
            }
            if (!eventType) {
                console.error('Event eventType is null!');
                return false;
            }
            var delegateList = [];
            var callerList = [];
            var eventMap = this.mEventMap.get(eventType);
            if (eventMap) {
                eventMap.forEach(function (eventList, caller) {
                    for (var _i = 0, eventList_1 = eventList; _i < eventList_1.length; _i++) {
                        var delegate = eventList_1[_i];
                        delegateList.push(delegate);
                        callerList.push(caller);
                    }
                    for (var index = eventList.length - 1; index >= 0; --index) {
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
            var length = delegateList.length;
            for (var index = 0; index < length; index++) {
                var delegate = delegateList[index];
                (_a = delegate.Callback).call.apply(_a, __spreadArrays([callerList[index]], delegate.ArgArray, argArray));
            }
            return length > 0;
        };
        EventMgr.prototype.register = function (eventType, caller, callback) {
            var argArray = [];
            for (var _i = 3; _i < arguments.length; _i++) {
                argArray[_i - 3] = arguments[_i];
            }
            this.addListener.apply(this, __spreadArrays([eventType, caller, callback, false], argArray));
        };
        EventMgr.prototype.registerOnce = function (eventType, caller, callback) {
            var argArray = [];
            for (var _i = 3; _i < arguments.length; _i++) {
                argArray[_i - 3] = arguments[_i];
            }
            this.addListener.apply(this, __spreadArrays([eventType, caller, callback, true], argArray));
        };
        EventMgr.prototype.delRegister = function (type, caller, callback, onceOnly) {
            this.removeBy(function (eventType, listenerCaller, delegate) {
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
        };
        EventMgr.prototype.delAllRegister = function (caller) {
            var _this = this;
            this.mEventMap.forEach(function (eventMap, type) {
                eventMap.delete(caller);
                if (eventMap.size <= 0) {
                    _this.mEventMap.delete(type);
                }
            });
        };
        EventMgr.prototype.find = function (eventType, caller, callback) {
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
            var eventMap;
            if (this.mEventMap.has(eventType)) {
                eventMap = this.mEventMap.get(eventType);
            }
            else {
                eventMap = new Map();
                this.mEventMap.set(eventType, eventMap);
            }
            var eventList;
            if (eventMap.has(caller)) {
                eventList = eventMap.get(caller);
            }
            else {
                eventList = [];
                eventMap.set(caller, eventList);
            }
            for (var _i = 0, eventList_2 = eventList; _i < eventList_2.length; _i++) {
                var delegate = eventList_2[_i];
                if (delegate.Callback === callback) {
                    return delegate;
                }
            }
            return null;
        };
        EventMgr.prototype.addListener = function (eventType, caller, callback, isOnce) {
            var argArray = [];
            for (var _i = 4; _i < arguments.length; _i++) {
                argArray[_i - 4] = arguments[_i];
            }
            var delegate = this.find(eventType, caller, callback);
            if (delegate) {
                delegate.IsOnce = isOnce;
                console.error('Listener is already exist!');
            }
            else {
                var delegate_1 = new Delegate(callback, argArray, isOnce);
                this.mEventMap.get(eventType).get(caller).push(delegate_1);
            }
        };
        EventMgr.prototype.removeBy = function (predicate) {
            var _this = this;
            if (!predicate) {
                return;
            }
            this.mEventMap.forEach(function (eventMap, eventType) {
                eventMap.forEach(function (eventList, caller) {
                    for (var index = eventList.length - 1; index >= 0; --index) {
                        var delegate = eventList[index];
                        if (predicate(eventType, caller, delegate)) {
                            eventList.splice(index, 1);
                        }
                    }
                    if (eventList.length <= 0) {
                        eventMap.delete(caller);
                    }
                });
                if (eventMap.size <= 0) {
                    _this.mEventMap.delete(eventType);
                }
            });
        };
        return EventMgr;
    }());
    var TableMgr = /** @class */ (function () {
        function TableMgr() {
            this.allTables = null;
            this.allTables = new Map();
        }
        TableMgr.prototype.loadConfig = function (tableType, bundleName) {
            return __awaiter(this, void 0, void 0, function () {
                var bundle_1, jsonAsset_1, jsonObj, tableMap, k, obj, err_1_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (this.allTables.has(tableType)) {
                                this.allTables.set(tableType, new Map());
                            }
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 4, , 5]);
                            return [4 /*yield*/, zz.utils.getBundle(bundleName)];
                        case 2:
                            bundle_1 = _a.sent();
                            return [4 /*yield*/, new Promise(function (resolveFn, rejectFn) {
                                    bundle_1.load(tableType, function (err, jsonAsset) {
                                        err ? rejectFn(err) : resolveFn(jsonAsset);
                                    });
                                })];
                        case 3:
                            jsonAsset_1 = _a.sent();
                            jsonObj = jsonAsset_1.json;
                            tableMap = new Map();
                            for (k in jsonObj) {
                                obj = JSON.parse(JSON.stringify(jsonObj[k]));
                                tableMap.set(obj.id, obj);
                            }
                            this.allTables.set(tableType, tableMap);
                            cc.resources.release('configs/' + tableType);
                            return [3 /*break*/, 5];
                        case 4:
                            err_1_1 = _a.sent();
                            zz.error('[Table] loading error! table:' + tableType + '; err:' + err_1_1);
                            return [3 /*break*/, 5];
                        case 5: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * TableComponent：获取表所有数据
         * @param tableType 数据表类型名称
         */
        TableMgr.prototype.getTable = function (tableType) {
            if (this.allTables.has(tableType)) {
                return this.allTables.get(tableType);
            }
            return null;
        };
        /**
         * TableComponent：获取表数据项目
         * @param tableType 数据表类型名称
         * @param key 数据表id
         */
        TableMgr.prototype.getTableItem = function (tableType, key) {
            if (this.allTables.has(tableType)) {
                return this.allTables.get(tableType).get(key);
            }
            else {
                console.error('[Table] GetTableItem Error! tableType:' + tableType + '; key:' + key);
                return null;
            }
        };
        /**
         * TableComponent：表是否存在数据项目
         * @param tableType 数据表类型名称
         * @param key 数据表id
         */
        TableMgr.prototype.hasTableItem = function (tableType, key) {
            if (this.allTables.has(tableType)) {
                return this.allTables.get(tableType).has(key);
            }
            else {
                console.error('[Table] HasTableItem Error! tableType' + tableType + '; key:' + key);
                return false;
            }
        };
        return TableMgr;
    }());
    var StorageMgr = /** @class */ (function () {
        function StorageMgr() {
        }
        /**
         * 清理本地存储
         */
        StorageMgr.prototype.clear = function () {
            cc.sys.localStorage.clear();
        };
        /**
         * 移除目标key值的存储
         * @param key {string} 存储的键值
         */
        StorageMgr.prototype.remove = function (key) {
            cc.sys.localStorage.removeItem(key);
        };
        /**
         * 存储int32值
         * @param key {string} 存储键值
         * @param value {number} 数字,会被取整;
         */
        StorageMgr.prototype.saveInt = function (key, value) {
            cc.sys.localStorage.setItem(key, zz.int(value));
        };
        /**
         * 获取存储的int32
         * @param key {string} 键值
         * @returns {number} int32值;默认为0
         */
        StorageMgr.prototype.getInt = function (key) {
            var sto = cc.sys.localStorage.getItem(key);
            // null | undefine
            if (!sto)
                return 0;
            var n = parseInt(sto);
            // NaN
            if (!sto)
                return 0;
            return n;
        };
        /**
         * 存储数值
         * @param key {string} 键值
         * @param value {number} double值
         */
        StorageMgr.prototype.saveNumber = function (key, value) {
            cc.sys.localStorage.setItem(key, value);
        };
        /**
         * 获取存储的数值
         * @param key {string} 键值
         * @returns {number} 数值,默认为0
         */
        StorageMgr.prototype.getNumber = function (key) {
            var sto = cc.sys.localStorage.getItem(key);
            // null | undefine
            if (!sto)
                return 0;
            var n = parseFloat(sto);
            // NaN
            if (!sto)
                return 0;
            return n;
        };
        /**
         * 保存字符串
         * @param key {string} 键值
         * @param value {string} 字符串
         */
        StorageMgr.prototype.saveString = function (key, value) {
            cc.sys.localStorage.setItem(key, value);
        };
        /**
         * 读取保存的字符串;
         * @param key {string} 键值
         * @returns {string} 字符串,默认为''
         */
        StorageMgr.prototype.getString = function (key) {
            var sto = cc.sys.localStorage.getItem(key);
            if (!sto)
                return '';
            return sto;
        };
        /**
         * 保存对象
         * @param key {string} 键值
         * @param value {T} 对象,包括数组等各种带__proto__的
         */
        StorageMgr.prototype.saveObject = function (key, value) {
            if (value) {
                this.saveString(key, JSON.stringify(value));
            }
        };
        /**
         * 读取对象
         * @param key {string} 键值
         * @returns {T} 对象,包括数组等
         */
        StorageMgr.prototype.getObject = function (key) {
            var str = this.getString(key);
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
        };
        return StorageMgr;
    }());
    var SoundMgr = /** @class */ (function () {
        function SoundMgr() {
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
        Object.defineProperty(SoundMgr.prototype, "SoundVolume", {
            get: function () {
                return this.soundVolume;
            },
            set: function (volume) {
                this.soundVolume = volume;
                cc.audioEngine.setEffectsVolume(volume);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(SoundMgr.prototype, "MusicVolume", {
            get: function () {
                return this.musicVolume;
            },
            set: function (volume) {
                this.musicVolume = volume;
                cc.audioEngine.setMusicVolume(volume);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(SoundMgr.prototype, "isMusicOn", {
            /**音乐开关 */
            get: function () {
                return this._isMusicOn;
            },
            set: function (v) {
                if (v == false) {
                    this.stopMusic();
                }
                this._isMusicOn = v;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(SoundMgr.prototype, "isSoundOn", {
            /**音效开关 */
            get: function () {
                return this._isSoundOn;
            },
            set: function (v) {
                if (!v) {
                    this.stopAllSounds();
                }
                this._isSoundOn = v;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(SoundMgr.prototype, "isAllOn", {
            /**声音是否打开 */
            get: function () {
                return this._isAllOn;
            },
            set: function (v) {
                this._isAllOn = v;
                if (!v) {
                    this.stopAllSounds();
                    this.stopMusic();
                }
            },
            enumerable: false,
            configurable: true
        });
        SoundMgr.prototype.playSound = function (soundName, loop) {
            if (loop === void 0) { loop = false; }
            return __awaiter(this, void 0, void 0, function () {
                var clip, soundID_1, bundle;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!this.isAllOn) {
                                return [2 /*return*/];
                            }
                            if (!this.isSoundOn) {
                                return [2 /*return*/];
                            }
                            this.dict_flag.set(soundName, 1);
                            if (!this.dict_clip.has(soundName)) return [3 /*break*/, 1];
                            clip = this.dict_clip.get(soundName);
                            soundID_1 = cc.audioEngine.playEffect(clip, loop);
                            this.dict_soundId.setValue(soundName, soundID_1);
                            cc.audioEngine.setFinishCallback(soundID_1, function () {
                                if (!loop || !_this.dict_flag.get(soundName)) {
                                    _this.dict_soundId.remove(soundName, soundID_1);
                                }
                            });
                            return [3 /*break*/, 3];
                        case 1: return [4 /*yield*/, zz.utils.getBundle('audio')];
                        case 2:
                            bundle = _a.sent();
                            bundle.load(soundName, cc.AudioClip, function (err, clip) {
                                if (_this.dict_clip.get(soundName))
                                    return;
                                if (!_this.dict_flag.get(soundName))
                                    return;
                                _this.dict_clip.set(soundName, clip);
                                var soundID = cc.audioEngine.playEffect(clip, loop);
                                _this.dict_soundId.setValue(soundName, soundID);
                                cc.audioEngine.setFinishCallback(soundID, function () {
                                    if (!loop || !_this.dict_flag.get(soundName)) {
                                        _this.dict_soundId.remove(soundName, soundID);
                                    }
                                });
                            });
                            _a.label = 3;
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        SoundMgr.prototype.playMusic = function (musicName, loop) {
            if (loop === void 0) { loop = true; }
            return __awaiter(this, void 0, void 0, function () {
                var clip, id_1, bundle, err_2;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!this.isAllOn) {
                                return [2 /*return*/];
                            }
                            if (!this.isMusicOn) {
                                return [2 /*return*/];
                            }
                            if (this.dict_musicID.containsKey(musicName)) {
                                return [2 /*return*/];
                            }
                            if (!this.dict_clip.has(musicName)) return [3 /*break*/, 1];
                            clip = this.dict_clip.get(musicName);
                            id_1 = cc.audioEngine.playMusic(clip, loop);
                            this.dict_musicID.setValue(musicName, id_1);
                            cc.audioEngine.setFinishCallback(id_1, function () {
                                if (!loop) {
                                    _this.dict_musicID.remove(musicName, id_1);
                                }
                            });
                            return [3 /*break*/, 4];
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, zz.utils.getBundle('audio')];
                        case 2:
                            bundle = _a.sent();
                            bundle.load(musicName, cc.AudioClip, function (err, clip) {
                                if (err) {
                                    zz.error(err);
                                    return;
                                }
                                if (_this.dict_clip.has(musicName))
                                    return;
                                _this.dict_clip.set(musicName, clip);
                                var id = cc.audioEngine.playMusic(clip, loop);
                                _this.dict_musicID.setValue(musicName, id);
                                cc.audioEngine.setFinishCallback(id, function () {
                                    if (!loop) {
                                        _this.dict_musicID.remove(musicName, id);
                                    }
                                });
                            });
                            return [3 /*break*/, 4];
                        case 3:
                            err_2 = _a.sent();
                            zz.error(err_2);
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        /**切换音乐; 模拟的渐变切换; 替换PlayMusic使用*/
        SoundMgr.prototype.changeMusic = function (musicName, loop, inTime, outTime) {
            var _this = this;
            if (loop === void 0) { loop = true; }
            if (inTime === void 0) { inTime = 1; }
            if (outTime === void 0) { outTime = 1; }
            var iTime = inTime;
            var oTime = outTime;
            var it = 0.1;
            var iLen = iTime / it;
            var oLen = oTime / it;
            var volLmt = this.musicVolume;
            var iVolIt = volLmt / iLen;
            var _loop_1 = function (i) {
                setTimeout(function () {
                    cc.audioEngine.setMusicVolume(volLmt - iVolIt * i);
                }, i * it * 1000);
            };
            for (var i = 0; i < iLen; i++) {
                _loop_1(i);
            }
            setTimeout(function () {
                _this.stopMusic();
                _this.playMusic(musicName, loop);
            }, iTime * 1000);
            var oVolIt = volLmt / oLen;
            var _loop_2 = function (i) {
                setTimeout(function () {
                    cc.audioEngine.setMusicVolume(oVolIt * i);
                }, (i * it + iTime) * 1000);
            };
            for (var i = 0; i < oLen; i++) {
                _loop_2(i);
            }
        };
        SoundMgr.prototype.stopSound = function (soundName) {
            this.dict_flag.set(soundName, 0);
            if (this.dict_soundId.containsKey(soundName)) {
                this.dict_soundId.getValue(soundName).forEach(function (v) {
                    cc.audioEngine.stopEffect(v);
                });
                this.dict_soundId.remove(soundName);
            }
        };
        SoundMgr.prototype.stopMusic = function () {
            cc.audioEngine.stopMusic();
            this.dict_musicID.clear();
        };
        SoundMgr.prototype.stopAllSounds = function () {
            var _this = this;
            cc.audioEngine.stopAllEffects();
            this.dict_soundId.keys().forEach(function (v) {
                _this.dict_flag.set(v, 0);
            });
            this.dict_soundId.clear();
        };
        SoundMgr.prototype.releaseSound = function (soundName) {
            this.stopSound(soundName);
            if (this.dict_clip.has(soundName)) {
                this.dict_clip.delete(soundName);
            }
            zz.utils.getBundle('audio').then(function (bundle) {
                bundle.release(soundName);
            });
        };
        return SoundMgr;
    }());
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
    var UIMgr = /** @class */ (function () {
        function UIMgr() {
            /**UI根节点; 从外部注入; */
            this._uiRoot = undefined;
            /**进度条函数; 从外部注入; */
            this.progressFn = undefined;
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
        Object.defineProperty(UIMgr.prototype, "uiRoot", {
            get: function () {
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
            },
            enumerable: false,
            configurable: true
        });
        UIMgr.prototype.setUIRoot = function (rootNd) {
            this._uiRoot = rootNd;
        };
        UIMgr.prototype.setUIParams = function (params) {
            var _this = this;
            params.forEach(function (v) {
                _this.pathMap.set(v.uiName, v.path);
                _this.layerMap.set(v.uiName, v.zIndex);
            });
        };
        UIMgr.prototype.setProgressFn = function (fn) {
            this.progressFn = fn;
        };
        UIMgr.prototype.openUI = function (uiArgs) {
            var _a;
            return __awaiter(this, void 0, void 0, function () {
                var uiName, ui_1, uiNd, bundle_2, prefab_1, uiNode, ui_2, err_1_2;
                var _this = this;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            uiName = uiArgs.uiName;
                            if (this.uiMap.has(uiName)) {
                                ui_1 = this.uiMap.get(uiName);
                                uiNd = ui_1.node;
                                if (uiNd && uiNd.isValid) {
                                    this.openUINode(uiNd, uiArgs);
                                    this.openUIClass(ui_1, uiArgs);
                                    return [2 /*return*/, undefined];
                                }
                                else {
                                    this.uiMap.delete(uiName);
                                }
                            }
                            if (this.loadingFlagMap.get(uiName)) {
                                zz.warn('[openUI] 正在加载' + uiName);
                                this.openingMap.set(uiName, uiArgs);
                                this.progressFn(true, Math.random(), '');
                                return [2 /*return*/, undefined];
                            }
                            this.loadingFlagMap.set(uiName, true);
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 5, , 6]);
                            return [4 /*yield*/, this.getUIBundle(uiName)];
                        case 2:
                            bundle_2 = _b.sent();
                            return [4 /*yield*/, new Promise(function (resolveFn, rejectFn) {
                                    bundle_2.load(uiName, function (completedCount, totalCount, item) {
                                        if (uiArgs.progressArgs) {
                                            if (uiArgs.progressArgs.showProgressUI) {
                                                _this.progressFn
                                                    ? _this.progressFn(true, completedCount / totalCount, uiArgs.progressArgs.desTxt)
                                                    : zz.error('[UI] 没有注入进度条函数');
                                            }
                                        }
                                    }, function (err, prefab) {
                                        err ? rejectFn(err) : resolveFn(prefab);
                                    });
                                })];
                        case 3:
                            prefab_1 = _b.sent();
                            (_a = this.progressFn) === null || _a === void 0 ? void 0 : _a.call(this, false, 0, '');
                            this.loadingFlagMap.delete(uiName);
                            return [4 /*yield*/, zz.utils.instantiatePrefab(prefab_1)];
                        case 4:
                            uiNode = _b.sent();
                            uiNode.parent = this.uiRoot;
                            ui_2 = uiNode.getComponent(uiName);
                            this.uiMap.set(uiName, ui_2);
                            this.openUINode(uiNode, uiArgs);
                            this.openUIClass(ui_2, uiArgs);
                            if (this.openingMap.has(uiName))
                                this.openingMap.delete(uiName);
                            return [3 /*break*/, 6];
                        case 5:
                            err_1_2 = _b.sent();
                            zz.error('[openUI] error:' + err_1_2);
                            return [2 /*return*/, undefined];
                        case 6: return [2 /*return*/];
                    }
                });
            });
        };
        UIMgr.prototype.openUINode = function (uiNd, uiArgs) {
            var uiName = uiArgs.uiName;
            if (!uiNd.parent) {
                uiNd.parent = this.uiRoot;
            }
            if (uiArgs.zIndex) {
                uiNd.zIndex = uiArgs.zIndex;
            }
            else {
                if (this.layerMap.has(uiName)) {
                    var z = this.layerMap.get(uiName);
                    uiNd.zIndex = z;
                    if (this.topZIndex < z)
                        this.topZIndex = z;
                }
                else {
                    uiNd.zIndex = ++this.topZIndex;
                }
            }
            uiNd.x = uiNd.y = 0;
        };
        UIMgr.prototype.openUIClass = function (ui, uiArgs) {
            var _a;
            ui.node.x = ui.node.y = 0;
            ui.node.opacity = 255;
            ui.onOpen(uiArgs.openArgs || []);
            ui.onShow();
            var widget = ui.node.getComponent(cc.Widget);
            if (widget)
                widget.updateAlignment();
            var cb = uiArgs.callbackArgs;
            (_a = cb === null || cb === void 0 ? void 0 : cb.fn) === null || _a === void 0 ? void 0 : _a.call.apply(_a, __spreadArrays([uiArgs.caller], cb.args));
        };
        UIMgr.prototype.getUIBundle = function (uiName) {
            return __awaiter(this, void 0, void 0, function () {
                var path, bundle;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            path = this.pathMap.get(uiName);
                            if (!path)
                                path = 'resources';
                            return [4 /*yield*/, zz.utils.getBundle(path)];
                        case 1:
                            bundle = _a.sent();
                            return [2 /*return*/, bundle];
                    }
                });
            });
        };
        /**从场景中移除UI; 保留本地缓存; */
        UIMgr.prototype.closeUI = function (uiName) {
            var _this = this;
            if (this.uiMap.has(uiName)) {
                this.hideUI(uiName);
                var ui_3 = this.uiMap.get(uiName);
                ui_3.node.parent = null;
                ui_3.onHide();
                ui_3.onClose();
                if (this.attachMapHost.has(uiName)) {
                    this.attachMapHost.get(uiName).forEach(function (v, k) {
                        _this.closeUI(k);
                    });
                }
                return true;
            }
            return false;
        };
        UIMgr.prototype.preloadUI = function (uiName) {
            return __awaiter(this, void 0, void 0, function () {
                var bundle_3, prefab_1, uiNode, ui_4, args, err_1_3;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (this.uiMap.has(uiName)) {
                                zz.warn('[preloadUI] 已经加载ui:' + uiName);
                                return [2 /*return*/, undefined];
                            }
                            if (this.loadingFlagMap.get(uiName)) {
                                zz.warn('[preloadUI] 正在加载' + uiName);
                                return [2 /*return*/, undefined];
                            }
                            this.loadingFlagMap.set(uiName, true);
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 4, , 5]);
                            return [4 /*yield*/, this.getUIBundle(uiName)];
                        case 2:
                            bundle_3 = _a.sent();
                            return [4 /*yield*/, new Promise(function (resolveFn, rejectFn) {
                                    bundle_3.load(uiName, function (err, prefab) {
                                        err ? rejectFn(err) : resolveFn(prefab);
                                    });
                                })];
                        case 3:
                            prefab_1 = _a.sent();
                            this.loadingFlagMap.delete(uiName);
                            uiNode = cc.instantiate(prefab_1);
                            ui_4 = uiNode.getComponent(uiName);
                            this.uiMap.set(uiName, ui_4);
                            if (this.openingMap.has(uiName)) {
                                args = this.openingMap.get(uiName);
                                this.openingMap.delete(uiName);
                                zz.warn('[Preload] 预载中打开了UI:' + uiName + '; 直接打开');
                                this.progressFn(false, 0, '');
                                this.openUINode(uiNode, args);
                                this.openUIClass(ui_4, args);
                            }
                            return [2 /*return*/, uiNode];
                        case 4:
                            err_1_3 = _a.sent();
                            zz.error('[preloadUI] error:' + err_1_3);
                            return [2 /*return*/, undefined];
                        case 5: return [2 /*return*/];
                    }
                });
            });
        };
        /**关闭ui; 移除本地缓存; */
        UIMgr.prototype.destroyUI = function (uiName, resRelease) {
            this.closeUI(uiName);
            var ui = this.uiMap.get(uiName);
            ui === null || ui === void 0 ? void 0 : ui.destroy();
            this.uiMap.delete(uiName);
            if (resRelease) {
                this.getUIBundle(uiName)
                    .then(function (bundle) {
                    cc.assetManager.releaseAsset(bundle.get(uiName));
                    bundle.release(uiName, cc.Prefab);
                })
                    .catch(function (reason) {
                    zz.error('[UIMgr] release ' + uiName + ' fail; reason' + reason);
                });
            }
        };
        UIMgr.prototype.showUI = function (uiName) {
            if (this.uiMap.has(uiName)) {
                var ui_5 = this.uiMap.get(uiName);
                var nd = ui_5.node;
                if (!nd) {
                    zz.warn('[showUI] ' + uiName + '被close过');
                    return false;
                }
                nd.x = nd.y = 0;
                nd.opacity = 255;
                ui_5.onShow();
                return true;
            }
            else {
                zz.error('[shouUI] 未加载的UI:' + uiName);
                return false;
            }
        };
        UIMgr.prototype.hideUI = function (uiName) {
            var _this = this;
            if (this.uiMap.has(uiName)) {
                var ui_6 = this.uiMap.get(uiName);
                var nd = ui_6.node;
                if (nd) {
                    nd.position = cc.v3(zz.farPos);
                    nd.opacity = 0;
                    ui_6.onHide();
                    if (this.attachMapHost.has(uiName)) {
                        this.attachMapHost.get(uiName).forEach(function (v, k) {
                            _this.hideUI(k);
                        });
                    }
                    return true;
                }
                else {
                    return false;
                }
            }
            return false;
        };
        UIMgr.prototype.getUI = function (uiName) {
            return this.uiMap.get(uiName);
        };
        UIMgr.prototype.isUIShown = function (uiName) {
            var ui = this.getUI(uiName);
            if (!ui)
                return false;
            if (!ui.node)
                return false;
            if (!ui.node.active)
                return false;
            if (!ui.node.opacity)
                return false;
            return true;
        };
        UIMgr.prototype.reloadUI = function (uiName) {
            this.destroyUI(uiName, false);
            this.openUI({ uiName: uiName, progressArgs: { showProgressUI: true } });
        };
        /**设置UI之间依附关系; 宿主UI关闭或隐藏时,同时关闭或隐藏附庸UI */
        UIMgr.prototype.setUIAttachment = function (hostUI, clientUI) {
            if (!this.attachMapClient.has(clientUI)) {
                this.attachMapClient.set(clientUI, new Map());
            }
            if (!this.attachMapHost.has(hostUI)) {
                this.attachMapHost.set(hostUI, new Map());
            }
            this.attachMapHost.get(hostUI).set(clientUI, true);
            this.attachMapClient.get(clientUI).set(hostUI, true);
        };
        /**移除UI之间的依附关系 */
        UIMgr.prototype.removeUIAttachment = function (hostUI, clientUI) {
            if (this.attachMapClient.has(clientUI)) {
                this.attachMapClient.get(clientUI).delete(hostUI);
            }
            if (this.attachMapHost.has(hostUI)) {
                this.attachMapHost.get(hostUI).delete(clientUI);
            }
        };
        UIMgr.prototype.releaseUI = function (uiName) {
            return __awaiter(this, void 0, void 0, function () {
                var bundle, err_3;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this.getUIBundle(uiName)];
                        case 1:
                            bundle = _a.sent();
                            bundle.release(uiName);
                            return [3 /*break*/, 3];
                        case 2:
                            err_3 = _a.sent();
                            zz.error(err_3);
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        return UIMgr;
    }());
    zz.farPos = cc.v3(10000, 10000, 0);
    var UIBase = /** @class */ (function (_super) {
        __extends(UIBase, _super);
        function UIBase() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        /**
         * 在onLoad之后调用; 代替onLoad使用; 注意无法重置; 由于无法确保调用一次, 事件注册不宜置于此;
         * @param args 参数列表
         */
        UIBase.prototype.onOpen = function (args) { };
        /**代替onDestroy使用 */
        UIBase.prototype.onClose = function () { };
        /**代替onDiable使用 */
        UIBase.prototype.onHide = function () { };
        /**代替onEnable使用 */
        UIBase.prototype.onShow = function () { };
        return UIBase;
    }(cc.Component));
    zz.UIBase = UIBase;
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
    var SceneMgr = /** @class */ (function () {
        function SceneMgr() {
            /**已显示的场景节点字典; */
            this.sceneDict = new zz.Dictionary();
            /**预载场景节点字典;未显示 */
            this.preloadDict = new zz.Dictionary();
            /**加载标记;防止重复加载 */
            this.loadingDict = new zz.Dictionary();
            /**打开中标记;用于预载过程中打开 */
            this.openningDict = new zz.Dictionary();
        }
        Object.defineProperty(SceneMgr.prototype, "sceneRoot", {
            /**场景根节点 */
            get: function () {
                return this._sceneRoot;
            },
            enumerable: false,
            configurable: true
        });
        /**设置场景根节点;在游戏开始时执行一次 */
        SceneMgr.prototype.setSceneRoot = function (sceneRoot) {
            this._sceneRoot = sceneRoot;
        };
        /**
         * 加载场景
         * @param sceneName 场景预制体名
         * @param bundleName bundle名
         */
        SceneMgr.prototype.loadScene = function (sceneName, bundleName) {
            return __awaiter(this, void 0, void 0, function () {
                var node, bundle_4, prefab_1, node, e_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (this.loadingDict.containsKey(sceneName)) {
                                zz.warn('[Scene] 正在加载' + sceneName);
                                this.openningDict.setValue(sceneName, 1);
                                return [2 /*return*/];
                            }
                            if (this.sceneDict.containsKey(sceneName)) {
                                zz.warn('[Scene] 已加载' + sceneName);
                                return [2 /*return*/];
                            }
                            if (this.preloadDict.containsKey(sceneName)) {
                                zz.warn('[Scene] 已预载' + sceneName);
                                node = this.preloadDict.getValue(sceneName);
                                this.sceneRoot.addChild(node);
                                this.preloadDict.remove(sceneName);
                                return [2 /*return*/];
                            }
                            this.loadingDict.setValue(sceneName, 1);
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 5, , 6]);
                            return [4 /*yield*/, zz.utils.getBundle(bundleName)];
                        case 2:
                            bundle_4 = _a.sent();
                            return [4 /*yield*/, new Promise(function (resolve, reject) {
                                    bundle_4.load(sceneName, function (err, prefab) {
                                        err ? reject(err) : resolve(prefab);
                                    });
                                })];
                        case 3:
                            prefab_1 = _a.sent();
                            this.loadingDict.remove(sceneName);
                            return [4 /*yield*/, zz.utils.instantiatePrefab(prefab_1)];
                        case 4:
                            node = _a.sent();
                            this.sceneRoot.addChild(node);
                            if (this.openningDict.containsKey(sceneName)) {
                                this.openningDict.remove(sceneName);
                            }
                            return [3 /*break*/, 6];
                        case 5:
                            e_1 = _a.sent();
                            throw new Error(e_1);
                        case 6: return [2 /*return*/];
                    }
                });
            });
        };
        /**销毁场景 */
        SceneMgr.prototype.destroyScene = function (sceneName) {
            if (this.sceneDict.containsKey(sceneName)) {
                this.sceneDict.getValue(sceneName).destroy();
                this.sceneDict.remove(sceneName);
            }
        };
        /**预载场景节点 */
        SceneMgr.prototype.preloadScene = function (sceneName, bundleName) {
            return __awaiter(this, void 0, void 0, function () {
                var bundle_5, prefab_1, node, e_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (this.sceneDict.containsKey(sceneName)) {
                                zz.warn('[Scene] 已加载' + sceneName);
                                return [2 /*return*/, undefined];
                            }
                            if (this.loadingDict.containsKey(sceneName)) {
                                zz.warn('[Scene] 正在加载' + sceneName);
                                return [2 /*return*/, undefined];
                            }
                            this.loadingDict.setValue(sceneName, 1);
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 5, , 6]);
                            return [4 /*yield*/, zz.utils.getBundle(bundleName)];
                        case 2:
                            bundle_5 = _a.sent();
                            return [4 /*yield*/, new Promise(function (resolve, reject) {
                                    bundle_5.load(sceneName, function (err, prefab) {
                                        err ? reject(err) : resolve(prefab);
                                    });
                                })];
                        case 3:
                            prefab_1 = _a.sent();
                            this.loadingDict.remove(sceneName);
                            return [4 /*yield*/, zz.utils.instantiatePrefab(prefab_1)];
                        case 4:
                            node = _a.sent();
                            if (this.openningDict.containsKey(sceneName)) {
                                //如果需要打开,则直接打开
                                this.openningDict.remove(sceneName);
                                this.sceneRoot.addChild(node);
                            }
                            else {
                                // 否则存储在预载中;
                                this.preloadDict.setValue(sceneName, node);
                            }
                            return [3 /*break*/, 6];
                        case 5:
                            e_2 = _a.sent();
                            throw new Error(e_2);
                        case 6: return [2 /*return*/];
                    }
                });
            });
        };
        return SceneMgr;
    }());
    var ResMgr = /** @class */ (function () {
        function ResMgr() {
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
        ResMgr.prototype.loadResDict = function (bundleName, dirName, type, assetDict) {
            return __awaiter(this, void 0, void 0, function () {
                var bundle_6, asset_1, key, subDict_1, err_1_4;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            return [4 /*yield*/, zz.utils.getBundle(bundleName)];
                        case 1:
                            bundle_6 = _a.sent();
                            return [4 /*yield*/, new Promise(function (resolveFn, rejectFn) {
                                    bundle_6.loadDir(dirName, type, function (err, res) {
                                        err ? rejectFn(err) : resolveFn(res);
                                    });
                                })];
                        case 2:
                            asset_1 = _a.sent();
                            key = bundleName + '/' + dirName;
                            if (!assetDict.containsKey(key)) {
                                assetDict.setValue(key, new zz.Dictionary());
                            }
                            subDict_1 = assetDict.getValue(key);
                            asset_1.forEach(function (v) {
                                subDict_1.setValue(v.name, v);
                            });
                            return [3 /*break*/, 4];
                        case 3:
                            err_1_4 = _a.sent();
                            zz.error('[loadResDict] error:' + err_1_4);
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        ResMgr.prototype.loadPrefabs = function (bundleName, dirName) {
            this.loadResDict(bundleName, dirName, cc.Prefab, this.prefabMap);
        };
        ResMgr.prototype.loadSprites = function (bundleName, dirName) {
            this.loadResDict(bundleName, dirName, cc.SpriteFrame, this.spriteMap);
        };
        ResMgr.prototype.getPrefab = function (bundleName, dirName, name) {
            if (!this.prefabMap.containsKey(bundleName + '/' + dirName)) {
                return undefined;
            }
            return this.prefabMap.getValue(dirName).getValue(name);
        };
        ResMgr.prototype.getSpriteframe = function (bundleName, dirName, name) {
            if (!this.spriteMap.containsKey(bundleName + '/' + dirName)) {
                return undefined;
            }
            return this.spriteMap.getValue(dirName).getValue(name);
        };
        return ResMgr;
    }());
    /**流程管理;一条单通道管线 */
    var ProcedureMgr = /** @class */ (function () {
        function ProcedureMgr() {
            this.procedureMap = new Map();
            this.curProcedure = undefined;
        }
        Object.defineProperty(ProcedureMgr.prototype, "currentProcedure", {
            get: function () {
                return this.curProcedure;
            },
            enumerable: false,
            configurable: true
        });
        ProcedureMgr.prototype.setProcedure = function (procName, procedure) {
            this.procedureMap.set(procName, procedure);
        };
        ProcedureMgr.prototype.init = function (firstProc) {
            if (this.procedureMap.has(firstProc)) {
                this.curProcedure = firstProc;
                this.procedureMap.get(firstProc).onStart();
            }
        };
        ProcedureMgr.prototype.changeProcedure = function (procName) {
            if (this.procedureMap.has(procName)) {
                this.procedureMap.get(this.curProcedure).onLeave();
                this.curProcedure = procName;
                this.procedureMap.get(procName).onStart();
            }
            else {
                zz.error('[changeProcedure] 不存在' + procName);
            }
        };
        return ProcedureMgr;
    }());
    var ProcBase = /** @class */ (function () {
        function ProcBase() {
        }
        return ProcBase;
    }());
    zz.ProcBase = ProcBase;
    /**事件管理 */
    zz.event = new EventMgr();
    /**表格管理 */
    zz.table = new TableMgr();
    /**存储管理 */
    zz.sto = new StorageMgr();
    /**声音管理 */
    zz.sound = new SoundMgr();
    /**UI管理 */
    zz.ui = new UIMgr();
    /**场景管理 */
    zz.scene = new SceneMgr();
    /**动态资源管理 */
    zz.res = new ResMgr();
    /**流程管理 */
    zz.proc = new ProcedureMgr();
})(zz || (zz = {}));
/// <reference path="zzUtils.ts" />
var zz;
(function (zz) {
    var NdPool = /** @class */ (function () {
        function NdPool(rootNd, prefab, defaultNum) {
            if (defaultNum === void 0) { defaultNum = 10; }
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
        NdPool.prototype.initPool = function () {
            return __awaiter(this, void 0, void 0, function () {
                var i, node;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            i = 0;
                            _a.label = 1;
                        case 1:
                            if (!(i < this.defaultNum)) return [3 /*break*/, 4];
                            return [4 /*yield*/, zz.utils.instantiatePrefab(this.prefab)];
                        case 2:
                            node = _a.sent();
                            node.parent = this.rootNd;
                            this.poolLeft.push(node);
                            this.setActive(node, false);
                            _a.label = 3;
                        case 3:
                            i++;
                            return [3 /*break*/, 1];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        /**异步方法 */
        NdPool.prototype.borrowFromPoolAsync = function () {
            return __awaiter(this, void 0, void 0, function () {
                var node;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            node = this.poolLeft.pop();
                            if (!node) return [3 /*break*/, 1];
                            node.parent = this.rootNd;
                            this.setActive(node, true);
                            return [2 /*return*/, node];
                        case 1: return [4 /*yield*/, zz.utils.instantiatePrefab(this.prefab)];
                        case 2:
                            node = _a.sent();
                            node.parent = this.rootNd;
                            this.setActive(node, true);
                            return [2 /*return*/, node];
                    }
                });
            });
        };
        /**同步方法 */
        NdPool.prototype.borrowFromPoolSync = function () {
            var node = this.poolLeft.pop();
            if (!node) {
                node = cc.instantiate(this.prefab);
                node.parent = this.rootNd;
            }
            node.parent = this.rootNd;
            this.setActive(node, true);
            return node;
        };
        NdPool.prototype.returnBackToPool = function (node) {
            this.setActive(node, false);
            this.poolLeft.push(node);
        };
        NdPool.prototype.returnAllNode = function () {
            var _this = this;
            this.poolOut.forEach(function (v) {
                _this.returnBackToPool(v);
            });
            this.poolOut = [];
        };
        NdPool.prototype.releasePool = function () {
            this.returnAllNode();
            this.poolLeft.forEach(function (v) {
                v.parent = null;
                v.destroy();
            });
            this.poolLeft = new Array();
        };
        NdPool.prototype.setActive = function (node, active) {
            if (active) {
                this.poolOut.push(node);
                node.opacity = 255;
            }
            else {
                node.opacity = 0;
                node.position = cc.v3(zz.farPos);
            }
        };
        return NdPool;
    }());
    zz.NdPool = NdPool;
    var RandomNodePool = /** @class */ (function () {
        function RandomNodePool(rootNd, prefabs, defaultNum) {
            if (defaultNum === void 0) { defaultNum = 2; }
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
        RandomNodePool.prototype.initPool = function () {
            return __awaiter(this, void 0, void 0, function () {
                var i, rndPrefab, node;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            i = 0;
                            _a.label = 1;
                        case 1:
                            if (!(i < this.defaultNum)) return [3 /*break*/, 4];
                            rndPrefab = this.selectRandomPrefab();
                            return [4 /*yield*/, zz.utils.instantiatePrefab(rndPrefab)];
                        case 2:
                            node = _a.sent();
                            node.parent = this.rootNd;
                            this.poolLeft.push(node);
                            this.setActive(node, false);
                            _a.label = 3;
                        case 3:
                            i++;
                            return [3 /*break*/, 1];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        RandomNodePool.prototype.selectRandomPrefab = function () {
            return zz.utils.randomItem(this.prefabs);
        };
        RandomNodePool.prototype.borrowFromPool = function () {
            return __awaiter(this, void 0, void 0, function () {
                var node, rndPrefab;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            node = this.poolLeft.pop();
                            if (!node) return [3 /*break*/, 1];
                            this.setActive(node, true);
                            return [2 /*return*/, node];
                        case 1:
                            rndPrefab = this.selectRandomPrefab();
                            return [4 /*yield*/, zz.utils.instantiatePrefab(rndPrefab)];
                        case 2:
                            node = _a.sent();
                            node.parent = this.rootNd;
                            this.setActive(node, true);
                            return [2 /*return*/, node];
                    }
                });
            });
        };
        /**同步方法 */
        RandomNodePool.prototype.borrowFromPoolSync = function () {
            var node = this.poolLeft.pop();
            if (!node) {
                var rndPrefb = this.selectRandomPrefab();
                node = cc.instantiate(rndPrefb);
                node.parent = this.rootNd;
            }
            node.parent = this.rootNd;
            this.setActive(node, true);
            return node;
        };
        RandomNodePool.prototype.returnBackToPool = function (node) {
            this.setActive(node, false);
            this.poolLeft.push(node);
        };
        RandomNodePool.prototype.returnAllNode = function () {
            var _this = this;
            this.poolOut.forEach(function (v) {
                _this.returnBackToPool(v);
            });
            this.poolOut = [];
        };
        RandomNodePool.prototype.releasePool = function () {
            this.returnAllNode();
            this.poolLeft.forEach(function (v) {
                v.parent = undefined;
                v.destroy();
            });
            this.poolLeft = new Array();
        };
        RandomNodePool.prototype.setActive = function (node, active) {
            if (active) {
                this.poolOut.push(node);
                node.opacity = 255;
            }
            else {
                node.opacity = 0;
                node.position = cc.v3(zz.farPos);
            }
        };
        return RandomNodePool;
    }());
    zz.RandomNodePool = RandomNodePool;
})(zz || (zz = {}));
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
