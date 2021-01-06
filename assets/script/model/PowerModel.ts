import { Config } from '../const/Config';
import { ConstText } from '../const/ConstText';
import { PowerStoData } from '../const/ConstType';
import { ModelTag } from '../const/ModelTag';
import { StoKey } from '../const/StoKey';
import { tipMsg } from '../lib/utils/Utils';
import { zzSto } from '../manager/zzSto';
import ModelBase from './ModelBase';
import ModelMgr from './ModelMgr';

/**体力相关内容 */
export default class PowerModel extends ModelBase {
	protected data: PowerStoData = null;
	protected readonly STOKEY: string = StoKey.powerStoData;
	public readonly TAG: ModelTag = ModelTag.power;
	constructor(mgr: ModelMgr) {
		super(mgr);
	}
	loadData(): void {
		this.data = zzSto.getObject<PowerStoData>(this.STOKEY);

		this.data = {
			...{
				isNewbee: true,
				num: 0,
				loginDate: 0,
			},
			...this.data,
		};
		this.innerUpdateConfig();
		this.onDataChanged();
	}
	private innerUpdateConfig() {
		if (Config.requestOver) {
			this.addPowerNewbee();
		}
	}
	public outerUpdateConfig() {
		if (this.data) {
			this.addPowerNewbee();
		}
	}
	/**体力次数 */
	public get powerNum(): number {
		return this.data.num;
	}
	public set powerNum(v: number) {
		if (v < 0) v = 0;
		this.data.num = v;
		this.onDataChanged();
	}

	//#region 限定次数相关
	/**获取体力,通用方法 */
	public addPower(num: number, rate: number = 1) {
		let r = num * rate;
		this.powerNum += r;
		tipMsg(ConstText.powerGet + r);
	}
	private addPowerNewbee() {
		if (this.data.isNewbee) {
			this.addPower(Config.powerData.incNewbee, 1);
			this.data.isNewbee = false;
			this.onDataChanged();
		}
	}
	public addPowerLogin(rate: number) {
		let date = new Date().getDate();
		if (this.data.loginDate != date) {
			this.addPower(Config.powerData.incLogin, rate);
			this.data.loginDate = date;
			this.onDataChanged();
		}
	}
	public hasLogin() {
		return this.data.loginDate == new Date().getDate();
	}
	public addPowerVideo(rate: number) {
		this.addPower(Config.powerData.incVideo, rate);
	}
	public addPowerRecordShare(rate: number) {
		this.addPower(Config.powerData.incRecord, rate);
	}
	public addPowerShare(rate: number) {
		this.addPower(Config.powerData.incShare, rate);
	}
	//#endregion

	//#region 消耗钥匙
	/**消耗体力,通用方法 */
	usePower(num: number) {
		if (this.powerNum < num) {
			return false;
		} else {
			this.powerNum -= num;
			tipMsg(ConstText.powerUse + num);
			return true;
		}
	}
	/**开始关卡消耗钥匙 */
	usePowerMissionStart() {
		return this.usePower(Config.powerData.decMissionStart);
	}
	/**关卡提示消耗钥匙 */
	usePowerMissionHint() {
		return this.usePower(Config.powerData.decMissionHint);
	}
	/**关卡跳过消耗钥匙 */
	usePowerMissionSkip() {
		return this.usePower(Config.powerData.decMissionSkip);
	}
	//#endregion
	hasPower(num: number) {
		return this.powerNum >= num;
	}
	hasPowerMissionStart() {
		return this.hasPower(Config.powerData.decMissionStart);
	}
	hasPowerMissionSkip() {
		return this.hasPower(Config.powerData.decMissionSkip);
	}
}

const MIN_LENGTH = 60 * 1000;

