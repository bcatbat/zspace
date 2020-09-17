/// <reference path="zzUtils.ts" />
namespace zz {
  export class NdPool {
    readonly rootNd: cc.Node = undefined;
    private readonly prefab: cc.Prefab | cc.Node = undefined;
    private defaultNum: number = 10;
    /**true-可用,未借出; false-不可用,已借出 */
    // poolMap: Map<cc.Node, boolean> = new Map<cc.Node, boolean>();
    private pool: Array<cc.Node> = new Array<cc.Node>();

    constructor(
      rootNd: cc.Node,
      prefab: cc.Prefab | cc.Node,
      defaultNum: number = 10
    ) {
      this.rootNd = rootNd;
      this.prefab = prefab;
      this.defaultNum = defaultNum;
      this.initPool();
    }

    private async initPool() {
      for (let i = 0; i < this.defaultNum; i++) {
        let node = await utils.instantiatePrefab(this.prefab);
        node.parent = this.rootNd;
        this.pool.push(node);
        this.setActive(node, false);
      }
      zz.log('[Pool] init complete!');
    }

    async borrowFromPool() {
      let node = this.pool.pop();
      if (node) {
        node.parent = this.rootNd;
        this.setActive(node, true);
        return node;
      } else {
        node = await utils.instantiatePrefab(this.prefab);
        node.parent = this.rootNd;
        this.setActive(node, true);
        return node;
      }
    }
    returnBackToPool(node: cc.Node) {
      this.setActive(node, false);
      this.pool.push(node);
    }

    returnAllNode() {
      this.rootNd.children.forEach(v => {
        this.returnBackToPool(v);
      });
    }

    releasePool() {
      this.rootNd.children.forEach(v => {
        v.parent = null;
        v.destroy();
      });
      this.pool.forEach(v => {
        v.destroy();
      });
      this.pool = new Array<cc.Node>();
    }

    private setActive(node: cc.Node, active: boolean) {
      if (active) {
        node.opacity = 255;
      } else {
        node.opacity = 0;
        node.position = cc.v3(farPos);
      }
    }
  }
  export class RandomNodePool {
    readonly rootNd: cc.Node = undefined;
    private defaultNum: number = 2;
    private prefabs: (cc.Prefab | cc.Node)[] = [];

    private pool: Array<cc.Node> = new Array<cc.Node>();
    constructor(
      rootNd: cc.Node,
      prefabs: (cc.Prefab | cc.Node)[],
      defaultNum: number = 2
    ) {
      this.rootNd = rootNd;
      this.prefabs = prefabs;
      this.defaultNum = defaultNum;
      this.initPool();
    }
    private async initPool() {
      for (let i = 0; i < this.defaultNum; i++) {
        let rndPrefab = this.selectRandomPrefab();
        let node = await utils.instantiatePrefab(rndPrefab);
        node.parent = this.rootNd;
        this.pool.push(node);
        this.setActive(node, false);
      }
    }
    private selectRandomPrefab() {
      return utils.randomItem(this.prefabs);
    }
    async borrowFromPool() {
      let node = this.pool.pop();
      if (node) {
        this.setActive(node, true);
        return node;
      } else {
        let rndPrefab = this.selectRandomPrefab();
        node = await utils.instantiatePrefab(rndPrefab);
        node.parent = this.rootNd;
        this.setActive(node, true);
        return node;
      }
    }
    returnBackToPool(node: cc.Node) {
      this.setActive(node, false);
      this.pool.push(node);
    }
    returnAllNode() {
      this.rootNd.children.forEach(v => {
        this.returnBackToPool(v);
      });
    }
    releasePool() {
      this.rootNd.children.forEach(v => {
        v.parent = undefined;
        v.destroy();
      });
      this.pool.forEach(v => {
        v.destroy();
      });
      this.pool = new Array<cc.Node>();
    }

    private setActive(node: cc.Node, active: boolean) {
      if (active) {
        node.opacity = 255;
      } else {
        node.opacity = 0;
        node.position = cc.v3(farPos);
      }
    }
  }
}
