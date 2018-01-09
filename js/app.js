/*
 * Create a list that holds all of your cards
 */
var cardLists = ["fa-diamond", "fa-paper-plane-o", "fa-anchor", "fa-bolt", "fa-cube", "fa-leaf", "fa-bicycle", "fa-bomb"];
var moves = 0; // to store number of moves
var match_found = 0;// to store number of matches
var game_started = false;// to indicate the state of the game
var openedCards = [];// keep track of current open cards
var timer = new Timer();// timer
timer.addEventListener('secondsUpdated', function (e) {$('#timer').text(timer.getTimeValues());});
var cnt = 3;//keep track of how many stars left
$('#reset-button').click(resetGame);//reset button
/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

// generate random cards on the game board
function generateCards(){
    for (var i = 0; i < 2; i++) {
      cardLists = shuffle(cardLists);
      cardLists.forEach(function (card){
        $('.deck').append(`<li class="card animated"><i class="fa ${card}"></i></li>`);
      });
    }
}

// check to see if the game is over
function checkWin(){
    if (match_found == 8) {
        showResults();
    }
}

// fliping cards open
function openCard(){
    if (game_started == false) {
      game_started = true;
      timer.start();
    }
    if (openedCards.length === 0) {
      $(this).toggleClass("show open").animateCss('flipInY');
      openedCards.push($(this));
      disableCLick();
    }
    else if (openedCards.length === 1){
      increaseMoves();
      $(this).toggleClass("show open").animateCss('flipInY');
      openedCards.push($(this));
      setTimeout(checkIfMatch,1000);}
}

// when matching, keep the cards open
function lockCards(){
    openedCards[0].addClass("match").animateCss('pulse');
    openedCards[1].addClass("match").animateCss('pulse');
    openedCards = [];
    match_found += 1;
}

// when not matching, close the cards
function closeCards(){
    openedCards[0].toggleClass("show open").animateCss('flipInY');
    openedCards[1].toggleClass("show open").animateCss('flipInY');
    openedCards[0].click(openCard);
    openedCards = [];
}

// fliping cards to see if they macth
function checkIfMatch() {
    if ($(openedCards[0]).find('i').attr('class') == $(openedCards[1]).find('i').attr('class')) {
      lockCards();
      disableCLick();
      setTimeout(checkWin, 1000);}
    else {
      closeCards();
      }
}

// disable click
function disableCLick() {
    openedCards.forEach(function (card) {
      card.off('click');});
}

// Begin playing the game
function playGame() {
    generateCards();
    $('.card').click(openCard);
    $('.moves').html("0 Moves");
    initiateStars();
}

// initiate 3 stars
function initiateStars() {
    for (var i = 0; i < 3; i++) {
          $('#stars').append('<li><i class="fa fa-star"></i></li>');
      }
}

// increase the number of stars
function increaseMoves() {
    moves += 1;
    $('.moves').html(`${moves} Moves`);
    if (moves == 18 || moves == 25) {
        decreaseStar();
    }
}

// decrease the number of stars
function decreaseStar() {
    $('#stars li:first-child').remove();
    cnt -= 1;
    $('#stars').append('<li><i class="fa fa-star-o"></i></li>');
}

// reset the game
function resetGame() {
    moves = 0;
    match_found = 0;
    $('.deck').empty();
    $('#stars').empty();
    timer.stop();
    $('#timer').html("00:00:00");
    game_started=false;
    playGame();
}

// reset the game when the game is over
function resetGame2(){
    location.reload();
}
/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
// add animations
 $.fn.extend({
    animateCss: function (animationName) {
        var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
        this.addClass(animationName).one(animationEnd, function () {
            $(this).removeClass(animationName);
        });
        return this;
    }
});

// Congratulations Popup when game is over
function showResults() {
    timer.pause();
    for (var i = 0; i < cnt; i++) {
      $('div.result div.stars').append('<span class="fa fa-star"></span>');
    }
    $('#finalTime').text(timer.getTimeValues());
    $('#reset-button-win').click(resetGame2);
    $('#resultBoard').show();
}

//star the game
playGame();
