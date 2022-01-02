import { Core, Binding } from "domodel"

import Router from "../object/router.js"
import View from "../object/view.js"
import Link from "../object/link.js"
import RouterEventListener from "./router.event.js"

/**
 * @global
 */
class RouterBinding extends Binding {

	/**
	 * @param {object} properties
	 * @param {Router} properties.router
	 */
	constructor(properties) {
		super(properties, new RouterEventListener(properties.router))
	}

	onCreated() {

		const { router } = this.properties

		this.root.ownerDocument.defaultView.addEventListener("popstate", () => {
			if(router.type === Router.TYPE.HASH) {
				let path = this.root.ownerDocument.location.hash.slice(1)
				if(path === "") {
					router.emit("navigate", new Link("/"))
				} else {
					router.emit("browse", new Link(path))
				}
			} else if(router.type === Router.TYPE.PATHNAME) {
				router.emit("browse", new Link(this.root.ownerDocument.location.pathname))
			}
		})

		if(router.initialPath !== null) {
			if(router.type === Router.TYPE.VIRTUAL) {
				router.emit("browse", new Link(router.initialPath))
			} else {
				let path
				if(router.type === Router.TYPE.PATHNAME && this.root.ownerDocument.location.pathname !== "/") {
					path = this.root.ownerDocument.location.pathname
				} else if(router.type === Router.TYPE.HASH && this.root.ownerDocument.location.hash.slice(1) !== "") {
					path = this.root.ownerDocument.location.hash.slice(1)
				}
				if(path) {
					router.emit("browse", new Link(path))
				} else {
					router.emit("navigate", new Link(router.initialPath))
				}
			}
		}
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
	 * @type {View}
	 */
	get view() {
		return this._view
	}

	/**
	 * @readonly
	 * @type {Binding}
	 */
	get layoutBinding() {
		return this._layoutBinding
	}

}

export default RouterBinding
