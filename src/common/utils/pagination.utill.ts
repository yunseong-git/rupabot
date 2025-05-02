export interface QueryOptions {
  sort?: string;
  limit?: number;
  skip?: number;
}

export function applyPagination<T>(query: any, options: QueryOptions) {
  const { sort, limit = 10, skip = 0 } = options;

  if (sort) {
    query = query.sort({ [sort]: 1 });
  }

  return query.limit(limit).skip(skip);
}