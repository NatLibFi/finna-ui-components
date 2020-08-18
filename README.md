# Finna UI Component Library Proto

## Cloning the repository

```
git clone git@github.com:mikkojamG/ui-component-library-proto.git
```

## Preinstallation

### Environment

Create `.env` file from the provided `.env.example` file. Fill in paths for environment variables `THEMES_ROOT` and `THEME_DIRECTORY` if they differ from the defaults.

_Make sure that paths are relative to working theme._

### Imports

Component library imports components to `components.less` file under the working theme directory. If the file does not exist, it will be created on install.

Make sure to import `components.less` to your main Less file, e.g. `finna.less`.

## Installation

Running the script installs development dependencies, Pattern Lab and as a default creates symbolic link from the library source components to your working theme directory.

```
yarn
```

or

```
npm install
```

### Vagrant

When working with symlinked components, you need to make adjustment to `Vagrantfile` in your local [NDL-VuFind2-Vagrant](https://github.com/NatLibFi/NDL-VuFind2-Vagrant) repository.

Add path to your local component library repository where NFS paths are defined:

```
ubuntu.vm.synced_folder VufindPath, MountPath, type: "nfs"
ubuntu.vm.synced_folder "../YOUR_LOCAL_COMPONENT_LIBRARY_NAME", "/YOUR_LOCAL_COMPONENT_LIBRARY_NAME", type: "nfs"
```

Make sure to reload your Vagrant instance if already running.

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

### Link theme

Create a symbolic links between source components and working theme directory.

```
yarn link:theme
```

or

```
npm run link:theme
```

### Copy theme

Alternative to linking theme, copy source components to working theme.

```
yarn copy:theme
```

or

```
npm run copy:theme
```

### Unlink theme

Unlink or remove components from working theme directory.

```
yarn unlink:theme
```

or

```
npm run unlink:theme
```

## engine-phtml

[https://github.com/aleksip/engine-phtml](https://github.com/aleksip/engine-phtml)
