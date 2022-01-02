/**
 * @global
 */
class Match {

	/**
	 * @param {Route}  route
	 * @param {object} parameters
	 */
	constructor(route, parameters = {}) {
		this._route = route
		this._parameters = parameters
	}

	/**
	 * @readonly
	 * @type {Route}
	 */
	get route() {
		return this._route
	}

	/**
	 * @readonly
	 * @type {object}
	 */
	get parameters() {
		return this._parameters
	}

}

export default Match
