function transform(entity, data, id, headers) {
  let object = {};
  object.id = id;
  headers.forEach((header, index) => {
    if (['date', 'birthday', 'timestamp', 'time'].includes(header)) {
      console.log('header', header);
      console.log('dateValue before transformation', data[header] || data[index]);
      let dateValue = new Date(data[header] || data[index]);
      console.log('converted to date ', dateValue);
      if (dateValue instanceof Date) {
        // Handle specific formats for different types
        if (header === 'timestamp') {
          object[header] = Utilities.formatDate(dateValue, "Asia/Manila", "MMMM d, yyyy hh:mm a");
        } else if (header === 'time') {
          object[header] = Utilities.formatDate(dateValue, "Asia/Manila", "hh:mm:ss a");
        } else {
          object[header] = Utilities.formatDate(dateValue, "Asia/Manila", "MMMM d, yyyy");
        }
        console.log('dateValue is a valid date');
      } else {
        console.log('dateValue is not a valid date');
        object[header] = '';
      }
      console.log('dateValue after transformation', object[header]);
    } else {
      object[header] = data[header] || data[index] || '';
    }
    if (header === 'password') {
      object[header] = '';
    }
  });

  if (entity === 'kids') {
    let birthday = new Date(object.birthday);
    object.birthday = isNaN(birthday.getTime()) ? '' : birthday.toLocaleDateString('en-US', utils.dateFormat);
    object.level = utils.getLevel(object.birthday);
  }

  return JSON.stringify(object);
}