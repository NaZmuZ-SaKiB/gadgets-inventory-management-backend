import { fieldsToRemove } from './product.constants';

export const generateProductQuery = (query: Record<string, unknown>) => {
  const mainQuery: Record<string, unknown> = { ...query };
  fieldsToRemove.forEach((field) => delete mainQuery[field]);

  // If set to all then show all products
  if (query?.os && query.os !== 'all') mainQuery.operatingSystem = query.os;
  if (query?.category && query?.category === 'all') delete mainQuery.category;
  if (query?.brand && query?.brand === 'all') delete mainQuery.brand;
  if (query?.powerSource && query?.powerSource === 'all')
    delete mainQuery.powerSource;

  // handling price
  if (query?.minPrice && !query?.maxPrice) {
    mainQuery.price = { $gte: query?.minPrice };
  } else if (!query?.minPrice && query?.maxPrice) {
    mainQuery.price = { $lte: query?.maxPrice };
  } else if (query?.minPrice && query?.maxPrice) {
    mainQuery.price = { $gte: query?.minPrice, $lte: query?.maxPrice };
  }

  // handling quantity
  if (query?.minQuantity && !query?.maxQuantity) {
    mainQuery.quantity = { $gte: query?.minQuantity };
  } else if (!query?.minQuantity && query?.maxQuantity) {
    mainQuery.quantity = { $lte: query?.maxQuantity };
  } else if (query?.minQuantity && query?.maxQuantity) {
    mainQuery.quantity = { $gte: query?.minQuantity, $lte: query?.maxQuantity };
  } else {
    mainQuery.quantity = { $gt: 0 };
  }

  // handling releaseDate
  if (query?.releasedAfter && !query?.releasedBefore) {
    mainQuery.releaseDate = { $gte: query?.releasedAfter };
  } else if (!query?.releasedAfter && query?.releasedBefore) {
    mainQuery.releaseDate = { $lte: query?.releasedBefore };
  } else if (query?.releasedAfter && query?.releasedBefore) {
    mainQuery.releaseDate = {
      $gte: query?.releasedAfter,
      $lte: query?.releasedBefore,
    };
  }

  // handling camera
  if (query?.minCamera && !query?.maxCamera) {
    mainQuery.camera = { $gte: query?.minCamera };
  } else if (!query?.minCamera && query?.maxCamera) {
    mainQuery.camera = { $lte: query?.maxCamera };
  } else if (query?.minCamera && query?.maxCamera) {
    mainQuery.camera = { $gte: query?.minCamera, $lte: query?.maxCamera };
  }

  // handling weight
  if (query?.minWeight && !query?.maxWeight) {
    mainQuery.weight = { $gte: query?.minWeight };
  } else if (!query?.minWeight && query?.maxWeight) {
    mainQuery.weight = { $lte: query?.maxWeight };
  } else if (query?.minWeight && query?.maxWeight) {
    mainQuery.weight = { $gte: query?.minWeight, $lte: query?.maxWeight };
  }

  // handling displaySize
  if (query?.minDisplaySize && !query?.maxDisplaySize) {
    mainQuery.displaySize = { $gte: query?.minDisplaySize };
  } else if (!query?.minDisplaySize && query?.maxDisplaySize) {
    mainQuery.displaySize = { $lte: query?.maxDisplaySize };
  } else if (query?.minDisplaySize && query?.maxDisplaySize) {
    mainQuery.displaySize = {
      $gte: query?.minDisplaySize,
      $lte: query?.maxDisplaySize,
    };
  }

  // handling connectivity
  if (query?.connectivity) {
    mainQuery.connectivity = { $in: (query.connectivity as string).split(',') };
  }

  // handling compatibility
  if (query?.compatibility) {
    mainQuery.compatibility = {
      $in: (query.compatibility as string).split(','),
    };
  }

  // pagination
  const page = Number(query?.page) || 1;
  const limit = Number(query?.limit) || 10;
  const skip = (page - 1) * limit;

  // Sorting
  let sort: string = '-createdAt';
  if (query?.sort) sort = query.sort as string;

  return { mainQuery, page, limit, sort, skip };
};
