const Dispatcher = require('../tasks/Dispatcher')(require('flux').Dispatcher)
import _ from 'lodash'

const assert = require('chai').assert;
describe('flux Dispatcher', function() {

	describe('test super dispatcher', function() {
		it('dispatch ok', function() {

			var flightDispatcher = new Dispatcher();

			var CityStore = {
				city: null
			};

			var CountryStore = {
				country: null
			}

			flightDispatcher.register(function(payload) {
				if (payload.actionType === 'city-update') {
					CityStore.city = payload.selectedCity;
				} else if (payload.actionType === 'country-update') {
					CountryStore.country = payload.selectedCountry;
				}
			});

			flightDispatcher.dispatch({
				actionType: 'city-update',
				selectedCity: 'paris'
			});

			assert.equal(CityStore.city, 'paris')

			flightDispatcher.dispatch({
				actionType: 'city-update',
				selectedCity: 'hongkong'
			});

			assert.equal(CityStore.city, 'hongkong')

			flightDispatcher.dispatch({
				actionType: 'city-update',
				selectedCity: 'beijing'
			});

			assert.equal(CityStore.city, 'beijing')

			flightDispatcher.back()

			assert.equal(CityStore.city, 'hongkong')

			flightDispatcher.back()

			assert.equal(CityStore.city, 'paris')

			flightDispatcher.forward()

			assert.equal(CityStore.city, 'hongkong')

			flightDispatcher.dispatch({
				actionType: 'country-update',
				selectedCountry: 'china'
			});

			assert.equal(CountryStore.country, 'china')

			flightDispatcher.dispatch({
				actionType: 'country-update',
				selectedCountry: 'usa'
			});

			assert.equal(CountryStore.country, 'usa')

			flightDispatcher.back()

			assert.equal(CountryStore.country, 'china')

			flightDispatcher.back('city-update')

			assert.equal(CityStore.city, 'hongkong')

			flightDispatcher.back('city-update')

			assert.equal(CityStore.city, 'paris')

			assert.equal(flightDispatcher.getCurrentPosition('country-update'), 1)
		});
	});
});