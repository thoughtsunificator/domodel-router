# domodel-router ![test-workflow](https://github.com/thoughtsunificator/domodel-router/actions/workflows/test.yml/badge.svg)

URL routing system for [domodel](https://github.com/thoughtsunificator/domodel).

## Getting started

### Prerequisites

- [domodel](https://github.com/thoughtsunificator/domodel)

### Installing

`npm install @domodel/router`

## Usage

```javascript
import { Core } from "domodel"
import { Router, Route, RouterModel, RouterBinding } from "@domodel/router"

import MyViewModel from "/model/my-view.js"
import MyViewModel2 from "/model/my-view2.js"

import MyViewBinding from "/model/my-view.binding.js"
import MyView2Binding from "/model/my-view2.binding.js"

const routes = [
	new Route("/", MyViewModel, MyViewBinding),
	new Route("/test", MyViewModel2, MyView2Binding)
]

window.addEventListener("load", function() {

	const router = new Router(routes, Router.TYPE.HASH)

	Core.run(RouterModel, {
		binding: new RouterBinding({ router }),
		parentNode: document.body
	})
})
```
