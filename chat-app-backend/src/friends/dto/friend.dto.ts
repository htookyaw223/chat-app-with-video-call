
export class FriendDto {
  userId: string;
  name: string;
  requestStatus: 'pending' | 'accepted' | 'rejected';
}