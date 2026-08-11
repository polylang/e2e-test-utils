/**
 * @typedef {import('@wordpress/e2e-test-utils-playwright').RequestUtils} RequestUtils
 */

/**
 * Saves the translations for a post.
 *
 * @param {RequestUtils} requestUtils Gutenberg request utils object.
 * @param {number}       id           Post ID.
 * @param {Object}       translations Map of language codes to post IDs. Example: { en: 1, fr: 2 }
 * @return {Promise} Request promise.
 */
export async function saveTranslations( requestUtils, id, translations = {} ) {
	return requestUtils.rest( {
		path: `/wp/v2/posts/${ id }`,
		method: 'POST',
		data: {
			translations,
		},
	} );
}

/**
 * Saves translations for a term identified by termId.
 *
 * @param {Object} requestUtils      Utility object for making REST API requests.
 * @param {number} id                Term ID.
 * @param {Object} [translations={}] Map of language codes to term IDs. Example: { en: 10, fr: 22 }.
 * @return {Promise<Object>} A promise that resolves to the response of the REST API call.
 */
export async function saveTermTranslations(
	requestUtils,
	id,
	translations = {}
) {
	return requestUtils.rest( {
		path: `/wp/v2/categories/${ id }`,
		method: 'POST',
		data: {
			translations,
		},
	} );
}
