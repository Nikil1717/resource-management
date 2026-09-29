import {
    BrowserRouter,
    Routes,
    Route,
} from "react-router-dom";

import Layout from "./components/Layout";

import Dashboard from "./pages/Dashboard";
import Resources from "./pages/Resources";
import Projects from "./pages/Projects";
import ImportExcel from "./pages/ImportExcel";

function App() {

    return (
        <BrowserRouter>

            <Routes>

                <Route element={<Layout />}>

                    <Route
                        path="/"
                        element={<Dashboard />}
                    />

                    <Route
                        path="/resources"
                        element={<Resources />}
                    />

                    <Route
                        path="/projects"
                        element={<Projects />}
                    />

                    <Route
                        path="/import"
                        element={<ImportExcel />}
                    />

                </Route>

            </Routes>

        </BrowserRouter>
    );
}

export default App;