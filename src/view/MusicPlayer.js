export const ALL_TRACKS = ["ExoMusicIntro", "ExoMusicLoop"];

const VOLUME = 1.0;

export class MusicPlayer {

	constructor(game) {
		this.game = game;
		this.currentTrack = null;
		this.musicQ = [];
		this.tracks = {};
		// localData.onMusicVolumeChange.add(this.onMusicVolumeChange, this);
	}

	init() {
		for (const track of ALL_TRACKS) {
			this.tracks[track] = this.game.sound.add(track, VOLUME, true);
		}
	}

	play(track, immediate) {
		if (immediate === false && this.game_music) {
			console.log("Added to Q: ", track);
			this.musicQ.push(track);
			return;
		}
		else if (this.currentTrack === track) {
			// already playing
			return;
		}
		else {
			this.musicQ = [];
			this.playImmediate(track);
		}
	}

	playImmediate(track) {
		console.log("Starting track: ", track);
		this.stop();
		this.currentTrack = track;
		this.game_music = this.tracks[track];
		this.game_music.volume = 1.0;//(localData.musicVolume / 100);
		this.game_music.play({ loop: true });
		this.game_music.on('looped', () => this.onLoop());
	}

	onLoop() {
		console.log ("Loop!!!");
		if (this.musicQ.length > 0) {
			let track = this.musicQ.shift();
			this.playImmediate(track);
		}
	}

	stop() {
		if (this.game_music) {
			this.game_music.stop();
			// this.game_music.onLoop.removeAll();
			this.game_music = null;
		}
	}

	// expected range 0-100
	onMusicVolumeChange(vol) {
		if (this.game_music) {
			this.game_music.volume = (vol / 100);
		}
	}

}