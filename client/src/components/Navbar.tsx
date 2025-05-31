import { NAVBAR_HEIGHT } from "@/lib/constants";
import Link from "next/link";
import Image from "next/image";
import React from "react";
import { Button } from "./ui/button";

const Navbar = () => {
  return (
    <>
      <div
        className="fixed top-0 left-0 w-full z-50 shadow-xl"
        style={{ height: `${NAVBAR_HEIGHT}px` }}
      >
        <div className="flex justify-between items-center w-full py-3 px-8 bg-zinc-700 text-white">
          <div className="flex items-center gap-4 md:gap-6 ">
            <Link
              href="/"
              className="cursor-pointer hover:!text-primary-300"
              scroll={false}
            >
              <div className="flex items-center gap-3">
                <Image
                  src="/logo.svg"
                  alt="Rentiful Logo"
                  width={24}
                  height={24}
                  className="w-6 h-6"
                />
                <div className="text-xl font-bold">
                  RENT
                  <span className="font-light text-rose-400 hover:!text-primary-300">
                    IFUL
                  </span>
                </div>
              </div>
            </Link>
          </div>
          <p className="text-amber-50 hidden md:block">
            Discover your perfect rental apartment with our advanced search
          </p>
          <div className="flex items-center gap-5">
            <Link href="/signin">
              <Button
                variant="ghost"
                className="text-white border border-white hover:bg-white hover:text-emerald-950 rounded-lg transition-colors duration-300 cursor-pointer"
              >
                Sign In
              </Button>
            </Link>
            <Link href="/signup">
              <Button
                variant="secondary"
                className="text-white bg-rose-400 hover:bg-white hover:text-rose-400 rounded-lg cursor-pointer"
              >
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
