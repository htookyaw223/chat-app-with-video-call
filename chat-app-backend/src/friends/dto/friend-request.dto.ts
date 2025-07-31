
export class FriendReqDto {
  userId: string;
  requestStatus: 'pending' | 'accepted' | 'rejected';
}