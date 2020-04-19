class SpeciesWindow extends HTMLElement {

	constructor() {
		super();
		this.attachShadow({ mode: 'open' });

		this.shadowRoot.innerHTML = '<p>Species <b>Window</b></p>';
	}
 
}

customElements.define('exo-species-window', SpeciesWindow);

