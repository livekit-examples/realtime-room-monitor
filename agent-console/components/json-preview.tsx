export const JsonPreview = ({ title, data }: { title: string; data: unknown }) => (
  <div className="space-y-2">
    <h4 className="text-sm font-medium">{title}</h4>
    {data ? (
      <pre className="text-xs bg-muted/50 p-2 rounded-md overflow-x-auto">
        {JSON.stringify(data, null, 2)}
      </pre>
    ) : (
      <div className="text-sm text-muted-foreground italic">No {title.toLowerCase()}</div>
    )}
  </div>
);
