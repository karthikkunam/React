import { loginService } from "../services/login.service";


class LoginController {
    async authenticate(req, res) {
        try {
            let result = await loginService.authenticate(req.body);
            if (result) {
                res.send(result);
            } else {
                res.status(401).send("Unauthorized");
            }
        } catch (error) {
            res.status(500).send({ message: "Internal Server Error" });
        }
    }

    async refreshAccessToken(req, res) {
        try {
            let inputData = req.body;
            let userId = inputData.userId;
            let storeId = inputData.storeId;
            let refreshToken = inputData.refreshToken;
            let refreshTokens = req.app.get('refreshTokens');
            if ((refreshToken in refreshTokens) &&
                (refreshTokens[refreshToken].userId == userId &&
                    refreshTokens[refreshToken].storeId == storeId)) {
                let result = await loginService.refreshAccessToken(userId, storeId);
                res.status(200).send(result);
            }
            else {
                res.status(401).send("Unauthorized");
            }
        } catch (error) {
            res.status(500).send({ message: "Internal Server Error" });
        }
    }
}

let loginController = new LoginController();

export {
    loginController
}