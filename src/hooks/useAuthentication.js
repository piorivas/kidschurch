import { useCallback } from 'react';
// import bcrypt from 'bcryptjs';

const useAuthentication = () => {
  const login = useCallback (async (username, password) => {
    if (!username || !password) {
      throw new Error("Invalid username or password.");
    }
    // const hashedPassword = await bcrypt.hash(password, 10);
    return new Promise((resolve, reject) => {
      google.script.run
        .withSuccessHandler((token) => {
          resolve(token);
        })
        .withFailureHandler((error) => {
          console.error(error);
          reject(error);
        })
        .auth('login', { username: username, password: password });
    });
  }, []);

  return { login };
}

export default useAuthentication;