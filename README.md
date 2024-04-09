# Industricons

**Icons for industrial applications and more.**

## Overview

TODO: Add documentation here.

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

## Attributions

The following are adapted from the [IBM Carbon Project](https://carbondesignsystem.com) which is licensed under the Apache 2.0 License:

- Some build scripts under the top-level 'scripts' directory.
- The master Adobe Illustrator template under the top-level 'master' directory.
- The templates under the 'src/templates' directory.

## Licenses

[Apache 2.0 License](./LICENSE).
