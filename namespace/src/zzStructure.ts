namespace zz {
  namespace util {
    const _hasOwnProperty = Object.prototype.hasOwnProperty;
    export const has = function (obj: any, prop: any) {
      return _hasOwnProperty.call(obj, prop);
    };

    /**
     * Function signature for comparing
     * <0 means a is smaller
     * = 0 means they are equal
     * >0 means a is larger
     */
    export interface ICompareFunction<T> {
      (a: T, b: T): number;
    }

    /**
     * Function signature for checking equality
     */
    export interface IEqualsFunction<T> {
      (a: T, b: T): boolean;
    }

    /**
     * Function signature for Iterations. Return false to break from loop
     */
    export interface ILoopFunction<T> {
      (a: T): boolean | void;
    }

    /**
     * Default function to compare element order.
     * @function
     */
    export function defaultCompare<T>(a: T, b: T): number {
      if (a < b) {
        return -1;
      } else if (a === b) {
        return 0;
      } else {
        return 1;
      }
    }

    /**
     * Default function to test equality.
     * @function
     */
    export function defaultEquals<T>(a: T, b: T): boolean {
      return a === b;
    }

    /**
     * Default function to convert an object to a string.
     * @function
     */
    export function defaultToString(item: any): string {
      if (item === null) {
        return 'COLLECTION_NULL';
      } else if (isUndefined(item)) {
        return 'COLLECTION_UNDEFINED';
      } else if (isString(item)) {
        return '$s' + item;
      } else {
        return '$o' + item.toString();
      }
    }

    /**
     * Joins all the properies of the object using the provided join string
     */
    export function makeString<T>(item: T, join: string = ','): string {
      if (item === null) {
        return 'COLLECTION_NULL';
      } else if (isUndefined(item)) {
        return 'COLLECTION_UNDEFINED';
      } else if (isString(item)) {
        return item.toString();
      } else {
        let toret = '{';
        let first = true;
        for (const prop in item) {
          if (has(item, prop)) {
            if (first) {
              first = false;
            } else {
              toret = toret + join;
            }
            toret = toret + prop + ':' + (<any>item)[prop];
          }
        }
        return toret + '}';
      }
    }

    /**
     * Checks if the given argument is a function.
     * @function
     */
    export function isFunction(func: any): boolean {
      return typeof func === 'function';
    }

    /**
     * Checks if the given argument is undefined.
     * @function
     */
    export function isUndefined(obj: any): boolean {
      return typeof obj === 'undefined';
    }

    /**
     * Checks if the given argument is a string.
     * @function
     */
    export function isString(obj: any): boolean {
      return Object.prototype.toString.call(obj) === '[object String]';
    }

    /**
     * Reverses a compare function.
     * @function
     */
    export function reverseCompareFunction<T>(
      compareFunction: ICompareFunction<T>
    ): ICompareFunction<T> {
      if (!isFunction(compareFunction)) {
        return function (a, b) {
          if (a < b) {
            return 1;
          } else if (a === b) {
            return 0;
          } else {
            return -1;
          }
        };
      } else {
        return function (d: T, v: T) {
          return compareFunction(d, v) * -1;
        };
      }
    }

    /**
     * Returns an equal function given a compare function.
     * @function
     */
    export function compareToEquals<T>(
      compareFunction: ICompareFunction<T>
    ): IEqualsFunction<T> {
      return function (a: T, b: T) {
        return compareFunction(a, b) === 0;
      };
    }
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
    export function indexOf<T>(
      array: T[],
      item: T,
      equalsFunction?: util.IEqualsFunction<T>
    ): number {
      const equals = equalsFunction || util.defaultEquals;
      const length = array.length;
      for (let i = 0; i < length; i++) {
        if (equals(array[i], item)) {
          return i;
        }
      }
      return -1;
    }

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
    export function lastIndexOf<T>(
      array: T[],
      item: T,
      equalsFunction?: util.IEqualsFunction<T>
    ): number {
      const equals = equalsFunction || util.defaultEquals;
      const length = array.length;
      for (let i = length - 1; i >= 0; i--) {
        if (equals(array[i], item)) {
          return i;
        }
      }
      return -1;
    }

    /**
     * Returns true if the specified array contains the specified element.
     * @param {*} array the array in which to search the element.
     * @param {Object} item the element to search.
     * @param {function(Object,Object):boolean=} equalsFunction optional function to
     * check equality between 2 elements.
     * @return {boolean} true if the specified array contains the specified element.
     */
    export function contains<T>(
      array: T[],
      item: T,
      equalsFunction?: util.IEqualsFunction<T>
    ): boolean {
      return indexOf(array, item, equalsFunction) >= 0;
    }

    /**
     * Removes the first ocurrence of the specified element from the specified array.
     * @param {*} array the array in which to search element.
     * @param {Object} item the element to search.
     * @param {function(Object,Object):boolean=} equalsFunction optional function to
     * check equality between 2 elements.
     * @return {boolean} true if the array changed after this call.
     */
    export function remove<T>(
      array: T[],
      item: T,
      equalsFunction?: util.IEqualsFunction<T>
    ): boolean {
      const index = indexOf(array, item, equalsFunction);
      if (index < 0) {
        return false;
      }
      array.splice(index, 1);
      return true;
    }

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
    export function frequency<T>(
      array: T[],
      item: T,
      equalsFunction?: util.IEqualsFunction<T>
    ): number {
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
    export function equals<T>(
      array1: T[],
      array2: T[],
      equalsFunction?: util.IEqualsFunction<T>
    ): boolean {
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

    /**
     * Returns shallow a copy of the specified array.
     * @param {*} array the array to copy.
     * @return {Array} a copy of the specified array
     */
    export function copy<T>(array: T[]): T[] {
      return array.concat();
    }

    /**
     * Swaps the elements at the specified positions in the specified array.
     * @param {Array} array The array in which to swap elements.
     * @param {number} i the index of one element to be swapped.
     * @param {number} j the index of the other element to be swapped.
     * @return {boolean} true if the array is defined and the indexes are valid.
     */
    export function swap<T>(array: T[], i: number, j: number): boolean {
      if (i < 0 || i >= array.length || j < 0 || j >= array.length) {
        return false;
      }
      const temp = array[i];
      array[i] = array[j];
      array[j] = temp;
      return true;
    }

    export function toString<T>(array: T[]): string {
      return '[' + array.toString() + ']';
    }

    /**
     * Executes the provided function once for each element present in this array
     * starting from index 0 to length - 1.
     * @param {Array} array The array in which to iterate.
     * @param {function(Object):*} callback function to execute, it is
     * invoked with one argument: the element value, to break the iteration you can
     * optionally return false.
     */
    export function forEach<T>(
      array: T[],
      callback: util.ILoopFunction<T>
    ): void {
      for (const ele of array) {
        if (callback(ele) === false) {
          return;
        }
      }
    }
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
    protected table: { [key: string]: IDictionaryPair<K, V> };
    //: [key: K] will not work since indices can only by strings in javascript and typescript enforces this.

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
    constructor(toStrFunction?: (key: K) => string) {
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
    getValue(key: K): V {
      const pair: IDictionaryPair<K, V> = this.table['$' + this.toStr(key)];
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
    setValue(key: K, value: V): V {
      if (util.isUndefined(key) || util.isUndefined(value)) {
        return undefined;
      }

      let ret: V;
      const k = '$' + this.toStr(key);
      const previousElement: IDictionaryPair<K, V> = this.table[k];
      if (util.isUndefined(previousElement)) {
        this.nElements++;
        ret = undefined;
      } else {
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
    remove(key: K): V {
      const k = '$' + this.toStr(key);
      const previousElement: IDictionaryPair<K, V> = this.table[k];
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
    keys(): K[] {
      const array: K[] = [];
      for (const name in this.table) {
        if (util.has(this.table, name)) {
          const pair: IDictionaryPair<K, V> = this.table[name];
          array.push(pair.key);
        }
      }
      return array;
    }

    /**
     * Returns an array containing all of the values in this dictionary.
     * @return {Array} an array containing all of the values in this dictionary.
     */
    values(): V[] {
      const array: V[] = [];
      for (const name in this.table) {
        if (util.has(this.table, name)) {
          const pair: IDictionaryPair<K, V> = this.table[name];
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
    forEach(callback: (key: K, value: V) => any): void {
      for (const name in this.table) {
        if (util.has(this.table, name)) {
          const pair: IDictionaryPair<K, V> = this.table[name];
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
    containsKey(key: K): boolean {
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
    size(): number {
      return this.nElements;
    }

    /**
     * Returns true if this dictionary contains no mappings.
     * @return {boolean} true if this dictionary contains no mappings.
     */
    isEmpty(): boolean {
      return this.nElements <= 0;
    }

    toString(): string {
      let toret = '{';
      this.forEach((k, v) => {
        toret += `\n\t${k} : ${v}`;
      });
      return toret + '\n}';
    }
  }
  // A linked list node
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
    public firstNode: ILinkedListNode<T> = null;
    /**
     * Last node in the list
     * @type {Object}
     * @private
     */
    private lastNode: ILinkedListNode<T> = null;

    /**
     * Number of elements in the list
     * @type {number}
     * @private
     */
    private nElements = 0;

    /**
     * Creates an empty Linked List.
     * @class A linked list is a data structure consisting of a group of nodes
     * which together represent a sequence.
     * @constructor
     */
    constructor() {}

    /**
     * Adds an element to this list.
     * @param {Object} item element to be added.
     * @param {number=} index optional index to add the element. If no index is specified
     * the element is added to the end of this list.
     * @return {boolean} true if the element was added or false if the index is invalid
     * or if the element is undefined.
     */
    add(item: T, index?: number): boolean {
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
      } else if (index === this.nElements) {
        // Insert at the end.
        this.lastNode.next = newNode;
        this.lastNode = newNode;
      } else if (index === 0) {
        // Change first node.
        newNode.next = this.firstNode;
        this.firstNode = newNode;
      } else {
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
    first(): T {
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
    last(): T {
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
    elementAtIndex(index: number): T {
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
    indexOf(item: T, equalsFunction?: util.IEqualsFunction<T>): number {
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
    contains(item: T, equalsFunction?: util.IEqualsFunction<T>): boolean {
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
    remove(item: T, equalsFunction?: util.IEqualsFunction<T>): boolean {
      const equalsF = equalsFunction || util.defaultEquals;
      if (this.nElements < 1 || util.isUndefined(item)) {
        return false;
      }
      let previous: ILinkedListNode<T> = null;
      let currentNode: ILinkedListNode<T> = this.firstNode;

      while (currentNode !== null) {
        if (equalsF(currentNode.element, item)) {
          if (currentNode === this.firstNode) {
            this.firstNode = this.firstNode.next;
            if (currentNode === this.lastNode) {
              this.lastNode = null;
            }
          } else if (currentNode === this.lastNode) {
            this.lastNode = previous;
            previous.next = currentNode.next;
            currentNode.next = null;
          } else {
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
    clear(): void {
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
    equals(
      other: LinkedList<T>,
      equalsFunction?: util.IEqualsFunction<T>
    ): boolean {
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
    private equalsAux(
      n1: ILinkedListNode<T>,
      n2: ILinkedListNode<T>,
      eqF: util.IEqualsFunction<T>
    ): boolean {
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
    removeElementAtIndex(index: number): T {
      if (index < 0 || index >= this.nElements) {
        return undefined;
      }
      let element: T;
      if (this.nElements === 1) {
        //First node in the list.
        element = this.firstNode.element;
        this.firstNode = null;
        this.lastNode = null;
      } else {
        const previous = this.nodeAtIndex(index - 1);
        if (previous === null) {
          element = this.firstNode.element;
          this.firstNode = this.firstNode.next;
        } else if (previous.next === this.lastNode) {
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
    forEach(callback: util.ILoopFunction<T>): void {
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
    reverse(): void {
      let previous: ILinkedListNode<T> = null;
      let current: ILinkedListNode<T> = this.firstNode;
      let temp: ILinkedListNode<T> = null;
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
    toArray(): T[] {
      const array: T[] = [];
      let currentNode: ILinkedListNode<T> = this.firstNode;
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
    size(): number {
      return this.nElements;
    }

    /**
     * Returns true if this list contains no elements.
     * @return {boolean} true if this list contains no elements.
     */
    isEmpty(): boolean {
      return this.nElements <= 0;
    }

    toString(): string {
      return arrays.toString(this.toArray());
    }

    /**
     * @private
     */
    private nodeAtIndex(index: number): ILinkedListNode<T> {
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
    private createNode(item: T): ILinkedListNode<T> {
      return {
        element: item,
        next: null,
      };
    }
  }
  /**MinHeap default; MaxHeap for reverseComparison */
  export class Heap<T> {
    /**
     * Array used to store the elements od the heap.
     * @type {Array.<Object>}
     * @private
     */
    private data: T[] = [];
    /**
     * Function used to compare elements.
     * @type {function(Object,Object):number}
     * @private
     */
    private compare: util.ICompareFunction<T>;
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
    constructor(compareFunction?: util.ICompareFunction<T>) {
      this.compare = compareFunction || util.defaultCompare;
    }

    /**
     * Returns the index of the left child of the node at the given index.
     * @param {number} nodeIndex The index of the node to get the left child
     * for.
     * @return {number} The index of the left child.
     * @private
     */
    private leftChildIndex(nodeIndex: number): number {
      return 2 * nodeIndex + 1;
    }
    /**
     * Returns the index of the right child of the node at the given index.
     * @param {number} nodeIndex The index of the node to get the right child
     * for.
     * @return {number} The index of the right child.
     * @private
     */
    private rightChildIndex(nodeIndex: number): number {
      return 2 * nodeIndex + 2;
    }
    /**
     * Returns the index of the parent of the node at the given index.
     * @param {number} nodeIndex The index of the node to get the parent for.
     * @return {number} The index of the parent.
     * @private
     */
    private parentIndex(nodeIndex: number): number {
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
    private minIndex(leftChild: number, rightChild: number): number {
      if (rightChild >= this.data.length) {
        if (leftChild >= this.data.length) {
          return -1;
        } else {
          return leftChild;
        }
      } else {
        if (this.compare(this.data[leftChild], this.data[rightChild]) <= 0) {
          return leftChild;
        } else {
          return rightChild;
        }
      }
    }
    /**
     * Moves the node at the given index up to its proper place in the heap.
     * @param {number} index The index of the node to move up.
     * @private
     */
    private siftUp(index: number): void {
      let parent = this.parentIndex(index);
      while (
        index > 0 &&
        this.compare(this.data[parent], this.data[index]) > 0
      ) {
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
    private siftDown(nodeIndex: number): void {
      //smaller child index
      let min = this.minIndex(
        this.leftChildIndex(nodeIndex),
        this.rightChildIndex(nodeIndex)
      );

      while (
        min >= 0 &&
        this.compare(this.data[nodeIndex], this.data[min]) > 0
      ) {
        arrays.swap(this.data, min, nodeIndex);
        nodeIndex = min;
        min = this.minIndex(
          this.leftChildIndex(nodeIndex),
          this.rightChildIndex(nodeIndex)
        );
      }
    }
    /**
     * Retrieves but does not remove the root element of this heap.
     * @return {*} The value at the root of the heap. Returns undefined if the
     * heap is empty.
     */
    peek(): T {
      if (this.data.length > 0) {
        return this.data[0];
      } else {
        return undefined;
      }
    }
    /**
     * Adds the given element into the heap.
     * @param {*} element the element.
     * @return true if the element was added or fals if it is undefined.
     */
    add(element: T): boolean {
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
    removeRoot(): T {
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
    contains(element: T): boolean {
      const equF = util.compareToEquals(this.compare);
      return arrays.contains(this.data, element, equF);
    }
    /**
     * Returns the number of elements in this heap.
     * @return {number} the number of elements in this heap.
     */
    size(): number {
      return this.data.length;
    }
    /**
     * Checks if this heap is empty.
     * @return {boolean} true if and only if this heap contains no items; false
     * otherwise.
     */
    isEmpty(): boolean {
      return this.data.length <= 0;
    }
    /**
     * Removes all of the elements from this heap.
     */
    clear(): void {
      this.data.length = 0;
    }

    /**
     * Executes the provided function once for each element present in this heap in
     * no particular order.
     * @param {function(Object):*} callback function to execute, it is
     * invoked with one argument: the element value, to break the iteration you can
     * optionally return false.
     */
    forEach(callback: util.ILoopFunction<T>) {
      arrays.forEach(this.data, callback);
    }
  }
  export class Set<T> {
    private dictionary: Dictionary<T, any>;

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
    constructor(toStringFunction?: (item: T) => string) {
      this.dictionary = new Dictionary<T, any>(toStringFunction);
    }

    /**
     * Returns true if this set contains the specified element.
     * @param {Object} element element to search for.
     * @return {boolean} true if this set contains the specified element,
     * false otherwise.
     */
    contains(element: T): boolean {
      return this.dictionary.containsKey(element);
    }

    /**
     * Adds the specified element to this set if it is not already present.
     * @param {Object} element the element to insert.
     * @return {boolean} true if this set did not already contain the specified element.
     */
    add(element: T): boolean {
      if (this.contains(element) || util.isUndefined(element)) {
        return false;
      } else {
        this.dictionary.setValue(element, element);
        return true;
      }
    }

    /**
     * Performs an intersecion between this an another set.
     * Removes all values that are not present this set and the given set.
     * @param {collections.Set} otherSet other set.
     */
    intersection(otherSet: Set<T>): void {
      const set = this;
      this.forEach(function (element: T): boolean {
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
    union(otherSet: Set<T>): void {
      const set = this;
      otherSet.forEach(function (element: T): boolean {
        set.add(element);
        return true;
      });
    }

    /**
     * Performs a difference between this an another set.
     * Removes from this set all the values that are present in the given set.
     * @param {collections.Set} otherSet other set.
     */
    difference(otherSet: Set<T>): void {
      const set = this;
      otherSet.forEach(function (element: T): boolean {
        set.remove(element);
        return true;
      });
    }

    /**
     * Checks whether the given set contains all the elements in this set.
     * @param {collections.Set} otherSet other set.
     * @return {boolean} true if this set is a subset of the given set.
     */
    isSubsetOf(otherSet: Set<T>): boolean {
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
    remove(element: T): boolean {
      if (!this.contains(element)) {
        return false;
      } else {
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
    forEach(callback: util.ILoopFunction<T>): void {
      this.dictionary.forEach(function (k, v) {
        return callback(v);
      });
    }

    /**
     * Returns an array containing all of the elements in this set in arbitrary order.
     * @return {Array} an array containing all of the elements in this set.
     */
    toArray(): T[] {
      return this.dictionary.values();
    }

    /**
     * Returns true if this set contains no elements.
     * @return {boolean} true if this set contains no elements.
     */
    isEmpty(): boolean {
      return this.dictionary.isEmpty();
    }

    /**
     * Returns the number of elements in this set.
     * @return {number} the number of elements in this set.
     */
    size(): number {
      return this.dictionary.size();
    }

    /**
     * Removes all of the elements from this set.
     */
    clear(): void {
      this.dictionary.clear();
    }

    /*
     * Provides a string representation for display
     */
    toString(): string {
      return arrays.toString(this.toArray());
    }
  }
  export class Queue<T> {
    /**
     * List containing the elements.
     * @type collections.LinkedList
     * @private
     */
    private list: LinkedList<T>;

    /**
     * Creates an empty queue.
     * @class A queue is a First-In-First-Out (FIFO) data structure, the first
     * element added to the queue will be the first one to be removed. This
     * implementation uses a linked list as a container.
     * @constructor
     */
    constructor() {
      this.list = new LinkedList<T>();
    }

    /**
     * Inserts the specified element into the end of this queue.
     * @param {Object} elem the element to insert.
     * @return {boolean} true if the element was inserted, or false if it is undefined.
     */
    enqueue(elem: T): boolean {
      return this.list.add(elem);
    }
    /**
     * Inserts the specified element into the end of this queue.
     * @param {Object} elem the element to insert.
     * @return {boolean} true if the element was inserted, or false if it is undefined.
     */
    add(elem: T): boolean {
      return this.list.add(elem);
    }
    /**
     * Retrieves and removes the head of this queue.
     * @return {*} the head of this queue, or undefined if this queue is empty.
     */
    dequeue(): T {
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
    peek(): T {
      if (this.list.size() !== 0) {
        return this.list.first();
      }
      return undefined;
    }

    /**
     * Returns the number of elements in this queue.
     * @return {number} the number of elements in this queue.
     */
    size(): number {
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
    contains(elem: T, equalsFunction?: util.IEqualsFunction<T>): boolean {
      return this.list.contains(elem, equalsFunction);
    }

    /**
     * Checks if this queue is empty.
     * @return {boolean} true if and only if this queue contains no items; false
     * otherwise.
     */
    isEmpty(): boolean {
      return this.list.size() <= 0;
    }

    /**
     * Removes all of the elements from this queue.
     */
    clear(): void {
      this.list.clear();
    }

    /**
     * Executes the provided function once for each element present in this queue in
     * FIFO order.
     * @param {function(Object):*} callback function to execute, it is
     * invoked with one argument: the element value, to break the iteration you can
     * optionally return false.
     */
    forEach(callback: util.ILoopFunction<T>) {
      this.list.forEach(callback);
    }
  }
  export class PriorityQueue<T> {
    private heap: Heap<T>;
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
    constructor(compareFunction?: util.ICompareFunction<T>) {
      this.heap = new Heap<T>(util.reverseCompareFunction(compareFunction));
    }

    /**
     * Inserts the specified element into this priority queue.
     * @param {Object} element the element to insert.
     * @return {boolean} true if the element was inserted, or false if it is undefined.
     */
    enqueue(element: T): boolean {
      return this.heap.add(element);
    }

    /**
     * Inserts the specified element into this priority queue.
     * @param {Object} element the element to insert.
     * @return {boolean} true if the element was inserted, or false if it is undefined.
     */
    add(element: T): boolean {
      return this.heap.add(element);
    }

    /**
     * Retrieves and removes the highest priority element of this queue.
     * @return {*} the the highest priority element of this queue,
     *  or undefined if this queue is empty.
     */
    dequeue(): T {
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
    peek(): T {
      return this.heap.peek();
    }

    /**
     * Returns true if this priority queue contains the specified element.
     * @param {Object} element element to search for.
     * @return {boolean} true if this priority queue contains the specified element,
     * false otherwise.
     */
    contains(element: T): boolean {
      return this.heap.contains(element);
    }

    /**
     * Checks if this priority queue is empty.
     * @return {boolean} true if and only if this priority queue contains no items; false
     * otherwise.
     */
    isEmpty(): boolean {
      return this.heap.isEmpty();
    }

    /**
     * Returns the number of elements in this priority queue.
     * @return {number} the number of elements in this priority queue.
     */
    size(): number {
      return this.heap.size();
    }

    /**
     * Removes all of the elements from this priority queue.
     */
    clear(): void {
      this.heap.clear();
    }

    /**
     * Executes the provided function once for each element present in this queue in
     * no particular order.
     * @param {function(Object):*} callback function to execute, it is
     * invoked with one argument: the element value, to break the iteration you can
     * optionally return false.
     */
    forEach(callback: util.ILoopFunction<T>) {
      this.heap.forEach(callback);
    }
  }
  export class Stack<T> {
    /**
     * List containing the elements.
     * @type collections.LinkedList
     * @private
     */
    private list: LinkedList<T>;
    /**
     * Creates an empty Stack.
     * @class A Stack is a Last-In-First-Out (LIFO) data structure, the last
     * element added to the stack will be the first one to be removed. This
     * implementation uses a linked list as a container.
     * @constructor
     */
    constructor() {
      this.list = new LinkedList<T>();
    }

    /**
     * Pushes an item onto the top of this stack.
     * @param {Object} elem the element to be pushed onto this stack.
     * @return {boolean} true if the element was pushed or false if it is undefined.
     */
    push(elem: T) {
      return this.list.add(elem, 0);
    }
    /**
     * Pushes an item onto the top of this stack.
     * @param {Object} elem the element to be pushed onto this stack.
     * @return {boolean} true if the element was pushed or false if it is undefined.
     */
    add(elem: T) {
      return this.list.add(elem, 0);
    }
    /**
     * Removes the object at the top of this stack and returns that object.
     * @return {*} the object at the top of this stack or undefined if the
     * stack is empty.
     */
    pop(): T {
      return this.list.removeElementAtIndex(0);
    }
    /**
     * Looks at the object at the top of this stack without removing it from the
     * stack.
     * @return {*} the object at the top of this stack or undefined if the
     * stack is empty.
     */
    peek(): T {
      return this.list.first();
    }
    /**
     * Returns the number of elements in this stack.
     * @return {number} the number of elements in this stack.
     */
    size(): number {
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
    contains(elem: T, equalsFunction?: util.IEqualsFunction<T>) {
      return this.list.contains(elem, equalsFunction);
    }
    /**
     * Checks if this stack is empty.
     * @return {boolean} true if and only if this stack contains no items; false
     * otherwise.
     */
    isEmpty(): boolean {
      return this.list.isEmpty();
    }
    /**
     * Removes all of the elements from this stack.
     */
    clear(): void {
      this.list.clear();
    }

    /**
     * Executes the provided function once for each element present in this stack in
     * LIFO order.
     * @param {function(Object):*} callback function to execute, it is
     * invoked with one argument: the element value, to break the iteration you can
     * optionally return false.
     */
    forEach(callback: util.ILoopFunction<T>) {
      this.list.forEach(callback);
    }
  }
  export class Bag<T> {
    private toStrF: (item: T) => string;
    private dictionary: Dictionary<T, any>;
    private nElements: number;

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
    constructor(toStrFunction?: (item: T) => string) {
      this.toStrF = toStrFunction || util.defaultToString;
      this.dictionary = new Dictionary<T, any>(this.toStrF);
      this.nElements = 0;
    }

    /**
     * Adds nCopies of the specified object to this bag.
     * @param {Object} element element to add.
     * @param {number=} nCopies the number of copies to add, if this argument is
     * undefined 1 copy is added.
     * @return {boolean} true unless element is undefined.
     */
    add(element: T, nCopies: number = 1): boolean {
      if (util.isUndefined(element) || nCopies <= 0) {
        return false;
      }

      if (!this.contains(element)) {
        const node = {
          value: element,
          copies: nCopies,
        };
        this.dictionary.setValue(element, node);
      } else {
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
    count(element: T): number {
      if (!this.contains(element)) {
        return 0;
      } else {
        return this.dictionary.getValue(element).copies;
      }
    }

    /**
     * Returns true if this bag contains the specified element.
     * @param {Object} element element to search for.
     * @return {boolean} true if this bag contains the specified element,
     * false otherwise.
     */
    contains(element: T): boolean {
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
    remove(element: T, nCopies: number = 1) {
      if (util.isUndefined(element) || nCopies <= 0) {
        return false;
      }

      if (!this.contains(element)) {
        return false;
      } else {
        const node = this.dictionary.getValue(element);
        if (nCopies > node.copies) {
          this.nElements -= node.copies;
        } else {
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
    toArray(): T[] {
      const a: Array<T> = [];
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
    toSet(): Set<T> {
      const toret = new Set<T>(this.toStrF);
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
    forEach(callback: util.ILoopFunction<T>) {
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
    size(): number {
      return this.nElements;
    }

    /**
     * Returns true if this bag contains no elements.
     * @return {boolean} true if this bag contains no elements.
     */
    isEmpty(): boolean {
      return this.nElements === 0;
    }

    /**
     * Removes all of the elements from this bag.
     */
    clear(): void {
      this.nElements = 0;
      this.dictionary.clear();
    }
  }
  interface BSTreeNode<T> {
    element: T;
    leftCh: BSTreeNode<T>;
    rightCh: BSTreeNode<T>;
    parent: BSTreeNode<T>;
  }
  export class BSTree<T> {
    private root: BSTreeNode<T>;
    private compare: util.ICompareFunction<T>;
    private nElements: number;
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
    constructor(compareFunction?: util.ICompareFunction<T>) {
      this.root = null;
      this.compare = compareFunction || util.defaultCompare;
      this.nElements = 0;
    }

    /**
     * Adds the specified element to this tree if it is not already present.
     * @param {Object} element the element to insert.
     * @return {boolean} true if this tree did not already contain the specified element.
     */
    add(element: T): boolean {
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
    clear(): void {
      this.root = null;
      this.nElements = 0;
    }

    /**
     * Returns true if this tree contains no elements.
     * @return {boolean} true if this tree contains no elements.
     */
    isEmpty(): boolean {
      return this.nElements === 0;
    }

    /**
     * Returns the number of elements in this tree.
     * @return {number} the number of elements in this tree.
     */
    size(): number {
      return this.nElements;
    }

    /**
     * Returns true if this tree contains the specified element.
     * @param {Object} element element to search for.
     * @return {boolean} true if this tree contains the specified element,
     * false otherwise.
     */
    contains(element: T): boolean {
      if (util.isUndefined(element)) {
        return false;
      }
      return this.searchNode(this.root, element) !== null;
    }

    /**
     * Removes the specified element from this tree if it is present.
     * @return {boolean} true if this tree contained the specified element.
     */
    remove(element: T): boolean {
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
    inorderTraversal(callback: util.ILoopFunction<T>): void {
      this.inorderTraversalAux(this.root, callback, {
        stop: false,
      });
    }

    /**
     * Executes the provided function once for each element present in this tree in pre-order.
     * @param {function(Object):*} callback function to execute, it is invoked with one
     * argument: the element value, to break the iteration you can optionally return false.
     */
    preorderTraversal(callback: util.ILoopFunction<T>): void {
      this.preorderTraversalAux(this.root, callback, {
        stop: false,
      });
    }

    /**
     * Executes the provided function once for each element present in this tree in post-order.
     * @param {function(Object):*} callback function to execute, it is invoked with one
     * argument: the element value, to break the iteration you can optionally return false.
     */
    postorderTraversal(callback: util.ILoopFunction<T>): void {
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
    levelTraversal(callback: util.ILoopFunction<T>): void {
      this.levelTraversalAux(this.root, callback);
    }

    /**
     * Returns the minimum element of this tree.
     * @return {*} the minimum element of this tree or undefined if this tree is
     * is empty.
     */
    minimum(): T {
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
    maximum(): T {
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
    forEach(callback: util.ILoopFunction<T>): void {
      this.inorderTraversal(callback);
    }

    /**
     * Returns an array containing all of the elements in this tree in in-order.
     * @return {Array} an array containing all of the elements in this tree in in-order.
     */
    toArray(): T[] {
      const array: Array<T> = [];
      this.inorderTraversal(function (element: T): boolean {
        array.push(element);
        return true;
      });
      return array;
    }

    /**
     * Returns the height of this tree.
     * @return {number} the height of this tree or -1 if is empty.
     */
    height(): number {
      return this.heightAux(this.root);
    }

    /**
     * @private
     */
    private searchNode(node: BSTreeNode<T>, element: T): BSTreeNode<T> {
      let cmp: number = null;
      while (node !== null && cmp !== 0) {
        cmp = this.compare(element, node.element);
        if (cmp < 0) {
          node = node.leftCh;
        } else if (cmp > 0) {
          node = node.rightCh;
        }
      }
      return node;
    }

    /**
     * @private
     */
    private transplant(n1: BSTreeNode<T>, n2: BSTreeNode<T>): void {
      if (n1.parent === null) {
        this.root = n2;
      } else if (n1 === n1.parent.leftCh) {
        n1.parent.leftCh = n2;
      } else {
        n1.parent.rightCh = n2;
      }
      if (n2 !== null) {
        n2.parent = n1.parent;
      }
    }

    /**
     * @private
     */
    private removeNode(node: BSTreeNode<T>): void {
      if (node.leftCh === null) {
        this.transplant(node, node.rightCh);
      } else if (node.rightCh === null) {
        this.transplant(node, node.leftCh);
      } else {
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
    private inorderTraversalAux(
      node: BSTreeNode<T>,
      callback: util.ILoopFunction<T>,
      signal: { stop: boolean }
    ): void {
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
    private levelTraversalAux(
      node: BSTreeNode<T>,
      callback: util.ILoopFunction<T>
    ) {
      const queue = new Queue<BSTreeNode<T>>();
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
    private preorderTraversalAux(
      node: BSTreeNode<T>,
      callback: util.ILoopFunction<T>,
      signal: { stop: boolean }
    ) {
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
    private postorderTraversalAux(
      node: BSTreeNode<T>,
      callback: util.ILoopFunction<T>,
      signal: { stop: boolean }
    ) {
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
    private minimumAux(node: BSTreeNode<T>): BSTreeNode<T> {
      while (node.leftCh !== null) {
        node = node.leftCh;
      }
      return node;
    }

    /**
     * @private
     */
    private maximumAux(node: BSTreeNode<T>): BSTreeNode<T> {
      while (node.rightCh !== null) {
        node = node.rightCh;
      }
      return node;
    }

    /**
     * @private
     */
    private heightAux(node: BSTreeNode<T>): number {
      if (node === null) {
        return -1;
      }
      return (
        Math.max(this.heightAux(node.leftCh), this.heightAux(node.rightCh)) + 1
      );
    }

    /*
     * @private
     */
    private insertNode(node: BSTreeNode<T>): BSTreeNode<T> {
      let parent: any = null;
      let position = this.root;
      let cmp: number = null;
      while (position !== null) {
        cmp = this.compare(node.element, position.element);
        if (cmp === 0) {
          return null;
        } else if (cmp < 0) {
          parent = position;
          position = position.leftCh;
        } else {
          parent = position;
          position = position.rightCh;
        }
      }
      node.parent = parent;
      if (parent === null) {
        // tree is empty
        this.root = node;
      } else if (this.compare(node.element, parent.element) < 0) {
        parent.leftCh = node;
      } else {
        parent.rightCh = node;
      }
      return node;
    }

    /**
     * @private
     */
    private createNode(element: T): BSTreeNode<T> {
      return {
        element: element,
        leftCh: null,
        rightCh: null,
        parent: null,
      };
    }
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
    constructor(
      defaultFactoryFunction: () => V,
      toStrFunction?: (key: K) => string
    ) {
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
    setDefault(key: K, defaultValue: V): V {
      const currentValue: V = super.getValue(key);

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
    getValue(key: K): V {
      return this.setDefault(key, this.defaultFactoryFunction());
    }
  }
  export class MultiDictionary<K, V> {
    // Cannot do:
    // class MultiDictionary<K,V> extends Dictionary<K,Array<V>> {
    // Since we want to reuse the function name setValue and types in signature become incompatible
    // Therefore we are using composition instead of inheritance
    private dict: Dictionary<K, Array<V>>;
    private equalsF: util.IEqualsFunction<V>;
    private allowDuplicate: boolean;

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
    constructor(
      toStrFunction?: (key: K) => string,
      valuesEqualsFunction?: util.IEqualsFunction<V>,
      allowDuplicateValues = false
    ) {
      this.dict = new Dictionary<K, Array<V>>(toStrFunction);
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
    getValue(key: K): V[] {
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
    setValue(key: K, value: V): boolean {
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
    remove(key: K, value?: V): boolean {
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
    keys(): K[] {
      return this.dict.keys();
    }

    /**
     * Returns an array containing all of the values in this dictionary.
     * @return {Array} an array containing all of the values in this dictionary.
     */
    values(): V[] {
      const values = this.dict.values();
      const array: Array<V> = [];
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
    containsKey(key: K): boolean {
      return this.dict.containsKey(key);
    }

    /**
     * Removes all mappings from this dictionary.
     */
    clear(): void {
      this.dict.clear();
    }

    /**
     * Returns the number of keys in this dictionary.
     * @return {number} the number of key-value mappings in this dictionary.
     */
    size(): number {
      return this.dict.size();
    }

    /**
     * Returns true if this dictionary contains no mappings.
     * @return {boolean} true if this dictionary contains no mappings.
     */
    isEmpty(): boolean {
      return this.dict.isEmpty();
    }
  }
  enum Direction {
    BEFORE,
    AFTER,
    INSIDE_AT_END,
    INSIDE_AT_START,
  }
  export interface FlatTreeNode {
    id: string;
    level: number;
    hasParent: boolean;
    childrenCount: number;
  }
  export class MultiRootTree {
    rootIds: Array<string>;
    nodes: { [id: string]: Array<string> };

    constructor(
      rootIds: Array<string> = [],
      nodes: { [id: string]: Array<string> } = {}
    ) {
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

    createEmptyNodeIfNotExist(nodeKey: string) {
      if (!this.nodes[nodeKey]) {
        this.nodes[nodeKey] = [];
      }
    }

    getRootIds() {
      let clone = this.rootIds.slice();
      return clone;
    }

    getNodes() {
      let clone: { [id: string]: Array<string> } = {};
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

    flatten(): Array<FlatTreeNode> {
      const _this = this;
      let extraPropsObject: Array<FlatTreeNode> = [];

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

      function countChildren(id: string) {
        if (!_this.nodes[id]) {
          return 0;
        } else {
          const childrenCount = _this.nodes[id].length;
          return childrenCount;
        }
      }

      function traverse(
        startId: string,
        nodes: { [id: string]: Array<string> },
        returnArray: Array<any>,
        level = 0
      ) {
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

    moveIdBeforeId(moveId: string, beforeId: string) {
      return this.moveId(moveId, beforeId, Direction.BEFORE);
    }

    moveIdAfterId(moveId: string, afterId: string) {
      return this.moveId(moveId, afterId, Direction.AFTER);
    }

    moveIdIntoId(moveId: string, insideId: string, atStart = true) {
      if (atStart) {
        return this.moveId(moveId, insideId, Direction.INSIDE_AT_START);
      } else {
        return this.moveId(moveId, insideId, Direction.INSIDE_AT_END);
      }
    }

    deleteId(id: string) {
      this.rootDeleteId(id);
      this.nodeAndSubNodesDelete(id);
      this.nodeRefrencesDelete(id);
    }

    insertIdBeforeId(beforeId: string, insertId: string) {
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

    insertIdAfterId(belowId: string, insertId: string) {
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

    insertIdIntoId(insideId: string, insertId: string) {
      this.nodeInsertAtEnd(insideId, insertId);
      this.nodes[insertId] = [];
    }

    insertIdIntoRoot(id: string, position?: number) {
      if (position === undefined) {
        this.rootInsertAtEnd(id);
      } else {
        if (position < 0) {
          const length = this.rootIds.length;
          this.rootIds.splice(position + length + 1, 0, id);
        } else {
          this.rootIds.splice(position, 0, id);
        }
      }

      this.nodes[id] = this.nodes[id] || [];
    }

    insertIdIntoNode(nodeKey: string, id: string, position?: number) {
      this.nodes[nodeKey] = this.nodes[nodeKey] || [];
      this.nodes[id] = this.nodes[id] || [];
      if (position === undefined) {
        this.nodeInsertAtEnd(nodeKey, id);
      } else {
        if (position < 0) {
          const length = this.nodes[nodeKey].length;
          this.nodes[nodeKey].splice(position + length + 1, 0, id);
        } else {
          this.nodes[nodeKey].splice(position, 0, id);
        }
      }
    }

    private moveId(moveId: string, beforeId: string, direction: Direction) {
      let sourceId = moveId;
      const sourceRootIndex = this.findRootId(sourceId);
      let sourceNodeKey: string;
      let sourceNodeIdIndex: number;

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
      let targetNodeKey: string;
      let targetNodeIdIndex: number;

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
        } else {
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
      } else {
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
        } else {
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

    private swapArrayElements(arr: Array<any>, indexA: number, indexB: number) {
      var temp = arr[indexA];
      arr[indexA] = arr[indexB];
      arr[indexB] = temp;
      return arr;
    }

    private rootDeleteId(id: string) {
      let index = this.findRootId(id);
      if (index > -1) {
        this.rootDelete(index);
      }
    }

    private nodeAndSubNodesDelete(nodeKey: string) {
      let toDeleteLater: Array<string> = [];
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

    private nodeRefrencesDelete(id: string) {
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

    private nodeDelete(nodeKey: string) {
      delete this.nodes[nodeKey];
    }

    private findRootId(id: string): number {
      return this.rootIds.indexOf(id);
    }

    private findNodeId(nodeKey: string, id: string): number {
      return this.nodes[nodeKey].indexOf(id);
    }

    private findNode(nodeKey: string) {
      return this.nodes[nodeKey];
    }

    private nodeInsertAtStart(nodeKey: string, id: string) {
      this.nodes[nodeKey].unshift(id);
    }

    private nodeInsertAtEnd(nodeKey: string, id: string) {
      this.nodes[nodeKey].push(id);
    }

    private rootDelete(index: number) {
      this.rootIds.splice(index, 1);
    }

    private nodeDeleteAtIndex(nodeKey: string, index: number) {
      this.nodes[nodeKey].splice(index, 1);
    }

    private rootInsertAtStart(id: string) {
      this.rootIds.unshift(id);
    }

    private rootInsertAtEnd(id: string) {
      this.rootIds.push(id);
    }
  }
}
window.zz = zz;