import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Sidebar from './components/Sidebar/Sidebar';
import MainEditorView from './components/Editor/MainEditorView';
import Brainstorming from './pages/Brainstorming';
import Signup from './pages/Signup';
import SecurityBanner from './components/SecurityBanner';
import SyncBadge from './components/SyncBadge';
import './App.css';

function MainLayout() {
  return (
    <>
      <Sidebar />
      <main className="main-content">
        <header className="app-header">
          <nav>
            <Link to="/" className="nav-link">📝 에디터</Link>
            <Link to="/brainstorming" className="nav-link">🧠 브레인스토밍</Link>
          </nav>
          <div className="header-right">
            <SyncBadge />
            <Link to="/signup" className="nav-link signup-link">로그인 / 회원가입</Link>
          </div>
        </header>
        <Routes>
          <Route path="/" element={<MainEditorView />} />
          <Route path="/brainstorming" element={<Brainstorming />} />
        </Routes>
      </main>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <SecurityBanner />
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="*" element={<MainLayout />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
