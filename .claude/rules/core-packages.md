`packages/core/<name>` packages are named `@wippa/core-<name>` (e.g. `packages/core/utils` → `@wippa/core-utils`).

**One exception: `packages/core/shared` keeps the name `@wippa/shared`** (NOT `core-shared`). It is the one *thick, app-level* member of the folder — it carries heavy deps (`dayjs`, `expr-eval`, `socket.io-client`) and DB/EE/management schemas, and it *depends on* the thin members. The folder holds all cross-cutting library code ordered thin → thick: `utils`, `piece-types`, `formula`, `execution` (thin, bundleable) then `shared` (thick).

The thin members (`core-utils`, `core-piece-types`, `core-formula`, `core-execution`) are framework-agnostic foundation libraries: they MUST NOT import from `@wippa/shared`, `@wippa/server-*`, any piece package, or any web/React package. The dependency graph must stay acyclic, and these thin members ship dual-format (CJS + ESM) with `"sideEffects": false`.

**Import boundary (enforced per-package, not by folder name):** pieces and the engine may import `@wippa/core-utils | core-piece-types | core-formula | core-execution`, but **never** `@wippa/shared` (`packages/core/shared`). Pieces get the symbols they need re-exported through `@wippa/pieces-framework`.
