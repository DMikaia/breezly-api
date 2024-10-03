import { BadRequestException, Injectable } from '@nestjs/common';
import { ClerkUser, Data } from '@libs/clerk-contracts';
import { User } from '@libs/user-contracts';
import { UsersService } from './users.service';

@Injectable()
export class ClerkService {
  constructor(private readonly usersService: UsersService) {}

  async handleClerkEvent(body: Data) {
    switch (body.type) {
      case 'user.created': {
        const mapped_user = this.mapUser(body.data as ClerkUser);
        await this.usersService.createUser(mapped_user);

        break;
      }
      case 'user.updated': {
        const mapped_user = this.mapUser(body.data as ClerkUser);
        await this.usersService.updateUser(mapped_user);

        break;
      }
      case 'user.deleted': {
        await this.usersService.deleteUser(body.data.id);

        break;
      }
      default: {
        throw new BadRequestException('Invalid event type');
      }
    }
  }

  mapUser(user: ClerkUser): User {
    const email = user.email_addresses.find(
      (email) => email.id === user.primary_email_address_id,
    ).email_address;

    return {
      clerk_id: user.id,
      username: user.username,
      first_name: user.first_name,
      last_name: user.last_name,
      email: email,
      profile_image_url: user.profile_image_url,
      created_at: new Date(user.created_at),
      updated_at: new Date(user.updated_at),
    };
  }
}
