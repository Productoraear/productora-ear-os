the right function name
  * [Fix] `ES2024`+: `AddEntriesFromIterable`, `GetIterator`, `GroupBy`: properly capitalize spec enums
  * [Deps] update `string.prototype.trim`, `string.prototype.trimend`
  * [Tests] increase coverage

1.23.1 / 2024-03-16
=================
  * [Refactor] use `es-object-atoms`
  * [Deps] update `hasown`, `which-typed-array`, `data-view-byte-length`, `safe-array-concat`
  * [Dev Deps] update `diff`

1.23.0 / 2024-03-04
=================
  * [New] add `ES2024`
  * [New] `ES2015`+: add `InternalizeJSONProperty`
  * [New] `ES2015`+: add `IntegerIndexedElement{Get,Set}`
  * [New] `ES2018`+: add `TimeZoneString`
  * [New] `ES2022`+: add `DefineMethodProperty`
  * [New] `ES2023`: add `DefaultTimeZone`
  * [Fix] `ES2023`+: `SetTypedArrayFrom{TypedArray,ArrayLike}`: match engine reality
  * [Fix] `ES2024`+: `GetViewByteLength`, `IsViewOutOfBounds`: support engines with only own DV properties
  * [Tests] use `safe-bigint`

1.22.5 / 2024-02-28
=================
  * [Fix] `ES2015`+: `DetachArrayBuffer`: node v21.0.0+ structuredClone throws with an already-detached ArrayBuffer
  * [Fix] `helpers/assertRecord`: partial revert of 87c340d2; unintentional breaking change
  * [patch] records: fix indentation, improve object checks
  * [Refactor] extract TA tables to separate files
  * [meta] extract "list spackled files" to separate run-script
  * [Deps] update `available-typed-arrays`, `es-set-tostringtag`, `has-proto`, `is-negative-zero`, `is-shared-array-buffer`, `typed-array-buffer`, `typed-array-byte-length`, `typed-array-byte-offset`, `typed-array-length`
  * [Dev Deps] update `available-regexp-flags`, `tape`
  * [Dev Deps] pin `jackspeak` and `glob`, since v2.1.2+ and v10.3.8+ respectively depend on npm aliases, which kill the install process in npm < 6
  * [Tests] use `define-{accessor,data}-property`
  * [Tests] fix some test cases
  * [Tests] use `safeBigInt` for `Z()` pattern to handle node 10.4 - 10.8

1.22.4 / 2024-02-13
=================
  * [Fix] `ES2017`+: `IsDetachedBuffer`: properly allow SABs
  * [Fix] `ES2022`+: `ToBigInt`: properly throw on an unparseable string
  * [Fix] `ES2015`+: `ValidateTypedArray`: proper detachment check and return value
  * [Fix] `ES2022`+: `GetSubstitution`: match updated semantics
  * [Refactor] prefer `typeof` over `Type()`, except for Object, where possible
  * [Refactor] use `es-errors` instead of `get-intrinsic` where possible
  * [Refactor] use `es-define-property`
  * [Refactor] records: extract predicates to individual files
  * [Refactor] `ES2015`+: `Canonicalize`, `WordCharacters`: use explicit `.json` extension for imports
  * [Deps] update `array-buffer-byte-length`, `arraybuffer.prototype.slice`, `available-typed-arrays`, `call-bind`, `es-set-tostringtag`, `get-intrinsic`, `get-symbol-description`, `has-proper    ty