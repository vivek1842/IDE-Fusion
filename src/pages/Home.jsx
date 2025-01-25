
const Home = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#10121b]">
      <div className="bg-[#1a1c2c] text-gray-200 p-6 rounded-lg shadow-2xl w-80 sm:w-96">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-extrabold text-[#4fb0ff]">Code Sync</h1>
          <p className="text-sm text-gray-400">Realtime collaboration made simple</p>
        </div>
        <form className="space-y-5">
          <div>
            <label htmlFor="roomId" className="block text-sm font-medium text-gray-300">
              Enter ROOM ID
            </label>
            <input
              id="roomId"
              type="text"
              placeholder="ROOM ID"
              className="w-full mt-2 p-3 bg-[#252742] border border-[#3c3f5b] rounded-md text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4fb0ff]"
            />
          </div>
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-300">
              Username
            </label>
            <input
              id="username"
              type="text"
              placeholder="Your Name"
              className="w-full mt-2 p-3 bg-[#252742] border border-[#3c3f5b] rounded-md text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4fb0ff]"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#4fb0ff] hover:bg-[#3998e6] text-[#10121b] py-2 rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-[#4fb0ff]/50">
            Join Room
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-5">
          Don&apos;t have an invite? Create a{' '}
          <a href="#" className="text-[#4fb0ff] hover:underline">
            new room
          </a>
        </p>
      </div>
    </div>
  )
}

export default Home