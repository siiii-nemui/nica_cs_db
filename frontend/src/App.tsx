import { Navigate, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import CharacterListPage from './pages/CharacterListPage';
import CharacterSheetPage from './pages/CharacterSheetPage';
import RequireAuth from './components/RequireAuth';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/characters" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/characters" element={<CharacterListPage />} />
      <Route path="/characters/:id/view" element={<CharacterSheetPage readOnly />} />
      <Route
        path="/characters/:id/edit"
        element={
          <RequireAuth>
            <CharacterSheetPage readOnly={false} />
          </RequireAuth>
        }
      />
      <Route path="*" element={<Navigate to="/characters" replace />} />
    </Routes>
  );
}

export default App;
