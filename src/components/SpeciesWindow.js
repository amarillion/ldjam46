import { START_SPECIES } from "../sim/StartSpecies";

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
		}

		#speciesButton {
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
			Lorem ipsum...
		</div>
		<button id="speciesButton">Introduce species</button>
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
				const text = `${info.backstory}\nalbedo: ${info.albedo}\nTemp range: ${info.temperatureRange[0]}-${info.temperatureRange[1]} K`;
				this.shadowRoot.getElementById('text').innerText = text;
			});
		});
		
		this.shadowRoot.querySelector("#speciesButton").addEventListener("click", (event) => { 
			console.log("Introduce species");
			if (this.selectedSpecies !== null) {
				this._introduceSpeciesCallback(this.selectedSpecies);
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
