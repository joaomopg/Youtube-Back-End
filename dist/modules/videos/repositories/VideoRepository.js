"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideosRepository = void 0;
const mysql_1 = require("../../../mysql");
const uuid_1 = require("uuid");
class VideosRepository {
    createVideo(request, response) {
        const { title, description, user_id } = request.body;
        mysql_1.pool.getConnection((error, connection) => {
            if (error) {
                response.status(500).json({ error: "Erro no servidor" });
            }
            connection.query('INSERT INTO videos (video_id, title, description, user_id) VALUES (?,?,?,?)', [(0, uuid_1.v4)(), title, description, user_id], (error, results, fields) => {
                connection.release();
                if (error) {
                    response.status(400).json({ error: "Erro ao criar video" });
                }
                return response.status(200).json({ sucess: "Vídeo criado com sucesso" });
            });
        });
    }
    getVideos(request, response) {
        const { user_id } = request.params;
        mysql_1.pool.getConnection((error, connection) => {
            if (error) {
                response.status(500).json({ message: "Erro no servidor" });
            }
            connection.query('SELECT * FROM videos WHERE user_id = ?', [user_id], (error, results, fields) => {
                connection.release();
                if (error) {
                    response.status(400).json({ message: "Este usuário não existe" });
                }
                return response.status(200).json({ message: "Videos retornados com sucesso", videos: results });
            });
        });
    }
    searchVideos(request, response) {
        const { search } = request.body;
        mysql_1.pool.getConnection((error, connection) => {
            if (error) {
                response.status(500).json({ message: "Erro no servidor" });
            }
            connection.query('SELECT * FROM videos WHERE title LIKE ?', [`%${search}%`], (error, results, fields) => {
                connection.release();
                if (error) {
                    response.status(400).json({ message: "Não foi possível encontrar um vídeo com essas informações" });
                }
                return response.status(200).json({ message: "Videos retornados com sucesso", videos: results });
            });
        });
    }
}
exports.VideosRepository = VideosRepository;
