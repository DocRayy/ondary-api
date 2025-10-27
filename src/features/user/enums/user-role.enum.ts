enum UserRoleEnum {
  USER = 0,
  ADMIN = 1,
  MANAGER = 2,
}

export const getUserRoleEnumLabel = (userRoleEnum: UserRoleEnum) => {
  switch (userRoleEnum) {
    case UserRoleEnum.USER:
      return "User";
    case UserRoleEnum.ADMIN:
      return "Admin";
    case UserRoleEnum.MANAGER:
      return "Manager";
    default:
      return "Unknown";
  }
};

export const getUserRoleEnums = () => {
  const enums = Object.entries(UserRoleEnum);
  const result = [];

  for (const [key, value] of enums) {
    if (typeof value === "number") {
      result.push({
        id: value,
        name: getUserRoleEnumLabel(+value),
      });
    }
  }
  return result;
};

export default UserRoleEnum;
