"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbConnection = dbConnection;
const mysql_1 = __importDefault(require("mysql"));
function dbConnection() {
    const connection = mysql_1.default.createConnection({
        host: 'localhost',
        user: 'root',
        password: '0202'
    });
    connection.connect((err) => {
        if (err)
            throw err;
        console.log('connected to mysql');
    });
}
//# sourceMappingURL=dbconfig.js.map