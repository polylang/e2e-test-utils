import { execSync } from 'child_process';

/** @type {string} */
const DEFAULT_WP_CLI_COMMAND = 'npx wp-env run tests-cli';

/**
 * Returns the base `wp-env run …` command used to invoke WP-CLI.
 *
 * Resolution order:
 * 1. `process.env.WP_ENV_CLI_COMMAND`
 * 2. {@link DEFAULT_WP_CLI_COMMAND}
 *
 * @since 0.2.0
 *
 * @return {string} Base wp-env run command (without trailing WP-CLI arguments).
 */
export function getWpCliCommand() {
	return process.env.WP_ENV_CLI_COMMAND || DEFAULT_WP_CLI_COMMAND;
}

/**
 * Sets the base `wp-env run …` command for utility functions such as `createTranslator`.
 *
 * @since 0.2.0
 *
 * @param {string} command Base wp-env run command (without trailing WP-CLI arguments).
 */
export function setWpCliCommand( command ) {
	process.env.WP_ENV_CLI_COMMAND = command;
}

/**
 * Runs a WP-CLI command in the wp-env test environment.
 *
 * @since 0.2.0
 *
 * @param {string} command     The WP-CLI command to run (e.g. `wp pll setting get`).
 * @param {string} shellPrefix Optional shell prefix (e.g. `echo "y" |`).
 * @return {string} The command output.
 */
export function runWpCli( command, shellPrefix = '' ) {
	const cliCommand = `${ getWpCliCommand() } ${ command }`;
	const fullCommand = shellPrefix
		? `${ shellPrefix } ${ cliCommand }`
		: cliCommand;

	return execSync( fullCommand, {
		encoding: 'utf8',
		stdio: 'pipe',
	} );
}
