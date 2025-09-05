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

