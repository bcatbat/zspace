import { MissionStoData } from '../const/ConstType';
import { ModelTag } from '../const/ModelTag';
import { StoKey } from '../const/StoKey';
import { UIEnum } from '../const/UIParams';
import { warn } from '../lib/log/Log';
import { int } from '../lib/type/ValueType';
import { zzSdk } from '../manager/zzSdk';
import { zzSto } from '../manager/zzSto';
import { zzTbl } from '../manager/zzTbl';
import { zzUI } from '../manager/zzUI';
import { TableDataMission } from '../table/TableDataMission';
import { TableEnum } from '../table/TableEnum';
import ModelBase from './ModelBase';
import ModelMgr from './ModelMgr';
/**
 * * 每个章节都有各自进度,用于重玩
 * * cur和chapterProg互相更新;
 * * 章节的关卡集合;
 * * 章节集合;
 * * 部分关卡屏蔽;
 * * 已通关关卡
 * * 关卡打开,解锁,过关
 * *
 */
export default class MissionModel extends ModelBase {
	constructor(mgr: ModelMgr) {
		super(mgr);
	}
	public readonly TAG: ModelTag = ModelTag.mission;
	protected readonly STOKEY: string = StoKey.missionStoData;
	/**存储的关卡数据 */
	data: MissionStoData;
	public loadData() {
		this.data = zzSto.getObject<MissionStoData>(this.STOKEY);
		let defaultVal: MissionStoData = {
			cur: 1,
			pass: {},
			chapterProgress: {
				1: 1,
			},
		};
		this.data = {
			...defaultVal,
			...this.data,
		};
		this.initMissionArray();
		this.initChapterArray();
	}

	/**关卡集合*/
	private initMissionArray() {
		this.missionIdArr = Array.from(zzTbl.getTable(TableEnum.Mission).values() as IterableIterator<TableDataMission>)
			.filter(v => !this.skipDict[int(v.id)])
			.map(v => int(v.id))
			.sort((a, b) => a - b);
	}
	/**章节分类集合 */
	private initChapterArray() {
		this.missionChapterArr[0] = [];
		zzTbl.getTable(TableEnum.Mission).forEach((v: TableDataMission) => {
			this.missionChapterArr[v.chapter] = this.missionChapterArr[v.chapter] || [];
			if (!this.skipDict[int(v.id)]) this.missionChapterArr[v.chapter].push(+v.id);
		}, this);
		this.missionChapterArr.forEach(missionList => {
			missionList.sort((a, b) => a - b);
		});
	}

	/**获取关卡表格数据 */
	public getMissionTableData(missionId: number) {
		let tbl = zzTbl.getTableItem(TableEnum.Mission, missionId) as TableDataMission;
		return tbl;
	}
	public accMission() {
		this.mgr.task.updateTaskCounter(1);
	}
	/**累计一次作弊次数 */
	public accCheat() {
		this.mgr.task.updateTaskCounter(4);
	}
	/**累计跳关次数 */
	public accSkip() {
		this.mgr.task.updateTaskCounter(5);
	}
	/**头条屏蔽的关卡id字典 */
	private readonly skipDictTT = { 6: 1, 11: 1, 15: 1, 30: 1 };
	/**当前屏蔽id集合 */
	private skipDict: { [missionId: number]: number } = {};
	/**关卡id集合 */
	private missionIdArr: number[] = [];
	/**获取当前关卡ID */
	public get cur() {
		return this.data.cur;
	}
	/**[章节id][关卡id] */
	private missionChapterArr: number[][] = [];
	/**全通标记; 只计算一次 */
	private isAllPass = false;
	/**是否全通; */
	public checkAllPass() {
		if (!this.isAllPass) {
			const hasNotPass = (id: number) => !this.isMissionPassed(id);
			// 若找不到未通关的,则全通
			this.isAllPass = !this.missionIdArr.find(hasNotPass, this);
		}
		return this.isAllPass;
	}
	/**获取当前进度ID */
	public getProgress() {
		// 第一个未通关的关卡就是进度
		if (this.progress == 0) this.updateProgress();
		return this.progress;
	}
	private progress: number = 0;
	private updateProgress() {
		this.progress = this.missionIdArr.find((id: number) => !this.data.pass[id], this);
	}
	/**
	 * 过关时调用
	 * @returns {number} 通过的关卡号
	 */
	public passMission(): number {
		// 记录通过的关卡
		let missionId = this.data.cur;
		// 此处进度累加比较武断
		if (!this.data.pass[missionId]) {
			this.mgr.task.updateTaskCounter(11, 1);
		}
		this.data.pass[missionId] = 1;
		this.accMission();

		let td = this.getMissionTableData(missionId);
		let chapterId = td.chapter;

		let nextMissionId = this.getNextMissionId(missionId);
		let nextChapterId = this.getMissionTableData(nextMissionId).chapter;
		if (nextChapterId == chapterId) {
			this.data.chapterProgress[chapterId] = nextMissionId;
		} else if (nextChapterId != chapterId) {
			this.data.chapterProgress[chapterId] = this.missionChapterArr[chapterId][0];
			this.data.chapterProgress[nextChapterId] = nextMissionId;
		}
		this.data.cur = nextMissionId;
		this.updateProgress();

		this.onDataChanged();
		return missionId;
	}
	/**通过所有关卡 */
	public passAllMission() {
		this.missionIdArr.forEach(id => {
			this.data.pass[id] = 1;
			let unlockCourseType = this.mgr.study.checkUnlockByMissionId(id);
			if (unlockCourseType) {
				this.mgr.study.unlockCourse(unlockCourseType);
			}
			if (this.mgr.exam.checkUnlockByMissionId(id)) {
				this.mgr.exam.unlockFunction();
			}
			if (this.mgr.selection.checkUnlockByMissionId(id)) {
				this.mgr.selection.unlockFunction();
			}
		});
		this.onDataChanged();
	}
	/**获取下一关的id */
	public getNextMissionId(cur: number) {
		let last = this.missionIdArr.eleAt(-1);
		let next = cur;
		while (true) {
			next++;
			if (this.skipDict[next]) {
				continue;
			}
			if (next > last) {
				next = 0;
				continue;
			}
			break;
		}
		return next;
	}
	/**获取下一关的uiName */
	public getNextMissionName() {
		let nextId = this.getNextMissionId(this.data.cur);
		return this.getMissionTableData(nextId).name;
	}
	/**
	 * 判断目标关卡是否已通过; 用于判断打勾;
	 * @param missionNum 目标关卡号
	 */
	public isMissionPassed(missionNum: number): boolean {
		return this.data.pass[missionNum] == 1;
	}
	/**打开当前关卡; */
	public openMissionCurrent(needPower: boolean, loc: string, loading: boolean = true) {
		if (needPower) {
			if (this.mgr.power.usePowerMissionStart()) {
				this.openMissionById(this.cur, loc, loading);
				return true;
			} else {
				return false;
			}
		} else {
			this.openMissionById(this.cur, loc, loading);
		}
	}
	/**通过关卡id打开; 注:没有自动判断体力 */
	public openMissionById(missionId: number, loc: string, loading: boolean = true) {
		this.data.cur = missionId;
		let chapterId = this.getMissionTableData(missionId).chapter;
		this.data.chapterProgress[chapterId] = missionId;
		this.onDataChanged();
		let missionName = this.getMissionUINameById(missionId);
		if (missionName) {
		} else {
			return undefined;
		}
	}
	/**进入当前章节进度 */
	public openMissionByChapter(chapterId: number, loc: string, loading?: boolean) {
		let missionId = this.data.chapterProgress[chapterId];
		if (!missionId) {
			missionId = this.missionChapterArr[chapterId][0];
		}
		this.openMissionById(missionId, loc, loading);
	}
	/**通过关卡id获取关卡uiName */
	public getMissionUINameById(missionId: number) {
		let tbl = zzTbl.getTableItem(TableEnum.Mission, missionId) as TableDataMission;
		if (tbl) {
			return tbl.name;
		} else {
			warn('[Mission] missionNum not found:' + missionId);
			return undefined;
		}
	}
	/**获取当前关卡的uiName */
	public getMissionUINameCurrent() {
		return this.getMissionUINameById(this.cur);
	}
	/**获取章节数量 */
	public getChapterLength() {
		return this.missionChapterArr.length - 1;
	}
	/**获取章节的关卡id列表 */
	public getChapterMissionList(chapterId: number) {
		return this.missionChapterArr[chapterId];
	}
	/**获取当前章节的进度 */
	public getChapterProgress(chapterId: number) {
		let missionId = this.data.chapterProgress[chapterId];
		let len = this.missionChapterArr[chapterId].length;
		if (!missionId) {
			return {
				cur: 0,
				tol: len,
				missionId: this.missionChapterArr[chapterId][0],
			};
		}
		let index = this.missionChapterArr[chapterId].indexOf(missionId);
		return {
			cur: index + 1,
			tol: len,
			missionId: missionId,
		};
	}
	/**获取章节完成情况;0-过去;1-现在;2-将来 */
	public getChapterStatus(chapterId: number): 0 | 1 | 2 {
		let curFirst = this.getChapterMissionList(chapterId)[0];
		let curLast = this.getChapterMissionList(chapterId).eleAt(-1);
		if (chapterId == 1) {
			if (this.data.pass[curLast]) {
				return 0;
			}
			return 1;
		} else {
			let lastLast = this.getChapterMissionList(chapterId - 1).eleAt(-1);
			if (this.data.pass[curFirst]) {
				if (this.data.pass[curLast]) {
					return 0;
				} else {
					return 1;
				}
			} else {
				if (this.data.pass[lastLast]) {
					return 1;
				} else {
					return 2;
				}
			}
		}
	}
	/**获取章节列表 */
	public getChapterList() {
		return Array.from(this.missionChapterArr.keys()).slice(1);
	}
}
