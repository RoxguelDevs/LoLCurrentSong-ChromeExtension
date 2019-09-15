console.log('LoL Current Song extension is ready and listening!');

const NATIVE_HOST = 'com.roxguel.lol_current_song';
let currentYouTubeTabId = 0;
let patterns = [
    ' - YouTube Music', ' - YouTube',
];

setInterval(() => {
    let sent = false;
    // console.log('Start search for YouTube tab');
    chrome.windows.getAll(null, windows => {
        windows.map(win => {
            let id = win.id;
            // console.log('Searching in ' + id + ' window');
            chrome.tabs.getAllInWindow(id, tabs => {
                tabs.map(tab => {
                    // console.log('Searching in ' + id + ' tab');
                    if (tab.audible === true && sent === false) {
                        // console.log(tab.id + ' tab is audible');
                        for (let i in patterns) {
                            if (tab.title.endsWith(patterns[i])) {
                                // console.log(tab.id + ' ends with ' + patterns[i]);
                                sendCurrentSong(tab.title.substring(0, tab.title.length - patterns[i].length))
                                sent = true;
                            }
                        }
                    }
                });
            });
        });
    });
}, 15000);

function sendCurrentSong(song) {
    let message = '--set-status "' + song + '"';
    let port = chrome.runtime.connectNative(NATIVE_HOST);
    console.log('Sending song to ' + NATIVE_HOST, message);
    port.postMessage(message, () => port.disconnect());
}