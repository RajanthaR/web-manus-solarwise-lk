import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Star, MessageSquarePlus, Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import ReviewCard, { StarRating } from "./ReviewCard";
import ReviewForm from "./ReviewForm";

interface ReviewSectionProps {
  packageId?: number;
  providerId?: number;
  packageName?: string;
  providerName?: string;
}

function RatingBreakdown({ reviews }: { reviews: any[] }) {
  const ratingCounts = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: reviews.filter((r) => r.overallRating === rating).length,
  }));

  const total = reviews.length;

  return (
    <div className="space-y-2">
      {ratingCounts.map(({ rating, count }) => (
        <div key={rating} className="flex items-center gap-2">
          <span className="text-sm w-3">{rating}</span>
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <Progress value={total > 0 ? (count / total) * 100 : 0} className="h-2 flex-1" />
          <span className="text-sm text-muted-foreground w-8">{count}</span>
        </div>
      ))}
    </div>
  );
}

export default function ReviewSection({ 
  packageId, 
  providerId, 
  packageName,
  providerName 
}: ReviewSectionProps) {
  const [showForm, setShowForm] = useState(false);

  // Fetch reviews based on package or provider
  const { data: packageReviews, isLoading: loadingPackage } = trpc.reviews.byPackage.useQuery(
    { packageId: packageId! },
    { enabled: !!packageId }
  );

  const { data: providerReviews, isLoading: loadingProvider } = trpc.reviews.byProvider.useQuery(
    { providerId: providerId! },
    { enabled: !!providerId }
  );

  const isLoading = loadingPackage || loadingProvider;
  const reviewData = packageId ? packageReviews : providerReviews;
  const reviews = reviewData?.reviews || [];
  const averageRating = reviewData?.averageRating;

  return (
    <div className="space-y-6">
      {/* Header with Summary */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <MessageSquarePlus className="w-5 h-5" />
              පාරිභෝගික Reviews
            </CardTitle>
            <Button onClick={() => setShowForm(!showForm)}>
              {showForm ? "Cancel" : "Review ලියන්න"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : reviews.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-8">
              {/* Average Rating */}
              <div className="text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-4">
                  <div className="text-5xl font-bold text-primary">
                    {averageRating?.overall?.toFixed(1) || "0.0"}
                  </div>
                  <div>
                    <StarRating rating={Math.round(averageRating?.overall || 0)} size="md" />
                    <p className="text-sm text-muted-foreground mt-1">
                      {averageRating?.totalReviews || 0} reviews
                    </p>
                  </div>
                </div>

                {/* Category Ratings */}
                {averageRating && (
                  <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                    {averageRating.installation && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Installation</span>
                        <span className="font-medium">{averageRating.installation}</span>
                      </div>
                    )}
                    {averageRating.performance && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Performance</span>
                        <span className="font-medium">{averageRating.performance}</span>
                      </div>
                    )}
                    {averageRating.support && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Support</span>
                        <span className="font-medium">{averageRating.support}</span>
                      </div>
                    )}
                    {averageRating.value && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Value</span>
                        <span className="font-medium">{averageRating.value}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Rating Breakdown */}
              <RatingBreakdown reviews={reviews} />
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                තවම reviews නැත. පළමු review එක ලියන්න!
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Review Form */}
      {showForm && (
        <ReviewForm
          packageId={packageId}
          providerId={providerId}
          packageName={packageName}
          providerName={providerName}
          onSuccess={() => setShowForm(false)}
          onCancel={() => setShowForm(false)}
        />
      )}

      {/* Reviews List */}
      {reviews.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">සියලුම Reviews ({reviews.length})</h3>
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      )}
    </div>
  );
}
