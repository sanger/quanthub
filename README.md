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
