# Responsive height

[![Build Status](https://travis-ci.org/codecomp/responsive-height.svg?branch=master)](https://travis-ci.org/codecomp/responsive-height)  [![dependencies Status](https://david-dm.org/codecomp/responsive-height/status.svg)](https://david-dm.org/codecomp/responsive-height)  [![devDependencies Status](https://david-dm.org/codecomp/responsive-height/dev-status.svg)](https://david-dm.org/codecomp/responsive-height?type=dev) [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

A javaScript plugin to dynamically resize elements or their children to the max height based on the number of columns required at a specific breakpoint.

## Installing

With npm / yarn / webpack
```sh
npm install responsive-height
# or
yarn add responsive-height
```

Then import it like so:

```js
import ResponsiveHeight from 'responsive-height';
const container = document.querySelector('.container');
const controller = new ResponsiveHeight(container);
```

## Settings

Option  | Default | Details
------------- | ------------- | -------------
delay *(int)*  | 200 | Delay between resize of the screen and the recalculation of the required heights. This can be set to 0 and no delay will be factored in.
child *(string)*  | null | Selector for the child element to be found inside the main selector. If this is set the height will be calculated and set to this element instead of the parent. However the parent will be used for calculating columns.
global *(boolean)* | false | If global is set to true it will ignore the widths option and set all elements (or their children) to the same height.
exclude_get *(selector)* | null | Setting Exclude get with a css query selector will stop the elements with this selector from having their heights factor into the heights of the other elements in its row.
exclude_set *(selector)* | null | Setting Exclude set with a css query selector will stop the element (or child element if specified) from having its height set.
widths *(array)* | empty Array | A multi dimensional array of pixel widths and columns starting from the heights to lowest. This checks if the size is greater than a size, if so it sets the columns.
before_init *(function)* | null | Callback function called before initialisation.
after_init *(function)* | null | Callback function called after initialisation has finished.
before_resize *(function)* | null | Callback function called before resize starts.
after_resize *(function)* | null | Callback function called after resize has finished.
after_destroy *(function)* | null | Callback function called after destroy method is called.

## Methods

Method | Details
------------- | -------------
refresh | Immediately trigger a recalculation of the heights for all elements  based off the existing settings
destroy | Removes the heights off all elements or their children and stops further processing
init | Re initialises the plugin causing an immediate refresh and re binding the resizing of the window to trigger further refreshes

## Example usage

Here you can see how a simple call for this function runs. This will set the heights of every element with a desc class found inside every child element of the container.

```js
import ResponsiveHeight from 'responsive-height';
const container = document.querySelector('.container');
const controller = new ResponsiveHeight(container, {
    child: '.desc',
	widths: [
		[1200, 8],
		[768, 4],
		[0, 1]
	]
});
```

```HTML
<div class="container">
    ...
    <div>
        <p class="desc">Large block of text of varying height that we want to keep the same height</p>
        <span>Some text we want to stick to the bottom</span>
    </div>
    ...
</div>
```

If you then updated the size of some of the content you could then trigger a recalculation of the heights.

```js
container.children[0].querySelector('.desc').innerHTML = 'Changed the text';
controller.update();
```

If necessary some options can be updated by modifying the objects property of the class directly. If you need to change the child or container you must also trigger the init method for this to recollect the elements. The destroy function should also be called first to unset the heights and remove the watcher on the existing elements in this instance.

So if you wanted to stop resizing based on children you could do the following

```js
container.options.child = null;
controller.destroy();
controller.init();
```

## TODO

- Add update method to allow for recollection of container elements / children without having to destroy and init
- Tie in exclude_get and exclude_set functionality to take in css querySelector or HTML element
- Setup container to take in a CSS querySelector or HTML element
- Setup container to handle multiple elements at once

## Credits

Chris Morris [https://github.com/codecomp]
