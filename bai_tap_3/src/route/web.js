import express from "express";
import homeController from "../controller/homeController";

let router = express.Router();

const initWebRoutes = (app) => {
    router.get("/", homeController.getHomePage); // Trang chủ
    router.get("/about", homeController.getAboutPage); // Trang giới thiệu
    router.get("/crud", homeController.getCRUD); // Form CRUD
    router.post("/post-crud", homeController.postCRUD); // Tạo mới user
    router.get("/get-crud", homeController.getFindAllCrud); // Danh sách user
    router.get("/edit-crud", homeController.getEditCRUD); // Edit user
    router.post("/put-crud", homeController.putCRUD); // Update user
    router.get("/delete-crud", homeController.deleteCRUD); // Xóa user

    return app.use("/", router);
};

export default initWebRoutes;
