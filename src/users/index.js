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
 * @param {string}        userName  User name.
 * @return {Promise<User>} The user.
 */
export async function createTranslator( langSlugs, userName ) {
	userName =
		typeof userName === `string`
			? userName
			: `${ langSlugs.join( '-' ) }-translator`;
	const email = `${ userName.toLowerCase() }@example.com`;
	const resultCreateUser = execSync(
		`npx wp-env run tests-cli wp user create ${ userName } ${ email } --role=editor`,
		{ encoding: 'utf8' }
	).trim();

	expect( resultCreateUser ).toContain( 'Success: Created user' );

	const { groups: user } = resultCreateUser.match(
		/^Success: Created user (?<id>\d+)\.\nPassword: (?<password>[^ ]+)$/m
	);

	user.id = parseInt( user.id, 10 );
	user.username = userName;

	langSlugs.forEach( ( langSlug ) => {
		const resultAddCap = execSync(
			`npx wp-env run tests-cli wp user add-cap ${ user.id } translate_${ langSlug }`,
			{ encoding: 'utf8' }
		);

		expect( resultAddCap ).toContain(
			`Success: Added 'translate_${ langSlug }' capability`
		);
	} );

	return user;
}

/**
 * Switches to the given user.
 * Inspired from https://github.com/WordPress/gutenberg/blob/9ee534a42cd546fc2da23ce0f31607467c78c94c/test/e2e/specs/editor/collaboration/fixtures/collaboration-utils.ts#L104.
 *
 * @param {User}         user         The user to switch to.
 * @param {Admin}        admin        The language of the post and page.
 * @param {RequestUtils} requestUtils Gutenberg request utils object.
 * @return {Promise<Page>} The page object.
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
