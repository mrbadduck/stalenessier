// Reference the LeanKit client
var LeanKitClient = require( "leankit-client" );

// Update this variable to the name of your LeanKit 
// account, which can be found in the URL you use 
// to access your LeanKit boards. For example, 
// https://mycompany.leankit.com
var accountName = "banditsoftware";

// Eric Small Test Board
var boardId = 1190850304;
var laneTitle = "RFA.1"
var increment = 3;

if (process.argv.length <= 2) {
    console.log("Usage: node lk-stalenessier.js [email] [password]");
    process.exit(-1);
}

// Update this variable to your email address
var email = process.argv[2];

// Update this variable to your LeanKit password
var password = process.argv[3];

// Create an instance of the client with your credentials
var client = new LeanKitClient( accountName, email, password );

client.getBoard( boardId, function( err, board ) {  
    if ( err ) console.error( "Error getting board:", err );

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
    if ( targetLane == null ) console.error( "Could not find lane:", laneTitle);

    // Get all the cards in the target lane
    var cards = targetLane.Cards;

    // Loop through the cards and increment their size by the increment amount
    for (var i = 0; i < cards.length; i++) {
        var card = cards[ i ];
        
        client.updateCardFields( {CardId: card.Id, Size: (card.Size + increment)}, function (err, res) {
        	if (err) console.error ("Error updating card:", card.Id);
        	else console.log(card.Id, card.Title, "Size Updated", card.Size, card.Size + increment);
        } );
    } 
} );



