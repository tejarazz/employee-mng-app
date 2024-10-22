// components/Home.js
import { Link } from "react-router-dom"; // Import Link for navigation

const Home = () => {
  return (
    <div className="min-h-screen flex text-white flex-col ">
      <header className="py-4 bg-black/60  shadow-md">
        <div className="max-w-7xl  flex items-center justify-between mx-auto px-4">
          <div className="flex items-center gap-2">
            <img src="logo.webp" className="w-10 h-10 rounded-full" alt="" />
            <h1 className="lg:text-2xl text-md font-bold text-white">
              WorkSphereX
            </h1>
          </div>

          <Link
            to="/login"
            className="inline-block bg-blue-600 text-white px-4 lg:px-8 py-1 lg:py-2 rounded-full shadow-md hover:bg-blue-500 transition duration-200 transform"
            aria-label="Login to your account"
          >
            Login
          </Link>
        </div>
      </header>

      <main className="flex-grow flex pt-5 justify-center">
        <div className="rounded-lg p-6 sm:p-10 w-full lg:max-w-full max-w-lg text-center">
          <h1 className="lg:text-4xl text-2xl font-extrabold  mb-6">
            Welcome to WorkSphereX
          </h1>
          <p className="text-center pb-3 sm:text-lg text-neutral-300">
            Your one-stop solution for managing employees efficiently and
            effectively.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-10 lg:gap-32 mt-10">
            <div className="flex flex-col items-center">
              <img
                src="left.webp"
                alt="Description of Image 1"
                className="w-[400px] h-[300px] rounded-xl object-cover mb-4"
              />
              <p className="mt-2 text-sm text-neutral-300">
                Admins assign tasks, employees view and update their status on
                the dashboard.
              </p>
            </div>

            <div className="flex flex-col items-center">
              <img
                src="right.webp"
                alt="Description of Image 2"
                className="w-[400px] h-[300px] rounded-xl object-cover mb-4"
              />
              <p className="mt-2 text-sm text-neutral-300">
                Track task stats for smooth operations, log in or create an
                account now!
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="text-center py-4 mt-10">
        <p className="text-neutral-500 text-sm">
          © 2024 WorkSphereX Inc. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default Home;
