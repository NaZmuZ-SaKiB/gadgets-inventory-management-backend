// ['page', 'limit', 'time', 'sort'];

type TQuery = {
  page?: number;
  limit?: number;
  time?: 'all' | '1' | '7' | '30' | '365';
  sort?: string;
};

export const generateSalesQuery = (query: TQuery) => {
  const mainQuery: Record<string, unknown> = {};

  if (query.time) {
    const time = query.time;

    if (time === '1') {
      mainQuery.dateOfSale = {
        $gte: new Date(new Date().toDateString()).toISOString(),
      };
    }
    if (time === '7') {
      const sevenDaysAgo = new Date(
        Date.now() - 6 * 24 * 60 * 60 * 1000,
      ).toISOString();

      mainQuery.dateOfSale = { $gte: sevenDaysAgo };
    }
    if (time === '30') {
      const monthAgo = new Date(
        Date.now() - 29 * 24 * 60 * 60 * 1000,
      ).toISOString();

      mainQuery.dateOfSale = { $gte: monthAgo };
    }
    if (time === '365') {
      const yearAgo = new Date(
        Date.now() - 364 * 24 * 60 * 60 * 1000,
      ).toISOString();

      mainQuery.dateOfSale = { $gte: yearAgo };
    }
  }

  // pagination
  const page = Number(query?.page) || 1;
  const limit = Number(query?.limit) || 10;
  const skip = (page - 1) * limit;

  // Sorting
  let sort: string = '-createdAt';
  if (query?.sort) sort = query.sort as string;

  return { mainQuery, sort, page, limit, skip };
};
