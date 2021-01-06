import { PointStoData } from '../const/ConstType';
import { ModelTag } from '../const/ModelTag';
import { StoKey } from '../const/StoKey';
import { int } from '../lib/type/ValueType';
import { zzSto } from '../manager/zzSto';
import ModelBase from './ModelBase';
import ModelMgr from './ModelMgr';

export default class PointModel extends ModelBase {
    constructor(mgr: ModelMgr) {
		super(mgr);
	}
	public readonly TAG: ModelTag = ModelTag.point;
	protected readonly STOKEY: string = StoKey.pointStoData;
	protected data: PointStoData;
	loadData(): void {
		this.data = zzSto.getObject<PointStoData>(this.STOKEY);

		const defaultVal: PointStoData = {
			knowledge: 0,
			knowledgeHistory: 0,
			score: 0,
			scoreHistory: 0,
		};
		this.data = {
			...defaultVal,
			...this.data,
		};
	}
	public incScore(val: number) {
		this.data.score += int(val);
		this.data.scoreHistory += int(val);
		this.accScore(int(val));
		this.onDataChanged();
	}
	public decScore(val: number) {
		if (this.hasScore(val)) {
			this.data.score -= int(val);
			this.onDataChanged();
			return true;
		} else {
			return false;
		}
	}
	public hasScore(val: number) {
		return this.data.score >= val;
	}
	public getScoreCurrent() {
		return this.data.score;
	}
	public getScoreHistory() {
		return this.data.scoreHistory;
	}
	public incKnowledge(val: number) {
		this.data.knowledge += int(val);
		this.data.knowledgeHistory += int(val);
		this.accKnowledge(int(val));
		this.onDataChanged();
	}
	public decKnowledge(val: number) {
		if (this.hasKnowledge(val)) {
			this.data.knowledge -= int(val);
			this.onDataChanged();
			return true;
		} else {
			return false;
		}
	}
	public hasKnowledge(val: number) {
		return this.data.knowledge >= val;
	}
	public hasKnowledgeHistory(val: number) {
		return this.data.knowledgeHistory >= val;
	}
	public getKnowledgeCurrent() {
		return this.data.knowledge;
	}
	public getKnowledgeHistory() {
		return this.data.knowledgeHistory;
	}
	public accKnowledge(val: number) {
		this.mgr.task.updateTaskCounter(12, val);
	}
	public accScore(val: number) {
		this.mgr.task.updateTaskCounter(13, val);
	}
}
