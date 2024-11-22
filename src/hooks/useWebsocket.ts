import { useState, useEffect, useCallback } from 'react';
import { AUTH_MESSAGES } from '../constants';

const useWebSocket = () => {
  const [status, setStatus] = useState('Not List-making');
  const [authStatus, setAuthStatus] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [listMaking, setListMaking] = useState(false);
  const [listMakingCompleted, setListMakingCompleted] = useState(false);
  const [ws, setWs] = useState<WebSocket | null>(null);

  useEffect(() => {
    const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8080';

    const webSocket = new WebSocket(WS_URL);

    webSocket.onopen = () => {
      console.log('WebSocket connection established.');
    };

    webSocket.onmessage = (event) => {
      const message = event.data;
      console.log('Received message from server:', message);

      if (message.startsWith(AUTH_MESSAGES.SUCCESS)) {
        setIsAuthorized(true);
        setAuthStatus(AUTH_MESSAGES.SUCCESS);
      } else if (message.startsWith(AUTH_MESSAGES.DENIED)) {
        setAuthStatus(`${AUTH_MESSAGES.DENIED} - Refresh page to try again.`);
      } else {
        setStatus(message);
      }
    };

    webSocket.onclose = () => {
      console.log('WebSocket connection closed.');
      setListMaking(false);
      setStatus('listMaking completed!');
      setListMakingCompleted(true);
    };

    webSocket.onerror = (error) => {
      console.error('WebSocket error:', error);
      setListMaking(false);
      setStatus(`Error: ${(error as ErrorEvent).message}`);
    };

    setWs(webSocket);

    return () => {
      if (ws) {
        webSocket.close();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = useCallback(
    (username: string, password: string) => {
      if (ws) {
        ws.send(JSON.stringify({ username, password }));
      }
    },
    [ws]
  );

  const listMake = useCallback(() => {
    if (listMakingCompleted) {
      window.location.reload();
    } else {
      setListMaking(true);
      setStatus('Loading list-maker...');
      if (ws) {
        ws.send('listMaking...');
      }
    }
  }, [ws, listMakingCompleted]);

  return {
    status,
    authStatus,
    isAuthorized,
    listMaking,
    listMakingCompleted,
    login,
    listMake,
  };
};

export default useWebSocket;
