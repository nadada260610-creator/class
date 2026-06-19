import { useEffect } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { 
  KEY_TAB_COMMAND, 
  KEY_ENTER_COMMAND, 
  COMMAND_PRIORITY_CRITICAL,
  FORMAT_ELEMENT_COMMAND,
  KEY_DOWN_COMMAND
} from 'lexical';
import { INSERT_ORDERED_LIST_COMMAND } from '@lexical/list';

export default function ShortcutPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    // Tab 키 감지: 대사 모드 (중앙 정렬)
    const removeTabHandler = editor.registerCommand(
      KEY_TAB_COMMAND,
      (event) => {
        event.preventDefault();
        editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center');
        return true;
      },
      COMMAND_PRIORITY_CRITICAL
    );

    // Enter 키 감지: 지문 모드로 복귀 (좌측 정렬)
    const removeEnterHandler = editor.registerCommand(
      KEY_ENTER_COMMAND,
      (event) => {
        setTimeout(() => {
          editor.update(() => {
            editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left');
          });
        }, 10);
        return false;
      },
      COMMAND_PRIORITY_CRITICAL
    );

    // Ctrl+Shift+1 감지: 번호 매기기 (Ordered List)
    const removeNumberingHandler = editor.registerCommand(
      KEY_DOWN_COMMAND,
      (event) => {
        if (event.ctrlKey && event.shiftKey && event.key === '1') {
          event.preventDefault();
          editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
          return true;
        }
        return false;
      },
      COMMAND_PRIORITY_CRITICAL
    );

    return () => {
      removeTabHandler();
      removeEnterHandler();
      removeNumberingHandler();
    };
  }, [editor]);

  return null;
}
