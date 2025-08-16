import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home, ArrowLeft, Search } from "lucide-react";
import { Link } from "react-router-dom";

interface NotFoundProps {
  title?: string;
  message?: string;
  showHomeButton?: boolean;
  showBackButton?: boolean;
  showSearchButton?: boolean;
  homeUrl?: string;
  onBack?: () => void;
  onSearch?: () => void;
  className?: string;
}

export function NotFound({
  title = "404 - Page Not Found",
  message = "Sorry, we couldn't find the page you're looking for. It might have been moved, deleted, or you entered the wrong URL.",
  showHomeButton = true,
  showBackButton = true,
  showSearchButton = false,
  homeUrl = "/",
  onBack,
  onSearch,
  className = "",
}: NotFoundProps) {
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (typeof window !== "undefined") {
      window.history.back();
    }
  };

  return (
    <div
      className={`w-full min-h-screen flex items-center justify-center p-4 ${className}`}
    >
      <Card className="w-full max-w-md text-center">
        <CardContent className="pt-6">
          {/* Large 404 Number */}
          <div className="text-8xl font-bold text-muted-foreground mb-4">
            404
          </div>

          {/* Title */}
          <h1 className="text-2xl font-semibold mb-4">{title}</h1>

          {/* Message */}
          <p className="text-muted-foreground mb-8 leading-relaxed">
            {message}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {showHomeButton && (
              <Button asChild>
                <Link to={homeUrl}>
                  <Home className="w-4 h-4 mr-2" />
                  Go Home
                </Link>
              </Button>
            )}

            {showBackButton && (
              <Button variant="outline" onClick={handleBack}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Back
              </Button>
            )}

            {showSearchButton && onSearch && (
              <Button variant="outline" onClick={onSearch}>
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
