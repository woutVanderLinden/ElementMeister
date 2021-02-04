'use strict';

const server = require('../server.js');

const helpTopics = {
	commands: 'commands.html',
	intro: 'intro.html',
	wifi: 'wifi.html',
};

const REPO_URL = 'https://github.com/bumbadadabum/Kid-A';

module.exports = {
	commands: {
		help: {
			permission: 1,
			async action(message) {
				if (!message) return this.reply("Usage: ``.help <topic>``. Available help topics: " + Object.keys(helpTopics).join(', '));
				message = toId(message);
				if (!(message in helpTopics)) return this.pmreply("Invalid option for topic.");

				return this.reply(server.url + helpTopics[message]);
			},
		},
		git: {
			permission: 1,
			async action() {
				return this.reply("Source code for Kid A: " + REPO_URL);
			},
		},
		data: {
			requireRoom: true,
			async action() {
				if ((await this.data.keys(`*:${this.room}`)).length) {
					let fname = `${this.room}/data`;
					if (ChatHandler.privateRooms.has(this.room)) {
						if (!this.canUse(1)) return this.pmreply("Permission denied.");
						let data = {};
						data[this.room] = true;
						let token = server.createAccessToken(data, 15);
						fname += `?token=${token}`;
					}
					if (this.canUse(1)) {
						return this.reply(`Chat data: ${server.url}${fname}`);
					}

					return this.pmreply(`Chat data: ${server.url}${fname}`);
				}

				return this.reply("This room has no data.");
			},
		},
	},
};
