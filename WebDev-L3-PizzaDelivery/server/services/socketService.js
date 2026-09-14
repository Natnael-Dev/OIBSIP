import { Server } from 'socket.io';

let io = null;

export const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST', 'PATCH']
    }
  });

  io.on('connection', (socket) => {
    console.log(`[WebSocket] Client connected: ${socket.id}`);

    // Join specific order room for live tracking
    socket.on('join_order_room', (orderNumber) => {
      socket.join(`order_${orderNumber}`);
      console.log(`[WebSocket] Client ${socket.id} joined room order_${orderNumber}`);
    });

    // Join admin management room
    socket.on('join_admin_room', () => {
      socket.join('admin_kitchen');
      console.log(`[WebSocket] Admin console joined admin_kitchen channel`);
    });

    socket.on('disconnect', () => {
      console.log(`[WebSocket] Client disconnected: ${socket.id}`);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io has not been initialized.');
  }
  return io;
};

export const emitOrderStatusUpdate = (orderNumber, status, timestamp) => {
  if (io) {
    io.to(`order_${orderNumber}`).emit('order:status_updated', {
      orderNumber,
      status,
      timestamp: timestamp || new Date()
    });
  }
};

export const emitNewOrderToAdmin = (orderData) => {
  if (io) {
    io.to('admin_kitchen').emit('admin:new_order', orderData);
  }
};
