import { AppBar, Button, CircularProgress, Container, IconButton, LinearProgress, Toolbar } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { TodolistList } from './components/TodolistList/TodolistList';
import { useAppDispatch, useAppSelector } from './hooks/hooks';
import { ErrorSnackbar } from './components/ErrorSnackbar/ErrorSnackbar';
import { Login } from './components/Login/Login';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useEffect } from 'react';
import { initializeAppTC } from './state/app-reducer';
import { logoutTC } from './components/Login/auth-reducer';

type PropsType = { demo?: boolean };

function AppWithRedux({ demo = false }: PropsType) {
  const status = useAppSelector((state) => state.api.status);
  const isInitialized = useAppSelector((state) => state.api.isInitialized);
  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(initializeAppTC());
  }, [dispatch]);

  if (!isInitialized) {
    return (
      <div style={{ position: 'fixed', top: '30%', textAlign: 'center', width: '100%' }}>
        <CircularProgress />
      </div>
    );
  }

  const logoutHandler = () => {
    dispatch(logoutTC());
  };

  return (
    <div className="App">
      <ErrorSnackbar />
      <AppBar color="inherit" position="static">
        <Toolbar>
          <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          {isLoggedIn && (
            <Button onClick={logoutHandler} color="inherit">
              Log Out
            </Button>
          )}
        </Toolbar>
        {status === 'loading' && <LinearProgress />}
      </AppBar>
      <Container fixed>
        <Routes>
          <Route path="/" element={<TodolistList demo={demo} />} />
          <Route path="login" element={<Login />} />
          <Route path="404" element={<h1 style={{ textAlign: 'center' }}>404: PAGE NOT FOUND</h1>} />
          <Route path="*" element={<Navigate to={'404'} />} />
        </Routes>
      </Container>
    </div>
  );
}

export default AppWithRedux;
