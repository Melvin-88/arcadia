import { BadRequestException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Sort } from '../interfaces';

export function setSorting<T>(repo: Repository<T>, computedParams: string[], sortBy: string, sortOrder: string, addTableName = false): Sort {
  let sortParam;
  if (sortOrder) {
    if (sortOrder.toUpperCase() !== 'ASC' && sortOrder.toUpperCase() !== 'DESC') {
      throw new BadRequestException(`Bad sort order ${sortOrder}`);
    }
    sortParam = { sort: sortBy, order: sortOrder.toUpperCase() as 'ASC' | 'DESC' };
  } else {
    sortParam = { sort: sortBy, order: 'ASC' };
  }

  const entityColumns = repo.metadata.columns;
  const columnMetadata = entityColumns.find(k => k.propertyName === sortParam.sort);
  if (!columnMetadata) {
    if (!computedParams.includes(sortParam.sort)) {
      throw new BadRequestException(`Unknown field ${sortParam.sort}`);
    }
    return sortParam;
  }
  sortParam.sort = addTableName ? `${repo.metadata.tableName}.${columnMetadata.databaseName}` : columnMetadata.databaseName;
  return sortParam;
}
