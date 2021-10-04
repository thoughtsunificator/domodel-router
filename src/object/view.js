import { Observable } from "domodel"

/**
 * @global
 */
class View extends Observable {

	/**
	 * @param {Binding} binding
	 * @param {object} [parameters={}]
	 */
	constructor(parameters = {}) {
		super()
		this._parameters = parameters
	}

	/**
	 * @readonly
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
