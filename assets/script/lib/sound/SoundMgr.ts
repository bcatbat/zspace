import { error } from '../log/Log';
import { MultiDictionary } from '../structures/Index';
import { getBundle } from '../utils/Utils';

export class SoundMgr {
	dict_clip: Map<string, cc.AudioClip> = new Map<string, cc.AudioClip>();
	dict_soundId: MultiDictionary<string, number> = new MultiDictionary<string, number>();
	dict_musicID: MultiDictionary<string, number> = new MultiDictionary<string, number>();
	dict_flag: Map<string, number> = new Map<string, number>();

	private soundVolume: number = 1.0;
	set SoundVolume(volume: number) {
		this.soundVolume = volume;
		cc.audioEngine.setEffectsVolume(volume);
	}
	get SoundVolume() {
		return this.soundVolume;
	}
	private musicVolume: number = 0.5;
	set MusicVolume(volume: number) {
		this.musicVolume = volume;
		cc.audioEngine.setMusicVolume(volume);
	}
	get MusicVolume() {
		return this.musicVolume;
	}

	private _isMusicOn: boolean = true;
	/**音乐开关 */
	public get isMusicOn(): boolean {
		return this._isMusicOn;
	}
	public set isMusicOn(v: boolean) {
		if (v == false) {
			this.stopMusic();
		}
		this._isMusicOn = v;
	}
	private _isSoundOn: boolean = true;
	/**音效开关 */
	public get isSoundOn(): boolean {
		return this._isSoundOn;
	}
	public set isSoundOn(v: boolean) {
		if (!v) {
			this.stopAllSounds();
		}
		this._isSoundOn = v;
	}
	private _isAllOn: boolean = true;
	/**声音是否打开 */
	public get isAllOn(): boolean {
		return this._isAllOn;
	}
	public set isAllOn(v: boolean) {
		this._isAllOn = v;
		if (!v) {
			this.stopAllSounds();
			this.stopMusic();
		}
	}

	async playSound(soundName: string, loop: boolean = false) {
		if (!this.isAllOn) {
			return;
		}
		if (!this.isSoundOn) {
			return;
		}
		this.dict_flag.set(soundName, 1);
		if (this.dict_clip.has(soundName)) {
			let clip = this.dict_clip.get(soundName);
			let soundID = cc.audioEngine.playEffect(clip, loop);
			this.dict_soundId.setValue(soundName, soundID);
			cc.audioEngine.setFinishCallback(soundID, () => {
				if (!loop || !this.dict_flag.get(soundName)) {
					this.dict_soundId.remove(soundName, soundID);
				}
			});
		} else {
			let bundle = await getBundle('audio');
			bundle.load(soundName, cc.AudioClip, (err, clip: cc.AudioClip) => {
				if (this.dict_clip.get(soundName)) return;
				if (!this.dict_flag.get(soundName)) return;
				this.dict_clip.set(soundName, clip);
				let soundID = cc.audioEngine.playEffect(clip, loop);
				this.dict_soundId.setValue(soundName, soundID);
				cc.audioEngine.setFinishCallback(soundID, () => {
					if (!loop || !this.dict_flag.get(soundName)) {
						this.dict_soundId.remove(soundName, soundID);
					}
				});
			});
		}
	}

	async playMusic(musicName: string, loop: boolean = true) {
		if (!this.isAllOn) {
			return;
		}
		if (!this.isMusicOn) {
			return;
		}
		if (this.dict_musicID.containsKey(musicName)) {
			return;
		}
		if (this.dict_clip.has(musicName)) {
			let clip = this.dict_clip.get(musicName);
			let id = cc.audioEngine.playMusic(clip, loop);
			this.dict_musicID.setValue(musicName, id);
			cc.audioEngine.setFinishCallback(id, () => {
				if (!loop) {
					this.dict_musicID.remove(musicName, id);
				}
			});
		} else {
			try {
				let bundle = await getBundle('audio');
				bundle.load(musicName, cc.AudioClip, (err: Error, clip: cc.AudioClip) => {
					if (err) {
						error(err);
						return;
					}
					if (this.dict_clip.has(musicName)) return;
					this.dict_clip.set(musicName, clip);
					let id = cc.audioEngine.playMusic(clip, loop);
					this.dict_musicID.setValue(musicName, id);
					cc.audioEngine.setFinishCallback(id, () => {
						if (!loop) {
							this.dict_musicID.remove(musicName, id);
						}
					});
				});
			} catch (err) {
				error(err);
			}
		}
	}
	/**切换音乐; 模拟的渐变切换; 替换PlayMusic使用*/
	changeMusic(musicName: string, loop: boolean = true, inTime: number = 1, outTime: number = 1) {
		let iTime = inTime;
		let oTime = outTime;
		let it = 0.1;
		let iLen = iTime / it;
		let oLen = oTime / it;
		let volLmt = this.musicVolume;
		let iVolIt = volLmt / iLen;
		for (let i = 0; i < iLen; i++) {
			setTimeout(() => {
				cc.audioEngine.setMusicVolume(volLmt - iVolIt * i);
			}, i * it * 1000);
		}
		setTimeout(() => {
			this.stopMusic();
			this.playMusic(musicName, loop);
		}, iTime * 1000);
		let oVolIt = volLmt / oLen;
		for (let i = 0; i < oLen; i++) {
			setTimeout(() => {
				cc.audioEngine.setMusicVolume(oVolIt * i);
			}, (i * it + iTime) * 1000);
		}
	}
	stopSound(soundName: string) {
		this.dict_flag.set(soundName, 0);
		if (this.dict_soundId.containsKey(soundName)) {
			this.dict_soundId.getValue(soundName).forEach(v => {
				cc.audioEngine.stopEffect(v);
			});
			this.dict_soundId.remove(soundName);
		}
	}
	stopMusic() {
		cc.audioEngine.stopMusic();
		this.dict_musicID.clear();
	}
	stopAllSounds() {
		cc.audioEngine.stopAllEffects();
		this.dict_soundId.keys().forEach(v => {
			this.dict_flag.set(v, 0);
		});
		this.dict_soundId.clear();
	}
	releaseSound(soundName: string) {
		this.stopSound(soundName);
		if (this.dict_clip.has(soundName)) {
			this.dict_clip.delete(soundName);
		}
		getBundle('audio').then(bundle => {
			bundle.release(soundName);
		});
	}
}
