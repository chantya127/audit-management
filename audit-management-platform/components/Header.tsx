
import React from 'react';
import { Page } from '../App';

interface HeaderProps {
    currentPage: Page;
    setCurrentPage: (page: Page) => void;
}

const Header: React.FC<HeaderProps> = ({ currentPage, setCurrentPage }) => {
  
    const NavLink: React.FC<{ page: Page, children: React.ReactNode }> = ({ page, children }) => {
        const isActive = currentPage === page;
        return (
            <button
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive
                        ? 'text-indigo-700 bg-indigo-100'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
            >
                {children}
            </button>
        );
    };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <h1 className="text-xl font-bold text-gray-900">Audit Management</h1>
            <nav className="flex items-center gap-2">
                <NavLink page="racm">RACM</NavLink>
                <NavLink page="engagements">Engagements</NavLink>
            </nav>
          </div>
          <div className="flex items-center">
            <img
              className="h-8 w-8 rounded-full object-cover"
              src="https://picsum.photos/id/237/100/100"
              alt="User profile"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
