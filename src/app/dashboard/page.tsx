import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";

export default async function Dashboard() {
    // const session = await getServerSession(authOptions);

    // if (!session || !session.user) {
    //     redirect("/sign-in");
    // }

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
                    Dashboard
                </h1>
                {/* <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">
                        Welcome back, {session.user.username || session.user.email}!
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                        This is your dashboard. You are currently logged in.
                    </p>
                    <div className="mt-6">
                        <p className="text-sm text-gray-500">User ID: {session.user._id}</p>
                        <p className="text-sm text-gray-500">Verified: {session.user.isVerified ? 'Yes' : 'No'}</p>
                    </div>
                </div> */}
            </div>
        </div>
    );
}
