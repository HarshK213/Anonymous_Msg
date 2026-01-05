"use client"

import { User } from "next-auth";
import { signOut, useSession } from "next-auth/react";
import { Button } from "./ui/button";
import Link from "next/link";

const Navbar = () => {

    const { data: session } = useSession();

    const user: User = session?.user as User;

    return (
        <nav className="p-4 md:p-6 shadow-md bg-gray-50">
            <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
                <Link className="text-xl font-bold mb-4 md:mb-0 hover:text-blue-600 transition-colors" href="/">
                    Mystery Message
                </Link>
                {
                    session?(
                        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                            <span className="text-gray-700 font-medium">Welcome, {user?.username || user?.email}</span>
                            <Button
                                className="w-full md:w-auto bg-red-600 hover:bg-red-700"
                                onClick={() => signOut()}
                            >
                                Sign Out
                            </Button>
                        </div>
                    ):(
                        <Link href='/sign-in' className="w-full md:w-auto">
                            <Button className="w-full bg-blue-600 hover:bg-blue-700">
                                Log In
                            </Button>
                        </Link>
                    )
                }
            </div>
        </nav>
    )
}

export default Navbar;