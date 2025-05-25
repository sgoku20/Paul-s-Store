import { Box, useColorModeValue } from "@chakra-ui/react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import CreatePage from "./pages/CreatePage";
import HomePage from "./pages/HomePage";
import OrderForm from './components/OrderForm';
import Navbar from "./components/Navbar";

function App() {
	return (
		<Box minH="100vh" bg={useColorModeValue("#ffffff", "#000000")} color={useColorModeValue("#000000", "#ffffff")}>
			<Navbar />
			<Routes>
				<Route path='/' element={<HomePage />} />
				<Route path='/create' element={<CreatePage />} />
				<Route path="/order/:productId" element={<OrderForm />} />
			</Routes>
		</Box>
	);
}

export default App;
