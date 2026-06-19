import React from 'react';
import TreeNode from './TreeNode';

const Tree = ({ nodes, level = 0 }) => {
  if (!nodes || nodes.length === 0) return null;

  return (
    <div className="tree-container">
      {nodes.map((node) => (
        <TreeNode key={node.id} node={node} level={level} />
      ))}
    </div>
  );
};

export default Tree;
