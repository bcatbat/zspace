import { GuideStoData } from '../const/ConstType';
import { ModelTag } from '../const/ModelTag';
import { StoKey } from '../const/StoKey';
import { UIEnum } from '../const/UIParams';
import { error, log } from '../lib/log/Log';
import { setTimeout } from '../lib/timer/TimerHelper';
import { zzSto } from '../manager/zzSto';
import { zzTbl } from '../manager/zzTbl';
import { zzUI } from '../manager/zzUI';
import { TableDataGuide } from '../table/TableDataGuide';
import { TableEnum } from '../table/TableEnum';
import ModelBase from './ModelBase';
import ModelMgr from './ModelMgr';

export default class GuideModel extends ModelBase {
	constructor(mgr: ModelMgr) {
		super(mgr);
	}
	public TAG: ModelTag = ModelTag.guide;
	protected STOKEY: string = StoKey.guideStoData;
	protected data: GuideStoData;
	loadData(): void {
		this.data = zzSto.getObject<GuideStoData>(this.STOKEY);
		let defaultVal = {};
		this.data = { ...defaultVal, ...this.data };
		this.initSectionEntry();
	}
	private getTableData(id: number) {
		return zzTbl.getTableItem(TableEnum.Guide, id) as TableDataGuide;
	}
	private sectionEntry = {
		book1: 300,
		book2: 305,
		exam1: 400,
		exam2: 401,
		exam3: 403,
		exam4: 405,
		mission: 600,
		sel1: 500,
		sel2: 501,
		sel3: 503,
		sel4: 506,
		sel5: 508,
		sel6: 510,
		studyA1: 100,
		studyA2: 103,
		studyB1: 200,
		studyB2: 201,
	};
	private initSectionEntry() {
		zzTbl.getTable(TableEnum.Guide).forEach((td: TableDataGuide) => {
			if (td.sectionIn) this.sectionEntry[td.sectionIn] = td.id;
		});
	}
	get enable() {
		return true;
	}
	public isSectionFinish(sectionId: string) {
		return this.data[sectionId] == 1;
	}
	private curId: number = 0;
	public beginGuide(id: number) {
		if (!this.enable) {
			return false;
		}
		let td = this.getTableData(id);
		if (!td) {
			error(`[Guide] 未找到表格数据${id}`);
			return false;
		}
		if (td.preSection) {
			if (!this.isSectionFinish(td.preSection)) {
				return false;
			}
		}
		// 判断section是否已完成
		if (this.data[td.sectionIn] == 1) return false;

		this.curId = id;
		log(`[Guide] id=${td.id},section=${td.sectionIn},next=${td.next}`);
		setTimeout(() => {
			// 进行下一步引导的时候需要空一帧
			zzUI.openUI({ uiName: UIEnum.UIGuide, openArgs: [td, this.parseNodeStr(td.target)] });
		}, 20);
		if (td.sectionOut) {
			this.data[td.sectionOut] = 1;
			this.onDataChanged();
		}
		return true;
	}
	public nextGuide() {
		let td = this.getTableData(this.curId);
		if (td.next) {
			let nextTd = this.getTableData(td.next);
			if (nextTd) {
				this.beginGuide(nextTd.id);
				return;
			}
		}
		this.endGuide();
	}
	public endGuide() {
		this.curId = 0;
		zzUI.closeUI(UIEnum.UIGuide);
	}
	public closeSection(sectionId: string) {
		this.data[sectionId] = 1;
		this.onDataChanged();
	}
	private parseNodeStr(str: string) {
		let [uiName, ndName] = str.split('.');
		let ui = zzUI.getUI(uiName);
		if (!ui) return;
		let nd = ui[ndName] as cc.Node;
		return nd;
	}
}
