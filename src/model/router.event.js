import { EventListener } from "domodel"

/**
	* @memberof: module:router
	*/
class RouterEvent extends EventListener {

	/**
	 * @param {Link} link
	 */
	navigate(link) {
		let url = link.path
		if(this.binding.properties.router.type === Router.TYPE.HASH) {
			url = `#${link.path}`
		}
		this.binding.root.ownerDocument.defaultView.history.pushState({}, null, url)
		this.binding.properties.router.emit("browse", link)
	}

	/**
	 * @param {Link} link
	 */
	browse(link) {
		const url = new URL(link.path, this.binding.root.ownerDocument.location)
		const match = this.binding.properties.router.match(url)
		if(match) {
			this.binding.properties.router.emit("routeSet", { route: match.route, parameters: match.parameters })
		} else if(this.binding.properties.router.errorRoute) {
			this.binding.properties.router.emit("routeSet", { route: this.binding.properties.router.errorRoute })
		}
	}

	/**
	 * @param {object} data
	 * @param {Route}  data.route
	 * @param {object} data.parameters
	 */
	routeSet(data) {
		const { route, parameters } = data
		if(this.binding.properties.router.view !== null) {
			this.binding.properties.router.view.binding.remove()
		}
		this.binding.properties.router.view = new View(new route.binding(), parameters)
		this.binding.run(route.model(this.binding.properties.router), { binding: this.binding.properties.router.view.binding })
	}

}

export default RouterEvent
