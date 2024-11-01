import Logo from "./Logo"

const SplashScreen = () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-white w-full top-0 left-0 z-50 relative">
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <Logo imageClassName="text-violet-900" textClassName="text-violet-800" />
      </div>

      <p className="absolute bottom-8 text-muted-foreground text-xs">
        Subscribe and stay connected.
      </p>
    </div>
  )
}

export default SplashScreen

