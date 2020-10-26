import { UIEnum, uiParams } from './constValue/UIParams';
import ModelMgr from './manager/ModelMgr';
import { ProcEnum } from './procedures/ProcEnum';
import ProcConfig from './procedures/ProcConfig';
import ProcLoad from './procedures/ProcLoad';
import ProcRes from './procedures/ProcRes';
import ProcPlatform from './procedures/ProcPlatform';
import ProcGame from './procedures/ProcGame';
import { EventType } from './constValue/EventType';
import { ConstText } from './constValue/ConstText';

export let zMdl: ModelMgr = undefined;

const { ccclass, property } = cc._decorator;
@ccclass
export default class GameEntry extends cc.Component {
  @property(cc.Node) sceneRoot: cc.Node = undefined;
  @property(cc.Node) uiRoot: cc.Node = undefined;
  onLoad() {
    this.initZZ();
  }

  private initZZ() {
    zz.event.fire(EventType.LoadingPage, true, 0, ConstText.loading_table);
    zz.setTipFn(msg => {
      zz.event.fire(EventType.Tip, msg);
    });
    // 注入模块
    zMdl = new ModelMgr();
    // 初始化ui层
    zz.ui.setUIParams(uiParams);
    zz.ui.setUIRoot(this.uiRoot);
    // 初始化scene层
    zz.scene.setSceneRoot(this.sceneRoot);
    // pipeline开启
    zz.ui.setProgressFn((isShow: boolean, prog: number, des: string) => {
      zz.event.fire(EventType.LoadingPage, isShow, prog, des);
    });
    zz.proc.setProcedure(ProcEnum.Config, new ProcConfig());
    zz.proc.setProcedure(ProcEnum.Load, new ProcLoad());
    zz.proc.setProcedure(ProcEnum.Res, new ProcRes());
    zz.proc.setProcedure(ProcEnum.Platform, new ProcPlatform());
    zz.proc.setProcedure(ProcEnum.Game, new ProcGame());
    zz.proc.init(ProcEnum.Config);

    let nd = this.node.findCom(cc.Camera, 'SceneRoot', 'Main Camera');
    zz.log(nd);
  }
}
