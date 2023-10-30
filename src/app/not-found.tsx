import { Button } from "@mui/joy";
import Link from "next/link";

export default function NotFound() {
  return (
    <>
      <title>Page Not Found</title>
      <div className="w-full h-[calc(50vh)] flex flex-col justify-center items-center my-32">
        <h1 className="text-4xl mb-4">404</h1>
        <p className="mb-4 text-xl font-semibold">Page Not Found</p>
        <Link href="/">
          <Button>Go to Home page</Button>
        </Link>
      </div>
    </>
  );
}
