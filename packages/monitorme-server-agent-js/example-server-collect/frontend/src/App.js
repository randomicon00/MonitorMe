import React, { useEffect } from "react";
import Sidebar from "./components/Sidebar";
import ProductList from "./components/ProductList";

import SessionEventTracker from "session-event-tracker";

function App() {
    useEffect(() => {
        SessionEventTracker.initialize();
    }, []);

    return (
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1 p-6">
                <h1 className="text-2xl font-bold mb-4">All Products</h1>
                <ProductList />
            </div>
        </div>
    );
}

export default App;
