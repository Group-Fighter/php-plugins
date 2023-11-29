## Jquery Nested Check
This pluggins is modify from [this repo](https://github.com/lancevo/jquery-checkem)

[DEMO](http://lancevo.github.io/jquery-checkem/)

## usage

```js
// for triggered checkbox
var instance = $('form').checkem();

// for get data value at checkbox
$('.listen-checkbox').on('click', function (e) {
  console.log(instance.getResult());
});
```


### Select All Checkbox

Define select all checkboxes using attribute `data-checkem="all"`

```html
<input type="checkbox" name="allitems" data-checkem="all" class="listen-checkbox"> Check All
```


### Nested Checkbox

Define parent input's name in child input attribute `data-checkem-parent` 

```html
<input type="checkbox" name="parentitem"> Parent Item <br>
   <input type="checkbox" class="listen-checkbox" name="childitem1" data-checkem-parent="parentitem"> Child item 1
   <input type="checkbox" class="listen-checkbox" name="childitem2" data-checkem-parent="parentitem"> Child item 2
```

### Nested Checkbox

Define all data in input attribute `data-detail-*` 

```html
<input type="checkbox" class="listen-checkbox" name="parentitem" data-detail-key="value-key" data-detail-key2="value-key2"> Parent Item <br>
   <input type="checkbox" class="listen-checkbox" name="childitem1" data-checkem-parent="parentitem" data-detail-child1-key1="value-child1-key1" data-detail-child1-key2="value-child1-key2"> Child item 1
   <input type="checkbox" class="listen-checkbox" name="childitem2" data-checkem-parent="parentitem" data-detail-child2-key1="value-child2-key1" data-detail-child2-key2="value-child2-key2"> Child item 2


that config to result like this
{
    "index": [
        "parentitem"
    ],
    "nodes": {
        "parentitem": true,
    },
    "len_checkbox": 3,
    "value_checkbox": [
        true,
        true,
        true,
    ],
    "count_checkked": 3,
    "datas": [
        parentitem: [
            {
                "child1-key1": "value-child1-key1",
                "child1-key2": "value-child1-key2"
            },
            {
                "child2-key1": "value-child2-key1",
                "child2-key2": "value-child2-key2"
            }
        ]
    ]
}
```