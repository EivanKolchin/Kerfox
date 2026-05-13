/**
 * App routing and history management
 * Encodes app state into URL hash for proper browser back/forward support
 */

export function encodeAppState(state) {
  const {
    page = 'learn',
    selectedLevelId = null,
    selectedCourseId = null,
    selectedModuleId = null,
    guidesSection = null,
    searchQuery = '',
  } = state;

  if (page === 'login') {
    return '#/login';
  }

  if (page === 'guides' && guidesSection) {
    return `#/guides/${encodeURIComponent(guidesSection)}`;
  }

  if (guidesSection) {
    return `#/guides/${encodeURIComponent(guidesSection)}`;
  }

  if (selectedModuleId) {
    return `#/level/${encodeURIComponent(selectedLevelId)}/course/${encodeURIComponent(selectedCourseId)}/module/${encodeURIComponent(selectedModuleId)}`;
  }

  if (selectedCourseId) {
    return `#/level/${encodeURIComponent(selectedLevelId)}/course/${encodeURIComponent(selectedCourseId)}`;
  }

  if (selectedLevelId) {
    return `#/level/${encodeURIComponent(selectedLevelId)}`;
  }

  if (searchQuery) {
    return `#/?q=${encodeURIComponent(searchQuery)}`;
  }

  return '#/';
}

export function decodeAppState(hash) {
  const state = {
    page: 'learn',
    selectedLevelId: null,
    selectedCourseId: null,
    selectedModuleId: null,
    guidesSection: null,
    searchQuery: '',
  };

  if (!hash || hash === '#' || hash === '#/') {
    return state;
  }

  const cleanHash = hash.startsWith('#') ? hash.slice(1) : hash;

  // Login page
  if (cleanHash === '/login') {
    state.page = 'login';
    return state;
  }

  // Guides page
  if (cleanHash.startsWith('/guides/')) {
    state.page = 'guides';
    state.guidesSection = decodeURIComponent(cleanHash.slice(8));
    return state;
  }

  // Module view
  const moduleMatch = cleanHash.match(
    /^\/level\/([^/]+)\/course\/([^/]+)\/module\/([^/]+)$/
  );
  if (moduleMatch) {
    state.selectedLevelId = decodeURIComponent(moduleMatch[1]);
    state.selectedCourseId = decodeURIComponent(moduleMatch[2]);
    state.selectedModuleId = decodeURIComponent(moduleMatch[3]);
    return state;
  }

  // Course view
  const courseMatch = cleanHash.match(/^\/level\/([^/]+)\/course\/([^/]+)$/);
  if (courseMatch) {
    state.selectedLevelId = decodeURIComponent(courseMatch[1]);
    state.selectedCourseId = decodeURIComponent(courseMatch[2]);
    return state;
  }

  // Level view
  const levelMatch = cleanHash.match(/^\/level\/([^/]+)$/);
  if (levelMatch) {
    state.selectedLevelId = decodeURIComponent(levelMatch[1]);
    return state;
  }

  // Search
  const searchMatch = cleanHash.match(/^\/?q=(.+)$/);
  if (searchMatch) {
    state.searchQuery = decodeURIComponent(searchMatch[1]);
    return state;
  }

  return state;
}

export function pushAppState(state) {
  const hash = encodeAppState(state);
  window.history.pushState(state, '', hash);
}

export function replaceAppState(state) {
  const hash = encodeAppState(state);
  window.history.replaceState(state, '', hash);
}
