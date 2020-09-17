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
  onLoad() {
    this.initZZ();    
  }

  private initZZ() {
    zMdl = new ModelMgr();
    zz.event.fire(EventType.LoadingPage, true, 0, ConstText.loading_table);
    console.time('initZZ');    
    zz.ui.setUIParams(uiParams);
    zz.ui.setProgressFn((isShow: boolean, prog: number, des: string) => {
      zz.event.fire(EventType.LoadingPage, isShow, prog, des);
    });
    zz.proc.setProcedure(ProcEnum.Config, new ProcConfig());
    zz.proc.setProcedure(ProcEnum.Load, new ProcLoad());
    zz.proc.setProcedure(ProcEnum.Res, new ProcRes());
    zz.proc.setProcedure(ProcEnum.Platform, new ProcPlatform());
    zz.proc.setProcedure(ProcEnum.Game, new ProcGame());
    console.timeEnd('initZZ');
    zz.proc.init(ProcEnum.Config);
  }
}
