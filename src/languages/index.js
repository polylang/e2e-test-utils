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
 * @param {RequestUtils} requestUtils          Gutenberg request utils object.
 * @param {string}       locale                Language locale to create.
 * @param {Object}       [args = {}]           Additional arguments to pass to the request, optional. For the full list of arguments, see the REST API documentation.
 * @param {string}       [args.slug]           Language slug to create.
 * @param {string}       [args.name]           Language name to create.
 * @param {string}       [args.is_rtl]         If the language is rtl.
 * @param {string}       [args.flag_code]      The flag code of the language.
 * @param {string}       [args.page_on_front]  The ID of the page on front for the language.
 * @param {string}       [args.page_for_posts] The ID of the page for posts for the language.
 * @param {string}       [args.term_group]     The term group (order) of the language.
 * @param {string}       [args.no_default_cat] Whether to create the default category for the language.
 * @return {Promise} Request promise.
 */
export async function createLanguage( requestUtils, locale, args = {} ) {
	return requestUtils.rest( {
		path: BASE_PATH,
		method: 'POST',
		params: {
			locale,
			...args,
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
