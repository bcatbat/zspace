import { Dictionary } from '../structures/Index';

function* genId() {
	let a = 1;
	while (true) {
		yield a++;
	}
}
let timeoutIdGen = genId();
let intervalIdGen = genId();
class ZTimeout {
	/**
	 *
	 * @param callback 回调,建议用箭头
	 * @param ms 延时,ms
	 * @param type 计时类型;tick-引擎update;time-时间戳
	 */
	constructor(private callback: Function, ms: number, private type: 'tick' | 'time') {
		this.begTime = Date.now();
		this.dstTime = this.begTime + ms;
		this.callback = callback;
		this.duration = ms / 1000;
		this.id = timeoutIdGen.next().value || 0;
	}
	private id: number = -1;
	getId() {
		return this.id;
	}
	/**(ms) */
	private begTime: number;
	/**(ms) */
	private dstTime: number;
	/**(s) */
	private duration: number;
	private state: 'doing' | 'done' = 'doing';
	private timer: number = 0;
	public update(dt: number) {
		if (this.state == 'doing') {
			switch (this.type) {
				case 'tick':
					this.timer += dt;
					if (this.timer >= this.duration) {
						this.state = 'done';
						this.callback();
					}
					break;
				case 'time':
					if (Date.now() >= this.dstTime) {
						this.state = 'done';
						this.callback();
					}
					break;
			}
		}
	}
}

class ZInterval {
	/**
	 *
	 * @param cb 回调,建议用箭头
	 * @param ms 周期,ms
	 * @param type 计时类型;tick-引擎update;time-时间戳
	 */
	constructor(private cb: Function, ms: number, private readonly type: 'tick' | 'time') {
		this.id = intervalIdGen.next().value || 0;
		this.baseCycle = ms / 1000;
		this.lastTime = Date.now();
		this.nextTime = this.lastTime + this.cycle * 1000;
	}

	private id: number = -1;
	public getId() {
		return this.id;
	}
	/**(s) */
	private baseCycle: number;
	/**(s) */
	get cycle() {
		return this.baseCycle / this.scale;
	}
	private _scale: number = 1;
	/**必须大于0;想暂停就用pause */
	public get scale(): number {
		return this._scale;
	}
	public set scale(v: number) {
		if (v <= 0) v = 0.001;
		// 变更速率时,应保持原本计时进度不变;
		switch (this.type) {
			case 'time':
				// 此处重新计算时间缩放时,应该只缩放剩余时间
				let now = Date.now();
				if (now < this.nextTime) {
					// old left:10s, scale:2
					let leftTime = this.nextTime - now;
					// base left: 20s, scale:1
					let leftBase = leftTime * this._scale;
					// new left: 40s, scale:0.5
					let leftNew = leftBase / v;
					this.nextTime = now + leftNew;
				} else {
					// 已经过去了,这不大会出现吧...不去管它,等着回调
				}
				break;
			case 'tick':
				// b:10s, s:0.5, oldCycle:20s
				let oldCycle = this.baseCycle / this._scale;
				// b:10s, s:2, newCycle:5s
				let newCycle = this.baseCycle / v;
				// old timer:10, rate = 0.5
				let rate = this.timer / oldCycle;
				// new timer:5
				this.timer = newCycle * rate;
				break;
		}
		// 原数有用,最后更新
		this._scale = v;
	}
	/**(ms) */
	private lastTime: number;
	/**(ms) */
	private nextTime: number;
	/**(s) */
	private timer: number = 0;
	private state: 'doing' | 'pause' = 'doing';
	public update(dt: number) {
		if (this.state == 'doing') {
			switch (this.type) {
				case 'tick': // 按照引擎计时走
					this.timer += dt;
					if (this.timer >= this.cycle) {
						this.timer = 0;
						this.cb();
					}
					break;
				case 'time':
					//看广告等引擎计时中断,但现实不中断的情况
					//例如:广告15s;周期1s;
					let now = Date.now();
					if (now >= this.nextTime) {
						this.lastTime = this.nextTime;
						this.nextTime = this.lastTime + this.cycle * 1000;
						this.cb();
					}
					break;
			}
		}
	}

	/**如果type=='time',则暂停和恢复时需要重新计算时间点 */
	private cachePauseTime: number;
	public pause() {
		this.state = 'pause';
		if (this.type == 'time') {
			this.cachePauseTime = Date.now();
		}
	}
	public resume() {
		if (this.state != 'pause') {
			return;
		}
		if (this.type == 'time') {
			let now = Date.now();
			let pauseTime = now - this.cachePauseTime;
			this.lastTime = this.lastTime + pauseTime;
			this.nextTime = this.lastTime + this.cycle * 1000;
		}
		this.state = 'doing';
	}
}

const { ccclass, property } = cc._decorator;
@ccclass
export class ZTimer extends cc.Component {
	update(dt: number) {
		ZTimer.timeoutDict.forEach((id, zt) => {
			zt.update(dt);
		});
		ZTimer.intervalDict.forEach((id, zi) => {
			zi.update(dt);
		});
	}
	//#region timeout
	static timeoutDict: Dictionary<number, ZTimeout> = new Dictionary<number, ZTimeout>();
	static setTimeout(cb: Function, ms: number, type: 'time' | 'tick' = 'time') {
		let t = new ZTimeout(
			() => {
				cb && cb();
				ZTimer.timeoutDict.remove(t.getId());
			},
			ms,
			type
		);
		this.timeoutDict.setValue(t.getId(), t);
		return t.getId();
	}
	static clearTimeout(id: number) {
		this.timeoutDict.remove(id);
	}
	static hasTimeout(id: number) {
		return this.timeoutDict.containsKey(id);
	}
	static getTimeoutList() {
		return this.timeoutDict.keys();
	}
	//#endregion
	//#region interval
	static intervalDict: Dictionary<number, ZInterval> = new Dictionary<number, ZInterval>();
	static setInterval(cb: Function, ms: number, type: 'tick' | 'time' = 'time') {
		let t = new ZInterval(cb, ms, type);
		this.intervalDict.setValue(t.getId(), t);
		return t.getId();
	}
	static hasInterval(id: number) {
		return this.intervalDict.containsKey(id);
	}
	static clearInterval(id: number) {
		this.intervalDict.remove(id);
	}
	static pauseInterval(id: number) {
		this.intervalDict.getValue(id)?.pause();
	}
	static resumeInterval(id: number) {
		this.intervalDict.getValue(id)?.resume();
	}
	static setIntervalScale(id: number, scale: number) {
		if (this.intervalDict.getValue(id)) this.intervalDict.getValue(id).scale = scale;
	}
	static getIntervalList() {
		return this.intervalDict.keys();
	}
	//#endregion
}
