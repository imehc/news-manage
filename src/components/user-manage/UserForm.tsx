import type { FormInstance } from "antd";
import { Form, Input, Select } from "antd";
import { forwardRef, useEffect, useState } from "react";
import { getToken } from "@/lib/http";
import type { Region, Role } from "@/lib/types";

interface UserFormProps {
	regionList: Region[];
	rolelist: Role[];
	isUpdateDisabled?: boolean;
	isUpdate?: boolean;
}

const roleObj: Record<string, string> = {
	"1": "superadmin",
	"2": "admin",
	"3": "editor",
};

export const UserForm = forwardRef<FormInstance, UserFormProps>(
	(props, ref) => {
		const [isDisable, setIsDisable] = useState(false);

		useEffect(() => {
			setIsDisable(props.isUpdateDisabled ?? false);
		}, [props.isUpdateDisabled]);

		const token = getToken();
		const roleId = String(token?.roleId ?? "");
		const region = token?.region ?? "";

		const checkRegionDisabled = (item: Region) => {
			if (props.isUpdate) {
				return roleObj[roleId] !== "superadmin";
			}
			if (roleObj[roleId] === "superadmin") return false;
			return item.value !== region;
		};

		const checkRoleDisabled = (item: Role) => {
			if (props.isUpdate) {
				return roleObj[roleId] !== "superadmin";
			}
			if (roleObj[roleId] === "superadmin") return false;
			return roleObj[String(item.id)] !== "editor";
		};

		return (
			<Form layout="vertical" ref={ref}>
				<Form.Item
					name="username"
					label="用户名"
					rules={[{ required: true, message: "请填写用户名" }]}
				>
					<Input />
				</Form.Item>
				<Form.Item
					name="password"
					label="密码"
					rules={[{ required: true, message: "请填写密码" }]}
				>
					<Input />
				</Form.Item>
				<Form.Item
					name="region"
					label="区域"
					rules={isDisable ? [] : [{ required: true, message: "请选择区域" }]}
				>
					<Select disabled={isDisable}>
						{props.regionList.map((item) => (
							<Select.Option
								value={item.value}
								key={item.id}
								disabled={checkRegionDisabled(item)}
							>
								{item.title}
							</Select.Option>
						))}
					</Select>
				</Form.Item>
				<Form.Item
					name="roleId"
					label="角色"
					rules={[{ required: true, message: "请选择角色" }]}
				>
					<Select
						onChange={(value: number) => {
							if (value === 1) {
								setIsDisable(true);
								if (ref && "current" in ref && ref.current) {
									ref.current.setFieldsValue({ region: "" });
								}
							} else {
								setIsDisable(false);
							}
						}}
					>
						{props.rolelist.map((item) => (
							<Select.Option
								value={item.id}
								key={item.id}
								disabled={checkRoleDisabled(item)}
							>
								{item.roleName}
							</Select.Option>
						))}
					</Select>
				</Form.Item>
			</Form>
		);
	},
);
