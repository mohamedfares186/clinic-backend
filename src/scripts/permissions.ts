import { Role, Permission } from "../models/index.js";
import { logger } from "..//middleware/logger.js";
import type { UUIDTypes } from "uuid";

const Permissions = async () => {
  try {
    const admin: Role | null = await Role.findOne({
      where: { title: "admin" },
    });

    const user: Role | null = await Role.findOne({
      where: { title: "user" },
    });

    if (admin === null || user === null)
      throw new Error("Default Roles has not been initialized");

    const adminRoleId: UUIDTypes = admin.roleId;
    const userRoleId: UUIDTypes = user.roleId;

    return await Permission.bulkCreate([
      { action: "create", roleId: adminRoleId, category: "user" },
      { action: "update", roleId: adminRoleId, category: "user" },
      { action: "read", roleId: adminRoleId, category: "user" },
      { action: "delete", roleId: adminRoleId, category: "user" },
      { action: "create", roleId: userRoleId, category: "appointment" },
    ]);
  } catch (error) {
    logger.error(`Error initiating default permissions - ${error}`);
    return;
  }
};

export default Permissions;
