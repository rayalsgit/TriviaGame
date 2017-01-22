$(document).ready(function() {

    // object to store game details	
    var game = {

        quizList: [{
            "question": "Rap was just becoming well known in the 90s. Which artist had the first number one rap single?",
            "res": 0,
            "answers": [
                " Vanilla Ice", "DJ Jazzy Jeff and the Fresh Prince", "MC Hammer", "Kriss Kross"
            ]
        }, {
            "question": "Novelty children shows were also a big hit. Which 90s TV show features characters with the name Tommy, Zack, Kimberly, Billy, and Trini?",
            "res": 1,
            "answers": [
                "Saved By the Bell", "The Mighty Morphin Power Rangers", "Beverly Hills 90210", "All That"
            ]
        }, {
            "question": "Which famous girl group of the 90s sung the theme song to the hit sketch comedy TV show All That?",
            "res": 1,
            "answers": [
                "Destiny's Child", "TLC", "Envogue", "3LW"
            ]
        }, {
            "question": "Which record company had huge success in the 90s with artists such as the Notorious BIG, Mase, and Total?",
            "res": 3,
            "answers": [
                "Motown", "Death Row", "Murder Inc", "Bad Boy"
            ]
        }, {
            "question": "Teenybopper pop was big in the late 90s. Which teen pop idol was NOT in the Mickey Mouse Club?",
            "res": 3,
            "answers": [
                "Britney Spears", "Justin Timberlake", "JC Chasez", "Jessica Simpson"
            ]
        }, {
            "question": "Clueless was a cult hit in the 90s. Which cast member of Clueless was NOT featured in the Clueless TV series?",
            "res": 1,
            "answers": [
                "Stacey Dash", "Alicia Silverstone", "Donald Faison", "Elisa Donovan"
            ]
        }, {
            "question": "Which NBA team did NOT win a championship in the 90s?",
            "res": 3,
            "answers": [
                "Houston Rockets", "San Antonio Spurs", "Detroit Pistons", "Los Angeles Lakers"
            ]
        }, {
            "question": "What group had the hit wonder in the 90s by the name of Lovefool?",
            "res": 3,
            "answers": [
                "The Corrs", "Chumbawumba", "Was Not Was", "The Cardigans"
            ]
        }, {
            "question": "These two best friends came together to write the Oscar winning movie, Good Will Hunting?",
            "res": 2,
            "answers": [
                "Jim Carey and Will Smith", "Ben Stiller and Owen Wilson", "Ben Affleck and Matt Damon", "Brad Pitt and George Clooney"
            ]
        }, {
            "question": "Which movie did NOT star actor Brad Pitt?",
            "res": 3,
            "answers": [
                "Se7en", "Twelve Monkeys", "Seven Years In Tibet", "28 Days"
            ]
        }, {
            "question": " Who sang the Star Spangled Banner at the Super Bowl XXV?",
            "res": 2,
            "answers": [
                "Tony braxton", "Celine Dion", "Whitney Houston", "Mariah Carey"
            ]
        }, {
            "question": "The 1990s was a golden age for modern Disney movies. Which Disney Movie did NOT debut in the 90s?",
            "res": 3,
            "answers": [
                "Beauty and the Beast", "Tarzan", "The Lion King", "Little Mermaid"
            ]
        }, {
            "question": "Country Music became very big in the 90s. Which country music star had a popular television show on PAX TV?",
            "res": 2,
            "answers": [
                "Faith Hill", "Shania Twain", "Billy Ray Cyrus", "Garth Brooks"
            ]
        }, ],

        wins: 0,
        losses: 0,
        currentQIdx: 0,
        counter: 0,
        timerem: 10,

        // reset the game object
        reset: function() {
            this.wins = 0;
            this.losses = 0;
            this.currentQIdx = 0;
            this.counter = 0;
            this.timerem = 10;
        }

    };

    var nIntervId;
    var nTimedOutTimer;

    function showTime() {
        $("#timeRem").text("Time Remaining: " + game.timerem + " seconds");
        game.timerem--;

    };


    function setNewQuestionText() {
        // get a random question to display
        game.counter++;
        game.currentQIdx = Math.floor(Math.random() * game.quizList.length);
        var curItem = game.quizList[game.currentQIdx];
        var qText = curItem.question;
        var c1 = curItem.answers[0];
        var c2 = curItem.answers[1];
        var c3 = curItem.answers[2];
        var c4 = curItem.answers[3];

        // show the new question on UI
        $("#currentQuestion").text(qText);
        $("#opt1").html(c1);
        $("#opt2").html(c2);
        $("#opt3").html(c3);
        $("#opt4").html(c4);
        // reset all radio btns
        $("input[name='optradio']").prop('checked', false);

        $("#newQuestion").toggle();
    };


    // event handler when a choice is made
    function answered(event) {
        // Don't refresh the page!
        event.preventDefault();
        // clearout the corresponding question's timer
        clearTimeout(nIntervId);
        clearInterval(nTimedOutTimer);

        // if success
        if (event.data === game.quizList[game.currentQIdx].res)
            showSuccess();
        else // otherwise    	
            showFail();
    };

    // unless its the last question, show the next one
    function showNewQuestion() {
        hideAll();
        if (game.counter === game.quizList.length) {
            // clear game timer
            clearTimeout(nIntervId);
            //clearTimeout(nTimedOutTimer);

            // show game over UI
            showGameOver();

        } else {

            game.timerem = 10;
            nTimedOutTimer = setInterval(showTime, 1000);
            setNewQuestionText();

            // start timer
            nIntervId = setTimeout(showRanOutOfTime, 10000);

        }
    };



    // show success UI
    function showSuccess() {
        game.wins++;

        hideAll();

        var ans = game.quizList[game.currentQIdx].answers[game.quizList[game.currentQIdx].res];

        var queryURL = "http://api.giphy.com/v1/gifs/search?q=" +
            ans + "&api_key=dc6zaTOxFJmzC&limit=1";

        $.ajax({
                url: queryURL,
                method: "GET"
            })
            .done(function(response) {
                var results = response.data;

                for (var i = 0; i < results.length; i++) {
                    var gifDiv = $("<div class='item'>");

                    var personImage = $("#rightImg");
                    personImage.attr("src", results[i].images.fixed_height.url);
                }
            });


        $("#correctAnswer").toggle();
        setTimeout(showNewQuestion, 3000);
    };

    // show fail UI
    function showFail() {
        game.losses++;

        hideAll();
        $("#wrongMsg").text("Wrong!");
        var ans = game.quizList[game.currentQIdx].answers[game.quizList[game.currentQIdx].res];
        $("#showAnswer").text("The correct answer was: " + ans);

        var queryURL = "http://api.giphy.com/v1/gifs/search?q=" +
            ans + "&api_key=dc6zaTOxFJmzC&limit=1";

        $.ajax({
                url: queryURL,
                method: "GET"
            })
            .done(function(response) {
                var results = response.data;

                for (var i = 0; i < results.length; i++) {
                    var gifDiv = $("<div class='item'>");

                    var personImage = $("#wrongImg");
                    personImage.attr("src", results[i].images.fixed_height.url);
                }
            });

        $("#wrongAnswer").toggle();

        //set timer
        setTimeout(showNewQuestion, 3000);
    };

    // show out of time UI
    function showRanOutOfTime() {
        game.losses++;
        hideAll();
        clearTimeout(nIntervId);
        clearInterval(nTimedOutTimer);

        $("#wrongMsg").text("You ran out of time!");
        var ans = game.quizList[game.currentQIdx].answers[game.quizList[game.currentQIdx].res];

        var queryURL = "http://api.giphy.com/v1/gifs/search?q=" +
            ans + "&api_key=dc6zaTOxFJmzC&limit=1";

        $.ajax({
                url: queryURL,
                method: "GET"
            })
            .done(function(response) {
                var results = response.data;

                for (var i = 0; i < results.length; i++) {
                    var gifDiv = $("<div class='item'>");

                    var personImage = $("#wrongImg");
                    personImage.attr("src", results[i].images.fixed_height.url);
                }
            });

        $("#showAnswer").text("The correct answer was: " + ans);
        $("#wrongAnswer").toggle();
        // set timer
        setTimeout(showNewQuestion, 3000);
    };

    // show game-over UI
    function showGameOver() {
        hideAll();
        $("#win").text("Wins: " + game.wins);
        $("#loss").text("Losses: " + game.losses);
        $("#finalTally").toggle();
    };

    // hide all UI controls
    function hideAll() {
        $("#startBtn").hide();
        $("#newQuestion").hide();
        $("#correctAnswer").hide();
        $("#wrongAnswer").hide();
        $("#finalTally").hide();

        var wImage = $("#wrongImg");
        wImage.attr("src", "");

        var rImage = $("#rightImg");
        rImage.attr("src", "");

    };

    // all the event handlers

    $("#opt1").on("click", 0, answered);

    $("#opt2").on("click", 1, answered);

    $("#opt3").on("click", 2, answered);

    $("#opt4").on("click", 3, answered);

    // Capture Start Button Click
    $("#startBtn").on("click", function() {
        // Don't refresh the page!
        event.preventDefault();

        hideAll();
        // show new question UI
        game.timerem = 10;
        setNewQuestionText();
        nTimedOutTimer = setInterval(showTime, 1000);

        //start timer
        nIntervId = setTimeout(showRanOutOfTime, 10000);

    });

    // Capture Restart Button Click
    $("#restartBtn").on("click", function() {
        // Don't refresh the page!
        event.preventDefault();

        // reset game object
        game.reset();

        hideAll();

        // rest ui to new question for the new game
        showNewQuestion();

    });

    //after page loads for first time
    hideAll();
    $("#startBtn").toggle();


});
