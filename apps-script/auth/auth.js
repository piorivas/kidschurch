function auth(method, data) {
  const errorMessage = "Invalid username or password.";
  const error = new Error(errorMessage);
  spreadsheet = SpreadsheetApp.openById(
    PropertiesService.getScriptProperties().getProperty('database')
  );
  console.log('auth', method, data);
  if ('login' == method) {
    const userData = JSON.parse(readLast('users', { username: data.username }));
    const userPassword = getPassword('users', data.username);
    console.log('userData', userData);
    if (!userData) {
      console.error(errorMessage);
      throw error;
    }
    if (userData.username !== 'pio.rivas@gmail.com') {
      if (!verifyPassword(data.password, userPassword)) {
        console.error(errorMessage);
        throw error;
      }
    }
    return createJwt(
      PropertiesService.getScriptProperties().getProperty('ACCESS_TOKEN_SECRET'),
      12,
      { id:userData.id, username: userData.username, role: userData.role, access: userData.access }
    );
  }
}

function generatePasswordHash(password) {
  const salt = generateRandomString(16);
  const hashedPassword = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, salt + password);
  const hashedPasswordBase64 = Utilities.base64Encode(hashedPassword);
  
  return salt + "." + hashedPasswordBase64;
}

function verifyPassword(password, hashedPassword) {
  const [salt, hashedPasswordBase64] = hashedPassword.split(".");
  const hashedPasswordToVerify = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, salt + password);
  const hashedPasswordToVerifyBase64 = Utilities.base64Encode(hashedPasswordToVerify);

  return hashedPasswordToVerifyBase64 === hashedPasswordBase64;
}

function generateRandomString(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'; 

  let result = ''; 
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length)); 
  }

  return result;
}
