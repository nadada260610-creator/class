import React, { useState, useRef, useEffect } from 'react';
import Tree from './Tree';
import useProjectStore from '../../store/projectStore';

const TreeNode = ({ node, level }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const inputRef = useRef(null);
  
  const { addNode, updateNodeTitle, deleteNode } = useProjectStore();

  const isFolder = node.type === 'folder' || node.type === 'sequence';
  const hasChildren = node.children && node.children.length > 0;

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const toggleOpen = () => {
    if (isFolder && !isEditing) setIsOpen(!isOpen);
  };

  const handleDoubleClick = (e) => {
    e.stopPropagation();
    setEditTitle(node.title || node.summary);
    setIsEditing(true);
  };

  const handleTitleChange = (e) => {
    setEditTitle(e.target.value);
  };

  const handleTitleSubmit = () => {
    if (editTitle.trim()) {
      updateNodeTitle(node.id, editTitle.trim());
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleTitleSubmit();
    if (e.key === 'Escape') setIsEditing(false);
  };

  const handleAdd = (e, type) => {
    e.stopPropagation();
    addNode(node.id, type);
    setIsOpen(true);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm('정말 삭제하시겠습니까? 하위 항목도 모두 삭제됩니다.')) {
      deleteNode(node.id);
    }
  };

  const getNodeIcon = () => {
    if (node.type === 'folder') return '📁';
    if (node.type === 'sequence') return '🎬';
    if (node.type === 'scene') return '📄';
    return '📄';
  };

  const indentStyle = { paddingLeft: `${level * 16}px` };

  return (
    <div className="tree-node-wrapper">
      <div 
        className={`tree-node ${node.type}`} 
        style={indentStyle}
        onClick={toggleOpen}
      >
        <span className="node-icon">{getNodeIcon()}</span>
        
        {isEditing ? (
          <input
            ref={inputRef}
            className="node-edit-input"
            value={editTitle}
            onChange={handleTitleChange}
            onBlur={handleTitleSubmit}
            onKeyDown={handleKeyDown}
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <span 
            className="node-title" 
            onDoubleClick={handleDoubleClick}
            title="더블클릭하여 이름 수정"
          >
            {node.type === 'scene' ? `S#${node.scene_number}. ` : ''}
            {node.title || node.summary}
          </span>
        )}

        {!isEditing && (
          <div className="node-actions">
            {node.type === 'folder' && (
              <>
                <button className="action-add" onClick={(e) => handleAdd(e, 'folder')} title="하위 카테고리 추가">+폴더</button>
                <button className="action-add" onClick={(e) => handleAdd(e, 'sequence')} title="시퀀스 추가">+시퀀스</button>
              </>
            )}
            {node.type === 'sequence' && (
              <button className="action-add" onClick={(e) => handleAdd(e, 'scene')} title="씬 추가">+씬</button>
            )}
            <button className="action-delete" onClick={(e) => handleDelete(e)} title="삭제">-</button>
          </div>
        )}

        {isFolder && hasChildren && !isEditing && (
          <span className="node-chevron">{isOpen ? '▼' : '▶'}</span>
        )}
      </div>
      
      {isFolder && isOpen && hasChildren && (
        <div className="tree-children">
          <Tree nodes={node.children} level={level + 1} />
        </div>
      )}
    </div>
  );
};

export default TreeNode;
