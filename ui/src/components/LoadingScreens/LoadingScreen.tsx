export default function LoadingScreen() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        {/* Spinning loader */}
        <div className="relative">
          <div className="w-12 h-12 border-4 border-muted rounded-full animate-spin border-t-primary"></div>
        </div>

        {/* Loading text */}
        <div className="text-center space-y-2">
          <h2 className="text-xl font-semibold text-foreground">Loading</h2>
          <p className="text-sm text-muted-foreground">
            Please wait while we prepare everything for you
          </p>
        </div>

        {/* Animated dots */}
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
        </div>
      </div>
    </div>
  );
}
