export abstract class UIBase extends cc.Component {
    /**
     * 在onLoad之后调用; 代替onLoad使用; 注意无法重置; 由于无法确保调用一次, 事件注册不宜置于此;
     * @param args 参数列表
     */
    onOpen(args: any[]): void { }
    /**代替onDestroy使用 */
    onClose(): void { }

    /**代替onDiable使用 */
    onHide(): void { }
    /**代替onEnable使用 */
    onShow(): void { }
}
