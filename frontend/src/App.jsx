import { Routes, Route } from "react-router-dom";
import Layout from "./components/layout";
import Login from "./components/Login";
import Userprofile from "./components/userprofile";
import Createuser from "./components/createuser";
import Creationstatus from "./components/creationstatus";
import Createteam from "./components/createteam";
import Home from "./components/home";
import Manageteams from "./components/manageteams";
function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} /> {/* default page */}
        <Route path="Home" element={<Home />} />
        <Route path="Login" element={<Login />} />
        <Route path="profile" element={<Userprofile />} />
        <Route path="Createuser" element={<Createuser />} />
        <Route path=":prefix/status" element={<Creationstatus />} />
        <Route path="CreateTeam" element={<Createteam/>}/>
        <Route path="Teams" element={<Manageteams/>}/>
      </Route>
    </Routes>
  );
}

export default App;
