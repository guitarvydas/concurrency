var parent_input_queue = [];
var parent_output_queue = [];
var sender_input_queue = [];
var sender_output_queue = [];
var receiver_input_queue = [];
var receiver_output_queue = [];

function fail () {
    throw "Internal Error";
}

function send (from, data) {
    if (from == "parent") {
	parent_output_queue.push (data);
    } else if (from == "sender") {
	sender_output_queue.push (data);
    } else if (from == "receiver") { // this branch is never taken, in this example
	receiver_output_queue.push (data);  
    } else {
	fail ();
    }
}

function schematic_route_message (routing_table_id, sender_id, message) {
    console.log ("route " + routing_table_id + " " + sender_id + " " + message);
    var routing_table;
    if (routing_table_id == "parent_routing") {
	routing_table = parent_wiring;
    } else {
	fail ();
    }
    var queue;
    if (sender_id == "parent") {
	queue = sender_input_queue;
    } else if (sender_id == "sender") {
	queue = receiver_input_queue;
    } else if (sender_id == "receiver") {
	queue = parent_output_queue;
    } else {
	fail ();
    }
    queue.push (message);
}

function release_outputs (who) {
    // return true if queues were updated, else false
    if (who == "parent") {
	if (parent_output_queue.length > 0) {
	    var output_message = parent_output_queue.pop ();
	    schematic_route_message ("parent_routing", "parent", output_message);
	    return true;
	} else {
	    return false;
	}
    } else if (who == "sender") {
	if (sender_output_queue.length > 0) {
	    var output_message = sender_output_queue.pop ();
	    schematic_route_message ("parent_routing", "sender", output_message);
	    return true;
	} else {
	    return false;
	}
    } else if (who == "receiver") {
	if (receiver_output_queue.length > 0) {
	    var output_message = receiver_output_queue.pop ();
	    schematic_route_message ("parent_routing", "receiver", output_message);
	    return true;
	} else {
	    return false;
	}
    } else {
	return false;
    }    
}

function release_all_outputs () {
    var continue_releasing = true;
    while (continue_releasing) {
	var queues_updated = false;
	queues_updated |= release_outputs ("parent");
	queues_updated |= release_outputs ("sender");
	queues_updated |= release_outputs ("receiver");
	continue_releasing = queues_updated;
    }
}

var parent_wiring = [
    // sender,  list of receivers
    [ "parent", [ "sender" ]],
    [ "sender", [ "receiver" ]],
    [ "receiver", [ "parent" ]]
];

function parent_start () {
    sender_react ("start");  // message content is ignored by sender
    release_all_outputs ();
}

function parent_react (message) {
    send ("parent", message);
}
function sender_react (message) {
    send ("sender", "Hello World");
}

function receiver_react (message) {
    console.log (message);
}


function dispatcher () {
    while (true) {
	if (parent_input_queue.length > 0) {
	    var message = schematic_input_queue.pop ();
	    parent_react (message);
	    release_all_outputs ();
	} else if (sender_input_queue.length > 0) {
	    var message = sender_input_queue.pop ();
	    sender_react (message);
	    release_all_outputs ();
	} else if (receiver_input_queue.length > 0) {
	    var message = receiver_input_queue.pop ();
	    receiver_react (message);
	    release_all_outputs ();
	}
    }
}

// parent_start ();
// dispatcher ();
function run() {
  parent_start ();
  dispatcher ();
}

run();

// usage: node flexibility.js
//  hit ^C to kill the example, after "Hello World" has been printed
