import { request } from '@playwright/test';
import { RequestUtils } from '@wordpress/e2e-test-utils-playwright';
import { deleteAllLanguages, resetAllSettings } from '..';

/**
 * Partially copied from Gutenberg and converted from Typescript.
 * @see https://github.com/WordPress/gutenberg/blob/v20.0.0/test/e2e/config/global-setup.ts
 *
 * @param {Object} config Playwright config object.
 */
export default async function globalSetup( config ) {
	const { storageState, baseURL } = config.projects[ 0 ].use;
	const storageStatePath =
		typeof storageState === 'string' ? storageState : undefined;

	const requestContext = await request.newContext( {
		baseURL,
	} );

	const requestUtils = await RequestUtils.setup( {
		storageStatePath,
	} );

	// Authenticate and save the storageState to disk.
	await requestUtils.setupRest();

	// Reset the test environment before running the tests.
	await Promise.all( [
		requestUtils.deleteAllMedia(),
		requestUtils.deleteAllPosts(),
		requestUtils.deleteAllBlocks(),
		requestUtils.resetPreferences(),
		deleteAllLanguages( requestUtils ),
		resetAllSettings( requestUtils ),
	] );

	await requestContext.dispose();
}
