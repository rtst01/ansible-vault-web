import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="modern-header">
      <div className="header-container">
        <div className="header-content">
          {/* Логотип и название */}
          <div className="logo-section">
            <div className="logo-container">
              <div className="logo-icon">
                <span className="lock-icon">🔒</span>
                <div className="logo-glow"></div>
              </div>
            </div>
            <div className="brand-info">
              <h1 className="brand-title">Ansible Vault Web</h1>
              <p className="brand-subtitle">Безопасное шифрование файлов и текста</p>
            </div>
          </div>
          
          {/* Навигация */}
          <nav className="header-navigation">
            <a href="#features" className="nav-link">
              <span className="nav-icon">🚀</span>
              <span className="nav-text">Возможности</span>
            </a>
            <a href="#security" className="nav-link">
              <span className="nav-icon">🛡️</span>
              <span className="nav-text">Безопасность</span>
            </a>
            <a href="#docs" className="nav-link">
              <span className="nav-icon">📚</span>
              <span className="nav-text">Документация</span>
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
