import React from 'react';
import LoginForm from './components/LoginForm';
import useWebSocket from './hooks/useWebsocket';
import './App.css';
import ListMakerControls from './components/ListMakerControls';

const App: React.FC = () => {
  const {
    status,
    authStatus,
    isAuthorized,
    listMaking,
    listMakingCompleted,
    login,
    listMake,
  } = useWebSocket();

  return (
    <div id="outerContainer">
      {!isAuthorized ? (
        <LoginForm onLogin={login} authStatus={authStatus} />
      ) : (
        <ListMakerControls
          status={status}
          listMaking={listMaking}
          listMakingCompleted={listMakingCompleted}
          onListMake={listMake}
        />
      )}
    </div>
  );
};

export default App;
