# Arcadia Common FE
Arcadia Common frontend components, services, utils, etc.
This package was created to extract reusable parts of the Arcadia's frontend applications to avoid code duplications and copy-pasting between projects.

### Note: This package is not an independent Project, it needs to be installed as a dependency, for example, we usually install open-source NPM packages from NPM registry.
You can simply publish it to the NPM registry or use it like a local NPM package.

## Basic Setup
These are steps required before further steps.

### Machine Requirements
You need to have installed:
- [Node.js](https://nodejs.org/en/)
- [NPM Package manager](https://www.npmjs.com/)

### Install
Let's image next folder structure:
arcadia/
├── arcadia.common.fe/
│   ├── package.json
├── arcadia.backoffice.fe/
    ├── package.json

Go to the "/arcadia.backoffice.fe/"
```sh
cd /arcadia.backoffice.fe/
```

Install "arcadia.common.fe" package as local dependency
```sh
npm i ./../arcadia.common.fe
```

Then you can use it like regular NPM Package, for example:
```javascript
import { Button } from 'arcadia.common.fe';
```

If you want to re-build each time something changed just run: `npm start` in the `/arcadia.common.fe`.

## Useful Commands

`npm run clean` -
Removes Production Build folder `~/dist/`.

`npm run lint` -
Checks Project for ESLint errors and warnings.

`npm run lint:fix` -
Automatically resolve as much as possible ESLint errors. If not all resolved will throw an error.

`npm run stylelint` -
Checks Project for SCSS or CSS stylelint errors and warnings.

`npm run stylelint:fix` -
Automatically resolve as much as possible stylelint errors and warnings. If not all resolved will throw an error.

## License
Project is licensed under the [MIT](https://opensource.org/licenses/MIT) license.
