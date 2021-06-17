/** @module link */

/**
 * @memberof: module:link
 */
class Link {

	/**
	 * @param {string} path
	 * @param {object} properties
	 */
	constructor(path, properties = {}) {
		this._path = path
		this._properties = properties
	}

	/**
	 * @type {string}
	 */
	get path() {
		return this._path
	}

	/**
	 * @type {object}
	 */
	get properties() {
		return this._properties
	}

}

export default Link
