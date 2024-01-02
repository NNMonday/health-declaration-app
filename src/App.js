import { Container } from "react-bootstrap";
import MyForm from "./screens/Form";
import MyTable from "./screens/Table"
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

function App() {
  return (
    <Container fluid>
      <Container>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to='/table' />} />
            <Route path="/table" element={<MyTable />} />
            <Route path="/declaration" element={<MyForm action='add'/>} />
            <Route path="/edit/:id" element={<MyForm action='edit'/>} />
          </Routes>
        </BrowserRouter>
      </Container>
    </Container>
  );
}

export default App;
