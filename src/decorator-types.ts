// These utilities gloss over the fact that we're using babel's legacy
// decoratory implementation but typescript needs to think they're typescript
// decorators.

export type BabelDecorator = (
  target: object,
  fieldName: string,
  descriptor: PropertyDescriptor,
) => PropertyDescriptor;

export function babelToTSDecorator(fn: BabelDecorator): PropertyDecorator {
  return fn as unknown as PropertyDecorator;
}
