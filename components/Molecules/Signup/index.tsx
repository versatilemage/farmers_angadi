"use client";

import { useState } from "react";
import { userRoleDetails } from "@/utils/rolecard";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const SignupForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();
  const searchParams = useSearchParams();

  const validationSchema = Yup.object({
    username: Yup.string()
      .min(3, "Username must be at least 3 characters")
      .required("Username is required"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    role: Yup.string().required("Role is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm Password is required"),
  });

  const onSubmit = async (values, { setSubmitting }) => {
    setError("");
    try {
      setLoading(true);
      const url = `/api/auth?authType=signup`;
      const response = await axios.post(url, values);

      if (response.status === 201) {
        router.push("/authentication?page=signin");
      } else {
        setError("Cannot register the user. Try again.");
      }
    } catch (error) {
      console.error("Registration error: ", error);
      setError("An error occurred during registration. Please try again.");
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto max-w-lg px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-semibold">Farmers Angadi</h1>
        <p className="text-secondary text-2xl">welcomes you</p>
      </div>

      <Formik
        initialValues={{
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
          role: "",
        }}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ isSubmitting, values }) => (
          <Form className="space-y-6" autoComplete="off">
            {error && <p className="text-red-600 text-center">{error}</p>}

            <div className="relative">
              <Field
                name="username"
                placeholder="Enter Username"
                className="w-full h-14 pl-12 pr-4 border rounded-lg focus:ring-2 focus:ring-secondary"
              />
              <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400"
            width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2a5 5 0 1 1-5 5l.005-.217A5 5 0 0 1 12 2m2 12a5 5 0 0 1 5 5v1a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-1a5 5 0 0 1 5-5z" /></svg>
              <ErrorMessage name="username" component="div" className="text-red-600 text-sm mt-1" />
            </div>

            <div className="relative">
              <Field
                name="email"
                type="email"
                placeholder="Enter Email"
                className="w-full h-14 pl-12 pr-4 border rounded-lg focus:ring-2 focus:ring-secondary"
              />
              <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400"
            viewBox="0 0 24 24"><path fill="currentColor" d="M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2zm-2 0l-8 5l-8-5zm0 12H4V8l8 5l8-5z" /></svg>
              <ErrorMessage name="email" component="div" className="text-red-600 text-sm mt-1" />
            </div>

            <div className="relative">
              <Field
                as="select"
                name="role"
                className="w-full h-14 pl-12 pr-4 border rounded-lg focus:ring-2 focus:ring-secondary"
              >
                <option value="">Select your role</option>
                {userRoleDetails.map((i, index) => (
                  <option key={index} value={i.role}>
                    {i.role}
                  </option>
                ))}
              </Field>
              <ErrorMessage name="role" component="div" className="text-red-600 text-sm mt-1" />
              <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M15 21h-2a2 2 0 0 1 0-4h2v-2h-2a4 4 0 0 0 0 8h2Zm8-2a4 4 0 0 1-4 4h-2v-2h2a2 2 0 0 0 0-4h-2v-2h2a4 4 0 0 1 4 4" /><path fill="currentColor" d="M14 18h4v2h-4zm-7 1a6 6 0 0 1 .09-1H3v-1.4c0-2 4-3.1 6-3.1a8.6 8.6 0 0 1 1.35.125A5.95 5.95 0 0 1 13 13h5V4a2.006 2.006 0 0 0-2-2h-4.18a2.988 2.988 0 0 0-5.64 0H2a2.006 2.006 0 0 0-2 2v14a2.006 2.006 0 0 0 2 2h5.09A6 6 0 0 1 7 19M9 2a1 1 0 1 1-1 1a1.003 1.003 0 0 1 1-1m0 4a3 3 0 1 1-3 3a2.996 2.996 0 0 1 3-3" /></svg>
            </div>

            <div className="relative">
            <svg
            xmlns="http://www.w3.org/2000/svg"
            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400 cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
            width="1em" height="1em" viewBox="0 0 24 24"
          >
            <path fill="currentColor" d={showPassword ? "m3.282 21.782l4.278-4.278M21.782 3.282L17.673 7.39m-3.363 3.363a2.64 2.64 0 0 0-1.063-1.063a2.625 2.625 0 1 0-2.494 4.62m3.557-3.557l-3.557 3.557m3.557-3.557l3.363-3.363m-6.92 6.92L7.56 17.504M17.673 7.39c-.38-.319-.791-.621-1.232-.894C15.2 5.726 13.717 5.19 12 5.19c-4.956 0-7.948 4.459-8.91 6.16c-.11.196-.165.293-.197.446a1.2 1.2 0 0 0 0 .408c.032.152.088.25.198.445c.51.903 1.593 2.582 3.237 3.96c.38.319.791.621 1.232.895m12.18-7.925c.528.694.919 1.328 1.17 1.773c.11.194.165.292.197.444c.023.112.023.296 0 .408c-.032.152-.087.25-.197.444c-.96 1.702-3.95 6.162-8.91 6.162q-.714-.002-1.374-.117" : "M12 9a3 3 0 0 0-3 3a3 3 0 0 0 3 3a3 3 0 0 0 3-3a3 3 0 0 0-3-3m0 8a5 5 0 0 1-5-5a5 5 0 0 1 5-5a5 5 0 0 1 5 5a5 5 0 0 1-5 5m0-12.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5"} />
          </svg>
              <Field
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter Password"
                className="w-full h-14 pl-12 pr-4 border rounded-lg focus:ring-2 focus:ring-secondary"
              />
              <ErrorMessage name="password" component="div" className="text-red-600 text-sm mt-1" />
              
            </div>

            <div className="relative">
              <Field
                name="confirmPassword"
                type={showConfirm ? "text" : "password"}
                placeholder="Confirm Password"
                className="w-full h-14 pl-12 pr-4 border rounded-lg focus:ring-2 focus:ring-secondary"
              />
              
              <ErrorMessage name="confirmPassword" component="div" className="text-red-600 text-sm mt-1" />
              <svg
            xmlns="http://www.w3.org/2000/svg"
            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400 cursor-pointer"
            onClick={() => setShowConfirm(!showConfirm)}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path fill="currentColor" d={showConfirm ? "m3.282 21.782l4.278-4.278M21.782 3.282L17.673 7.39m-3.363 3.363a2.64 2.64 0 0 0-1.063-1.063a2.625 2.625 0 1 0-2.494 4.62m3.557-3.557l-3.557 3.557m3.557-3.557l3.363-3.363m-6.92 6.92L7.56 17.504M17.673 7.39c-.38-.319-.791-.621-1.232-.894C15.2 5.726 13.717 5.19 12 5.19c-4.956 0-7.948 4.459-8.91 6.16c-.11.196-.165.293-.197.446a1.2 1.2 0 0 0 0 .408c.032.152.088.25.198.445c.51.903 1.593 2.582 3.237 3.96c.38.319.791.621 1.232.895m12.18-7.925c.528.694.919 1.328 1.17 1.773c.11.194.165.292.197.444c.023.112.023.296 0 .408c-.032.152-.087.25-.197.444c-.96 1.702-3.95 6.162-8.91 6.162q-.714-.002-1.374-.117" : "M12 9a3 3 0 0 0-3 3a3 3 0 0 0 3 3a3 3 0 0 0 3-3a3 3 0 0 0-3-3m0 8a5 5 0 0 1-5-5a5 5 0 0 1 5-5a5 5 0 0 1 5 5a5 5 0 0 1-5 5m0-12.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5"} />
          </svg>
            </div>

            <button
              type="submit"
              className={`w-full h-14 rounded-lg font-semibold ${isSubmitting || loading ? "bg-gray-300 cursor-not-allowed" : "bg-primary hover:bg-secondary text-white transition"
                }`}
              disabled={isSubmitting || loading}
            >
              {loading ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="animate-spin h-6 w-6 mx-auto"
                  viewBox="0 0 24 24"
                >
                  <circle cx="12" cy="12" r="10" stroke="black" strokeWidth="4" />
                </svg>
              ) : (
                "Sign up"
              )}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default SignupForm;
