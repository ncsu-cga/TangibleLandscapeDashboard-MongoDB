'use strict';

const apiUrl = 'http://localhost:3000';
const imageDir = 'app/images/animal_icons'
const session = {
  locationId: null,
  locationName: null,
  eventId: null,
  eventName: null,
  players: null,
  currentPlayer: null,
  currentPlayerId: null,
  icon: null
}

// Bar chart
const config = {
  divEle: '#bl-custom-chart',
  margin: { top: 80, right: 200, bottom: 80, left: 300 },
  heightDiv: '.content', // Div element that determin height of SVG
  chart: 'bl-charts',
  yLabelPad: 20,
  topPad: 15,
  legendRectSize: 15,
  colorPalette: {
    baseline: "rgba(238, 221, 153, .8)",
    palette: [
      "rgba(255, 204, 188, 1)",
      "rgba(77, 182, 172, 1)",
      "rgba(129, 199, 132, 1)",
      "rgba(255, 202, 40, 1)",
      "rgba(156, 204, 101, 1)",
      "#E0E0E0",
      "rgba(205, 220, 57, 1)"
    ]
  }
}

var Chart;

function mouseEnterSounds() {
  let audio = $('#sound-select')[0];
  audio.play();
}

function mouseClickSounds() {
  let audio = $('#sound-click')[0];
  audio.play();
}

$('[data-toggle="tooltip"]').tooltip();

$('#sonoma-ca').on('click', e => {
  let $this = $(e.currentTarget);
  session.locationId = 1;
  session.locationName = $this.attr('value');
});

$('#event-save').on('click', () => {
  session.name = $('#event-name').val();
  eventPost(session.name, session.locationId); // !! GET eventID
});

$('#sonama-ca-events').on('click', e => {
  session.locationId = 1;
  //session.location = 'Sonoma, CA';
  eventsByLocation('#select-event', session.locationId);
});

$('#select-event').on('click', e => {
  let eventInfo = e.target.text.split(': ');
  // console.log('eventInfo: ', eventInfo);
  if (session.eventId != eventInfo[0]){
    clearElements();
    //Need anonymous card for play nav
  }
  session.eventId = Number(eventInfo[0]);
  session.eventName = eventInfo[1];
  $('li').removeClass();
  $('#tld').css('display', 'block');
  $('#locations').css('display', 'none');
  $('#players').css('display', 'block');
  $('#nav-players').parent().addClass('active');

  showPlayers();
});


//**&&&& */
$('#player-save').on('click', e => {
  // session.currentPlayer = $('#player-name').val();
  let player = $('#player-name').val();
  // let promise = savePlayer(session.currentPlayer);
  if (player){
    let promise = savePlayer(player);
    promise.then(data => {
      // session.currentPlayer = data.name;
      // session.currentPlayerId = data._id;
      // savePlay(session.locationId, session.eventId, session.currentPlayerId, session.currentPlayer);
      savePlay(session.locationId, session.eventId, data._id, data.name);
      $('#player-name').val('');
      $('#player-profile').modal('hide');
    }, err => {
      console.log('ERROR: ', err);
    });
  } 
});

$('#player-profile').on('hidden.bs.modal', () => {
    showPlayers();
});

$('#player-cancel').on('click', e => {
  $('#player-name').val('');
});

// $('#show-players').on('click', e => {
//   showPlayers();
// });

$('#radar-update').on('click', e => {
  clearElements();
  mouseClickSounds();
  createRadarChart(session.locationId, session.eventId, session.currentPlayerId);
});


$('li > a').click(e => {
  let $this = $(e.currentTarget);
  $('li').removeClass();
  $this.closest('ul').find('.active').removeClass('active');
  $this.parent().addClass('active');
  $($this[0].attributes[1].nodeValue).toggle();
});


$('.nav a').click(e => {
  hideContentsDivs();
  let $this = $(e.currentTarget);
  let tag = $this[0].attributes[1].nodeValue;
  $(tag).show();
  switch (tag) {
    case '#locations':
      $('#all-players').empty();
      break;
    case '#players':
      showPlayers();
      break;
    case '#play':
      if (session.currentPlayer) {
        hideContentsDivs();
        $('#players').hide();
        $('#nav-players').parent().removeClass();
        $('#play').show();
        $('#nav-play').parent().addClass('active');
        $('#play-icon').attr('src', `${imageDir}/${session.icon}`);
        $('#player-card-name').html(session.currentPlayer);
        $('#player-card-id').html('');
        createRadarChart(session.locationId, session.eventId, session.currentPlayerId);
      }
      break;
    case '#data':
      showData();
      break;
  }
});

function hideContentsDivs() {
  let divs = ['#locations', '#players', '#play', '#data'];
  divs.forEach(ele => {
    $(ele).hide();
  });
}

$('#ul-bar').on('click', e => {
  let bar = e.target.text;
  $('#barchart-dropdown').html(`<i class="material-icons">insert_chart</i>${bar}<b class="caret"></b>`);
});

$('#ul-line').on('click', e => {
  let line = e.target.text;
  $('#linechart-dropdown').html(`<i class="material-icons">show_chart</i>${line}<b class="caret"></b>`);
});

function showPlayers() {
  clearElements();
  playByLocEvent(session.eventId).then(res => {
    return res.map(obj => {
      return obj.playerId;
    });
  }).then(playerIds => {
    if (playerIds.length != 0) {
      playersByIds(playerIds).then(data => {
        session.players = data.map(obj => {
          return { playerId: obj._id, name: obj.name, image: obj.image };
        });
        playerCardPanels(session.players);
      });
    } else {
      anonymous();
    }
  }, err => {
    console.log('ERROR: ', e);
  });
}

function clearElements() {
  $('#bl-custom-chart').empty();
  $('#all-players').empty();
  $('#player-radar').empty();
  $('#player-stats').empty();
  $('#ul-bar').empty();
  $('#ul-line').empty();
  //$('#radar-player-card').empty();
}

function showData() {
  clearElements();
  getBarChartDataFile(session.locationId, session.eventId).then(res => {
    let data = JSON.parse(res);
    setBarChartDropdowns(data);
    if (Chart){
      Chart = null;
    }
    Chart = new BarLineChart(config, data);
    Chart.drawCharts(data[0].axis, data[1].axis);
    $('.dropdown-menu').on('click', e => {
      let barOrLine = e.currentTarget.id.split('-')[1]; // 'ul-bar' or 'ul-line'
      let axis = {
        barchart: $('#barchart-dropdown').contents()[1].textContent,
        linechart: $('#linechart-dropdown').contents()[1].textContent
      }; // Get only text content
      if (barOrLine === 'bar' || barOrLine === 'line') {
        Chart.drawCharts(axis.barchart, axis.linechart);
      }
    });
  });
}

function setBarChartDropdowns(data) {
  let axes = data.map(d => { return d.axis; })
  dropdownList('#ul-bar', axes);
  dropdownList('#ul-line', axes);
  $('#barchart-dropdown').html(`<i class="material-icons">insert_chart</i>${data[0].axis}<b class="caret"></b>`);
  $('#linechart-dropdown').html(`<i class="material-icons">show_chart</i>${data[1].axis}<b class="caret"></b>`);
}

function dropdownList(divEle, data) {
  d3.select(divEle)
    .selectAll('li')
    .data(data)
    .enter()
    .append('li')
    .append('a')
    .text(d => { return d; });
}

function anonymous() {
  let col = $('<div class="col-md-3"></div>');
  let card = $(
    `<div class="card card-profile">
        <div class="card-avatar">
          <a href="#"><img class="img" src="app/images/Anonymous Mask icon 3.png" /></a>
        </div>
        <div class="content">
          <h4 class="card-title">Anonymous</h4>
          <p class="card-content">No players found</p>
        </div>
    </div>`);
  card.appendTo(col);
  col.appendTo('#all-players');
}

function playerCardPanels(data) {
  for (let i = 1; i <= data.length; i++) {
    let playerName = data[i - 1].name;
    let playerId = data[i - 1].playerId;
    let icon = data[i - 1].image;
    let col = $('<div class="col-md-3"></div>');
    let card = null;
    if (playerId == session.currentPlayerId){
      card = $(
        `<div class="card card-profile" onmouseenter="mouseEnterSounds()">
          <div class="card-avatar">
            <a href="#"><img class="img" src="app/images/animal_icons/${icon}" /></a>
          </div>
          <div class="content">
            <h3 class="card-title">${playerName}</h3>
            <p class="card-content"></p>
            <a id="player-${playerId}" href="#" class="btn btn-round play-btn" style="background-color: #ef5350;" onclick="mouseClickSounds()">Playing</a>
            <button id="dataview-${playerId}" type="button" class="btn btn-info btn-fab btn-fab-mini btn-round"
            data-toggle="tooltip" data-placement="top" title="View data" onclick="mouseClickSounds()">
            <i class="material-icons">visibility</i></button>
          </div>
      </div>`);
    } else {
      card = $(
        `<div class="card card-profile" onmouseenter="mouseEnterSounds()">
          <div class="card-avatar">
            <a href="#"><img class="img" src="app/images/animal_icons/${icon}" /></a>
          </div>
          <div class="content">
            <h3 class="card-title">${playerName}</h3>
            <p class="card-content"></p>
            <a id="player-${playerId}" href="#" class="btn btn-round play-btn" style="background-color: #4caf50;" onclick="mouseClickSounds()">Play</a>
            <button id="dataview-${playerId}" type="button" class="btn btn-info btn-fab btn-fab-mini btn-round"
            data-toggle="tooltip" data-placement="top" title="View data" onclick="mouseClickSounds()">
            <i class="material-icons">visibility</i></button>
          </div>
      </div>`);
    }
    card.appendTo(col);
    col.appendTo('#all-players');
    // Add click event
    $(`#player-${playerId}`).on('click', e => {
      $(`#player-${session.currentPlayerId}`).css('background-color', '#4caf50');
      $(`#player-${session.currentPlayerId}`).html('Play');
      session.currentPlayerId = playerId;
      session.currentPlayer = playerName;
      session.icon = icon;
      currentDelete();
      currentPost(session.locationId, session.eventId, session.currentPlayerId, session.currentPlayer);
      //console.log('CURRENT: ', session.locationId, session.eventId, session.currentPlayerId, session.currentPlayer);
      $(`#player-${playerId}`).css('background-color', '#ef5350');
      $(`#player-${playerId}`).html('Playing');
    });

    $(`#dataview-${playerId}`).on('click', e => {
      hideContentsDivs();
      $('#players').hide();
      $('#nav-players').parent().removeClass();
      $('#play').show();
      $('#nav-play').parent().addClass('active');
      $('#play-icon').attr('src', `${imageDir}/${icon}`);
      $('#player-card-name').html(playerName);
      $('#player-card-id').html('');
      createRadarChart(session.locationId, session.eventId, playerId);
    });
  }
}

function createRadarChart(locationId, eventId, playerId) {
  clearElements();
  const margin = { top: 100, right: 50, bottom: 100, left: 50 },
    width = $('#player-radar').width() - margin.left - margin.right,
    height = width - margin.top - margin.bottom - 20,
    //color = d3.scale.ordinal().range(["#EDC951", "#CC333F", "#00A0B0", "#9F7EBD"]),
    radarChartOptions = {
      w: width,
      h: height,
      margin: margin,
      maxValue: 10,
      levels: 10,
      roundStrokes: true,
      //color: color
    };
  let radarCtData = getRadarChartDataFile(locationId, eventId, playerId);
  let dataObj = null;
  let d = []; //[[{"axis": "text", "value": 5},... ], [{"axis": "text", "value": 2},...]]
  let legend = [];
  radarCtData.then(radarData => {
    if (typeof radarData === 'string') {
      dataObj = JSON.parse(radarData);
      dataObj.map((rData, i) => {
        if (rData.baseline) {
          legend[i] = 'No treatment'
        } else {
          legend[i] = rData.attempt;
        }
        d[i] = rData.data;
      });
      RadarChart('#player-radar', d, legend, radarChartOptions); // RadarChart.js call
      tableVerticalHeader('#player-table', dataObj);
    } 
    // else {
    //   let baseline = getRadarBaselineFile(locationId);
    //   baseline.then(base => {
    //     dataObj = JSON.parse(base);
    //     dataObj.map((rData, i) => {
    //       d[i] = rData.data;
    //     });
    //     RadarChart('#player-radar', d, radarChartOptions); // RadarChart.js call
    //     tableVerticalHeader('#player-table', dataObj);
    //   }).fail(err => {
    //     alert('Error in finding a radar baseline file.', err);
    //   });
    // }
  }).fail(err => {
    //alert('Error in finding a radar chart file.', err);
    let baseline = getRadarBaselineFile(locationId);
    baseline.then(base => {
      dataObj = JSON.parse(base);
      dataObj.map((rData, i) => {
        d[i] = rData.data;
      });
      RadarChart('#player-radar', d, radarChartOptions); // RadarChart.js call
      tableVerticalHeader('#player-table', dataObj);
    }).fail(err => {
      alert('Error in finding a radar baseline file.', err);
    });
  });
}

/////////////////////////////////////////////////////////
/////////////////////////Table //////////////////////////
/////////////////////////////////////////////////////////
function tableVerticalHeader(ele, tdata) {
  let header = ['#'];
  let tableRows = [];
  tdata.map((d, i) => {
    let tableRow = [];
    if (d.baseline) {
      tableRow.push({ column: '#', value: 'No treatment' });
      d.tableRows.map(b => {
        header.push(b.column);
      })
    } else {
      tableRow.push({ column: '#', value: d.attempt });
    }
    d.tableRows.map(c => {
      tableRow.push(c);
    });
    tableRows.push(tableRow);
  });

  let table = d3.select('#player-stats')
    .append('table')
    .attr('class', 'table table-hover')
    .attr('id', 'player-table');

  var thead = table.append('thead');
  var tbody = table.append('tbody');

  // append the header row
  thead.append('tr')
    .selectAll('th')
    .data(header)
    .enter()
    .append('th')
    .attr('class', 'text-primary')
    .style('text-align', 'center')
    .text(function (header) {
      return header;
    });

  // create a row for each object in the data
  var rows = tbody.selectAll('tr')
    .data(tableRows)
    .enter()
    .append('tr');

  // create a cell in each row for each column
  var cells = rows.selectAll('td')
    .data(row => {
      return row.map(r => {
        return r;
      });
    })
    .enter()
    .append('td')
    .style('text-align', 'center')
    .text(d => {
      return d.value;
    });
}

function eventPost(name, locationId) {
  $.ajax({
    type: 'POST',
    url: `${apiUrl}/event`,
    data: JSON.stringify({ name, locationId }),
    contentType: 'application/json',
    dataType: 'json',
    success: e => {
      //console.log('data sent', e);
      session.eventId = e._id;
    },
    error: err => {
      console.log(err);
    }
  });
}

function eventsByLocation(divEle, loc) {
  $.ajax({
    type: 'GET',
    url: `${apiUrl}/event/location/${loc}`,
    //data: loc,
    success: events => {
      //console.log('Results', events);
      let eventNames = events.map(item => {
        return `${item._id}: ${item.name}`;
      });
      dropdownList(divEle, eventNames);
    },
    error: err => {
      console.log(err);
    }
  });
}

function savePlayer(playerName) {
  return $.ajax({
    type: 'POST',
    url: `${apiUrl}/player`,
    data: JSON.stringify({ name: playerName }),
    contentType: 'application/json',
    dataType: 'json',
    success: e => {
      console.log('Player data sent.');
    },
    error: err => {
      console.log('ERROR: Player data failed to send.', err);
    }
  });
}

function savePlay(locationId, eventId, playerId, playerName) {
  console.log({ locationId: locationId, eventId: eventId, playerId: playerId });
  $.ajax({
    type: 'POST',
    url: `${apiUrl}/play`,
    data: JSON.stringify({ locationId, eventId, playerId, playerName }),
    contentType: 'application/json',
    dataType: 'json',
    success: e => {
      console.log('Play data sent.');
    },
    error: err => {
      console.log('ERROR: Play data failed to send.', err);
    }
  });
}

function playersByIds(ids) {
  return $.ajax({
    type: 'GET',
    url: `${apiUrl}/player/players`,
    data: { _id: ids }
  });
}

function playByLocEvent(eventId) {
  return $.ajax({
    type: 'GET',
    url: `${apiUrl}/play`,
    data: { eventId }
  });
}

function getRadarChartDataFile(locationId, eventId, playerId) {
  return $.ajax({
    type: 'GET',
    url: `${apiUrl}/charts/radar`,
    data: { locationId, eventId, playerId }
  });
}

function currentPost(locationId, eventId, playerId, playerName) {
  $.ajax({
    type: 'POST',
    url: `${apiUrl}/current`,
    data: JSON.stringify({locationId, eventId, playerId, playerName}),
    contentType: 'application/json',
    dataType: 'json',
    success: e => {
      console.log('data sent', e);
    },
    error: err => {
      console.log(err);
    }
  });
}

function currentDelete() {
  $.ajax({
    type: 'DELETE',
    url: `${apiUrl}/current`,
    success: e => {
      console.log(e);
    },
    error: err => {
      console.log(err);
    }
  });
}

// function currentGet() {
//   return $.ajax({
//     type: 'GET',
//     url: `${apiUrl}/current`,
//     success: d => {
//       console.log(d);
//       return d;
//     },
//     error: err => {
//       return alert('No data found.');
//     }
//   });
// }

// function getRadarChartDataById(id) {
//   return $.ajax({
//     type: 'GET',
//     url: `${apiUrl}/charts/radar/${id}`,
//   });
// }

function getBarChartDataFile(locationId, eventId) {
  return $.ajax({
    type: 'GET',
    url: `${apiUrl}/charts/bar`,
    data: { locationId, eventId },
    success: d => {
      return d;
    },
    error: err => {
      return alert('No data found.');
    }
  });
}

function getRadarBaselineFile(locationId) {
  return $.ajax({
    type: 'GET',
    url: `${apiUrl}/charts/radarBaseline`,
    data: { locationId }
  });
}




