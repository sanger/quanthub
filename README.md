[![codecov](https://codecov.io/gh/sanger/quanthub/graph/badge.svg?token=kdVGmZMeUr)](https://codecov.io/gh/sanger/quanthub)

# ![QuantHub Logo](src/assets/logo-32x32.png) QuantHub

Does what it says on the tin.

## Project setup

To install dependencies and to ignore old version dependencies to avoid errors - https://stackoverflow.com/questions/66239691/what-does-npm-install-legacy-peer-deps-do-exactly-when-is-it-recommended-wh

```shell
npm install --include=dev --legacy-peer-deps
```

Added @achrinza/node-ipc@10.1.9(which already exists as part of the package dependency tree) to package.json
resolutions to fix the version incompatibility issue with node.

## Running

In the project directory, you can run:

    npm run start

To run the app and have hot-reloads for development, this internally run serve and serve:css commands

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

## Building

To build the app for production, run:

```shell
./compile-build.sh release.tar.gz dist
```

This runs the npm build script and then compiles the build into a tarball, including the revision number.

The build executes in `production` [mode by default](https://vitejs.dev/guide/env-and-mode#modes) and includes environment variables from the `.env.production` file.
Environment variables not specified in the `.env.production` file will fall back to values in the `.env` file if they exist.

## Deployment

Deployment is handled by the Deployment project, as usual, however it should be noted that context-specific environment variables undergo a string replacement process during deployment. All environment variables with the prefix `REPLACE_` are replaced with the corresponding values in the Deployment project at deployment time using GNU `awk`'s `gsub` function.

As of June 2024, Quanthub is hosted on the SS load balancers.

## Notes

A predefined list of printers is used for the printer selection dropdown. This list is defined in the file `src/config/printers.json`. Additional printers, such as the logging printer `stub`, can be added to this list by setting the environment variable `VITE_CUSTOM_PRINTERS` to a comma-separated list of printer names, e.g. `VITE_CUSTOM_PRINTERS=stub,printer1,printer2`.

## Attributions

Abacus Logo sourced from [Twemoji](https://github.com/twitter/twemoji) licensed under [CC-BY 4.0](https://creativecommons.org/licenses/by/4.0/) and converted to favicon using [favicon.io](https://favicon.io/emoji-favicons/abacus/)
