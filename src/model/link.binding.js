import { Binding } from "domodel"

import Router from "../object/router.js"

/**
 * @global
 */
class LinkBinding extends Binding {

	/**
	 * @param {object} properties
	 * @param {Router} properties.link
	 * @param {Link} properties.router
	 */
	constructor(properties) {
		super(properties)
	}

	onCreated() {

		const { link, router } = this.properties

		if(router.type === Router.TYPE.HASH) {
			this.root.href = `#${link.path}`
		} else if(router.type === Router.TYPE.PATHNAME) {
			this.root.href = link.path
		}

		this.root.addEventListener("click", event => {
			event.preventDefault()
			if(router.type === Router.TYPE.HASH || router.type === Router.TYPE.PATHNAME) {
				router.emit("navigate", link)
			} else {
				router.emit("browse", link)
			}
		})
	}

}

export default LinkBinding
