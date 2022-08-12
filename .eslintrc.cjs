module.exports = {
    "env": {
        "browser": true,
        "es2021": true
    },
    "extends": [
        "plugin:vue/vue3-essential"
    ],
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module"
    },
    "plugins": [
        "vue"
    ],
    "rules": {
        "indent": [
            "error",
            4
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "double"
        ],
        "semi": [
            "error",
            "never"
        ],
        "vue/order-in-components": ["error", {
            "order": [
			  "el",
			  "name",
			  "key",
			  "parent",
			  "functional",
			  ["delimiters", "comments"],
			  ["components", "directives", "filters"],
			  "extends",
			  "mixins",
			  ["provide", "inject"],
			  "ROUTER_GUARDS",
			  "layout",
			  "middleware",
			  "validate",
			  "scrollToTop",
			  "transition",
			  "loading",
			  "inheritAttrs",
			  "model",
			  ["props", "propsData"],
			  "emits",
			  "setup",
			  "asyncData",
			  "data",
			  "fetch",
			  "head",
			  "computed",
			  "watch",
			  "watchQuery",
			  "LIFECYCLE_HOOKS",
			  "methods",
			  ["template", "render"],
			  "renderError"
            ]
		  }]
    }
}
