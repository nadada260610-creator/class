import React from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { ListNode, ListItemNode } from '@lexical/list';
import ShortcutPlugin from './plugins/ShortcutPlugin';
import './EditorStyles.css';
import useProjectStore from '../../store/projectStore';

const theme = {
  ltr: 'ltr',
  rtl: 'rtl',
  placeholder: 'editor-placeholder',
  paragraph: 'editor-paragraph',
  quote: 'editor-quote',
  heading: {
    h1: 'editor-heading-h1',
    h2: 'editor-heading-h2',
    h3: 'editor-heading-h3',
  },
  list: {
    nested: {
      listitem: 'editor-nested-listitem',
    },
    ol: 'editor-list-ol',
    ul: 'editor-list-ul',
    listitem: 'editor-listitem',
  },
  image: 'editor-image',
  text: {
    bold: 'editor-text-bold',
    italic: 'editor-text-italic',
    overflowed: 'editor-text-overflowed',
    hashtag: 'editor-text-hashtag',
    underline: 'editor-text-underline',
    strikethrough: 'editor-text-strikethrough',
    underlineStrikethrough: 'editor-text-underlineStrikethrough',
    code: 'editor-text-code',
  },
};

function onError(error) {
  console.error(error);
}

const ScenarioEditor = () => {
  const { project } = useProjectStore();
  
  const initialConfig = {
    namespace: 'AuthorBoxEditor',
    theme,
    onError,
    nodes: [ListNode, ListItemNode],
  };

  return (
    <div className="editor-container">
      <div className="editor-page">
        <LexicalComposer initialConfig={initialConfig}>
          <div className="editor-inner">
            <RichTextPlugin
              contentEditable={<ContentEditable className="editor-input" />}
              placeholder={<div className="editor-placeholder-text">S# {project.nodes[0]?.children[0]?.children[0]?.scene_number || 1}. 씬 내용을 입력하세요...</div>}
              ErrorBoundary={LexicalErrorBoundary}
            />
            <HistoryPlugin />
            <ListPlugin />
            <ShortcutPlugin />
          </div>
        </LexicalComposer>
      </div>
    </div>
  );
};

export default ScenarioEditor;
