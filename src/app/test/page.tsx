export default function TestPage() {
  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl font-bold mb-4">Test Page</h1>
      <p className="text-gray-light">If you can see this, the basic setup is working!</p>
      <div className="mt-4 p-4 border border-silver rounded">
        <p>Environment check:</p>
        <ul className="list-disc list-inside mt-2">
          <li>✅ Next.js is running</li>
          <li>✅ CSS is loading</li>
          <li>✅ React is working</li>
        </ul>
      </div>
    </div>
  )
}