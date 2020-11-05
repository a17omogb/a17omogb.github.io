function convertRestaurantsToCategories(restaurantList) {
  const categoryArray = [];
  const result = {};
  for (let i = 0; i < restaurantList.length; i += 1) {
    categoryArray.push(restaurantList[i].category);
  }

  for (let i = 0; i < categoryArray.length; i += 1) {
    if (!result[categoryArray[i]]) {
      result[categoryArray[i]] = 0;
    }
    result[categoryArray[i]] += 1;
  }

  const reply = Object.keys(result).map((category) => ({
    y: result[category], 
    label: category
  }));

  console.log('reply', reply);
  return reply;
}

function makeYourOptionsObject(datapointsFromRestaurantsList) {
  // set your chart configuration here!
  // eslint-disable-next-line no-console
  console.log('makeYourOptionsObject');
  CanvasJS.addColorSet('customColorSet1', [
    '#2F4F4F',
    '#008080',
    '#2E8B57',
    '#3CB371',
    '#90EE90'

  ]);

  return {
    animationEnabled: true,
    colorSet: 'customColorSet1',
    title: {
      text: 'Places To Eat Out In Future'
    },
    axisX: {
      interval: 1,
      labelFontSize: 12
    },
    axisY2: {
      interlacedColor: 'rgba(1,77,101,.2)',
      gridColor: 'rgba(1,77,101,.1)',
      title: 'Change This Title',
      labelFontSize: 12,
      scaleBreaks: {
        customBreaks: [
          {
            type: 'zigzag',
            startValue: 40,
            endValue: 50,
            color: 'blue'
          },
          {
            type: 'zigzag',
            startValue: 85,
            endValue: 100,
            color: 'blue'
          },
          {
            type: 'zigzag',
            startValue: 140,
            endValue: 175,
            color: 'blue'
          }

        ]
      } // Add your scale breaks here https://canvasjs.com/docs/charts/chart-options/axisy/scale-breaks/custom-breaks/
    },
    data: [{
      type: 'bar',
      name: 'restaurants',
      axisYType: 'secondary',
      dataPoints: datapointsFromRestaurantsList
    }]
  };
}

function runThisWithResultsFromServer(jsonFromServer) {
  console.log('jsonFromServer', jsonFromServer);
  sessionStorage.setItem('restaurantList', JSON.stringify(jsonFromServer)); // don't mess with this, we need it to provide unit testing support
  // Process your restaurants list
  // Make a configuration object for your chart
  // Instantiate your chart
  const reorganizedData = convertRestaurantsToCategories(jsonFromServer);
  const options = makeYourOptionsObject(reorganizedData);
  const chart = new CanvasJS.Chart('chartContainer', options);
  chart.render();
}

// Leave lines 52-67 alone; do your work in the functions above
document.body.addEventListener('submit', async (e) => {
  e.preventDefault(); // this stops whatever the browser wanted to do itself.
  const form = $(e.target).serializeArray();
  fetch('/api', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(form)
  })
    .then((fromServer) => fromServer.json())
    .then((jsonFromServer) => runThisWithResultsFromServer(jsonFromServer))
    .catch((err) => {
      console.log(err);
    });
});