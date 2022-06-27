function fetchStock() {
    var ticker = 'TSLA';
    var start = '2019-01-01'; 
    var end = '2020-01-01'; 

    let API_Call = 'https://api.twelvedata.com/time_series?apikey=f0c7938caae54260b8421dfb9b9d3093&interval=1day&symbol=' + ticker +'&country=US&type=stock&format=JSON&start_date=' + start + '&end_date=' + end;

    console.log(API_Call);

    fetch(API_Call)
        .then(
            function(response) {
                return response.json();
            }
        )
        .then(
            function(data) {
                // Strategy 1: Invest and Leave it there
                var description = "_______ is a beginner investor and decides to invest his money and leave it.\n\n";

                var initial_investment_1 = 12000;
                description += "Starting Amount: " + initial_investment_1 + "\n";

                var value = data['values'];

                var dict = {}

                console.log(data);

                length = value.length - 1

                end_price = value[0]['close'];
                open_price = value[length]['open'];
                open_date = value[length]['datetime'];

                dict[open_date] = open_price;
                description += "He bought " + Object.keys(dict).length + " time(s). \n"
                

                stock_gain = end_price - open_price;
                percent_gain = stock_gain / open_price;

                final_amount = initial_investment_1 * (1 + percent_gain);

                description += "Final Amount: " + final_amount + "\n";
                description += "Overall Percent Gain/Loss: " + percent_gain;

                console.log(final_amount);
                console.log(dict);
                console.log(description);

                // Strategy 2: Invest 1,000 if stock drops by 5% previous
                var description = "_______ is an intermediate investor and decides to invest his money whenever the stock price drops by 5%.\n\n";
                
                var initial_investment_2 = 12000;
                description += "Starting Amount: " + initial_investment_2 + "\n";

                var investment_amount = 1000;
                description += "Invest Amount Every Drop: " + investment_amount + "\n";

                var amount_in_investments = 0;
                var value = data['values'];

                buy_values = {};
                
                length = value.length - 1;

                for (let i = length-1; i > 0; i--) {
                    // console.log(i + ':' + value[i]['datetime'] + ' ' + value[i]['open'])
                    if ((value[i-1]['open'] - value[i]['close']) / value[i]['close'] <= -0.05) {
                        // if she has nothing in the bank, break out of the loop
                        if (initial_investment_2 == 0) {
                            break
                        }
                        // buy $1000 worth of stock at that time
                        initial_investment_2 -= investment_amount;

                        // add how much she invested into a variable
                        amount_in_investments += investment_amount;

                        // add the price of the stock AT THE TIME to a list
                        buy_values[value[i]['datetime']] = value[i]['open'];
                    }
                }
                // today's
                end_price = value[0]['close'];

                description += "He bought " + Object.keys(buy_values).length + " time(s). \n"

                // calculate how much we have earned on our investments
                investment_gain = 0;
                for (var key in buy_values) {
                    investment_gain += ((end_price - buy_values[key]) / buy_values[key]) * investment_amount;
                }
                
                // add how much in savings, how much in investments initially, how much we have gained from investment
                final_amount = initial_investment_2 + amount_in_investments + investment_gain;
                console.log(final_amount);
                console.log(buy_values);

                percent_gain = ((final_amount - initial_investment_2) / initial_investment_2)

                description += "Final Amount: " + final_amount + "\n";
                description += "Overall Percent Gain/Loss: " + percent_gain;
                console.log(description);

                console.log('-------------------------------------');

                // Strategy 3: Dollar Cost Averaging - Invest $1,000 every month
                var description = "_______ is an intermediate investor and decides to dollar-cost-average his money.\n\n";

                var starting = 12000;
                var initial_investment_3 = 12000;
                description += "Starting Amount: " + initial_investment_3 + "\n";

                var investment_amount = 1000;
                description += "Dollar Cost Average Amount: " + investment_amount + "\n";

                var amount_in_investments = 0;
                var value = data['values'];

                buy_values = {};
                
                length = value.length - 1;

                prev_month = '-1';
                for (let i = length; i > -1; i--) {
                    // buy at start of every month
                    curr_month = value[i]['datetime'].slice(5, 7);
                    if (prev_month != curr_month) {
                        buy_values[value[i]['datetime']] = (value[i]['open']);
                        initial_investment_3 -= investment_amount;
                        amount_in_investments += investment_amount;

                        prev_month = curr_month;
                    }
                }
                // today's
                end_price = value[0]['close'];

                description += "He bought " + Object.keys(buy_values).length + " time(s). \n"

                // calculate how much we have earned on our investments
                investment_gain = 0;
                for (var key in buy_values) {
                    investment_gain += ((end_price - buy_values[key]) / buy_values[key]) * investment_amount;
                }

                // add how much in savings, how much in investments initially, how much we have gained from investment
                final_amount = initial_investment_3 + amount_in_investments + investment_gain;
                console.log(buy_values);
                console.log(final_amount);

                percent_gain = ((final_amount - starting) / starting);

                description += "Final Amount: " + final_amount + "\n";
                description += "Overall Percent Gain/Loss: " + percent_gain;
                console.log(description);

                console.log('-------------------------------------');

                // Strategy 4: buy 12,000 at beginning
                // if stock drops below 8%, sell half of stock
                // re-invest sold amount if it recovers to when she sold it

                var portfolio = 12000
                var sold_amount = 0;

                var value = data['values'];
                length = value.length - 1;

                buy_values = [];
                buy_values.push(value[length]['open']);

                for (let i = length; i > 0; i--) {
                    // update port
                    today_percent_gain = ((value[i-1]['open'] - value[i]['close']) / value[i]['close']);
                    portfolio += portfolio * today_percent_gain;

                   
                    // dip by 8%
                    if ((value[i-1]['open'] - value[i]['close']) / value[i]['close'] <= -0.08) {
                        console.log(i, today_percent_gain, portfolio);

                    }


                }

                console.log(portfolio, sold_amount);



                


            }
        )








}
fetchStock()