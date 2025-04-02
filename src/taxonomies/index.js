/**
 * @typedef {import('@wordpress/e2e-test-utils-playwright').RequestUtils} RequestUtils
 */

const BASE_PATH = '/wp/v2';

/**
 * Returns all terms.
 *
 * @param {RequestUtils} requestUtils Gutenberg request utils object.
 * @param {string}       taxonomy     Taxonomy slug.
 * @return {Promise} Request promise.
 */
export const getAllTerms = async ( requestUtils, taxonomy ) => {
	return requestUtils.rest( {
		path: `${ BASE_PATH }/${ taxonomy }`,
		params: {
			per_page: 100,
		},
	} );
};

/**
 * Returns a term by slug.
 *
 * @param {RequestUtils} requestUtils Gutenberg request utils object.
 * @param {string}       taxonomy     Taxonomy slug.
 * @param {string}       slug         Term slug.
 * @return {Promise} Request promise.
 */
export const getTermBySlug = async ( requestUtils, taxonomy, slug ) => {
	return requestUtils.rest( {
		path: `${ BASE_PATH }/${ taxonomy }`,
		params: {
			slug,
		},
	} );
};

/**
 * Deletes all terms.
 *
 * @param {RequestUtils} requestUtils Gutenberg request utils object.
 * @param {string}       taxonomy     Taxonomy slug.
 * @return {Promise} Request promise.
 */
export const deleteAllTerms = async ( requestUtils, taxonomy ) => {
	const terms = await getAllTerms( requestUtils, taxonomy );
	await requestUtils.batchRest(
		terms.map( ( term ) => ( {
			method: 'DELETE',
			path: `${ BASE_PATH }/${ taxonomy }/${ term.id }`,
		} ) )
	);
};
