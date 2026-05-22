// These utilities gloss over the fact that we're using babel's legacy
// decoratory implementation but typescript needs to think they're typescript
// decorators.

function babelToTSDecorator(fn) {
  return fn;
}

export { babelToTSDecorator };
//# sourceMappingURL=decorator-types.js.map
