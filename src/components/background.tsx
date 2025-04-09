export function Background() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm z-10" />
      <img
        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/AI%20Consultants%20Light-9twLrrgWtR291wDaEYTt2GbZEKjNOj.svg"
        alt="City background"
        className="w-full h-full object-cover"
      />
    </div>
  )
}
