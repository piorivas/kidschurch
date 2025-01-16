

function createJwt(privateKey, expiresInHours, data = {}) {
  // Sign token using HMAC with SHA-256 algorithm
  const header = {
    alg: 'HS256',
    typ: 'JWT',
  };

  const now = Date.now();
  const expires = new Date(now);
  expires.setHours(expires.getHours() + expiresInHours);

  // iat = issued time, exp = expiration time
  const payload = {
    exp: Math.round(expires.getTime() / 1000),
    iat: Math.round(now / 1000),
  };

  // add user payload
  Object.keys(data).forEach(function (key) {
    payload[key] = data[key];
  });

  const base64Encode = (text, json = true) => {
    const data = json ? JSON.stringify(text) : text;
    return Utilities.base64EncodeWebSafe(data).replace(/=+$/, '');
  };

  const toSign = `${base64Encode(header)}.${base64Encode(payload)}`;
  const signatureBytes = Utilities.computeHmacSha256Signature(toSign, privateKey);
  const signature = base64Encode(signatureBytes, false);
  return `${toSign}.${signature}`;
}

function parseJwt(jsonWebToken, privateKey) {
  const [header, payload, signature] = jsonWebToken.split('.');
  const signatureBytes = Utilities.computeHmacSha256Signature(`${header}.${payload}`, privateKey);
  const validSignature = Utilities.base64EncodeWebSafe(signatureBytes);
  
  if (signature === validSignature.replace(/=+$/, '')) {
    const blob = Utilities.newBlob(Utilities.base64Decode(payload)).getDataAsString();
    const { exp, ...data } = JSON.parse(blob);
    if (new Date(exp * 1000) < new Date()) {
      throw new Error('The token has expired');
    }
    return data;
  } else {
    Logger.log('🔴', 'Invalid Signature');
  }
}

function hasAccess(token, entity, action) {
  const privateKey = PropertiesService.getScriptProperties().getProperty('ACCESS_TOKEN_SECRET');
  try{
    const access = JSON.parse(parseJwt(token, privateKey).access);
    return access[entity].includes(action);
  }catch(e){
    return false;
  }
}

function getTokenData(jsonWebToken) {
  const privateKey = PropertiesService.getScriptProperties().getProperty('ACCESS_TOKEN_SECRET');
    
  return parseJwt(jsonWebToken, privateKey);
}