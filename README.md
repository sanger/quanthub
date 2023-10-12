# QuantHub

Does what it says on the tin.

## Project setup

```shell
yarn install
```

Added @achrinza/node-ipc@10.1.9(which already exists as part of the package dependency tree) to package.json
resolutions to fix the version incompatibility issue with node.

### Compiles and hot-reloads for development

```shell
yarn run serve
```

Added --openssl-legacy-provide to NODE_OPTIONS on serve and build scripts in package.json to resolve the error:0308010C:digital envelope routines::unsupported discussed here https://github.com/vuejs/vue-cli/issues/6770. This can be removed later when the issue is resolved.

### Compiles and minifies for production

```shell
yarn run build
```

### Lints and fixes files

```shell
yarn lint
yarn prettify
```

It is also possible to [configure your editor](https://prettier.io/docs/en/editors.html)
to run prettier automatically on save

### Run your unit tests

```shell
yarn run test:unit
```

### Run your end-to-end tests

```shell
yarn run test:e2e
```
