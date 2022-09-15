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
declare const DBconfig: IDBconfigWrap;
export default DBconfig;
