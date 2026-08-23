/// <reference path="../pb_data/types.d.ts" />

"use strict";

routerAdd("GET", "/", function (e) {
	return e.redirect(302, "/_/");
});
