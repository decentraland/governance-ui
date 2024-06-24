<p align="center">
  <a href="https://governance.decentraland.org">
    <img alt="Decentraland" src="https://decentraland.org/images/logo.png" width="60" />
  </a>
</p>
<h1 align="center">
  Decentraland DAO Governance dApp
</h1>

The governance hub for the Decentraland ecosystem. Create and vote on proposals that help shape the future of the metaverse via the Decentraland DAO (Decentralized Autonomous Organization).

# Setup

Before you start make sure you have the [Backend](https://github.com/decentraland/governance) up and running

### Node version

use node >= `18`

If you are starting from scratch and you don't have Node installed in your computer, we recommend using a Node version manager like [nvm](https://github.com/nvm-sh/nvm) to install Node.js and npm instead of the Node installer.

`nvm install v18.8.0` will install node version 18 and the corresponding npm version.

**NOTE**

If you are using WSL (Windows Subsystem for Linux) as your development environment, clone the repository into the WSL filesystem. If you clone it inside the Windows filesystem, the project will not work.

Run `npm install` to install all the dependencies needed to run the project.

## Environment setup

Create a copy of `.env.example` and name it as `.env.development`

```bash
  cp .env.example .env.development
```

> to know more about this file see [the documentation](https://www.gatsbyjs.com/docs/how-to/local-development/environment-variables/#defining-environment-variables)


# Test

To run the tests you can do

```bash
npm test
```

or create a run configuration in your IDE with `jest --no-cache --no-watchman --runInBand`

Also, you can try adding the `--verbose` option.

The `--runInBand` parameter runs the tests in a single thread, which is usually faster, but you can try without it
and see what works best for you.

# Run

Once you setup this project you can start it using the following command

```bash
  npm start
```

The app should be running at https://localhost:5173/

## Copyright & License

This repository is protected with a standard Apache 2 license. See the terms and conditions in the [LICENSE](LICENSE) file.
