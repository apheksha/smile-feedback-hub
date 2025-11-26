import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { FeedbackForm } from "@/components/FeedbackForm";
import { FeedbackCard } from "@/components/FeedbackCard";
import { Button } from "@/components/ui/button";
import { RefreshCw, Smile } from "lucide-react";
import { toast } from "sonner";

interface Feedback {
  id: string;
  name?: string;
  email?: string;
  rating: number;
  message: string;
  tags?: string;
  created_at: string;
}

const Index = () => {
  const [latestFeedback, setLatestFeedback] = useState<Feedback | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchLatestFeedback = async () => {
    setIsRefreshing(true);
    try {
      const { data, error } = await supabase
        .from("feedbacks")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== "PGRST116") {
        // PGRST116 is "no rows returned" - not an error if table is empty
        throw error;
      }

      setLatestFeedback(data || null);
    } catch (error) {
      console.error("Error fetching feedback:", error);
      toast.error("Failed to load feedback");
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLatestFeedback();
  }, []);

  const handleSubmitSuccess = () => {
    fetchLatestFeedback();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <header className="bg-card/50 backdrop-blur-sm border-b border-border/50 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center h-12 w-12 rounded-2xl bg-primary/10 text-primary animate-float">
              <Smile className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Smiles Feedback</h1>
              <p className="text-sm text-muted-foreground">
                Your voice matters. Share your experience with us.
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Feedback Form Section */}
          <section className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <FeedbackForm onSubmitSuccess={handleSubmitSuccess} />
          </section>

          {/* Latest Feedback Section */}
          <section className="animate-fade-in space-y-4" style={{ animationDelay: "0.2s" }}>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Latest Feedback</h2>
                <p className="text-sm text-muted-foreground">
                  See what others are saying
                </p>
              </div>
              <Button
                onClick={fetchLatestFeedback}
                disabled={isRefreshing}
                variant="outline"
                size="sm"
                className="hover:scale-105 active:scale-95 transition-transform"
              >
                <RefreshCw
                  className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
                />
                Refresh
              </Button>
            </div>

            {latestFeedback ? (
              <FeedbackCard feedback={latestFeedback} />
            ) : (
              <div className="flex flex-col items-center justify-center p-12 rounded-2xl border-2 border-dashed border-border/50 bg-muted/20">
                <Smile className="h-16 w-16 text-muted-foreground mb-4 opacity-40" />
                <p className="text-center text-muted-foreground">
                  No feedback yet. Be the first to share your thoughts!
                </p>
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-card/30 backdrop-blur-sm mt-12">
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-sm text-muted-foreground">
            Built with love using React, Vite, Tailwind CSS, and Supabase
          </p>
          <p className="text-xs text-muted-foreground/70 mt-2">
            All feedback is stored securely and used to improve our services.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
