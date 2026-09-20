import { expect, test } from 'vitest';
import { axiosSpy } from '../../../utils/test/spy-axios';
import { KannelSmsProvider } from './kannel.provider';

test('should trigger Kannel SMS axios request correctly', async () => {
  const { mockGet: fakeGet } = axiosSpy({
    data: '0: Accepted for delivery',
  });

  const provider = new KannelSmsProvider({
    host: '0.0.0.0',
    port: '13000',
    from: '0000',
  });

  const testTo = '+7777';
  const testContent = 'This is a test';

  const testQueryParams = {
    from: '0000',
    text: testContent,
    to: testTo,
  };

  await provider.sendMessage({
    content: testContent,
    to: testTo,
  });

  expect(fakeGet).toHaveBeenCalled();
  expect(fakeGet).toHaveBeenCalledWith('http://0.0.0.0:13000/cgi-bin/sendsms', {
    params: testQueryParams,
  });
});

test('should trigger Kannel SMS axios request correctly with _passthrough', async () => {
  const { mockGet: fakeGet } = axiosSpy({
    data: '0: Accepted for delivery',
  });

  const provider = new KannelSmsProvider({
    host: '0.0.0.0',
    port: '13000',
    from: '0000',
  });

  const testTo = '+7777';
  const testContent = 'This is a test';

  const testQueryParams = {
    from: '0000',
    text: testContent,
    to: testTo,
  };

  await provider.sendMessage(
    {
      content: testContent,
      to: testTo,
    },
    {
      _passthrough: {
        body: {
          from: '1000',
        },
      },
    }
  );

  expect(fakeGet).toHaveBeenCalled();
  expect(fakeGet).toHaveBeenCalledWith('http://0.0.0.0:13000/cgi-bin/sendsms', {
    params: {
      ...testQueryParams,
      from: '1000',
    },
  });
});

test('should trigger Kannel SMS with HTTPS when secure is true or port is 443', async () => {
  const { mockGet: fakeGet } = axiosSpy({
    data: '0: Accepted for delivery',
  });

  const providerSecure = new KannelSmsProvider({
    host: 'kannel.example.com',
    port: '13000',
    from: '0000',
    secure: true,
  });

  await providerSecure.sendMessage({
    content: 'Test SSL',
    to: '+7777',
  });

  expect(fakeGet).toHaveBeenCalledWith('https://kannel.example.com:13000/cgi-bin/sendsms', {
    params: {
      from: '0000',
      text: 'Test SSL',
      to: '+7777',
    },
  });

  const providerPort443 = new KannelSmsProvider({
    host: 'kannel.example.com',
    port: '443',
    from: '0000',
  });

  await providerPort443.sendMessage({
    content: 'Test Port 443',
    to: '+7777',
  });

  expect(fakeGet).toHaveBeenCalledWith('https://kannel.example.com:443/cgi-bin/sendsms', {
    params: {
      from: '0000',
      text: 'Test Port 443',
      to: '+7777',
    },
  });
});

