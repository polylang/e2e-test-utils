export {
	getLanguage,
	getAllLanguages,
	createLanguage,
	deleteLanguage,
	deleteAllLanguages,
} from './languages';
export { resetAllSettings, setSetting, getSettings } from './settings';
export { getAllTerms, deleteAllTerms, getTermBySlug } from './taxonomies';
export { getPlaywrightConfig } from './config';
export { default as globalSetup } from './setup/global.setup';
