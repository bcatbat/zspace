namespace zz {
  class Delegate {
    private callback: Function;
    public get Callback(): Function {
      return this.callback;
    }
    private argArray: any[];
    public get ArgArray(): any[] {
      return this.argArray;
    }
    private isOnce = false;
    public get IsOnce(): boolean {
      return this.isOnce;
    }
    public set IsOnce(v: boolean) {
      this.isOnce = v;
    }
    constructor(callback: Function, argArray: any[], isOnce = false) {
      this.callback = callback;
      this.argArray = argArray;
      this.isOnce = isOnce;
    }
  }
  class EventMgr {
    private mEventMap = new Map<string, Map<any, Delegate[]>>();

    public has(eventType: string, caller: any, callback: Function): boolean {
      return !!this.find(eventType, caller, callback);
    }
    public fire(eventType: string, ...argArray: any[]): boolean {
      if (!eventType) {
        console.error('Event eventType is null!');
        return false;
      }
      let delegateList: Delegate[] = [];
      let callerList: any[] = [];
      let eventMap = this.mEventMap.get(eventType);
      if (eventMap) {
        eventMap.forEach((eventList, caller) => {
          for (let delegate of eventList) {
            delegateList.push(delegate);
            callerList.push(caller);
          }
          for (let index = eventList.length - 1; index >= 0; --index) {
            if (eventList[index].IsOnce) {
              eventList.splice(index, 1);
            }
          }
          if (eventList.length <= 0) {
            eventMap.delete(caller);
          }
        });
        if (eventMap.size <= 0) {
          this.mEventMap.delete(eventType);
        }
      }
      let length = delegateList.length;
      for (let index = 0; index < length; index++) {
        let delegate: Delegate = delegateList[index];
        delegate.Callback.call(
          callerList[index],
          ...delegate.ArgArray,
          ...argArray
        );
      }
      return length > 0;
    }
    public register(
      eventType: string,
      caller: any,
      callback: Function,
      ...argArray: any[]
    ): void {
      this.addListener(eventType, caller, callback, false, ...argArray);
    }
    public registerOnce(
      eventType: string,
      caller: any,
      callback: Function,
      ...argArray: any[]
    ): void {
      this.addListener(eventType, caller, callback, true, ...argArray);
    }
    public delRegister(
      type: string,
      caller: any,
      callback: Function,
      onceOnly?: boolean
    ): void {
      this.removeBy((eventType, listenerCaller, delegate) => {
        if (type && type !== eventType) {
          return false;
        }
        if (caller && caller !== listenerCaller) {
          return false;
        }
        if (callback && callback !== delegate.Callback) {
          return false;
        }
        if (onceOnly && !delegate.IsOnce) {
          return false;
        }
        return true;
      });
    }
    public delAllRegister(caller: any): void {
      this.mEventMap.forEach((eventMap, type) => {
        eventMap.delete(caller);
        if (eventMap.size <= 0) {
          this.mEventMap.delete(type);
        }
      });
    }

    private find(eventType: string, caller: any, callback: Function): Delegate {
      if (!eventType) {
        console.error('Event eventType is null!');
        return null;
      }
      if (!caller) {
        console.error('Caller eventType is null!');
        return null;
      }
      if (!callback) {
        console.error('Listener is null!');
        return null;
      }

      let eventMap: Map<any, Delegate[]>;
      if (this.mEventMap.has(eventType)) {
        eventMap = this.mEventMap.get(eventType);
      } else {
        eventMap = new Map<any, Delegate[]>();
        this.mEventMap.set(eventType, eventMap);
      }
      let eventList: Delegate[];
      if (eventMap.has(caller)) {
        eventList = eventMap.get(caller);
      } else {
        eventList = [];
        eventMap.set(caller, eventList);
      }

      for (let delegate of eventList) {
        if (delegate.Callback === callback) {
          return delegate;
        }
      }
      return null;
    }
    private addListener(
      eventType: string,
      caller: any,
      callback: Function,
      isOnce: boolean,
      ...argArray: any[]
    ): void {
      let delegate = this.find(eventType, caller, callback);
      if (delegate) {
        delegate.IsOnce = isOnce;
        console.error('Listener is already exist!');
      } else {
        let delegate = new Delegate(callback, argArray, isOnce);
        this.mEventMap.get(eventType).get(caller).push(delegate);
      }
    }
    private removeBy(
      predicate: (eventType: string, caller: any, delegate: Delegate) => boolean
    ): void {
      if (!predicate) {
        return;
      }
      this.mEventMap.forEach((eventMap, eventType) => {
        eventMap.forEach((eventList, caller) => {
          for (let index = eventList.length - 1; index >= 0; --index) {
            let delegate = eventList[index];
            if (predicate(eventType, caller, delegate)) {
              eventList.splice(index, 1);
            }
          }
          if (eventList.length <= 0) {
            eventMap.delete(caller);
          }
        });
        if (eventMap.size <= 0) {
          this.mEventMap.delete(eventType);
        }
      });
    }
  }
  export interface TableBase {
    id: string;
  }
  class TableMgr {
    private allTables: Map<string, Map<number | string, TableBase>> = null;

    public constructor() {
      this.allTables = new Map<string, Map<number, any>>();
    }

    private count: number = 0;
    private tol: number = 0;
    public async loadConfig<T extends { id: string }>(
      tableType: string,
      ...arg: any[]
    ) {
      if (this.allTables.has(tableType)) {
        this.allTables.set(tableType, new Map<number, any>());
      }
      this.count++;
      log('[Table] 开始加载表格:' + tableType);
      if (this.tol < this.count) this.tol = this.count;

      try {
        const jsonAsset_1 = await new Promise<cc.JsonAsset>(
          (resolveFn, rejectFn) => {
            cc.loader.loadRes(
              'configs/' + tableType,
              (err, jsonAsset: cc.JsonAsset) => {
                err ? rejectFn(err) : resolveFn(jsonAsset);
              }
            );
          }
        );
        log('[Table] ' + tableType + '加载完毕');
        let jsonObj = jsonAsset_1.json;
        let tableMap = new Map<any, any>();
        for (let k in jsonObj) {
          let obj = JSON.parse(JSON.stringify(jsonObj[k])) as T;
          tableMap.set(obj.id, obj);
        }
        this.allTables.set(tableType, tableMap);
        this.count--;
        return this.count;
      } catch (err_1) {
        error('[Table] loading error! table:' + tableType + '; err:' + err_1);
      }
    }

    /**
     * TableComponent：获取表所有数据
     * @param tableType 数据表类型名称
     */
    public getTable(tableType: string) {
      if (this.allTables.has(tableType)) {
        return this.allTables.get(tableType);
      }
      return null;
    }

    /**
     * TableComponent：获取表数据项目
     * @param tableType 数据表类型名称
     * @param key 数据表id
     */
    public getTableItem(tableType: string, key: string) {
      if (this.allTables.has(tableType)) {
        return this.allTables.get(tableType).get(key);
      } else {
        console.error(
          '[Table] GetTableItem Error! tableType:' + tableType + '; key:' + key
        );
        return null;
      }
    }

    /**
     * TableComponent：表是否存在数据项目
     * @param tableType 数据表类型名称
     * @param key 数据表id
     */
    public hasTableItem(tableType: string, key: any) {
      if (this.allTables.has(tableType)) {
        return this.allTables.get(tableType).has(key);
      } else {
        console.error(
          '[Table] HasTableItem Error! tableType' + tableType + '; key:' + key
        );
        return false;
      }
    }
  }
  class StorageMgr {
    clear() {
      cc.sys.localStorage.clear();
    }
    remove(key: string): void {
      cc.sys.localStorage.removeItem(key);
    }
    saveInt(key: string, value: number) {
      cc.sys.localStorage.setItem(key, Math.trunc(value));
    }
    /**默认为0 */
    getInt(key: string) {
      let sto = cc.sys.localStorage.getItem(key);
      // null | undefine
      if (!sto) return 0;
      let n = parseInt(sto);
      // NaN
      if (!sto) return 0;
      return n;
    }
    saveNumber(key: string, value: number) {
      cc.sys.localStorage.setItem(key, value);
    }
    /**默认为0 */
    getNumber(key: string) {
      let sto = cc.sys.localStorage.getItem(key);
      // null | undefine
      if (!sto) return 0;
      let n = parseFloat(sto);
      // NaN
      if (!sto) return 0;
      return n;
    }
    saveString(key: string, value: string) {
      cc.sys.localStorage.setItem(key, value);
    }
    /**默认为"" */
    getString(key: string) {
      let sto = cc.sys.localStorage.getItem(key);
      if (!sto) return '';
      return sto;
    }
  }
  class SoundMgr {
    dict_clip: Map<string, cc.AudioClip> = new Map<string, cc.AudioClip>();
    //TODO 此处用MultiDict来做.
    dict_soundId: MultiDictionary<string, number> = new MultiDictionary<
      string,
      number
    >();
    dict_musicID: MultiDictionary<string, number> = new MultiDictionary<
      string,
      number
    >();

    private soundVolume: number = 1.0;
    set SoundVolume(volume: number) {
      this.soundVolume = volume;
      cc.audioEngine.setEffectsVolume(volume);
    }
    private musicVolume: number = 0.5;
    set MusicVolume(volume: number) {
      this.musicVolume = volume;
      cc.audioEngine.setMusicVolume(volume);
    }

    private _isMusicOn: boolean = true;
    /**音乐开关 */
    public get isMusicOn(): boolean {
      return this._isMusicOn;
    }
    public set isMusicOn(v: boolean) {
      if (v == false) {
        this.stopMusic();
      }
      this._isMusicOn = v;
    }
    private _isSoundOn: boolean = true;
    /**音效开关 */
    public get isSoundOn(): boolean {
      return this._isSoundOn;
    }
    public set isSoundOn(v: boolean) {
      if (!v) {
        this.stopAllSounds();
      }
      this._isSoundOn = v;
    }
    private _isAllOn: boolean = true;
    /**声音是否打开 */
    public get isAllOn(): boolean {
      return this._isAllOn;
    }
    public set isAllOn(v: boolean) {
      this._isAllOn = v;
      if (!v) {
        this.stopAllSounds();
        this.stopMusic();
      }
    }

    playSound(soundName: string, loop: boolean = false) {
      if (!this.isAllOn) {
        return;
      }
      if (!this.isSoundOn) {
        return;
      }

      if (this.dict_clip.has(soundName)) {
        let clip = this.dict_clip.get(soundName);
        let soundID = cc.audioEngine.playEffect(clip, loop);
        this.dict_soundId.setValue(soundName, soundID);
        cc.audioEngine.setFinishCallback(soundID, () => {
          if (!loop) {
            console.log('[SOUND] sound finish:' + soundID);
            this.dict_soundId.remove(soundName, soundID);
          }
        });
      } else {
        cc.loader.loadRes(
          'audio/' + soundName,
          cc.AudioClip,
          (err, clip: cc.AudioClip) => {
            if (this.dict_clip.get(soundName)) return;
            this.dict_clip.set(soundName, clip);
            let soundID = cc.audioEngine.playEffect(clip, loop);
            this.dict_soundId.setValue(soundName, soundID);
            cc.audioEngine.setFinishCallback(soundID, () => {
              if (!loop) {
                console.log('[SOUND] sound finish:' + soundID);
                this.dict_soundId.remove(soundName, soundID);
              }
            });
          }
        );
      }
    }

    playMusic(musicName: string, loop: boolean = true) {
      if (!this.isAllOn) {
        console.log('声音已经关闭');
        return;
      }
      if (!this.isMusicOn) {
        console.log('音乐已经关闭');
        return;
      }
      if (this.dict_musicID.containsKey(musicName)) {
        console.warn('[SOUND] Music正在播放,不再重复播放');
        return;
      }
      if (this.dict_clip.has(musicName)) {
        let clip = this.dict_clip.get(musicName);
        let id = cc.audioEngine.playMusic(clip, loop);
        this.dict_musicID.setValue(musicName, id);
        cc.audioEngine.setFinishCallback(id, () => {
          if (!loop) {
            console.log('[SOUND] sound finish:' + id);
            this.dict_musicID.remove(musicName, id);
          }
        });
      } else {
        cc.loader.loadRes(
          'audio/' + musicName,
          cc.AudioClip,
          (err, clip: cc.AudioClip) => {
            if (err) {
              error(err);
              return;
            }
            if (this.dict_clip.has(musicName)) return;
            this.dict_clip.set(musicName, clip);
            let id = cc.audioEngine.playMusic(clip, loop);
            this.dict_musicID.setValue(musicName, id);
            cc.audioEngine.setFinishCallback(id, () => {
              if (!loop) {
                console.log('[SOUND] sound finish:' + id);
                this.dict_musicID.remove(musicName, id);
              }
            });
          }
        );
      }
    }
    /**切换音乐; 模拟的渐变切换; 替换PlayMusic使用*/
    changeMusic(
      musicName: string,
      loop: boolean = true,
      inTime: number = 1,
      outTime: number = 1
    ) {
      let iTime = inTime;
      let oTime = outTime;
      let it = 0.1;
      let iLen = iTime / it;
      let oLen = oTime / it;
      let volLmt = this.musicVolume;
      let iVolIt = volLmt / iLen;
      for (let i = 0; i < iLen; i++) {
        setTimeout(() => {
          cc.audioEngine.setMusicVolume(volLmt - iVolIt * i);
        }, i * it * 1000);
      }
      setTimeout(() => {
        this.stopMusic();
        this.playMusic(musicName, loop);
      }, iTime * 1000);
      let oVolIt = volLmt / oLen;
      for (let i = 0; i < oLen; i++) {
        setTimeout(() => {
          cc.audioEngine.setMusicVolume(oVolIt * i);
        }, (i * it + iTime) * 1000);
      }
    }
    stopSound(soundName: string) {
      if (this.dict_soundId.containsKey(soundName)) {
        this.dict_soundId.getValue(soundName).forEach(v => {
          cc.audioEngine.stopEffect(v);
        });
        this.dict_soundId.remove(soundName);
      }
    }
    stopMusic() {
      console.log('[SOUND] StopAllMusic');
      cc.audioEngine.stopMusic();
      this.dict_musicID.clear();
    }
    stopAllSounds() {
      console.log('[SOUND] StopAllSound');
      cc.audioEngine.stopAllEffects();
      this.dict_soundId.clear();
    }

    releaseSound(soundName: string) {
      this.stopSound(soundName);
      if (this.dict_clip.has(soundName)) {
        this.dict_clip.delete(soundName);
      }
    }
  }
  class UIMgr {
    constructor() {}
    /**UI根节点; 从外部注入; */
    private _uiRoot: cc.Node = undefined;
    private get uiRoot() {
      if (!this._uiRoot) {
        this._uiRoot = cc.Canvas.instance.node.getChildByName('UIRoot');
      }
      if (!this._uiRoot) {
        this._uiRoot = cc.Canvas.instance.node;
      }
      return this._uiRoot;
    }
    /**进度条函数; 从外部注入; */
    private progressFn: (
      isShow: boolean,
      progress: number,
      desTxt: string
    ) => void = undefined;

    private uiMap: Map<string, UIBase> = new Map<string, UIBase>();
    private pathMap: Map<string, string> = new Map<string, string>();
    private layerMap: Map<string, number> = new Map<string, number>();
    private loadingFlagMap: Map<string, boolean> = new Map<string, boolean>();
    private openingMap: Map<string, UIArgs> = new Map<string, UIArgs>();

    private attachMapClient: Map<string, Map<string, boolean>> = new Map<
      string,
      Map<string, boolean>
    >();
    private attachMapHost: Map<string, Map<string, boolean>> = new Map<
      string,
      Map<string, boolean>
    >();
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
    setProgressFn(
      fn: (isShow: boolean, progress: number, desTxt: string) => void
    ) {
      this.progressFn = fn;
    }

    async openUI(uiArgs: UIArgs) {
      let uiName = uiArgs.uiName;
      if (this.uiMap.has(uiName)) {
        let ui = this.uiMap.get(uiName);
        let uiNd = ui.node;
        this.openUINode(uiNd, uiArgs);
        this.openUIClass(ui, uiArgs);
        return undefined;
      }

      if (this.loadingFlagMap.get(uiName)) {
        warn('[openUI] 正在加载' + uiName);
        this.openingMap.set(uiName, uiArgs);
        this.progressFn(true, Math.random(), '');
        return undefined;
      }

      this.loadingFlagMap.set(uiName, true);
      let path = this.getUIPath(uiName);
      try {
        const prefab_1 = await new Promise((resolveFn, rejectFn) => {
          cc.loader.loadRes(
            path,
            (completedCount: number, totalCount: number, item: any) => {
              if (uiArgs.progressArgs) {
                if (uiArgs.progressArgs.showProgressUI) {
                  this.progressFn
                    ? this.progressFn(
                        true,
                        completedCount / totalCount,
                        uiArgs.progressArgs.desTxt
                      )
                    : error('[UI] 没有注入进度条函数');
                }
              }
            },
            (err, prefab: cc.Prefab) => {
              err ? rejectFn(err) : resolveFn(prefab);
            }
          );
        });
        log('[openUI] ' + uiName + ' open succes');
        this.progressFn && this.progressFn(false, 0, '');
        this.loadingFlagMap.delete(uiName);
        let uiNode: cc.Node = cc.instantiate(prefab_1) as cc.Node;
        uiNode.parent = this.uiRoot;
        let ui_2 = uiNode.getComponent(uiName) as UIBase;
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
      let cb = uiArgs.callbackArgs;
      cb && cb.fn && cb.fn.call(uiArgs.caller, ...cb.args);
    }
    private getUIPath(uiName: string) {
      return this.pathMap.get(uiName) + '/' + uiName;
    }
    /**从场景中移除UI; 保留本地缓存; */
    closeUI(uiName: string): boolean {
      if (this.uiMap.has(uiName)) {
        this.hideUI(uiName);
        let ui = this.uiMap.get(uiName);
        ui.node.parent = null;
        ui.onHide();
        ui.onClose();
        if (this.attachMapHost.has(uiName)) {
          this.attachMapHost.get(uiName).forEach((v, k) => {
            this.closeUI(k) && log('[closeUI] 同时关闭附属:' + k);
          });
        }
        return true;
      }
      return false;
    }
    async preloadUI(uiName: string) {
      if (this.uiMap.has(uiName)) {
        warn('[preloadUI] 已经加载ui:' + uiName);
        return undefined;
      }
      if (this.loadingFlagMap.get(uiName)) {
        warn('[preloadUI] 正在加载' + uiName);
        return undefined;
      }

      this.loadingFlagMap.set(uiName, true);
      let path = this.getUIPath(uiName);
      try {
        const prefab_1 = await new Promise((resolveFn, rejectFn) => {
          cc.loader.loadRes(path, (err, prefab: cc.Prefab) => {
            err ? rejectFn(err) : resolveFn(prefab);
          });
        });
        log('[preloadUI] ' + uiName + ' preload succes');
        this.loadingFlagMap.delete(uiName);
        let uiNode: cc.Node = cc.instantiate(prefab_1) as cc.Node;
        let ui = uiNode.getComponent(uiName) as UIBase;
        this.uiMap.set(uiName, ui);
        if (this.openingMap.has(uiName)) {
          let args = this.openingMap.get(uiName);
          this.openingMap.delete(uiName);
          warn('[Preload] 预载中打开了UI:' + uiName + '; 直接打开');
          this.progressFn(false, 0, '');
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
    destroyUI(uiName: string) {
      this.closeUI(uiName);
      let ui = this.uiMap.get(uiName);
      if (ui) ui.destroy();
      this.uiMap.delete(uiName);
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
          if (this.attachMapHost.has(uiName)) {
            this.attachMapHost.get(uiName).forEach((v, k) => {
              this.hideUI(k) && log('[hideUI] 同时隐藏附属:' + k);
            });
          }
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
    reloadUI(uiName: string) {
      this.destroyUI(uiName);
      this.openUI({ uiName: uiName, progressArgs: { showProgressUI: true } });
    }
    /**设置UI之间依附关系; 宿主UI关闭或隐藏时,同时关闭或隐藏附庸UI */
    setUIAttachment(hostUI: string, clientUI: string) {
      if (!this.attachMapClient.has(clientUI)) {
        this.attachMapClient.set(clientUI, new Map<string, boolean>());
      }
      if (!this.attachMapHost.has(hostUI)) {
        this.attachMapHost.set(hostUI, new Map<string, boolean>());
      }
      this.attachMapHost.get(hostUI).set(clientUI, true);
      this.attachMapClient.get(clientUI).set(hostUI, true);
    }
    /**移除UI之间的依附关系 */
    removeUIAttachment(hostUI: string, clientUI: string) {
      if (this.attachMapClient.has(clientUI)) {
        this.attachMapClient.get(clientUI).delete(hostUI);
      }
      if (this.attachMapHost.has(hostUI)) {
        this.attachMapHost.get(hostUI).delete(clientUI);
      }
    }
  }
  export const farPos: cc.Vec3 = cc.v3(10000, 10000, 0);
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
  class ResMgr {
    constructor() {}
    private prefabMap: Map<string, Map<string, cc.Prefab>> = new Map<
      string,
      Map<string, cc.Prefab>
    >();
    private spriteMap: Map<string, Map<string, cc.SpriteFrame>> = new Map<
      string,
      Map<string, cc.SpriteFrame>
    >();

    private async loadResDict(
      mainType: string,
      subType: string,
      type: typeof cc.Asset,
      assetMap: Map<string, Map<string, cc.Asset>>
    ) {
      let path = mainType + '/' + subType + '/';
      zz.log('[Res] 开始加载' + path);
      try {
        const asset_1: cc.Asset[] = await new Promise((resolveFn, rejectFn) => {
          cc.loader.loadResDir(path, type, (err, res: cc.Asset[]) => {
            err ? rejectFn(err) : resolveFn(res);
          });
        });
        if (!assetMap.has(subType)) {
          assetMap.set(subType, new Map<string, cc.Asset>());
        }
        let subMap = assetMap.get(subType);
        asset_1.forEach(v => {
          subMap.set(v.name, v);
        });
        zz.log('[Res] 完成加载' + path);
      } catch (err_1) {
        error('[loadResDict] error:' + err_1);
      }
    }

    async loadPrefabs(type: string) {
      return this.loadResDict('prefabs', type, cc.Prefab, this.prefabMap);
    }
    loadSprites(type: string) {
      this.loadResDict('sprites', type, cc.SpriteFrame, this.spriteMap);
    }

    getPrefab(type: string, name: string) {
      if (!this.prefabMap.has(type)) {
        this.prefabMap.set(type, new Map<string, cc.Prefab>());
      }
      return this.prefabMap.get(type).get(name);
    }
    getSpriteframe(type: string, name: string) {
      if (!this.spriteMap.has(type)) {
        this.spriteMap.set(type, new Map<string, cc.SpriteFrame>());
      }
      return this.spriteMap.get(type).get(name);
    }
  }
  class ProcedureMgr {
    private procedureMap: Map<string, ProcBase> = new Map<string, ProcBase>();
    private curProcedure: string = undefined;
    get currentProcedure() {
      return this.curProcedure;
    }
    setProcedure(procName: string, procedure: ProcBase) {
      this.procedureMap.set(procName, procedure);
    }
    init(firstProc: string) {
      if (this.procedureMap.has(firstProc)) {
        this.curProcedure = firstProc;
        this.procedureMap.get(firstProc).onStart();
      }
    }
    changeProcedure(procName: string) {
      if (this.procedureMap.has(procName)) {
        this.procedureMap.get(this.curProcedure).onLeave();
        this.curProcedure = procName;
        this.procedureMap.get(procName).onStart();
      } else {
        error('[changeProcedure] 不存在' + procName);
      }
    }
  }
  export abstract class ProcBase {
    abstract onStart();
    abstract onLeave();
  }
  export const event = new EventMgr();
  export const table = new TableMgr();
  export const sto = new StorageMgr();
  export const sound = new SoundMgr();
  export const ui = new UIMgr();
  export const res = new ResMgr();
  export const proc = new ProcedureMgr();
}
