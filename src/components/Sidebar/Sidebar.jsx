import React from 'react';
import Tree from './Tree';
import './Sidebar.css';
import useProjectStore from '../../store/projectStore';

const Sidebar = () => {
  const { project } = useProjectStore();

  return (
    <aside className="sidebar">
      <div className="sidebar-content">
        <Tree nodes={project.nodes} />
      </div>
    </aside>
  );
};

export default Sidebar;
