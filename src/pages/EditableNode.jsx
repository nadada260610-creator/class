import React, { useState, useEffect, useRef } from 'react';
import { Handle, Position } from 'reactflow';

export default function EditableNode({ data, isConnectable }) {
  const [label, setLabel] = useState(data.label);
  const inputRef = useRef(null);

  useEffect(() => {
    // 최초 렌더링 시 포커스 (빈 라벨일 경우)
    if (!label && inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleChange = (e) => {
    setLabel(e.target.value);
  };

  const handleBlur = () => {
    if (data.onChange) {
      data.onChange(label);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.target.blur();
    }
  };

  return (
    <div className="editable-node">
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} />
      <input
        ref={inputRef}
        value={label}
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className="nodrag" // react-flow에서 input 드래그 충돌 방지
        placeholder="아이디어 입력..."
      />
      <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} />
    </div>
  );
}
