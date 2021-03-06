'use strict';

// check if brewery has all fields required
var handleBrewery = function handleBrewery(e) {
    e.preventDefault();

    $('#beerMessage').animate({ height: 'hide' }, 350);

    if ($('#breweryName').val() == '' || $('#breweryAddress').val() == '' || $('#breweryLink').val() == '' || $('#breweryNotes').val() == '') {
        handleError('All fields are required');
        return false;
    }

    sendAjax('POST', $('#breweryForm').attr('action'), $('#breweryForm').serialize(), function () {
        loadBreweriesFromServer();
    });

    return false;
};

// delete beer by id
// reload after to update displayed beers
var deleteBrewery = function deleteBrewery(e) {
    var id = e.target.parentElement.querySelector('.breweryId').innerText;
    var _csrf = document.querySelector('input[name="_csrf"]').value;

    sendAjax('DELETE', '/deleteBrewery', { id: id, _csrf: _csrf }, function (data) {
        loadBreweriesFromServer();
    });
};

// search for a brewery by name
// reload displayed breweries to clear and only display searched
var searchBrewery = function searchBrewery(e) {
    e.preventDefault();
    $('#beerMessage').animate({ height: 'hide' }, 350);

    if ($('#searchBrewery').val() == '') {
        handleError('Name is required for search');
        return false;
    }

    var search = e.target.parentElement.querySelector('#searchBrewery').value;

    sendAjax('GET', '/searchBrewery', { search: search }, function (data) {
        ReactDOM.render(React.createElement(BreweryList, { breweries: data.breweries }), document.querySelector('#breweries'));
    });
};

// create brewery form inside of a modal
var BreweryForm = function BreweryForm(props) {
    return React.createElement(
        'div',
        null,
        React.createElement(
            'h1',
            { id: 'makerTitle' },
            'Breweries'
        ),
        React.createElement(
            'form',
            {
                id: 'searchBreweryForm',
                onSubmit: searchBrewery,
                name: 'searchForm',
                action: '/searchBrewery',
                method: 'POST',
                className: 'searchBreweryForm' },
            React.createElement(
                'label',
                { htmlFor: 'search' },
                'Name: '
            ),
            React.createElement('input', { id: 'searchBrewery', type: 'text', name: 'search', placeholder: 'Search' }),
            React.createElement('input', { className: 'searchBrewerySubmit', type: 'submit', value: 'Search' })
        ),
        React.createElement(
            'button',
            { id: 'newBreweryBtn' },
            'New Brewery'
        ),
        React.createElement(
            'div',
            { id: 'newBreweryWindow', className: 'breweryWindow' },
            React.createElement(
                'div',
                { className: 'newBreweryContent' },
                React.createElement(
                    'form',
                    { id: 'breweryForm',
                        onSubmit: handleBrewery,
                        name: 'breweryForm',
                        action: '/breweries',
                        method: 'POST',
                        className: 'breweryForm' },
                    React.createElement(
                        'span',
                        { className: 'close' },
                        '\xD7'
                    ),
                    React.createElement(
                        'label',
                        { htmlFor: 'name' },
                        'Name: '
                    ),
                    React.createElement('input', { id: 'breweryName', type: 'text', name: 'name', placeholder: 'Brewery Name' }),
                    React.createElement(
                        'label',
                        { htmlFor: 'address' },
                        'Address: '
                    ),
                    React.createElement('input', { id: 'breweryAddress', type: 'text', name: 'address', placeholder: 'Address' }),
                    React.createElement(
                        'label',
                        { htmlFor: 'link' },
                        'Link: '
                    ),
                    React.createElement('input', { id: 'breweryLink', type: 'text', name: 'link', placeholder: 'Link' }),
                    React.createElement(
                        'label',
                        { htmlFor: 'notes' },
                        'Notes: '
                    ),
                    React.createElement('input', { id: 'breweryNotes', type: 'text', name: 'notes', placeholder: 'Notes' }),
                    React.createElement(
                        'label',
                        { htmlFor: 'rating' },
                        'Rating: '
                    ),
                    React.createElement(
                        'div',
                        { className: 'ratingSelect' },
                        React.createElement(
                            'select',
                            { id: 'breweryRating', name: 'rating' },
                            React.createElement(
                                'option',
                                { value: '1' },
                                '1'
                            ),
                            React.createElement(
                                'option',
                                { value: '2' },
                                '2'
                            ),
                            React.createElement(
                                'option',
                                { value: '3' },
                                '3'
                            ),
                            React.createElement(
                                'option',
                                { value: '4' },
                                '4'
                            ),
                            React.createElement(
                                'option',
                                { value: '5' },
                                '5'
                            )
                        )
                    ),
                    React.createElement('input', { type: 'hidden', name: '_csrf', value: props.csrf }),
                    React.createElement('input', { className: 'makeBrewerySubmit', type: 'submit', value: 'Log Brewery' })
                )
            )
        )
    );
};

// create list of breweries
// if no breweries, create simple h3 saying no data
var BreweryList = function BreweryList(props) {
    if (props.breweries.length === 0) {
        return React.createElement(
            'div',
            { className: 'breweriesList' },
            React.createElement(
                'h3',
                { className: 'emptyBrewery' },
                'No Breweries Logged...Yet'
            )
        );
    }

    var breweryNodes = props.breweries.sort(function (a, b) {
        return a.name.localeCompare(b.name);
    }).map(function (brew) {
        return React.createElement(
            'div',
            { key: brew._id, className: 'brewery' },
            React.createElement('img', { src: '/assets/img/brew.png', alt: 'brewery', className: 'breweryDefaultIcon' }),
            React.createElement(
                'button',
                { className: 'deleteBrewery', onClick: deleteBrewery },
                '\xD7'
            ),
            React.createElement(
                'h3',
                { className: 'breweryName' },
                ' ',
                brew.name,
                ' '
            ),
            React.createElement(
                'div',
                { className: 'breweryGroup1' },
                React.createElement(
                    'p',
                    { className: 'breweryAddress' },
                    ' ',
                    React.createElement(
                        'strong',
                        null,
                        'Address:'
                    ),
                    ' ',
                    brew.address,
                    ' '
                ),
                React.createElement(
                    'p',
                    { className: 'breweryLink' },
                    ' ',
                    React.createElement(
                        'strong',
                        null,
                        'Link: '
                    ),
                    React.createElement(
                        'a',
                        { href: brew.link },
                        brew.link
                    ),
                    ' '
                )
            ),
            React.createElement(
                'div',
                { className: 'breweryGroup2' },
                React.createElement(
                    'p',
                    { className: 'breweryNotes' },
                    ' ',
                    React.createElement(
                        'strong',
                        null,
                        'Notes:'
                    ),
                    ' ',
                    brew.notes,
                    ' '
                ),
                React.createElement(
                    'p',
                    { className: 'breweryRating' },
                    ' ',
                    React.createElement(
                        'strong',
                        null,
                        'Rating:'
                    ),
                    ' ',
                    brew.rating,
                    '/5 '
                )
            ),
            React.createElement(
                'span',
                { className: 'breweryId' },
                brew._id
            )
        );
    });

    return React.createElement(
        'div',
        { className: 'breweryList' },
        breweryNodes,
        React.createElement(
            'p',
            { className: 'totalCount' },
            props.breweries.length,
            ' breweries'
        )
    );
};

// load in breweries from server
// place them in center of page
var loadBreweriesFromServer = function loadBreweriesFromServer() {
    sendAjax('GET', '/getBreweries', null, function (data) {
        ReactDOM.render(React.createElement(BreweryList, { breweries: data.breweries }), document.querySelector('#breweries'));
    });
};

// handle new brewery button (create modal)
var logNewBrewery = function logNewBrewery() {
    var modal = document.getElementById("newBreweryWindow");
    var btn = document.getElementById("newBreweryBtn");
    var span = document.getElementsByClassName("close")[0];

    btn.onclick = function () {
        modal.style.display = "block";
    };

    span.onclick = function () {
        modal.style.display = "none";
    };

    // if user clicks outside the modal, close
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    };
};

// render main page view of breweries
// load in all functions required to handle clicks for new views
var setupBrew = function setupBrew(csrf) {
    if (document.querySelector('#makeBrewery')) {
        ReactDOM.render(React.createElement(BreweryForm, { csrf: csrf }), document.querySelector('#makeBrewery'));
        ReactDOM.render(React.createElement(BreweryList, { breweries: [] }), document.querySelector('#breweries'));

        loadBreweriesFromServer();
        logNewBrewery();
        handleRecipesClick();
        handlePairingsClick();
        handleUpgradeClick();
        handleChangePasswordClick(csrf);
    }
};

// get csrf token
var getBrewToken = function getBrewToken() {
    sendAjax('GET', '/getToken', null, function (result) {
        setupBrew(result.csrfToken);
    });
};

// instantiate above
$(document).ready(function () {
    getBrewToken();
});
'use strict';

// check if user has entered values into all fields
// check if values are valid (match, etc)
// return error messages if not correct
// return success message if all requirements met
var handlePasswordChange = function handlePasswordChange(e) {
    e.preventDefault();

    $('#beerMessage').animate({ width: 'hide' }, 350);

    if ($('currPass').val() == '' || $('#newPass').val() == '' || $('#newPass2').val() == '') {
        handleError('All fields required');
        return false;
    }

    if ($('#newPass').val() !== $('#newPass2').val()) {
        handleError('Passwords do no match');
        return false;
    }

    sendAjax('POST', '/changePassword', $('#changePassForm').serialize(), function () {
        handleError('Password changed');
    });

    return false;
};

// create change password form with current pass, new pass, confirm new pass
var ChangePassword = function ChangePassword(props) {
    return React.createElement(
        'form',
        { id: 'changePassForm', name: 'changePassForm', action: 'changePassword', onSubmit: handlePasswordChange, method: 'POST' },
        React.createElement(
            'label',
            { htmlFor: 'currPass' },
            ' Current Password: '
        ),
        React.createElement('input', { id: 'currPass', type: 'password', name: 'currPass', placeholder: 'current password' }),
        React.createElement(
            'label',
            { htmlFor: 'newPass' },
            ' New Password: '
        ),
        React.createElement('input', { id: 'newPass', type: 'password', name: 'newPass', placeholder: 'new password' }),
        React.createElement(
            'label',
            { htmlFor: 'newPass2' },
            ' Confirm New Password: '
        ),
        React.createElement('input', { id: 'newPass2', type: 'password', name: 'newPass2', placeholder: 'confirm new pass' }),
        React.createElement('input', { type: 'hidden', name: '_csrf', value: props.csrf, placeholder: props.csrf }),
        React.createElement('input', { className: 'submitForm', type: 'submit', value: 'Change' })
    );
};

// create change pass page title
var PassTitle = function PassTitle(props) {
    return React.createElement(
        'h2',
        { id: 'changePassTitle' },
        'Settings'
    );
};

// place new title on top of page, below nav bar
var createPassTitle = function createPassTitle() {
    if (document.querySelector('#makeBeer')) {
        ReactDOM.render(React.createElement(PassTitle, null), document.querySelector('#makeBeer'));
    } else {
        ReactDOM.render(React.createElement(PassTitle, null), document.querySelector('#makeBrewery'));
    }
};

// create pass form in main center of page
var createChangePasswordForm = function createChangePasswordForm(csrf) {
    if (document.querySelector('#beers')) {
        ReactDOM.render(React.createElement(ChangePassword, { csrf: csrf }), document.querySelector('#beers'));
    } else {
        ReactDOM.render(React.createElement(ChangePassword, { csrf: csrf }), document.querySelector('#breweries'));
    }
};

// create total view
var createChangePasswordView = function createChangePasswordView(csrf) {
    createPassTitle();
    createChangePasswordForm(csrf);
};

// when gear icon clicked, create view
var handleChangePasswordClick = function handleChangePasswordClick(csrf) {
    var changePass = document.querySelector('#changePassword');

    changePass.addEventListener('click', function (e) {
        e.preventDefault();
        createChangePasswordView(csrf);
    });
};
'use strict';

// check if all fields have values
// if not, return proper error message
// if there are beers, load them in
var handleBeer = function handleBeer(e) {
    e.preventDefault();

    $('#beerMessage').animate({ height: 'hide' }, 350);

    if ($('#beerName').val() == '' || $('#beerBrewer').val() == '' || $('#beerType').val() == '' || $('#beerABV').val() == '' || $('#beerIBU').val() == '' || $('#beerNotes').val() == '') {
        handleError('All fields are required');
        return false;
    }

    sendAjax('POST', $('#beerForm').attr('action'), $('#beerForm').serialize(), function () {
        loadBeersFromServer();
    });

    return false;
};

// delete a beer by id
// reload beers to update view
var deleteBeer = function deleteBeer(e) {
    var id = e.target.parentElement.querySelector('.beerId').innerText;
    var _csrf = document.querySelector('input[name="_csrf"]').value;

    sendAjax('DELETE', '/deleteBeer', { id: id, _csrf: _csrf }, function (data) {
        loadBeersFromServer();
    });
};

// search for a beer
// reload displayed beers
var searchBeer = function searchBeer(e) {
    e.preventDefault();
    $('#beerMessage').animate({ height: 'hide' }, 350);

    if ($('#searchBeer').val() == '') {
        handleError('Name is required for search');
        return false;
    }

    var search = e.target.parentElement.querySelector('#searchBeer').value;

    sendAjax('GET', '/searchBeer', { search: search }, function (data) {
        ReactDOM.render(React.createElement(BeerList, { beers: data.beers }), document.querySelector('#beers'));
    });
};

// create beer form inside of a modal
var BeerForm = function BeerForm(props) {
    return React.createElement(
        'div',
        null,
        React.createElement(
            'h1',
            { id: 'makerTitle' },
            'Beers'
        ),
        React.createElement(
            'form',
            {
                id: 'searchBeerForm',
                onSubmit: searchBeer,
                name: 'searchForm',
                action: '/searchBeer',
                method: 'POST',
                className: 'searchBeerForm' },
            React.createElement(
                'label',
                { htmlFor: 'search' },
                'Name: '
            ),
            React.createElement('input', { id: 'searchBeer', type: 'text', name: 'search', placeholder: 'Search' }),
            React.createElement('input', { className: 'searchBeerSubmit', type: 'submit', value: 'Search' })
        ),
        React.createElement(
            'button',
            { id: 'newBeerBtn' },
            'New Beer'
        ),
        React.createElement(
            'div',
            { id: 'newBeerWindow', className: 'beerWindow' },
            React.createElement(
                'div',
                { className: 'newBeerContent' },
                React.createElement(
                    'form',
                    { id: 'beerForm',
                        onSubmit: handleBeer,
                        name: 'beerForm',
                        action: '/maker',
                        method: 'POST',
                        className: 'beerForm' },
                    React.createElement(
                        'span',
                        { className: 'close' },
                        '\xD7'
                    ),
                    React.createElement(
                        'label',
                        { htmlFor: 'name' },
                        'Name: '
                    ),
                    React.createElement('input', { id: 'beerName', type: 'text', name: 'name', placeholder: 'Beer Name' }),
                    React.createElement(
                        'label',
                        { htmlFor: 'brewer' },
                        'Brewer: '
                    ),
                    React.createElement('input', { id: 'beerBrewer', type: 'text', name: 'brewer', placeholder: 'Brewer' }),
                    React.createElement(
                        'label',
                        { htmlFor: 'type' },
                        'Type: '
                    ),
                    React.createElement('input', { id: 'beerType', type: 'text', name: 'type', placeholder: 'Type' }),
                    React.createElement(
                        'label',
                        { htmlFor: 'abv' },
                        'ABV: '
                    ),
                    React.createElement('input', { id: 'beerABV', type: 'text', name: 'abv', placeholder: 'ABV' }),
                    React.createElement(
                        'label',
                        { htmlFor: 'ibu' },
                        'IBU: '
                    ),
                    React.createElement('input', { id: 'beerIBU', type: 'text', name: 'ibu', placeholder: 'IBU' }),
                    React.createElement(
                        'label',
                        { htmlFor: 'notes' },
                        'Notes: '
                    ),
                    React.createElement('input', { id: 'beerNotes', type: 'text', name: 'notes', placeholder: 'Notes' }),
                    React.createElement(
                        'label',
                        { htmlFor: 'rating' },
                        'Rating: '
                    ),
                    React.createElement(
                        'div',
                        { className: 'ratingSelect' },
                        React.createElement(
                            'select',
                            { id: 'beerRating', name: 'rating' },
                            React.createElement(
                                'option',
                                { value: '1' },
                                '1'
                            ),
                            React.createElement(
                                'option',
                                { value: '2' },
                                '2'
                            ),
                            React.createElement(
                                'option',
                                { value: '3' },
                                '3'
                            ),
                            React.createElement(
                                'option',
                                { value: '4' },
                                '4'
                            ),
                            React.createElement(
                                'option',
                                { value: '5' },
                                '5'
                            )
                        )
                    ),
                    React.createElement('input', { type: 'hidden', name: '_csrf', value: props.csrf }),
                    React.createElement('input', { className: 'makeBeerSubmit', type: 'submit', value: 'Log Beer' })
                )
            )
        )
    );
};

// create list of beers
// if no beers, create simple h3 saying no data
var BeerList = function BeerList(props) {
    if (props.beers.length === 0) {
        return React.createElement(
            'div',
            { className: 'beersList' },
            React.createElement(
                'h3',
                { className: 'emptyBeer' },
                'No Beers Yet'
            )
        );
    }

    var beerNodes = props.beers.sort(function (a, b) {
        return a.name.localeCompare(b.name);
    }).map(function (beer) {
        return React.createElement(
            'div',
            { key: beer._id, className: 'beer' },
            React.createElement('img', { src: '/assets/img/beerIcon.png', alt: 'beer face', className: 'beerDefaultIcon' }),
            React.createElement(
                'button',
                { className: 'deleteBeer', onClick: deleteBeer },
                '\xD7'
            ),
            React.createElement(
                'h3',
                { className: 'beerName' },
                ' ',
                beer.name,
                ' '
            ),
            React.createElement(
                'div',
                { className: 'beerGroup1' },
                React.createElement(
                    'p',
                    { className: 'beerBrewer' },
                    ' ',
                    React.createElement(
                        'strong',
                        null,
                        'Brewer:'
                    ),
                    ' ',
                    beer.brewer,
                    ' '
                ),
                React.createElement(
                    'p',
                    { className: 'beerType' },
                    ' ',
                    React.createElement(
                        'strong',
                        null,
                        'Type:'
                    ),
                    ' ',
                    beer.type,
                    ' '
                ),
                React.createElement(
                    'p',
                    { className: 'beerABV' },
                    ' ',
                    React.createElement(
                        'strong',
                        null,
                        'ABV:'
                    ),
                    ' ',
                    beer.abv,
                    ' '
                )
            ),
            React.createElement(
                'div',
                { className: 'beerGroup2' },
                React.createElement(
                    'p',
                    { className: 'beerIBU' },
                    ' ',
                    React.createElement(
                        'strong',
                        null,
                        'IBU:'
                    ),
                    ' ',
                    beer.ibu,
                    ' '
                ),
                React.createElement(
                    'p',
                    { className: 'beerNotes' },
                    ' ',
                    React.createElement(
                        'strong',
                        null,
                        'Type:'
                    ),
                    ' ',
                    beer.notes,
                    ' '
                ),
                React.createElement(
                    'p',
                    { className: 'beerRating' },
                    ' ',
                    React.createElement(
                        'strong',
                        null,
                        'Rating:'
                    ),
                    ' ',
                    beer.rating,
                    '/5 '
                )
            ),
            React.createElement(
                'span',
                { className: 'beerId' },
                beer._id
            )
        );
    });

    return React.createElement(
        'div',
        { className: 'beerList' },
        beerNodes,
        React.createElement(
            'p',
            { className: 'totalCount' },
            props.beers.length,
            ' beers'
        )
    );
};

// load in beers from server
// place them in center of page
var loadBeersFromServer = function loadBeersFromServer() {
    sendAjax('GET', '/getBeers', null, function (data) {
        ReactDOM.render(React.createElement(BeerList, { beers: data.beers }), document.querySelector('#beers'));
    });
};

// handle new beer button (create modal)
var logNewBeer = function logNewBeer() {
    var modal = document.getElementById("newBeerWindow");
    var btn = document.getElementById("newBeerBtn");
    var span = document.getElementsByClassName("close")[0];

    btn.onclick = function () {
        modal.style.display = "block";
    };

    span.onclick = function () {
        modal.style.display = "none";
    };

    // if user clicks outside the modal, close
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    };
};

// render main page view of beers
// load in all functions required to handle clicks for new views
var setup = function setup(csrf) {
    if (document.querySelector('#makeBeer')) {
        ReactDOM.render(React.createElement(BeerForm, { csrf: csrf }), document.querySelector('#makeBeer'));

        ReactDOM.render(React.createElement(BeerList, { beers: [] }), document.querySelector('#beers'));

        loadBeersFromServer();
        logNewBeer();
        handleRecipesClick();
        handlePairingsClick();
        handleUpgradeClick();
        handleChangePasswordClick(csrf);
    }
};

// get csrf token
var getToken = function getToken() {
    sendAjax('GET', '/getToken', null, function (result) {
        setup(result.csrfToken);
    });
};

// instantiate above
$(document).ready(function () {
    getToken();
});
'use strict';

// safety check that pairings exist/are loaded
// create pairings list
var PairingsContainer = function PairingsContainer(props) {
    $('#beerMessage').animate({ width: 'hide' }, 350);

    if (props.pairs.length === 0) {
        return React.createElement(
            'div',
            null,
            'No pairs...yet!'
        );
    }
    var pairsList = props.pairs.map(function (pair) {
        return React.createElement(
            'div',
            { className: 'pairing', key: pair.beer },
            React.createElement('img', { src: pair.image, className: 'pairImg' }),
            React.createElement(
                'p',
                { id: 'pairTitle' },
                React.createElement(
                    'strong',
                    null,
                    pair.beer
                ),
                ' pair well with ',
                pair.food
            ),
            React.createElement(
                'p',
                { id: 'subtext' },
                pair.about
            )
        );
    });
    return React.createElement(
        'div',
        null,
        pairsList
    );
};

// load in pairings from server
var loadPairsFromServer = function loadPairsFromServer() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/getPairs');

    var setPairs = function setPairs() {
        var pairResponse = JSON.parse(xhr.response);

        if (document.getElementById('beers')) {
            ReactDOM.render(React.createElement(PairingsContainer, { pairs: pairResponse }), document.getElementById('beers'));
        } else {
            ReactDOM.render(React.createElement(PairingsContainer, { pairs: pairResponse }), document.getElementById('breweries'));
        }
    };

    xhr.onload = setPairs;
    xhr.send();
};

// create title for pairings page to replace new beer button
var PairingsTitle = function PairingsTitle(props) {
    return React.createElement(
        'h2',
        { id: 'pairingsTitle' },
        'Food-Beer Pairings'
    );
};

// create title at top of page, below nav
var createPairingsTitle = function createPairingsTitle() {
    if (document.querySelector('#makeBeer')) {
        ReactDOM.render(React.createElement(PairingsTitle, null), document.querySelector('#makeBeer'));
    } else {
        ReactDOM.render(React.createElement(PairingsTitle, null), document.querySelector('#makeBrewery'));
    }
};

// actually create pairings in center of page
var createPairingContainer = function createPairingContainer() {
    if (document.getElementById('beers')) {
        ReactDOM.render(React.createElement(PairingsContainer, { pairs: [] }), document.getElementById('beers'));
    } else {
        ReactDOM.render(React.createElement(PairingsContainer, { pairs: [] }), document.getElementById('breweries'));
    }

    loadPairsFromServer();
};

// create total pairings view (call both needed functions)
var createPairingsView = function createPairingsView() {
    createPairingsTitle();
    createPairingContainer();
};

// when drink and burger icon clicked, create view
var handlePairingsClick = function handlePairingsClick() {
    var changePass = document.querySelector('#pairings');

    changePass.addEventListener('click', function (e) {
        e.preventDefault();
        createPairingsView();
    });
};
'use strict';

// safety check recipes exist or are loaded
// create individual recipe cards
var RecipesContainer = function RecipesContainer(props) {
    $('#beerMessage').animate({ width: 'hide' }, 350);

    if (props.recipes.length === 0) {
        return React.createElement(
            'div',
            null,
            'No recipes...yet!'
        );
    }
    var recipesList = props.recipes.map(function (recipe) {
        return React.createElement(
            'div',
            { className: 'recipe', key: recipe.name },
            React.createElement('img', { src: recipe.image, className: 'recipeImg' }),
            React.createElement(
                'h4',
                null,
                React.createElement(
                    'a',
                    { href: recipe.link },
                    recipe.name
                )
            ),
            React.createElement(
                'p',
                null,
                recipe.description
            )
        );
    });
    return React.createElement(
        'div',
        null,
        recipesList
    );
};

// load in recipes from server
var loadRecipesFromServer = function loadRecipesFromServer() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/getRecipes');

    var setRecipes = function setRecipes() {
        var recipesResponse = JSON.parse(xhr.response);

        if (document.getElementById('beers')) {
            ReactDOM.render(React.createElement(RecipesContainer, { recipes: recipesResponse }), document.getElementById('beers'));
        } else {
            ReactDOM.render(React.createElement(RecipesContainer, { recipes: recipesResponse }), document.getElementById('breweries'));
        }
    };

    xhr.onload = setRecipes;
    xhr.send();
};

// create header title for view
var RecipesTitle = function RecipesTitle(props) {
    return React.createElement(
        'h2',
        { id: 'recipesTitle' },
        'Beer-Based Recipes'
    );
};

// place title in center top of page, below nav bar
var createRecipesTitle = function createRecipesTitle() {
    if (document.querySelector('#makeBeer')) {
        ReactDOM.render(React.createElement(RecipesTitle, null), document.querySelector('#makeBeer'));
    } else {
        ReactDOM.render(React.createElement(RecipesTitle, null), document.querySelector('#makeBrewery'));
    }
};

// create recipes in center of page
var createRecipesContainer = function createRecipesContainer() {
    if (document.getElementById('beers')) {
        ReactDOM.render(React.createElement(RecipesContainer, { recipes: [] }), document.getElementById('beers'));
    } else {
        ReactDOM.render(React.createElement(RecipesContainer, { recipes: [] }), document.getElementById('breweries'));
    }

    loadRecipesFromServer();
};

// call both functions for recipe view
var createRecipesView = function createRecipesView() {
    createRecipesTitle();
    createRecipesContainer();
};

// when chefs hat icon clicked, create view
var handleRecipesClick = function handleRecipesClick() {
    var changePass = document.querySelector('#recipes');

    changePass.addEventListener('click', function (e) {
        e.preventDefault();
        createRecipesView();
    });
};
'use strict';

// create upgrade page info
// hide error message for now
var UpgradeAccount = function UpgradeAccount(props) {
    $('#beerMessage').animate({ width: 'hide' }, 350);
    return React.createElement(
        'div',
        { id: 'upgradeContent' },
        React.createElement(
            'h3',
            null,
            'Upgrade your account for a larger inventory size. Keep track of up to 150 beers instead of the free 15!'
        ),
        React.createElement(
            'p',
            null,
            'For a one-time fee of $10 USD, you can increase your storage size so you never have to quelch your thirst for more beers! '
        ),
        React.createElement(
            'button',
            { className: 'upgradeButton' },
            'Upgrade'
        )
    );
};

// create title for upgrade page
var UpgradeTitle = function UpgradeTitle(props) {
    return React.createElement(
        'h2',
        { id: 'upgradeTitle' },
        'Upgrade Account'
    );
};

// place title for page in top center of view
var createUpgradeTitle = function createUpgradeTitle() {
    if (document.querySelector('#makeBeer')) {
        ReactDOM.render(React.createElement(UpgradeTitle, null), document.querySelector('#makeBeer'));
    } else {
        ReactDOM.render(React.createElement(UpgradeTitle, null), document.querySelector('#makeBrewery'));
    }
};

// create upgrade content in center of page
var createUpgradeAccountInfo = function createUpgradeAccountInfo() {
    if (document.querySelector('#beers')) {
        ReactDOM.render(React.createElement(UpgradeAccount, null), document.querySelector('#beers'));
    } else {
        ReactDOM.render(React.createElement(UpgradeAccount, null), document.querySelector('#breweries'));
    }
};

// call title and main info functions
var createUpgradeView = function createUpgradeView() {
    createUpgradeTitle();
    createUpgradeAccountInfo();
};

// create view when gear icon clicked
var handleUpgradeClick = function handleUpgradeClick() {
    var upgrade = document.querySelector('#upgrade');

    upgrade.addEventListener('click', function (e) {
        e.preventDefault();
        createUpgradeView();
    });
};
'use strict';

// helper function to create an error message with desired error text
var handleError = function handleError(message) {
    $('#errorMessage').text(message);
    $('#beerMessage').animate({ height: 'toggle' }, 350);
};

// redirect page and hide error
var redirect = function redirect(response) {
    $('#beerMessage').animate({ height: 'hide' }, 350);
    window.location = response.redirect;
};

// send ajax data and handle error
var sendAjax = function sendAjax(type, action, data, success) {
    $.ajax({
        cache: false,
        type: type,
        url: action,
        data: data,
        dataType: 'json',
        success: success,
        error: function error(xhr, status, _error) {
            var messageObj = JSON.parse(xhr.responseText);
            handleError(messageObj.error);
        }
    });
};
