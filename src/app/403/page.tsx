import Link from "next/link";

const UnAuthorizedPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-6xl font-bold text-red-600">403</h1>
      <p className="mt-4 text-2xl">Unauthorized Access</p>
      <Link href="/" className="mt-6 text-blue-500 underline">
        Go to Home
      </Link>
    </div>
  );
};

export default UnAuthorizedPage;
