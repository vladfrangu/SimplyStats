import { Constructable } from 'discord.js';
import { promises as fs } from 'fs';
import { KlasaClient, Piece, Store } from 'klasa';
import { join } from 'path';

import ModuleBase from './Module';
interface ModuleClass {
	new(): ModuleBase;
}

const MODULES_PATH = join(__dirname, '../../../../modules');
// A store of all modules that exist, that all Klasa stores will attempt to load pieces from
const PATHS_TO_ADD = new Set<string>();

export default class StatsClient extends KlasaClient {
	/**
	 * Adds a folder to the store's list of folders to load.
	 * @param store The store to register the directory to
	 * @param directory The directory that should be registered
	 */
	registerCoreDirectory<K, V extends Piece, VConstructor = Constructable<V>>(store: Store<K, V, VConstructor>, directory: string) {
		// @ts-ignore
		store.registerCoreDirectory(directory);

		return this;
	}

	async login(token: string) {
		const modules = await fs.readdir(MODULES_PATH);

		for (const module of modules) {
			const FULL_PATH = `${MODULES_PATH}/${module}/`;
			PATHS_TO_ADD.add(FULL_PATH);
			try {
				const Module = ((req) => req.default || req)(require(`${FULL_PATH}plugin`)) as ModuleClass;
				new Module().setup.call(this);
				this.console.verbose(`Module "${module}" was successfully initialized!`);
			} catch (err) {
				this.console.error(`Couldn't load module "${module}"`, err);
			}
		}

		for (const path of PATHS_TO_ADD) {
			for (const store of this.pieceStores.values())
				this.registerCoreDirectory(store, path);
		}

		return super.login(token);
	}
}

// Augment discord.js's Client class so it knows it has a new function that can be used
declare module 'discord.js' {
	interface Client {
		registerCoreDirectory<K, V extends Piece, VConstructor = Constructable<V>>(store: Store<K, V, VConstructor>, directory: string): this;
	}
}
