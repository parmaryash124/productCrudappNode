import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store/store';
import Home from './pages/Home';
import Cart from './pages/Cart';
import Navbar from './components/Navbar';
import AddProduct from './pages/AddProduct';
import EditProduct from './pages/EditProduct';
import ViewProuct from './pages/ViewProuct';

function App() {
    return (
        <div className="App">
            <Provider store={store}>
                <BrowserRouter>
                    <Navbar />
                    <Routes>
                        <Route path="/" element={<Home />}></Route>
                        <Route path="/addProduct" element={<AddProduct />}></Route>
                        <Route path="/edit" element={<EditProduct />}></Route>
                        <Route path="/view" element={<ViewProuct />}></Route>
                    </Routes>
                </BrowserRouter>
            </Provider>
        </div>
    );
}

export default App;
