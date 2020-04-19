class SpeciesWindow extends HTMLElement {

	constructor() {
		super();
		this.attachShadow({ mode: 'open' });
		this.shadowRoot.innerHTML = `
	<style>
		.main {
			position: relative;
			height: 100%;
			display: grid;
			grid-template: auto 1fr auto / 1fr;
		}
		
		.buttonBar div {
			border: 1px solid white;
			width: 64px;
			background: #777700;
			border-radius: 5px;
			display: inline-block;
			margin: 8px;
		}
		img {
			align: center;
		}
		
		.text {
			background: white;
			margin: 10px;
		}

		#speciesButton {
			width: 200px;
			margin: 8px;
		}
	</style>

	<div class="main">
		<div class="buttonBar">
			<div role='button' id='species0'><img src='./assets/images/species/fungi0.png'></div>
			<div role='button' id='species1'><img src='./assets/images/species/herbivore0.png'></div>
			<div role='button' id='species2'><img src='./assets/images/species/plant0.png'></div>
			<div role='button' id='species3'><img src='./assets/images/species/plant1.png'></div>
		</div>
		<div class="text">
			Lorem ipsum...
		</div>
		<button id="speciesButton">Introduce species</button>
	</div>
`;
	}

	connectedCallback() {
		console.log("connected callback");
		this.shadowRoot.querySelector("#species0").addEventListener("click", (event) => { console.log("Selected species 0"); });
		this.shadowRoot.querySelector("#speciesButton").addEventListener("click", (event) => { console.log("Introduce species"); });
	}
 
}

customElements.define('exo-species-window', SpeciesWindow);

