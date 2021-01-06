import { HonorStoData } from '../const/ConstType';
import { ModelTag } from '../const/ModelTag';
import { StoKey } from '../const/StoKey';
import { int } from '../lib/type/ValueType';
import { randomIndexFromWeight } from '../lib/utils/Utils';
import { zzSto } from '../manager/zzSto';
import { zzTbl } from '../manager/zzTbl';
import { TableDataHonor } from '../table/TableDataHonor';
import { TableEnum } from '../table/TableEnum';
import ModelBase from './ModelBase';
import ModelMgr from './ModelMgr';

export default class HonorModel extends ModelBase {
	constructor(mgr: ModelMgr) {
		super(mgr);
	}
	public TAG: ModelTag = ModelTag.honor;
	protected STOKEY: string = StoKey.honorStoData;
	protected data: HonorStoData = undefined;
	loadData(): void {
		this.data = zzSto.getObject<HonorStoData>(this.STOKEY);
		const defaultVal: HonorStoData = {};
		this.data = {
			...defaultVal,
			...this.data,
		};
		this.recalcAllBuffEffects();
	}
	/**读表 */
	public getHonorTableData(honorId: number) {
		return zzTbl.getTableItem(TableEnum.Honor, honorId) as TableDataHonor;
	}
	/**获取荣誉列表; 按id排列,且已获得的在前 */
	public getHonorList(srcType: number) {
		return (Array.from(zzTbl.getTable(TableEnum.Honor).values()) as TableDataHonor[])
			.sort((a, b) => {
				if (this.hasHonor(a.id) && this.hasHonor(b.id)) {
					return a.id - b.id;
				}
				if (this.hasHonor(a.id)) {
					return -1;
				}
				if (this.hasHonor(b.id)) {
					return 1;
				}
				return a.id - b.id;
			})
			.filter(td => td.srcType == srcType);
	}
	/**获取第一个评优荣誉 */
	public getFirsetSelectionHonor() {
		let firstTd: TableDataHonor;
		zzTbl.getTable(TableEnum.Honor).forEach((td: TableDataHonor) => {
			if (!firstTd && td.srcType == 2) {
				firstTd = td;
			}
		});
		return firstTd;
	}
	public hasFirstSelectionHonor() {
		let firstTd = this.getFirsetSelectionHonor();
		return this.hasHonor(firstTd.id);
	}
	/**是否拥有指定荣誉 */
	public hasHonor(honorId: number) {
		return !!this.data[honorId];
	}
	/**获取指定类型荣誉的总数 */
	public getHonorLength(srcType: number) {
		return (Array.from(zzTbl.getTable(TableEnum.Honor).values()) as TableDataHonor[]).filter(td => td.srcType == srcType).length;
	}
	/**buff效果的整合 */
	private buffEffects: { [buffType: number]: number } = {};
	/**归类整合所有buff效果 */
	private recalcAllBuffEffects() {
		for (let honorId in this.data) {
			this.addBuffEffect(int(honorId));
		}
	}
	/**整合一种荣誉的buff效果 */
	private addBuffEffect(honorId: number) {
		let tbl = this.getHonorTableData(int(honorId));
		this.mgr.buff.parseBuffs(tbl.buff).forEach(b => {
			this.buffEffects[b.type] = this.buffEffects[b.type] || 0;
			this.buffEffects[b.type] += b.val;
		});
	}
	/**获取整合过的buff效果 */
	public getBuffEffectValue(buffType: number) {
		return this.buffEffects[buffType] || 0;
	}
	/**获取考试解锁的荣誉 */
	public rollLootExam(srcRate: number, gradeId: number, examType: number) {
		let srcType = 1;
		let roll = Math.random() < srcRate;
		if (roll) {
			let pool = this.getSrcTypePool(srcType, gradeId).filter(td => td.examType == examType);
			let sel = randomIndexFromWeight(pool.map(tbl => tbl.weight));
			if (sel > -1) {
				return pool[sel];
			}
		}
		return undefined;
	}
	/**获取评优解锁的荣誉 */
	public rollLootSelection(srcRate: number, gradeId: number) {
		let srcType = 2;
		let roll = Math.random() < srcRate;
		if (roll) {
			//TODO 此处可能没有查重
			let pool = this.getSrcTypePool(srcType, gradeId);
			let sel = randomIndexFromWeight(pool.map(tbl => tbl.weight));
			if (sel > -1) {
				return pool[sel];
			}
		}
		return undefined;
	}
	/**筛选可用荣誉 */
	private getSrcTypePool(srcType: number, gradeId: number) {
		return Array.from(zzTbl.getTable(TableEnum.Honor).values()).filter(
			(tbl: TableDataHonor) => tbl.srcType == srcType && this.data[tbl.id] == undefined && tbl.grade == gradeId
		) as TableDataHonor[];
	}
	/**获取任务解锁的荣誉 */
	public rollLootTask(honorId: number) {
		if (this.data[honorId] == undefined) {
			return this.getHonorTableData(honorId);
		}
		return undefined;
	}
	/**获取新荣誉 */
	public receiveNewHonor(honorData: TableDataHonor) {
		if (honorData == undefined) {
			return false;
		}
		if (this.data[honorData.id] == undefined) {
			this.data[honorData.id] = 1;
			this.addBuffEffect(honorData.id);
			honorData.srcType == 1 && this.accExam();
			honorData.srcType == 2 && this.accSelection();
			this.flagNewHonorReceived = true;
			this.onDataChanged();
			return true;
		}
		return false;
	}
	private flagNewHonorReceived = false;
	public hasReceiveNewHonorRecently() {
		return this.flagNewHonorReceived;
	}
	public clearNewHonorRecentlyFlag() {
		this.flagNewHonorReceived = true;
	}

	public accExam() {
		this.mgr.task.updateTaskCounter(14);
	}
	public accSelection() {
		this.mgr.task.updateTaskCounter(15);
	}
}
