/// <reference path="zzStructure.ts" />
/// <reference path="zzLog.ts" />
/// <reference path="zzUtils.ts" />
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
    id: string | number;
  }
  class TableMgr {
    private allTables: Map<string, Map<number | string, TableBase>> = null;

    public constructor() {
      this.allTables = new Map<string, Map<number, any>>();
    }
    public async loadConfig<T extends { id: string }>(
      tableType: string,
      bundleName: string
    ) {
      if (this.allTables.has(tableType)) {
        this.allTables.set(tableType, new Map<number, any>());
      }
      try {
        let bundle = await utils.getBundle(bundleName);
        const jsonAsset_1 = await new Promise<cc.JsonAsset>(
          (resolveFn, rejectFn) => {
            bundle.load(tableType, (err, jsonAsset: cc.JsonAsset) => {
              err ? rejectFn(err) : resolveFn(jsonAsset);
            });
          }
        );
        let jsonObj = jsonAsset_1.json;
        let tableMap = new Map<any, any>();
        for (let k in jsonObj) {
          let obj = JSON.parse(JSON.stringify(jsonObj[k])) as T;
          tableMap.set(obj.id, obj);
        }
        this.allTables.set(tableType, tableMap);
        cc.resources.release('configs/' + tableType);
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
    public getTableItem(tableType: string, key: string | number) {
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
    public hasTableItem(tableType: string, key: string | number) {
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
  class SoundMgr {
    dict_clip: Map<string, cc.AudioClip> = new Map<string, cc.AudioClip>();
    dict_soundId: MultiDictionary<string, number> = new MultiDictionary<
      string,
      number
    >();
    dict_musicID: MultiDictionary<string, number> = new MultiDictionary<
      string,
      number
    >();
    dict_flag: Map<string, number> = new Map<string, number>();

    private soundVolume: number = 1.0;
    set SoundVolume(volume: number) {
      this.soundVolume = volume;
      cc.audioEngine.setEffectsVolume(volume);
    }
    get SoundVolume() {
      return this.soundVolume;
    }
    private musicVolume: number = 0.5;
    set MusicVolume(volume: number) {
      this.musicVolume = volume;
      cc.audioEngine.setMusicVolume(volume);
    }
    get MusicVolume() {
      return this.musicVolume;
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

    async playSound(soundName: string, loop: boolean = false) {
      if (!this.isAllOn) {
        return;
      }
      if (!this.isSoundOn) {
        return;
      }
      this.dict_flag.set(soundName, 1);
      if (this.dict_clip.has(soundName)) {
        let clip = this.dict_clip.get(soundName);
        let soundID = cc.audioEngine.playEffect(clip, loop);
        this.dict_soundId.setValue(soundName, soundID);
        cc.audioEngine.setFinishCallback(soundID, () => {
          if (!loop || !this.dict_flag.get(soundName)) {
            this.dict_soundId.remove(soundName, soundID);
          }
        });
      } else {
        let bundle = await utils.getBundle('audio');
        bundle.load(soundName, cc.AudioClip, (err, clip: cc.AudioClip) => {
          if (this.dict_clip.get(soundName)) return;
          if (!this.dict_flag.get(soundName)) return;
          this.dict_clip.set(soundName, clip);
          let soundID = cc.audioEngine.playEffect(clip, loop);
          this.dict_soundId.setValue(soundName, soundID);
          cc.audioEngine.setFinishCallback(soundID, () => {
            if (!loop || !this.dict_flag.get(soundName)) {
              this.dict_soundId.remove(soundName, soundID);
            }
          });
        });
      }
    }

    async playMusic(musicName: string, loop: boolean = true) {
      if (!this.isAllOn) {
        return;
      }
      if (!this.isMusicOn) {
        return;
      }
      if (this.dict_musicID.containsKey(musicName)) {
        return;
      }
      if (this.dict_clip.has(musicName)) {
        let clip = this.dict_clip.get(musicName);
        let id = cc.audioEngine.playMusic(clip, loop);
        this.dict_musicID.setValue(musicName, id);
        cc.audioEngine.setFinishCallback(id, () => {
          if (!loop) {
            this.dict_musicID.remove(musicName, id);
          }
        });
      } else {
        try {
          let bundle = await utils.getBundle('audio');
          bundle.load(
            musicName,
            cc.AudioClip,
            (err: Error, clip: cc.AudioClip) => {
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
                  this.dict_musicID.remove(musicName, id);
                }
              });
            }
          );
        } catch (err) {
          error(err);
        }
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
      this.dict_flag.set(soundName, 0);
      if (this.dict_soundId.containsKey(soundName)) {
        this.dict_soundId.getValue(soundName).forEach(v => {
          cc.audioEngine.stopEffect(v);
        });
        this.dict_soundId.remove(soundName);
      }
    }
    stopMusic() {
      cc.audioEngine.stopMusic();
      this.dict_musicID.clear();
    }
    stopAllSounds() {
      cc.audioEngine.stopAllEffects();
      this.dict_soundId.keys().forEach(v => {
        this.dict_flag.set(v, 0);
      });
      this.dict_soundId.clear();
    }
    releaseSound(soundName: string) {
      this.stopSound(soundName);
      if (this.dict_clip.has(soundName)) {
        this.dict_clip.delete(soundName);
      }
      utils.getBundle('audio').then(bundle => {
        bundle.release(soundName);
      });
    }
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
    /**进度条函数; 从外部注入; */
    private progressFn: (
      isShow: boolean,
      progress: number,
      desTxt: string
    ) => void = undefined;

    private uiMap: Map<string, UIBase> = new Map<string, UIBase>();
    private pathMap: Map<string, string> = new Map<string, string>();
    private layerMap: Map<string, number> = new Map<string, number>();
    /**加载中标记 */
    private loadingFlagMap: Map<string, boolean> = new Map<string, boolean>();
    /**打开中标记; */
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
        if (uiNd && uiNd.isValid) {
          this.openUINode(uiNd, uiArgs);
          this.openUIClass(ui, uiArgs);
          return undefined;
        } else {
          this.uiMap.delete(uiName);
        }
      }

      if (this.loadingFlagMap.get(uiName)) {
        warn('[openUI] 正在加载' + uiName);
        this.openingMap.set(uiName, uiArgs);
        this.progressFn(true, Math.random(), '');
        return undefined;
      }

      this.loadingFlagMap.set(uiName, true);

      try {
        const bundle = await this.getUIBundle(uiName);
        const prefab_1 = await new Promise<cc.Prefab>((resolveFn, rejectFn) => {
          bundle.load(
            uiName,
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
        this.progressFn?.(false, 0, '');
        this.loadingFlagMap.delete(uiName);
        let uiNode: cc.Node = await utils.instantiatePrefab(prefab_1);
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
        if (this.attachMapHost.has(uiName)) {
          this.attachMapHost.get(uiName).forEach((v, k) => {
            this.closeUI(k);
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
      try {
        const bundle = await this.getUIBundle(uiName);
        const prefab_1 = await new Promise<cc.Prefab>((resolveFn, rejectFn) => {
          bundle.load(uiName, (err, prefab: cc.Prefab) => {
            err ? rejectFn(err) : resolveFn(prefab);
          });
        });
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
    destroyUI(uiName: string, resRelease: boolean) {
      this.closeUI(uiName);
      let ui = this.uiMap.get(uiName);
      ui?.destroy();
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
          if (this.attachMapHost.has(uiName)) {
            this.attachMapHost.get(uiName).forEach((v, k) => {
              this.hideUI(k);
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
    async releaseUI(uiName: string) {
      try {
        let bundle = await this.getUIBundle(uiName);
        bundle.release(uiName);
      } catch (err) {
        error(err);
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
      if (!this.prefabMap.containsKey(bundleName + '/' + dirName)) {
        return undefined;
      }
      return this.prefabMap.getValue(dirName).getValue(name);
    }
    getSpriteframe(bundleName: string, dirName: string, name: string) {
      if (!this.spriteMap.containsKey(bundleName + '/' + dirName)) {
        return undefined;
      }
      return this.spriteMap.getValue(dirName).getValue(name);
    }
  }
  /**流程管理;一条单通道管线 */
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
  /**事件管理 */
  export const event = new EventMgr();
  /**表格管理 */
  export const table = new TableMgr();
  /**存储管理 */
  export const sto = new StorageMgr();
  /**声音管理 */
  export const sound = new SoundMgr();
  /**UI管理 */
  export const ui = new UIMgr();
  /**场景管理 */
  export const scene = new SceneMgr();
  /**动态资源管理 */
  export const res = new ResMgr();
  /**流程管理 */
  export const proc = new ProcedureMgr();
}
