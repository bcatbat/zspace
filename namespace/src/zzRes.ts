/// <reference path="zzUtils.ts" />
/// <reference path="zzStructure.ts" />
/// <reference path="zzLog.ts" />
namespace zz {
	/**
	 * 资源加载管理; 包含预载字典和各种帮助方法;
	 */
	class ResMgr {
		/**资源字典;[目录路径,[目录名,资源名]] */
		private assetDict: Dictionary<string, Dictionary<string, cc.Asset>> = new Dictionary<string, Dictionary<string, cc.Asset>>();

		/**
		 * 批量读取目录内资源,并缓存
		 * @param bundleName 资源包名
		 * @param dirName 资源目录,可以多层,'/'分割
		 * @param assetDict 各类型对应存储
		 */
		async loadResDict(bundleName: string, dirName: string, showLoading?: boolean) {
			try {
				loadingPage(showLoading, 0, '加载资源');
				let bundle = await utils.getBundle(bundleName);
				const asset_1: cc.Asset[] = await new Promise((resolveFn, rejectFn) => {
					bundle.loadDir(
						dirName,
						(finish: number, total: number) => {
							loadingPage(showLoading, finish / total, '加载资源');
						},
						(err, res: cc.Asset[]) => {
							loadingPage(false, 0, '');
							err ? rejectFn(err) : resolveFn(res);
						}
					);
				});
				let key = bundleName + '/' + dirName;
				if (!this.assetDict.containsKey(key)) {
					this.assetDict.setValue(key, new Dictionary<string, cc.Asset>());
				}
				let subDict = this.assetDict.getValue(key);
				asset_1.forEach(v => {
					subDict.setValue(v.name, v);
				});
				return asset_1;
			} catch (err_1) {
				error('[Res] loadResDict error:' + err_1);
			}
		}
		/**
		 * 读取资源,并缓存
		 * @param bundleName 资源名
		 * @param dirName 路径
		 * @param assetName 资源名
		 */
		async loadRes(bundleName: string, dirName: string, assetName: string) {
			try {
				let bundle = await utils.getBundle(bundleName);
				const asset_1 = await new Promise<cc.Asset>((resolve, reject) => {
					bundle.load(dirName + '/' + assetName, (err, res: cc.Asset) => {
						err ? reject(err) : resolve(res);
					});
				});
				let key = bundleName + '/' + dirName;
				if (!this.assetDict.containsKey(key)) {
					this.assetDict.setValue(key, new Dictionary<string, cc.Asset>());
				}
				let subDict = this.assetDict.getValue(key);
				subDict.setValue(asset_1.name, asset_1);
				return asset_1;
			} catch (e) {
				error('[Res] loadRes error:' + e);
			}
		}

		/**
		 * 获取资源；
		 * @param bundleName 资源包名
		 * @param dirName 目录
		 * @param name 资源名称
		 * @param type 类型
		 * @returns 返回缓存的资源；如果未缓存，或者传入类型错误，则返回undefined
		 */
		getRes<T extends cc.Asset>(bundleName: string, dirName: string, name: string, type: { new (): T }) {
			let key = bundleName + '/' + dirName;
			if (!this.assetDict.containsKey(key)) {
				error('[Res] not contained!');
				return undefined;
			}
			let asset = this.assetDict.getValue(key).getValue(name);
			if (asset instanceof type) {
				return asset;
			} else {
				error('[Res] asset concontained, but type error!');
				return undefined;
			}
		}
	}
	/**动态资源管理 */
	export const res = new ResMgr();
}
