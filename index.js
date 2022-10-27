// botao irTopo
document.querySelector('#irTopo').addEventListener('click', () => window.scrollTo({
  top: 0,
  behavior: 'smooth',
}))

let final = {
  time_A: "",
  time_B: "",
  gols_time_A: "",
  gols_time_B: "",
};

groups = [];
matches = [];

async function getdata() {
  const response = await fetch(
    "https://estagio.geopostenergy.com/WorldCup/GetAllTeams",
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "git-user": "AgilitytzX",
      },
    }
  );
  const data = await response.json();
  define_groups(data.Result);
}

const shuffle = (data) => {
  for (let i = data.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * i);
    let k = data[i];
    data[i] = data[j];
    data[j] = k;
  }
  return data
};

function define_groups(teams) {
  shuffle(teams)
  for (i = 0; i < 32; i += 4) {
    groups.push(teams.slice(i, i + 4));
  }
  set_matches(groups)
}

function set_matches(groups) {
  for (i = 0; i < groups.length; i++) {
    matches[i] = []
    for (j = 0; j < 4; j++) {
      groups[i][j].points = 0
      groups[i][j].img = "assets/bandeiras/"+ groups[i][j].Name.toLowerCase() +".png"
    }
    for (t1 = 0; t1 < groups[i].length; t1++) {
      for (t2 = t1 + 1; t2 < groups[i].length; t2++) {
        matches[i].push(
          {
            Team_1: groups[i][t1].Name,
            Goals_1: Math.floor(Math.random() * 6),
            Team_2: groups[i][t2].Name,
            Goals_2: Math.floor(Math.random() * 6)
          }
        )
      }
    }
  }
  give_points()
}

function give_points() {
  for (index = 0; index < groups.length; index++) {
    for (j = 0; j < matches[index].length; j++) {
      if (matches[index][j].Goals_1 > matches[index][j].Goals_2) {

        winner_team = matches[index][j].Team_1
        groups[index].find(function (value, index, arr) {
          if (arr[index].Name === winner_team) {
            arr[index].points += 3
          };
        });

      }

      else if (matches[index][j].Goals_1 == matches[index][j].Goals_2) {
        Team_1 = matches[index][j].Team_1
        Team_2 = matches[index][j].Team_2
        groups[index].filter(function (value, index, arr) {
          if (arr[index].Name === Team_1) {
            arr[index].points += 1
          }
          if (arr[index].Name === Team_2) {
            arr[index].points += 1
          }
        })
      }

      else {
        winner_team = matches[index][j].Team_2
        groups[index].find(function (value, index, arr) {
          if (arr[index].Name === winner_team) {
            arr[index].points += 3
          };
        });
      }

    }
  }
  add_html_matches(0)
  add_html_group(0)
}

getdata()

const create_element = (elemento, classe, text) => {
  const tag = document.createElement(elemento)
  tag.className = classe
  tag.innerText = text
  return tag
}

function add_html_group(index) {
  groups[index].sort(function (a, b) {
    return a.points - b.points;
  }).reverse();

  console.log(groups[index])

  table = document.querySelector("#table_groups")
  table.innerText='';

  groups[index].forEach(function(teams , index){
    positon = 1
    tr = create_element("tr","","")

    positon = create_element("td","numbers",index + 1)
    points = create_element("td","numbers",teams.points)
    team = create_element("td","", "")
    img = create_element("img","bandeira","")
    img.src = teams.img
    team_name = create_element("h4","",teams.Name)
    team.append(img,team_name)
    tr.append(positon,team,points);
    table.appendChild(tr)
  });
}

function add_html_matches(index) {
  table = document.querySelector("#table_matches")
  table.innerText='';
  matches[index].forEach(function(match){
    tr = create_element("tr","","")

    td_team_1 = create_element("td","","")
    team_1_name = create_element("h4","",match.Team_1)
    td_goals_1 = create_element("td","numbers",match.Goals_1)

    td_team_2 = create_element("td","","")
    team_2_name = create_element("h4","",match.Team_2)
    td_goals_2 = create_element("td","numbers", match.Goals_2)

    groups[index].filter(function (value, index, arr) {
      if (arr[index].Name === match.Team_1) {
        img_Team_1 = create_element("img","bandeira","")
        img_Team_1.src = arr[index].img
      }
      if (arr[index].Name === match.Team_2) {
        img_Team_2 = create_element("img","bandeira","")
        img_Team_2.src = arr[index].img
      }
    })

    td_team_1.append(img_Team_1,team_1_name)
    td_team_2.append(img_Team_2,team_2_name)

    tr.append(td_team_1,td_goals_1,td_goals_2,td_team_2);
    table.appendChild(tr)
  });
}




document.querySelector("#btnGrupos").addEventListener('change', () => {
  group = document.querySelector("#btnGrupos").value
  add_html_matches(group)
  add_html_group(group)
})

