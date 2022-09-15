interface IDBconfig {
  host: string;
  user: string;
  password: string;
  database: string;
}

interface IDBconfigWrap {
  main: IDBconfig;
  login: IDBconfig;
}

const DBconfig: IDBconfigWrap =
  process.env.NODE_ENV === 'production'
    ? {
        main: {
          host: process.env.DID_MAIN_DB_HOST,
          user: process.env.DID_MAIN_DB_USER,
          password: process.env.DID_MAIN_DB_PW,
          database: process.env.DID_MAIN_DB_DB,
        },
        login: {
          host: process.env.DID_LOGIN_DB_HOST,
          user: process.env.DID_LOGIN_DB_USER,
          password: process.env.DID_LOGIN_DB_PW,
          database: process.env.DID_LOGIN_DB_DB,
        },
      }
    : {
        main: {
          host: 'localhost',
          user: 'dev_kong',
          password: 'qwer1234',
          database: 'DID',
        },
        login: {
          host: 'localhost',
          user: process.env.DID_LOGIN_DB_USER,
          password: process.env.DID_LOGIN_DB_PW,
          database: process.env.DID_LOGIN_DB_DB,
        },
      };

export default DBconfig;
