import React, { useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { useRouter } from "next/router";
import { SearchIcon, ExclamationIcon } from "@heroicons/react/solid";

const SearchBar = () => {
  const [searchText, setSearchText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!searchText) {
      setModalMessage("Please enter a valid search query.");
      setIsModalOpen(true);
      return;
    }

    const [key, value] = searchText.split(":");

    if (key === "sessionid" && value) {
      router.push(`/sessions/${value}`);
    } else if (key === "segmentid" && value) {
      router.push(`/segments/${value}`);
    } else {
      setModalMessage(
        "Invalid search format. <p>Use <b>`sessionid:&lt;id&gt;`</b> or <b>`segmentid:&lt;id&gt;`</b>, instead.</p>"
      );
      setIsModalOpen(true);
    }
  };

  return (
    <>
      {/* Search Form */}
      <form className="w-full flex md:ml-0" onSubmit={handleSubmit}>
        <label htmlFor="search-field" className="sr-only">
          Search
        </label>
        <div className="relative w-full text-gray-400 focus-within:text-gray-600">
          <button
            type="submit"
            className="absolute inset-y-0 left-0 flex items-center"
            aria-hidden="true"
          >
            <SearchIcon className="h-5 w-5" aria-hidden="true" />
          </button>
          <input
            id="search-field"
            name="search-field"
            className="block w-full h-full pl-8 pr-3 py-2 border-transparent text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-0 focus:border-transparent sm:text-sm"
            placeholder="Search using `sessionid:<id>` or `segmentid:<id>`"
            type="search"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
      </form>

      {/* Modal */}
      <Transition appear show={isModalOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setIsModalOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex items-center justify-center min-h-full p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <div className="flex items-center justify-center">
                    <ExclamationIcon
                      className="h-6 w-6 text-red-500 mr-3"
                      aria-hidden="true"
                    />
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900"
                    >
                      Invalid Search Query
                    </Dialog.Title>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm text-center text-gray-500 px-4">
                      <div dangerouslySetInnerHTML={{ __html: modalMessage }} />
                    </p>
                  </div>

                  <div className="mt-4 flex justify-center">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={() => setIsModalOpen(false)}
                    >
                      OK
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default SearchBar;
