import { Event } from 'klasa';

export default class extends Event {
	event = 'klasaReady';
	once = true;

	async run() {
		for (const command of ['invite', 'blacklist', 'conf', 'userconf', 'stats'])
			this.client.commands.get(command).unload();
		if (process.env.NODE_ENV === 'production')
			this.client.commands.get('eval').unload();
	}
}
