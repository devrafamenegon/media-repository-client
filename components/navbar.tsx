import { MainNav } from "@/components/main-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import { SearchBar } from "./ui/search-bar";
import Menu from "./menu";

const Navbar = async () => {
  return (
    <div className="w-full fixed border-b bg-background z-40">
      <div className="flex h-16 items-center px-4">
        <MainNav className="mx-6"/>
        <div className="ml-auto flex items-center space-x-4">
          <SearchBar />
          <ThemeToggle />
          <Menu />
        </div>
      </div>
    </div>
  )
}

export default Navbar;