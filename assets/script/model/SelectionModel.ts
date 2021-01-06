import { ConstText } from '../const/ConstText';
import { LifeSelectionState, SelectionStoData } from '../const/ConstType';
import { ModelTag } from '../const/ModelTag';
import { StoKey } from '../const/StoKey';
import { UIEnum } from '../const/UIParams';
import { error } from '../lib/log/Log';
import { int } from '../lib/type/ValueType';
import { clamp, formatSeconds, tipMsg } from '../lib/utils/Utils';
import { zzSto } from '../manager/zzSto';
import { zzTbl } from '../manager/zzTbl';
import { TableDataBook } from '../table/TableDataBook';
import { TableDataHonor } from '../table/TableDataHonor';
import { TableDataSelection } from '../table/TableDataSelection';
import { TableEnum } from '../table/TableEnum';
import ModelBase from './ModelBase';
import ModelMgr from './ModelMgr';

export default class SelectionModel extends ModelBase {
    constructor(mgr: ModelMgr) {
		super(mgr);
	}
	public TAG: ModelTag = ModelTag.selection;
	protected STOKEY: string = StoKey.selectionStoData;
	protected data: SelectionStoData = undefined;
	loadData(): void {
		this.data = zzSto.getObject<SelectionStoData>(this.STOKEY);
		const defaultVal: SelectionStoData = {
			date: 0,
			state: LifeSelectionState.todo,
			roundIndex: 0,
			currentSelId: 0,
			buffCount: 0,
			roundScore: 0,
			unlock: 0,
		};
		this.data = {
			...defaultVal,
			...this.data,
		};

		this.tryResetCount();
		this.startCountDown();
		if (this.data.currentSelId == 0) {
			if (this.data.state != LifeSelectionState.todo) {
				error('[SelectionModel.loadData]:bug了,currentId==0时state非todo');
			}
			this.data.state = LifeSelectionState.todo;
		} else {
			// 每次重启,根据当前存储值判定该轮胜负
			if (this.data.state == LifeSelectionState.doing) {
				this.finishRound();
			} else if (this.data.state == LifeSelectionState.done && !this.output) {
				this.waitForGettingYields();
			}
		}
	}
	/**读表 */
	public getSelectionTableData(id: number) {
		return zzTbl.getTableItem(TableEnum.Selection, id) as TableDataSelection;
	}
	/**获取评优表的id极值 */
	public getSelectionIdRange() {
		return [1, zzTbl.getTable(TableEnum.Selection).size];
	}
	public isFunctionUnlock() {
		return this.data.unlock == 1;
	}
	public unlockFunction() {
		this.data.unlock = 1;
		this.onDataChanged();
	}
	public checkUnlockByMissionId(missionId: number) {
		let targetId = this.mgr.global.getTabSelectionUnlockMission();
		return targetId == missionId;
	}
	/**开始评优;消耗成绩;获取奖励结果 */
	public startSelection(selectionId: number): 'point' | 'count' | 'ok' {
		if (selectionId == 0) {
			error('[SelectionModel.startSelection]:selectionId不可以为0');
			return;
		}
		let tbl = this.getSelectionTableData(selectionId);
		if (this.data[selectionId] > 0) {
			if (this.mgr.point.decScore(tbl.cost)) {
				this.data[selectionId]--;
				this.data.currentSelId = selectionId;
				this.data.roundIndex = 1;
				this.data.state = LifeSelectionState.doing;
				this.accRound();
				this.onDataChanged();
				return 'ok';
			}
			return 'point';
		} else {
			return 'count';
		}
	}

	/**判断并进行下一轮 */
	public nextRound(): 'continue' | 'finish' {
		const roundLimit = this.mgr.global.getSelectionRoundMax();
		if (this.data.roundIndex < roundLimit) {
			this.data.roundIndex++;
			this.data.state = LifeSelectionState.doing;
			this.accRound();
			this.onDataChanged();
			return 'continue';
		} else {
			error('[SelectionModel.nextRound]:此处不应该调用');
			this.data.roundIndex = -1;
			this.waitForGettingYields();
			this.onDataChanged();
			return 'finish';
		}
	}
	/**完成一轮比赛 */
	public finishRound(): 'continue' | 'finish' {
		this.data.state = LifeSelectionState.wait;
		if (this.data.buffCount == this.mgr.global.getSelectionBuffMaxCount()) {
			tipMsg(ConstText.selectionMaxBuff);
			this.onDataChanged();
			return 'finish';
		}
		//我为右,为负
		if (this.data.roundScore < 0) {
			this.incBuffCount();
			tipMsg(ConstText.selectionRoundSuccess + this.getBuffValue() * 100 + '%');
		} else {
			this.onDataChanged();
			tipMsg(ConstText.selectionRoundFail);
		}
		const roundLimit = this.mgr.global.getSelectionRoundMax();
		if (this.data.roundIndex < roundLimit) {
			return 'continue';
		} else {
			return 'finish';
		}
	}
	/**直接完成所有回合 */
	public finishAllRounds() {
		this.waitForGettingYields();
	}
	/**返回当前轮数 */
	public getRoundIndex() {
		return this.data.roundIndex;
	}
	/**当前生效的评优id */
	public getCurrentId() {
		return this.data.currentSelId;
	}
	/**记录当前轮分数; 一秒记一次 */
	public saveRoundScore(score: number) {
		this.data.roundScore = score;
		this.onDataChanged();
	}
	/**获得增益次数 */
	public getBuffCount() {
		return this.data.buffCount;
	}
	/**获得增益值; 小数 */
	public getBuffValue() {
		return this.getBuffCount() * this.mgr.global.getSelectionBuffPer();
	}
	/**获得最高增益 */
	public incBuffCountLmt() {
		this.data.buffCount = this.mgr.global.getSelectionBuffMaxCount();
		this.onDataChanged();
	}
	/**增加一次增益次数 */
	public incBuffCount() {
		let lmt = this.mgr.global.getSelectionBuffMaxCount();
		this.data.buffCount = clamp(this.data.buffCount + 1, 0, lmt);
		this.onDataChanged();
	}
	/**计算考评结果 */
	private calcYields() {
		let honorAward: TableDataHonor;
		// 第一次固定给一个荣誉;状态切换,可以关闭
		if (this.mgr.honor.hasFirstSelectionHonor()) {
			honorAward = this.mgr.honor.rollLootSelection(
				this.getRateHonor(this.data.currentSelId),
				this.getSelectionTableData(this.data.currentSelId).grade
			);
		} else {
			honorAward = this.mgr.honor.getFirsetSelectionHonor();
		}
		let resRoll = {
			book: this.mgr.book.rollLootSelection(this.getRateBook(this.data.currentSelId)),
			honor: honorAward,
		};
		return resRoll;
	}
	private output: { book: TableDataBook; honor: TableDataHonor } = undefined;
	/**获取考评结果数据 */
	public getYieldData() {
		return this.output;
	}

	/**等待确认考评结果 */
	public waitForGettingYields() {
		this.output = this.calcYields();
		// 在获取之前,不重置buff次数
		this.data.state = LifeSelectionState.done;
		this.data.roundIndex = -1;
		this.onDataChanged();
	}
	/**确认结果;领取奖励 */
	public receiveYields() {
		this.data.buffCount = 0;
		this.data.state = LifeSelectionState.todo;
		this.data.roundIndex = -1;
		this.accTotal();
		this.accSpecific(this.data.currentSelId);
		this.data.currentSelId = 0;
		let resBook = this.output.book;
		// this.mgr.book.receiveNewBook(this.output.book);
		this.mgr.honor.receiveNewHonor(this.output.honor);
		this.output = undefined;
		this.onDataChanged();
		return resBook;
	}

	/**获取当前评优状态; */
	public getSelectionState() {
		return this.data.state;
	}
	/**获取参考书的概率 */
	public getRateBook(selectionId: number) {
		return this.getSelectionTableData(selectionId).bookRate / 100;
	}
	/**获取荣誉的概率 */
	public getRateHonor(selectionId: number) {
		return this.getSelectionTableData(selectionId).honorRate / 100 + this.getBuffValue();
	}
	//#region 倒计时
	/**开始倒计时 */
	private startCountDown() {
		setInterval(this.updateCountDown.bind(this), 1000);
	}
	/**倒计时数组;单位s;不存储 */
	private countDownArr: number[] = [];

	/**更新倒计时 */
	private updateCountDown() {
		zzTbl.getTable(TableEnum.Selection).forEach((td: TableDataSelection) => {
			this.countDownArr[td.id] = this.countDownArr[td.id] || int(td.countDownTime);
			this.countDownArr[td.id] -= 1;
			if (this.countDownArr[td.id] == 0) {
				this.data[td.id]++;
				this.onDataChanged();
			}
		});
		this.tryResetCount();
	}
	/**重置次数 */
	private tryResetCount() {
		if (this.data.date != new Date().getDate()) {
			zzTbl.getTable(TableEnum.Selection).forEach((td: TableDataSelection) => {
				this.data[td.id] = td.freeCount;
			});
			this.data.date = new Date().getDate();
			this.onDataChanged();
		}
	}
	/**是否有剩余次数 */
	public getCount(selectionId: number) {
		return this.data[selectionId] || 0;
	}
	/**获取倒计时字符串 */
	public getCountDownStr(selectionId: number) {
		let s = this.countDownArr[selectionId];
		return formatSeconds(s);
	}
	/**增加考评次数 */
	public addCount(selectionId: number) {
		this.data[selectionId]++;
		this.onDataChanged();
	}
	//#endregion
	public accTotal() {
		this.mgr.task.updateTaskCounter(9);
	}
	public accSpecific(selectionId: number) {
		// 16,17,18,19,20,21
		this.mgr.task.updateTaskCounter(15 + selectionId);
	}
	public accRound() {
		this.mgr.task.updateTaskCounter(25);
	}
}
