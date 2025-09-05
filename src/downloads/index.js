// @ts-check
import fs from 'fs';

/**
 * Returns a download promise.
 *
 * @param {import('@playwright/test').Page} page                     Page object.
 * @param {Object}                          submitButtonOptions      Submit button options.
 * @param {string}                          submitButtonOptions.name Submit button name.
 * @return {Promise<import('@playwright/test').Download>} Download promise.
 */
export const getDownload = async (
	page,
	submitButtonOptions = { name: 'Submit' }
) => {
	const downloadPromise = page.waitForEvent( 'download' );
	await page.getByRole( 'button', submitButtonOptions ).click();

	return downloadPromise;
};

/**
 * Returns a string from a file.
 *
 * @param {string} filePath The file path.
 * @return {string} The string from the file.
 */
export const getStringFromFile = ( filePath ) => {
	return fs.readFileSync( filePath ).toString();
};

/**
 * Returns a regex to match the xliff file name.
 *
 * @param {string} sourceLocale The source language locale.
 * @param {string} targetLocale The target language locale.
 * @return {RegExp} Regex to match the xliff file name.
 */
export const getXliffRegex = ( sourceLocale, targetLocale ) => {
	return new RegExp(
		// eslint-disable-next-line prettier/prettier
		`${ sourceLocale.replace( '-', '_' ) }_${ targetLocale.replace( '-', '_' ) }
		_\\d{4}-\\d{2}-\\d{2}_\\d{1,2}-\\d{2}-\\d{2}\\.xliff`
	);
};
