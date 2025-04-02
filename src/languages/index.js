/**
 * @typedef {import('@wordpress/e2e-test-utils-playwright').RequestUtils} RequestUtils
 */

const BASE_PATH = '/pll/v1/languages';

/**
 * Returns languages list.
 *
 * @param {RequestUtils} requestUtils Gutenberg request utils object.
 * @return {Promise} Request promise.
 */
export async function getAllLanguages( requestUtils ) {
	return requestUtils.rest( {
		path: BASE_PATH,
		method: 'GET',
	} );
}

/**
 * Returns a language.
 *
 * @param {RequestUtils} requestUtils Gutenberg request utils object.
 * @param {string}       slug         Language slug to get.
 * @return {Promise} Request promise.
 */
export async function getLanguage( requestUtils, slug ) {
	return requestUtils.rest( {
		path: `${ BASE_PATH }/${ slug }`,
		method: 'GET',
	} );
}

/**
 * Creates a language.
 *
 * @param {RequestUtils} requestUtils Gutenberg request utils object.
 * @param {string}       locale       Language locale to create.
 * @return {Promise} Request promise.
 */
export async function createLanguage( requestUtils, locale ) {
	return requestUtils.rest( {
		path: BASE_PATH,
		method: 'POST',
		params: {
			locale,
		},
	} );
}

/**
 * Deletes a language.
 *
 * @param {RequestUtils} requestUtils Gutenberg request utils object.
 * @param {string}       slug         Language slug to delete.
 * @return {Promise} Request promise.
 */
export async function deleteLanguage( requestUtils, slug ) {
	return requestUtils.rest( {
		path: BASE_PATH,
		method: 'DELETE',
		params: {
			slug,
		},
	} );
}

/**
 * Deletes all languages.
 *
 * @param {RequestUtils} requestUtils Gutenberg request utils object.
 * @return {Promise} Request promise.
 */
export async function deleteAllLanguages( requestUtils ) {
	const languages = await getAllLanguages( requestUtils );
	return requestUtils.batchRest(
		// Reverse the languages list to delete the default one last.
		languages.reverse().map( ( language ) => ( {
			method: 'DELETE',
			path: `${ BASE_PATH }/${ language.term_id }`,
		} ) )
	);
}
