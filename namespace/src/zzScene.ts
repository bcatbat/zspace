/// <reference path="zzUtils.ts" />
/// <reference path="zzStructure.ts" />
/// <reference path="zzLog.ts" />
namespace zz {
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
    private sceneDict: Dictionary<string, cc.Node> = new Dictionary<
      string,
      cc.Node
    >();
    /**预载场景节点字典;未显示 */
    private preloadDict: Dictionary<string, cc.Node> = new Dictionary<
      string,
      cc.Node
    >();
    /**加载标记;防止重复加载 */
    private loadingDict: Dictionary<string, number> = new Dictionary<
      string,
      number
    >();
    /**打开中标记;用于预载过程中打开 */
    private openningDict: Dictionary<string, number> = new Dictionary<
      string,
      number
    >();
    private _sceneRoot: cc.Node;
    /**场景根节点 */
    public get sceneRoot(): cc.Node {
      return this._sceneRoot;
    }
    /**设置场景根节点;在游戏开始时执行一次 */
    public setSceneRoot(sceneRoot: cc.Node) {
      this._sceneRoot = sceneRoot;
    }

    /**
     * 加载场景
     * @param sceneName 场景预制体名
     * @param bundleName bundle名
     */
    public async loadScene(sceneName: string, bundleName: string) {
      if (this.loadingDict.containsKey(sceneName)) {
        warn('[Scene] 正在加载' + sceneName);
        this.openningDict.setValue(sceneName, 1);
        return;
      }
      if (this.sceneDict.containsKey(sceneName)) {
        warn('[Scene] 已加载' + sceneName);
        return;
      }
      if (this.preloadDict.containsKey(sceneName)) {
        warn('[Scene] 已预载' + sceneName);
        let node = this.preloadDict.getValue(sceneName);
        this.sceneRoot.addChild(node);
        this.preloadDict.remove(sceneName);
        return;
      }
      this.loadingDict.setValue(sceneName, 1);
      try {
        let bundle = await utils.getBundle(bundleName);
        let prefab_1 = await new Promise<cc.Prefab>((resolve, reject) => {
          bundle.load(sceneName, (err, prefab: cc.Prefab) => {
            err ? reject(err) : resolve(prefab);
          });
        });
        this.loadingDict.remove(sceneName);
        let node = await utils.instantiatePrefab(prefab_1);
        this.sceneRoot.addChild(node);
        if (this.openningDict.containsKey(sceneName)) {
          this.openningDict.remove(sceneName);
        }
      } catch (e) {
        throw new Error(e);
      }
    }
    /**销毁场景 */
    public destroyScene(sceneName: string) {
      if (this.sceneDict.containsKey(sceneName)) {
        this.sceneDict.getValue(sceneName).destroy();
        this.sceneDict.remove(sceneName);
      }
    }
    /**预载场景节点 */
    public async preloadScene(sceneName: string, bundleName: string) {
      if (this.sceneDict.containsKey(sceneName)) {
        warn('[Scene] 已加载' + sceneName);
        return undefined;
      }
      if (this.loadingDict.containsKey(sceneName)) {
        warn('[Scene] 正在加载' + sceneName);
        return undefined;
      }
      this.loadingDict.setValue(sceneName, 1);
      try {
        const bundle = await utils.getBundle(bundleName);
        const prefab_1 = await new Promise<cc.Prefab>((resolve, reject) => {
          bundle.load(sceneName, (err, prefab: cc.Prefab) => {
            err ? reject(err) : resolve(prefab);
          });
        });
        this.loadingDict.remove(sceneName);
        let node = await utils.instantiatePrefab(prefab_1);
        if (this.openningDict.containsKey(sceneName)) {
          //如果需要打开,则直接打开
          this.openningDict.remove(sceneName);
          this.sceneRoot.addChild(node);
        } else {
          // 否则存储在预载中;
          this.preloadDict.setValue(sceneName, node);
        }
      } catch (e) {
        throw new Error(e);
      }
    }
  }

  /**场景管理 */
  export const scene = new SceneMgr();
}
