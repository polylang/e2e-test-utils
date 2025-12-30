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
 * Creates a term.
 *
 * @param {RequestUtils} requestUtils       Gutenberg request utils object.
 * @param {string}       taxonomy           Taxonomy slug used in related REST endpoint (e.g., 'categories', 'tags').
 * @param {Object}       [args = {}]        Additional arguments to pass to the request.
 * @param {string}       [args.name]        Term name (required).
 * @param {string}       [args.description] Term description.
 * @param {string}       [args.slug]        Term slug.
 * @param {number}       [args.parent]      Parent term ID.
 * @param {string}       [args.lang]        Language slug.
 * @return {Promise} Request promise.
 */
export const createTerm = async (
	requestUtils,
	taxonomy = 'categories',
	args = {}
) => {
	return requestUtils.rest( {
		method: 'POST',
		path: `${ BASE_PATH }/${ taxonomy }`,
		data: args,
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
