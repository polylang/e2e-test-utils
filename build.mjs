/**
 * Builds the package for publication and consumption by Node / Playwright.
 *
 * Source files in `src/` are compiled to CommonJS (`.cjs`) in `build/`, mirroring
 * the source directory layout. Peer dependencies (`@playwright/test`,
 * `@wordpress/e2e-test-utils-playwright`) and Node built-ins are not bundled.
 *
 * @see package.json `main` and `exports` fields.
 */
import * as esbuild from 'esbuild';
import { globSync } from 'glob';
import fs from 'fs';

const entryPoints = globSync( 'src/**/*.js' );

await esbuild.build( {
	entryPoints,
	outdir: 'build',
	outbase: 'src',
	// Compile each file individually so paths like `build/setup/global.setup.cjs`
	// remain addressable (e.g. the default `globalSetup` path in getPlaywrightConfig).
	bundle: false,
	platform: 'node',
	format: 'cjs',
	outExtension: { '.js': '.cjs' },
} );

// esbuild keeps `.js` extensions in relative require paths; rewrite them to `.cjs`.
for ( const file of globSync( 'build/**/*.cjs' ) ) {
	let content = fs.readFileSync( file, 'utf8' );

	content = content.replace(
		/require\((['"])(\.\.?\/[^'"]+)\.js\1\)/g,
		'require($1$2.cjs$1)'
	);

	fs.writeFileSync( file, content );
}
