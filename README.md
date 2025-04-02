# 🧪 Polylang E2E Test Utils

This package provides shared E2E testing utilities for Polylang projects.

## 📦 Installation

```bash
npm install --save-dev @wpsyntex/e2e-test-utils
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

#### 🔧 Additional Exports

##### `globalSetup`

Global setup function for Playwright tests. Ensures fixtures are deleted and global context is set up properly.

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
