/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 6);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

var items_per_key = 10;

var get_chunk_info = function(global_index) {
	var chunk_number = Math.floor(global_index / items_per_key);
	return {
		number: chunk_number,
		index: global_index - chunk_number * items_per_key
	}
}

var get_deal_by_index = function(global_index, callback){
	var chunk_data = get_chunk_info(global_index);
    var chunk_name = 'deals_' + chunk_data.number.toString();
    chrome.storage.local.get(chunk_name, function(s_data) {
        var deals = s_data[chunk_name];
        callback(deals[chunk_data.index]);
    });
};

module.exports = {
	get_chunk_info: get_chunk_info,
	get_deal_by_index: get_deal_by_index,
	items_per_key: items_per_key
}



/***/ }),
/* 1 */,
/* 2 */,
/* 3 */
/***/ (function(module, exports) {

var default_deals = [
    {
        price: null,
        destination_name: "Сан-Марино, Италия",
        search_url: null,
        image_url: "img/san-marino.jpg"
    },
    {
        price: null,
        destination_name: "Шефшауэн, Марокко",
        search_url: null,
        image_url: "img/chefchaouen.jpg"
    },
    {
        price: null,
        destination_name: "Гонконг, Гонконг",
        search_url: null,
        image_url: "img/hong-kong.jpg"
    },
    {
        price: null,
        destination_name: "Амстердам, Нидерланды",
        search_url: null,
        image_url: "img/amsterdam.jpg"
    },
    {
        price: null,
        destination_name: "Мале, Мальдивская Республика",
        search_url: null,
        image_url: "img/male.jpg"
    },
    {
        price: null,
        destination_name: "Гальштат, Австрия",
        search_url: null,
        image_url: "img/hallstatt.jpg"
    }
];

module.exports = default_deals;

/***/ }),
/* 4 */,
/* 5 */,
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

var default_deals = __webpack_require__(3);
var storage = __webpack_require__(0)

var get_next_deal_index = function(callback) {
    chrome.storage.local.get({"next_deal_index": 0}, function(r) {
        var next_deal_index = r.next_deal_index;
        callback(next_deal_index)
    })
}

var use_default_deals = function(deals_length) {
    return deals_length == 0 || !navigator.onLine;
}

var get_next_deal = function(callback) {
    chrome.storage.local.get(['next_deal_index', 'deals_length'], function(data) {
        var next_deal_index = data.next_deal_index;
        if (use_default_deals(data.deals_length)) {
            // console.log('use_default_deals', default_deals[Math.floor(Math.random() * default_deals.length + 1) - 1]);
            callback(default_deals[Math.floor(Math.random() * default_deals.length + 1) - 1]);
        } else {
            storage.get_deal_by_index(next_deal_index, function(deal){
                // console.log('choose deal', deal);
                chrome.storage.local.set({"next_deal_index": (next_deal_index + 1) % data.deals_length});
                if(deal.destination_iata == document.getElementById('destination').getAttribute('data-iata')) {
                    get_next_deal(update_tab);
                    return;
                }
                chrome.storage.sync.get('settings', function(data){
                    if(data.settings && data.settings.hideCities) {
                        if(data.settings.hideCities[deal.destination_iata]) {
                            get_next_deal(update_tab);
                            return;
                        }
                    }
                    callback(deal);                   
                });
            })
        }
    });
};

var show = function (el) {
    el.classList.remove("hidden");
}

var hide = function (el) {
    el.classList.add("hidden");
}

var update_bg = function(deal, callback) {
    var place_container = document.getElementById('place_container'),
        img = new Image();
        img.onload = function() {
            // console.log("IMG loaded");
            callback();
        }
        place_container.setAttribute("style", "background-image:url(" + deal.image_url + ")");
        img.src = deal.image_url;
}

var update_price = function(deal) {
    var btn_container = document.querySelectorAll('.btn-container')[0],
        calendar_container = btn_container.querySelector('.prices-calendar-container'),
        btn = btn_container.querySelectorAll('.btn-price')[0],
        btn_price = btn.querySelectorAll('.btn-price-value')[0],
        btn_currency = btn.querySelector('.currency-symbol');
        // calendar_visible = false;

    hide(btn_container);

    if (deal.price) {
        btn_price.innerText = deal.price.toLocaleString('ru-RU', { maximumFractionDigits: 0 });
        get_currency(function(currency){
            btn_currency.innerHTML = currency[1];
        });
        btn.onclick = function(e) {
            e.stopPropagation();
            calendar_container.classList.toggle("prices-calendar-container--hidden");
            // if (calendar_visible) {
            //     calendar_visible = false;
            //     calendar_container.classList.add("prices-calendar-container--hidden");
            // } else {
            //     calendar_visible = true;
            //     calendar_container.classList.remove("prices-calendar-container--hidden");
            // }
        }
        show(btn_container);
    }
}

var update_origin = function(deal) {
    var origin_container = document.querySelectorAll('.origin-container')[0],
        origin = origin_container.querySelectorAll('.origin')[0];
    hide(origin_container);
    if (deal.origin_name) {
        origin.innerText = "из " + deal.origin_name;
        show(origin_container);
    }
}

var update_destination = function (deal) {
    var destination = document.querySelectorAll('.destination')[0];
    destination.innerText = deal.destination_name;
    destination.setAttribute('data-iata', deal.destination_iata)
    show(destination);
}

var update_tags = function(deal) {
    var tags_container = document.querySelectorAll('.tags-container')[0],
        tags = tags_container.querySelectorAll('.tags')[0];

    hide(tags_container);
    tags.innerHTML = '';
    if (deal.tags && deal.tags.length > 0) {
        for (var i = deal.tags.length - 1; i >= 0; i--) {
            (function(tag_text) {
                var tag = document.createElement('span');
                tag.classList.add('tag');
                tag.innerText = tag_text;
                tags.appendChild(tag);
            })(deal.tags[i])
        }
        show(tags_container);
    }
}

var update_review = function (deal) {
    var review_container = document.querySelectorAll('.review-container')[0],
        review = review_container.querySelector('.review'),
        review_content = review.querySelector('.review-content'),
        title = review_content.querySelector('.review-title'),
        text = review_content.querySelector('.review-text'),
        author = review_content.querySelector('.review-author'),
        date = review_content.querySelector('.review-date');

    hide(review);
    if (deal.review) {
        title.innerText = deal.review.title;
        text.innerText = deal.review.text;
        author.innerText = deal.review.author;
        date.innerText = deal.review.date;
        show(review);
    }
}

var get_year_objs = function(){
    var month_f_names = ['Январь', "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
    var result = [];
    var current_date = new Date();
    current_date.setDate(1);
    for (var i = 0; i < 12; i++) {
       future_date = new Date(current_date);
       future_date.setMonth(future_date.getMonth() + i);
       var month = ('0' + (future_date.getMonth() + 1)).slice(-2);

       result.push({
         id: future_date.getFullYear() + '-' + month,
         month_name: month_f_names[future_date.getMonth()]
       })
    }
    return result;
}

var generate_preloader = function() {
    var preloader = document.createElement("div");
    preloader.classList.add("preloader");
    for (var i = 0; i < 3; i++) {
        (function(index) {
            var item = document.createElement('div');
            item.classList.add("item");
            item.classList.add("item-" + (i + 1));
            preloader.appendChild(item);
        })(i)
    }
    return preloader;
}

var create_element = function(type, classes) {
    var el = document.createElement(type);
    for (var i = classes.length - 1; i >= 0; i--) {
        el.classList.add(classes[i]);
    }
    return el;
}

var build_prices_calendar = function() {
    var year_objs = get_year_objs(),
        prices_calendar_container = document.querySelectorAll('.prices-calendar-container')[0],
        prices_calendar = document.createElement('div');
    prices_calendar.classList.add("prices-calendar");
    for (var i = 0; i < year_objs.length; i++) {
        (function(yo) {
            var month_element = create_element('a', ['prices-calendar-month']),
                preloader = create_element('div', ['prices-calendar-preloader', 'price']),
                date_container = create_element('div', ['date_container']),
                month_name = create_element('div', ['prices-calendar-month_name', 'slider-elem']),
                month_dates = create_element('div', ['prices-calendar-month_dates', 'slider-elem']);
            month_element.setAttribute("id", "month-" + yo.id);
            //monthes
            month_name.innerText = yo.month_name;
            date_container.appendChild(month_name);
            date_container.appendChild(month_dates);
            // preloader
            preloader.appendChild(generate_preloader());

            
            month_element.appendChild(preloader);
            month_element.appendChild(date_container);
            prices_calendar.appendChild(month_element);
        })(year_objs[i])
    }
    prices_calendar_container.appendChild(prices_calendar);
}

var fill_calendar = function(prices, currency_symbol) {console.log(prices)
    var calendar = document.querySelector('.prices-calendar');
    for (var i = prices.length - 1; i >= 0; i--) {
        (function(p) {
            var month_element = calendar.querySelector("#month-" + p.id),
                price_container = month_element.querySelector('.prices-calendar-preloader'),
                month_dates = month_element.querySelector('.prices-calendar-month_dates'),
                price_value = create_element('span', ['price_value']),
                price_currency = create_element('span', ['prices-calendar-currency']);

            price_container.innerHTML = '';
            if (p.price) {
                price_container.appendChild(document.createTextNode('от '));
                price_value.innerText = p.price.toLocaleString('ru-RU', { maximumFractionDigits: 0 });
                price_container.appendChild(price_value);
                price_currency.innerHTML = ' ' + currency_symbol;
                price_container.appendChild(price_currency);
                month_element.classList.add("has-price");
                month_element.setAttribute("href", p.search_url);
                month_element.setAttribute("target", "_blank");
            } else {
                // var loader = create_element('img', ['loader']);
                // loader.setAttribute('src', 'img/icons/loader.svg');
                // price_container.appendChild(loader);

                price_container.innerText = "—"
            }
            
            month_dates.innerText = p.dates;
        })(prices[i])
    }
    // console.log(prices)
}

var format_date = function(str_date){
    var month_s_names = ['янв', "фев", "мар", "апр", "мая", "июн", "июл", "авг", "сен", "окт", "ноя", "дек"];
    var date_parts = str_date.split('-');
    return date_parts[2] + ' ' + month_s_names[Number(date_parts[1]) - 1];
}

var aviasalesUrl = function(origin_iata, destination_iata, depart_date, return_date) {
    var base = "https://search.aviasales.ru/",
        dp = depart_date.split("-"),
        rt = return_date.split("-"),
        passengers_count = 1,
        utm = 'utm_source=inspiration_tab';
    return base + origin_iata + dp[2] + dp[1] + destination_iata + rt[2] + rt[1] + passengers_count + '?' + utm;
}

var fill_price_tooltip = function(year_data, year_obj) {
    var price_tooltip = document.querySelector('#price_tooltip');
    var calendar = document.querySelector('.prices-calendar');
    
    if(Object.keys(year_data).length == 1) {
        price_tooltip.classList.remove('price-tooltip--hidden');
        calendar.classList.add('prices-calendar--off');
        for(var key in year_data) {
            year_obj.forEach(function(item){
                if(item.id == key) {
                    price_tooltip.innerHTML = item.dates;
                }
            });
        }
    } else {
        price_tooltip.classList.add('price-tooltip--hidden');
        calendar.classList.remove('prices-calendar--off');
    }
}

var get_year_prices = function(currency, origin_iata, destination_iata, callback){
    var req = new XMLHttpRequest(),
        url = "http://api.travelpayouts.com/v1/prices/monthly?currency="+ currency[0] +"&origin=" + origin_iata + "&destination=" + destination_iata + "&token=2db8244a0b9521ca2b0e0fbb24c4d1015b7e7a6b",
        year_obj = get_year_objs();

    req.open("GET", url, true);
    req.onload = function () {
      if (req.status == 200) {
        year_data = JSON.parse(req.responseText).data;
        for (var i=0; i<year_obj.length; i++) {
             if (year_data[year_obj[i].id]) {
                var month_data = year_data[year_obj[i].id];
                var depart_date = month_data.departure_at.slice(0, 10);
                var return_date = month_data.return_at.slice(0, 10);
                year_obj[i].price = month_data.price;
            } else {
                var depart_date = year_obj[i].id + '-01';
                var return_date = year_obj[i].id + '-08';
            }
            year_obj[i].dates = format_date(depart_date) + ' - ' + format_date(return_date);
            year_obj[i].search_url = aviasalesUrl(origin_iata, destination_iata, depart_date, return_date);
        }
        fill_price_tooltip(year_data, year_obj);
        callback(year_obj, currency[1]);
      }
    };

    req.send();
}

var get_currency = function(callback) {
    chrome.storage.sync.get('settings', function(res) {
        var currency;
        if(res.settings && res.settings.currency) {
            callback(res.settings.currency);
        } else {
            chrome.storage.local.get('currency', function(r) {
                callback(r.currency);
            });
        }
    });
}

var update_tab = function(deal) {
    var blackout = document.querySelectorAll('.blackout')[0];
    hide(blackout);
    if(!document.getElementById('prices_calendar').children.length) {
        build_prices_calendar();        
    }
    get_currency(function(currency) {
        get_year_prices(currency, deal.origin_iata, deal.destination_iata, fill_calendar);        
    });
    update_bg(deal, function() {
        show(blackout);
        update_price(deal);
        update_destination(deal);
        update_origin(deal);
        update_tags(deal);
        update_review(deal);
    });
}


var init = function() {
    get_next_deal(update_tab);
}

var clear_btn_price = function() {
    $('.btn-price').addClass('isLoading').append(generate_preloader());
};

var clear_prices_calendar = function() {
    $('.prices-calendar-preloader').each(function(){
        $(this).html(generate_preloader());
    });
};

var get_current_deal = function(callback) {
    chrome.storage.local.get(['deals_length', 'next_deal_index'], function(res){
        var current_deal;
        if(res.next_deal_index !== 0) {
            current_deal = res.next_deal_index - 1;
        } else {
            current_deal = res.deals_length - 1;
        }
        storage.get_deal_by_index(current_deal, function(d){
            callback(d);
        });
    });
};

var get_new_lyssa_deal = function(currency_code, current_deal, callback) {
    var req = new XMLHttpRequest(),
        url = 'http://api.travelpayouts.com/v1/prices/cheap?currency='+currency_code+'&origin='+current_deal.origin_iata+'&destination='+current_deal.destination_iata+'&page=1&token=1b7271789cd684c8d93ab5babe311aa4';
    req.open('GET', url, true);
    req.onload = function(request) {
        request = request.target;
        if (request.status == 200) {
        var directions = JSON.parse(request.response);
        var direction = directions.data[current_deal.destination_iata][Object.keys(directions.data[current_deal.destination_iata])[0]];
        var result = {
            price: direction.price,
            return_date: direction.return_at,
            origin: current_deal.origin_iata,
            destination: current_deal.destination_iata,
            depart_date: direction.departure_at
        }
        callback(result);
        }
    };
    req.send(null);
};

var get_new_prices = function(currency) {
    get_current_deal(function(deal){
        get_new_lyssa_deal(currency[0], deal, function(updated_deal){
            fill_btn_price(updated_deal.price, currency[1], function(){
                var btn_price = document.querySelector('.btn-price');
                btn_price.querySelector('.preloader').remove();
                btn_price.classList.remove('isLoading');                    
            });
        });
        get_year_prices(currency, deal.origin_iata, deal.destination_iata, fill_calendar);
    });
};

var fill_btn_price = function(value, currency_symbol, callback) {
    document.querySelector('.btn-price-value').innerText = value.toLocaleString('ru-RU', { maximumFractionDigits: 0 });;
    document.querySelector('.currency-symbol').innerText = currency_symbol;
    callback();
};


window.addEventListener('update_price', function(e) {
    clear_btn_price();
    clear_prices_calendar();
    document.getElementById('btn_change_destination').classList.add('isDisabled');
    get_new_prices(e.detail);

}, false);

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
    if(request.message == 'deals_updated') {
        document.getElementById('btn_change_destination').classList.remove('isDisabled');
    }
});


init();













$('#btn_change_destination').click(function(){
    init();
});

/***/ })
/******/ ]);
function InputDropdown(el, selectionBox) {
    this.dd = el;
    this.input = this.dd.children('input');
    this.list = this.dd.children('.dropdown');
    this.listItems = this.list.children();
    this.selectType = this.dd.data('select-type');
    this.selectionBox = selectionBox || '';
    this.initEvents();
}

InputDropdown.prototype = {
    initEvents : function() {
        var obj = this;

        obj.input.on('focus', function(){
            obj.dd.addClass('active');
        });

        obj.dd.click(function(e){
            e.stopPropagation();

        });

        obj.listItems.click(function(){
            var value = $(this).text();
            var parsedValue = value.substring(0, value.indexOf(',')).trim();
            if(obj.selectType === 'internal') {
                obj.input.val(parsedValue);
            } else if(obj.selectType === 'external') {
                var span = '<span class="hidden-cities__item">' + parsedValue + ' ' +
                           '<img class="hidden-cities__item-icon" src="img/icons/close_8px_b0bec6.png" alt="">'+
                           '<img class="hidden-cities__item-icon--hover" src="img/icons/close_8px_263239.png" alt="">'+
                           '</span>';
                obj.selectionBox.box.append(span);
            }
            obj.dd.removeClass('active');            
        });
    }
}
$(function(){

    // chrome.storage.sync.clear();
    var settings = {},
        currency_label = document.getElementById('currency_label'),
        currency_dropdown = document.getElementById('currency_dropdown'),
        currency_selector;
    get_settings(apply_settings);
    var sb = new SelectionBox($('#exclude_cities'));

    window.addEventListener('update_settings', function() {
        get_settings();
    }, false);
    
    $(document).click(function() {
        // all dropdowns
        $('.wrapper-select-dropdown').removeClass('active');
        $('.prices-calendar-container').addClass('prices-calendar-container--hidden');
    });

    var $btn_settings = $('#btn_settings').click(function(){
        var $obj = $(this);
        $obj.addClass('menu-opened');
        $obj.next().addClass('isOpened');
        return $obj;
    });

    $('#btn_close_settings').click(function(){
        $btn_settings.removeClass('menu-opened');
        $btn_settings.next().removeClass('isOpened');
    });

    var $place_container = $('#place_container');
    $('#btn-bottombar').click(function(){
        $place_container.toggleClass('slideUp');
    });

    var $comments_container = $('#comments_container');
    var $toggle_comments = $('#toggle_comments');

    $toggle_comments.on('change', function(){
        showComments(!this.checked);
        settings.showComments = !$toggle_comments[0].checked;
        chrome.storage.sync.set({settings});
    });

    var $tags_container = $('#tags_container');
    var $toggle_tags = $('#toggle_tags');

    $toggle_tags.on('change', function(){
        showTags(!this.checked);
        settings.showTags = !$toggle_tags[0].checked;
        chrome.storage.sync.set({settings});
    });

    var hide_cities_choices,
        autoCompleteCitiesToHide,
        input_hide_cities = document.getElementById("hide_cities");

    chrome.storage.local.get(function(res){
        hide_cities_choices = get_choices(res);
        autoCompleteCitiesToHide = new Awesomplete(input_hide_cities, {
            list: hide_cities_choices,
            data: function(item, input) {
                    if(settings.hideCities) {
                        if(settings.hideCities[item[2]]) return;
                    }
                    return { label: item[0]+', '+'<span data-index="'+hide_cities_choices.indexOf(item)+'">'+item[1]+', '+item[2]+'</span>', value: item[0] };
            },
            maxItems: 7,
            sort: Awesomplete.SORT_BYORDER
        });
    });

    input_hide_cities.addEventListener('awesomplete-selectcomplete', function(e){
        var cityToHide = e.target.value;
        e.target.value = '';
        var selectText = e.text.label;
        var iata = selectText.slice(-10, -7);
        if(!settings) {
            settings = {};
        }
        if(settings.hideCities) {
            settings.hideCities[iata] = cityToHide;
        } else {
            settings.hideCities = {};
            settings.hideCities[iata] = cityToHide;    
        }             

        chrome.storage.sync.set({settings});
        create_hidden_city(cityToHide, iata);
    });

    input_hide_cities.addEventListener('blur', function(e){
        if(e.target.value !== '') {
            e.target.value = '';
        }
    });

    var input_origin_city = document.getElementById('input_origin_city');
    var autoCompleteOrigin = new Awesomplete(input_origin_city, {
        data: function(item, input) {
            return { label: item[0]+', '+'<span data-index="'+hide_cities_choices.indexOf(item)+'">'+item[1]+', '+item[2]+'</span>', value: item[0] };            
        }
    });

    input_origin_city.addEventListener('awesomplete-selectcomplete', function(e){
        chrome.storage.sync.get('settings', function(res) {
            res.settings.originCity = {}
            res.settings.originCity[e.text.slice(-10, -7)] = e.target.value;
            chrome.storage.sync.set(res, function(){
                input_origin_city.blur();
            });
        });
    });

    input_origin_city.addEventListener('input', function(e){
        var list = getCitiesListWithAjax(e.target.value, function(data){
            autoCompleteOrigin.list = data;
            autoCompleteOrigin.evaluate();    
        });
    });

    input_origin_city.addEventListener('blur', function(e){
        chrome.storage.sync.get('settings', function(res){
            if(res.settings && res.settings.originCity) {
                var city = res.settings.originCity;
                for(var key in city) {
                    if(input_origin_city.value !== city[key]) {
                        input_origin_city.value = city[key];
                    }
                }    
            } else if(res.settings && !res.settings.originCity || !res.settings) {
                get_auto_settings('origin_city', function(data){
                    if(input_origin_city.value !== data.origin_city)
                        set_origin_city_value(data.origin_city);
                });
            }
            
        });
    });

    function getCitiesListWithAjax(value, callback) {
        var req = new XMLHttpRequest(),
            url = 'http://places.aviasales.ru/match?term='+value+'&locale=ru';
        
        req.open('GET', url, true);
        req.onload = function() {
            if(req.status == 200) {
                var place_data = JSON.parse(req.responseText);
                if(place_data.length > 0) {
                    var returned_cities = {},
                        choices = [];

                    place_data.forEach(function(item){
                        if(item.city_iata) returned_cities[item.city_iata] = item;
                    });

                    for(var key in returned_cities) {
                        var choice = [ returned_cities[key].name.substring(0, returned_cities[key].name.indexOf(',')), returned_cities[key].name.substring(returned_cities[key].name.indexOf(',')).substring(2), key ];
                        choices.push(choice);
                    }
                } 
            }
            callback(choices);
        };
        req.send();
    }

    function get_settings(callback) {
        chrome.storage.sync.get('settings', function(res){
            if(res.settings) {
                settings = res.settings;
                if(callback) {
                    callback(settings);
                }
            } else {
                get_auto_settings(['currency', 'origin_city'], apply_auto_settings);
            }
        });
    }

    function apply_auto_settings(auto_settings) {console.log(auto_settings)
        if($.isEmptyObject(auto_settings)) {
            set_currency_value('RUB');
            set_origin_city_value('Москва');
        } else {
            for(var setting in auto_settings) {
                switch(setting) {
                    case 'currency':
                        set_currency_value(auto_settings.currency[0]);
                        break;
                    case 'origin_city':
                        set_origin_city_value(auto_settings.origin_city);
                        break;
                }
            }    
        }
    }

    function set_currency_value(value) {
        var currencyListElem = currency_dropdown.querySelector('li[data-currency='+ value +']');
        currency_label.innerHTML = currencyListElem.innerHTML;
        currencyListElem.classList.add('checked');
        currency_selector = new DropDown($('#choose_currency'));      
    }

    function set_origin_city_value(value) {
        input_origin_city.value = value;
    }

    function get_auto_settings(settings_name, callback) {
        chrome.storage.local.get(settings_name, function(res){
            callback(res);
        });
    }

    function apply_settings(settings) {
        for(var key in settings) {
            switch(key) {
                case 'hideCities': 
                    for(var k in settings.hideCities) {
                        create_hidden_city(settings.hideCities[k], k);
                    }
                    break;
                case 'showComments':
                    showComments(settings.showComments);
                    $toggle_comments[0].checked = !settings.showComments;
                    break;
                case 'showTags':
                    showTags(settings.showTags);
                    $toggle_tags[0].checked = !settings.showTags;
                    break;
                case 'originCity':
                    for(var key in settings.originCity) {
                        set_origin_city_value(settings.originCity[key])
                    }
                    break;
                case 'currency':
                    set_currency_value(settings.currency[0]);
                    break;
            }
        }
        if(!settings.currency && !settings.originCity) {
            get_auto_settings(['currency', 'origin_city'], apply_auto_settings);
        } else if(!settings.currency) {
            get_auto_settings('currency', apply_auto_settings);
        } else if(!settings.originCity) {
            get_auto_settings('origin_city', apply_auto_settings);
        }
    }

    function showComments(state) {
        if(state) {
            $comments_container.removeClass('review-container--hidden');
        } else {
            $comments_container.addClass('review-container--hidden');
        }
    }

    function showTags(state) {
        if(state) {
            $tags_container.removeClass('tags-container--hidden');
        } else {
            $tags_container.addClass('tags-container--hidden');
        }
    }

    function get_choices(obj) {
        var choices = [];
        var filter = /deals_/;
        for(var k in obj) {
            if(filter.test(k) && Array.isArray(obj[k])) {
                obj[k].forEach(function(item){
                    var itemName = item.destination_name;
                    choices.push([itemName.substring(0, itemName.indexOf(',')), (itemName.substring(itemName.indexOf(' '))).substring(1), item.destination_iata]);
                });
            }
        } 
        return choices;   
    }

    function create_hidden_city(city, iata) {
        var hidden_cities_box = document.getElementById('exclude_cities');
        var span = '<span class="hidden-cities__item" data-iata="'+iata+'">' + city + ' ' +
                   '<img class="hidden-cities__item-icon" src="img/icons/close-8px-light.svg" alt="">'+
                   '<img class="hidden-cities__item-icon--hover" src="img/icons/close-8px-dark.svg" alt="">'+
                   '</span>';
        $(hidden_cities_box).append(span);

    }
});
function DropDown(el) {
    this.dd = el;
    this.placeholder = this.dd.children('span');
    this.opts = this.dd.find('ul.dropdown > li');
    this.currentOpt = $(this.opts).filter('.checked');
    this.val = '';
    this.index = -1;
    this.initEvents();
}

DropDown.prototype = {
    initEvents : function() {
        var obj = this;

        obj.dd.on('click', function(event){
            $(this).toggleClass('active');
            return false;
        });

        obj.opts.on('click',function(){
            var opt = $(this);
            opt.addClass('checked');
            obj.currentOpt.removeClass('checked');
            obj.currentOpt = opt;
            obj.val = opt.html();
            obj.index = opt.index();
            obj.placeholder.html(obj.val);
            var currency_symbol = opt.find('.currency-sign').html();

            chrome.storage.sync.get('settings', function(data){
                if(data.settings) {
                    var settings = data.settings;
                } else {
                    var settings = {};
                }
                settings.currency = [opt.data('currency'), currency_symbol];
                chrome.storage.sync.set({settings});
                var event = new CustomEvent('update_price', {'detail': settings.currency});
                window.dispatchEvent(event);
                chrome.runtime.sendMessage({cmd: 'update_deals'});              
            });
        });
    },
    getValue : function() {
        return this.val;
    },
    getIndex : function() {
        return this.index;
    }
}
function SelectionBox($el) {
    this.box = $el;
    this.boxItems = $el.children();
    this.boxItemClassName = 'hidden-cities__item';
    this.initEvents();
}

SelectionBox.prototype = {
    initEvents : function() {
        var obj = this;

        obj.box.on('click', '.'+obj.boxItemClassName, function(){
            var boxItem = $(this);
            boxItem.remove();

            chrome.storage.sync.get('settings', function(data){
                delete data.settings.hideCities[boxItem.data('iata')];
                chrome.storage.sync.set(data, function(){
                    var event = new Event('update_settings');
                    window.dispatchEvent(event);
                });
            });
        });
    },
}