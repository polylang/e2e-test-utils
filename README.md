# 🧪 Polylang E2E Test Utils

This package provides shared E2E testing utilities for Polylang projects.

## 📦 Installation

```bash
npm install --save-dev polylang/e2e-test-utils
```

## 🚀 Usage

### ⚙️ Playwright configuration

Create a `playwright.config.js` file in your project's root:

```javascript
import { getPlaywrightConfig } from '@wpsyntex/e2e-test-utils';

export default getPlaywrightConfig( {
  // Override any default configuration here
  use: {
    // Custom use options
    globalSetup: require.resolve( 'path-to-your/global.setup.js' ), // Falls back to the packaged one.
  },
  webServer: {
    // Custom webServer options
  }
} );
```

#### Configuration Options

The `getPlaywrightConfig` function accepts an options object that can override any of the default configuration:

- `use`: Override default Playwright use options
- `webServer`: Override default webServer configuration
- Any other Playwright configuration options

#### Default Configuration

The default configuration includes:

- Chrome browser setup
- HTML reporter
- CI-specific settings
- Default storage state path
- Local development server configuration

### 📚 API Documentation

#### 🌐 Language Management Functions

##### `getAllLanguages( requestUtils )`
Retrieves a list of all configured languages in Polylang.
- **Parameters:**
  - `requestUtils`: Gutenberg request utils object
- **Returns:** Promise resolving to the list of languages

##### `getLanguage( requestUtils, slug )`
Retrieves a specific language by its slug.
- **Parameters:**
  - `requestUtils`: Gutenberg request utils object
  - `slug`: Language slug to retrieve
- **Returns:** Promise resolving to the language data

##### `createLanguage( requestUtils, locale )`
Creates a new language in Polylang.
- **Parameters:**
  - `requestUtils`: Gutenberg request utils object
  - `locale`: Language locale to create (e.g., 'fr_FR')
- **Returns:** Promise resolving to the created language

##### `deleteLanguage( requestUtils, slug )`
Deletes a specific language by its slug.
- **Parameters:**
  - `requestUtils`: Gutenberg request utils object
  - `slug`: Language slug to delete
- **Returns:** Promise resolving to the deletion result

##### `deleteAllLanguages( requestUtils )`
Deletes all configured languages except the default one.
- **Parameters:**
  - `requestUtils`: Gutenberg request utils object
- **Returns:** Promise resolving to the deletion results

#### ⚙️ Settings Management Functions

##### `getSettings( requestUtils )`
Retrieves all Polylang plugin settings.
- **Parameters:**
  - `requestUtils`: Gutenberg request utils object
- **Returns:** Promise resolving to the settings object

##### `setSetting( requestUtils, settingKey, settingValue )`
Updates a specific plugin setting.
- **Parameters:**
  - `requestUtils`: Gutenberg request utils object
  - `settingKey`: The key of the setting to update
  - `settingValue`: The new value for the setting
- **Returns:** Promise resolving to the updated setting

##### `resetAllSettings( requestUtils )`
Resets all plugin settings to their default values.
- **Parameters:**
  - `requestUtils`: Gutenberg request utils object
- **Returns:** Promise resolving to the reset operation result
- **Note:** Preserves the default language setting

#### 🏷️ Taxonomy Management Functions

##### `getAllTerms( requestUtils, taxonomy )`
Retrieves all terms for a specific taxonomy.
- **Parameters:**
  - `requestUtils`: Gutenberg request utils object
  - `taxonomy`: Taxonomy slug
- **Returns:** Promise resolving to the list of terms

##### `getTermBySlug( requestUtils, taxonomy, slug )`
Retrieves a specific term by its slug within a taxonomy.
- **Parameters:**
  - `requestUtils`: Gutenberg request utils object
  - `taxonomy`: Taxonomy slug
  - `slug`: Term slug to retrieve
- **Returns:** Promise resolving to the term data

##### `deleteAllTerms( requestUtils, taxonomy )`
Deletes all terms within a specific taxonomy.
- **Parameters:**
  - `requestUtils`: Gutenberg request utils object
  - `taxonomy`: Taxonomy slug
- **Returns:** Promise resolving to the deletion results

#### 📄 XLIFF Export Functions

##### `fillInXliffExportForm( page, options )`
Fills in the XLIFF export form for bulk translation export.
- **Parameters:**
  - `page`: Playwright page object
  - `options`: Configuration object
    - `postId`: Post ID to export
    - `postTitle`: Post title to select
    - `languageName`: Target language name
- **Returns:** Promise that resolves when the export form is submitted
- **Note:** Page should be on the post list table

##### `getXliffRegex( sourceLocale, targetLocale )`
Returns a regex pattern to match XLIFF file names with the specified locales and timestamp.
- **Parameters:**
  - `sourceLocale`: Source language locale (e.g., 'en_US')
  - `targetLocale`: Target language locale (e.g., 'fr_FR')
- **Returns:** RegExp object to match XLIFF file names
- **Note:** Converts underscores to hyphens in locales and matches timestamp pattern

#### 📥 Download Utilities

##### `getDownload( page, submitButtonOptions )`
Returns a download promise by clicking a submit button and waiting for the download to start.
- **Parameters:**
  - `page`: Playwright page object
  - `submitButtonOptions`: Submit button options (default: `{ name: 'Submit' }`)
- **Returns:** Promise resolving to the download object

##### `getStringFromFile( filePath )`
Reads a file and returns its contents as a string.
- **Parameters:**
  - `filePath`: The file path to read
- **Returns:** String content of the file

#### 🔧 Additional Exports

##### `globalSetup`

Global setup function for Playwright tests. Ensures fixtures are deleted and global context is set up properly.

#### 👤 User Utilities

##### `createTranslator( langSlugs, userName = '' )`

Creates a translator user, based on the `editor` role.

- **Parameters:**
  - `langSlugs`: List of language slugs.
  - `userName`: Optional. A user name. Defaults to `XX-YY-translator`, where `XX` and `YY` are language slugs.
- **Returns:** Promise resolving to a user object containing ID, user name, and password.

##### `switchToUser( user, admin, requestUtils )`

Switches to the given user.

- **Parameters:**
  - `user`: The user to switch to (an object containing a user name and a password).
  - `admin`: Instance of `Admin`.
  - `requestUtils`: Gutenberg request utils object.
- **Returns:** Promise resolving to the `Page` object.

#### 💡 Usage Example

```javascript
import {
  createLanguage,
  setSetting,
  getAllTerms
} from '@wpsyntex/e2e-test-utils';

// Create a new language
await createLanguage( requestUtils, 'fr_FR' );

// Update a setting
await setSetting( requestUtils, 'hide_default', true );

// Get all terms from a taxonomy
const terms = await getAllTerms( requestUtils, 'category' );
```

All these functions are designed to work with the Gutenberg request utils object and follow REST API patterns for interacting with Polylang's functionality. They provide a comprehensive set of tools for managing languages, settings, and taxonomies in E2E tests.
