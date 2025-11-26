import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { StarRating } from "./StarRating";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Loader2, Send } from "lucide-react";

interface FeedbackFormProps {
  onSubmitSuccess: () => void;
}

export function FeedbackForm({ onSubmitSuccess }: FeedbackFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    rating: 0,
    message: "",
    tags: "",
    consent: false,
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Email validation
  const validateEmail = (email: string): boolean => {
    if (!email) return true; // Email is optional
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Form validation
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (formData.rating === 0) {
      newErrors.rating = "Please select a rating";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    }

    if (formData.email && !validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.consent) {
      newErrors.consent = "You must agree to submit feedback";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const { error } = await supabase.from("feedbacks").insert({
        name: formData.name.trim() || null,
        email: formData.email.trim() || null,
        rating: formData.rating,
        message: formData.message.trim(),
        tags: formData.tags.trim() || null,
        consent: formData.consent,
      });

      if (error) throw error;

      // Success animation
      setIsSuccess(true);
      toast.success("Thank you for your feedback!");
      
      // Reset form after animation
      setTimeout(() => {
        setFormData({
          name: "",
          email: "",
          rating: 0,
          message: "",
          tags: "",
          consent: false,
        });
        setIsSuccess(false);
        onSubmitSuccess();
      }, 2000);
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast.error("Failed to submit feedback. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full shadow-[var(--shadow-soft)] border-border/50">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-foreground">
          Share Your Feedback
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          We'd love to hear your thoughts! Your feedback helps us improve.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name field */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-foreground">
              Name <span className="text-muted-foreground text-sm">(optional)</span>
            </Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Your name"
              className="transition-all focus:ring-2 focus:ring-primary"
              disabled={isSubmitting}
            />
          </div>

          {/* Email field */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground">
              Email <span className="text-muted-foreground text-sm">(optional)</span>
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="your.email@example.com"
              className="transition-all focus:ring-2 focus:ring-primary"
              disabled={isSubmitting}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
            />
            {errors.email && (
              <p id="email-error" className="text-sm text-destructive" role="alert">
                {errors.email}
              </p>
            )}
          </div>

          {/* Rating field */}
          <div className="space-y-2">
            <Label className="text-foreground">
              Rating <span className="text-destructive">*</span>
            </Label>
            <div className="flex items-center gap-4">
              <StarRating
                value={formData.rating}
                onChange={(value) => setFormData({ ...formData, rating: value })}
                size="lg"
              />
              {formData.rating > 0 && (
                <span className="text-sm text-muted-foreground">
                  {formData.rating} star{formData.rating !== 1 ? "s" : ""}
                </span>
              )}
            </div>
            {errors.rating && (
              <p className="text-sm text-destructive" role="alert">
                {errors.rating}
              </p>
            )}
          </div>

          {/* Message field */}
          <div className="space-y-2">
            <Label htmlFor="message" className="text-foreground">
              Message <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Tell us what you think... (minimum 10 characters)"
              className="min-h-32 transition-all focus:ring-2 focus:ring-primary resize-none"
              disabled={isSubmitting}
              aria-invalid={!!errors.message}
              aria-describedby={errors.message ? "message-error" : undefined}
            />
            <div className="flex justify-between items-center">
              <p className="text-xs text-muted-foreground">
                {formData.message.length} characters
              </p>
              {errors.message && (
                <p id="message-error" className="text-sm text-destructive" role="alert">
                  {errors.message}
                </p>
              )}
            </div>
          </div>

          {/* Tags field */}
          <div className="space-y-2">
            <Label htmlFor="tags" className="text-foreground">
              Tags <span className="text-muted-foreground text-sm">(optional, comma-separated)</span>
            </Label>
            <Input
              id="tags"
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="e.g., feature request, bug report, praise"
              className="transition-all focus:ring-2 focus:ring-primary"
              disabled={isSubmitting}
            />
          </div>

          {/* Consent checkbox */}
          <div className="flex items-start gap-3">
            <Checkbox
              id="consent"
              checked={formData.consent}
              onCheckedChange={(checked) => 
                setFormData({ ...formData, consent: checked as boolean })
              }
              disabled={isSubmitting}
              aria-invalid={!!errors.consent}
              aria-describedby={errors.consent ? "consent-error" : undefined}
            />
            <div className="space-y-1">
              <Label
                htmlFor="consent"
                className="text-sm font-normal cursor-pointer text-foreground"
              >
                I agree to share this feedback and understand it may be used to improve the service.
                <span className="text-destructive ml-1">*</span>
              </Label>
              {errors.consent && (
                <p id="consent-error" className="text-sm text-destructive" role="alert">
                  {errors.consent}
                </p>
              )}
            </div>
          </div>

          {/* Submit button */}
          <Button
            type="submit"
            disabled={isSubmitting || isSuccess}
            className={`w-full transition-all duration-300 ${
              isSuccess 
                ? "bg-secondary text-secondary-foreground hover:bg-secondary" 
                : "bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98]"
            }`}
          >
            {isSuccess ? (
              <>
                <Check className="h-5 w-5 mr-2 animate-scale-in" />
                Thanks for your feedback!
              </>
            ) : isSubmitting ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="h-5 w-5 mr-2" />
                Submit Feedback
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
