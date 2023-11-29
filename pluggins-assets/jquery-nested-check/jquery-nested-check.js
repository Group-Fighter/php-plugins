/**
 jquery-checkem
 source: https://github.com/lancevo/jquery-checkem
 a jquery plug-in to simplify form's nested checkboxes

 Version: 0.2
 License: MIT
 */
(function ($) {
  $.fn.checkem = function checkem() {
    var form = $(this);

    if (!form.length) {
      console.error('checkem: unable to find the form');
      return;
    }

    var checkboxes = form.find(':checkbox'),
      tree = {},
      childCheckboxCount = 0;

    (function generateTree() {
      tree.checkall = tree.checkall || [];
      $.each(checkboxes, function (idx, checkbox) {
        $cb = $(checkbox);
        if ($cb.attr('data-checkem') === 'all') {
          tree.checkall.push(checkbox);
        } else if ((parentName = $cb.attr('data-checkem-parent'))) {
          tree[parentName] = tree[parentName] || [];
          tree[parentName].push(checkbox);
        }
        $cb.on('click', toggleCheckbox);
      });
      childCheckboxCount = checkboxes.length - tree.checkall.length;
    })();

    function countChecked(cbs) {
      var count = 0;
      $.each(cbs, function (idx, cb) {
        if (cb.checked) {
          count++;
        }
      });
      return count;
    }

    function checkParent(parentName) {
      var parentCheckbox = form.find('input[name="' + parentName + '"]');
      var grandparentName;

      if (!parentCheckbox.length) {
        console.warn('checkem: invalid input name "' + parentName + '"');
        return;
      }

      if (countChecked(tree[parentName]) == tree[parentName].length) {
        parentCheckbox.prop('checked', true);
      } else {
        parentCheckbox.prop('checked', false);
      }

      if ((grandparentName = parentCheckbox.attr('data-checkem-parent'))) {
        checkParent(grandparentName);
      }
    }

    function checkChildren(name, value) {
      $(tree[name]).each(function () {
        var childName = $(this).attr('name');

        if (tree[childName]) {
          checkChildren(childName, value);
        }

        $(this).prop('checked', value);
      });
    }

    function toggleCheckbox() {
      var $cb = $(this),
        isChecked = this.checked,
        cbName = $cb.attr('name'),
        cbParentName = '';

      // checkall
      if ($cb.attr('data-checkem') == 'all') {
        $(checkboxes).prop('checked', isChecked);
        return;
      }

      // check parent
      if (tree[cbName]) {
        checkChildren(cbName, isChecked);
      }
      // children checkboxes
      if ((cbParentName = $cb.attr('data-checkem-parent'))) {
        checkParent(cbParentName);
      }

      // if all the children are checked, check the checkall checkboxes
      // otherwise uncheck all the checkall checkboxes
      if (isChecked && countChecked(checkboxes) >= childCheckboxCount) {
        $(tree.checkall).prop('checked', true);
      } else {
        $(tree.checkall).prop('checked', false);
      }
    }

    function getResult() {
      var _len_checkbox = checkboxes.length;
      var _count_checked = countChecked(checkboxes);
      var _index = [];
      var _nodes = {};
      var _value_checkbox = [];
      var _datas = [];

      checkboxes.each(function (idx) {
        var checkbox = this;
        var cbName = $(checkbox).attr('name');
        var isChecked = checkbox.checked;

        _value_checkbox.push(isChecked);

        if (tree[cbName]) {
          _nodes[cbName] = tree[cbName].map(function (cb) {
            return cb.checked;
          });
        } else {
          _nodes[cbName] = isChecked;
        }

        _index.push(cbName);

        if (tree[cbName] && isChecked) {
          _datas[cbName] = tree[cbName].map(function (cb) {
            var dataDetailAttributes = {};

            $.each(cb.attributes, function (index, attribute) {
              // Check if the attribute starts with "data-detail-"
              if (attribute.name.startsWith('data-detail-')) {
                // Get the attribute name without the prefix "data-detail-"
                var attributeName = attribute.name.replace('data-detail-', '');
                // Store the attribute value in the dataDetailAttributes object
                dataDetailAttributes[attributeName] = attribute.value;
              }
            });
            return dataDetailAttributes;
          });
        }
      });

      return {
        index: _index,
        nodes: _nodes,
        len_checkbox: _len_checkbox,
        value_checkbox: _value_checkbox,
        count_checkked: _count_checked,
        datas: _datas,
      };
    }

    return {
      getResult: getResult,
    };
  };
})(jQuery);
