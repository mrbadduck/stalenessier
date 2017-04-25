// Reference the LeanKit client
var LeanKitClient = require( "leankit-client" );
var read = require('read')

// Update this variable to the name of your LeanKit 
// account, which can be found in the URL you use 
// to access your LeanKit boards. For example, 
// https://mycompany.leankit.com
var accountName = "banditsoftware";

// Eric Small Test Board
var boardId = 1190850304;
var laneTitle = "RFA.2"
var increment = 2;

var usage = "Usage: node lk-stalenessier.js [board ID] [lane title] [increment #]";

if (process.argv.length == 2) {
	console.log("Using default test values, updating Eric Small Test Board, lane RFA.2, increment 2.")
}

if (process.argv.length > 2) {
	if (process.argv[2] == 'help') {
		console.log(usage);
		process.exit(0);
	}

	if (process.argv.length < 5) {
	    console.log(usage);
	    process.exit(-1);
	}

	boardId = process.argv[2];
	laneTitle = process.argv[3];
	increment = process.argv[4];
}

read({ prompt: 'Login E-mail: '}, function(er, email) {
read({ prompt: 'Password (silent): ', silent: true }, function(er, password) {
  
	// Create an instance of the client with your credentials
	var client = new LeanKitClient( accountName, email, password );

	client.getBoard( boardId, function( err, board ) {  
	    if ( err ) console.error( "Error getting board:", boardId, err );

	    // Get the active lanes from the board
	    var lanes = board.Lanes;

	    // Loop through the lanes to find the lane of interest
	    var targetLane = null;
	    for (var i = 0; i < lanes.length; i++) {
	    	//console.log(lanes[i].Title);
	    	if ( lanes[i].Title == laneTitle ) {
	    		targetLane = lanes[i];
	    		break;
	    	}
	    }

	    // If you didn't find the lane, abort!
	    if ( targetLane == null ) {
	    	console.error( "Could not find lane:", laneTitle);
	    	exit(1);
	    }

	    // Loop through the board users to find the user who made this request
	    var user = null;
	    for (var i = 0; i < board.BoardUsers.length; i++) {
	    	//console.log(board.BoardUsers[i].EmailAddress);
	    	if ( board.BoardUsers[i].EmailAddress == email ) {
	    		user = board.BoardUsers[i];
	    		break;
	    	}
	    }
	    
	    // If you didn't find the user, abort!
	    if ( user == null ) {
	    	console.error( "Could not find the user on the board:", email);
	    	exit(1);
	    }

	    // Get all the cards in the target lane
	    var cards = targetLane.Cards;

	    function stalenessifyCards( i ) {
		    // Loop through the cards and increment their size by the increment amount
		    var card = cards[ i ];
		    
		    if ( !card ) return;
		        
		    client.updateCardFields( {CardId: card.Id, Size: (card.Size + increment)}, function (err, res) {
		        if (err) console.error ("Error updating card:", card.Id, err);
		        else console.log(i + 1, "/", cards.length, card.Id, card.Title, "Size Updated", card.Size, card.Size + increment);

		        client.addComment( boardId, card.Id, user.Id, "Size updated for staleness to " + (card.Size + increment), function (err, res) {
		            if (err) console.error ("Error commenting on card:", card.Id, err);
		        
		        	stalenessifyCards( i + 1 );
		        } );
		    } );
		} 

	    // Get all the cards in the target lane
	    stalenessifyCards( 0 );
	} );
} )
} )

