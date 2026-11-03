// @ts-check
import { test as wpTest, expect } from '@wordpress/e2e-test-utils-playwright';
import {
	createPhpDebugLogTracker,
	wrapRequestUtilsRest,
} from '../debug-log/index.js';

/**
 * Playwright `test` extended with PHP debug.log fixtures.
 *
 * Auto fixtures:
 * - Worker: ignore leftover log lines (wp-env boot, previous runs).
 * - Per test: fail on new matching PHP lines before the test (covers `beforeAll`)
 *   and after the test (covers the test body). Worker teardown covers `afterAll`.
 * - `requestUtils.rest()` JSON parse failures get a REST/debug.log hint.
 *
 * @since 0.2.0
 */
const test = wpTest.extend( {
	requestUtils: [
		async ( { requestUtils }, use ) => {
			wrapRequestUtilsRest( requestUtils );
			await use( requestUtils );
		},
		{ scope: 'worker', auto: true },
	],
	phpDebugLogTracker: [
		async ( { requestUtils }, use ) => {
			wrapRequestUtilsRest( requestUtils );
			const tracker = createPhpDebugLogTracker();
			tracker.ignoreExisting();
			await use( tracker );
			tracker.assertNoNewPhpErrors(
				'PHP errors after the last test (including afterAll)'
			);
		},
		{ scope: 'worker', auto: true },
	],
	phpDebugLog: [
		async ( { phpDebugLogTracker }, use, testInfo ) => {
			phpDebugLogTracker.assertNoNewPhpErrors(
				`PHP errors before test "${ testInfo.title }" (including beforeAll)`
			);
			await use();
			phpDebugLogTracker.assertNoNewPhpErrors(
				`PHP errors during test "${ testInfo.title }"`
			);
		},
		{ auto: true },
	],
} );

export { test, expect };
