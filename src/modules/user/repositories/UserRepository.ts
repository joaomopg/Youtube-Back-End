import { Request, Response } from 'express';
import { pool } from '../../../mysql';
import { v4 as uuidv4 } from 'uuid';
import { hash, compare } from 'bcrypt';
import { sign, verify } from 'jsonwebtoken';

class UserRepository {
    create(request: Request, response: Response){
        const { name, email, password } = request.body;
        pool.getConnection((error: any, connection: any) => {
            hash(password, 10, (err: any, hash: any) => {
                if(error){
                    return response.status(500).json({message: 'Erro no servidor'})
                }

                connection.query(
                    'INSERT INTO users (user_id, name, email, password) VALUES (?,?,?,?)',
                    [uuidv4(), name, email, hash],
                    (error: any, result: any, fields: any)=> {
                        connection.release();
                        if (error) {
                            return response.status(400).json({message: 'Erro no cadastro'})
                        }
                        return response.status(200).json({sucess: true, message: 'Usuário cadastrado com sucesso!'})
                    }
                )
            })
        });
    }

    login(request: Request, response: Response){
        const { email, password } = request.body;
        pool.getConnection((error: any, connection: any) => {
            if (error) {
                return response.status(500).json({error: "Erro no servidor"})
            }
            connection.query(
                'SELECT * FROM users WHERE email = ?',
                [ email ],
                (error: any, results: any, fields: any)=> {
                    connection.release();
                    if (error) {
                        return response.status(400).json({error: "Email inválido"})
                    }
                    compare(password, results[0].password, (err, result)=> {
                        if (err) {
                            return response.status(400).json({error: "Senha incorreta"})
                        }
                        if (result) {
                            const token = sign({
                                id: results[0].user_id,
                                email: results[0].email
                            }, 'segredo', {expiresIn: "1d"});

                            response.status(200).json({token: token, message: 'Token criado com sucesso'});
                        }

                    })

                }

            )
        })
    }

    getUser(request: any, response: any){
        const decode: any = verify(request.headers.authorization, 'segredo');
        if(decode.email){
            pool.getConnection((error, connection)=> {
                connection.query(
                    'SELECT * FROM users WHERE email = ?',
                    [decode.email],
                    (error, results, fields)=> {
                        connection.release();
                        if(error){
                            return response.status(400).send({
                                error: error,
                                response: null
                            })
                        }

                        return response.status(201).send({
                            user: {
                                nome: results[0].name,
                                email: results[0].email,
                                id: results[0].user_id,
                            }
                        })
                    }
                )
            })
        }
    }


    
}

export { UserRepository }