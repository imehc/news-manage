import {
	AlignCenterOutlined,
	AlignLeftOutlined,
	AlignRightOutlined,
	BgColorsOutlined,
	BoldOutlined,
	FontColorsOutlined,
	ItalicOutlined,
	LinkOutlined,
	MenuOutlined,
	OrderedListOutlined,
	PictureOutlined,
	StrikethroughOutlined,
	UnderlineOutlined,
	UnorderedListOutlined,
} from "@ant-design/icons";
import { TOGGLE_LINK_COMMAND } from "@lexical/link";
import {
	INSERT_ORDERED_LIST_COMMAND,
	INSERT_UNORDERED_LIST_COMMAND,
} from "@lexical/list";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $createHeadingNode, $createQuoteNode } from "@lexical/rich-text";
import { $patchStyleText, $setBlocksType } from "@lexical/selection";
import { ColorPicker, Input, Modal, Select } from "antd";
import {
	$getSelection,
	$isRangeSelection,
	FORMAT_ELEMENT_COMMAND,
	FORMAT_TEXT_COMMAND,
} from "lexical";
import { useCallback, useState } from "react";
import styles from "@/styles/editor.module.css";
import { INSERT_IMAGE_COMMAND } from "./ImageNode";

const FONT_SIZES = [
	{ label: "12px", value: "12px" },
	{ label: "14px", value: "14px" },
	{ label: "16px", value: "16px" },
	{ label: "18px", value: "18px" },
	{ label: "20px", value: "20px" },
	{ label: "24px", value: "24px" },
	{ label: "28px", value: "28px" },
	{ label: "32px", value: "32px" },
];

function Separator() {
	return <div className={styles.toolbarSeparator} />;
}

export function ToolbarPlugin() {
	const [editor] = useLexicalComposerContext();
	const [linkModalOpen, setLinkModalOpen] = useState(false);
	const [linkUrl, setLinkUrl] = useState("");
	const [imageModalOpen, setImageModalOpen] = useState(false);
	const [imageSrc, setImageSrc] = useState("");
	const [imageAlt, setImageAlt] = useState("");

	const formatHeading = useCallback(
		(level: "h1" | "h2" | "h3") => {
			editor.update(() => {
				const selection = $getSelection();
				if ($isRangeSelection(selection)) {
					$setBlocksType(selection, () => $createHeadingNode(level));
				}
			});
		},
		[editor],
	);

	const formatQuote = useCallback(() => {
		editor.update(() => {
			const selection = $getSelection();
			if ($isRangeSelection(selection)) {
				$setBlocksType(selection, () => $createQuoteNode());
			}
		});
	}, [editor]);

	const applyStyleText = useCallback(
		(styleProperty: Record<string, string>) => {
			editor.update(() => {
				const selection = $getSelection();
				if ($isRangeSelection(selection)) {
					$patchStyleText(selection, styleProperty);
				}
			});
		},
		[editor],
	);

	const handleFontColor = useCallback(
		(color: string) => {
			applyStyleText({ color });
		},
		[applyStyleText],
	);

	const handleBgColor = useCallback(
		(color: string) => {
			applyStyleText({ "background-color": color });
		},
		[applyStyleText],
	);

	const handleFontSize = useCallback(
		(size: string) => {
			applyStyleText({ "font-size": size });
		},
		[applyStyleText],
	);

	const handleInsertLink = useCallback(() => {
		if (linkUrl.trim()) {
			editor.dispatchCommand(TOGGLE_LINK_COMMAND, linkUrl.trim());
		}
		setLinkModalOpen(false);
		setLinkUrl("");
	}, [editor, linkUrl]);

	const handleInsertImage = useCallback(() => {
		if (imageSrc.trim()) {
			editor.dispatchCommand(INSERT_IMAGE_COMMAND, {
				src: imageSrc.trim(),
				altText: imageAlt.trim() || "image",
			});
		}
		setImageModalOpen(false);
		setImageSrc("");
		setImageAlt("");
	}, [editor, imageSrc, imageAlt]);

	return (
		<div className={styles.toolbar}>
			{/* 文本格式 */}
			<button
				type="button"
				className={styles.toolbarButton}
				onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")}
				title="加粗"
			>
				<BoldOutlined />
			</button>
			<button
				type="button"
				className={styles.toolbarButton}
				onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")}
				title="斜体"
			>
				<ItalicOutlined />
			</button>
			<button
				type="button"
				className={styles.toolbarButton}
				onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline")}
				title="下划线"
			>
				<UnderlineOutlined />
			</button>
			<button
				type="button"
				className={styles.toolbarButton}
				onClick={() =>
					editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough")
				}
				title="删除线"
			>
				<StrikethroughOutlined />
			</button>

			<Separator />

			{/* 标题 */}
			<button
				type="button"
				className={styles.toolbarButton}
				onClick={() => formatHeading("h1")}
				title="标题1"
			>
				H1
			</button>
			<button
				type="button"
				className={styles.toolbarButton}
				onClick={() => formatHeading("h2")}
				title="标题2"
			>
				H2
			</button>
			<button
				type="button"
				className={styles.toolbarButton}
				onClick={() => formatHeading("h3")}
				title="标题3"
			>
				H3
			</button>

			<Separator />

			{/* 字号 */}
			<Select
				size="small"
				placeholder="字号"
				options={FONT_SIZES}
				onChange={handleFontSize}
				style={{ width: 80 }}
				allowClear
			/>

			<Separator />

			{/* 字体颜色 */}
			<ColorPicker
				size="small"
				defaultValue="#000000"
				onChangeComplete={(color) => handleFontColor(color.toHexString())}
			>
				<button type="button" className={styles.toolbarButton} title="字体颜色">
					<FontColorsOutlined />
				</button>
			</ColorPicker>

			{/* 背景颜色 */}
			<ColorPicker
				size="small"
				defaultValue="#ffffff"
				onChangeComplete={(color) => handleBgColor(color.toHexString())}
			>
				<button type="button" className={styles.toolbarButton} title="背景颜色">
					<BgColorsOutlined />
				</button>
			</ColorPicker>

			<Separator />

			{/* 对齐 */}
			<button
				type="button"
				className={styles.toolbarButton}
				onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left")}
				title="左对齐"
			>
				<AlignLeftOutlined />
			</button>
			<button
				type="button"
				className={styles.toolbarButton}
				onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "center")}
				title="居中对齐"
			>
				<AlignCenterOutlined />
			</button>
			<button
				type="button"
				className={styles.toolbarButton}
				onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right")}
				title="右对齐"
			>
				<AlignRightOutlined />
			</button>
			<button
				type="button"
				className={styles.toolbarButton}
				onClick={() =>
					editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "justify")
				}
				title="两端对齐"
			>
				<MenuOutlined />
			</button>

			<Separator />

			{/* 列表和引用 */}
			<button
				type="button"
				className={styles.toolbarButton}
				onClick={() =>
					editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)
				}
				title="无序列表"
			>
				<UnorderedListOutlined />
			</button>
			<button
				type="button"
				className={styles.toolbarButton}
				onClick={() =>
					editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)
				}
				title="有序列表"
			>
				<OrderedListOutlined />
			</button>
			<button
				type="button"
				className={styles.toolbarButton}
				onClick={formatQuote}
				title="引用"
			>
				&ldquo;&rdquo;
			</button>

			<Separator />

			{/* 链接 */}
			<button
				type="button"
				className={styles.toolbarButton}
				onClick={() => setLinkModalOpen(true)}
				title="插入链接"
			>
				<LinkOutlined />
			</button>

			{/* 图片 */}
			<button
				type="button"
				className={styles.toolbarButton}
				onClick={() => setImageModalOpen(true)}
				title="插入图片"
			>
				<PictureOutlined />
			</button>

			{/* 链接弹窗 */}
			<Modal
				title="插入链接"
				open={linkModalOpen}
				okText="确定"
				cancelText="取消"
				onOk={handleInsertLink}
				onCancel={() => {
					setLinkModalOpen(false);
					setLinkUrl("");
				}}
			>
				<Input
					placeholder="请输入链接地址"
					value={linkUrl}
					onChange={(e) => setLinkUrl(e.target.value)}
					onPressEnter={handleInsertLink}
				/>
			</Modal>

			{/* 图片弹窗 */}
			<Modal
				title="插入图片"
				open={imageModalOpen}
				okText="确定"
				cancelText="取消"
				onOk={handleInsertImage}
				onCancel={() => {
					setImageModalOpen(false);
					setImageSrc("");
					setImageAlt("");
				}}
			>
				<Input
					placeholder="图片地址 (URL)"
					value={imageSrc}
					onChange={(e) => setImageSrc(e.target.value)}
					style={{ marginBottom: 12 }}
				/>
				<Input
					placeholder="图片描述 (alt text)"
					value={imageAlt}
					onChange={(e) => setImageAlt(e.target.value)}
				/>
			</Modal>
		</div>
	);
}
