# Finna UI Component Library Proto
## Cloning the repository
```
git clone git@github.com:mikkojamG/ui-component-library-proto.git
```

## Pre-installation
Create `.env` file from the provided example `.env.example` file. Fill in the path to your working theme directory.

## Installation

Running the script installs development dependencies, Pattern Lab and finally creates symbolic links between distributable components and your working theme directory.

```
yarn
```

or

```
npm install
```

## Scripts

### Development

Start the development server with hot reloading

```
yarn dev
```

or

```
npm run dev
```

### Build theme
Create a distributable components from the source directory.

```
yarn build:theme
```

or

```
npm run build:theme
```

### Link theme
Create a symbolic links between distributable components and working theme directory.
```
yarn link:theme
```
or
```
npm run link:theme
```

## engine-phtml
[https://github.com/aleksip/engine-phtml](https://github.com/aleksip/engine-phtml)
