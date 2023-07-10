const con = require("../database");
const common = require("../common/index");
const CustomErrorHandler = require("../middlewares/CustomErrorHandler");
const userSchema = require("../validator/userSchema");
const authController = {
  async test(req, res, next) {
    res.json({
      code: 1,
      url: `http:localhost:4000/image/${req.file.originalname}`,
    });
  },

  async signup(req, res, next) {
    try {
      const { error } = userSchema.validate(req.body);
      if (error) return next(error);
      await common.checkEmail(req.body.email, res, next);
      const token = await common.tokenGenerate(next);
      const signupRequest = {
        email: req.body.email,
        token: token,
        password: req.body.password,
      };
      await con.query(
        `insert into tbl_user set ?`,
        signupRequest,
        (err, response) => {
          if (err) return next(err);
          res.json({ code: 1, message: "Sign Up successfully done." });
        }
      );
    } catch (e) {
      return next(e);
    }
  },

  async login(req, res, next) {
    if (!req.body.username || !req.body.email || !req.body.password) {
      return next(
        CustomErrorHandler.wrongCredentials(
          "Username and Password must be provided.."
        )
      );
    }
    try {
      await con.query(
        `select * from tbl_user where email='${req.body.email}'`,
        async (err, response) => {
          if (err) return next(err);
          if (response.length == 0)
            return next({ code: 0, message: "Invalid credentials" });
          if (response[0].password != req.body.password)
            return next(CustomErrorHandler.unAuthorized("Invalid credentials"));

          const token = await common.tokenGenerate(next);
          await common.tokenUpdate(req.body, res, next, token);
          const { password, ...finalResponse } = response[0];
          finalResponse.token = token;
          res.json({
            code: 1,
            message: "Login successfully",
            data: finalResponse,
          });
        }
      );
    } catch (error) {
      return next(error);
    }
  },

  async logout(req, res, next) {
    con.query(
      `update tbl_user set token=""  where id=${req.user.id}`,
      (err, response) => {
        if (err) return next(err);
        res.json({ code: 1, message: "Logout suceessfully." });
      }
    );
  },

  async forgotPassword(req, res, next) {
    try {
      if (!req.body.email)
        return next(CustomErrorHandler.fieldRequired("Email id is required"));
      const forgotToken = await common.tokenGenerate();
      await con.query(`select email from tbl_user where email ='${req.body.email}'`, async (emailerr, emailResponse) => {
        if (emailerr) return next(emailerr)
        if (emailResponse.length == 0) return next(CustomErrorHandler.notFound("User not found in database."))
        await con.query(
          `update tbl_user set forgotToken='${forgotToken}' where email='${req.body.email}'`,
          async(err, response) => {
            if (err) return next(err);
            await mailSender(req.body.email, forgotToken, res, next);
            return res.json({
              code: 0,
              message: "Link has been sent to your registered email.",
            });
          }
        );
      })

    } catch (e) {
      return next(e);
    }
  },

  async updateNewPassword(req, res, next) {
    return new Promise((resolve, reject) => {
      const data = {
        password: req.newPassword,
        userToken: "",
        forgotToken: "",
      };
      con.query(
        `update tbl_user set ? where forgotToken='${req.forgotToken}'`,
        data,
        (err, response) => {
          if (err) return next(err);
          resolve();
        }
      );
    });
  },

  async resetPassword(req, res, next) {
    try {
      if (!req.body.newPassword)
        return next(
          CustomErrorHandler.fieldRequired("new password is required")
        );
      if (!req.body.forgotToken)
        return next(
          CustomErrorHandler.fieldRequired("Forogot token  is required")
        );

      con.query(
        `select * from tbl_user where forgotToken='${req.body.forgotToken}'`,
        async (err, response) => {
          if (err) return next(err);
          if (response.length == 0)
            return next(CustomErrorHandler.fieldRequired("Token is expired."));
          await authController.updateNewPassword(req.body, res, next);
          res.json({
            code: 1,
            message: "Your password has been updated successfully.",
          });
        }
      );
    } catch (e) {
      return next(e);
    }
  },

  async editProfile(req, res, next) {
    if (req.user.email !== req.body.email)
      await common.checkEmail(req.body.email, res, next);

    if (req.user.username !== req.body.username)
      await common.checkUsername(req.body.username, res, next);

    const data = {
      ...(req.body.address && { address: req.body.address }),
      ...(req.body.phoneNumber && { phoneNumber: req.body.phoneNumber }),
      ...(req.body.email && { email: req.body.email }),
      ...(req.body.username && { username: req.body.username }),
    };

    con.query(
      `update tbl_user set ? where id=${req.user.id} `,
      data,
      (err, response) => {
        if (err) return next(err);
        res.json({ code: 1, message: "Profile has been updated successfully" });
      }
    );
  },
};

module.exports = authController;
