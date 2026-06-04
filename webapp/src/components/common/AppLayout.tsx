/**
 * Application shell — owns sidebar state (desktop collapsed + mobile modal),
 * renders the top navbar, and provides the scrollable content area.
 */

import { LogOut, Menu, Moon, Sun, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState, type ReactNode, type TouchEvent } from 'react';
import { useNavigate } from 'react-router-dom';

import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/contexts/AuthContext';
import { Theme, useTheme } from '@/providers/ThemeProvider';
import AppSidebar from '@/components/dashboard/AppSidebar';
import { View } from '@/types/views';

interface Props {
  headerTitle:      string;
  headerRight?:     ReactNode;
  mutationPending?: boolean;
  children:         ReactNode;
  view:          View;
  searchInput:   string;
  todayCount:    number;
  completedCount:number;
  isSearchActive:boolean;
  onAddTask:     () => void;
  onViewChange:  (v: View) => void;
  onSearchChange:(q: string) => void;
  onSearchClear: () => void;
}

const AppLayout = ({
  headerTitle, headerRight, mutationPending = false, children,
  view, searchInput, todayCount, completedCount, isSearchActive,
  onAddTask, onViewChange, onSearchChange, onSearchClear,
}: Props) => {
  const { user, signOut }    = useAuth();
  const navigate              = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const [collapsed,    setCollapsed]    = useState(false);
  const [mobileOpen,   setMobileOpen]   = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [sheetDrag,    setSheetDrag]    = useState(0);
  const touchStartY   = useRef(0);
  const menuRef       = useRef<HTMLDivElement>(null);
  const userInitial   = user?.name?.charAt(0).toUpperCase() ?? '?';

  const handleClickOutside = useCallback((e: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(e.target as Node)) setShowUserMenu(false);
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [handleClickOutside]);

  function handleMenuToggle(): void {
    if (window.innerWidth >= 1024) setCollapsed(c => !c);
    else setMobileOpen(o => !o);
  }

  function handleSheetTouchStart(e: TouchEvent<HTMLDivElement>): void {
    touchStartY.current = e.touches[0].clientY;
  }

  function handleSheetTouchMove(e: TouchEvent<HTMLDivElement>): void {
    const delta = e.touches[0].clientY - touchStartY.current;
    if (delta > 0) setSheetDrag(delta);
  }

  function handleSheetTouchEnd(): void {
    if (sheetDrag > 80) setMobileOpen(false);
    setSheetDrag(0);
  }

  function handleMobileViewChange(nextView: View): void {
    setMobileOpen(false);
    onViewChange(nextView);
  }

  function handleMobileAddTask(): void {
    setMobileOpen(false);
    onAddTask();
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-white dark:bg-gray-900">

      {/* Top navbar */}
      <nav className="relative z-30 flex h-11 shrink-0 items-center justify-between border-b border-quaternary-200 bg-white px-3 dark:border-gray-700 dark:bg-gray-900 sm:px-4">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button onClick={handleMenuToggle} title="Toggle sidebar"
            className="hidden lg:flex h-8 w-8 items-center justify-center rounded-lg text-quaternary-500 transition-colors hover:bg-quaternary-100 hover:text-quaternary-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200">
            <Menu className="h-4 w-4" />
          </button>
          <button onClick={() => navigate(ROUTES.HOME)}
            className="rounded-lg px-1.5 py-1 text-sm font-bold tracking-tight text-quaternary-900 transition-colors hover:bg-quaternary-50 dark:text-gray-100 dark:hover:bg-gray-800">
            TrackLog
          </button>
        </div>

        <div className="flex items-center gap-1">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            title={theme === Theme.Light ? 'Switch to dark mode' : 'Switch to light mode'}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-quaternary-500 transition-colors hover:bg-quaternary-100 hover:text-quaternary-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200"
          >
            {theme === Theme.Dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          {/* User menu */}
          <div className="relative" ref={menuRef}>
            <button onClick={() => setShowUserMenu(v => !v)}
              className="flex items-center gap-1.5 rounded-lg px-1.5 py-1.5 transition-colors hover:bg-quaternary-100/70 dark:hover:bg-gray-700/70 sm:gap-2 sm:px-2">
              <span className="hidden text-sm text-quaternary-600 dark:text-gray-300 sm:block">{user?.name ?? 'User'}</span>
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-500 text-xs font-bold text-white">
                {userInitial}
              </div>
            </button>

            {showUserMenu && (
              <div className="absolute right-0 top-full z-50 mt-1 w-64 rounded-xl border border-quaternary-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800 sm:w-72">
                <div className="flex items-center gap-3 px-4 py-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-500 text-base font-bold text-white">
                    {userInitial}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-quaternary-800 dark:text-gray-100">{user?.name}</p>
                    <p className="truncate text-xs text-quaternary-400 dark:text-gray-400">{user?.email}</p>
                  </div>
                </div>
                <div className="border-t border-quaternary-100 dark:border-gray-700">
                  <button onClick={() => { signOut(); navigate(ROUTES.APP); }}
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-quaternary-600 transition-colors hover:bg-quaternary-50 hover:text-quaternary-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-gray-100">
                    <LogOut className="h-4 w-4" /> Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Sidebar + Main */}
      <div className="relative flex flex-1 overflow-hidden">

        {/* Mobile backdrop */}
        <div aria-hidden="true" onClick={() => setMobileOpen(false)}
          className={`fixed inset-0 z-40 bg-quaternary-900/40 transition-opacity duration-300 lg:hidden ${
            mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        />

        {/* Mobile bottom sheet */}
        <div
          style={{ transform: mobileOpen ? `translateY(${sheetDrag}px)` : 'translateY(100%)' }}
          className={`fixed inset-x-0 bottom-0 z-50 max-h-[80vh] overflow-y-auto rounded-t-2xl bg-[#fafaf9] shadow-2xl dark:bg-gray-800 lg:hidden ${
            sheetDrag === 0 ? 'transition-transform duration-300 ease-out' : ''
          }`}
          onTouchStart={handleSheetTouchStart}
          onTouchMove={handleSheetTouchMove}
          onTouchEnd={handleSheetTouchEnd}
        >
          <div className="flex items-center justify-between px-4 pb-2 pt-3">
            <div className="mx-auto h-1 w-10 rounded-full bg-quaternary-200 dark:bg-gray-600" />
          </div>

          <AppSidebar collapsed={false} isMobileSheet={true} view={view} searchInput={searchInput}
            todayCount={todayCount} completedCount={completedCount} isSearchActive={isSearchActive}
            onAddTask={handleMobileAddTask} onViewChange={handleMobileViewChange}
            onSearchChange={onSearchChange} onSearchClear={onSearchClear} />
          <div className="h-6" />
        </div>

        {/* Desktop static sidebar */}
        <div className="hidden lg:block">
          <AppSidebar collapsed={collapsed} view={view} searchInput={searchInput}
            todayCount={todayCount} completedCount={completedCount} isSearchActive={isSearchActive}
            onAddTask={onAddTask} onViewChange={onViewChange}
            onSearchChange={onSearchChange} onSearchClear={onSearchClear} />
        </div>

        {/* Main content */}
        <main className="flex min-w-0 flex-1 flex-col overflow-hidden bg-white dark:bg-gray-900">
          <header className="relative flex h-11 shrink-0 items-center justify-between border-b border-quaternary-100 px-4 dark:border-gray-700 sm:px-6">
            <h1 className="text-base font-semibold text-quaternary-800 dark:text-gray-100">{headerTitle}</h1>
            <div className="flex items-center">{headerRight}</div>
            {mutationPending && (
              <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-[2px] overflow-hidden">
                <div className="h-full w-[35%] rounded-full bg-primary"
                  style={{ animation: 'progress-slide 1.2s ease-in-out infinite' }} />
              </div>
            )}
          </header>

          <div className="flex-1 overflow-y-auto">
            <div className="mx-auto max-w-2xl px-4 pb-16 pt-4 sm:px-8 sm:pt-6">
              {children}
            </div>
          </div>

          <footer className="shrink-0 border-t border-quaternary-100 px-4 py-2 text-center text-xs text-quaternary-400 dark:border-gray-800 dark:text-gray-500">
            © {new Date().getFullYear()} TrackLog · All rights reserved
          </footer>
        </main>
      </div>

      {/* Mobile view bottom-right floating menu trigger button */}
      <button
        onClick={handleMenuToggle}
        title="Toggle menu"
        className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-primary-500/30 transition-all duration-200 active:scale-95 hover:bg-primary-hover lg:hidden"
      >
        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>
    </div>
  );
};

export default AppLayout;
