import { AppBar, Button, Container, IconButton, LinearProgress, Toolbar } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { TodolistList } from './components/TodolistList/TodolistList';
import { useAppSelector } from './hooks/hooks';
import { ErrorSnackbar } from './components/ErrorSnackbar/ErrorSnackbar';

type PropsType = { demo?: boolean };

function AppWithRedux({ demo = false }: PropsType) {
  const status = useAppSelector((state) => state.api.status);
  return (
    <div className="App">
      <ErrorSnackbar />
      <AppBar color="inherit" position="static">
        <Toolbar>
          <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Button color="inherit">Login</Button>
        </Toolbar>
      </AppBar>
      {status === 'loading' && <LinearProgress />}
      <Container fixed>
        <TodolistList demo={demo} />
      </Container>
    </div>
  );
}

export default AppWithRedux;
