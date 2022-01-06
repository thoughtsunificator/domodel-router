import { Binding } from "domodel"

/**
 * @global
 */
class Route {

	/**
	 * @param {string}   match
	 * @param {Model}    model
	 * @param {function} middleware
	 */
	constructor({ match, model, middleware, layout } = {}) {
		this._match = match
		this._model = model
		this._middleware = middleware
		this._layout = layout
	}

	/**
	 * @readonly
	 * @type {string}
	 */
	get match() {
		return this._match
	}

	/**
	 * @readonly
	 * @type {Model}
	 */
	get model() {
		return this._model
	}

	/**
	 * @readonly
	 * @type {function}
	 */
	get middleware() {
		return this._middleware
	}

	/**
	 * @readonly
	 * @type {type}
	 */
	get layout() {
		return this._layout
	}

}

export default Route
