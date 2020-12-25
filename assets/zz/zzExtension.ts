import * as ts from './zzTs';
import { findCom, findNode } from './zzUtils';
//#region CCC
cc.Node.prototype.findCom = function <T extends cc.Component>(type: { prototype: T }, ...path: string[]): T {
	let node = this;
	if (!node) return undefined;
	return findCom(type, node, ...path);
};

cc.Node.prototype.findNode = function (...path: string[]): cc.Node {
	let node = this;
	if (!node) return undefined;
	return findNode(node, ...path);
};
//#endregion

Object.defineProperty(String.prototype, 'replaceAll', {
	enumerable: false,
	configurable: true,
	value: function (search: string, replace: string): string {
		let str: string = this;
		if (str == null) return;
		return str.replace(new RegExp(search, 'g'), replace);
	},
});
Object.defineProperty(Array.prototype, 'forEachLeft', {
	enumerable: false,
	configurable: true,
	value: function <T, U>(callback: (element: T, index: number) => U | undefined) {
		let array = this as Array<T>;
		if (array) {
			return ts.forEach(array, callback);
		}
		return undefined;
	},
});
Object.defineProperty(Array.prototype, 'forEachRight', {
	enumerable: false,
	configurable: true,
	value: function <T, U>(callback: (element: T, index: number) => U | undefined) {
		let array = this as Array<T>;
		if (array) {
			return ts.forEachRight(array, callback);
		}
		return undefined;
	},
});
Object.defineProperty(Array.prototype, 'intersperse', {
	enumerable: false,
	configurable: true,
	value: function <T>(element: T): T[] {
		let array = this as Array<T>;
		if (array) {
			return ts.intersperse(array, element);
		} else {
			return array;
		}
	},
});
Object.defineProperty(Array.prototype, 'countWhere', {
	enumerable: false,
	configurable: true,
	value: function <T>(predicate: (x: T, i: number) => boolean) {
		let array = this as Array<T>;
		if (array) {
			return ts.countWhere(array, predicate);
		} else {
			return 0;
		}
	},
});
Object.defineProperty(Array.prototype, 'eleAt', {
	enumerable: false,
	configurable: true,
	value: function <T>(offset: number): T | undefined {
		let array = this as T[];
		return ts.elementAt(array, offset);
	},
});

Object.defineProperty(Array.prototype, 'compact', {
	enumerable: false,
	configurable: true,
	value: function <T>(): T[] {
		let array = this as T[];
		return ts.compact(array);
	},
});
Object.defineProperty(Array.prototype, 'addRange', {
	enumerable: false,
	configurable: true,
	value: function <T>(from: readonly T[] | undefined, start?: number, end?: number): T[] {
		let to = this as T[] | undefined;
		return ts.addRange(to, from, start, end);
	},
});
