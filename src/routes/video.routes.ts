import { Router } from "express";
import { VideosRepository } from "../modules/videos/repositories/VideoRepository";
import { login } from "../middleware/login";

const videosRoutes = Router();
const videoRepository = new VideosRepository;

videosRoutes.post('/create-video/:user_id', login, (request, response)=> {
    videoRepository.createVideo(request, response);
})

videosRoutes.get('/get-videos/:user_id', login, (request, response)=> {
    videoRepository.getVideos(request, response);
})

videosRoutes.delete('/delete-videos', login, (request, response)=> {
    videoRepository.deleteVideos(request, response);
})

videosRoutes.get('/search-videos', (request, response)=> {
    videoRepository.searchVideos(request, response);
})


export { videosRoutes }