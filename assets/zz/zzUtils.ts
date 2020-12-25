import { warn } from "./zzLog";
import { int } from "./zzType";

/**打乱字符串 */
export function upsetString(oStr: string) {
	let orginStr = oStr.split('');
	let len = orginStr.length;
	let result = '';
	let tmp;
	for (let i = len - 1; i > 0; i--) {
		let index = int(len * Math.random()); //随机数的产生范围不变
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
/**字符串转unicode数字的累加和 */
export function str2Unicode2Number(str: string) {
	let num = 0;
	for (let i = 0, len = str.length; i < len; i++) {
		let strH = str.charCodeAt(i);
		num += +strH;
	}
	return num;
}
/**
 * 字符串替换; 全体版本;
 * @param target 目标字符串
 * @param search 替换前
 * @param replace 替换后
 */
export function replaceAll(target: string, search: string, replace: string) {
	return target.replace(new RegExp(search, 'g'), replace);
}
/**夹子; */
export function clamp(val: number, min: number, max: number) {
	if (val > max) return max;
	if (val < min) return min;
	return val;
}
/**
 * 随机整数,区间[lowerValue,upperValue)
 * @param lowerValue {number} 下区间
 * @param upperValue {number} 上区间;不包括
 * @returns {number} 区间内的随机整数
 */
export function randomInt(lowerValue: number, upperValue: number): number {
	return Math.floor(Math.random() * (upperValue - lowerValue) + lowerValue);
}
/**
 * 获取随机索引号
 * @param arrOrLen 数组或是数组长度
 */
export function randomIndex<T>(arrOrLen: T[] | number) {
	if (typeof arrOrLen == 'number') {
		return randomInt(0, arrOrLen);
	}
	if (arrOrLen instanceof Array) {
		return randomInt(0, arrOrLen.length);
	}
}
/**
 * 计算随机权重;
 * @param {number[]} weightArr 权重数组
 * @returns {number} 权重数组中所选择的索引号;
 */
export function randomIndexFromWeight(weightArr: number[]): number {
	let tol = weightArr.reduce((p, c) => p + c, 0);
	let rnd = Math.random() * tol;
	let acc = 0;
	let len = weightArr.length;
	for (let i = 0; i < len; i++) {
		acc += weightArr[i];
		if (rnd < acc) return i;
	}
	return -1;
}
/**
 * 随机数组项;
 * @param {T[]} arr 数组
 * @returns {T} 选择的元素; 如果是空数组,返回undefined
 */
export function randomItem<T>(arr: T[]): T {
	if (arr.length == 0) return undefined;
	return arr[randomIndex(arr.length)];
}
/**
 * 二维数组转化成一维数组
 * @param arr {T[][]} 目标二维数组
 * @returns {T[]} 展开成的一维数组
 */
export function convertArrayD2toD1<T>(arr: T[][]): T[] {
	return arr.reduce((p, c) => [...p, ...c], []);
}
/**
 * 一维数组转化成二维数组
 * @param arr {T[]} 一维数组
 * @param col {number} 目标二维数组的列数
 * @returns {T[][]} 二维数组
 */
export function convertArrayD1toD2<T>(arr: T[], col: number): T[][] {
	let len = arr.length;
	if (len % col != 0) {
		throw new Error('传入的二维数组不合格');
	}
	let res: T[][] = [];
	for (let i = 0; i < len; i++) {
		res.push(arr.slice(i, i + col));
	}
	return res;
}
/**
 * 数组洗牌, 打乱顺序
 * @param arr {T[]} 目标数组
 * @param immutable {boolean} 是否保证原数组不变
 * @returns {T[]} 洗牌后的数组,immutable==true时,为新数组; immutable==false时,为原数组
 */
export function shuffleArray<T>(arr: T[], immutable: boolean = true): T[] {
	let len = arr.length;
	let res = immutable ? Array.from(arr) : arr;
	for (let i = 0; i < len; i++) {
		let tar = randomIndex(len);
		[res[i], res[tar]] = [res[tar], res[i]];
	}
	return res;
}
/**
 * 将秒数格式化为XX:XX的形式
 * @param seconds {number} 秒数
 * @returns {string} 格式为XX:XX的字符串
 */
export function formatSeconds(seconds: number): string {
	if (seconds < 0) return '00:00';
	let min = int(seconds / 60).toFixed(0);
	let sec = int(seconds % 60).toFixed(0);
	if (min.length == 1) min = '0' + min;
	if (sec.length == 1) sec = '0' + sec;
	return min + ':' + sec;
}
export function getPosInMainCamera(node: cc.Node) {
	let p_w = node.convertToWorldSpaceAR(cc.v2());
	let p_c = cc.Camera.main.node.convertToNodeSpaceAR(p_w);
	return p_c;
}
/**
 * 实例化一个预制体; 异步
 * @param prefab {cc.Prefab | cc.Node} 预制体或节点
 * @returns {Promise<cc.Node>}
 */
export async function instantiatePrefab(prefab: cc.Prefab | cc.Node): Promise<cc.Node> {
	return await new Promise<cc.Node>(resolve => {
		if (prefab instanceof cc.Prefab) {
			let node = cc.instantiate(prefab);
			resolve(node);
		}
		if (prefab instanceof cc.Node) {
			let node = cc.instantiate(prefab);
			resolve(node);
		}
	});
}
/**
 * 根据名称获取资源bundle
 * @param bundleName {string} bundle名称
 * @returns {Promise<cc.AssetManager.Bundle>}
 */
export async function getBundle(bundleName: string): Promise<cc.AssetManager.Bundle> {
	let bundle = cc.assetManager.getBundle(bundleName);
	if (!bundle) {
		bundle = await new Promise<cc.AssetManager.Bundle>((resolve, reject) => {
			cc.assetManager.loadBundle(bundleName, (err: Error, bundle: cc.AssetManager.Bundle) => {
				err ? reject(err) : resolve(bundle);
			});
		});
	}
	return bundle;
}
/**tan(pi/8)的值 */
const TanOneEighthPi = Math.tan(Math.PI / 8);
/**
 * 将二维方向向量转化成8个方向的字符串代号
 * @param dir {cc.Vec2} 方向向量
 * @returns {'S' | 'N' | 'E' | 'W' | 'SE' | 'NW' | 'NE' | 'SW'} 八方的字符代号
 */
export function getDirectionOct(dir: { x: number; y: number }): 'S' | 'N' | 'E' | 'W' | 'SE' | 'NW' | 'NE' | 'SW' {
	let x = dir.x;
	let y = dir.y;
	let t = TanOneEighthPi;
	let r1 = x + y * t;
	let r2 = x - y * t;
	if (r1 < 0 && r2 >= 0) return 'S';
	if (r1 >= 0 && r2 < 0) return 'N';

	let r3 = t * x + y;
	let r4 = t * x - y;
	if (r3 >= 0 && r4 >= 0) return 'E';
	if (r3 < 0 && r4 < 0) return 'W';

	let r5 = x + t * y;
	let r6 = x * t + y;
	if (r5 >= 0 && r6 < 0) return 'SE';
	if (r5 < 0 && r6 >= 0) return 'NW';

	let r7 = x - y * t;
	let r8 = x * t - y;
	if (r7 >= 0 && r8 < 0) return 'NE';
	if (r7 < 0 && r8 >= 0) return 'SW';

	throw new Error('计算方向时,出现错误');
}
/**
 * 获取相对路径节点上的组件
 * @param type component类型
 * @param node 节点
 * @param path 相对于节点的路径
 * @returns {T}
 */
export function findCom<T extends cc.Component>(
	type: {
		prototype: T;
	},
	node: cc.Node,
	...path: string[]
): T {
	return findNode(node, ...path).getComponent(type);
}
/**
 * 获取相对路径上的节点; 记住cc是通过遍历获取的;
 * @param node 基准节点
 * @param path 相对路径
 * @returns {cc.Node}
 */
export function findNode(node: cc.Node, ...path: string[]): cc.Node {
	return path.reduce((node: cc.Node, name: string) => node.getChildByName(name), node);
}

let tipFn = (msg: string) => {
	warn('没有注入tip方法', msg);
};
export function setTipFn(fn: (msg: string) => void) {
	tipFn = fn;
}
/**
 * 弹出提示信息文字
 * @param msg 信息文字
 */
export function tipMsg(msg: string) {
	tipFn(msg);
}
/**读条页面的参数 */
export type LoadingPageArgs = {
	isShow: boolean;
	progress: number;
	des?: string;
};
/**读条页帮助函数 */
let loadingFn = (isShow: boolean, progress: number, des?: string) => {
	warn('没有注入loadingPage方法');
};
/**
 * 开关载入页;
 * @param parm 载入页参数
 */
export function loadingPage(isShow: boolean, progress: number, des?: string) {
	loadingFn(isShow, progress, des);
}
export function setLoadingPageFn(func: (isShow: boolean, progress: number, des?: string) => void) {
	loadingFn = func;
}
