"use client";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [submit, setSubmit] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userData, setUserData] = useState({
    userIdentification: "",
    password: "",
  });

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const router = useRouter();

  const onChangeFn = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  useEffect(() => {
    const isUserData = Object.values(userData).every((el) => Boolean(el));
    setDisabled(!isUserData);
  }, [userData]);

  const { userIdentification, password } = userData;

  const onSubmit = async () => {
    setSubmit(true);
    setDisabled(true);
    setError("");
    try {
      setLoading(true);
      const response = await signIn("credentials", {
        emailAddress: userData.userIdentification,
        password: userData.password,
        redirect: false,
      });

      if (response?.error) {
        setError("Email or password is incorrect");
      } else {
        router.push(callbackUrl || "/");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
      setSubmit(false);
    }
  };

  useEffect(() => {
    if (error) {
      setDisabled(true);
      setSubmit(false);
    }
  }, [error]);

  return (
    <div className="container mx-auto max-w-lg px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-semibold">Farmers Angadi</h1>
        <p className="text-secondary text-2xl">welcomes you</p>
      </div>
      {error && (
        <p className="text-red-600 text-center mb-4">{error}</p>
      )}

      <div className="space-y-6">
        <div className="relative">
          <input
            onChange={onChangeFn}
            value={userIdentification}
            name="userIdentification"
            className="w-full h-14 pl-12 pr-4 border rounded-lg focus:ring-2 focus:ring-secondary"
            placeholder="Enter Email / Username"
          />
          <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400"
            viewBox="0 0 24 24"><path fill="currentColor" d="M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2zm-2 0l-8 5l-8-5zm0 12H4V8l8 5l8-5z" /></svg>

        </div>

        <div className="relative">
          <input
            onChange={onChangeFn}
            value={password}
            name="password"
            type={showPassword ? "text" : "password"}
            className="w-full h-14 pl-12 pr-4 border rounded-lg focus:ring-2 focus:ring-secondary"
            placeholder="Enter Password"
          />
          <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" className="absolute cursor-pointer left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400"
            viewBox="0 0 24 24" onClick={() => setShowPassword(!showPassword)}
          ><path fill="currentColor"  d={`${!showPassword
            ?"M12 9a3 3 0 0 0-3 3a3 3 0 0 0 3 3a3 3 0 0 0 3-3a3 3 0 0 0-3-3m0 8a5 5 0 0 1-5-5a5 5 0 0 1 5-5a5 5 0 0 1 5 5a5 5 0 0 1-5 5m0-12.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5":"m3.282 21.782l4.278-4.278M21.782 3.282L17.673 7.39m-3.363 3.363a2.64 2.64 0 0 0-1.063-1.063a2.625 2.625 0 1 0-2.494 4.62m3.557-3.557l-3.557 3.557m3.557-3.557l3.363-3.363m-6.92 6.92L7.56 17.504M17.673 7.39c-.38-.319-.791-.621-1.232-.894C15.2 5.726 13.717 5.19 12 5.19c-4.956 0-7.948 4.459-8.91 6.16c-.11.196-.165.293-.197.446a1.2 1.2 0 0 0 0 .408c.032.152.088.25.198.445c.51.903 1.593 2.582 3.237 3.96c.38.319.791.621 1.232.895m12.18-7.925c.528.694.919 1.328 1.17 1.773c.11.194.165.292.197.444c.023.112.023.296 0 .408c-.032.152-.087.25-.197.444c-.96 1.702-3.95 6.162-8.91 6.162q-.714-.002-1.374-.117"}$`}/></svg>

        </div>

        <button
          className={`w-full h-14 rounded-lg font-semibold ${disabled
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-primary hover:bg-secondary text-white transition"
            }`}
          onClick={onSubmit}
          disabled={disabled}
        >
          {loading ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="animate-spin mx-auto h-6 w-6"
              viewBox="0 0 24 24"
            >
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                fill="currentColor"
                d="M4 12a8 8 0 1 1 16 0H4z"
              />
            </svg>
          ) : (
            "Login"
          )}
        </button>
      </div>
    </div>
  );
};

export default LoginForm;
