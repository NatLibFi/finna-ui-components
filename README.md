# Finna UI Component Library Proto
## Cloning the repository
For working with just the component library, clone the repository as you normally would

```
git clone git@github.com:mikkojamG/ui-component-library-proto.git
```

To include it to your code base, navigate to your working directory and include component library as a submodule.

```
git submodule add git@github.com:mikkojamG/ui-component-library-proto.git
```

## Installation

Install development dependencies and Pattern Lab.

```
yarn
```

or

```
npm install
```

## Scripts

### Watch

Start the development server with hot reloading

```
yarn serve
```

or

```
npm run serve
```

### Build theme
Copy relevant patterns, scripts and styles from the component library under dedicated directories to your working theme.

```
yarn build:theme
```

or

```
npm run build:theme
```

## engine-phtml
[https://github.com/aleksip/engine-phtml](https://github.com/aleksip/engine-phtml)
