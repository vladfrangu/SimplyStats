import { KlasaClient } from 'klasa';

export default interface Plugin {
	/**
	 * Sets up the plugin's requirements.
	 * Plugins MUST at least export a class that implement this interface!
	 *
	 * Use this method when you want to initialize anything more than pieces.
	 * @param this The klasa client instance
	 */
	setup(this: KlasaClient): void;
}
