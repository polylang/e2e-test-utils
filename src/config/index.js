import { defineConfig, devices } from '@playwright/test';
import path from 'path';

const STORAGE_STATE_PATH =
	process.env.STORAGE_STATE_PATH ||
	path.join( process.cwd(), 'artifacts/storage-states/admin.json' );

/**
 * Returns a Playwright config object.
 *
 * @since 0.1.0
 *
 * @param {import('@playwright/test').PlaywrightTestConfig} options Options to merge with the default config.
 * @return {import('@playwright/test').PlaywrightTestConfig} Playwright config object.
 */
export function getPlaywrightConfig( options = {} ) {
	return defineConfig( {
		testDir: './specs',
		globalSetup: require.resolve( '../setup/global.setup.js' ),
		fullyParallel: false,
		forbidOnly: !! process.env.CI,
		retries: process.env.CI ? 2 : 0,
		workers: 1,
		reporter: 'html',
		use: {
			baseURL: 'http://localhost:8889',
			ignoreHTTPSErrors: true,
			trace: 'on-first-retry',
			headless: true,
			storageState: STORAGE_STATE_PATH,
			...options.use,
		},
		projects: [
			{
				name: 'chromium',
				use: { ...devices[ 'Desktop Chrome' ] },
			},
		],
		webServer: {
			command: 'npm run env:start',
			url: 'http://localhost:8889',
			reuseExistingServer: true,
			timeout: 120 * 1000,
			...options.webServer,
		},
		...options,
	} );
}
