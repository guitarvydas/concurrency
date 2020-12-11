var sender_input_queue = [];
var receiver_input_queue = [];

function send (from, data) {
    if (from == "sender") {
	receiver_input_queue.push (data);  // in this simple example, sender's output is always piped to receiver's input
    } else if (from == "receiver") {
	sender_input_queue.push (data);  
    } else {
	fail ();
    }
}

function sender (message) {
    send ("sender", "Hello World");
}

function receiver (message) {
    console.log (message);
}

function dispatcher () {
    while (true) {
	if (0 < sender_input_queue.length) {
	    var message = sender_input_queue.pop ();
	    sender (message);
	} else if (0 < receiver_input_queue.length) {
	    var message = receiver_input_queue.pop ();
	    receiver (message);
	}
    }
}

sender ();
dispatcher ();

// usage: node basic-concurrency.js
//  hit ^C to kill the example, after "Hello World" has been printed
