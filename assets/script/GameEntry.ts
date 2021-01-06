import { ConstText } from './const/ConstText';
import { GameTimerData } from './const/ConstType';
import { EventType } from './const/EventType';
import { StoKey } from './const/StoKey';
import { uiParams } from './const/UIParams';


import ProcConfig from './procedure/ProcConfig';
import { ProcEnum } from './procedure/ProcEnum';
import ProcGame from './procedure/ProcGame';
import ProcLoad from './procedure/ProcLoad';
import ProcPlatform from './procedure/ProcPlatform';
import ProcRes from './procedure/ProcRes';
import { zz } from './zz';

const { ccclass, property } = cc._decorator;
@ccclass
export default class GameEntry extends cc.Component {
	@property(cc.Node) sceneRoot: cc.Node = undefined;
	@property(cc.Node) uiRoot: cc.Node = undefined;
	onLoad() {
		this.initZZ();
	}

	private initZZ() {
		this.initHelper();
		zz.loadingPage(true, 0, ConstText.loading_table);
		this.initUI();
		this.initScene();		
		zz.sound.MusicVolume = 0.2;
		this.initProcedure();

		this.initTimer();
	}
	private initTimer() {
		this.addLoginCount();
		this.startTimer();
	}

	/**注册帮助方法 */
	private initHelper() {
		zz.setTipFn(msg => {
			zz.event.fire(EventType.Tip, msg);
		});
		zz.setLoadingPageFn((...parm) => {
			zz.event.fire(EventType.LoadingPage, ...parm);
		});
	}
	/**初始化ui层;锚点居中,全铺*/
	private initUI() {
		zz.ui.setUIParams(uiParams);
		zz.ui.setUIRoot(this.uiRoot);
	}
	/**初始化scene层; 场景统一放置在uiScene之下, 坐标与世界统一,无需转换;*/
	private initScene() {
		zz.scene.setSceneRoot(this.sceneRoot);
	}
	/**开启游戏主线 */
	private initProcedure() {
		zz.proc.setProcedure(ProcEnum.Config, new ProcConfig());
		zz.proc.setProcedure(ProcEnum.Load, new ProcLoad());
		zz.proc.setProcedure(ProcEnum.Res, new ProcRes());
		zz.proc.setProcedure(ProcEnum.Platform, new ProcPlatform());
		zz.proc.setProcedure(ProcEnum.Game, new ProcGame());
		zz.proc.init(ProcEnum.Config);
	}
	private startTimer() {
		zz.setInterval(this.gameTicker.bind(this), 1000, 'tick');
		// zz.setInterval(() => {
		// 	zz.log(`[ZTimer] interval:${zz.getIntervalList()}, settimeout:${zz.getTimeoutList()}`);
		// }, 2000);
	}
	private addLoginCount() {
		let timer = zz.sto.getObject<GameTimerData>(StoKey.gameTimer) || {
			tolTime: 0,
			tolDate: 0,
			lastDate: 0,
			lastTime: 0,
			loginCount: 0,
		};
		timer.loginCount++;
		zz.sto.saveObject<GameTimerData>(StoKey.gameTimer, timer);
	}

	/**记录总游戏时间 */
	private gameTicker() {
		let date = new Date().getDate();
		let timer = zz.sto.getObject<GameTimerData>(StoKey.gameTimer) || {
			tolTime: 0,
			tolDate: 0,
			lastDate: 0,
			lastTime: 0,
			loginCount: 0,
		};
		timer.tolTime++;
		timer.lastTime = Date.now();
		if (date != timer.lastDate) {
			timer.tolDate++;
			timer.lastDate = date;
			zz.model.task.checkRefresh();
		}
		zz.sto.saveObject<GameTimerData>(StoKey.gameTimer, timer);
	}
}
