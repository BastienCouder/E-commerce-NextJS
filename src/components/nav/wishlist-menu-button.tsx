import Link from "next/link";
import { useDisableAnimation } from "@/hooks/useDisableAnimation";
import { Heart } from "lucide-react";

interface WishlistMenuButtonProps {
  toggleMenu: () => void;
}

export default function WishlistMenuButton({
  toggleMenu,
}: WishlistMenuButtonProps) {
  const { handleEnableAnimation } = useDisableAnimation();

  return (
    <Link
      href={`/wishlist`}
      onClick={() => {
        toggleMenu();
        handleEnableAnimation();
      }}
    >
      <Heart size={27} />
    </Link>
  );
}
