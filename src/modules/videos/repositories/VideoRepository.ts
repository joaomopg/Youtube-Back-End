import { Request, Response } from "express";
import { pool } from "../../../mysql";
import { v4 as uuidv4 } from 'uuid'

class VideosRepository{
    createVideo(request: Request, response: Response){
        const {url, title, description} = request.body;
        const {user_id} = request.params;
        pool.getConnection((err: any, connection: any) => {

          connection.query(
            'INSERT INTO videos (video_id, url, title, description, user_id) VALUES (?,?,?,?,?)',
            [uuidv4(), url, title, description, user_id],
            (error: any, result: any, filds: any) => {
              connection.release();
    
              if (error) {
                return response.status(400).json(error);
              }
    
              response.status(200).json({message: "Vídeo criado com sucesso."});
            }
          ) 
        })
      }

    getVideos(request: Request, response: Response){
        const { user_id } = request.params;
        pool.getConnection((error, connection) => {
            if (error) {
                response.status(500).json({message: "Erro no servidor"})
            }
            connection.query(
                'SELECT * FROM videos WHERE user_id = ?',
                [ user_id ],
                (error: any, results: any, fields: any)=> {
                    connection.release();
                    if (error){
                        response.status(400).json({message: "Este usuário não existe"})
                    }
                    return response.status(200).json({message: "Videos retornados com sucesso", videos: results})

                }
            )
        })
    }

    searchVideos(request: Request, response: Response){
        const { search } = request.body;
        pool.getConnection((error, connection) => {
            if (error) {
                response.status(500).json({message: "Erro no servidor"})
            }
            connection.query(
                'SELECT * FROM videos WHERE title LIKE ?',
                [ `%${search}%` ],
                (error: any, results: any, fields: any)=> {
                    connection.release();
                    if (error){
                        response.status(400).json({message: "Não foi possível encontrar um vídeo com essas informações"})
                    }
                    return response.status(200).json({message: "Videos retornados com sucesso", videos: results})

                }
            )
        })
    }

    deleteVideos(request: Request, response: Response) {
        const { title } = request.body;
        
        pool.getConnection((error, connection) => {
            if (error) {
                return response.status(500).json({ message: 'Erro no servidor' });
            }
            
            connection.query(
                'SELECT * FROM videos WHERE title = ?',
                [title],
                (error: any, results: any) => {
                    if (error) {
                        connection.release();  // Libera a conexão aqui se houver erro
                        return response.status(400).json({ message: 'Erro ao buscar vídeo' });
                    }
                    
                    if (results.length === 0) {
                        connection.release();  // Libera a conexão quando não há resultados
                        return response.status(404).json({ message: 'Vídeo não encontrado' });
                    }
    
                    connection.query(
                        'DELETE FROM videos WHERE title = ?',
                        [title],
                        (deleteError: any) => {
                            connection.release();  // Libera a conexão após a deleção
                            if (deleteError) {
                                return response.status(500).json({ message: 'Erro ao deletar vídeo' });
                            }
                            
                            return response.status(200).json({ message: "Vídeo deletado com sucesso." });
                        }
                    );
                }
            );
        });
    }


}

export { VideosRepository };