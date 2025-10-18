interface TimestampDisplayProps {
  createdAt?: string;
  updatedAt?: string;
  className?: string;
}

export default function TimestampDisplay({ createdAt, updatedAt, className = "" }: TimestampDisplayProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!createdAt && !updatedAt) return null;

  return (
    <div className={`text-xs text-gray-500 ${className}`}>
      {createdAt && (
        <div>
          <span className="font-medium">Created:</span> {formatDate(createdAt)}
        </div>
      )}
      {updatedAt && (
        <div>
          <span className="font-medium">Updated:</span> {formatDate(updatedAt)}
        </div>
      )}
    </div>
  );
}
