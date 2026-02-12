import React, { useState } from "react";
import Button from "./Button";

const SettingsForm = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const data = {
      oldPassword: formData.get("old-password"),
      newPassword: formData.get("new-password"),
      notes: formData.get("about"),
    };

    setIsLoading(true);
    setErrorMessage(null); // Reset the error message on submission

    try {
      const response = await fetch("/api/change_password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        setErrorMessage(null);
        alert(result.message); // Optional: Replace this with success message display logic
      } else {
        setErrorMessage(result.error || "Something went wrong");
      }
    } catch (error) {
      console.error("Error submitting form", error);
      setErrorMessage(`Error submitting form: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="md:grid md:grid-cols-3 md:gap-6">
        <div className="md:col-span-1">
          <div className="px-4 sm:px-0">
            <p className="mt-1 text-sm text-gray-600">
              Edit, delete and save your account details and information, but
              make sure to not share your password publicly.
            </p>
          </div>
        </div>
        <div className="mt-5 md:mt-0 md:col-span-2">
          <form onSubmit={handleSubmit}>
            <div className="shadow sm:rounded-md sm:overflow-hidden">
              <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
                <div>
                  <label
                    htmlFor="old-password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Old Password
                  </label>
                  <input
                    type="password"
                    id="old-password"
                    name="old-password"
                    className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    placeholder="Enter old password"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="new-password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    New Password
                  </label>
                  <input
                    type="password"
                    id="new-password"
                    name="new-password"
                    className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    placeholder="Enter new password"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="about"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Notes
                  </label>
                  <textarea
                    id="about"
                    name="about"
                    rows={3}
                    className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    placeholder="Enter additional notes (optional)"
                  />
                </div>
              </div>
              <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                <Button type="submit" disabled={isLoading} variant="primary">
                  {isLoading ? "Submitting..." : "Save"}
                </Button>
              </div>
            </div>
          </form>
          {errorMessage && (
            <div className="mt-4 text-sm text-red-600">{errorMessage}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsForm;

/* old implementation
import React, { useState } from "react";
import Button from "./Button";

const SettingsForm = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const data = {
      oldPassword: formData.get("old-password"),
      newPassword: formData.get("new-password"),
      notes: formData.get("about"),
    };

    setIsLoading(true);

    try {
      const response = await fetch("/api/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        alert(result.message);
      } else {
        alert(result.error || "Something went wrong");
      }
    } catch (error) {
      console.error("Error submitting form", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div>
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <div className="px-4 sm:px-0">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Settings
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                Edit, delete and save your account details and information, but
                make sure to not share your password publicly.
              </p>
            </div>
          </div>
          <div className="mt-5 md:mt-0 md:col-span-2">
            <form onSubmit={handleSubmit}>
              <div className="shadow sm:rounded-md sm:overflow-hidden">
                <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
                  <div>
                    <label
                      htmlFor="old-password"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Old Password
                    </label>
                    <input
                      type="password"
                      id="old-password"
                      name="old-password"
                      className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      placeholder="Enter old password"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="new-password"
                      className="block text-sm font-medium text-gray-700"
                    >
                      New Password
                    </label>
                    <input
                      type="password"
                      id="new-password"
                      name="new-password"
                      className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      placeholder="Enter new password"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="about"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Notes
                    </label>
                    <textarea
                      id="about"
                      name="about"
                      rows={3}
                      className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      placeholder="Enter additional notes (optional)"
                    />
                  </div>
                </div>
                <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                  <Button type="submit" disabled={isLoading} variant="primary">
                    {isLoading ? "Submitting..." : "Save"}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default SettingsForm;
*/
