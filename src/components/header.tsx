// import { Button } from ".ui/button"
import { Link } from "react-router-dom"
import { Logo } from "./logo"
import { Button } from "./ui/button"

interface HeaderProps {
  userName?: string
}

export function Header({ userName }: HeaderProps) {
  return (
    <header className="w-full flex justify-between items-center py-4 px-6">
      <Link to="/">
        <Logo />
      </Link>

      <div className="flex items-center gap-4">
        {userName && <p className="text-white">Hi {userName}, Welcome!</p>}

        <Link to="/my-workflows">
          <Button variant="outline" className="bg-primary text-white hover:bg-primary/90 border-none rounded-full">
            My workflows
          </Button>
        </Link>

        <Button variant="outline" className="bg-primary text-white hover:bg-primary/90 border-none rounded-full">
          Logout
        </Button>
      </div>
    </header>
  )
}
