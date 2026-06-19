import React, { useState } from 'react';
import Tree from './Tree';

const TreeNode = ({ node, level }) => {
  const [isOpen, setIsOpen] = useState(true);
  const isFolder = node.type === 'folder' || node.type === 'sequence';
  const hasChildren = node.children && node.children.length > 0;

  const toggleOpen = () => {
    if (isFolder) setIsOpen(!isOpen);
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
        <span className="node-title">
          {node.type === 'scene' ? `S#${node.scene_number}. ` : ''}
          {node.title || node.summary}
        </span>
        {isFolder && hasChildren && (
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
