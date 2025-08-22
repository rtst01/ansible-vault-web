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
                <svg className="vault-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M12,6A6,6 0 0,0 6,12A6,6 0 0,0 12,18A6,6 0 0,0 18,12A6,6 0 0,0 12,6M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8Z"/>
                  <path d="M12,10A2,2 0 0,0 10,12A2,2 0 0,0 12,14A2,2 0 0,0 14,12A2,2 0 0,0 12,10Z"/>
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
