import { LockOutlined, UserOutlined } from "@ant-design/icons";
import type { ISourceOptions } from "@tsparticles/engine";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { Button, Form, Input, message } from "antd";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { http, setToken } from "@/lib/http";
import type { User } from "@/lib/types";
import styles from "@/styles/login.module.css";

export function Login() {
	const navigate = useNavigate();
	const [init, setInit] = useState(false);

	useEffect(() => {
		initParticlesEngine(async (engine) => {
			await loadSlim(engine);
		}).then(() => {
			setInit(true);
		});
	}, []);

	const particlesOptions: ISourceOptions = useMemo(
		() => ({
			background: {
				color: { value: "rgb(85,101,207)" },
				position: "50% 50%",
				repeat: "no-repeat",
				size: "cover",
			},
			fullScreen: { enable: true, zIndex: 1 },
			interactivity: {
				events: {
					onClick: { enable: true, mode: "push" },
					onHover: {
						enable: true,
						mode: "bubble",
						parallax: { force: 60 },
					},
				},
				modes: {
					bubble: { distance: 400, duration: 2, opacity: 1, size: 40 },
					grab: { distance: 400 },
				},
			},
			particles: {
				color: { value: "#ffffff" },
				links: {
					color: { value: "#fff" },
					distance: 150,
					opacity: 0.4,
				},
				move: {
					attract: { rotate: { x: 600, y: 1200 } },
					enable: true,
					outModes: {
						default: "bounce" as const,
						bottom: "bounce" as const,
						left: "bounce" as const,
						right: "bounce" as const,
						top: "bounce" as const,
					},
					speed: 6,
				},
				number: {
					density: { enable: true },
					value: 170,
				},
				opacity: {
					animation: { speed: 1, minimumValue: 0.1 },
				},
				shape: {
					options: {
						character: {
							fill: false,
							font: "Verdana",
							style: "",
							value: "*",
							weight: "400",
						},
						char: {
							fill: false,
							font: "Verdana",
							style: "",
							value: "*",
							weight: "400",
						},
						polygon: { nb_sides: 5 },
						star: { nb_sides: 5 },
						image: {
							height: 32,
							replace_color: true,
							src: "/logo192.png",
							width: 32,
						},
						images: {
							height: 32,
							replace_color: true,
							src: "/logo192.png",
							width: 32,
						},
					},
					type: "image",
				},
				size: {
					value: 16,
					animation: { speed: 40, minimumValue: 0.1 },
				},
				stroke: {
					color: {
						value: "#000000",
						animation: {
							h: {
								count: 0,
								enable: false,
								offset: 0,
								speed: 1,
								sync: true,
							},
							s: {
								count: 0,
								enable: false,
								offset: 0,
								speed: 1,
								sync: true,
							},
							l: {
								count: 0,
								enable: false,
								offset: 0,
								speed: 1,
								sync: true,
							},
						},
					},
				},
			},
		}),
		[],
	);

	const onFinish = (values: { username: string; password: string }) => {
		http
			.get<User[]>(
				`/users?username=${values.username}&password=${values.password}&roleState=true&_expand=role`,
			)
			.then((data) => {
				if (data.length === 0) {
					message.error("用户名或者密码不匹配");
				} else {
					const user = data[0];
					if (user) {
						setToken(user);
						navigate("/");
						message.success("登录成功");
					}
				}
			});
	};

	return (
		<div
			style={{
				background: "rgb(85, 101, 207)",
				height: "100vh",
				overflow: "hidden",
				position: "relative",
			}}
		>
			{init && <Particles id="tsparticles" options={particlesOptions} />}
			<div className={styles.formContainer}>
				<div className={styles.loginTitle}>Earth News Publishing System</div>
				<Form name="normal_login" onFinish={onFinish}>
					<Form.Item
						name="username"
						rules={[{ required: true, message: "Please input your Username!" }]}
					>
						<Input prefix={<UserOutlined />} placeholder="Username" />
					</Form.Item>
					<Form.Item
						name="password"
						rules={[{ required: true, message: "Please input your Password!" }]}
					>
						<Input
							prefix={<LockOutlined />}
							type="password"
							placeholder="Password"
						/>
					</Form.Item>
					<Form.Item>
						<Button type="primary" htmlType="submit" block>
							登录
						</Button>
					</Form.Item>
				</Form>
			</div>
		</div>
	);
}
