import {App as SendBirdApp} from "sendbird-uikit";
import SendBird from "sendbird";

import "sendbird-uikit/dist/index.css";

const App = () => {
    const sb = new SendBird({appId: '51008BCF-6B71-4A2E-8C66-93997F534513'});
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

    sb.addChannelHandler('sendbird_group_channel_133168852_422b0937a934d825d9bc63fff87cccb02ad8bf88', channelHandler);

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
              appId='51008BCF-6B71-4A2E-8C66-93997F534513'
              userId='tammy'
              theme='dark'
              showSearchIcon='true'
          />
      </div>
    );
};

export default App;
