function authentication(authentication) {
  if (authentication.site === '' || authentication.site === undefined) {
    throw new Error('Missing authentication.site in json payload');
  }
  if (authentication.token === '' || authentication.token === undefined) {
    throw new Error('Missing authentication.token in json payload');
  }
  const site = authentication.site;
  const token = authentication.token;

  const hash = PropertiesService .getScriptProperties().getProperty(site);

  if (hash === null) {
    throw new Error('Invalid site');
  }

  if (hash !== token) {
    throw new Error('Invalid token');
  }

  return site;
}

function validateDataCreate(data) {

  if (data === null || data === '' || data === undefined) {
    return 'No data provided';
  }

  if (data.id === '' || data.id === undefined) {
    return 'Missing id field';
  }

  if (data.name === '' || data.name === undefined) {
    return 'Missing name field';
  }

  // if (data.parent === '' || data.parent === undefined) {
  //   return 'Missing parent field';
  // }

  // if (data.parent_contact === '' || data.parent_contact === undefined) {
  //   return 'Missing parent contact field';
  // }

  // if (data.birthday === '' || data.birthday === undefined) {
  //   return 'Missing birthday field';
  // }
  const id = parseInt(data.id);
  if (!Number.isInteger(id)) {
    return 'ID must be an integer';
  }
  if (data.id <= 0) {
    return 'Invalid ID';
  }

  // if ((data.birthday !== '' && data.birthday !== undefined) && data.birthday < 0) {
  //   return 'Invalid birthday';
  // }

  return null;
}

function validateDataUpdate(data) {

  if (data === null || data === '' || data === undefined) {
    return 'No data provided';
  }

  if (data.id === '' || data.id === undefined) {
    return 'Missing id field';
  }

  // if (data.birthday !== null && data.birthday < 0) {
  //   return 'Invalid birthday';
  // }

  return null;
}