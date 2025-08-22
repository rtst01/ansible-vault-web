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
                <svg className="lock-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6zm9 14H6V10h12v10z" />
                </svg>
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
