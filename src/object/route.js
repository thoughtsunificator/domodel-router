import { Binding } from "domodel"

/**
 * @global
 */
class Route {

	/**
	 * @param {string}  match
	 * @param {model}   model
	 * @param {Binding} binding
	 */
	constructor(match, model, binding = Binding) {
		this._match = match
		this._model = model
		this._binding = binding
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

}

export default Route
