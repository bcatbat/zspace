import { log } from '../log/Log';
import { Dictionary } from '../structures/Index';
import * as utils from '../utils/Utils';

const farPos: cc.Vec3 = cc.v3(10000, 10000, 0);
export class NdPool {
	private innerDict: Dictionary<string, cc.Node> = new Dictionary<string, cc.Node>();
	private outerDict: Dictionary<string, cc.Node> = new Dictionary<string, cc.Node>();

	constructor(
		public readonly rootNd: cc.Node,
		private prefab: cc.Prefab | cc.Node,
		private defaultNum: number = 10,
		private autoReleaseNum: number = 50
	) {
		this.rootNd = rootNd;
		this.prefab = prefab;
		this.defaultNum = defaultNum;
		this.autoReleaseNum = autoReleaseNum;
		this.initPool();
	}

	private async initPool() {
		for (let i = 0; i < this.defaultNum; i++) {
			let node = await this.createNodeAsync();
			this.setActive(node, false);
		}
	}
	private ticker: number = 1;
	private createNodeSync() {
		let node = cc.instantiate(this.prefab) as cc.Node;
		node.name = 'pn' + this.ticker++;
		node.parent = this.rootNd;
		return node;
	}
	private async createNodeAsync() {
		let node = await utils.instantiatePrefab(this.prefab);
		node.name = 'pn' + this.ticker++;
		node.parent = this.rootNd;
		return node;
	}
	/**异步方法 */
	async borrowFromPoolAsync() {
		if (this.innerDict.size() > 0) {
			let node = this.innerDict.values()[0];
			this.setActive(node, true);
			return node;
		} else {
			let node = await this.createNodeAsync();
			this.setActive(node, true);
			return node;
		}
	}
	/**同步方法 */
	borrowFromPoolSync() {
		let node = this.innerDict.values()[0];
		if (!node) {
			node = this.createNodeSync();
		}
		this.setActive(node, true);
		return node;
	}
	returnBackToPool(node: cc.Node) {
		this.setActive(node, false);
		if (this.outerDict.size() == 0) {
			if (this.innerDict.size() > this.autoReleaseNum) {
				this.autoReleasePool();
			}
		}
	}
	private autoReleasePool() {
		let skipNum = 0;
		log('[NdPool] autoRelease. before size:' + this.innerDict.size());
		this.innerDict.forEach((name, node) => {
			skipNum++;
			if (skipNum > this.autoReleaseNum) {
				this.innerDict.remove(name);
				if (node && node.isValid) {
					node.parent = null;
					node.destroy();
				}
			}
		});
		log('[NdPool] autoRelease. after size:' + this.innerDict.size());
	}

	returnAllNode() {
		this.outerDict.forEach((key, val) => {
			this.returnBackToPool(val);
		});
	}

	releasePool() {
		this.returnAllNode();
		this.innerDict.forEach((name, node) => {
			if (node && node.isValid) {
				node.parent = null;
				node.destroy();
			}
		});
		this.innerDict.clear();
	}

	private setActive(node: cc.Node, active: boolean) {
		if (node && node.isValid) {
			if (active) {
				node.opacity = 255;
				this.innerDict.remove(node.name);
				this.outerDict.setValue(node.name, node);
			} else {
				node.opacity = 0;
				node.position = cc.v3(farPos);
				node.stopAllActions();
				this.outerDict.remove(node.name);
				this.innerDict.setValue(node.name, node);
			}
		}
	}
}
export class RandomNodePool {
	constructor(
		public readonly rootNd: cc.Node,
		private prefabs: (cc.Prefab | cc.Node)[],
		private defaultNum: number = 2,
		private autoReleaseNum: number = 4
	) {
		this.initPool();
	}
	private innerDict: Dictionary<string, cc.Node> = new Dictionary<string, cc.Node>();
	private outerDict: Dictionary<string, cc.Node> = new Dictionary<string, cc.Node>();
	private ticker: number = 1;
	private createNodeSync() {
		let rndPrefb = this.selectRandomPrefab();
		let node = cc.instantiate(rndPrefb) as cc.Node;
		node.parent = this.rootNd;
		node.name = 'rpn' + this.ticker++;
		return node;
	}
	private async createNodeAsync() {
		let rndPrefab = this.selectRandomPrefab();
		let node = await utils.instantiatePrefab(rndPrefab);
		node.parent = this.rootNd;
		node.name = 'rpn' + this.ticker++;
		return node;
	}
	private selectRandomPrefab() {
		return utils.randomItem(this.prefabs);
	}

	private async initPool() {
		for (let i = 0; i < this.defaultNum; i++) {
			let rndPrefab = this.selectRandomPrefab();
			let node = await utils.instantiatePrefab(rndPrefab);
			node.parent = this.rootNd;
			this.setActive(node, false);
		}
	}

	async borrowFromPool() {
		let node: cc.Node;
		if (this.innerDict.size() > 0) {
			node = this.innerDict.values()[0];
		} else {
			node = await this.createNodeAsync();
		}
		this.setActive(node, true);
		return node;
	}
	/**同步方法 */
	borrowFromPoolSync() {
		let node = this.innerDict.values()[0];
		if (!node) {
			node = this.createNodeSync();
		}
		this.setActive(node, true);
		return node;
	}
	returnBackToPool(node: cc.Node) {
		this.setActive(node, false);
		if (this.outerDict.size() == 0) {
			if (this.innerDict.size() > this.autoReleaseNum) {
				this.autoReleasePool();
			}
		}
	}
	returnAllNode() {
		this.outerDict.forEach((key, val) => {
			this.returnBackToPool(val);
		});
	}
	releasePool() {
		this.returnAllNode();
		this.innerDict.forEach((name, node) => {
			if (node && node.isValid) {
				node.parent = null;
				node.destroy();
			}
		});
		this.innerDict.clear();
	}

	private setActive(node: cc.Node, active: boolean) {
		if (node && node.isValid) {
			if (active) {
				node.opacity = 255;
				this.innerDict.remove(node.name);
				this.outerDict.setValue(node.name, node);
			} else {
				node.opacity = 0;
				node.position = cc.v3(farPos);
				node.stopAllActions();
				this.outerDict.remove(node.name);
				this.innerDict.setValue(node.name, node);
			}
		}
	}
	private autoReleasePool() {
		let skipNum = 0;
		log('[NdPool] autoRelease. before size:' + this.innerDict.size());
		this.innerDict.forEach((name, node) => {
			skipNum++;
			if (skipNum > this.autoReleaseNum) {
				this.innerDict.remove(name);
				if (node && node.isValid) {
					node.parent = null;
					node.destroy();
				}
			}
		});
		log('[NdPool] autoRelease. after size:' + this.innerDict.size());
	}
}
