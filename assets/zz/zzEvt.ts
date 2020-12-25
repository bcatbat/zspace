class Delegate {
	private callback: Function;
	public get Callback(): Function {
		return this.callback;
	}
	private argArray: any[];
	public get ArgArray(): any[] {
		return this.argArray;
	}
	private isOnce = false;
	public get IsOnce(): boolean {
		return this.isOnce;
	}
	public set IsOnce(v: boolean) {
		this.isOnce = v;
	}
	constructor(callback: Function, argArray: any[], isOnce = false) {
		this.callback = callback;
		this.argArray = argArray;
		this.isOnce = isOnce;
	}
}
export class EventMgr {
	private mEventMap = new Map<string, Map<any, Delegate[]>>();

	public has(eventType: string, caller: any, callback: Function): boolean {
		return !!this.find(eventType, caller, callback);
	}
	public fire(eventType: string, ...argArray: any[]): boolean {
		if (!eventType) {
			console.error('Event eventType is null!');
			return false;
		}
		let delegateList: Delegate[] = [];
		let callerList: any[] = [];
		let eventMap = this.mEventMap.get(eventType);
		if (eventMap) {
			eventMap.forEach((eventList, caller) => {
				for (let delegate of eventList) {
					delegateList.push(delegate);
					callerList.push(caller);
				}
				for (let index = eventList.length - 1; index >= 0; --index) {
					if (eventList[index].IsOnce) {
						eventList.splice(index, 1);
					}
				}
				if (eventList.length <= 0) {
					eventMap.delete(caller);
				}
			});
			if (eventMap.size <= 0) {
				this.mEventMap.delete(eventType);
			}
		}
		let length = delegateList.length;
		for (let index = 0; index < length; index++) {
			let delegate: Delegate = delegateList[index];
			delegate.Callback.call(callerList[index], ...delegate.ArgArray, ...argArray);
		}
		return length > 0;
	}
	public register(eventType: string, caller: any, callback: Function, ...argArray: any[]): void {
		this.addListener(eventType, caller, callback, false, ...argArray);
	}
	public registerOnce(eventType: string, caller: any, callback: Function, ...argArray: any[]): void {
		this.addListener(eventType, caller, callback, true, ...argArray);
	}
	public delRegister(type: string, caller: any, callback: Function, onceOnly?: boolean): void {
		this.removeBy((eventType, listenerCaller, delegate) => {
			if (type && type !== eventType) {
				return false;
			}
			if (caller && caller !== listenerCaller) {
				return false;
			}
			if (callback && callback !== delegate.Callback) {
				return false;
			}
			if (onceOnly && !delegate.IsOnce) {
				return false;
			}
			return true;
		});
	}
	public delAllRegister(caller: any): void {
		this.mEventMap.forEach((eventMap, type) => {
			eventMap.delete(caller);
			if (eventMap.size <= 0) {
				this.mEventMap.delete(type);
			}
		});
	}

	private find(eventType: string, caller: any, callback: Function): Delegate {
		if (!eventType) {
			console.error('Event eventType is null!');
			return null;
		}
		if (!caller) {
			console.error('Caller eventType is null!');
			return null;
		}
		if (!callback) {
			console.error('Listener is null!');
			return null;
		}

		let eventMap: Map<any, Delegate[]>;
		if (this.mEventMap.has(eventType)) {
			eventMap = this.mEventMap.get(eventType);
		} else {
			eventMap = new Map<any, Delegate[]>();
			this.mEventMap.set(eventType, eventMap);
		}
		let eventList: Delegate[];
		if (eventMap.has(caller)) {
			eventList = eventMap.get(caller);
		} else {
			eventList = [];
			eventMap.set(caller, eventList);
		}

		for (let delegate of eventList) {
			if (delegate.Callback === callback) {
				return delegate;
			}
		}
		return null;
	}
	private addListener(eventType: string, caller: any, callback: Function, isOnce: boolean, ...argArray: any[]): void {
		let delegate = this.find(eventType, caller, callback);
		if (delegate) {
			delegate.IsOnce = isOnce;
			console.error('Listener is already exist!');
		} else {
			let delegate = new Delegate(callback, argArray, isOnce);
			this.mEventMap.get(eventType).get(caller).push(delegate);
		}
	}
	private removeBy(predicate: (eventType: string, caller: any, delegate: Delegate) => boolean): void {
		if (!predicate) {
			return;
		}
		this.mEventMap.forEach((eventMap, eventType) => {
			eventMap.forEach((eventList, caller) => {
				for (let index = eventList.length - 1; index >= 0; --index) {
					let delegate = eventList[index];
					if (predicate(eventType, caller, delegate)) {
						eventList.splice(index, 1);
					}
				}
				if (eventList.length <= 0) {
					eventMap.delete(caller);
				}
			});
			if (eventMap.size <= 0) {
				this.mEventMap.delete(eventType);
			}
		});
	}
}