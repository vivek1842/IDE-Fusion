
const Home = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="bg-gray-800 text-white p-6 rounded-2xl shadow-lg w-80 sm:w-96">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-green-500">IDE Fusion</h1>
          <p className="text-sm text-gray-400">Realtime collaboration</p>
        </div>
        <form className="space-y-4">
          <div>
            <label htmlFor="roomId" className="block text-sm font-medium text-gray-400">
              Paste invitation ROOM ID
            </label>
            <input
              id="roomId"
              type="text"
              placeholder="ROOM ID"
              className="w-full mt-1 p-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring focus:ring-green-500"
            />
          </div>
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-400">
              Username
            </label>
            <input
              id="username"
              type="text"
              placeholder="USERNAME"
              className="w-full mt-1 p-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring focus:ring-green-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-md focus:outline-none focus:ring focus:ring-green-300">
            Join
          </button>
        </form>
        <p className="text-center text-sm text-gray-400 mt-4">
          If you don&apos;t have an invite then create a{' '}
          <a href="#" className="text-green-400 hover:underline">
            new room
          </a>
        </p>
      </div>
    </div>
  )
}

export default Home