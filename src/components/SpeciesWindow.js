import { START_SPECIES } from "../sim/StartSpecies";
import { openDialog } from "./Dialog";

const BIOTOPE_IMAGES = {
	0:'./assets/images/biotope/sorry_sulfuric2.png',
	1:'./assets/images/biotope/mountain3.png',
	2:'./assets/images/biotope/sulfur4.png',
	3:'./assets/images/biotope/lava1.png',
	4:'./assets/images/biotope/canyon1.png',
	5:'./assets/images/biotope/lowland0.png',
	6:'./assets/images/biotope/salt4.png',
	7:'./assets/images/biotope/canyon2.png',
};

class SpeciesWindow extends HTMLElement {

	constructor() {
		super();
		this.attachShadow({ mode: 'open' });
		this.selectedSpecies = null;
		this._introduceSpeciesCallback = () => {};

		this.shadowRoot.innerHTML = `
	<style>
		.main {
			position: relative;
			height: 100%;
			display: grid;
			grid-template: auto 1fr auto / 1fr;
		}
				
		img {
			align: center;
		}
		
		#text {
			background: white;
			margin: 10px;
			overflow: auto;
		}

		button {
			width: 200px;
			margin: 8px;
		}

	.palette-container {
		display: inline-block;
	}

	.palette-span {
		
		border: 3px solid #4CAF50; /* Green */
		background: #777700;
		display: inline-block;
		margin: 8px;
		padding: 8px;
		
		border-radius: 6px;
		text-decoration: none;
		font-size: 16px;
		box-sizing: border-box;
		transition: 0.1s;
		overflow: hidden;
		
		/* prevent text selection on buttons*/
		-moz-user-select: none; 
		-webkit-user-select: none; 
		-ms-user-select:none; 
		user-select:none;
	}

	.palette-container input { 
		display: none; 
	}

	input.species-input:checked + .palette-span {
		background-color: #4CAF50;
		transform: translateY(4px);
	}

	input.species-input:disabled + .palette-span {
		border: 3px solid #777777;
		background-color: #444444;
	}

	input.species-input + .palette-span:hover {
		background-color: #5CBF60; /* Green */
		color: white;
	}

	</style>

	<div class="main">
		<div class="buttonBar">

		${START_SPECIES.map((info, idx) => this.createButton(idx, info.iconUrl)).join('')}

		</div>	
		<div id="text">
		</div>
		<div>
			<button id="speciesButton">Introduce species</button>
			<button id="infoButton">Info...</button>
		</div>
	</div>
`;
	}
	
	createButton(value, imageUrl) {
		return `<label class="palette-container">
				<input 
					id="species_${value}"
					class="species-input" 
					name="species-group" 
					type="radio" 
					value="${value}">
					<span class="palette-span">
						<img src="${imageUrl}">
					</span>
				</input>
			</label>`;
	}

	set introduceSpeciesCallback(val) {
		this._introduceSpeciesCallback = val;
	}

	connectedCallback() {
		this.shadowRoot.querySelectorAll('input').forEach((elt) => {
			elt.addEventListener("click", (event) => {
				this.selectedSpecies = event.target.value;

				const info = START_SPECIES[this.selectedSpecies];
				const text = `<dl>
				<dd>albedo: ${info.albedo}
				<dd>Temp range: ${info.temperatureRange[0]}-${info.temperatureRange[1]} K
				<dd>Likes: ${Object.entries(info.biotopeTolerances).filter(([k, v]) => v > 0.5).map(([k, v]) => `<img src="${BIOTOPE_IMAGES[k]}">`).join('')}
				<dd>Dislikes: ${Object.entries(info.biotopeTolerances).filter(([k, v]) => v < 0.5).map(([k, v]) => `<img src="${BIOTOPE_IMAGES[k]}">`).join('')}
				</dl>`;
				this.shadowRoot.getElementById('text').innerHTML = text;
			});
		});
		
		this.shadowRoot.querySelector("#speciesButton").addEventListener("click", (event) => { 
			console.log("Introduce species");
			if (this.selectedSpecies !== null) {
				this._introduceSpeciesCallback(this.selectedSpecies);
			}
		});

		this.shadowRoot.querySelector("#infoButton").addEventListener("click", (event) => { 
			if (this.selectedSpecies !== null) {
				const info = START_SPECIES[this.selectedSpecies];
				openDialog(`<h1>Species Information</h1>
				<img src="${info.coverArt}" style="width: 50%; float: left;	padding: 10px;">
				<p>
				${info.backstory}
				</p>
				<dl>
				<dd>albedo: ${info.albedo}
				<dd>Temp range: ${info.temperatureRange[0]}-${info.temperatureRange[1]} K
				<dd>Likes: ${Object.entries(info.biotopeTolerances).filter(([k, v]) => v > 0.5).map(([k, v]) => `<img src="${BIOTOPE_IMAGES[k]}">`).join('')}
				<dd>Dislikes: ${Object.entries(info.biotopeTolerances).filter(([k, v]) => v < 0.5).map(([k, v]) => `<img src="${BIOTOPE_IMAGES[k]}">`).join('')}
				</dl>
				`);
			}
		});

	}

	enableSpecies(val) {
		const relevantInput = this.shadowRoot.getElementById(`species_${val}`);
		relevantInput.disabled = false;
	}

	disableSpecies(val) {
		const relevantInput = this.shadowRoot.getElementById(`species_${val}`);
		relevantInput.disabled = true;
		relevantInput.checked = false;
		this.selectedSpecies = null;
	}

}

customElements.define('exo-species-window', SpeciesWindow);
