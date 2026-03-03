import { $generateHtmlFromNodes, $generateNodesFromDOM } from "@lexical/html";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { ListItemNode, ListNode } from "@lexical/list";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import {
	$getRoot,
	$insertNodes,
	COMMAND_PRIORITY_EDITOR,
	type EditorState,
	type LexicalEditor,
} from "lexical";
import { useCallback, useEffect } from "react";
import styles from "@/styles/editor.module.css";
import { $createImageNode, ImageNode, INSERT_IMAGE_COMMAND } from "./ImageNode";
import { ToolbarPlugin } from "./ToolbarPlugin";

interface NewsEditorProps {
	getContent: (html: string) => void;
	content?: string;
}

const theme = {
	paragraph: "editor-paragraph",
	heading: {
		h1: "editor-heading-h1",
		h2: "editor-heading-h2",
		h3: "editor-heading-h3",
	},
	list: {
		ul: "editor-list-ul",
		ol: "editor-list-ol",
		listitem: "editor-listitem",
	},
	text: {
		bold: "editor-text-bold",
		italic: "editor-text-italic",
		underline: "editor-text-underline",
		strikethrough: "editor-text-strikethrough",
	},
	quote: "editor-quote",
	link: "editor-link",
};

function onError(error: Error) {
	console.error(error);
}

function HtmlImportPlugin({ html }: { html?: string }) {
	const [editor] = useLexicalComposerContext();
	const imported = useCallback(
		(htmlStr: string) => {
			editor.update(() => {
				const parser = new DOMParser();
				const dom = parser.parseFromString(htmlStr, "text/html");
				const nodes = $generateNodesFromDOM(editor, dom);
				const root = $getRoot();
				root.clear();
				$insertNodes(nodes);
			});
		},
		[editor],
	);

	useEffect(() => {
		if (html) {
			imported(html);
		}
	}, [html, imported]);

	return null;
}

function OnBlurPlugin({ getContent }: { getContent: (html: string) => void }) {
	const [editor] = useLexicalComposerContext();

	useEffect(() => {
		const rootElement = editor.getRootElement();
		if (!rootElement) return;

		const handleBlur = () => {
			editor.read(() => {
				const html = $generateHtmlFromNodes(editor);
				getContent(html);
			});
		};

		rootElement.addEventListener("blur", handleBlur);
		return () => {
			rootElement.removeEventListener("blur", handleBlur);
		};
	}, [editor, getContent]);

	return null;
}

function ImagePlugin() {
	const [editor] = useLexicalComposerContext();

	useEffect(() => {
		return editor.registerCommand(
			INSERT_IMAGE_COMMAND,
			(payload) => {
				const imageNode = $createImageNode(payload);
				$insertNodes([imageNode]);
				return true;
			},
			COMMAND_PRIORITY_EDITOR,
		);
	}, [editor]);

	return null;
}

export function NewsEditor({ getContent, content }: NewsEditorProps) {
	const initialConfig = {
		namespace: "NewsEditor",
		theme,
		onError,
		nodes: [
			HeadingNode,
			QuoteNode,
			ListNode,
			ListItemNode,
			LinkNode,
			AutoLinkNode,
			ImageNode,
		],
	};

	const handleChange = (_editorState: EditorState, editor: LexicalEditor) => {
		editor.read(() => {
			const html = $generateHtmlFromNodes(editor);
			getContent(html);
		});
	};

	return (
		<div className={styles.editorContainer}>
			<LexicalComposer initialConfig={initialConfig}>
				<ToolbarPlugin />
				<RichTextPlugin
					contentEditable={<ContentEditable className="editor-input" />}
					ErrorBoundary={LexicalErrorBoundary}
				/>
				<HistoryPlugin />
				<ListPlugin />
				<LinkPlugin />
				<ImagePlugin />
				<OnChangePlugin onChange={handleChange} />
				<OnBlurPlugin getContent={getContent} />
				{content && <HtmlImportPlugin html={content} />}
			</LexicalComposer>
		</div>
	);
}
