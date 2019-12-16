import express from "express";
import usercontroller from "../controller/usercontroller";
import verifyToken from "../../middleware/verifyToken.js";
import verifyUser from "../../middleware/verifyUser.js";



const router = express.Router();

/* route information */

/********start***************Admin Panel Routes****************************************/
router.post('/login',usercontroller.login); 
router.post('/forget_password',usercontroller.forget_password);
router.post('/reset_password_update',usercontroller.reset_password_update);
router.post('/reset_pwd_link_check',usercontroller.reset_pwd_link_check);


router.post('/add_user',verifyToken,verifyUser,usercontroller.add_user);
router.post('/edit_user',verifyToken,verifyUser,usercontroller.edit_user);
router.post('/update_user',verifyToken,verifyUser,usercontroller.update_user);
router.post('/list_users',verifyToken,verifyUser,usercontroller.list_users);
router.post('/delete_user',verifyToken,verifyUser,usercontroller.delete_user);
router.post('/change_password',verifyToken,verifyUser,usercontroller.change_password);
// list user pagination with searching
router.post('/list_users_pagination',verifyToken,verifyUser,usercontroller.list_users_pagination);
// update status only
router.post('/update_status_user',verifyToken,verifyUser,usercontroller.update_status_user);



//test_user
router.post('/test_send_email',usercontroller.test_send_email); 
router.post('/test_user',usercontroller.test_user); 

/********End***************Admin Panel Routes***********************************/


/********Start************Admin Panel Routes : Job Title************************/
router.post('/add_job_title',verifyToken,verifyUser,usercontroller.add_job_title); 
router.post('/edit_job_title',verifyToken,verifyUser,usercontroller.edit_job_title);
router.post('/update_job_title',verifyToken,verifyUser,usercontroller.update_job_title);
router.post('/delete_job_title',verifyToken,verifyUser,usercontroller.delete_job_title); 
router.post('/list_job_title',verifyToken,verifyUser,usercontroller.list_job_title); 
router.post('/update_status_jobtitle',verifyToken,verifyUser,usercontroller.update_status_jobtitle); 
// list job title pagination
router.post('/list_job_title_pagination',verifyToken,verifyUser,usercontroller.list_job_title_pagination);
router.post('/job_title_bulk_action',verifyToken,verifyUser,usercontroller.job_title_bulk_action);

/********End************Admin Panel Routes : Job Title************************/

router.post('/bulk_action_update',verifyToken,verifyUser,usercontroller.bulk_action_update);


/********Start************Admin Panel Routes : Articles************************/

router.post('/add_articles',verifyToken,verifyUser,usercontroller.add_articles); 
router.post('/edit_articles',verifyToken,verifyUser,usercontroller.edit_articles); 
router.post('/update_articles',verifyToken,verifyUser,usercontroller.update_articles); 
router.post('/delete_articles',verifyToken,verifyUser,usercontroller.delete_articles); 
router.post('/list_articles',verifyToken,verifyUser,usercontroller.list_articles); 
router.post('/update_status_articles',verifyToken,verifyUser,usercontroller.update_status_articles);

//pagination
router.post('/list_articles_pagination',verifyToken,verifyUser,usercontroller.list_articles_pagination);


/********End************Admin Panel Routes : Articles************************/

/********Start************Admin Panel Routes : Strategies************************/

router.post('/add_strategies',verifyToken,verifyUser,usercontroller.add_strategies); 
router.post('/edit_strategies',verifyToken,verifyUser,usercontroller.edit_strategies); 
router.post('/update_strategies',verifyToken,verifyUser,usercontroller.update_strategies); 
router.post('/delete_strategies',verifyToken,verifyUser,usercontroller.delete_strategies); 
router.post('/list_strategies',verifyToken,verifyUser,usercontroller.list_strategies); 
router.post('/update_status_strategies',verifyToken,verifyUser,usercontroller.update_status_strategies);

//pagination
router.post('/list_strategies_pagination',verifyToken,verifyUser,usercontroller.list_strategies_pagination);


/********End************Admin Panel Routes : Strategies************************/


/********Start************Admin Panel Routes : Portfolio************************/
router.post('/add_portfolio',verifyToken,verifyUser,usercontroller.add_portfolio); 
router.post('/edit_portfolio',verifyToken,verifyUser,usercontroller.edit_portfolio); 
router.post('/update_portfolio',verifyToken,verifyUser,usercontroller.update_portfolio); 
router.post('/delete_portfolio',verifyToken,verifyUser,usercontroller.delete_portfolio); 
router.post('/list_portfolio',verifyToken,verifyUser,usercontroller.list_portfolio); 
router.post('/update_status_portfolio',verifyToken,verifyUser,usercontroller.update_status_portfolio);
//pagination
router.post('/list_portfolio_pagination',verifyToken,verifyUser,usercontroller.list_portfolio_pagination);
/********End************Admin Panel Routes : Portfolio************************/


/********Start************Admin Panel Routes : Peoples*******************/

router.post('/add_people',verifyToken,verifyUser,usercontroller.add_people); 
router.post('/edit_people',verifyToken,verifyUser,usercontroller.edit_people); 
router.post('/update_people',verifyToken,verifyUser,usercontroller.update_people); 
router.post('/delete_people',verifyToken,verifyUser,usercontroller.delete_people); 
router.post('/list_people',verifyToken,verifyUser,usercontroller.list_people); 
router.post('/list_people_pagination',verifyToken,verifyUser,usercontroller.list_people_pagination);
router.post('/update_status_people',verifyToken,verifyUser,usercontroller.update_status_people);

/********End************Admin Panel Routes : Peoples*********************/


/********Start************Admin Panel Routes : Contact US*****************/
router.post('/list_cnt_us_pagination',verifyToken,verifyUser,usercontroller.list_cnt_us_pagination);
router.post('/delete_cnt_us',verifyToken,verifyUser,usercontroller.delete_cnt_us); 
/********End************Admin Panel Routes : Contact US*****************/


/********Start************Admin Panel Routes : Page*****************/
router.post('/list_page_pagination',verifyToken,verifyUser,usercontroller.list_page_pagination);
router.post('/edit_page',verifyToken,verifyUser,usercontroller.edit_page); 
router.post('/update_page',verifyToken,verifyUser,usercontroller.update_page); 
router.post('/update_status_page',verifyToken,verifyUser,usercontroller.update_status_page);
/********End************Admin Panel Routes : Page*****************/

export default router;


