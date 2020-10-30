import { UIEnum, uiParams } from './constValue/UIParams';
import { ProcEnum } from './procedures/ProcEnum';
import ProcConfig from './procedures/ProcConfig';
import ProcLoad from './procedures/ProcLoad';
import ProcRes from './procedures/ProcRes';
import ProcPlatform from './procedures/ProcPlatform';
import ProcGame from './procedures/ProcGame';
import { EventType } from './constValue/EventType';
import { ConstText } from './constValue/ConstText';

const { ccclass, property } = cc._decorator;
@ccclass
export default class GameEntry extends cc.Component {
  /**场景唯一根节点;*/
  @property(cc.Node) sceneRoot: cc.Node = undefined;
  /**UI唯一根节点;*/
  @property(cc.Node) uiRoot: cc.Node = undefined;
  onLoad() {
    this.initZZ();
  }

  /**初始化架子 */
  private initZZ() {
    this.initHelper();
    zz.loadingPage(true, 0, ConstText.loading_table);
    this.initUI();
    this.initScene();
    this.initProcedure();
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

  /**初始化scene层; 场景统一放置在uiScene之下, 坐标与世界统一,无需转换;*/
  private initScene() {
    zz.scene.setSceneRoot(this.sceneRoot);
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
}
