import Link from 'next/link'
function Header() {
  return (
    <header className="mx-auto flex max-w-7xl justify-between p-5">
      <div className="flex items-center">
        <Link href="/">
          <img
            className="w-32 cursor-pointer object-contain sm:w-44"
            src="https://bit.ly/3Bh6BNO"
            alt=""
          />
        </Link>
        <div className="hidden items-center space-x-5 md:inline-flex">
          <h3 className="cursor-pointer">About</h3>
          <h3 className="cursor-pointer">Contact</h3>
          <h3 className="cursor-pointer rounded-full bg-green-600 px-4 py-1 text-white">
            Follow
          </h3>
        </div>
      </div>
      <div className="flex items-center space-x-5 text-green-600">
        <h3>Sign In</h3>
        <h3 className="rounded-full border border-green-600 py-1 px-4">
          Get Started
        </h3>
      </div>
    </header>
  )
}

export default Header
