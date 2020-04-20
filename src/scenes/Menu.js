import Phaser from 'phaser';
import { openDialog } from '../components/Dialog';

export default class extends Phaser.Scene {
	constructor () {
		super({ key: 'MenuScene' });
	}

	create() {
		this.ready = false;
		document.getElementById("credits_button").addEventListener('click', () => {
			openDialog(`
			<h1>Exo Keeper</h1>
			<p>
			Exo Keeper is a game about surviving and thriving on an exo-planet.
			<p>
			Exo Keeper was made in just 72hours for the <a href="https://ldjam.com/events/ludum-dare/46/">Ludum Dare 46</a> Game Jam. The theme of LD46 was:
			<blockquote>
			<b>Keep it alive</b>
			</blockquote>
			<p>Authors:</p>
			<dl>
			<dd><a href="https://twitter.com/mpvaniersel">Amarillion</a> (Code)
			<dd><a href="https://github.com/gekaremi">Gekaremi</a> (Design)
			<dd><a href="https://www.instagram.com/l_p_kongroo">Tatiana Kondratieva</a> (Art)
			<dd><a href="http://www.dodonoghue.com/">Dónall O'Donoghue</a> (Music)
			</dl>
			`);
			
		});
		document.getElementById("start_game_button").addEventListener('click', () => {
			document.getElementById("menu").style.display = 'none';
			document.getElementById("wrapper").style.display = 'block';
			this.scene.start('GameScene');
		});
	}

}

