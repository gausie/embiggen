# embiggen

![embiggen](assets/embiggen.png)

Efficient buffing for KoLmafia. Given target modifier values, `embiggen` finds
the cheapest combination of item and skill effect sources to reach them.

Once installed, run `embiggen help` in the KoLmafia CLI for usage.

## Development

```
npm install            # install dependencies
npm run build          # bundle to dist/scripts/embiggen/embiggen.js
npm run install-mafia  # build and symlink into your local KoLmafia scripts
npm test               # run the test suite
npm run typecheck      # type-check without emitting
npm run lint           # eslint + prettier
```
