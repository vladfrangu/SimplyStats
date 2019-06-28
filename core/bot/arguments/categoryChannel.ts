import { Argument, Possible, KlasaMessage } from 'klasa';

export default class extends Argument {
	async run(arg: string, possible: Possible, message: KlasaMessage) {
		const channel = (this.constructor as typeof Argument).regex.channel.test(arg) ? await this.client.channels.fetch((this.constructor as typeof Argument).regex.channel.exec(arg)![1]).catch(() => null) : null;
		if (channel && channel.type === 'category') return channel;
		throw message.language.get('RESOLVER_INVALID_CHANNEL', possible.name);
	}
}
