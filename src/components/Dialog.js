class Dialog extends HTMLElement {

	constructor() {
		super();
		this.attachShadow({ mode: 'open' });

		this.shadowRoot.innerHTML = `
		<style>
			.Backdrop {
				background: #666;
				height: 100%;
				z-index: 1000;
				width: 100%;
			}

			.Container {
				height: 100%;
				width: 100%;
				display: flex;
				align-items: center;
				justify-content: center;

				position: fixed;
				bottom: 0px;
				z-index: 1001;
				opacity: 1;
			}

			.Dialog {
				background: #fff;
				border: 1px solid #dedede;

				font-family: Helvetica,Tahoma,Arial,sans-serif;
				font-size: 14px;
				line-height: 1.4;

				max-width: 80%;
				max-height: 80%;
			}
		
			div {
				margin: 0;
				padding: 0;
				text-align: left;
			}
		
			.Dialog_Body {
				overflow: hidden auto;
				-webkit-overflow-scrolling: touch;
				color: #44484a;
				margin: 10px;
				padding: 20px;
				padding-left: 20px;
				min-height: 64px;
				min-width: 128px;
			}

			.Dialog_Buttons {
				text-align: right;
				padding: 10px 5px 10px 10px;
			}

			.Dialog_Buttons a:hover {
				background: #224467;
				color: #fff;
			}

			.Dialog_Buttons a {
				display: inline-block;
				white-space: nowrap;
				zoom: 1;
				*display: inline;
				background: #516270;
				color: #fff;
				font-weight: 700;
				margin-right: 5px !important;
				min-width: 60px;
				padding: 10px 15px;
				text-align: center;
				text-decoration: none;
			}
			
			.Dialog * {
				-moz-box-sizing: content-box !important;
				-webkit-box-sizing: content-box !important;
				box-sizing: content-box !important;
			}
		</style>
	
		<div class="Backdrop" style="position: fixed; left: 0px; top: 0px; opacity: 0.9;"></div>

		<div class="Container">
			<div class="Dialog">
				<div class="Dialog_Body">
					<slot></slot>
				</div>
				<div class="Dialog_Buttons">
					<a href="javascript:void(0)" id="Dialog_Button_0">Ok</a>
				</div>
			</div>
		</div>
	`;

		this.shadowRoot.getElementById('Dialog_Button_0').addEventListener('click', (evt) => { 
			// remove <exo-dialog> from parent.
			this.remove();
		});
	}

}

customElements.define('exo-dialog', Dialog);

export function openDialog(contentsHtml) {
	const dialog = document.createElement('exo-dialog');
	dialog.innerHTML = contentsHtml;
	document.body.appendChild(dialog);
}