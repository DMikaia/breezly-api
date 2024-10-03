import { ConfigService } from '@nestjs/config';

export const SignatureResolver = {
  provide: 'CLERK_SIGNATURE',
  inject: [ConfigService],
  useFactory: (config: ConfigService) => {
    return config.get<string>('CLERK_SIGNATURE');
  },
};
