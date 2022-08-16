browser.contextMenus.create({
	id: 'voisascript',
	title: 'record audio comment',
	contexts: ['selection'],
})

browser.contextMenus.onClicked.addListener((details) => {
    if (details.menuItemId != 'voisascript') {
		// this is not our menu item
		return
	}
	browser.action.openPopup()
})

// let portFromCs 

/* function connected(p) {
	portFromCs = p
	portFromCs.postMessage({greeting: 'hi to content script 👌💪'}) //sends message to content
	portFromCs.onMessage.addListener(async (message) => {  //listens for message from content
		console.log(message)
		try {
			browser.runtime.onMessage.addListener((message) => { // listens for message from popup
				console.log(message)
				if (message.retreive == true) {
					return Promise.resolve({response: 'backgrond sent something'}) // returns response message to popup
				}
			})
		} catch (error) {
			console.log(error)
			return
		}
		
	})
} */

// browser.runtime.onConnect.addListener(connected) //listens for connection from content

