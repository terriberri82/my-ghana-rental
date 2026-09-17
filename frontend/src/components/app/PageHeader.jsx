export default function PageHeader({ title, subtitle, action }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
      <div>
        <h1 className="font-display text-2xl md:text-3xl font-bold text-bayou">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1 text-sm text-ebony/60">{subtitle}</p>
        )}
      </div>
      {action}
    </div>
  );
}