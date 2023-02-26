export type INormalizedEntities<TEntity, TId extends string | number = number> = {
  [key in TId]: TEntity
};
