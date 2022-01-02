import { Binding } from "domodel"

/**
 * @global
 */
class Route {

	/**
	 * @param {string}   match
	 * @param {model}    model
	 * @param {Binding}  binding
	 * @param {object}   properties
	 * @param {function} middleware
	 */
	constructor({ match, model, binding = Binding, properties = {}, middleware, layout } = {}) {
		this._match = match
		this._model = model
		this._binding = binding
		this._properties = properties
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
	 * @type {object}
	 */
	get model() {
		return this._model
	}

	/**
	 * @readonly
	 * @type {Binding}
	 */
	get binding() {
		return this._binding
	}

	/**
	 * @readonly
	 * @type {object}
	 */
	get properties() {
		return this._properties
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
