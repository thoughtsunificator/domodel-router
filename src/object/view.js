/** @module view */

import { Observable } from "domodel"

/**
 * @memberof: module:view
 */
class View extends Observable {

	/**
	 * @param {Binding} binding
	 * @param {object} parameters
	 */
	constructor(binding, parameters = {}) {
		super()
		this._binding = binding
		this._parameters = parameters
	}

	/**
	 * @type {object}
	 */
	get parameters() {
		return this._parameters
	}

	/**
	 * @type {Binding}
	 */
	get binding() {
		return this._binding
	}

	set binding(binding) {
		this._binding = binding
	}

}

export default View
