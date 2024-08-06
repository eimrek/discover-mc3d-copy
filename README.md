# MC3D discover section

Materials Cloud discover section for the Materials Cloud 3D crystals database (MC3D).

## Development

For local development:

```
> npm install
> npm run dev
```

To publish the local version to GitHub pages:

```
> npm run deploy
```

## Deployment

This repository is deployed automatically via Github pages, using the `gh-pages` branch in the following manner:

- `main` branch is deployed to the root of `gh-pages`, available at https://mc3d.materialscloud.org.
- `develop` and any PR branches are deployed to `/dev` folder in the `gh-pages`, available at
  - https://mc3d.materialscloud.org/dev/develop
  - https://mc3d.materialscloud.org/dev/pr1
  - ...
