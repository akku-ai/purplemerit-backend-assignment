import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class RealtimeGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log('Client connected:', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected:', client.id);
  }

  // ✅ USER JOINS WORKSPACE
  @SubscribeMessage('join-workspace')
  handleJoinWorkspace(
    @MessageBody()
    data: { workspaceId: string; userId: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.join(data.workspaceId);

    this.server.to(data.workspaceId).emit('user-joined', {
      userId: data.userId,
    });
  }

  // ✅ USER LEAVES WORKSPACE
  @SubscribeMessage('leave-workspace')
  handleLeaveWorkspace(
    @MessageBody()
    data: { workspaceId: string; userId: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.leave(data.workspaceId);

    this.server.to(data.workspaceId).emit('user-left', {
      userId: data.userId,
    });
  }

  // ✅ FILE CHANGE EVENT (MOCKED PAYLOAD)
  @SubscribeMessage('file-change')
  handleFileChange(
    @MessageBody()
    data: {
      workspaceId: string;
      fileName: string;
      content: string;
    },
  ) {
    this.server.to(data.workspaceId).emit('file-change', data);
  }

  // ✅ CURSOR / ACTIVITY UPDATE
  @SubscribeMessage('cursor-update')
  handleCursorUpdate(
    @MessageBody()
    data: {
      workspaceId: string;
      userId: string;
      cursor: { line: number; column: number };
    },
  ) {
    this.server.to(data.workspaceId).emit('cursor-update', data);
  }
}
