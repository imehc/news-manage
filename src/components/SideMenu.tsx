import {
	CloudOutlined,
	CloudServerOutlined,
	CloudSyncOutlined,
	CloudUploadOutlined,
	ControlOutlined,
	CopyOutlined,
	EditOutlined,
	HomeOutlined,
	MonitorOutlined,
	NodeIndexOutlined,
	ProfileOutlined,
	ReconciliationOutlined,
	RestOutlined,
	ShareAltOutlined,
	SnippetsOutlined,
	TeamOutlined,
	UserOutlined,
} from "@ant-design/icons";
import { Layout, Menu } from "antd";
import type { ItemType } from "antd/es/menu/interface";
import { type ReactNode, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { getToken, http } from "@/lib/http";
import type { Right } from "@/lib/types";
import { useAppStore } from "@/store";
import "@/styles/sidebar.css";

const { Sider } = Layout;

const iconMap: Record<string, ReactNode> = {
	"/home": <HomeOutlined />,
	"/user-manage": <UserOutlined />,
	"/user-manage/list": <TeamOutlined />,
	"/right-manage": <ControlOutlined />,
	"/right-manage/role/list": <NodeIndexOutlined />,
	"/right-manage/right/list": <ShareAltOutlined />,
	"/news-manage": <SnippetsOutlined />,
	"/news-manage/add": <EditOutlined />,
	"/news-manage/draft": <RestOutlined />,
	"/news-manage/category": <CopyOutlined />,
	"/audit-manage": <MonitorOutlined />,
	"/audit-manage/audit": <ReconciliationOutlined />,
	"/audit-manage/list": <ProfileOutlined />,
	"/publish-manage": <CloudServerOutlined />,
	"/publish-manage/unpublished": <CloudSyncOutlined />,
	"/publish-manage/published": <CloudUploadOutlined />,
	"/publish-manage/sunset": <CloudOutlined />,
};

export function SideMenu() {
	const [menuList, setMenuList] = useState<Right[]>([]);
	const isCollapsed = useAppStore((s) => s.isCollapsed);
	const navigate = useNavigate();
	const location = useLocation();

	useEffect(() => {
		http.get<Right[]>("/rights?_embed=children").then(setMenuList);
	}, []);

	const token = getToken();
	const rights = token?.role?.rights ?? [];

	const checkPermission = (item: { key: string; pagepermisson?: number }) => {
		return item.pagepermisson === 1 && rights.includes(item.key);
	};

	const buildMenuItems = (list: Right[]): ItemType[] => {
		return list
			.filter((item) => checkPermission(item))
			.map((item) => {
				if (item.children && item.children.length > 0) {
					const children = item.children
						.filter((child) => checkPermission(child))
						.map((child) => ({
							key: child.key,
							icon: iconMap[child.key],
							label: child.title,
							onClick: () => navigate(child.key),
						}));
					if (children.length === 0) return null;
					return {
						key: item.key,
						icon: iconMap[item.key],
						label: item.title,
						children,
					};
				}
				return {
					key: item.key,
					icon: iconMap[item.key],
					label: item.title,
					onClick: () => navigate(item.key),
				};
			})
			.filter(Boolean) as ItemType[];
	};

	const selectedKeys = [location.pathname];
	const openKeys = [`/${location.pathname.split("/")[1]}`];

	return (
		<Sider trigger={null} collapsible collapsed={isCollapsed}>
			<div style={{ display: "flex", height: "100%", flexDirection: "column" }}>
				<div className="logo">
					{isCollapsed ? "News" : "News Publishing System"}
				</div>
				<div style={{ flex: 1, overflow: "auto" }}>
					<Menu
						theme="dark"
						mode="inline"
						selectedKeys={selectedKeys}
						defaultOpenKeys={openKeys}
						items={buildMenuItems(menuList)}
					/>
				</div>
			</div>
		</Sider>
	);
}
