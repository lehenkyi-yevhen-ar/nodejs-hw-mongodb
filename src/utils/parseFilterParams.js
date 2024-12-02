function parseFilterByType(value) {
  if (typeof value !== 'string') {
    return undefined;
  }

  const keys = ['personal', 'home'];
  if (keys.includes(value) !== true) {
    return undefined;
  }
  return value;
}

function parseFilterByIsFavourite(value) {
  if (typeof value !== 'string') {
    return undefined;
  }
  if (value === 'true') {
    return true;
  }
  if (value === 'false') {
    return false;
  }
  return undefined;
}

export function parseFilterParams(query) {
  const { contactType, isFavourite } = query;

  const filters = {};
  const parsedType = parseFilterByType(contactType);
  if (parsedType) {
    filters.contactType = parsedType;
  }
  console.log(filters.contactType);

  const parsedIsFavoutire = parseFilterByIsFavourite(isFavourite);
  if (parsedIsFavoutire !== undefined) {
    filters.isFavourite = parsedIsFavoutire;
  }

  return filters;
}
