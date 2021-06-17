/** @module route */

import { Binding } from "domodel"

/**
 * @memberof: module:route
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
	 * @type {string}
	 */
	get match() {
		return this._match
	}

	/**
	 * @type {object}
	 */
	get model() {
		return this._model
	}

	/**
	 * @type {Binding}
	 */
	get binding() {
		return this._binding
	}

}

export default Route
