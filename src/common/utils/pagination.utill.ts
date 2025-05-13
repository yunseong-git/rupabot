export interface QueryOptions {
  sort?: string;
  limit?: number;
  skip?: number;
}

export function applyPagination<T>(query: any, options: QueryOptions) {
  const { sort, limit = 10, skip = 0 } = options;

  const sortMap = {
    latest: { createdAt: -1 },
    like: { likeCount: -1 }
  };

  if (sort && sortMap[sort]) {
    query = query.sort(sortMap[sort]);
  }

  return query.limit(limit).skip(skip);
}