/**
 * @name FullScreen
 * @displayName FullScreen
 * @authorId 748736662560833616
 * @website https://github.com/chaarlie130
 * @source https://raw.githubusercontent.com/chaarlie130/FullScreenDiscord/main/fullscreen.plugin.js
 * @donate https://paypal.me/charlie230?locale.x=en_US
 * @invite uJJeBSjR2g
 */

module.exports = (() => {
	const config = {
		info: {
			name: "FullScreen Discord",
			authors: [
				{
					name: "Charlie",
					discord_id: "748736662560833616",
					github_username: "chaarlie130"
				}
			],
			version: "1.0.0.0",
			description: "Minimizes All discord Text channels, VC's and server tabs.",
			github: "https://raw.githubusercontent.com/chaarlie130/FullScreenDiscord/main/fullscreen.plugin.js",
			github_raw: "https://raw.githubusercontent.com/chaarlie130/FullScreenDiscord/main/fullscreen.plugin.js"
		},
		changelog: [
			{
				title: "Initial Commit",
				type: "added",
				items: [
					"Initial Release version 1.0.0.1"
				]
			}
		]
	};

	return !global.ZeresPluginLibrary ? class {
		constructor() { this._config = config; }
		getName() { return config.info.name; }
		getAuthor() { return config.info.authors.map(a => a.name).join(", "); }
		getDescription() { return config.info.description; }
		getVersion() { return config.info.version; }
		load() {
			BdApi.showConfirmationModal("Library plugin is needed",
				[`The library plugin needed for ${config.info.name} is missing. Please click Download Now to install it.`], {
				confirmText: "Download",
				cancelText: "Cancel",
				onConfirm: () => {
					require("request").get("https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js", async (error, response, body) => {
					if (error) return require("electron").shell.openExternal("https://betterdiscord.net/ghdl?url=https://raw.githubusercontent.com/rauenzi/BDPluginLibrary/master/release/0PluginLibrary.plugin.js");
						await new Promise(r => require("fs").writeFile(require("path").join(BdApi.Plugins.folder, "0PluginLibrary.plugin.js"), body, r));
					});
				}
			});
		}
		start() { }
		stop() { }
	} : (([Plugin, Api]) => {
		const plugin = (Plugin, Api) => {
			const { Settings, PluginUtilities, Patcher } = Api;
			const { SettingPanel, SettingGroup, SettingField, Textbox, Switch } = Settings;

			const buttonName = 'toggleChannels',
				buttonHideName = 'channelsVisible',
				buttonShowName = 'channelsHidden',
				hideElementsName = 'hideElement',
				targetElement = '.container-1r6BKw',
				sidebarName = '.sidebar-2K8pFh';

			return class HideChannels extends Plugin {

				onStart() {
					PluginUtilities.addStyle(config.info.name + 'CSS',
						`
						#toggleChannels { position: absolute; width: 24px; height: 24px; top: 0; left: 8px; bottom: 0; margin: auto 0; background-position: center; background-size: 100%; opacity: 0.8; z-index: 2; cursor: pointer; }
						.theme-dark #toggleChannels.channelsVisible { background-image: url(https://cdn.discordapp.com/avatars/768238743890034698/8a56b5772d21d3184e598ba8a654eb05.png?size=128); }
						.theme-dark #toggleChannels.channelsHidden { background-image: url(https://cdn.discordapp.com/avatars/768238743890034698/8a56b5772d21d3184e598ba8a654eb05.png?size=128); }
						.theme-light #toggleChannels.channelsVisible { background-image: url(https://cdn.discordapp.com/avatars/768238743890034698/8a56b5772d21d3184e598ba8a654eb05.png?size=128); }
						.theme-light #toggleChannels.channelsHidden { background-image: url(https://cdn.discordapp.com/avatars/768238743890034698/8a56b5772d21d3184e598ba8a654eb05.png?size=128); }
						.hideElement { width: 0 !important; }
						.sidebar-2K8pFh .container-3baos1 { transition: 400ms ease all; }
						.sidebar-2K8pFh.hideElement .container-3baos1 { position: absolute; box-sizing: border-box; width: 240px; height: 68px; bottom: 0; margin-bottom: 0; padding: 0 8px; z-index: 2; }
						.sidebar-2K8pFh.hideElement .container-3baos1 { background-color: var(--background-primary); }
						.sidebar-2K8pFh + .chat-3bRxxu .messagesWrapper-1sRNjr + .form-2fGMdU { margin-left: 0; transition: 400ms ease margin-left; }
						.sidebar-2K8pFh.hideElement + .chat-3bRxxu .messagesWrapper-1sRNjr + .form-2fGMdU { margin-left: 240px; }
						.sidebar-2K8pFh, .hideElement { transition: width 400ms ease; }
						.children-19S4PO { padding-left: 24px; }`
					);

					this.renderButton();
					this.addExtras();
				}

				onStop() {
					PluginUtilities.removeStyle(config.info.name + 'CSS');
					Patcher.unpatchAll();

					this.removeExtras();
				}

				onSwitch() {
					const checkButton = document.getElementById(buttonName);

					if (!checkButton) this.renderButton();
				}

				renderButton() {
					const button = document.createElement('div'),
						titleBar = document.querySelector(targetElement),
						settings = this.loadSettings();

					var buttonClass;

					if (settings.HideChannels.channelsHidden == true)
						buttonClass = buttonShowName;
					else
						buttonClass = buttonHideName;

					button.setAttribute('id', buttonName);
					button.setAttribute('class', buttonClass);

					titleBar.append(button);

					let buttonAction = document.getElementById(buttonName);
					buttonAction.addEventListener('click', ()=> this.toggleChannels());

				}

				toggleChannels() {
					const button = document.getElementById(buttonName),
						sidebar = document.querySelector(sidebarName);

					if (button.classList.contains(buttonHideName)) {
						button.setAttribute('class', buttonShowName);
						sidebar.classList.add(hideElementsName);

						this.saveSettings(true);
					} else if (button.classList.contains(buttonShowName)) {
						button.setAttribute('class', buttonHideName);
						sidebar.classList.remove(hideElementsName);

						this.saveSettings(false);
					}
				}

				addExtras() {
					const sidebar = document.querySelector(sidebarName),
						settings = this.loadSettings();

					if (settings.HideChannels.channelsHidden == true) {
						setTimeout(function() {
							sidebar.classList.add(hideElementsName);
						}, 2500);
					}
				}

				removeExtras() {
					const button = document.getElementById(buttonName);
					if (button) button.remove();

					const sidebar = document.querySelector(sidebarName);
					if (sidebar.classList.contains(hideElementsName))
						sidebar.classList.remove(hideElementsName);
				}

				get defaultSettings() {
					return {
						HideChannels: {
							channelsHidden: false
						}
					}
				}

				loadSettings() {
					BdApi.loadData(this.getName(), 'settings');
					var settings = (BdApi.loadData(this.getName(), 'settings')) ? BdApi.loadData(this.getName(), 'settings') : this.defaultSettings;

					return settings;
				}

				saveSettings(status) {
					const settings = this.loadSettings();

					settings.HideChannels.channelsHidden = status;
					BdApi.saveData(this.getName(), 'settings', settings);
				}
			};
		};

		return plugin(Plugin, Api);
	})(global.ZeresPluginLibrary.buildPlugin(config));
})();