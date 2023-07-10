const con = require("../database");
const CustomErrorHandler = require("../middlewares/CustomErrorHandler");
const productSchema = require("../validator/productSchema");
const constant = require("../constant/index");
const productController = {
  
  async addProduct(req, res, next) {
    const { error } = productSchema.validate(req.body);
    if (error) return next(error);
    try {
      let data = { ...req.body,user_id:req.user.id, imageName: req.file.filename };
      con.query(`insert into tbl_product set ?`, data, (err, response) => {
        if (err) return next(err);

        res.json({
          code: 1,
          message: "Product has been added successfully",
          upload_image_url: `http://localhost:4000/images/${req.file.filename}`,
        });
      });
    } catch (error) {
      return next(error);
    }
  },

  async editProduct(req, res, next) {
    console.log("eidt proudct")
    if (!req.params.productId) {
      return next(CustomErrorHandler.fieldRequired("product is required"));
    }
    const data = {
      ...(req.body.productName && { productName: req.body.productName }),
      ...(req.body.price && { price: req.body.price }),
      // ...(req.body.description && { description: req.body.description }),
      ...(req.body.qty && { qty: req.body.qty }),
    };
    if (req.hasOwnProperty("file")) {
      data.imageName = req.file.filename;
    }
    con.query(
      `update tbl_product set ?  where id=${req.params.productId}`,
      data,
      (err, response) => {
        if (err) return next(err);
        if (response.affectedRows > 0) {
          res.json({
            code: 1,
            message: "Product has been updated successfully",
          });
        } else {
          res.json(constant.dataNotFound);
        }
      }
    );
  },

  async deleteProduct(req, res, next) {
    if (!req.body.productId)
      return next(CustomErrorHandler.fieldRequired("Product Id is required."));
    con.query(
      `update tbl_product set ? where id=${req.body.productId}`,
      { is_active: 0 },
      (err, response) => {
        if (err) return next(err);
        res.json({ code: 1, message: "Product has been deleted successfully" });
      }
    );
  },

  async fetchProducts(req, res, next) {
    let paginationQuery = "";
    if (req.body.limit && req.body.page) {
      let page_token = Number(req.body.page);
      let pageLimit =
        page_token * Number(req.body.limit) - Number(req.body.limit);
      paginationQuery = `limit ${req.body.limit} offset ${pageLimit}`;
    }

    let search = ``;
    if (req.body.search && req.body.search != "") {
      search = `and productName like "${`%${req.body.search}%`}"`;
    }
    con.query(
      `SELECT p.*,
        CONCAT("${constant.imageUrl}",p.imageName) as imageUrl
            from tbl_product p 
            where p.is_active=1 ${search} order by p.id desc ${paginationQuery}`,
      (err, response) => {
        if (err) return next(err);
        if (response.length == 0) return res.json(constant.dataNotFound);
       let s=  con.query(
          `SELECT count(id) as totalRecords from tbl_product  where is_active=1  ${search}`,
          (countError, countResponse) => {
            console.log(s.sql)
            if (countError) return next(err);
            res.json({
              code: 1,
              message: "fetch products",
              data: response ? response : [],
              totalRecords: countResponse[0].totalRecords || 0,
            });
          }
        );
      }
    );
  },

  async productbyId(req, res, next) {
    if (!req.params.id) {
      return next(CustomErrorHandler.fieldRequired("product id is required.."));
    }
    con.query(
      `select p.*,
      CONCAT("${constant.imageUrl}",p.imageName) as imageUrl,
      IFNULL(t.categoryId,p.categoryId) as categoryId,
      c.categoryName,
        IFNULL(t.taxType,0) as taxType,
          IFNULL(t.taxValue,0)  as taxValue 
            from tbl_product p left join tbl_tax t on p.categoryId = t.categoryId 
            left join tbl_category c on p.categoryId = c.id  
            where p.is_active=1 and p.id=${req.params.id}`,
      (err, response) => {
        if (err) return next(err);
        res.json({
          code: 1,
          message: "fetch products",
          data: response[0] ? response[0] : {},
        });
      }
    );
  },
};

module.exports = productController;
