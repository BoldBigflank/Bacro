var game = {
				acronym: "ABC",
				votes: 0,
				state:"result",
				help: "The round has ended.  Click 'New Round' to begin.",
				entries: [
					{
						text: "A Boy Cried",
						votes: 1
					},
					{
						text: "Ant Billy Crush",
						votes: 2
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
		game.votes = 0
		game.help = "Enter a phrase whose acronym matches the above letters."

		// Make a new acronym

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

exports.addEntry = function(text){
	if(game.state == "entry"){
		game.entries.push({text: text, votes: 0})
		return game.entries.length
	}
	else
		return false
}

exports.addVote = function(number){
	var x = parseInt(number)
	if(game.state == "vote"){
        game.entries[number].votes ++
		game.votes++
		return game.votes
	}
	else return false
}