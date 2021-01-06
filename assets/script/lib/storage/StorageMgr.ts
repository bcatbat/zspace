import { int } from '../type/ValueType';

export class StorageMgr {
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
	remove(key: string): void {
		cc.sys.localStorage.removeItem(key);
	}
	/**
	 * 存储int32值
	 * @param key {string} 存储键值
	 * @param value {number} 数字,会被取整;
	 */
	saveInt(key: string, value: number) {
		cc.sys.localStorage.setItem(key, int(value));
	}
	/**
	 * 获取存储的int32
	 * @param key {string} 键值
	 * @returns {number} int32值;默认为0
	 */
	getInt(key: string): number {
		let sto = cc.sys.localStorage.getItem(key);
		// null | undefine
		if (!sto) return 0;
		let n = parseInt(sto);
		// NaN
		if (!sto) return 0;
		return n;
	}
	/**
	 * 存储数值
	 * @param key {string} 键值
	 * @param value {number} double值
	 */
	saveNumber(key: string, value: number): void {
		cc.sys.localStorage.setItem(key, value);
	}
	/**
	 * 获取存储的数值
	 * @param key {string} 键值
	 * @returns {number} 数值,默认为0
	 */
	getNumber(key: string): number {
		let sto = cc.sys.localStorage.getItem(key);
		// null | undefine
		if (!sto) return 0;
		let n = parseFloat(sto);
		// NaN
		if (!sto) return 0;
		return n;
	}
	/**
	 * 保存字符串
	 * @param key {string} 键值
	 * @param value {string} 字符串
	 */
	saveString(key: string, value: string) {
		cc.sys.localStorage.setItem(key, value);
	}
	/**
	 * 读取保存的字符串;
	 * @param key {string} 键值
	 * @returns {string} 字符串,默认为''
	 */
	getString(key: string): string {
		let sto = cc.sys.localStorage.getItem(key);
		if (!sto) return '';
		return sto;
	}
	/**
	 * 保存对象
	 * @param key {string} 键值
	 * @param value {T} 对象,包括数组等各种带__proto__的
	 */
	saveObject<T extends {}>(key: string, value: T) {
		if (value) {
			this.saveString(key, JSON.stringify(value));
		}
	}
	/**
	 * 读取对象
	 * @param key {string} 键值
	 * @returns {T} 对象,包括数组等
	 */
	getObject<T extends {}>(key: string): T {
		let str = this.getString(key);
		if (str) {
			try {
				return JSON.parse(str);
			} catch (e) {
				throw new Error(e);
			}
		} else {
			return undefined;
		}
	}
}
