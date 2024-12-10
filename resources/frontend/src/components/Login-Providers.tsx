import React from 'react'

export default function LoginProviders() {
    return (
        <div className="flex flex-col space-y-2">
            <button className="bg-red-500 text-white font-bold py-2 px-4 rounded">
                Login via Google
            </button>
            <button className="bg-blue-500 text-white font-bold py-2 px-4 rounded">
                Login via Facebook
            </button>
        </div>
    )
}
