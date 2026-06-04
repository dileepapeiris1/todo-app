
/**
 * Renders four animated placeholder rows to indicate a loading state.
 *
 * @returns {JSX.Element} The skeleton placeholder element.
 */
const Skeleton = () => (
  <div>
    {[70, 55, 85, 65].map(w => (
      <div key={w} className="flex items-start gap-3 border-b border-quaternary-100 py-2.5 dark:border-gray-800">
        <div className="mt-0.5 h-[18px] w-[18px] shrink-0 animate-pulse rounded-full bg-quaternary-100 dark:bg-gray-700" />
        <div className="flex-1 space-y-1.5 pt-0.5">
          <div className="h-3 animate-pulse rounded bg-quaternary-100 dark:bg-gray-700" style={{ width: `${w}%` }} />
          <div className="h-2.5 animate-pulse rounded bg-quaternary-50 dark:bg-gray-800" style={{ width: `${w * 0.6}%` }} />
        </div>
      </div>
    ))}
  </div>
);

export default Skeleton;
