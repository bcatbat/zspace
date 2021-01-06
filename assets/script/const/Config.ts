/**阿里云地址 */
const url_yun_ali = 'https://file.huizhimob.com';
/**腾讯云地址 */
const url_yun_tx = 'https://file1.huizhimob.com';

const url_file = url_yun_ali;

const folder_name = 'school';

const url_config_base = url_file + '/file/game/' + folder_name;

const versionDate = 20210104;
export const Config = {
	/**游戏名称 */
	folderName: folder_name,
	/**体力地址 */
	urlConfigPower: url_config_base + `/powercfg_${versionDate}.json` + '?t=' + Date.now(),
	/**分享图片 */
	urlShareImage: url_config_base + '/share.png',
	/**录屏分线主题 */
	topicRecoreShare: ['学校模拟器'],
	/**分享主题 */
	titleShare: '新学期开始啦~~~开不开心~~~',
	powerData: {
		/**新人赠送 */
		incNewbee: 20,
		/**关卡开始扣除 */
		decMissionStart: 1,
		/**关卡查看提示扣除 */
		decMissionHint: 2,
		/**关卡跳过消耗 */
		decMissionSkip: 2,

		/**每日登陆奖励 */
		incLogin: 4,
		/**视频奖励 */
		incVideo: 4,
		/**录屏奖励 */
		incRecord: 4,
		/**分享奖励 */
		incShare: 4,
		/**视频分享话题 */
		topics: ['学校模拟器'],
		/**抖音剪贴板 */
		cliptxt: '',
		isPlatTrickOn: {
			qq: 0,
			wx: 0,
			oppo: 0,
			vivo: 0,
		},
		/**hz统计 */
		isPlatHzStatOn: {
			wx: 1,
			qq: 1,
			tt: 1,
			oppo: 0,
			vivo: 0,
		},
		isPlatRedpacketOn: {
			wx: 0,
			qq: 0,
			tt: 0,
			oppo: 0,
			vivo: 0,
			android: 0,
		},
		isPlatDeskTopOn: {
			qq: 0,
			wx: 1,
			oppo: 1,
			vivo: 1,
		},
	},
	cheat: false,
    /**全局flag;配置文件拉取完毕 */
	requestOver: false,
};
