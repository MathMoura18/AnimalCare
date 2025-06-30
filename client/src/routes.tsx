import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Home } from './pages/Home';
// import { Doacao } from './pages/Doacao';
import { Ongs } from './pages/Ongs';
import { QueroAdotar } from './pages/QueroAdotar';
import { Login } from './pages/Login';
import { CreateAccount } from './pages/CreateAccount';
import { Dica01 } from './pages/Dicas/Dica01';
import { Dica02 } from './pages/Dicas/Dica02';
import { Dica03 } from './pages/Dicas/Dica03';
import { Dica04 } from './pages/Dicas/Dica04';
import { Dica05 } from './pages/Dicas/Dica05';
import { Dica06 } from './pages/Dicas/Dica06';
import { Dashboard } from './pages/Dashboard';

import PrivateRoute from './components/PrivateRoute'
import { AdicionarAnimais } from "./pages/AdicionarAnimais";

// Footer
import { Sobre } from './pages/Sobre';
import { Contato } from './pages/Contato';
import { TermosDeUso } from './pages/TermosDeUso';

export const AppRoutes = () => {
    return (
        <BrowserRouter basename="/AnimalCare">
            <Routes>
                <Route path='/' element={<Home />} />

                <Route path="/dica-1" element={<Dica01 />} />
                <Route path="/dica-2" element={<Dica02 />} />
                <Route path="/dica-3" element={<Dica03 />} />
                <Route path="/dica-4" element={<Dica04 />} />
                <Route path="/dica-5" element={<Dica05 />} />
                <Route path="/dica-6" element={<Dica06 />} />


                <Route path='/ongs' element={<Ongs />} />
                <Route path='/adotar' element={
                    <QueroAdotar />
                } />
                
                <Route path='/dashboard' element={
                    <PrivateRoute>
                        <Dashboard />
                    </PrivateRoute>
                } />

                <Route path='/login' element={<Login />} />
                <Route path='/create-account' element={<CreateAccount />} />

                <Route path='/sobre' element={<Sobre />} />
                <Route path='/contato' element={<Contato />} />
                <Route path='/termos-de-uso' element={<TermosDeUso />} />

                <Route path='*' element={<Navigate to='/' />} />

                <Route path="/AdicionarAnimais" element={<AdicionarAnimais />} />
            </Routes>

        </BrowserRouter>
    );
}