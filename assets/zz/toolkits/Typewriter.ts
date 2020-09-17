const { ccclass, property } = cc._decorator;

@ccclass
export default class Typewriter extends cc.Component {

    public interval: number = 0.3;
    private curLab: cc.Label = null;
    private curStr: string = null;
    private cnt: number = 0;
    private isTyping: boolean = true;

    startTyping(interval: number) {
        this.interval = interval
        this.curLab = this.node.getComponent(cc.Label);
        this.curStr = this.curLab.string;
        this.curLab.string = '';
        this.isTyping = true;
        this.schedule(this.addWord, this.interval, this.curStr.length);
    }

    private addWord() {
        this.curLab.string += this.curStr.substr(this.cnt, 3);
        this.cnt += 3;
        if (this.cnt == this.curStr.length - 3) {
            this.curLab.string = this.curStr;
            this.destroy();
        }
    }

    onDisable() {
        if (this.isTyping && this.curLab) {
            this.curLab.string = this.curStr;
            this.destroy();
        }
    }

    finishAtOnce() {
        this.unschedule(this.addWord);
        if (this.node) this.curLab.string = this.curStr;        
        this.destroy();
    }
}