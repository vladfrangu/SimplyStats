import { Provider, util as KlasaUtil } from 'klasa';
import { r, MasterPool, RPoolConnectionOptions } from 'rethinkdb-ts';

export default class RethinkDBProvider extends Provider {
	db = r;
	pool!: MasterPool;

	async init() {
		const options: RPoolConnectionOptions = KlasaUtil.mergeDefault({
			db: 'simplystats',
			silent: false,
		}, this.client.options.providers.rethinkdb);

		this.pool = await r.connectPool(options);
		await this.db.branch(
			this.db.dbList().contains(options.db!),
			null,
			this.db.dbCreate(options.db!),
		).run();
	}

	shutdown() {
		return this.pool.drain();
	}

	/* Table methods */

	hasTable(table: string) {
		return this.db.tableList().contains(table).run();
	}

	createTable(table: string) {
		return this.db.tableCreate(table).run();
	}

	deleteTable(table: string) {
		return this.db.tableDrop(table).run();
	}

	/* Document methods */

	async getAll(table: string, entries = []) {
		if (entries.length) {
			const chunks: string[][] = KlasaUtil.chunk(entries, 50000);
			const output = [];
			for (const myChunk of chunks) output.push(...await this.db.table(table).getAll(...myChunk).run());
			return output;
		}
		return this.db.table(table).run();
	}

	async getKeys(table: string, entries = []) {
		if (entries.length) {
			const chunks: string[][] = KlasaUtil.chunk(entries, 50000);
			const output = [];
			for (const myChunk of chunks) output.push(...await this.db.table(table).getAll(...myChunk)('id').run());
			return output;
		}
		return this.db.table(table)('id').run();
	}

	get(table: string, id: string) {
		return this.db.table(table).get(id).run();
	}

	has(table: string, id: string) {
		return this.db.table(table).get(id).ne(null)
			.run();
	}

	getRandom(table: string) {
		return this.db.table(table).sample(1).run();
	}

	create(table: string, id: string, value = {}) {
		return this.db.table(table).insert({ ...this.parseUpdateInput(value), id }).run();
	}

	update(table: string, id: string, value: {}) {
		return this.db.table(table).get(id).update(this.parseUpdateInput(value))
			.run();
	}

	replace(table: string, id: string, value: {}) {
		return this.db.table(table).get(id).replace({ ...this.parseUpdateInput(value), id })
			.run();
	}

	delete(table: string, id: string) {
		return this.db.table(table).get(id).delete()
			.run();
	}
}

declare module 'rethinkdb-ts/lib/types' {
	interface RTable<T = any> {
		getAll(...params: Array<string | { index: string }>): RSelection<T>;
	}
}
