'use client'; // Ensure this file runs only on the client side

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();

  useEffect(() => {
    // Check localStorage only on the client side
    if (!localStorage.getItem("userData")) {
      router.push("/auth"); // Redirect to /auth if userData is not found
    }
  }, [router]);

  return null; // Render nothing while redirecting
};

export default Page;