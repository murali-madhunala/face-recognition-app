import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Login } from "./containers/Login";
import { Dashboard } from "./containers/dashboard";

function App() {
    return (
      <Router>
        <Routes>
          <Route path="/" exact Component={Login} />
          <Route path="/dashboard" Component={Dashboard} />
        </Routes>
      </Router>
    );
}

export default App;
