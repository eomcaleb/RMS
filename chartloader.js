function fetchStock() {
    var ticker = document.getElementById("ticker").value; 
    var start = document.getElementById("start").value; 
    var end = document.getElementById("end").value; 

    let API_Call = 'https://api.twelvedata.com/time_series?apikey=f0c7938caae54260b8421dfb9b9d3093&interval=1day&symbol=' + ticker +'&country=US&type=stock&format=JSON&start_date=' + start + '&end_date=' + end;

    fetch(API_Call)
        .then(
            function(response) {
                return response.json();
            }
        )
        .then(
            function(data) {
                let d = []
                let l = []
                for (var key in data["values"]) {
                    l.push(data["values"][key]["datetime"])
                    d.push(data["values"][key]["close"]);
                }
                
                l.reverse();
                d.reverse();

                const data2 = {
                    labels: l,
                    datasets: [{
                    label: 'My First dataset',
                    backgroundColor: 'rgb(255, 99, 132)',
                    borderColor: 'rgb(255, 99, 132)',
                    data: d,
                    }]
                    };
                    
                const config = {
                    type: 'line',
                    data: data2,
                    options: {}
                    };
                    
    
                const myChart = new Chart(
                    document.getElementById('myChart').getContext('2d'),
                    config
                );
            }
        )
}
fetchStock()