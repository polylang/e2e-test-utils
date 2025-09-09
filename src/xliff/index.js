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

	await page.getByText( 'Export selected content into' ).click();
};

/**
 * Returns a regex to match the xliff file name.
 *
 * @param {string} sourceLocale The source language locale (e.g. 'en_US').
 * @param {string} targetLocale The target language locale (e.g. 'fr_FR').
 * @return {RegExp} Regex to match the xliff file name (e.g. en-US_fr-FR_2025-09-01_14-30-45.xliff).
 */
export const getXliffRegex = ( sourceLocale, targetLocale ) => {
	return new RegExp(
		// eslint-disable-next-line prettier/prettier
		`${ sourceLocale.replace( '_', '-' ) }_${ targetLocale.replace( '_', '-' ) }_\\d{4}-\\d{2}-\\d{2}_\\d{1,2}-\\d{2}-\\d{2}\\.xliff`
	);
};
