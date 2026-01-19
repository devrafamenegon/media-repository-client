import { MainNav } from "@/components/main-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import { SearchBar } from "./ui/search-bar";
import Menu from "./menu";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlaySquare } from "lucide-react";

const Navbar = async () => {
  return (
    <div className="w-full fixed border-b bg-background z-40">
      <div className="flex h-16 items-center px-4">
        <MainNav className="mx-6"/>
        <div className="ml-auto flex items-center space-x-4">
          <Link href="/shorts" title="Shorts">
            <Button type="button" variant="ghost" className="rounded-full gap-2">
              <PlaySquare className="h-5 w-5" />
              <span className="hidden md:inline">Shorts</span>
            </Button>
          </Link>
          <SearchBar />
          <ThemeToggle />
          <Menu />
        </div>
      </div>
    </div>
  )
}

export default Navbar;