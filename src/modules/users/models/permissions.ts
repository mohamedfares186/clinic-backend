import sequelize from "../../../config/db.js";
import { DataTypes, Model } from "sequelize";
import Role from "./roles.js";
import type { UUID } from "crypto";

class Permission extends Model {
  declare permissionId: UUID;
  declare action: string;
  declare roleId: UUID;
  declare category: string;
  declare description: string;
}

Permission.init(
  {
    permissionId: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    action: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    roleId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: "Roles", key: "roleId" },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "Permissions",
    timestamps: true,
    indexes: [{ fields: ["action", "roleId", "category"] }],
    sequelize,
  }
);

Role.hasMany(Permission, {
  foreignKey: "roleId",
});

Permission.belongsTo(Role, {
  foreignKey: "roleId",
});

export default Permission;
