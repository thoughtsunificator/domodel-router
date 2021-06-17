import { Core, Binding } from "domodel"

import Router from "../object/router.js"
import View from "../object/view.js"
import Link from "../object/link.js"

export default class extends Binding {

	onCreated() {

		const { router } = this.properties

		this.listen(router, "navigate", link => {
			let url = link.path
			if(router.type === Router.TYPE.HASH) {
				url = `#${link.path}`
			}
			this.root.ownerDocument.defaultView.history.pushState({}, null, url)
			router.emit("browse", link)
		})

		this.listen(router, "browse", link => {
			const url = new URL(link.path, this.root.ownerDocument.location)
			const match = router.match(url)
			if(match) {
				router.emit("route set", { route: match.route, parameters: match.parameters })
			} else if(router.errorRoute) {
				router.emit("route set", { route: router.errorRoute })
			}
		})

		this.listen(router, "route set", data => {
			const { route, parameters } = data
			if(router.view !== null) {
				router.view.binding.remove()
			}
			router.view = new View(new route.binding(), parameters)
			this.run(route.model(router), { binding: router.view.binding })
		})

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

