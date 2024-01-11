const ObjectId = require("mongodb").ObjectId;
const dbService = require("../../utils/dbService");
const Message = require("../../utils/messages");
const { UserRole } = require("../../config/constants");

const userList = async (payload) => {
  try {
    let {
      user: { _id: userId },
      body: { vSearchText },
    } = payload;

    let checkAdmin = await dbService.findOneRecord(
      "UserModel",
      {
        _id: new ObjectId(userId),
        isDeleted: false,
      },
      {
        _id: 1,
        vUserRole: 1,
      }
    );

    if (
      UserRole?.SUPERADMIN?._id.toString() ==
        checkAdmin?.vUserRole.toString() ||
      UserRole?.ADMIN?._id.toString() == checkAdmin?.vUserRole.toString()
    ) {
      let filterCondition = {
        isDeleted: false,
      };

      if (
        UserRole?.ADMIN?._id.toString() == checkAdmin?.vUserRole.toString() &&
        !(
          UserRole?.SUPERADMIN?._id.toString() ==
          checkAdmin?.vUserRole.toString()
        )
      ) {
        filterCondition["vCreatedBy"] = new ObjectId(userId);
      }

      if (vSearchText) {
        var regex = new RegExp(vSearchText, "i");
        filterCondition["$or"] = [{ vName: regex }, { vMobile: regex }];
      }

      let aggregateQuery = [
        {
          $match: filterCondition,
        },
        {
          $project: {
            _id: 1,
            vName: 1,
            vProfileImage: 1,
            vUserRole: 1,
            vMobile: 1,
            vAddress: 1,
            vCity: 1,
            vState: 1,
            vCountry: 1,
          },
        },
        { $sort: { _id: -1 } },
      ];

      const dataList = await dbService.aggregateData(
        "UserModel",
        aggregateQuery
      );
      let totalCount = await dbService.recordsCount(
        "UserModel",
        filterCondition
      );
      if (!dataList) throw new Error(Message.systemError);

      return { data: dataList, iCount: totalCount };
    } else {
      throw new Error(Message.unauthorizedAdmin);
    }
  } catch (error) {
    console.error("userListError ------------>", error);
    throw new Error(error?.message);
  }
};
module.exports = userList;
