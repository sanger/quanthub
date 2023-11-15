# QuantHub

Does what it says on the tin.

## Project setup

To install dependencies and to ignore old version dependencies to avoid errors - https://stackoverflow.com/questions/66239691/what-does-npm-install-legacy-peer-deps-do-exactly-when-is-it-recommended-wh

```shell
npm install --include=dev --legacy-peer-deps
```

Added @achrinza/node-ipc@10.1.9(which already exists as part of the package dependency tree) to package.json
resolutions to fix the version incompatibility issue with node.

### Compiles and hot-reloads for development

```shell
npm run serve
```

Added --openssl-legacy-provide to NODE_OPTIONS on serve and build scripts in package.json to resolve the error:0308010C:digital envelope routines::unsupported discussed here https://github.com/vuejs/vue-cli/issues/6770. This can be removed later when the issue is resolved.

### Compiles and minifies for production

```shell
npm run build
```

### Lints and fixes files

```shell
npm run lint
```

To fix the errors

```shell
npm run lint -- --fix
```

For prettier

```shell
npm run prettier-check
```

To fix the errors

```shell
npm run prettify
```

It is also possible to [configure your editor](https://prettier.io/docs/en/editors.html)
to run prettier automatically on save

### Run your unit tests

```shell
npm run test:unit
```

### Run your end-to-end tests

```shell
npm run test:e2e
```
