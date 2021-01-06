import { ConstText } from '../const/ConstText';
import { ModelTag } from '../const/ModelTag';
import ModelBase from './ModelBase';
import ModelMgr from './ModelMgr';

export default class BuffModel extends ModelBase {
    constructor(mgr: ModelMgr) {
		super(mgr);
	}
	public readonly TAG: ModelTag = ModelTag.buff;
	protected readonly STOKEY: string = '';
	loadData(): void {
		// buff无保存数据之必要
	}
	public getBuffTableData() {
		// 目前没有表可用
	}
	public getBuffName(type: number) {
		switch (type) {
			case 1:
				return ConstText.buffName1;
			default:
				return '';
		}
	}
	public parseBuff(buff: string) {
		let [a, b] = buff.split(',');
		return {
			type: +a,
			val: +b,
			str: this.getBuffName(+a) + b,
		};
	}
	/**解析buff字段; */
	public parseBuffs(buffs: string) {
		return buffs.split('#').map(buff => this.parseBuff(buff));
	}
}
