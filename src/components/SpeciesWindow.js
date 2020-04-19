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

	input.species-input + .palette-span:hover {
		background-color: #5CBF60; /* Green */
		color: white;
	}

	</style>

	<div class="main">
		<div class="buttonBar">
			
		${this.renderButton(0, './assets/images/species/plant0.png')}
		${this.renderButton(1, './assets/images/species/herbivore0.png')}
		${this.renderButton(2, './assets/images/species/fungi0.png')}
		${this.renderButton(3, './assets/images/species/plant1.png')}
			
		</div>	
		<div id="text">
			Lorem ipsum...
		</div>
		<button id="speciesButton">Introduce species</button>
	</div>
`;
	}
	
	renderButton(value, imageUrl) {
		return `<label class="palette-container">
				<input 
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
		console.log("connected callback");

		this.shadowRoot.querySelectorAll('input').forEach((elt) => {
			elt.addEventListener("click", (event) => {
				console.log(`Selected species ${event.target.value}`, { event }); 
				this.selectedSpecies = event.target.value;
				this.shadowRoot.getElementById('text').innerText = `Flavour text about species ${this.selectedSpecies}`;
			});
		});
		
		this.shadowRoot.querySelector("#speciesButton").addEventListener("click", (event) => { 
			console.log("Introduce species");
			if (this.selectedSpecies !== null) {
				this._introduceSpeciesCallback(this.selectedSpecies);
			}
		});
	}
 
}

customElements.define('exo-species-window', SpeciesWindow);
