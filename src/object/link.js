/**
 * @global
 */
class Link {

	/**
	 * @param {string} path
	 * @param {object} [properties={}]
	 */
	constructor(path, properties = {}) {
		this._path = path
		this._properties = properties
	}

	/**
	 * @readonly
	 * @type {string}
	 */
	get path() {
		return this._path
	}

	/**
	 * @readonly
	 * @type {object}
	 */
	get properties() {
		return this._properties
	}

}

export default Link
