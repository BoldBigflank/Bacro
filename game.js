var game = {
				acronym: "ABC",
				votes: [],
				state:"result",
				help: "The round has ended.  Click 'New Round' to begin.",
				entries: [
					{
						id: "test",
						text: "A Boy Cried",
						votes: ["test2"]
					},
					{
						id: "test2",
						text: "Ant Billy Crush",
						votes: ["test"]
					}
				]
			} // entry, vote, result

exports.setState = function(state){
	// Only start new rounds when the last is done
	if(game.state != "result" && state == "entry") return false
	// entry, vote, result
	game.state = state
	if(state=="entry"){ // New round
		// Set the state
		game.state = "entry"
		game.entries = []
		game.votes = []
		game.help = "Enter a phrase whose acronym matches the above letters."

		// Make a new acronym
		var chars = "ABCDEFGHIJKLMNOPQRSTUVWXTZ";
		var string_length = Math.floor(Math.random() * 4) + 3;
		var randomstring = '';
		for (var i=0; i<string_length; i++) {
			var rnum = Math.floor(Math.random() * chars.length);
			randomstring += chars.substring(rnum,rnum+1);
		}
		game.acronym = randomstring	

		// Fire the next round behavior
		return game
	}
	else if (state == "vote")
		game.help = "Pick your favorite phrase (not your own) from the list below"
	else if (state == "result")
		game.help = "The round has ended.  Click 'New Round' to begin."
	else
		game.help = "";
	return game
}

exports.getGame = function(){
	return game
}

exports.addEntry = function(id, text){
	if(game.state == "entry"){
		game.entries.push({id: id, text: text, votes: []})
		return game.entries.length
	}
	else
		return false
}

exports.addVote = function(id, number){
	var x = parseInt(number)
	if(game.state == "vote"){
        game.entries[number].votes.push(id)
		game.votes.push(id)
		return game.votes
	}
	else return false
}