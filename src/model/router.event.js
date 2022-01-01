import { EventListener } from "domodel"
import Router from "../object/router.js"
import View from "../object/view.js"

/**
 * @global
 */
class RouterEventListener extends EventListener {

	/**
	 * @event RouterEventListener#navigate
	 * @property {Link} link
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
	 * @event RouterEventListener#browse
	 * @property {Link} link
	 * @example router.emit("browse", new Link("/path"))
	 */
	browse(link) {
		const match = this.properties.router.match(link.path)
		if(match) {
			this.properties.router.emit("routeSet", { route: match.route, parameters: match.parameters, path: link.path, properties: link.properties })
		} else {
			this.properties.router.emit("routeSet", { route: this.properties.router.errorRoute, path: link.path, properties: { path: link.path } })
		}
	}

	/**
	 * @event RouterEventListener#routeSet
	 * @property {object} data
	 * @property {Route}  data.route
	 * @property {object} data.parameters
	 * @property {object} data.properties
	 * @example router.emit("routeSet", { route: new Route(...), parameters: {...} })
	 */
	routeSet(data) {
		const { route, parameters, properties = {}, path } = data
		if(this.properties.router.view !== null) {
			this.properties.router.view.binding.remove()
		}
		this.properties.router._path = path
		this.properties.router._view = new View(parameters)
		this.properties.router.view.binding = new route.binding({ ...this.properties, ...route.properties, ...properties })
		this.run(route.model(this.properties), { parentNode: this.identifier.view, binding: this.properties.router.view.binding })
	}

}

export default RouterEventListener
