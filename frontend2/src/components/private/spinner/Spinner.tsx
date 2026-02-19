import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

type SpinnerVariant = "default" | "outline" | "secondary" | "sizes";

export function SpinnerButton({
  variant = "default",
}: {
  variant?: SpinnerVariant;
}) {
  return (
    <div className="flex items-center justify-center w-full h-screen">
      {variant === "default" && (
        <Button disabled size="sm">
          <Spinner className="mr-2" />
          Loading...
        </Button>
      )}

      {variant === "outline" && (
        <Button variant="outline" disabled size="sm">
          <Spinner className="mr-2" />
          Please wait
        </Button>
      )}

      {variant === "secondary" && (
        <Button variant="secondary" disabled size="sm">
          <Spinner className="mr-2" />
          Processing
        </Button>
      )}

      {variant === "sizes" && (
        <div className="flex items-center gap-6">
          <Spinner className="size-6" />
        </div>
      )}
    </div>
  );
}
