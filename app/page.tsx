import AuthGuard from "@/components/AuthGuard";
import UrlShortener from "./url-shortener";

export default function HomePage() {
  return (
    <AuthGuard>
      <UrlShortener />
    </AuthGuard>
  );
}
