// /* eslint-disable @typescript-eslint/no-explicit-any */
// import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
// import { io, Socket } from 'socket.io-client';
// // import { useAppSelector } from '@/store';
// import { useSelector } from 'react-redux';

// export interface DefaultEventsMap {
//   [event: string]: (...args: any[]) => void;
// }
// type SocketContextType = Socket<DefaultEventsMap, DefaultEventsMap> | null;

// const SocketContext = createContext<SocketContextType>(null);

// interface SocketProviderProps {
//   children: ReactNode;
// }

// // Create a provider component
// export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
//   const [socket, setSocket] = useState<SocketContextType>(null);
//   const { token } = useSelector((state) => state.auth.session);

//   useEffect(() => {
//     if (false) {
//       const baseURL = import.meta.env.PROD ? 'https://argetam2.onrender.com' : 'http://localhost:10000';

//       const newSocket = io(baseURL, {
//         query: { token, platform: 'web' },
//       });

//       setSocket(newSocket);

//       return () => {
//         newSocket.disconnect();
//       };
//     }
//   }, [token]);

//   return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
// };

// export const useSocket = (): SocketContextType => {
//   return useContext(SocketContext);
// };



/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useSelector } from 'react-redux';

const SocketContext = createContext(null);

const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (false) {
      const baseURL = import.meta.env.PROD ? 'https://argetam2.onrender.com' : 'http://localhost:10000';

      const newSocket = io(baseURL, {
        query: { token, platform: 'web' },
      });

      setSocket(newSocket);

      return () => {
        newSocket.disconnect();
      };
    }
  }, [token]);

  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};

const useSocket = () => {
  return useContext(SocketContext);
};

export { SocketProvider, useSocket };
