import { StarRating } from "./StarRating";
import { formatDate, getRelativeTime } from "@/lib/formatDate";
import { Calendar, User, Tag } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Feedback {
  id: string;
  name?: string;
  email?: string;
  rating: number;
  message: string;
  tags?: string;
  created_at: string;
}

interface FeedbackCardProps {
  feedback: Feedback;
}

export function FeedbackCard({ feedback }: FeedbackCardProps) {
  const displayName = feedback.name?.trim() || "Anonymous";
  const tagList = feedback.tags
    ?.split(",")
    .map((tag) => tag.trim())
    .filter(Boolean) || [];

  return (
    <Card className="w-full shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-hover)] transition-all duration-300 hover:-translate-y-1 border-border/50">
      <CardHeader className="space-y-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/10 text-primary flex-shrink-0">
              <User className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground truncate">{displayName}</h3>
              <div className="flex items-center gap-2 mt-1">
                <StarRating value={feedback.rating} readonly size="sm" />
                <span className="text-xs text-muted-foreground">
                  ({feedback.rating}/5)
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Calendar className="h-3 w-3" />
          <time dateTime={feedback.created_at} title={formatDate(feedback.created_at)}>
            {getRelativeTime(feedback.created_at)}
          </time>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-foreground leading-relaxed whitespace-pre-wrap">
          {feedback.message}
        </p>

        {tagList.length > 0 && (
          <div className="flex items-start gap-2 pt-2 border-t border-border/50">
            <Tag className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div className="flex flex-wrap gap-2">
              {tagList.map((tag, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="bg-secondary/50 text-secondary-foreground hover:bg-secondary/70 transition-colors"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
