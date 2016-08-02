# fluxory
flux history

# install 
```
npm install fluxory --save
```

# how to use
```javascript
const Dispatcher = require('fluxory')(require('flux').Dispatcher)
```

# api method
```javascript
back([actiionType])
forward([actionType])
getCurrentPosition([actionType])

```

# mocha test sample
```
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
```

# for dev
+ install self to test
```
npm install
``` 
+ test
```
npm test
```
+ debug
```
npm run debug
```