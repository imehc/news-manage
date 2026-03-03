import {
	MenuFoldOutlined,
	MenuUnfoldOutlined,
	UserOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Avatar, Dropdown, Layout } from "antd";
import { useNavigate } from "react-router";
import { getToken, removeToken } from "@/lib/http";
import { useAppStore } from "@/store";

const { Header } = Layout;

export function TopHeader() {
	const isCollapsed = useAppStore((s) => s.isCollapsed);
	const toggleCollapsed = useAppStore((s) => s.toggleCollapsed);
	const navigate = useNavigate();

	const token = getToken();
	const roleName = token?.role?.roleName ?? "";
	const username = token?.username ?? "";
	const avatar = token?.avatar;

	const menuItems: MenuProps["items"] = [
		{ key: "role", label: roleName },
		{
			key: "logout",
			label: "退出",
			danger: true,
			onClick: () => {
				removeToken();
				navigate("/login", { replace: true });
			},
		},
	];

	return (
		<Header
			className="site-layout-background"
			style={{ padding: "0 16px", display: "flex", alignItems: "center" }}
		>
			{isCollapsed ? (
				<MenuUnfoldOutlined
					onClick={toggleCollapsed}
					style={{ fontSize: 18, cursor: "pointer" }}
				/>
			) : (
				<MenuFoldOutlined
					onClick={toggleCollapsed}
					style={{ fontSize: 18, cursor: "pointer" }}
				/>
			)}
			<div
				style={{
					marginLeft: "auto",
					display: "flex",
					alignItems: "center",
					gap: 10,
				}}
			>
				<span>
					欢迎<span style={{ color: "#1677ff" }}>{username}</span>回来
				</span>
				<Dropdown menu={{ items: menuItems }}>
					<Avatar
						size="large"
						icon={<UserOutlined />}
						src={avatar || undefined}
						style={{ cursor: "pointer" }}
					/>
				</Dropdown>
			</div>
		</Header>
	);
}
