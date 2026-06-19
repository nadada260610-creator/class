import { useEffect } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { 
  KEY_TAB_COMMAND, 
  KEY_ENTER_COMMAND, 
  COMMAND_PRIORITY_CRITICAL,
  FORMAT_ELEMENT_COMMAND
} from 'lexical';

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
        // 기본 Enter 동작을 허용하되 (새 줄 생성), 생성 후 좌측 정렬을 적용하려면
        // 약간의 지연 후 처리하거나 기본 동작을 오버라이드해야 합니다.
        // MVP에서는 기본 Enter 처리를 돕고 새 줄이 좌측 정렬되게 꼼수를 씁니다.
        setTimeout(() => {
          editor.update(() => {
            editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left');
          });
        }, 10);
        return false; // 기본 Enter 동작을 막지 않음
      },
      COMMAND_PRIORITY_CRITICAL
    );

    return () => {
      removeTabHandler();
      removeEnterHandler();
    };
  }, [editor]);

  return null;
}
