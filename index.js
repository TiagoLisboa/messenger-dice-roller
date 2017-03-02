const login = require('facebook-chat-api')

const rollDice = (dice) => {
	for (var i = 0; i < dice.length; i++){
		if(isNaN(Number(dice[i])) && dice[i] != 'd'){
			dice = e.slice(i+1)
		}
	}

	var values = dice.split('d')
	values[0] = Number(values[0]) > 0 ? Number(values[0]) : 1
	var rodada = '( '
	for(var i = 0; i < values[0]; i++){
		rodada += Math.floor(Math.random() * values[1])+1
		if (i < values[0] - 1) rodada += ' + '
	}
	rodada += ' )'
	return {roll: dice, result: rodada}
}

const sendMsg = (api, target, body) => {
	api.sendMessage(String(body), target, (err, data) => {if (err) console.log(err)})
}

const handleRoll = (api, msg) => {
		console.log(msg.body)
	let msgBody = msg.body
	let thread 	= msg.threadID

	var body = ''
	if(msgBody.indexOf('help') >= 0) {body += 'com /roll qualquer operação matemática será executada e as combinações de {qtd}d{faces} rolará um dado com {faces} faces {qtd} vez, por exemplo: /roll 2*3d6+2'}
	else {
		let roll = msgBody.split(' ')[1]
		let rolls = []

		for (var i = 0; i < roll.length; i++){
			if(roll[i] == 'd'){
				var tmp = roll.slice(i-1);
				var j;
				for(j = 0; j < tmp.length; j++){
					if(isNaN(Number(tmp[j]))) break
				}
				rolls.push(roll.slice(i-1, i+j+1))
			}
		}

		var rollsResults = []

		rolls.forEach((e, idx) => {
			rollsResults[idx] = rollDice(e)
		})

		rollsResults.forEach((e, idx) => {
			roll = roll.replace(e.roll, e.result)
		})

		body = roll + ' = ' + eval(roll)

		console.log(body)
		sendMsg(api, thread, body);
	}
}

login({email: 'tiago.caio.al@gmail.com', password: 'quaresma'}, (err, api) => {
	if(err) return console.log('err', err)

	api.listen((err, msg) => {
		// api.sendMessage(msg.body, msg.threadID)	
		msg.body = msg.body == undefined ? '' : msg.body
		if(msg.body.indexOf('/roll') >= 0) return handleRoll(api, msg)
	})

})
