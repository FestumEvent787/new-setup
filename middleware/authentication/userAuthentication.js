import dbService from "../../utils/dbService";
import { failAction } from "../../utils/response";
import Message from "../../utils/messages";

export default async function (req, res, next) {
  try {
    const { body, headers, path, originalUrl } = req;
    const { authorization, host } = headers;
    const data = {};
    data.format = "request";
    data.path = path;
    data.body = body;
    data.originalUrl = originalUrl;
    data.headers = { authorization, host, userAgent: headers["user-agent"] };

    const Authorization =
      data["headers"]["Authorization"] || data["headers"]["authorization"];
    if (!Authorization) {
      return res.status(401).json(failAction("Authorization not found!", 401));
    }

    const AuthorizationToken = Authorization.replace("Bearer ", "");

    let filter = { vLoginToken: AuthorizationToken };
    let userData = await dbService.findOneRecord("UserModel", filter, {
      _id: 1,
    });

    if (!userData)
      return res.status(401).json(failAction(Message.tokenExpire, 401));
    let userInfo = { _id: userData._id };
    res.setHeader("Access-Control-Expose-Headers", "X-main-user-timezone");
    req.user = userInfo;
    next();
  } catch (error) {
    return res.status(401).json(failAction(Message.tokenExpire, 401));
  }
}
