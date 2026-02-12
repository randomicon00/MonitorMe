import { useState, useEffect } from "react";
import { Form, Field } from "react-final-form";
import { signIn } from "next-auth/react";

const SignInForm = () => {
  const [errorMessage, setErrorMessage] = useState("");

  // Validation functions
  const required = (value: any) =>
    value ? undefined : "This field is required";

  const composeValidators =
    (...validators: any[]) =>
    (value: any) =>
      validators.reduce(
        (error, validator) => error || validator(value),
        undefined
      );

  // Handle form submission
  const handleSignIn = async (values: any) => {
    const result = await signIn("credentials", {
      username: values.emailAddress,
      password: values.password,
      redirect: false,
      callbackUrl: "http://localhost:3000",
    });

    alert(JSON.stringify(result));

    if (!result?.ok) {
      setErrorMessage("Invalid credentials. Please try again.");
    } else {
      window.location.href = result.url || "/";
    }
  };

  useEffect(() => {
    console.log("Error Message: ", errorMessage);
  }, [errorMessage]);

  return (
    <div>
      {/* Error Message */}
      {errorMessage && (
        <div
          className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{errorMessage}</span>
          <button
            onClick={() => setErrorMessage("")}
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
          >
            <svg
              className="fill-current h-6 w-6 text-red-500"
              role="button"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <title>Close</title>
              <path d="M14.348 5.652a1 1 0 10-1.414-1.414L10 7.586 7.066 4.652a1 1 0 10-1.414 1.414L8.586 10l-2.934 2.934a1 1 0 101.414 1.414L10 12.414l2.934 2.934a1 1 0 001.414-1.414L11.414 10l2.934-2.934z" />
            </svg>
          </button>
        </div>
      )}

      <Form
        onSubmit={handleSignIn}
        render={({ handleSubmit, submitting }) => (
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="rounded-md shadow-sm -space-y-px">
              {/* Email Field */}
              <Field name="emailAddress" validate={required}>
                {({ input, meta }) => (
                  <div>
                    <label htmlFor="email-address" className="sr-only">
                      Email address
                    </label>
                    <input
                      {...input}
                      id="email-address"
                      type="email"
                      autoComplete="email"
                      placeholder="Email address"
                      className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    {meta.error && meta.touched && (
                      <span className="text-red-500 text-sm">{meta.error}</span>
                    )}
                  </div>
                )}
              </Field>

              {/* Password Field */}
              <Field
                name="password"
                validate={composeValidators(required /*minLength(6)*/)}
              >
                {({ input, meta }) => (
                  <div>
                    <label htmlFor="password" className="sr-only">
                      Password
                    </label>
                    <input
                      {...input}
                      id="password"
                      type="password"
                      autoComplete="current-password"
                      placeholder="Password"
                      className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    {meta.error && meta.touched && (
                      <span className="text-red-500 text-sm">{meta.error}</span>
                    )}
                  </div>
                )}
              </Field>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={submitting}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Sign in
              </button>
            </div>
          </form>
        )}
      />
    </div>
  );
};

export default SignInForm;
