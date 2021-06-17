import { Binding } from "domodel"

import Router from "../object/router.js"

export default class extends Binding {

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

