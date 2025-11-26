import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  readonly?: boolean;
  size?: "sm" | "md" | "lg";
}

export function StarRating({ value, onChange, readonly = false, size = "md" }: StarRatingProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8"
  };

  const handleClick = (rating: number) => {
    if (!readonly && onChange) {
      onChange(rating);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, rating: number) => {
    if (readonly) return;
    
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick(rating);
    }
  };

  return (
    <div className="flex gap-1" role="radiogroup" aria-label="Rating">
      {[1, 2, 3, 4, 5].map((rating) => (
        <button
          key={rating}
          type="button"
          onClick={() => handleClick(rating)}
          onKeyDown={(e) => handleKeyDown(e, rating)}
          disabled={readonly}
          className={cn(
            "transition-all duration-200",
            !readonly && "cursor-pointer hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm",
            readonly && "cursor-default"
          )}
          role="radio"
          aria-checked={rating === value}
          aria-label={`${rating} star${rating !== 1 ? 's' : ''}`}
          tabIndex={readonly ? -1 : 0}
        >
          <Star
            className={cn(
              sizeClasses[size],
              "transition-colors duration-200",
              rating <= value
                ? "fill-accent stroke-accent"
                : "fill-none stroke-muted-foreground"
            )}
          />
        </button>
      ))}
    </div>
  );
}
