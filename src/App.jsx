import { Route , Routes } from "react-router-dom"
import Notfound from "./components/Notfound";
import Layout from "./layout/Layout";
import Home from "./pages/Home";

function App() {

  return (
    <>
       <Routes>
             <Route path="/" element={<Layout><Home/></Layout>}/>
             <Route path="*" element={<Notfound/>}/>
       </Routes>
    </>
  )
}

export default App
