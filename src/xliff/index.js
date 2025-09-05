// @ts-check
import { expect } from '@wordpress/e2e-test-utils-playwright';

/**
 * Fills in the XLIFF export form.
 * Page should be on the post list table.
 *
 * @param {import('@playwright/test').Page} page                 Page object.
 * @param {Object}                          options              Options.
 * @param {string}                          options.postId       Post ID.
 * @param {string}                          options.postTitle    Post title.
 * @param {string}                          options.languageName Language name.
 */
export const fillInXliffExportForm = async (
	page,
	{ postId, postTitle, languageName }
) => {
	await expect( page.locator( `#post-${ postId }` ) ).toBeVisible();

	await page.getByRole( 'checkbox', { name: postTitle } ).check();
	await page
		.locator( '#bulk-action-selector-top' )
		.selectOption( 'pll_translate' );
	await page.locator( '#doaction' ).click();
	await page.locator( '#pll-translate' ).getByText( languageName ).click();

	return page.getByText( 'Export selected content into' ).click();
};
