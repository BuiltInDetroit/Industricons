# Industricons

**Icons for industrial applications and more.**

## Development

### Setup

1. Install [Node.js](https://nodejs.org/en). Ensure that the minimum Node.js version is installed per the root "package.json" file.
1. If Node.js was installed on a macOS machine with Homebrew, install "corepack" with `brew install corepack`.
1. Run `corepack enable`.
1. Run `pnpm install`.
1. Create a Python virtual environment. Visual Studio Code offers a convenient `Python: Create Environment...` option in the Command Palette that will create a virtual environment in the repository root.
1. Activate the Python virtual environment, if not active already.

### Building

```sh
pnpm run build
```

To launch a local server to preview the icons, run:

```sh
pnpm run serve
```

The icon gallery website can be then viewed locally by visiting [http://127.0.0.1:8080](http://127.0.0.1:8080).

## Attributions

This project started out as a fork of the [IBM Carbon Project](https://carbondesignsystem.com) icons - an excellent set of general-purpose
icons representing various user actions, everyday objects and representations of technology. Icons that represent IBM branding and IBM-specific
products have been removed from the set.

Industricons add to this set by, primarily, incorporating icons representing various industrial and manufacturing objects and roles with a similar design style.

The [IBM Carbon Project](https://carbondesignsystem.com) is licensed under the Apache 2.0 License.

Changes to the IBM Carbon Project include:

- Removed icons that represent IBM branding and IBM-specific products.
- Some parts of the build scripts under the top-level 'scripts' directory were ported over to TypeScript and reused.

## Licenses

[Apache 2.0 License](./LICENSE).
