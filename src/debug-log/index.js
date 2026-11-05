// @ts-check
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { getWpCliCommand } from '../config/wp-cli.js';

const REST_WRAPPED = Symbol( 'phpDebugLogRestWrapped' );

/**
 * Matches WordPress PHP error lines in `wp-content/debug.log`.
 *
 * Example: `[03-Nov-2026 12:00:00 UTC] PHP Notice:  Function __ was called incorrectly.`
 *
 * @type {RegExp}
 */
const PHP_ERROR_LINE =
	/^\[.+?\] PHP (?:Notice|Warning|Deprecated|Parse error|Fatal error):/;

/** @type {string|undefined} */
let cachedDebugLogPath;

/**
 * Builds a `wp-env status --json` command from the configured WP-CLI command,
 * preserving a consumer `--config` flag when present.
 *
 * @since 0.2.0
 *
 * @return {string} Command that prints wp-env status as JSON.
 */
export function getWpEnvStatusCommand() {
	const cliCommand = getWpCliCommand().trim();
	const withStatus = cliCommand.replace(
		/\s+run\s+\S+\s*$/,
		' status --json'
	);

	if ( withStatus !== cliCommand ) {
		return withStatus;
	}

	return 'npx wp-env status --json';
}

/**
 * WordPress directory name inside the wp-env install path.
 *
 * `tests-cli` maps to the tests environment (`tests-WordPress`); other CLI
 * services (typical for a dedicated `--config` test environment) map to `WordPress`.
 *
 * @since 0.2.0
 *
 * @return {string} Directory name under the wp-env install path.
 */
export function getWpEnvWordPressDirName() {
	return /\btests-cli\b/.test( getWpCliCommand() )
		? 'tests-WordPress'
		: 'WordPress';
}

/**
 * Parses JSON from command output, ignoring leading/trailing noise.
 *
 * @param {string} output Command stdout.
 * @return {Object} Parsed JSON object.
 */
function parseJsonFromOutput( output ) {
	const start = output.indexOf( '{' );
	const end = output.lastIndexOf( '}' );

	if ( start === -1 || end === -1 ) {
		throw new Error(
			`Could not parse wp-env status JSON. Output:\n${ output }`
		);
	}

	return JSON.parse( output.slice( start, end + 1 ) );
}

/**
 * Resolves the host path to `wp-content/debug.log` for the wp-env site under test.
 *
 * @since 0.2.0
 *
 * @return {string} Absolute path to debug.log.
 */
export function getDebugLogPath() {
	if ( cachedDebugLogPath ) {
		return cachedDebugLogPath;
	}

	const command = getWpEnvStatusCommand();
	let output;

	try {
		output = execSync( command, {
			encoding: 'utf8',
			stdio: [ 'pipe', 'pipe', 'pipe' ],
		} );
	} catch ( error ) {
		const stderr =
			error instanceof Error && 'stderr' in error ? error.stderr : '';
		throw new Error(
			`Failed to resolve debug.log via \`${ command }\`. Is wp-env running?\n${
				stderr || error
			}`
		);
	}

	const status = parseJsonFromOutput( output );
	const installPath = status.installPath || status.workDirectoryPath;

	if ( ! installPath ) {
		throw new Error(
			`wp-env status JSON did not include installPath. Output:\n${ output }`
		);
	}

	cachedDebugLogPath = path.join(
		installPath,
		getWpEnvWordPressDirName(),
		'wp-content',
		'debug.log'
	);

	return cachedDebugLogPath;
}

/**
 * Returns PHP Notice/Warning/Deprecated/Parse error/Fatal error lines from log text.
 *
 * Other `error_log()` output is ignored.
 *
 * @since 0.2.0
 *
 * @param {string} content Log file contents (or a suffix of it).
 * @return {string[]} Matching lines.
 */
export function extractPhpErrorLines( content ) {
	return content
		.split( /\r?\n/ )
		.filter( ( line ) => PHP_ERROR_LINE.test( line ) );
}

/**
 * Reads new bytes from a file starting at a byte offset.
 *
 * @param {string} filePath File path.
 * @param {number} offset   Byte offset.
 * @return {{ content: string, newOffset: number }} New content and updated offset.
 */
function readFromOffset( filePath, offset ) {
	try {
		const fd = fs.openSync( filePath, 'r' );

		try {
			const { size } = fs.fstatSync( fd );

			if ( size <= offset ) {
				return { content: '', newOffset: size };
			}

			const length = size - offset;
			const buffer = Buffer.alloc( length );
			fs.readSync( fd, buffer, 0, length, offset );

			return { content: buffer.toString( 'utf8' ), newOffset: size };
		} finally {
			fs.closeSync( fd );
		}
	} catch ( error ) {
		if (
			error &&
			typeof error === 'object' &&
			'code' in error &&
			error.code === 'ENOENT'
		) {
			return { content: '', newOffset: 0 };
		}

		throw error;
	}
}

/**
 * Truncates debug.log when possible. If the file cannot be written (permissions),
 * existing content is skipped by returning its current size as the baseline offset.
 *
 * @since 0.2.0
 *
 * @param {string} [filePath] Path to debug.log. Resolved from wp-env when omitted.
 * @return {number} Byte offset to treat as the start of new log output.
 */
export function resetDebugLog( filePath = getDebugLogPath() ) {
	try {
		fs.writeFileSync( filePath, '' );
		return 0;
	} catch ( error ) {
		if (
			error &&
			typeof error === 'object' &&
			'code' in error &&
			error.code === 'ENOENT'
		) {
			return 0;
		}

		try {
			return fs.statSync( filePath ).size;
		} catch {
			return 0;
		}
	}
}

/**
 * @typedef {Object} PhpDebugLogTracker
 * @property {() => void}                 ignoreExisting       Ignore lines already in the log.
 * @property {(context?: string) => void} assertNoNewPhpErrors Fail if matching PHP lines were appended.
 */

/**
 * Creates a tracker that attributes new debug.log PHP errors to a test or setup phase.
 *
 * @since 0.2.0
 *
 * @param {string} [filePath] Path to debug.log. Resolved from wp-env when omitted.
 * @return {PhpDebugLogTracker} Tracker instance.
 */
export function createPhpDebugLogTracker( filePath = getDebugLogPath() ) {
	let offset = 0;

	return {
		ignoreExisting() {
			try {
				offset = fs.statSync( filePath ).size;
			} catch {
				offset = 0;
			}
		},
		assertNoNewPhpErrors( context = '' ) {
			const { content, newOffset } = readFromOffset( filePath, offset );
			offset = newOffset;
			const lines = extractPhpErrorLines( content );

			if ( lines.length ) {
				const prefix = context ? `${ context }\n` : '';
				throw new Error(
					`${ prefix }PHP errors written to debug.log:\n${ lines.join(
						'\n'
					) }`
				);
			}
		},
	};
}

/**
 * Whether an error is a JSON parse failure (typically PHP output in a REST body).
 *
 * @param {unknown} error Caught error.
 * @return {boolean} True when the error looks like invalid JSON.
 */
function isJsonSyntaxError( error ) {
	if ( error instanceof SyntaxError ) {
		return true;
	}

	if ( ! error || typeof error !== 'object' ) {
		return false;
	}

	const name = 'name' in error ? error.name : '';
	const message = 'message' in error ? String( error.message ) : '';

	return (
		name === 'SyntaxError' ||
		/Unexpected token|not valid JSON|JSON\.parse/i.test( message )
	);
}

/**
 * Wraps `requestUtils.rest()` so a JSON `SyntaxError` explains that PHP likely
 * printed into the response body.
 *
 * @since 0.2.0
 *
 * @param {import('@wordpress/e2e-test-utils-playwright').RequestUtils} requestUtils Gutenberg request utils.
 */
export function wrapRequestUtilsRest( requestUtils ) {
	if ( requestUtils[ REST_WRAPPED ] ) {
		return;
	}

	const originalRest = requestUtils.rest.bind( requestUtils );

	requestUtils.rest = async ( options ) => {
		try {
			return await originalRest( options );
		} catch ( error ) {
			if ( isJsonSyntaxError( error ) ) {
				const restPath = options?.path ?? '';
				const originalMessage =
					error instanceof Error ? error.message : String( error );

				throw new Error(
					`REST \`${ restPath }\` returned non-JSON; a PHP notice was likely printed into the response; see debug.log.\n${ originalMessage }`
				);
			}

			throw error;
		}
	};

	requestUtils[ REST_WRAPPED ] = true;
}
