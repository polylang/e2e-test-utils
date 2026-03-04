import {
	getAllLanguages,
	deleteAllLanguages,
	getLanguage,
	createLanguage,
	deleteLanguage,
} from './languages/index.js';
import { saveTranslations } from './translations/index.js';
import { resetAllSettings, setSetting, getSettings } from './settings/index.js';
import {
	getAllTerms,
	deleteAllTerms,
	getTermBySlug,
	createTerm,
} from './taxonomies/index.js';
import { fillInXliffExportForm, getXliffRegex } from './xliff/index.js';
import { createTranslator, switchToUser } from './users/index.js';
import { getDownload, getStringFromFile } from './downloads/index.js';
import { getPlaywrightConfig } from './config/index.js';
import globalSetup from './setup/global.setup.js';

export {
	getAllLanguages,
	deleteAllLanguages,
	getLanguage,
	createLanguage,
	deleteLanguage,
	saveTranslations,
	resetAllSettings,
	setSetting,
	getSettings,
	getAllTerms,
	deleteAllTerms,
	getTermBySlug,
	createTerm,
	fillInXliffExportForm,
	getDownload,
	getXliffRegex,
	createTranslator,
	switchToUser,
	getStringFromFile,
	getPlaywrightConfig,
	globalSetup,
};
