1.24.0 / 2025-05-28
=================
 - [New] add `ES2025` (#159)
 - [New] `ES2023`+: add `GetNamedTimeZoneEpochNanoseconds`, `GetUTCEpochNanoseconds`, `IsTimeZoneOffsetString`
 - [New] `ES2015`+: `CharacterRange`: also accept CharSets
 - [New] `ES2024`+: add `AllCharacters`, `CharacterComplement`
 - [Refactor] StringIndexOf: anticipate ES2025 not found sentinel change
 - [Deps] update `stop-iteration-iterator`
 - [Tests] increase coverage

1.23.10 / 2025-05-21
=================
 - [Fix] properly handle Float16Array
 - [Fix] `ES2024`+: `IsViewOutOfBounds`: properly handle resizable array buffers
 - [Fix] `ES2024`+: `IsTypedArrayOutOfBounds`: properly handle resizable arrays
 - [Fix] `ES2024`+: `GetViewByteLength`, `TypedArrayByteLength`, `TypedArrayLength`: properly handle resizable arrays
 - [Fix] `ES2020`+: `abs` should accept bigints too
 - [Fix] `ES2024`+: `ArrayBufferByteLength`: return the byte length for SABs, not NaN
 - [Fix] `ES2024`+: `ArrayBufferCopyAndDetach`: properly handle resizable ArrayBuffers; add tests
 - [Fix] `ES2021`: `SetTypedArrayFromTypedArray`: get proper source element size
 - [Fix] `ES2023`+: `SetTypedArrayFromTypedArray`: ArrayBuffer shouldn‘t be bound
 - [Fix] `ES2022`,`ES2023`: `ValidateIntegerTypedArray`: return the buffer
 - [patch] `ES2023`+: `SortIndexedProperties`: improve error message
 - [patch] clean up some comments
 - [patch] `ES2023`+: `InternalizeJSONProperty`: remove extra argument
 - [patch] `ES2020`+`: `GetIterator`: fix comment to indicate that it changed in ES2018
 - [Refactor] Typed Array stuff: store "choices" string in the table file
 - [Refactor] `ES2021`+: use isInteger directly in a few AOs
 - [Refactor] `ES2022`+: `ValidateAndApplyPropertyDescriptor`: use `typeof` over `Type()`
 - [Refactor] `helpers/getIteratorMethod`: no longer require a passed-in `IsArray`
 - [Refactor] `ES2017`+: `Num{ber,eric}ToRawBytes`, `RawBytesToNum{ber,eric}`: use TAO table sizes
 - [Refactor] `ES2015`+: `{,Ordinary}ObjectCreate`: prefer `__proto__` syntax over `Object.create`
 - [Refactor] `CopyDataProperties` tests are the same in ES2020 as in ES2018
 - [Refactor] `ES2016` - `ES2020`: `UTF16Encoding`: match `UTF16EncodeCodePoint`
 - [Refactor] use `es-object-atoms/isObject` directly
 - [Refactor] add `isSameType` helper, and use it
 - [Refactor] `ES2017`+: `WordCharacters`: `String.prototype.indexOf` should always be present
 - [Refactor] use `arr[arr.length] = x` instead of `$push(arr, x)`
 - [Robustness] `ES2015`+: `ObjectDefineProperties`: use `OrdinaryGetOwnProperty` to handle a missing `gOPD`
 - [meta] add missing comments
 - [meta] fix operations npmignores
 - [meta] fix URL in comment
 - [meta] note `isNegativeZero` helper is slated for removal (#155)
 - [Deps] update `call-bound`, `which-typed-array`, `es-object-atoms`, `get-intrinsic`, `get-proto`, `regexp.prototype.flags`, `is-weakref`, `object-inspect`
 - [Dev Deps] pin `glob` to v7
 - [Dev Deps] update `@unicode/unicode-15.0.0`, `es-value-fixtures`, `for-each`, `has-strict-mode`, `ses`
 - [Tests] avoid an OOM in node 20 on SES tests
 - [Tests] compare correct TA type
 - [Tests] consolidate map of AO property names to prose names
 - [Tests] extract common helpers
 - [Tests] increase coverage
 - [Tests] increase coverage
 - [Tests] node 20 throws with RABs that are not a multiple of 4 and 8
 - [Tests] refactor TA types arrays to year-taking functions
 - [Tests] refactor test megafile into file-per-method tests
 - [Tests] remove now-unused test mega-file
 - [Tests] some cleanups
 - [Tests] use proper import

1.23.9 / 2025-01-02
=================
  * [Refactor] use `get-proto` directly
  * [Refactor] use `set-proto` directly
  * [Refactor] use `Reflect.setPrototypeOf` and `dunder-proto` in `setProto` helper
  * [Refactor] `ES2015`+: `ArrayCreate`: use `setProto` helper
  * [Deps] update `es-set-tostringtag`, `own-keys`
  * [Dev Deps] update `is-core-module`
  * [Tests] use `own-keys` directly

1.23.8 / 2024-12-28
=================
  * [Refactor] use `own-keys`
  * [Refactor] use `safe-push-apply`

1.23.7 / 2024-12-20
=================
  * [Refactor] create and use `helpers/isPropertyKey`
  * [Refactor] add `timeValue` helper, use it
  * [Deps] update `array-buffer-byte-length`, `data-view-buffer`, `data-view-byte-length`, `data-view-byte-offset`, `function.prototype.name`, `get-symbol-description`, `is-array-buffer`, `is-shared-array-buffer`, `is-typed-array`, `math-intrinsics`, `object.assign`, `typed-array-buffer`, `typed-array-byte-length`, `typed-array-byte-offset`, `unbox-primitive`, `which-typed-array`
  * [Deps] remove unused dep
  * [Dev Deps] update `array.prototype.indexof`, `has-bigints`, `is-registered-symbol`, `safe-bigint`

1.23.6 / 2024-12-15
=================
  * [Fix] `ES2015` - `ES2019`: `IntegerIndexedElementSet`: reject BigInt Typed Arrays prior to ES2020
  * [Fix] `ES2023`+: `SetTypedArrayFromTypedArray`: provide missing `cloneConstructor` argument to `CloneArrayBuffer`
  * [Fix] `ES2024`+: `FindViaPredicate`: spec enums are uppercase now
  * [Fix] `ES2017` - `ES2019`: `SetValueInBuffer`: handle proper number of arguments
  * [Fix] `ES2015`+: `QuoteJSONString`: properly handle surrogates
  * [Fix] `ES2015`+: `TestIntegrityLevel`: properly handle envs without property descriptors
  * [patch] `ES2018` - `ES2023`: `thisSymbolValue`: only require `Symbol.prototype.valueOf` for boxed Symbols
  * [Robustness] `ES2015` - `ES2016`: `SetValueInBuffer`: salt dictionary keys in case of pre-proto envs
  * [Refactor] use `math-intrinsics`
  * [Refactor] use `call-bound` directly
  * [Refactor] `ES2015`+: `GetIterator`: hoist an object to module scope
  * [Refactor] use `typeof` over `Type()` when possible
  * [Refactor] `ES2015` - `ES2016`: `GetValueFromBuffer`: remove unnecessary extra helper argument
  * [Refactor] misc cleanups
  * [Refactor] make and use `isObject` helper
  * [Refactor] `ES5`+: `MonthFromTime`: throw a `RangeError` for an out of range timestamp
  * [Refactor] use `+` over `Number()`
  * [Deps] update `arraybuffer.prototype.slice`, `call-bind`, `es-define-property`, `es-to-primitive`, `function.prototype.name`, `get-intrinsic`, `gopd`, `has-proto`, `has-symbols`, `internal-slot`, `is-data-view`, `is-regex`, `is-string`, `which-typed-array`, `is-weakref`, `safe-array-concat`, `safe-regex-test`, `string.prototype.trim`, `string.prototype.trimend`, `typed-array-byte-offset`, `typed-array-length`
  * [meta] remove unnecessary unspackles
  * [Tests] `isStringOrUndefined`: increase coverage
  * [Tests] bigint tests are ES2020+ only
  * [Dev Deps] update `array.prototype.flatmap`, `is-core-module`, `is-registered-symbol`

1.23.5 / 2024-11-14
=================
  * [Fix] `ES2015`+: `CompletionRecord`: ensure `?` works on any non-abrupt completion

1.23.4 / 2024-11-12
=================
  * [Fix] `ES2024`+: Iterator Records can now have non-functions in `[[NextMethod]]`
  * [meta] update spec URL comments
  * [Deps] update `globalthis`, `object-inspect`, `regexp.prototype.flags`
  * [Dev Deps] update `@ljharb/eslint-config`, `@unicode/unicode-15.0.0`, `diff`, `es-value-fixtures`, `is-core-module`, `mock-property`, `ses`, `tape`
  * [actions] split out node 10-20, and 20+
  * [Tests] switch to `npm audit` from `aud`
  * [Tests] use `.assertion` instead of monkeypatching tape
  * [Tests] increase coverage

1.23.3 / 2024-03-29
=================
  * [Fix] `ES2024`: `StringPad`, `StringPaddingBuiltinsImpl`: prefer uppercase spec enums
  * [Fix] `helpers/bytesAsInteger`: avoid a crash in node 10.4 - 10.8
  * [Fix] `ES5`: `CheckObjectCoercible`: restore `optMessage` optional arg
  * [Refactor] `ES2022`+: update `TimeString` to use `ToZeroPaddedDecimalString`
  * [Robustness] use cached copies of builtins
  * [Deps] update `string.prototype.trimstart`, `typed-array-length`
  * [Dev Deps] update `array.from`, `array.prototype.filter`, `array.prototype.indexof`, `object.fromentries`, `safe-bigint`

1.23.2 / 2024-03-17
=================
  * [Fix] `records/regexp-record`: add optional `[[UnicodeSets]]` boolean field
  * [Fix] `ES2024`+: `AddValueToKeyedGroup`: avoid adding matched values twice
  * [Fix] `ES5`: `CheckObjectCoercible`: use the right function name
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
  * [Deps] update `array-buffer-byte-length`, `arraybuffer.prototype.slice`, `available-typed-arrays`, `call-bind`, `es-set-tostringtag`, `get-intrinsic`, `get-symbol-description`, `has-proper    ty-descriptors`, `has-property-descriptors`, `hasown`, `internal-slot`, `is-array-buffer`, `is-typed-array`, `object.assign`, `regexp.prototype.flags`, `safe-array-concat`,