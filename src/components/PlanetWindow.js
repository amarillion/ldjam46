class PlanetWindow extends HTMLElement {

	constructor() {
		super();
		this.attachShadow({ mode: 'open' });
	}
 
	set text(val) {
		this.shadowRoot.innerHTML = `
	<style>
		pre {
			overflow: hidden;
		}
	</style>

	<pre>${val}</pre>
`;
	}

}

customElements.define('exo-planet-window', PlanetWindow);

