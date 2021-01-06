import { TaskState, TaskStoData } from '../const/ConstType';
import { ModelTag } from '../const/ModelTag';
import { StoKey } from '../const/StoKey';
import { error } from '../lib/log/Log';
import { MultiDictionary } from '../lib/structures/Index';
import { int } from '../lib/type/ValueType';
import { zzSdk } from '../manager/zzSdk';
import { zzSto } from '../manager/zzSto';
import { zzTbl } from '../manager/zzTbl';
import { TableDataTask } from '../table/TableDataTask';
import { TableEnum } from '../table/TableEnum';
import ModelBase from './ModelBase';
import ModelMgr from './ModelMgr';

export default class TaskModel extends ModelBase {
	constructor(mgr: ModelMgr) {
		super(mgr);
	}
	public TAG: ModelTag = ModelTag.task;
	protected STOKEY: string = StoKey.taskStoData;
	protected data: TaskStoData = undefined;
	loadData(): void {
		this.initCondtypeMulDict();
		this.initStoData();
		this.checkRefresh();
	}

	/**读表 */
	public getTaskTableData(taskId: number) {
		return zzTbl.getTableItem(TableEnum.Task, taskId) as TableDataTask;
	}
	private condTypeMulDict: MultiDictionary<number, number>;
	/**按条件类型把任务列表分类;减少更新计数的遍历次数 */
	private initCondtypeMulDict() {
		let dict = new MultiDictionary<number, number>();
		zzTbl.getTable(TableEnum.Task).forEach((td: TableDataTask) => {
			dict.setValue(td.condType, td.id);
		});
		this.condTypeMulDict = dict;
	}
	/**初始化所有任务到存储中 */
	private initStoData() {
		this.data = zzSto.getObject<TaskStoData>(this.STOKEY);
		if (!this.data) {
			this.data = {
				history: {},
			};
			zzTbl.getTable(TableEnum.Task).forEach((td: TableDataTask) => {
				this.data[td.id] = {
					acc: 0,
					deadline: 0,
					state: TaskState.todo,
				};
			});
		}
	}
	/**检测任务刷新情况 */
	public checkRefresh() {
		if (!this.data) {
			error('[TaskModel.checkRefresh] 未加载数据就进行了调用');
			return;
		}
		let date = new Date().getDate();
		zzTbl.getTable(TableEnum.Task).forEach((td: TableDataTask) => {
			//防空
			this.data[td.id] = this.data[td.id] || { acc: 0, deadline: 0, state: TaskState.todo };
			switch (td.mainType) {
				case 1:
					if (this.data[td.id].deadline != date) {
						this.resetTask(td.id);
						td.subType == 1 && this.acceptTask(td);
					}
					break;
				case 2:
					if (this.data[td.id].deadline != date) {
						this.resetTask(td.id);
						td.subType == 1 && this.acceptTask(td);
					}
					break;
				case 3:
					// 这辈子就刷新这一次
					if (this.data[td.id].deadline == 0) {
						this.resetTask(td.id);
						td.subType == 1 && this.acceptTask(td);
					}
					break;
			}
		});
		this.onDataChanged();
	}
	/**刷新指定任务 */
	private resetTask(taskId: number) {
		this.data[taskId].acc = 0;
		this.data[taskId].deadline = new Date().getDate();
		this.data[taskId].state = TaskState.todo;
	}
	/**接受任务 */
	public acceptTask(taskData: TableDataTask) {
		let curId = taskData.id;
		// 接任务时默认清空计数进度
		this.data[curId].acc = 0;
		if (taskData.preId) {
			let preId = int(taskData.preId);
			if (this.data[preId].state == TaskState.done) {
				// 自己接取后续任务
				let preData = this.getTaskTableData(preId);
				if (preData.condType == taskData.condType) {
					//同类型:继承前置任务的进度
					this.data[curId].acc = this.data[preId].acc;
					if (this.data[curId].acc >= taskData.condValue) {
						// 真能攒...
						this.data[curId].state = TaskState.wait;
					} else {
						this.data[curId].state = TaskState.doing;
					}
				} else {
					this.data[curId].state = TaskState.doing;
				}
			} else {
				// 继续待命
				this.data[curId].state = TaskState.todo;
			}
		} else {
			this.data[curId].state = TaskState.doing;
		}
	}
	/**获取当前大类可用列表;1每日必做;2同学互动;3成长类型 */
	public getTaskIdList(mainType: number) {
		return Object.keys(this.data)
			.map(taskId => int(taskId))
			.filter(taskId => {
				if (!taskId) return false;
				let td = this.getTaskTableData(taskId);
				return td.mainType == mainType && this.data[taskId].state != TaskState.todo;
			})
			.sort((a, b) => {
				return (this.data[b].state % 3) - (this.data[a].state % 3) || a - b;
			});
	}
	/**检查待提交的情况 */
	public checkWaitStatus() {
		let res: { [mainType: number]: 1 } = {};
		zzTbl.getTable(TableEnum.Task).forEach((td: TableDataTask) => {
			if (!res[td.condType] && this.data[td.id].state == TaskState.wait) {
				res[td.mainType] = 1;
			}
		});
		return res;
	}
	/**更新任务计数;根据任务条件 */
	public updateTaskCounter(condType: number, value: number = 1) {
		// zz.log(`[TaskModel.updateTaskCounter] condType:${LifeTaskCondType[condType]},value:${value}`);
		this.condTypeMulDict.getValue(condType).forEach(taskId => {
			// 等待领取的任务依旧计数,为后续任务积攒进度
			if (this.data[taskId].state == TaskState.doing || this.data[taskId].state == TaskState.wait) {
				this.data[taskId].acc += value;
				if (this.data[taskId].acc >= this.getTaskTableData(taskId).condValue) {
					// 完成了
					this.data[taskId].state = TaskState.wait;
				}
			}
		});
		this.data.history = this.data.history || {};
		this.data.history[condType] = this.data.history[condType] || 0;
		this.data.history[condType] += value;
		this.onDataChanged();
	}
	/**获取任务进度 */
	public getTaskCounter(taskId: number) {
		return this.data[taskId].acc;
	}
	/**获取任务状态 */
	public getTaskState(taskId: number) {
		return this.data[taskId].state;
	}

	/**提交任务,返回奖励字符串,自行处理*/
	public submitTask(taskId: number) {
		if (this.data[taskId].state != TaskState.wait) {
			throw new Error('[TaskModel.submitTask] state!=wait');
		}
		let td = this.getTaskTableData(taskId);
		let awardStr = td.award;
		this.data[taskId].state = TaskState.done;
		this.tryUnlockNextTask(taskId);
		this.onDataChanged();
		return awardStr;
	}
	private tryUnlockNextTask(srcTaskId: number) {
		zzTbl.getTable(TableEnum.Task).forEach((td: TableDataTask) => {
			if (int(td.preId) == srcTaskId) {
				this.acceptTask(td);
			}
		});
	}
}
