/* eslint-disable @typescript-eslint/no-empty-function */
export const repoMockFactory = (): any => ({
  find: () => {
  },
  findOne: () => {
  },
  findOneOrFail: () => {
  },
  create: (e: unknown) => e,
  save: (e: unknown) => e,
  delete: () => {
  },
  update: () => {
  },
});
