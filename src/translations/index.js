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
