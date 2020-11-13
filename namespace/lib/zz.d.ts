declare namespace zz {
    function int(x: any): number;
    function uint(x: any): number;
    function int8(x: any): number;
    function int16(x: any): number;
    function int32(x: any): number;
    function uint8(x: any): number;
    function uint16(x: any): number;
    function uint32(x: any): number;
    function float(x: any): number;
    function double(x: any): number;
}
declare namespace zz {
    enum BTState {
        Failure = 0,
        Success = 1,
        Continue = 2,
        Abort = 3
    }
    /**Behavior Tree */
    export class BT {
        static Root(): Root;
        static Sequence(): Sequence;
        static Selector(shuffle?: boolean): Selector;
        static Call(fn: Function): Action;
        static If(fn: () => boolean): ConditionalBranch;
        static While(fn: () => boolean): While;
        static Condition(fn: () => boolean): Condition;
        static Repeat(count: number): Repeat;
        static Wait(seconds: number): Wait;
        static Terminate(): Terminate;
        static Log(msg: string): Log;
        static RandomSequence(weights?: number[]): RandomSequence;
    }
    abstract class BTNode {
        abstract Tick(): BTState;
    }
    abstract class Branch extends BTNode {
        protected activeChild: number;
        protected children: BTNode[];
        OpenBranch(...children: BTNode[]): this;
        Children(): BTNode[];
        ActiveChild(): number;
        ResetChildren(): void;
    }
    class Sequence extends Branch {
        Tick(): BTState;
    }
    class Selector extends Branch {
        constructor(shuffle: boolean);
        Tick(): BTState;
    }
    abstract class Block extends Branch {
        Tick(): BTState;
    }
    class Action extends BTNode {
        fn: Function;
        constructor(fn: Function);
        Tick(): BTState;
        ToString(): string;
    }
    class Condition extends BTNode {
        fn: () => boolean;
        constructor(fn: () => boolean);
        Tick(): BTState;
        ToString(): string;
    }
    class Wait extends BTNode {
        seconds: number;
        future: number;
        constructor(seconds: number);
        Tick(): BTState;
    }
    class ConditionalBranch extends Block {
        fn: () => boolean;
        tested: boolean;
        constructor(fn: () => boolean);
        Tick(): BTState;
        ToString(): string;
    }
    class While extends Block {
        fn: () => boolean;
        constructor(fn: () => boolean);
        Tick(): BTState;
        ToString(): string;
    }
    export class Root extends Block {
        isTerminated: boolean;
        Tick(): BTState;
    }
    class Repeat extends Block {
        count: number;
        currentCount: number;
        constructor(count: number);
        Tick(): BTState;
        ToString(): string;
    }
    class RandomSequence extends Block {
        m_Weight: number[];
        m_AddedWeight: number[];
        /**
         *
         * @param weight Leave null so that all child node have the same weight
         */
        constructor(weight?: number[]);
        OpenBranch(...children: BTNode[]): this;
        private PickNewChild;
        Tick(): BTState;
        ToString(): string;
    }
    class Terminate extends BTNode {
        Tick(): BTState;
    }
    class Log extends BTNode {
        msg: string;
        constructor(msg: string);
        Tick(): BTState;
    }
    export {};
}
declare namespace zz {
    class EventMgr {
        private mEventMap;
        has(eventType: string, caller: any, callback: Function): boolean;
        fire(eventType: string, ...argArray: any[]): boolean;
        register(eventType: string, caller: any, callback: Function, ...argArray: any[]): void;
        registerOnce(eventType: string, caller: any, callback: Function, ...argArray: any[]): void;
        delRegister(type: string, caller: any, callback: Function, onceOnly?: boolean): void;
        delAllRegister(caller: any): void;
        private find;
        private addListener;
        private removeBy;
    }
    /**事件管理 */
    export const event: EventMgr;
    export {};
}
declare namespace zz {
    enum LogLevel {
        Log = 0,
        Warn = 1,
        Error = 2,
        No = 3
    }
    /**0 */
    const logLevel = LogLevel.Log;
    function log(...data: any[]): void;
    function warn(...data: any[]): void;
    function error(...data: any[]): void;
    function assertEqual(a: any, b: any, msg: string): void;
}
declare namespace zz {
    /**
     * 获取相对路径节点上的组件
     * @param type component类型
     * @param node 节点
     * @param path 相对于节点的路径
     * @returns {T}
     */
    function findCom<T extends cc.Component>(type: {
        prototype: T;
    }, node: cc.Node, ...path: string[]): T;
    /**
     * 获取相对路径上的节点; 记住cc是通过遍历获取的;
     * @param node 基准节点
     * @param path 相对路径
     * @returns {cc.Node}
     */
    function findNode(node: cc.Node, ...path: string[]): cc.Node;
    function setTipFn(fn: (msg: string) => void): void;
    /**
     * 弹出提示信息文字
     * @param msg 信息文字
     */
    function tipMsg(msg: string): void;
    /**读条页面的参数; [是否展示,进度值,描述文字] */
    type LoadingPageParam = [boolean, number, string];
    /**
     * 开关载入页;
     * @param parm 载入页参数
     */
    function loadingPage(...parm: LoadingPageParam): void;
    function setLoadingPageFn(func: (...param: LoadingPageParam) => void): void;
}
declare namespace zz.ts {
    /**
     * Iterates through 'array' by index and performs the callback on each element of array until the callback
     * returns a truthy value, then returns that value.
     * If no such value is found, the callback is applied to each element of array and undefined is returned.
     */
    function forEach<T, U>(array: readonly T[] | undefined, callback: (element: T, index: number) => U | undefined): U | undefined;
    /**
     * Like `forEach`, but iterates in reverse order.
     */
    function forEachRight<T, U>(array: readonly T[] | undefined, callback: (element: T, index: number) => U | undefined): U | undefined;
    function zipWith<T, U, V>(arrayA: readonly T[], arrayB: readonly U[], callback: (a: T, b: U, index: number) => V): V[];
    function zipToMap<K, V>(keys: readonly K[], values: readonly V[]): Map<K, V>;
    /**
     * Creates a new array with `element` interspersed in between each element of `input`
     * if there is more than 1 value in `input`. Otherwise, returns the existing array.
     */
    function intersperse<T>(input: T[], element: T): T[];
    function countWhere<T>(array: readonly T[], predicate: (x: T, i: number) => boolean): number;
    /**
     * Tests whether a value is an array.
     */
    function isArray(value: any): value is readonly {}[];
    /**
     * Appends a range of value to an array, returning the array.
     *
     * @param to The array to which `value` is to be appended. If `to` is `undefined`, a new array
     * is created if `value` was appended.
     * @param from The values to append to the array. If `from` is `undefined`, nothing is
     * appended. If an element of `from` is `undefined`, that element is not appended.
     * @param start The offset in `from` at which to start copying values.
     * @param end The offset in `from` at which to stop copying values (non-inclusive).
     */
    function addRange<T>(to: T[], from: readonly T[] | undefined, start?: number, end?: number): T[];
    function addRange<T>(to: T[] | undefined, from: readonly T[] | undefined, start?: number, end?: number): T[] | undefined;
    /**
     * Flattens an array containing a mix of array or non-array elements.
     *
     * @param array The array to flatten.
     */
    function flatten<T>(array: T[][] | readonly (T | readonly T[] | undefined)[]): T[];
    /**
     * Compacts an array, removing any falsey elements.
     */
    function compact<T>(array: (T | undefined | null | false | 0 | '')[]): T[];
    function compact<T>(array: readonly (T | undefined | null | false | 0 | '')[]): readonly T[];
    function compact<T>(array: T[]): T[];
    function compact<T>(array: readonly T[]): readonly T[];
    /**
     * Returns the first element of an array if non-empty, `undefined` otherwise.
     */
    function firstOrUndefined<T>(array: readonly T[]): T | undefined;
    /**
     * Returns the last element of an array if non-empty, `undefined` otherwise.
     */
    function lastOrUndefined<T>(array: readonly T[]): T | undefined;
    /**
     * Returns the element at a specific offset in an array if non-empty, `undefined` otherwise.
     * A negative offset indicates the element should be retrieved from the end of the array.
     */
    function elementAt<T>(array: readonly T[] | undefined, offset: number): T | undefined;
}
declare namespace zz.extension {
}
declare namespace zz.utils {
    /**打乱字符串 */
    function upsetString(oStr: string): string;
    /**字符串转unicode数字的累加和 */
    function str2Unicode2Number(str: string): number;
    /**
     * 字符串替换; 全体版本;
     * @param target 目标字符串
     * @param search 替换前
     * @param replace 替换后
     */
    function replaceAll(target: string, search: string, replace: string): string;
    /**夹子; */
    function clamp(val: number, min: number, max: number): number;
    /**
     * 随机整数,区间[lowerValue,upperValue)
     * @param lowerValue {number} 下区间
     * @param upperValue {number} 上区间;不包括
     * @returns {number} 区间内的随机整数
     */
    function randomInt(lowerValue: number, upperValue: number): number;
    /**
     * 获取随机索引号
     * @param arrOrLen 数组或是数组长度
     */
    function randomIndex<T>(arrOrLen: T[] | number): number;
    /**
     * 计算随机权重;
     * @param {number[]} weightArr 权重数组
     * @returns {number} 权重数组中所选择的索引号;
     */
    function randomIndexFromWeight(weightArr: number[]): number;
    /**
     * 随机数组项;
     * @param {T[]} arr 数组
     * @returns {T} 选择的元素; 如果是空数组,返回undefined
     */
    function randomItem<T>(arr: T[]): T;
    /**
     * 二维数组转化成一维数组
     * @param arr {T[][]} 目标二维数组
     * @returns {T[]} 展开成的一维数组
     */
    function convertArrayD2toD1<T>(arr: T[][]): T[];
    /**
     * 一维数组转化成二维数组
     * @param arr {T[]} 一维数组
     * @param col {number} 目标二维数组的列数
     * @returns {T[][]} 二维数组
     */
    function convertArrayD1toD2<T>(arr: T[], col: number): T[][];
    /**
     * 数组洗牌, 打乱顺序
     * @param arr {T[]} 目标数组
     * @param immutable {boolean} 是否保证原数组不变
     * @returns {T[]} 洗牌后的数组,immutable==true时,为新数组; immutable==false时,为原数组
     */
    function shuffleArray<T>(arr: T[], immutable?: boolean): T[];
    /**
     * 将秒数格式化为XX:XX的形式
     * @param seconds {number} 秒数
     * @returns {string} 格式为XX:XX的字符串
     */
    function formatSeconds(seconds: number): string;
    function getPosInMainCamera(node: cc.Node): cc.Vec2;
    /**
     * 实例化一个预制体; 异步
     * @param prefab {cc.Prefab | cc.Node} 预制体或节点
     * @returns {Promise<cc.Node>}
     */
    function instantiatePrefab(prefab: cc.Prefab | cc.Node): Promise<cc.Node>;
    /**
     * 根据名称获取资源bundle
     * @param bundleName {string} bundle名称
     * @returns {Promise<cc.AssetManager.Bundle>}
     */
    function getBundle(bundleName: string): Promise<cc.AssetManager.Bundle>;
    /**
     * 将二维方向向量转化成8个方向的字符串代号
     * @param dir {cc.Vec2} 方向向量
     * @returns {'S' | 'N' | 'E' | 'W' | 'SE' | 'NW' | 'NE' | 'SW'} 八方的字符代号
     */
    function getDirectionOct(dir: {
        x: number;
        y: number;
    }): 'S' | 'N' | 'E' | 'W' | 'SE' | 'NW' | 'NE' | 'SW';
}
declare namespace zz {
    class NdPool {
        readonly rootNd: cc.Node;
        private readonly prefab;
        private defaultNum;
        /**true-可用,未借出; false-不可用,已借出 */
        private poolLeft;
        private poolOut;
        constructor(rootNd: cc.Node, prefab: cc.Prefab | cc.Node, defaultNum?: number);
        private initPool;
        /**异步方法 */
        borrowFromPoolAsync(): Promise<cc.Node>;
        /**同步方法 */
        borrowFromPoolSync(): cc.Node;
        returnBackToPool(node: cc.Node): void;
        returnAllNode(): void;
        releasePool(): void;
        private setActive;
    }
    class RandomNodePool {
        readonly rootNd: cc.Node;
        private defaultNum;
        private prefabs;
        private poolLeft;
        private poolOut;
        constructor(rootNd: cc.Node, prefabs: (cc.Prefab | cc.Node)[], defaultNum?: number);
        private initPool;
        private selectRandomPrefab;
        borrowFromPool(): Promise<cc.Node>;
        /**同步方法 */
        borrowFromPoolSync(): cc.Node;
        returnBackToPool(node: cc.Node): void;
        returnAllNode(): void;
        releasePool(): void;
        private setActive;
    }
}
declare namespace zz {
    /**流程管理;一条单通道管线 */
    class ProcedureMgr {
        private procedureMap;
        private curProcedure;
        get currentProcedure(): string;
        setProcedure(procName: string, procedure: ProcBase): void;
        init(firstProc: string): void;
        changeProcedure(procName: string): void;
    }
    export abstract class ProcBase {
        abstract onStart(): void;
        abstract onLeave(): void;
    }
    /**流程管理 */
    export const proc: ProcedureMgr;
    export {};
}
declare namespace zz {
    namespace util {
        const has: (obj: any, prop: any) => any;
        /**
         * Function signature for comparing
         * <0 means a is smaller
         * = 0 means they are equal
         * >0 means a is larger
         */
        interface ICompareFunction<T> {
            (a: T, b: T): number;
        }
        /**
         * Function signature for checking equality
         */
        interface IEqualsFunction<T> {
            (a: T, b: T): boolean;
        }
        /**
         * Function signature for Iterations. Return false to break from loop
         */
        interface ILoopFunction<T> {
            (a: T): boolean | void;
        }
        /**
         * Default function to compare element order.
         * @function
         */
        function defaultCompare<T>(a: T, b: T): number;
        /**
         * Default function to test equality.
         * @function
         */
        function defaultEquals<T>(a: T, b: T): boolean;
        /**
         * Default function to convert an object to a string.
         * @function
         */
        function defaultToString(item: any): string;
        /**
         * Joins all the properies of the object using the provided join string
         */
        function makeString<T>(item: T, join?: string): string;
        /**
         * Checks if the given argument is a function.
         * @function
         */
        function isFunction(func: any): boolean;
        /**
         * Checks if the given argument is undefined.
         * @function
         */
        function isUndefined(obj: any): boolean;
        /**
         * Checks if the given argument is a string.
         * @function
         */
        function isString(obj: any): boolean;
        /**
         * Reverses a compare function.
         * @function
         */
        function reverseCompareFunction<T>(compareFunction: ICompareFunction<T>): ICompareFunction<T>;
        /**
         * Returns an equal function given a compare function.
         * @function
         */
        function compareToEquals<T>(compareFunction: ICompareFunction<T>): IEqualsFunction<T>;
    }
    export namespace arrays {
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
        function indexOf<T>(array: T[], item: T, equalsFunction?: util.IEqualsFunction<T>): number;
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
        function lastIndexOf<T>(array: T[], item: T, equalsFunction?: util.IEqualsFunction<T>): number;
        /**
         * Returns true if the specified array contains the specified element.
         * @param {*} array the array in which to search the element.
         * @param {Object} item the element to search.
         * @param {function(Object,Object):boolean=} equalsFunction optional function to
         * check equality between 2 elements.
         * @return {boolean} true if the specified array contains the specified element.
         */
        function contains<T>(array: T[], item: T, equalsFunction?: util.IEqualsFunction<T>): boolean;
        /**
         * Removes the first ocurrence of the specified element from the specified array.
         * @param {*} array the array in which to search element.
         * @param {Object} item the element to search.
         * @param {function(Object,Object):boolean=} equalsFunction optional function to
         * check equality between 2 elements.
         * @return {boolean} true if the array changed after this call.
         */
        function remove<T>(array: T[], item: T, equalsFunction?: util.IEqualsFunction<T>): boolean;
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
        function frequency<T>(array: T[], item: T, equalsFunction?: util.IEqualsFunction<T>): number;
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
        function equals<T>(array1: T[], array2: T[], equalsFunction?: util.IEqualsFunction<T>): boolean;
        /**
         * Returns shallow a copy of the specified array.
         * @param {*} array the array to copy.
         * @return {Array} a copy of the specified array
         */
        function copy<T>(array: T[]): T[];
        /**
         * Swaps the elements at the specified positions in the specified array.
         * @param {Array} array The array in which to swap elements.
         * @param {number} i the index of one element to be swapped.
         * @param {number} j the index of the other element to be swapped.
         * @return {boolean} true if the array is defined and the indexes are valid.
         */
        function swap<T>(array: T[], i: number, j: number): boolean;
        function toString<T>(array: T[]): string;
        /**
         * Executes the provided function once for each element present in this array
         * starting from index 0 to length - 1.
         * @param {Array} array The array in which to iterate.
         * @param {function(Object):*} callback function to execute, it is
         * invoked with one argument: the element value, to break the iteration you can
         * optionally return false.
         */
        function forEach<T>(array: T[], callback: util.ILoopFunction<T>): void;
    }
    export interface IDictionaryPair<K, V> {
        key: K;
        value: V;
    }
    export class Dictionary<K, V> {
        /**
         * Object holding the key-value pairs.
         * @type {Object}
         * @private
         */
        protected table: {
            [key: string]: IDictionaryPair<K, V>;
        };
        /**
         * Number of elements in the list.
         * @type {number}
         * @private
         */
        protected nElements: number;
        /**
         * Function used to convert keys to strings.
         * @type {function(Object):string}
         * @protected
         */
        protected toStr: (key: K) => string;
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
        constructor(toStrFunction?: (key: K) => string);
        /**
         * Returns the value to which this dictionary maps the specified key.
         * Returns undefined if this dictionary contains no mapping for this key.
         * @param {Object} key key whose associated value is to be returned.
         * @return {*} the value to which this dictionary maps the specified key or
         * undefined if the map contains no mapping for this key.
         */
        getValue(key: K): V;
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
        setValue(key: K, value: V): V;
        /**
         * Removes the mapping for this key from this dictionary if it is present.
         * @param {Object} key key whose mapping is to be removed from the
         * dictionary.
         * @return {*} previous value associated with specified key, or undefined if
         * there was no mapping for key.
         */
        remove(key: K): V;
        /**
         * Returns an array containing all of the keys in this dictionary.
         * @return {Array} an array containing all of the keys in this dictionary.
         */
        keys(): K[];
        /**
         * Returns an array containing all of the values in this dictionary.
         * @return {Array} an array containing all of the values in this dictionary.
         */
        values(): V[];
        /**
         * Executes the provided function once for each key-value pair
         * present in this dictionary.
         * @param {function(Object,Object):*} callback function to execute, it is
         * invoked with two arguments: key and value. To break the iteration you can
         * optionally return false.
         */
        forEach(callback: (key: K, value: V) => any): void;
        /**
         * Returns true if this dictionary contains a mapping for the specified key.
         * @param {Object} key key whose presence in this dictionary is to be
         * tested.
         * @return {boolean} true if this dictionary contains a mapping for the
         * specified key.
         */
        containsKey(key: K): boolean;
        /**
         * Removes all mappings from this dictionary.
         * @this {util.Dictionary}
         */
        clear(): void;
        /**
         * Returns the number of keys in this dictionary.
         * @return {number} the number of key-value mappings in this dictionary.
         */
        size(): number;
        /**
         * Returns true if this dictionary contains no mappings.
         * @return {boolean} true if this dictionary contains no mappings.
         */
        isEmpty(): boolean;
        toString(): string;
    }
    export interface ILinkedListNode<T> {
        element: T;
        next: ILinkedListNode<T>;
    }
    export class LinkedList<T> {
        /**
         * First node in the list
         * @type {Object}
         * @private
         */
        firstNode: ILinkedListNode<T>;
        /**
         * Last node in the list
         * @type {Object}
         * @private
         */
        private lastNode;
        /**
         * Number of elements in the list
         * @type {number}
         * @private
         */
        private nElements;
        /**
         * Creates an empty Linked List.
         * @class A linked list is a data structure consisting of a group of nodes
         * which together represent a sequence.
         * @constructor
         */
        constructor();
        /**
         * Adds an element to this list.
         * @param {Object} item element to be added.
         * @param {number=} index optional index to add the element. If no index is specified
         * the element is added to the end of this list.
         * @return {boolean} true if the element was added or false if the index is invalid
         * or if the element is undefined.
         */
        add(item: T, index?: number): boolean;
        /**
         * Returns the first element in this list.
         * @return {*} the first element of the list or undefined if the list is
         * empty.
         */
        first(): T;
        /**
         * Returns the last element in this list.
         * @return {*} the last element in the list or undefined if the list is
         * empty.
         */
        last(): T;
        /**
         * Returns the element at the specified position in this list.
         * @param {number} index desired index.
         * @return {*} the element at the given index or undefined if the index is
         * out of bounds.
         */
        elementAtIndex(index: number): T;
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
        indexOf(item: T, equalsFunction?: util.IEqualsFunction<T>): number;
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
        contains(item: T, equalsFunction?: util.IEqualsFunction<T>): boolean;
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
        remove(item: T, equalsFunction?: util.IEqualsFunction<T>): boolean;
        /**
         * Removes all of the elements from this list.
         */
        clear(): void;
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
        equals(other: LinkedList<T>, equalsFunction?: util.IEqualsFunction<T>): boolean;
        /**
         * @private
         */
        private equalsAux;
        /**
         * Removes the element at the specified position in this list.
         * @param {number} index given index.
         * @return {*} removed element or undefined if the index is out of bounds.
         */
        removeElementAtIndex(index: number): T;
        /**
         * Executes the provided function once for each element present in this list in order.
         * @param {function(Object):*} callback function to execute, it is
         * invoked with one argument: the element value, to break the iteration you can
         * optionally return false.
         */
        forEach(callback: util.ILoopFunction<T>): void;
        /**
         * Reverses the order of the elements in this linked list (makes the last
         * element first, and the first element last).
         */
        reverse(): void;
        /**
         * Returns an array containing all of the elements in this list in proper
         * sequence.
         * @return {Array.<*>} an array containing all of the elements in this list,
         * in proper sequence.
         */
        toArray(): T[];
        /**
         * Returns the number of elements in this list.
         * @return {number} the number of elements in this list.
         */
        size(): number;
        /**
         * Returns true if this list contains no elements.
         * @return {boolean} true if this list contains no elements.
         */
        isEmpty(): boolean;
        toString(): string;
        /**
         * @private
         */
        private nodeAtIndex;
        /**
         * @private
         */
        private createNode;
    }
    /**MinHeap default; MaxHeap for reverseComparison */
    export class Heap<T> {
        /**
         * Array used to store the elements od the heap.
         * @type {Array.<Object>}
         * @private
         */
        private data;
        /**
         * Function used to compare elements.
         * @type {function(Object,Object):number}
         * @private
         */
        private compare;
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
        constructor(compareFunction?: util.ICompareFunction<T>);
        /**
         * Returns the index of the left child of the node at the given index.
         * @param {number} nodeIndex The index of the node to get the left child
         * for.
         * @return {number} The index of the left child.
         * @private
         */
        private leftChildIndex;
        /**
         * Returns the index of the right child of the node at the given index.
         * @param {number} nodeIndex The index of the node to get the right child
         * for.
         * @return {number} The index of the right child.
         * @private
         */
        private rightChildIndex;
        /**
         * Returns the index of the parent of the node at the given index.
         * @param {number} nodeIndex The index of the node to get the parent for.
         * @return {number} The index of the parent.
         * @private
         */
        private parentIndex;
        /**
         * Returns the index of the smaller child node (if it exists).
         * @param {number} leftChild left child index.
         * @param {number} rightChild right child index.
         * @return {number} the index with the minimum value or -1 if it doesn't
         * exists.
         * @private
         */
        private minIndex;
        /**
         * Moves the node at the given index up to its proper place in the heap.
         * @param {number} index The index of the node to move up.
         * @private
         */
        private siftUp;
        /**
         * Moves the node at the given index down to its proper place in the heap.
         * @param {number} nodeIndex The index of the node to move down.
         * @private
         */
        private siftDown;
        /**
         * Retrieves but does not remove the root element of this heap.
         * @return {*} The value at the root of the heap. Returns undefined if the
         * heap is empty.
         */
        peek(): T;
        /**
         * Adds the given element into the heap.
         * @param {*} element the element.
         * @return true if the element was added or fals if it is undefined.
         */
        add(element: T): boolean;
        /**
         * Retrieves and removes the root element of this heap.
         * @return {*} The value removed from the root of the heap. Returns
         * undefined if the heap is empty.
         */
        removeRoot(): T;
        /**
         * Returns true if this heap contains the specified element.
         * @param {Object} element element to search for.
         * @return {boolean} true if this Heap contains the specified element, false
         * otherwise.
         */
        contains(element: T): boolean;
        /**
         * Returns the number of elements in this heap.
         * @return {number} the number of elements in this heap.
         */
        size(): number;
        /**
         * Checks if this heap is empty.
         * @return {boolean} true if and only if this heap contains no items; false
         * otherwise.
         */
        isEmpty(): boolean;
        /**
         * Removes all of the elements from this heap.
         */
        clear(): void;
        /**
         * Executes the provided function once for each element present in this heap in
         * no particular order.
         * @param {function(Object):*} callback function to execute, it is
         * invoked with one argument: the element value, to break the iteration you can
         * optionally return false.
         */
        forEach(callback: util.ILoopFunction<T>): void;
    }
    export class Set<T> {
        private dictionary;
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
        constructor(toStringFunction?: (item: T) => string);
        /**
         * Returns true if this set contains the specified element.
         * @param {Object} element element to search for.
         * @return {boolean} true if this set contains the specified element,
         * false otherwise.
         */
        contains(element: T): boolean;
        /**
         * Adds the specified element to this set if it is not already present.
         * @param {Object} element the element to insert.
         * @return {boolean} true if this set did not already contain the specified element.
         */
        add(element: T): boolean;
        /**
         * Performs an intersecion between this an another set.
         * Removes all values that are not present this set and the given set.
         * @param {collections.Set} otherSet other set.
         */
        intersection(otherSet: Set<T>): void;
        /**
         * Performs a union between this an another set.
         * Adds all values from the given set to this set.
         * @param {collections.Set} otherSet other set.
         */
        union(otherSet: Set<T>): void;
        /**
         * Performs a difference between this an another set.
         * Removes from this set all the values that are present in the given set.
         * @param {collections.Set} otherSet other set.
         */
        difference(otherSet: Set<T>): void;
        /**
         * Checks whether the given set contains all the elements in this set.
         * @param {collections.Set} otherSet other set.
         * @return {boolean} true if this set is a subset of the given set.
         */
        isSubsetOf(otherSet: Set<T>): boolean;
        /**
         * Removes the specified element from this set if it is present.
         * @return {boolean} true if this set contained the specified element.
         */
        remove(element: T): boolean;
        /**
         * Executes the provided function once for each element
         * present in this set.
         * @param {function(Object):*} callback function to execute, it is
         * invoked with one arguments: the element. To break the iteration you can
         * optionally return false.
         */
        forEach(callback: util.ILoopFunction<T>): void;
        /**
         * Returns an array containing all of the elements in this set in arbitrary order.
         * @return {Array} an array containing all of the elements in this set.
         */
        toArray(): T[];
        /**
         * Returns true if this set contains no elements.
         * @return {boolean} true if this set contains no elements.
         */
        isEmpty(): boolean;
        /**
         * Returns the number of elements in this set.
         * @return {number} the number of elements in this set.
         */
        size(): number;
        /**
         * Removes all of the elements from this set.
         */
        clear(): void;
        toString(): string;
    }
    export class Queue<T> {
        /**
         * List containing the elements.
         * @type collections.LinkedList
         * @private
         */
        private list;
        /**
         * Creates an empty queue.
         * @class A queue is a First-In-First-Out (FIFO) data structure, the first
         * element added to the queue will be the first one to be removed. This
         * implementation uses a linked list as a container.
         * @constructor
         */
        constructor();
        /**
         * Inserts the specified element into the end of this queue.
         * @param {Object} elem the element to insert.
         * @return {boolean} true if the element was inserted, or false if it is undefined.
         */
        enqueue(elem: T): boolean;
        /**
         * Inserts the specified element into the end of this queue.
         * @param {Object} elem the element to insert.
         * @return {boolean} true if the element was inserted, or false if it is undefined.
         */
        add(elem: T): boolean;
        /**
         * Retrieves and removes the head of this queue.
         * @return {*} the head of this queue, or undefined if this queue is empty.
         */
        dequeue(): T;
        /**
         * Retrieves, but does not remove, the head of this queue.
         * @return {*} the head of this queue, or undefined if this queue is empty.
         */
        peek(): T;
        /**
         * Returns the number of elements in this queue.
         * @return {number} the number of elements in this queue.
         */
        size(): number;
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
        contains(elem: T, equalsFunction?: util.IEqualsFunction<T>): boolean;
        /**
         * Checks if this queue is empty.
         * @return {boolean} true if and only if this queue contains no items; false
         * otherwise.
         */
        isEmpty(): boolean;
        /**
         * Removes all of the elements from this queue.
         */
        clear(): void;
        /**
         * Executes the provided function once for each element present in this queue in
         * FIFO order.
         * @param {function(Object):*} callback function to execute, it is
         * invoked with one argument: the element value, to break the iteration you can
         * optionally return false.
         */
        forEach(callback: util.ILoopFunction<T>): void;
    }
    export class PriorityQueue<T> {
        private heap;
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
        constructor(compareFunction?: util.ICompareFunction<T>);
        /**
         * Inserts the specified element into this priority queue.
         * @param {Object} element the element to insert.
         * @return {boolean} true if the element was inserted, or false if it is undefined.
         */
        enqueue(element: T): boolean;
        /**
         * Inserts the specified element into this priority queue.
         * @param {Object} element the element to insert.
         * @return {boolean} true if the element was inserted, or false if it is undefined.
         */
        add(element: T): boolean;
        /**
         * Retrieves and removes the highest priority element of this queue.
         * @return {*} the the highest priority element of this queue,
         *  or undefined if this queue is empty.
         */
        dequeue(): T;
        /**
         * Retrieves, but does not remove, the highest priority element of this queue.
         * @return {*} the highest priority element of this queue, or undefined if this queue is empty.
         */
        peek(): T;
        /**
         * Returns true if this priority queue contains the specified element.
         * @param {Object} element element to search for.
         * @return {boolean} true if this priority queue contains the specified element,
         * false otherwise.
         */
        contains(element: T): boolean;
        /**
         * Checks if this priority queue is empty.
         * @return {boolean} true if and only if this priority queue contains no items; false
         * otherwise.
         */
        isEmpty(): boolean;
        /**
         * Returns the number of elements in this priority queue.
         * @return {number} the number of elements in this priority queue.
         */
        size(): number;
        /**
         * Removes all of the elements from this priority queue.
         */
        clear(): void;
        /**
         * Executes the provided function once for each element present in this queue in
         * no particular order.
         * @param {function(Object):*} callback function to execute, it is
         * invoked with one argument: the element value, to break the iteration you can
         * optionally return false.
         */
        forEach(callback: util.ILoopFunction<T>): void;
    }
    export class Stack<T> {
        /**
         * List containing the elements.
         * @type collections.LinkedList
         * @private
         */
        private list;
        /**
         * Creates an empty Stack.
         * @class A Stack is a Last-In-First-Out (LIFO) data structure, the last
         * element added to the stack will be the first one to be removed. This
         * implementation uses a linked list as a container.
         * @constructor
         */
        constructor();
        /**
         * Pushes an item onto the top of this stack.
         * @param {Object} elem the element to be pushed onto this stack.
         * @return {boolean} true if the element was pushed or false if it is undefined.
         */
        push(elem: T): boolean;
        /**
         * Pushes an item onto the top of this stack.
         * @param {Object} elem the element to be pushed onto this stack.
         * @return {boolean} true if the element was pushed or false if it is undefined.
         */
        add(elem: T): boolean;
        /**
         * Removes the object at the top of this stack and returns that object.
         * @return {*} the object at the top of this stack or undefined if the
         * stack is empty.
         */
        pop(): T;
        /**
         * Looks at the object at the top of this stack without removing it from the
         * stack.
         * @return {*} the object at the top of this stack or undefined if the
         * stack is empty.
         */
        peek(): T;
        /**
         * Returns the number of elements in this stack.
         * @return {number} the number of elements in this stack.
         */
        size(): number;
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
        contains(elem: T, equalsFunction?: util.IEqualsFunction<T>): boolean;
        /**
         * Checks if this stack is empty.
         * @return {boolean} true if and only if this stack contains no items; false
         * otherwise.
         */
        isEmpty(): boolean;
        /**
         * Removes all of the elements from this stack.
         */
        clear(): void;
        /**
         * Executes the provided function once for each element present in this stack in
         * LIFO order.
         * @param {function(Object):*} callback function to execute, it is
         * invoked with one argument: the element value, to break the iteration you can
         * optionally return false.
         */
        forEach(callback: util.ILoopFunction<T>): void;
    }
    export class Bag<T> {
        private toStrF;
        private dictionary;
        private nElements;
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
        constructor(toStrFunction?: (item: T) => string);
        /**
         * Adds nCopies of the specified object to this bag.
         * @param {Object} element element to add.
         * @param {number=} nCopies the number of copies to add, if this argument is
         * undefined 1 copy is added.
         * @return {boolean} true unless element is undefined.
         */
        add(element: T, nCopies?: number): boolean;
        /**
         * Counts the number of copies of the specified object in this bag.
         * @param {Object} element the object to search for..
         * @return {number} the number of copies of the object, 0 if not found
         */
        count(element: T): number;
        /**
         * Returns true if this bag contains the specified element.
         * @param {Object} element element to search for.
         * @return {boolean} true if this bag contains the specified element,
         * false otherwise.
         */
        contains(element: T): boolean;
        /**
         * Removes nCopies of the specified object to this bag.
         * If the number of copies to remove is greater than the actual number
         * of copies in the Bag, all copies are removed.
         * @param {Object} element element to remove.
         * @param {number=} nCopies the number of copies to remove, if this argument is
         * undefined 1 copy is removed.
         * @return {boolean} true if at least 1 element was removed.
         */
        remove(element: T, nCopies?: number): boolean;
        /**
         * Returns an array containing all of the elements in this big in arbitrary order,
         * including multiple copies.
         * @return {Array} an array containing all of the elements in this bag.
         */
        toArray(): T[];
        /**
         * Returns a set of unique elements in this bag.
         * @return {collections.Set<T>} a set of unique elements in this bag.
         */
        toSet(): Set<T>;
        /**
         * Executes the provided function once for each element
         * present in this bag, including multiple copies.
         * @param {function(Object):*} callback function to execute, it is
         * invoked with one argument: the element. To break the iteration you can
         * optionally return false.
         */
        forEach(callback: util.ILoopFunction<T>): void;
        /**
         * Returns the number of elements in this bag.
         * @return {number} the number of elements in this bag.
         */
        size(): number;
        /**
         * Returns true if this bag contains no elements.
         * @return {boolean} true if this bag contains no elements.
         */
        isEmpty(): boolean;
        /**
         * Removes all of the elements from this bag.
         */
        clear(): void;
    }
    export class BSTree<T> {
        private root;
        private compare;
        private nElements;
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
        constructor(compareFunction?: util.ICompareFunction<T>);
        /**
         * Adds the specified element to this tree if it is not already present.
         * @param {Object} element the element to insert.
         * @return {boolean} true if this tree did not already contain the specified element.
         */
        add(element: T): boolean;
        /**
         * Removes all of the elements from this tree.
         */
        clear(): void;
        /**
         * Returns true if this tree contains no elements.
         * @return {boolean} true if this tree contains no elements.
         */
        isEmpty(): boolean;
        /**
         * Returns the number of elements in this tree.
         * @return {number} the number of elements in this tree.
         */
        size(): number;
        /**
         * Returns true if this tree contains the specified element.
         * @param {Object} element element to search for.
         * @return {boolean} true if this tree contains the specified element,
         * false otherwise.
         */
        contains(element: T): boolean;
        /**
         * Removes the specified element from this tree if it is present.
         * @return {boolean} true if this tree contained the specified element.
         */
        remove(element: T): boolean;
        /**
         * Executes the provided function once for each element present in this tree in
         * in-order.
         * @param {function(Object):*} callback function to execute, it is invoked with one
         * argument: the element value, to break the iteration you can optionally return false.
         */
        inorderTraversal(callback: util.ILoopFunction<T>): void;
        /**
         * Executes the provided function once for each element present in this tree in pre-order.
         * @param {function(Object):*} callback function to execute, it is invoked with one
         * argument: the element value, to break the iteration you can optionally return false.
         */
        preorderTraversal(callback: util.ILoopFunction<T>): void;
        /**
         * Executes the provided function once for each element present in this tree in post-order.
         * @param {function(Object):*} callback function to execute, it is invoked with one
         * argument: the element value, to break the iteration you can optionally return false.
         */
        postorderTraversal(callback: util.ILoopFunction<T>): void;
        /**
         * Executes the provided function once for each element present in this tree in
         * level-order.
         * @param {function(Object):*} callback function to execute, it is invoked with one
         * argument: the element value, to break the iteration you can optionally return false.
         */
        levelTraversal(callback: util.ILoopFunction<T>): void;
        /**
         * Returns the minimum element of this tree.
         * @return {*} the minimum element of this tree or undefined if this tree is
         * is empty.
         */
        minimum(): T;
        /**
         * Returns the maximum element of this tree.
         * @return {*} the maximum element of this tree or undefined if this tree is
         * is empty.
         */
        maximum(): T;
        /**
         * Executes the provided function once for each element present in this tree in inorder.
         * Equivalent to inorderTraversal.
         * @param {function(Object):*} callback function to execute, it is
         * invoked with one argument: the element value, to break the iteration you can
         * optionally return false.
         */
        forEach(callback: util.ILoopFunction<T>): void;
        /**
         * Returns an array containing all of the elements in this tree in in-order.
         * @return {Array} an array containing all of the elements in this tree in in-order.
         */
        toArray(): T[];
        /**
         * Returns the height of this tree.
         * @return {number} the height of this tree or -1 if is empty.
         */
        height(): number;
        /**
         * @private
         */
        private searchNode;
        /**
         * @private
         */
        private transplant;
        /**
         * @private
         */
        private removeNode;
        /**
         * @private
         */
        private inorderTraversalAux;
        /**
         * @private
         */
        private levelTraversalAux;
        /**
         * @private
         */
        private preorderTraversalAux;
        /**
         * @private
         */
        private postorderTraversalAux;
        /**
         * @private
         */
        private minimumAux;
        /**
         * @private
         */
        private maximumAux;
        /**
         * @private
         */
        private heightAux;
        private insertNode;
        /**
         * @private
         */
        private createNode;
    }
    export class FactoryDictionary<K, V> extends Dictionary<K, V> {
        /**
         * Factory to create default values.
         * @type {function(Object):string}
         * @protected
         */
        protected defaultFactoryFunction: () => V;
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
        constructor(defaultFactoryFunction: () => V, toStrFunction?: (key: K) => string);
        /**
         * Associates the specified default value with the specified key in this dictionary,
         * if it didn't contain the key yet. If the key existed, the existing value will be used.
         * @param {Object} key key with which the specified value is to be
         * associated.
         * @param {Object} defaultValue default value to be associated with the specified key.
         * @return {*} previous value associated with the specified key, or the default value,
         * if the key didn't exist yet.
         */
        setDefault(key: K, defaultValue: V): V;
        /**
         * Returns the value to which this dictionary maps the specified key.
         * Returns a default value created by the factory passed in the constructor,
         * if this dictionary contains no mapping for this key. The missing key will
         * automatically be added to the dictionary.
         * @param {Object} key key whose associated value is to be returned.
         * @return {*} the value to which this dictionary maps the specified key or
         * a default value if the map contains no mapping for this key.
         */
        getValue(key: K): V;
    }
    export class MultiDictionary<K, V> {
        private dict;
        private equalsF;
        private allowDuplicate;
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
        constructor(toStrFunction?: (key: K) => string, valuesEqualsFunction?: util.IEqualsFunction<V>, allowDuplicateValues?: boolean);
        /**
         * Returns an array holding the values to which this dictionary maps
         * the specified key.
         * Returns an empty array if this dictionary contains no mappings for this key.
         * @param {Object} key key whose associated values are to be returned.
         * @return {Array} an array holding the values to which this dictionary maps
         * the specified key.
         */
        getValue(key: K): V[];
        /**
         * Adds the value to the array associated with the specified key, if
         * it is not already present.
         * @param {Object} key key with which the specified value is to be
         * associated.
         * @param {Object} value the value to add to the array at the key
         * @return {boolean} true if the value was not already associated with that key.
         */
        setValue(key: K, value: V): boolean;
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
        remove(key: K, value?: V): boolean;
        /**
         * Returns an array containing all of the keys in this dictionary.
         * @return {Array} an array containing all of the keys in this dictionary.
         */
        keys(): K[];
        /**
         * Returns an array containing all of the values in this dictionary.
         * @return {Array} an array containing all of the values in this dictionary.
         */
        values(): V[];
        /**
         * Returns true if this dictionary at least one value associatted the specified key.
         * @param {Object} key key whose presence in this dictionary is to be
         * tested.
         * @return {boolean} true if this dictionary at least one value associatted
         * the specified key.
         */
        containsKey(key: K): boolean;
        /**
         * Removes all mappings from this dictionary.
         */
        clear(): void;
        /**
         * Returns the number of keys in this dictionary.
         * @return {number} the number of key-value mappings in this dictionary.
         */
        size(): number;
        /**
         * Returns true if this dictionary contains no mappings.
         * @return {boolean} true if this dictionary contains no mappings.
         */
        isEmpty(): boolean;
    }
    export interface FlatTreeNode {
        id: string;
        level: number;
        hasParent: boolean;
        childrenCount: number;
    }
    export class MultiRootTree {
        rootIds: Array<string>;
        nodes: {
            [id: string]: Array<string>;
        };
        constructor(rootIds?: Array<string>, nodes?: {
            [id: string]: Array<string>;
        });
        initRootIds(): void;
        initNodes(): void;
        createEmptyNodeIfNotExist(nodeKey: string): void;
        getRootIds(): string[];
        getNodes(): {
            [id: string]: string[];
        };
        getObject(): {
            rootIds: string[];
            nodes: {
                [id: string]: string[];
            };
        };
        toObject(): {
            rootIds: string[];
            nodes: {
                [id: string]: string[];
            };
        };
        flatten(): Array<FlatTreeNode>;
        moveIdBeforeId(moveId: string, beforeId: string): void;
        moveIdAfterId(moveId: string, afterId: string): void;
        moveIdIntoId(moveId: string, insideId: string, atStart?: boolean): void;
        deleteId(id: string): void;
        insertIdBeforeId(beforeId: string, insertId: string): void;
        insertIdAfterId(belowId: string, insertId: string): void;
        insertIdIntoId(insideId: string, insertId: string): void;
        insertIdIntoRoot(id: string, position?: number): void;
        insertIdIntoNode(nodeKey: string, id: string, position?: number): void;
        private moveId;
        private swapArrayElements;
        private rootDeleteId;
        private nodeAndSubNodesDelete;
        private nodeRefrencesDelete;
        private nodeDelete;
        private findRootId;
        private findNodeId;
        private findNode;
        private nodeInsertAtStart;
        private nodeInsertAtEnd;
        private rootDelete;
        private nodeDeleteAtIndex;
        private rootInsertAtStart;
        private rootInsertAtEnd;
    }
    export {};
}
declare namespace zz {
    /**
     * 资源加载管理; 包含预载字典和各种帮助方法;
     */
    class ResMgr {
        /**资源字典;[目录路径,[目录名,资源名]] */
        private assetDict;
        /**
         * 批量读取目录内资源,并缓存
         * @param bundleName 资源包名
         * @param dirName 资源目录,可以多层,'/'分割
         * @param assetDict 各类型对应存储
         */
        loadResDict(bundleName: string, dirName: string): Promise<cc.Asset[]>;
        /**
         * 读取资源,并缓存
         * @param bundleName 资源名
         * @param dirName 路径
         * @param assetName 资源名
         */
        loadRes(bundleName: string, dirName: string, assetName: string): Promise<cc.Asset>;
        /**
         * 获取资源；
         * @param bundleName 资源包名
         * @param dirName 目录
         * @param name 资源名称
         * @param type 类型
         * @returns 返回缓存的资源；如果未缓存，或者传入类型错误，则返回undefined
         */
        getRes<T extends cc.Asset>(bundleName: string, dirName: string, name: string, type: {
            new (): T;
        }): T;
    }
    /**动态资源管理 */
    export const res: ResMgr;
    export {};
}
declare namespace zz {
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
        /**已显示的场景节点字典; */
        private sceneDict;
        /**预载场景节点字典;未显示 */
        private preloadDict;
        /**加载标记;防止重复加载 */
        private loadingDict;
        /**打开中标记;用于预载过程中打开 */
        private openningDict;
        private _sceneRoot;
        /**场景根节点 */
        get sceneRoot(): cc.Node;
        /**设置场景根节点;在游戏开始时执行一次 */
        setSceneRoot(sceneRoot: cc.Node): void;
        /**
         * 加载场景
         * @param sceneName 场景预制体名
         * @param bundleName bundle名
         */
        loadScene(sceneName: string, bundleName: string): Promise<void>;
        /**销毁场景 */
        destroyScene(sceneName: string): void;
        /**预载场景节点 */
        preloadScene(sceneName: string, bundleName: string): Promise<any>;
    }
    /**场景管理 */
    export const scene: SceneMgr;
    export {};
}
declare namespace zz {
    class SoundMgr {
        dict_clip: Map<string, cc.AudioClip>;
        dict_soundId: MultiDictionary<string, number>;
        dict_musicID: MultiDictionary<string, number>;
        dict_flag: Map<string, number>;
        private soundVolume;
        set SoundVolume(volume: number);
        get SoundVolume(): number;
        private musicVolume;
        set MusicVolume(volume: number);
        get MusicVolume(): number;
        private _isMusicOn;
        /**音乐开关 */
        get isMusicOn(): boolean;
        set isMusicOn(v: boolean);
        private _isSoundOn;
        /**音效开关 */
        get isSoundOn(): boolean;
        set isSoundOn(v: boolean);
        private _isAllOn;
        /**声音是否打开 */
        get isAllOn(): boolean;
        set isAllOn(v: boolean);
        playSound(soundName: string, loop?: boolean): Promise<void>;
        playMusic(musicName: string, loop?: boolean): Promise<void>;
        /**切换音乐; 模拟的渐变切换; 替换PlayMusic使用*/
        changeMusic(musicName: string, loop?: boolean, inTime?: number, outTime?: number): void;
        stopSound(soundName: string): void;
        stopMusic(): void;
        stopAllSounds(): void;
        releaseSound(soundName: string): void;
    }
    /**声音管理 */
    export const sound: SoundMgr;
    export {};
}
declare namespace zz {
    class StorageMgr {
        /**
         * 清理本地存储
         */
        clear(): void;
        /**
         * 移除目标key值的存储
         * @param key {string} 存储的键值
         */
        remove(key: string): void;
        /**
         * 存储int32值
         * @param key {string} 存储键值
         * @param value {number} 数字,会被取整;
         */
        saveInt(key: string, value: number): void;
        /**
         * 获取存储的int32
         * @param key {string} 键值
         * @returns {number} int32值;默认为0
         */
        getInt(key: string): number;
        /**
         * 存储数值
         * @param key {string} 键值
         * @param value {number} double值
         */
        saveNumber(key: string, value: number): void;
        /**
         * 获取存储的数值
         * @param key {string} 键值
         * @returns {number} 数值,默认为0
         */
        getNumber(key: string): number;
        /**
         * 保存字符串
         * @param key {string} 键值
         * @param value {string} 字符串
         */
        saveString(key: string, value: string): void;
        /**
         * 读取保存的字符串;
         * @param key {string} 键值
         * @returns {string} 字符串,默认为''
         */
        getString(key: string): string;
        /**
         * 保存对象
         * @param key {string} 键值
         * @param value {T} 对象,包括数组等各种带__proto__的
         */
        saveObject<T extends {}>(key: string, value: T): void;
        /**
         * 读取对象
         * @param key {string} 键值
         * @returns {T} 对象,包括数组等
         */
        getObject<T extends {}>(key: string): T;
    }
    /**存储管理 */
    export const sto: StorageMgr;
    export {};
}
declare namespace zz {
    export interface TableBase {
        id: string | number;
    }
    class TableMgr {
        private allTables;
        constructor();
        loadConfig<T extends {
            id: string;
        }>(tableType: string, bundleName: string): Promise<void>;
        /**
         * TableComponent：获取表所有数据
         * @param tableType 数据表类型名称
         */
        getTable(tableType: string): Map<string | number, TableBase>;
        /**
         * TableComponent：获取表数据项目
         * @param tableType 数据表类型名称
         * @param key 数据表id
         */
        getTableItem(tableType: string, key: string | number): TableBase;
        /**
         * TableComponent：表是否存在数据项目
         * @param tableType 数据表类型名称
         * @param key 数据表id
         */
        hasTableItem(tableType: string, key: string | number): boolean;
    }
    /**表格管理 */
    export const table: TableMgr;
    export {};
}
declare namespace zz {
    export abstract class UIBase extends cc.Component {
        /**
         * 在onLoad之后调用; 代替onLoad使用; 注意无法重置; 由于无法确保调用一次, 事件注册不宜置于此;
         * @param args 参数列表
         */
        onOpen(args: any[]): void;
        /**代替onDestroy使用 */
        onClose(): void;
        /**代替onDiable使用 */
        onHide(): void;
        /**代替onEnable使用 */
        onShow(): void;
    }
    interface UIProgressArgs {
        /**是否显示进度条 */
        showProgressUI: boolean;
        /**描述文字 */
        desTxt?: string;
    }
    interface UICallbackArgs {
        /**回调函数 */
        fn: Function;
        /**回调函数参数 */
        args: any[];
    }
    interface UIArgs {
        /**ui名称;即uiClass名称; */
        uiName: string;
        /**openUI直传参数列表;onOpen的参数 */
        openArgs?: any[];
        /**层级参数 */
        zIndex?: number;
        /**this */
        caller?: any;
        /**进度条参数 */
        progressArgs?: UIProgressArgs;
        /**回调参数 */
        callbackArgs?: UICallbackArgs;
    }
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
        constructor();
        /**UI根节点; 从外部注入; */
        private _uiRoot;
        get uiRoot(): cc.Node;
        private uiMap;
        private pathMap;
        private layerMap;
        /**加载中标记 */
        private loadingFlagMap;
        /**打开中标记; */
        private openingMap;
        private topZIndex;
        setUIRoot(rootNd: cc.Node): void;
        setUIParams(params: Array<{
            uiName: string;
            zIndex: number;
            path: string;
        }>): void;
        openUI(uiArgs: UIArgs): Promise<any>;
        private openUINode;
        private openUIClass;
        private getUIBundle;
        /**从场景中移除UI; 保留本地缓存; */
        closeUI(uiName: string): boolean;
        preloadUI(uiName: string): Promise<cc.Node>;
        /**关闭ui; 移除本地缓存; */
        destroyUI(uiName: string, resRelease: boolean): void;
        showUI(uiName: string): boolean;
        hideUI(uiName: string): boolean;
        getUI(uiName: string): UIBase;
        isUIShown(uiName: string): boolean;
        reloadUI(uiName: string): void;
        releaseUI(uiName: string): Promise<void>;
    }
    /**UI管理 */
    export const ui: UIMgr;
    export {};
}
