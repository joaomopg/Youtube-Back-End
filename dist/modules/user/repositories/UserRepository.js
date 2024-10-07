"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const mysql_1 = require("../../../mysql");
const uuid_1 = require("uuid");
const bcrypt_1 = require("bcrypt");
const jsonwebtoken_1 = require("jsonwebtoken");
class UserRepository {
    create(request, response) {
        const { name, email, password } = request.body;
        mysql_1.pool.getConnection((error, connection) => {
            (0, bcrypt_1.hash)(password, 10, (err, hash) => {
                if (error) {
                    return response.status(500).json(error);
                }
                connection.query('INSERT INTO users (user_id, name, email, password) VALUES (?,?,?,?)', [(0, uuid_1.v4)(), name, email, hash], (error, result, fields) => {
                    connection.release();
                    if (error) {
                        return response.status(400).json(error);
                    }
                    return response.status(200).json({ sucess: true });
                });
            });
        });
    }
    login(request, response) {
        const { email, password } = request.body;
        mysql_1.pool.getConnection((error, connection) => {
            if (error) {
                return response.status(500).json({ error: "Erro no servidor" });
            }
            connection.query('SELECT * FROM users WHERE email = ?', [email], (error, results, fields) => {
                connection.release();
                if (error) {
                    return response.status(400).json({ error: "Email inválido" });
                }
                (0, bcrypt_1.compare)(password, results[0].password, (err, result) => {
                    if (err) {
                        return response.status(400).json({ error: "Senha incorreta" });
                    }
                    if (result) {
                        const token = (0, jsonwebtoken_1.sign)({
                            id: results[0].user_id,
                            email: results[0].email
                        }, process.env.SECRET, { expiresIn: "1d" });
                        response.status(200).json({ token: token });
                    }
                });
            });
        });
    }
    getUser(request, response) {
        const decode = (0, jsonwebtoken_1.verify)(request.headers.authorization, process.env.SECRET);
        if (decode.email) {
            mysql_1.pool.getConnection((error, connection) => {
                connection.query('SELECT * FROM users WHERE email = ?', [decode.email], (error, results, fields) => {
                    connection.release();
                    if (error) {
                        return response.status(400).send({
                            error: error,
                            response: null
                        });
                    }
                    return response.status(201).send({
                        user: {
                            nome: results[0].name,
                            email: results[0].email,
                            id: results[0].user_id,
                        }
                    });
                });
            });
        }
    }
}
exports.UserRepository = UserRepository;
