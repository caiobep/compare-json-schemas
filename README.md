# Compare Schemas

[![Node.js CI](https://github.com/caiobep/compare-schemas/actions/workflows/publish.yml/badge.svg)](https://github.com/caiobep/compare-schemas/actions/workflows/publish.yml) [![codecov](https://codecov.io/gh/caiobep/compare-schemas/branch/main/graph/badge.svg?token=2HV1498TU2)](https://codecov.io/gh/caiobep/compare-schemas)

> A simple CLI tool to help you compare multiple JSON/JSONC/Yaml files to check if your missing an specific key

## Usage

Make sure you have [Node.js](https://nodejs.org/en/download/) and [npm](https://www.npmjs.com) installed.

```
npm install -g compare-schemas
compare-schemas ./file1.json ./file2.json
```
or 

```sh
npx compare-schemas ./file1.json ./file2.json ./file3.yml
```

### How is this different from tools like the brilliant [ajv-cli](https://github.com/ajv-validator/ajv-cli) and [jsonlint-cli](https://github.com/marionebl/jsonlint-cli)

This project dynamically generates a schema based on existing json files, meaning you don't need to write a proper schema file in order for it to work. Simply pass the file you want to extract the schema from as first argument, and that's it. There's no step 2. 

## License 
This project is licensed under MIT. You can get more information at the [License file](./LICENSE)
