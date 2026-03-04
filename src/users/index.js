// @ts-check
import {
	expect,
	Admin,
	RequestUtils,
} from '@wordpress/e2e-test-utils-playwright';
import { execSync } from 'child_process';

/**
 * @typedef {import('@playwright/test').Page} Page
 * @typedef {Object} User
 * @property {string} username The user name.
 * @property {string} password The user's password.
 */

/**
 * Creates a translator user.
 *
 * @param {Array<string>} langSlugs Language slugs.
 * @param {string}        userName  Optional. User name.
 *                                  Defaults to `XX-YY-translator`, where `XX` and `YY` are language slugs.
 * @return {Promise<User&{id: number}>} Promise resolving to a user object containing ID, user name, and password.
 */
export async function createTranslator( langSlugs, userName = '' ) {
	userName =
		'' === userName
			? `${ langSlugs.join( '-' ).toUpperCase() }-translator`
			: userName;
	const email = `${ userName.toLowerCase() }@example.com`;
	const userId = parseInt(
		execSync(
			`npx wp-env run tests-cli wp user create ${ userName } ${ email } --role=editor --user_pass=password --porcelain`,
			{ encoding: 'utf8' }
		).trim(),
		10
	);

	langSlugs.forEach( ( langSlug ) => {
		execSync(
			`npx wp-env run tests-cli wp user add-cap ${ userId } translate_${ langSlug }`,
			{ encoding: 'utf8' }
		);
	} );

	return { id: userId, username: userName, password: 'password' };
}

/**
 * Switches to the given user.
 * Inspired from https://github.com/WordPress/gutenberg/blob/9ee534a42cd546fc2da23ce0f31607467c78c94c/test/e2e/specs/editor/collaboration/fixtures/collaboration-utils.ts#L104.
 *
 * @param {User}         user         The user to switch to.
 * @param {Admin}        admin        Instance of `Admin`.
 * @param {RequestUtils} requestUtils Gutenberg request utils object.
 * @return {Promise<Page>} Promise resolving to the `Page` object.
 */
export async function switchToUser( user, admin, requestUtils ) {
	const translatorContext = await admin.browser.newContext( {
		baseURL: requestUtils.baseURL,
	} );
	const page = await translatorContext.newPage();

	await page.goto( '/wp-login.php' );
	await page.locator( '#user_login' ).fill( user.username );
	await page.locator( '#user_pass' ).fill( user.password );
	await page.getByRole( 'button', { name: 'Log In' } ).click();
	await page.waitForURL( '**/wp-admin/**' );

	expect(
		page.getByRole( 'menuitem', {
			name: `Howdy, ${ user.username }`,
		} )
	).toBeVisible();

	await page.waitForFunction( () => window?.wp?.data && window?.wp?.blocks );
	await page.evaluate( () => {
		window.wp.data
			.dispatch( 'core/preferences' )
			.set( 'core/edit-post', 'welcomeGuide', false );
		window.wp.data
			.dispatch( 'core/preferences' )
			.set( 'core/edit-post', 'fullscreenMode', false );
	} );

	return page;
}
