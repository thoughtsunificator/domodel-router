import { Binding } from "domodel"

/**
 * @global
 */
class Route {

	/**
	 * @param {string}  match
	 * @param {model}   model
	 * @param {Binding} binding
	 * @param {object}  properties
	 */
	constructor(match, model, binding = Binding, properties = {}) {
		this._match = match
		this._model = model
		this._binding = binding
		this._properties = properties
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

}

export default Route
