import React, { useState, useEffect } from 'react';
import useProjectStore from '../../store/projectStore';

const MemoEditor = ({ node }) => {
  const { updateNodeMemo } = useProjectStore();
  const [memo, setMemo] = useState(node.memo || '');

  // 노드가 바뀔 때마다 상태 동기화
  useEffect(() => {
    setMemo(node.memo || '');
  }, [node.id, node.memo]);

  const handleChange = (e) => {
    setMemo(e.target.value);
  };

  const handleBlur = () => {
    updateNodeMemo(node.id, memo);
  };

  return (
    <div className="editor-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div className="editor-page" style={{ display: 'flex', flexDirection: 'column' }}>
        <h2 style={{ marginBottom: '20px', color: 'var(--text-primary)', borderBottom: '1px solid var(--border-light)', paddingBottom: '10px' }}>
          📝 {node.title} 메모장
        </h2>
        <textarea
          style={{
            flex: 1,
            width: '100%',
            border: 'none',
            outline: 'none',
            resize: 'none',
            fontSize: '11pt',
            lineHeight: '1.8',
            fontFamily: 'inherit',
            backgroundColor: 'transparent',
            color: 'var(--text-primary)'
          }}
          placeholder="이곳에 기획 의도나 간단한 아이디어를 메모하세요..."
          value={memo}
          onChange={handleChange}
          onBlur={handleBlur}
        />
      </div>
    </div>
  );
};

export default MemoEditor;
