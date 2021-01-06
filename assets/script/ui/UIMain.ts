import { UIEnum } from '../const/UIParams';

import { zz } from '../zz';

const { ccclass, property } = cc._decorator;

@ccclass
export default class UIMain extends zz.UIBase {
	onOpen(args: any[]) {
		zz.sdk.hideBanner();
	}
}
