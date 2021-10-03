import { EventListener } from "domodel"
import Router from "../object/router.js"
import View from "../object/view.js"

/**
 * @global
 */
class RouterEventListener extends EventListener {

	/**
	 * @param {Link} link
	 * @example router.emit("navigate", new Link("/path"))
	 */
	navigate(link) {
		let url = link.path
		if(this.properties.router.type === Router.TYPE.HASH) {
			url = `#${link.path}`
		}
		this.root.ownerDocument.defaultView.history.pushState({}, null, url)
		this.properties.router.emit("browse", link)
	}

	/**
	 * @param {Link} link
	 * @example router.emit("browse", new Link("/path"))
	 */
	browse(link) {
		const url = new URL(link.path, this.root.ownerDocument.location)
		const match = this.properties.router.match(url)
		if(match) {
			this.properties.router.emit("routeSet", { route: match.route, parameters: match.parameters })
		} else if(this.properties.router.errorRoute) {
			this.properties.router.emit("routeSet", { route: this.properties.router.errorRoute })
		}
	}

	/**
	 * @param {object} data
	 * @param {Route}  data.route
	 * @param {object} data.parameters
	 * @example router.emit("routeSet", { route: new Route(...), parameters: {...} })
	 */
	routeSet(data) {
		const { route, parameters } = data
		if(this.properties.router.view !== null) {
			this.properties.router.view.binding.remove()
		}
		this.properties.router.view = new View(new route.binding(), parameters)
		this.run(route.model(this.properties.router), { binding: this.properties.router.view.binding })
	}

}

export default RouterEventListener
