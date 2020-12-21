/// <reference path="zzLog.ts" />
/// <reference path="zzHelper.ts" />
/// <reference path="zzUtils.ts" />
namespace zz {
	const farPos: cc.Vec3 = cc.v3(10000, 10000, 0);
	export abstract class UIBase extends cc.Component {
		/**
		 * 在onLoad之后调用; 代替onLoad使用; 注意无法重置; 由于无法确保调用一次, 事件注册不宜置于此;
		 * @param args 参数列表
		 */
		onOpen(args: any[]): void {}
		/**代替onDestroy使用 */
		onClose(): void {}

		/**代替onDiable使用 */
		onHide(): void {}
		/**代替onEnable使用 */
		onShow(): void {}
	}
	interface UIProgressArgs {
		/**是否显示进度条 */
		showProgressUI: boolean;
		/**加载完成时是否关闭加载页 */
		closeLoadingOnFinish: boolean;
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
		constructor() {}
		/**UI根节点; 从外部注入; */
		private _uiRoot: cc.Node = undefined;
		public get uiRoot() {
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
		private uiMap: Map<string, UIBase> = new Map<string, UIBase>();
		private pathMap: Map<string, string> = new Map<string, string>();
		private layerMap: Map<string, number> = new Map<string, number>();
		/**加载中标记 */
		private loadingFlagMap: Map<string, boolean> = new Map<string, boolean>();
		/**打开中标记; */
		private openingMap: Map<string, UIArgs> = new Map<string, UIArgs>();

		private topZIndex: number = 0;
		setUIRoot(rootNd: cc.Node) {
			this._uiRoot = rootNd;
		}
		setUIParams(
			params: Array<{
				uiName: string;
				zIndex: number;
				path: string;
			}>
		) {
			params.forEach(v => {
				this.pathMap.set(v.uiName, v.path);
				this.layerMap.set(v.uiName, v.zIndex);
			});
		}

		async openUI(uiArgs: UIArgs) {
			let uiName = uiArgs.uiName;
			if (this.uiMap.has(uiName)) {
				let ui = this.uiMap.get(uiName);
				let uiNd = ui.node;
				if (uiNd && uiNd.isValid) {
					this.openUINode(uiNd, uiArgs);
					this.openUIClass(ui, uiArgs);
					uiArgs.progressArgs && uiArgs.progressArgs.closeLoadingOnFinish && loadingPage(false, 100, uiArgs.progressArgs.desTxt);
					return undefined;
				} else {
					this.uiMap.delete(uiName);
				}
			}

			if (this.loadingFlagMap.get(uiName)) {
				warn('[openUI] 正在加载' + uiName);
				this.openingMap.set(uiName, uiArgs);
				return undefined;
			}

			this.loadingFlagMap.set(uiName, true);

			try {
				uiArgs.progressArgs && uiArgs.progressArgs.showProgressUI && loadingPage(true, 0, uiArgs.progressArgs.desTxt);

				const bundle = await this.getUIBundle(uiName);
				const prefab_1 = await new Promise<cc.Prefab>((resolveFn, rejectFn) => {
					bundle.load(
						uiName,
						(completedCount: number, totalCount: number, item: any) => {
							uiArgs.progressArgs &&
								uiArgs.progressArgs.showProgressUI &&
								loadingPage(true, completedCount / totalCount, uiArgs.progressArgs.desTxt);
						},
						(err, prefab: cc.Prefab) => {
							uiArgs.progressArgs && uiArgs.progressArgs.closeLoadingOnFinish && loadingPage(false, 100, uiArgs.progressArgs.desTxt);
							err ? rejectFn(err) : resolveFn(prefab);
						}
					);
				});
				this.loadingFlagMap.delete(uiName);
				let uiNode: cc.Node = await utils.instantiatePrefab(prefab_1);
				uiNode.parent = this.uiRoot;
				let ui_2 = uiNode.getComponent(UIBase);
				this.uiMap.set(uiName, ui_2);
				this.openUINode(uiNode, uiArgs);
				this.openUIClass(ui_2, uiArgs);
				if (this.openingMap.has(uiName)) this.openingMap.delete(uiName);
			} catch (err_1) {
				error('[openUI] error:' + err_1);
				return undefined;
			}
		}
		private openUINode(uiNd: cc.Node, uiArgs: UIArgs) {
			let uiName = uiArgs.uiName;
			if (!uiNd.parent) {
				uiNd.parent = this.uiRoot;
			}
			if (uiArgs.zIndex) {
				uiNd.zIndex = uiArgs.zIndex;
			} else {
				if (this.layerMap.has(uiName)) {
					let z = this.layerMap.get(uiName);
					uiNd.zIndex = z;
					if (this.topZIndex < z) this.topZIndex = z;
				} else {
					uiNd.zIndex = ++this.topZIndex;
				}
			}
			uiNd.x = uiNd.y = 0;
		}
		private openUIClass(ui: UIBase, uiArgs: UIArgs) {
			ui.node.x = ui.node.y = 0;
			ui.node.opacity = 255;
			ui.onOpen(uiArgs.openArgs || []);
			ui.onShow();
			let widget = ui.node.getComponent(cc.Widget);
			if (widget) widget.updateAlignment();
			let cb = uiArgs.callbackArgs;
			cb?.fn?.call(uiArgs.caller, ...cb.args);
		}
		private async getUIBundle(uiName: string) {
			let path = this.pathMap.get(uiName);
			if (!path) path = 'resources';
			let bundle = await utils.getBundle(path);
			return bundle;
		}
		/**从场景中移除UI; 保留本地缓存; */
		closeUI(uiName: string): boolean {
			if (this.uiMap.has(uiName)) {
				this.hideUI(uiName);
				let ui = this.uiMap.get(uiName);
				ui.node.parent = null;
				ui.onHide();
				ui.onClose();
				return true;
			}
			return false;
		}
		async preloadUI(
			uiName: string,
			option?: {
				/**是否开启读条页;默认在读条后不关闭 */
				showLoading?: boolean;
				/**是否在读条之后关闭读条页 */
				closeLoadingOnFinish?: boolean;
			}
		) {
			if (this.uiMap.has(uiName)) {
				warn('[preloadUI] 已经加载ui:' + uiName);
				return undefined;
			}
			if (this.loadingFlagMap.get(uiName)) {
				warn('[preloadUI] 正在加载' + uiName);
				return undefined;
			}

			this.loadingFlagMap.set(uiName, true);
			option && option.showLoading && loadingPage(option.showLoading, 0, '');
			try {
				const bundle = await this.getUIBundle(uiName);
				const prefab_1 = await new Promise<cc.Prefab>((resolveFn, rejectFn) => {
					bundle.load(
						uiName,
						(finish: number, total: number) => {
							option && option.showLoading && loadingPage(option.showLoading, finish / total, '');
						},
						(err, prefab: cc.Prefab) => {
							option && option.closeLoadingOnFinish && loadingPage(false, 100, '');
							err ? rejectFn(err) : resolveFn(prefab);
						}
					);
				});
				this.loadingFlagMap.delete(uiName);
				let uiNode: cc.Node = cc.instantiate(prefab_1) as cc.Node;
				let ui = uiNode.getComponent(uiName) as UIBase;
				this.uiMap.set(uiName, ui);
				if (this.openingMap.has(uiName)) {
					let args = this.openingMap.get(uiName);
					this.openingMap.delete(uiName);
					warn('[Preload] 预载中打开了UI:' + uiName + '; 直接打开');
					this.openUINode(uiNode, args);
					this.openUIClass(ui, args);
				}
				return uiNode;
			} catch (err_1) {
				error('[preloadUI] error:' + err_1);
				return undefined;
			}
		}
		/**关闭ui; 移除本地缓存; */
		destroyUI(uiName: string, resRelease: boolean) {
			this.closeUI(uiName);
			let ui = this.uiMap.get(uiName);
			ui?.node?.destroy();
			this.uiMap.delete(uiName);

			if (resRelease) {
				this.getUIBundle(uiName)
					.then((bundle: cc.AssetManager.Bundle) => {
						cc.assetManager.releaseAsset(bundle.get(uiName));
						bundle.release(uiName, cc.Prefab);
					})
					.catch(reason => {
						error('[UIMgr] release ' + uiName + ' fail; reason' + reason);
					});
			}
		}
		showUI(uiName: string) {
			if (this.uiMap.has(uiName)) {
				let ui = this.uiMap.get(uiName);
				let nd = ui.node;
				if (!nd) {
					warn('[showUI] ' + uiName + '被close过');
					return false;
				}
				nd.x = nd.y = 0;
				nd.opacity = 255;
				ui.onShow();
				return true;
			} else {
				error('[shouUI] 未加载的UI:' + uiName);
				return false;
			}
		}
		hideUI(uiName: string) {
			if (this.uiMap.has(uiName)) {
				let ui = this.uiMap.get(uiName);
				let nd = ui.node;
				if (nd) {
					nd.position = cc.v3(farPos);
					nd.opacity = 0;
					ui.onHide();
					return true;
				} else {
					return false;
				}
			}
			return false;
		}
		getUI(uiName: string) {
			return this.uiMap.get(uiName);
		}
		isUIShown(uiName: string) {
			let ui = this.getUI(uiName);
			if (!ui) return false;
			if (!ui.node) return false;
			if (!ui.node.active) return false;
			if (!ui.node.opacity) return false;
			return true;
		}
		reloadUI(uiName: string) {
			this.destroyUI(uiName, false);
			this.openUI({ uiName: uiName, progressArgs: { showProgressUI: true, closeLoadingOnFinish: true } });
		}
		async releaseUI(uiName: string) {
			try {
				let bundle = await this.getUIBundle(uiName);
				bundle.release(uiName);
			} catch (err) {
				error(err);
			}
		}
	}
	/**UI管理 */
	export const ui = new UIMgr();
}
