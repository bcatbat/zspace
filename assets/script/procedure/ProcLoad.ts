import { zz } from '../zz';
import { ProcEnum } from './ProcEnum';

export default class ProcLoad extends zz.ProcedureBase {
	async onStart() {
		zz.log('[Procedure] Load, onStart');
		let subs = ['audio', 'ui'];
		for (let i = 0, len = subs.length; i < len; i++) {
			await new Promise<cc.AssetManager.Bundle>((resolve, reject) => {
				cc.assetManager.loadBundle(subs[i], (err, bundle) => {
					zz.loadingPage(true, i / subs.length, '加载分包');
					err ? reject(err) : resolve(bundle);
				});
			});
		}

		this.LoadTables();
	}
	onLeave() {
		zz.log('[Procedure] Load, onLeave');
	}

	async LoadTables() {
		await zz.table.loadConfigs('configs', { closeLoadingOnFinish: false, showLoading: true });
		this.LoadTableComplete();
	}

	/**
	 * 加载Json配置表结果事件
	 * @param isSuccess 是否成功
	 * @param tableName 数据类名称
	 * @param args 透传参数
	 */
	LoadTableComplete() {
		/**model之间相互依赖,没有什么好办法解决,做好顺序规划 */
		zz.model.loadData();
		zz.proc.changeProcedure(ProcEnum.Res);
	}
}
