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
		globalSetup: path.resolve( __dirname, '../setup/global.setup.cjs' ),
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
			// wp-env start exits after containers are up; keep the process alive so Playwright can wait for a 2xx response.
			command: 'npm run env:start && sleep 86400', // 24 hours.
			url: 'http://localhost:8889',
			reuseExistingServer: ! process.env.CI,
			cwd: process.cwd(),
			timeout: 120 * 1000,
			...options.webServer,
		},
		...options,
	} );
}
