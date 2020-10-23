import { UIEnum } from '../constValue/UIParams';

const { ccclass, property } = cc._decorator;

@ccclass
export default class ProcGame extends zz.ProcBase {
  onStart() {
    zz.log('[Procedure] Game, onStart');
    zz.ui.openUI({ uiName: UIEnum.UITestNormal });
    zz.scene.loadScene('SceneMain', 'scene');
  }
  onLeave() {
    zz.log('[Procedure] Game, onLeave');
  }
}
