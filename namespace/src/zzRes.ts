/// <reference path="zzUtils.ts" />
/// <reference path="zzStructure.ts" />
/// <reference path="zzLog.ts" />
namespace zz {
  /**
   * 资源加载管理; 包含预载字典和各种帮助方法;
   */
  class ResMgr {
    constructor() {}
    private prefabMap: Dictionary<
      string,
      Dictionary<string, cc.Prefab>
    > = new Dictionary<string, Dictionary<string, cc.Prefab>>();
    private spriteMap: Dictionary<
      string,
      Dictionary<string, cc.SpriteFrame>
    > = new Dictionary<string, Dictionary<string, cc.SpriteFrame>>();

    /**
     * 批量读取目录内资源
     * @param bundleName 资源包名
     * @param dirName 资源目录名
     * @param type 资源类型
     * @param assetDict 各类型对应存储
     */
    private async loadResDict(
      bundleName: string,
      dirName: string,
      type: typeof cc.Asset,
      assetDict: Dictionary<string, Dictionary<string, cc.Asset>>
    ) {
      try {
        let bundle = await utils.getBundle(bundleName);
        const asset_1: cc.Asset[] = await new Promise((resolveFn, rejectFn) => {
          bundle.loadDir(dirName, type, (err, res: cc.Asset[]) => {
            err ? rejectFn(err) : resolveFn(res);
          });
        });
        let key = bundleName + '/' + dirName;
        if (!assetDict.containsKey(key)) {
          assetDict.setValue(key, new Dictionary<string, cc.Asset>());
        }
        let subDict = assetDict.getValue(key);
        asset_1.forEach(v => {
          subDict.setValue(v.name, v);
        });
      } catch (err_1) {
        error('[loadResDict] error:' + err_1);
      }
    }

    loadPrefabs(bundleName: string, dirName: string) {
      this.loadResDict(bundleName, dirName, cc.Prefab, this.prefabMap);
    }
    loadSprites(bundleName: string, dirName: string) {
      this.loadResDict(bundleName, dirName, cc.SpriteFrame, this.spriteMap);
    }

    getPrefab(bundleName: string, dirName: string, name: string) {
      let key = bundleName + '/' + dirName;
      if (!this.prefabMap.containsKey(key)) {
        return undefined;
      }
      return this.prefabMap.getValue(key).getValue(name);
    }
    getSpriteframe(bundleName: string, dirName: string, name: string) {
      const key = bundleName + '/' + dirName;
      if (!this.spriteMap.containsKey(key)) {
        return undefined;
      }
      return this.spriteMap.getValue(key).getValue(name);
    }
  }
  /**动态资源管理 */
  export const res = new ResMgr();
}
