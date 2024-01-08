export const successAction = (data, vMessage = "OK", iCount) => {
  return { iStatusCode: 200, isStatus: true, iCount, data, vMessage };
};

export const failAction = (vMessage = "Fail", iStatusCode = 400) => {
  return { iStatusCode, isStatus: false, data: null, vMessage };
};

export const toTitleCase = (str) => {
  if (str == undefined || str == "undefined" || str == null || str == "") {
    return "";
  } else {
    str = str ? str.toString() : "";
    return str.replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  }
};
