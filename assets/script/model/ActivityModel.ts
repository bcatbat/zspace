import { ActivityItemState, ActivityStoData } from '../const/ConstType';
import { ModelTag } from '../const/ModelTag';
import { StoKey } from '../const/StoKey';
import { zzSto } from '../manager/zzSto';
import { TableDataActivity } from '../table/TableDataActivity';
import { TableEnum } from '../table/TableEnum';
import ModelBase from './ModelBase';
import { zzTbl } from '../manager/zzTbl';
import ModelMgr from './ModelMgr';

export default class ActivityModel extends ModelBase {
	public TAG: ModelTag = ModelTag.activity;
	protected STOKEY: string = StoKey.activiyStoData;
	protected data: ActivityStoData = undefined;
	constructor(mgr: ModelMgr) {
		super(mgr);
	}
	loadData(): void {
		this.data = zzSto.getObject<ActivityStoData>(this.STOKEY);
		let defaultVal: ActivityStoData = {};
		this.data = { ...defaultVal, ...this.data };
	}
	/**读表 */
	public getActivityTableData(id: number) {
		return zzTbl.getTableItem(TableEnum.Activity, id) as TableDataActivity;
	}
	private tableData: TableDataActivity[] = undefined;
	/**获取全部列表 */
	private getList() {
		if (!this.tableData) this.tableData = Array.from(zzTbl.getTable(TableEnum.Activity).values()) as TableDataActivity[];
		return this.tableData;
	}
	/**获取列表;1签到;2在线奖励 */
	public getListByType(type: 1 | 2) {
		return this.getList().filter(td => td.type == type);
	}
	/**获取任务状态; 0未完成;1未领取;2已完成 */
	public getState(activiyId: number): ActivityItemState {
		return this.data[activiyId] || ActivityItemState.todo;
	}
	/**是否有待领取的奖励 */
	public hasWaitItem() {
		return this.getList().some(td => this.getState(td.id) == ActivityItemState.wait);
	}
	public checkWait() {
		let res: { [activityType: number]: 1 } = {};
		this.getList().forEach(td => {
			if (this.getState(td.id) == ActivityItemState.wait) {
				res[td.type] = 1;
			}
		});
		return res;
	}
	/**是否全部完成 */
	public isAllComplete() {
		return !this.getList().forEachRight(td => {
			if (this.data[td.id] != 2) {
				return true;
			}
		});
	}



}
