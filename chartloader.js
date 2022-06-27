MASTERDATA = [];
myChart = null;
selectedInvestor = "DCA";
description = "";

var formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

function StrategyDCF(data) {
    this.description = this.selectedInvestor + " is an intermediate investor and decides to dollar-cost-average his money.<br/><br/>";
    var initial_investment_3 = 12000;
    var starting = 12000;
    this.description += "Starting Amount:  <b><span style='color:lightgreen'>" + formatter.format(initial_investment_3) + "</span></b><br/>";
    var investment_amount = 1000;
    this.description += "Dollar Cost Average Amount:  <b>" + formatter.format(investment_amount) + "</b><br/>";
    var amount_in_investments = 0;
    var value = data['values'];
    buy_values = {};    
    length = value.length - 1;
    prev_month = '-1';
    for (let i = length; i > -1; i--) {
        curr_month = value[i]['datetime'].slice(5, 7);
        if (prev_month != curr_month) {
            buy_values[value[i]['datetime']] = (value[i]['open']);
            initial_investment_3 -= investment_amount;
            amount_in_investments += investment_amount;

            prev_month = curr_month;
        }
    }
    end_price = value[0]['close'];
    this.description += "He bought " + Object.keys(buy_values).length + " time(s). <br/>";
    investment_gain = 0;
    for (var key in buy_values) {
        investment_gain += ((end_price - buy_values[key]) / buy_values[key]) * investment_amount;
    }
    final_amount = initial_investment_3 + amount_in_investments + investment_gain;
    percent_gain = ((final_amount - starting) / starting);
    this.description += "Final Amount:  <b><span style='color:lightgreen'>" + formatter.format(final_amount) + "</span></b><br/>";
    this.description += "Overall Percent Gain/Loss: " +  parseFloat(percent_gain*100).toFixed(2) +"%";
    return [buy_values, final_amount];
}


function StrategyBuyAndHold(data) {
    this.description = this.selectedInvestor + " is a beginner investor and decides to invest his money and leave it.<br/><br/>";
    var initial_investment_1 = 12000;
    this.description += "Starting Amount:  <b><span:'color:lightgreen'>" + formatter.format(initial_investment_1) + "</span></b><br/>";
    var value = data['values'];
    var dict = {}
    length = value.length - 1
    end_price = value[0]['close'];
    open_price = value[length]['open'];
    open_date = value[length]['datetime'];
    dict[open_date] = open_price;
    this.description += "He bought " + Object.keys(dict).length + " time(s). <br/>"
    stock_gain = end_price - open_price;
    percent_gain = stock_gain / open_price;
    final_amount = initial_investment_1 * (1 + percent_gain);
    this.description += "Final Amount:  <b><span:'color:lightgreen'>" + formatter.format(final_amount) + "</span></b><br/>";
    this.description += "Overall Percent Gain/Loss: " + parseFloat(percent_gain*100).toFixed(2) +"%</span>";
    return [dict, final_amount];
}

function StrategyBuyThe5PercentDip(data) {
    this.description = this.selectedInvestor + " is an intermediate investor and decides to invest his money whenever the stock price drops by 5%.<br/><br/>";
    var initial_investment_2 = 12000;
    var starting = 12000;
    this.description += "Starting Amount:  <b><span:'color:lightgreen'>" + formatter.format(initial_investment_2) + "</span></b><br/>";
    var investment_amount = 1000;
    this.description += "Invest Amount Every Drop: <b>" + formatter.format(investment_amount) + "</b><br/>";
    var amount_in_investments = 0;
    var value = data['values'];
    buy_values = {};    
    length = value.length - 1;
    for (let i = length-1; i > 0; i--) {
        if ((value[i-1]['open'] - value[i]['close']) / value[i]['close'] <= -0.05) {
            if (initial_investment_2 == 0) {
                break
            }
            initial_investment_2 -= investment_amount;
            amount_in_investments += investment_amount;
            buy_values[value[i-1]['datetime']] = value[i-1]['open'];
        }
    }
    end_price = value[0]['close'];
    this.description += "He bought " + Object.keys(buy_values).length + " time(s). <br/>";
    investment_gain = 0;
    for (var key in buy_values) {
        investment_gain += ((end_price - buy_values[key]) / buy_values[key]) * investment_amount;
    }
    final_amount = initial_investment_2 + amount_in_investments + investment_gain;
    percent_gain = ((final_amount - starting) / starting);
    this.description += "Final Amount:  <b><span:'color:lightgreen'>" + formatter.format(final_amount) + "</span></b><br/>";
    this.description += "Overall Percent Gain/Loss: " + parseFloat(percent_gain*100).toFixed(2) +"%";
    return [buy_values, final_amount];
}

document.getElementById('exampleRadios1').addEventListener('click', ({ target }) => { 
    this.selectedInvestor = target.value;
    Plot();
});
document.getElementById('exampleRadios2').addEventListener('click', ({ target }) => {
    this.selectedInvestor = target.value;
    Plot();  
});
document.getElementById('exampleRadios3').addEventListener('click', ({ target }) => { 
    this.selectedInvestor = target.value;
    Plot();
});
document.getElementById('Load').addEventListener('click', ({ target }) => { 
    this.myChart.destroy();
    this.fetchStock();
});

function Plot() {
    values = []
    if (this.selectedInvestor === "DCA") {
        values = StrategyDCF(MASTERDATA)[0];
    }
    else if (this.selectedInvestor === "5PDIP") {
        values = StrategyBuyThe5PercentDip(MASTERDATA)[0];
    }
    else if (this.selectedInvestor === "BUYANDHOLD") {
        values = StrategyBuyAndHold(MASTERDATA)[0];
    }
    document.getElementById('summary').innerHTML = this.description;

    let d = []
    let l = []
    let c = []
    let r = []

    for (var key in this.MASTERDATA["values"]) {
        l.push(MASTERDATA["values"][key]["datetime"])
        d.push(MASTERDATA["values"][key]["open"]);

        if (values === undefined || values.length == 0) { continue; }
        if (this.MASTERDATA["values"][key]["datetime"] in values) {
            c.push("lightgreen");
            r.push(7);
        }
        else {
            c.push("rgb(255, 99, 132)");
            r.push(1);
        }
    }
    
    l.reverse();
    d.reverse();
    c.reverse();
    r.reverse();

    this.myChart.destroy();
    const ctx = document.getElementById('myChart').getContext('2d'); 

    const data2 = {
        labels: l,
        datasets: [{
            pointRadius: r,
            pointHoverRadius: r,
            lineTension: 0.2,
            label: 'My First dataset',
            borderColor: 'rgb(188, 127, 243)',
            data: d,
            pointBackgroundColor: c,
            backgroundColor: "#252539",
            fill: true,
			fillOpacity: .9,
        }]
        };


    const config = {
        type: 'line',
        data: data2,
        options: {
            
            plugins: {
                legend: {
                    display: false
                },
            }

        }
        };
        

    this.myChart = new Chart(
        ctx,
        config
    );
}

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
                MASTERDATA = data; 
                this.myChart = new Chart(
                    document.getElementById('myChart').getContext('2d'),
                    null
                );  
                document.getElementById('tickertitle').innerHTML = "<span style='font-size:33px;'><b>" + ticker.toUpperCase() + " / " 
                                                                    + MASTERDATA["meta"]["currency"] 
                                                                    + " </span><br><span style='font-size:15px; color:#7537ff;'>"
                                                                    + MASTERDATA["meta"]["exchange"] + "</span>";
                Plot();
            }
        )
}

var now = new Date();
var month = (now.getMonth() + 1);               
var day = now.getDate();
if (month < 10) 
    month = "0" + month;
if (day < 10) 
    day = "0" + day;
var today = now.getFullYear() + '-' + month + '-' + day;
document.getElementById('end').value = today;

fetchStock();