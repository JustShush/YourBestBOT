const axios = require('axios');
const { API42_UID, API42_SECRET } = require("../../config.json");

const data = {};

async function get42Token() {

	if (data.expires_in && Date.now() <= data.expires_in) return;

	let newtoken = 0;

	const requestData = {
		grant_type: 'client_credentials',
		client_id: API42_UID,
		client_secret: API42_SECRET
	};

	newtoken = await axios({
		method: 'post',
		url: 'https://api.intra.42.fr/oauth/token',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		data: new URLSearchParams(requestData),
		withCredentials: true
	}).catch(error => {
		// Handle errors here
		console.error(error);
	});
	return newtoken.data.access_token;
}

async function get42User(token, User) {
	const user = await axios.get(`https://api.intra.42.fr/v2/users/${User}`, {
		headers: {
			'Authorization': `Bearer ${token}`
		},
		withCredentials: true
	}).catch(error => {
		// Handle errors here
		console.error(error);
	});
	return user.data || undefined;
}

async function get42Projects(token, projectsIds) {
	const projects = await axios.get(`https://api.intra.42.fr/v2/projects`, {
		params: {
			filter: { id: projectsIds.join() },
			page: { size: 100 }
		},
		headers: {
			'Authorization': `Bearer ${token}`
		},
		withCredentials: true
	}).catch(error => {
		// Handle errors here
		console.error(error);
	});
	return projects.data || undefined;
}

async function getCampusLoc(user) {
	const result = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(user.campus[0].address)}`)
		.catch(error => {
			console.error('Error:', error.message);
		});
	const res = result.data;
	if (res.length > 0) {
		const location = res[0];
		const latitude = location.lat;
		const longitude = location.lon;
		//console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
		// Construct a link to Google Maps
		const googleMapsLink = `https://www.google.com/maps?q=${latitude},${longitude}`;
		//console.log(`Google Maps Link: ${googleMapsLink}`);
		return (googleMapsLink);
	} else {
		console.error('No results found');
		return ('No results found')
	}
}

async function User42(User) {
	const res = {};
	const token = await get42Token().catch(console.log);
	if (!token) return console.log("problem creating the 42token");
	data.expires_in = Date.now() + (2 * 60 * 60 * 1000);
	const user = await get42User(token, User); // ifreire-

	// update data with new info
	res.user_id = user.id;
	res.login = User;
	res.name = user.displayname;
	res.image = user.image.link;
	res.campus = user.campus[0].name;
	res.website = user.campus[0].website;
	res.loc = await getCampusLoc(user);
	res.cursus = user.cursus_users[1].cursus.name;
	res.grade = user.cursus_users[1].grade;
	res.kind = user.kind;

	// Find project ids
	let project_ids = []
	for (project of user.projects_users) {
		if (project.status === "finished")
			project_ids.push(project.project.id);
	}
	const projects = await get42Projects(token, project_ids);

	// Add projects to data
	res.projects = []
	let project_json = projects;
	for (project of project_json) {
		let is_piscine = false;
		// Check if we should add this project to the list
		if (project.exam == true)
			continue;

		// Check if the project is validated
		let r = user.projects_users.filter(function (item) {
			return item.project.id == project.id;
		})[0];
		if (r['validated?'] == false)
			continue;

		for (cursus of project.cursus) {
			if (cursus.kind == 'piscine') {
				is_piscine = true;
				break;
			}
		}

		// Add all the keywords from that project to the json (could have)
		let keywordsArr = [];
		project.project_sessions[0].objectives.forEach(key => {
			//console.log(key) //! keywords are not being pushed to the arr at the end
			keywordsArr.push(key);
		});

		// Add project to list if it isn't a piscine
		if (!is_piscine) {

			// if the project is in groups or not
			let group = false;
			if (project.project_sessions[0].solo === false) group = true;
			// difficulty of the project
			let difficulty = 0;
			difficulty = project.project_sessions[0].difficulty;
			// if the user did the bonus
			let bonus = false;
			user.projects_users.forEach(pro => {
				if (pro.project.id === project.id) {
					if (pro.final_mark > 100) bonus = true;
				}
			});
			res.projects.push({
				"name": project.name,
				"description": project.project_sessions[0].description,
				"keywords": keywordsArr,
				"difficulty": difficulty,
				"group": group,
				"bonus": bonus,
			});
		}
	}

	// Sort projects based on difficulty first, then name
	res.projects.sort(function (lhs, rhs) {
		if (lhs.difficulty < rhs.difficulty)
			return -1;
		if (lhs.difficulty > rhs.difficulty)
			return 1;
		if (lhs.name < rhs.name)
			return -1;
		if (lhs.name > rhs.name)
			return 1;
		return 0;
	});

	// Find the CPP module with the highest difficulty and highest number in the name
	const cppModuleWithHighestDifficultyAndNumber = res.projects
		.filter(project => project.name.startsWith("CPP"))
		.reduce((maxProject, currentProject) => {
			const currentNumber = parseInt(currentProject.name.match(/\d+/)[0]) || 0;
			const maxNumber = parseInt(maxProject.name.match(/\d+/)[0]) || 0;
	
			if (currentProject.difficulty > maxProject.difficulty ||
				(currentProject.difficulty === maxProject.difficulty && currentNumber > maxNumber)) {
				return currentProject;
			} else {
				return maxProject;
			}
		}, { difficulty: -1, name: "CPP Module 00" });
	
	// Filter projects to include only the CPP module with the highest difficulty and number, and other projects
	res.projects = res.projects.filter(project =>
		project === cppModuleWithHighestDifficultyAndNumber || !project.name.startsWith("CPP")
	);
	
	//console.log("end!", res);

	return res;
}

module.exports = { User42 };