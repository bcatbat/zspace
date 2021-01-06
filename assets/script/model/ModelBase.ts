import { EventType } from '../const/EventType';
import { ModelTag } from '../const/ModelTag';
import { zzEvt } from '../manager/zzEvt';
import { zzSto } from '../manager/zzSto';
import ModelMgr from './ModelMgr';

export default abstract class ModelBase {
	constructor(modelMgr: ModelMgr) {
		this.mgr = modelMgr;
	}
	protected mgr: ModelMgr;
	/**标签,用于区分notifyUI事件 */
	public abstract readonly TAG: ModelTag;
	/**存储键值 */
	protected abstract readonly STOKEY: string;
	/**存储的数据;键值尽量只一层 */
	protected data: unknown;
	/**读取数据;初始化时调用; 不要放在ctor中 */
	abstract loadData(): void;
	/**保存数据 */
	protected saveData(): void {
		this.data && zzSto.saveObject(this.STOKEY, this.data);
	}
	/**通知参数变化 */
	protected onDataChanged(...args: any[]): void {
		this.saveData();
		this.notifyUI(this.TAG, ...args);
	}
	/**通知刷新UI */
	protected notifyUI(name: string, ...args: any[]) {
		zzEvt.fire(EventType.NotifyUI, name, ...args);
	}
}
