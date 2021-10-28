import {App as SendBirdApp} from "sendbird-uikit";
import SendBird from "sendbird";

import "sendbird-uikit/dist/index.css";

const App = () => {
    const sb = new SendBird({appId: '1A30D5E9-AAD8-4DC8-8F33-C718096B3B39'});

    sb.connect('Tamara', function(user, error) {
        if (error) {
            console.log('Geektopia Error - Connect: ' + error);
        }
    });

    sb.GroupChannel.getChannel('sendbird_group_channel_133555385_66368b09ed3503d6541cf3a304a3c3caf7d2e98a', function(groupChannel, error) {
        if (error) {
            console.log('Geektopia Error - Channel Get: ' + error);
        }

        const params = new sb.UserMessageParams();
        params.message = 'Shit';

        groupChannel.sendUserMessage(params, function(message, error) {
            if (error) {
                console.log('Geektopia Error - Channel Send User Message: ' + error);
            }
        });
    });

    const channelHandler = new sb.ChannelHandler();
    channelHandler.onMessageReceived = function(channel, message) {
        if(message) {
            let m = '';
            let profile = '';
            let nickname = '';
            if(message.messageType === 'admin') {
                nickname = 'admin';
                profile = 'https://sendbird.com/wp-content/themes/sendbird-sb/assets/img/favicons/favicon-32x32.png';
            } else {
                profile = message._sender.plainProfileUrl;
                nickname = message._sender.nickname;
            }

            if(message.messageType === 'file') {
                m = 'Sent a File: ' + message.name;
            } else if (
                (message.messageType === 'user' && !message.message.includes('****')) ||
                (message.messageType === 'admin' && !message.message.includes('****'))) {
                m = message.message;
            }

            if(Notification.permission === 'granted') {
                showNotification(m, nickname, profile);
            } else if(Notification.permission !== 'denied') {
                Notification.requestPermission().then(permission => {
                    if(permission === 'granted') {
                        showNotification(m, nickname, profile);
                    }
                });
            }
        }
    };

    sb.addChannelHandler('133168852', channelHandler);

    function showNotification(message, nickname, profile) {
        const notification = new Notification("SendBird - New Message from " + nickname, {
            body: message,
            icon: profile,
        });

        setTimeout(notification.close.bind(notification), 3000);
    }

    return (
      <div className="App">
          <SendBirdApp
              appId='1A30D5E9-AAD8-4DC8-8F33-C718096B3B39'
              userId='Tamara'
              theme='dark'
          />
      </div>
    );
};

export default App;
