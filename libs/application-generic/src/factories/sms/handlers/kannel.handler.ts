import { KannelSmsProvider } from '@novu/providers';
import { ChannelTypeEnum, ICredentials, SmsProviderIdEnum } from '@novu/shared';
import { BaseSmsHandler } from './base.handler';

export class KannelSmsHandler extends BaseSmsHandler {
  constructor() {
    super(SmsProviderIdEnum.Kannel, ChannelTypeEnum.SMS);
  }

  buildProvider(credentials: ICredentials) {
    const config: {
      host: string;
      port: string;
      from: string;
      username?: string;
      password?: string;
      secure?: boolean;
    } = {
      host: credentials.host || '',
      port: credentials.port || '',
      from: credentials.from || '',
      username: credentials.user,
      password: credentials.password,
      secure: credentials.secure,
    };

    this.provider = new KannelSmsProvider(config);
  }
}
