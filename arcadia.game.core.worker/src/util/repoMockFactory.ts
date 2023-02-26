export const repoMockFactory = () => ({
  find: () => null,
  findOne: () => null,
  findOneOrFail: () => null,
  create: (e: unknown) => e,
  save: (e: unknown) => e,
  delete: () => null,
  update: () => null,
});
