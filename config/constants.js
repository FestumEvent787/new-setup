const UserRole = {
  SUPERADMIN: { _id: "6572e70cad06102c98a1cd3b", name: "Super Admin" },
  ADMIN: { _id: "6572e72bad06102c98a1cd3e", name: "Admin" },
  SALES: { _id: "6572e738ad06102c98a1cd41", name: "Sales" },
  ACCOUNT: { _id: "6572e73ead06102c98a1cd44", name: "Accountant" },
  DISPATCH: { _id: "6572e742ad06102c98a1cd47", name: "Delivery" },
};

const UserNameByRole = {
  "6572e70cad06102c98a1cd3b": "Super Admin",
  "6572e72bad06102c98a1cd3e": "Admin",
  "6572e738ad06102c98a1cd41": "Sales",
  "6572e73ead06102c98a1cd44": "Accountant",
  "6572e742ad06102c98a1cd47": "Delivery",
};

module.exports = {
  UserRole,
  UserNameByRole,
};
