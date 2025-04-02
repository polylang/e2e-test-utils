/**
 * @typedef {import('@wordpress/e2e-test-utils-playwright').RequestUtils} RequestUtils
 */

const BASE_PATH = '/pll/v1/settings';

let schema;

/**
 * Returns all plugin settings.
 *
 * @param {RequestUtils} requestUtils Gutenberg request utils object.
 * @return {Promise} Request promise with the settings values when fulfilled.
 */
export async function getSettings( requestUtils ) {
	return requestUtils.rest( {
		path: BASE_PATH,
		method: 'GET',
	} );
}

/**
 * Updates a plugin setting.
 *
 * @param {RequestUtils} requestUtils Gutenberg request utils object.
 * @param {string}       settingKey   Setting key.
 * @param {*}            settingValue Setting value.
 * @return {Promise} Request promise.
 */
export async function setSetting( requestUtils, settingKey, settingValue ) {
	return requestUtils.rest( {
		path: BASE_PATH,
		method: 'PUT',
		params: {
			[ settingKey ]: settingValue,
		},
	} );
}

/**
 * Resets all plugin settings to default values.
 *
 * @param {RequestUtils} requestUtils Gutenberg request utils object.
 * @return {Promise} Request promise.
 */
export async function resetAllSettings( requestUtils ) {
	if ( ! schema ) {
		schema = await requestUtils.rest( {
			path: BASE_PATH,
			method: 'OPTIONS',
		} );
	}

	const params = Object.entries( schema.schema.properties ).reduce(
		( acc, [ k, v ] ) => {
			if ( v.readonly || v.default === undefined ) {
				return acc;
			}

			acc[ k.toString() ] = v.default;

			return acc;
		},
		{}
	);

	/*
	 * Don't mess with the default language.
	 * If all languages have been deleted, `default_lang` will be set to empty string by the server anyway.
	 */
	delete params.default_lang;

	return requestUtils.rest( {
		headers: {
			'Content-Type': 'application/json',
		},
		path: BASE_PATH,
		method: 'POST',
		data: params,
	} );
}
