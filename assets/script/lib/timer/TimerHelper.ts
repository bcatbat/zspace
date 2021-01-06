import { ZTimer } from './ZTimer';

export function setTimeout(cb: Function, ms: number, type: 'time' | 'tick' = 'time') {
	return ZTimer.setTimeout(cb, ms, type);
}
export function clearTimeout(id: number) {
	ZTimer.clearTimeout(id);
}
export function hasTimeout(id: number) {
	return ZTimer.hasTimeout(id);
}
export function getTimeoutList() {
	return ZTimer.getTimeoutList();
}
export function setInterval(cb: Function, ms: number, type: 'tick' | 'time' = 'time') {
	return ZTimer.setInterval(cb, ms, type);
}
export function hasInterval(id: number) {
	return ZTimer.hasInterval(id);
}
export function clearInterval(id: number) {
	ZTimer.clearInterval(id);
}
export function pauseInterval(id: number) {
	ZTimer.pauseInterval(id);
}
export function resumeInterval(id: number) {
	ZTimer.resumeInterval(id);
}
export function setIntervalScale(id: number, scale: number) {
	ZTimer.setIntervalScale(id, scale);
}
export function getIntervalList() {
	return ZTimer.getIntervalList();
}
