const ObjectId = require("mongodb").ObjectId;
const dbService = require("../../utils/dbService");
const Message = require("../../utils/messages");
const { UserRole, UserNameByRole } = require("../../config/constants");
const imageUpload = require("../../utils/imageUpload");

const save = async (entry) => {
  try {
    let {
      user: { _id: userId },
      body: { vName, vUserRoleId, vMobile, vAddress, vCityId },
      file,
    } = entry;

    let checkAdmin = await dbService.findOneRecord(
      "UserModel",
      { _id: new ObjectId(userId), isDeleted: false },
      {
        _id: 1,
        vUserRole: 1,
      }
    );
    if (
      !(
        UserRole?.SUPERADMIN?._id.toString() == checkAdmin?.vUserRole.toString()
      ) &&
      !(UserRole?.ADMIN?._id.toString() == checkAdmin?.vUserRole.toString())
    )
      throw new Error(Message.unauthorizedAdmin);

    if (
      !(
        UserRole?.SUPERADMIN?._id.toString() == checkAdmin?.vUserRole.toString()
      ) &&
      UserRole?.ADMIN?._id.toString() == checkAdmin?.vUserRole.toString()
    ) {
      if (
        UserRole?.SUPERADMIN?._id.toString() == vUserRoleId.toString() ||
        UserRole?.ADMIN?._id == vUserRoleId
      )
        throw new Error(Message.unauthorizedAdmin);
    }

    let filter = {
      isDeleted: false,
      vMobile,
    };

    let userCheck = await dbService.findOneRecord("UserModel", filter, {
      _id: 1,
      vProfileImage: 1,
    });
    if (userCheck) throw new Error(Message.nameAlreadyExists);

    let teamUrlImage = "";
    if (Object.keys(file).length > 0) {
      teamUrlImage = await imageUpload(file);
    }
    let payload = {
      vName,
      vMobile,
      vAddress,
      vCityId,
      vProfileImage: teamUrlImage,
      vUserRole: new ObjectId(vUserRoleId),
      vCreatedBy: new ObjectId(userId),
      dtCreatedAt: Date.now(),
    };

    const saveData = await dbService.createOneRecord("UserModel", payload);
    if (!saveData) throw new Error(Message.systemError);

    let result = {
      vName: saveData?.vName,
      vMobile: saveData?.vMobile,
      vAddress: saveData?.vAddress,
      vUserRole: UserNameByRole[saveData?.vUserRole],
      vProfileImage: saveData?.vProfileImage,
      vCityId: saveData?.vCityId,
    };

    return result;
  } catch (error) {
    console.error("SaveError ----------->", error);
    throw new Error(error?.message);
  }
};

module.exports = save;
