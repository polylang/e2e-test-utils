/* eslint-disable import/no-extraneous-dependencies */
const wpPlugin = require( '@wordpress/eslint-plugin' );

module.exports = [
	{
		ignores: [ '**/build/**', '**/node_modules/**', 'build.mjs' ],
	},
	...wpPlugin.configs.recommended,
];
