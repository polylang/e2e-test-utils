import {
	getAllLanguages,
	deleteAllLanguages,
	getLanguage,
	createLanguage,
	deleteLanguage,
} from './languages/index.js';
import { resetAllSettings, setSetting, getSettings } from './settings/index.js';
import {
	getAllTerms,
	deleteAllTerms,
	getTermBySlug,
} from './taxonomies/index.js';
import { getPlaywrightConfig } from './config/index.js';
import globalSetup from './setup/global.setup.js';

export {
	getAllLanguages,
	deleteAllLanguages,
	getLanguage,
	createLanguage,
	deleteLanguage,
	resetAllSettings,
	setSetting,
	getSettings,
	getAllTerms,
	deleteAllTerms,
	getTermBySlug,
	getPlaywrightConfig,
	globalSetup,
};
