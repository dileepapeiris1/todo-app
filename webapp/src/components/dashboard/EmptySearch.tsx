import SearchNoResultsIcon from '@/assets/empty-results/SearchNoResultsIcon';

/**
 * Displays a search empty state illustration with the original query.
 *
 * @param {{ query: string }} props - Component props.
 * @param {string} props.query - The search query that produced no results.
 * @returns {JSX.Element} The empty search state element.
 */
const EmptySearch = ({ query }: { query: string }) => (
  <div className="flex min-h-[55vh] flex-col items-center justify-center gap-3 text-center">
    <SearchNoResultsIcon className="h-36 w-auto opacity-80" />
    <p className="text-sm text-quaternary-500 dark:text-gray-400">No tasks match "{query}"</p>
    <p className="text-xs text-quaternary-300 dark:text-gray-600">Try a different word or check your spelling</p>
  </div>
);

export default EmptySearch;
