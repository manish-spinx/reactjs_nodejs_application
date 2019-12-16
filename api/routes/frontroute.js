import express from "express";
import frontcontroller from "../controller/frontcontroller";

const frouter = express.Router();

frouter.post('/all_strategies',frontcontroller.all_strategies);
frouter.post('/all_portfolio',frontcontroller.all_portfolio);
frouter.post('/get_portfolio_detail',frontcontroller.get_portfolio_detail);
frouter.post('/all_people',frontcontroller.all_people);
frouter.post('/all_job_title',frontcontroller.all_job_title);

frouter.post('/all_news',frontcontroller.all_news);
frouter.post('/all_news_pagination',frontcontroller.all_news_pagination);


frouter.post('/news_detail',frontcontroller.news_detail);
frouter.post('/inquiry_add',frontcontroller.inquiry_add);

frouter.post('/register',frontcontroller.register);
frouter.post('/front_update_profile',frontcontroller.front_update_profile);


export default frouter;


