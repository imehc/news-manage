import { Spin } from "antd";
import { type ComponentType, useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router";
import { getToken, http } from "@/lib/http";
import type { RouteRight } from "@/lib/types";
import { useAppStore } from "@/store";
import { Audit } from "@/views/sandbox/audit-manage/audit";
import { AuditList } from "@/views/sandbox/audit-manage/audit-list";
import { Home } from "@/views/sandbox/home";
import { NewsAdd } from "@/views/sandbox/news-manage/news-add";
import { NewsCategory } from "@/views/sandbox/news-manage/news-category";
import { NewsDraft } from "@/views/sandbox/news-manage/news-draft";
import { NewsPreview } from "@/views/sandbox/news-manage/news-preview";
import { NewsUpdate } from "@/views/sandbox/news-manage/news-update";
import { NoPermission } from "@/views/sandbox/no-permission";
import { Published } from "@/views/sandbox/publish-manage/published";
import { Sunset } from "@/views/sandbox/publish-manage/sunset";
import { Unpublished } from "@/views/sandbox/publish-manage/unpublished";
import { RightList } from "@/views/sandbox/right-manage/right";
import { RoleList } from "@/views/sandbox/right-manage/role";
import { UserList } from "@/views/sandbox/user-manage";

const localRouterMap: Record<string, ComponentType> = {
	"/home": Home,
	"/user-manage/list": UserList,
	"/right-manage/role/list": RoleList,
	"/right-manage/right/list": RightList,
	"/news-manage/add": NewsAdd,
	"/news-manage/draft": NewsDraft,
	"/news-manage/category": NewsCategory,
	"/news-manage/preview/:id": NewsPreview,
	"/news-manage/update/:id": NewsUpdate,
	"/audit-manage/audit": Audit,
	"/audit-manage/list": AuditList,
	"/publish-manage/unpublished": Unpublished,
	"/publish-manage/published": Published,
	"/publish-manage/sunset": Sunset,
};

export function NewsRouter() {
	const [routeList, setRouteList] = useState<RouteRight[]>([]);
	const isLoading = useAppStore((s) => s.isLoading);

	useEffect(() => {
		Promise.all([
			http.get<RouteRight[]>("/rights"),
			http.get<RouteRight[]>("/children"),
		]).then(([rights, children]) => {
			setRouteList([...rights, ...children]);
		});
	}, []);

	const token = getToken();
	const rights = token?.role?.rights ?? [];

	const checkRoute = (item: RouteRight) => {
		return (
			localRouterMap[item.key] !== undefined &&
			(item.pagepermisson === 1 || item.routepermisson === 1)
		);
	};

	const checkUserPermission = (item: RouteRight) => {
		return rights.includes(item.key);
	};

	return (
		<Spin size="large" spinning={isLoading}>
			<Routes>
				{routeList
					.filter((item) => checkRoute(item) && checkUserPermission(item))
					.map((item) => {
						const Comp = localRouterMap[item.key];
						return Comp ? (
							<Route path={item.key} key={item.key} element={<Comp />} />
						) : null;
					})}
				<Route path="/" element={<Navigate to="/home" replace />} />
				{routeList.length > 0 && <Route path="*" element={<NoPermission />} />}
			</Routes>
		</Spin>
	);
}
