"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.videosRoutes = void 0;
const express_1 = require("express");
const VideoRepository_1 = require("../modules/videos/repositories/VideoRepository");
const login_1 = require("../middleware/login");
const videosRoutes = (0, express_1.Router)();
exports.videosRoutes = videosRoutes;
const videoRepository = new VideoRepository_1.VideosRepository;
videosRoutes.post('/create-video', login_1.login, (request, response) => {
    videoRepository.createVideo(request, response);
});
videosRoutes.get('/get-videos/:user_id', login_1.login, (request, response) => {
    videoRepository.getVideos(request, response);
});
videosRoutes.get('/search-videos', (request, response) => {
    videoRepository.searchVideos(request, response);
});
