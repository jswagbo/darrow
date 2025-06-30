interface ErrorComponentProps {
  error: Error
}

export function PostErrorComponent({ error }: ErrorComponentProps) {
    return (
        <div className="p-4 border border-red-500 bg-red-50 text-red-900 rounded">
            <h2 className="font-bold">Error</h2>
            <p>{error.message}</p>
        </div>
    )
}
