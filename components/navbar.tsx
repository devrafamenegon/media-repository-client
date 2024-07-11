import { MainNav } from "@/components/main-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import { SearchBar } from "./ui/search-bar";
import Menu from "./menu";
import getParticipants from "@/actions/get-participants";

const Navbar = async () => {
  const participants = await getParticipants();

  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        <MainNav className="mx-6"/>
        <div className="ml-auto flex items-center space-x-4">
          <SearchBar />
          <ThemeToggle />
          <Menu participants={participants} />
        </div>
      </div>
    </div>
  )
}

export default Navbar;