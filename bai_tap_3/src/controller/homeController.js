import db from '../models/index';
import CRUDService from '../services/CRUDService';

let getHomePage = async (req, res) => {
    try {
        let data = await db.User.findAll();
        return res.render('homepage.ejs', { data: JSON.stringify(data) });
    } catch (e) {
        console.log(e);
    }
};

let getAboutPage = (req, res) => {
    return res.send('About page by Duong Khanh Nguyen'); // Ví dụ tạm thời
};

let getCRUD = (req, res) => {
    return res.render('crud.ejs');
};

let postCRUD = async (req, res) => {
    let message = await CRUDService.createNewUser(req.body);
    console.log(message);
    return res.send('Post crud to server');
};

let getFindAllCrud = async (req, res) => {
    let data = await CRUDService.getAllUser();
    return res.render('users/findAllUser.ejs', { datalist: data });
};

let getEditCRUD = async (req, res) => {
    let userId = req.query.id;
    if (userId) {
        let userData = await CRUDService.getUserInfoById(userId);
        return res.render('users/editUser.ejs', { data: userData });
    } else {
        return res.send('Khong lay duoc id');
    }
};

let putCRUD = async (req, res) => {
    let data = req.body;
    let datal = await CRUDService.updateUser(data);
    return res.render('users/findAllUser.ejs', { datalist: datal });
};

let deleteCRUD = async (req, res) => {
    let id = req.query.id;
    if (id) {
        await CRUDService.deleteUserById(id);
        return res.send('Deleted!!!!!!!!!!');
    } else {
        return res.send('Not find user');
    }
};

export default {
    getHomePage,
    getAboutPage,
    getCRUD,
    postCRUD,
    getFindAllCrud,
    getEditCRUD,
    putCRUD,
    deleteCRUD,
};