export default function TestAuthPage() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="max-w-md w-full p-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Test Auth Page</h1>
        <div className="card-glossy p-8 rounded-lg">
          <form className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Email Address
              </label>
              <input
                type="email"
                className="w-full px-4 py-3 bg-black border border-gray-light rounded-lg text-white placeholder-gray-light"
                placeholder="Enter your email"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-silver text-black rounded-lg font-semibold"
            >
              Send Magic Link
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}