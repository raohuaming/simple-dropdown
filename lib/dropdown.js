(function() {
  var Dropdown,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Dropdown = (function(_super) {
    __extends(Dropdown, _super);

    function Dropdown() {
      return Dropdown.__super__.constructor.apply(this, arguments);
    }

    Dropdown.prototype.opts = {
      el: null,
      url: null,
      items: [],
      params: {},
      height: 'auto',
      emptyText: '点击选择',
      "class": '',
      selected: $.noop
    };

    Dropdown._tpl = "<select height=\"<%= height %>\" class=\"<%= classes %>\">\n  <% items.forEach(function(item) { %>\n    <option value=<%= item.value %> ><%= item.label %></option>\n  <% }) %>\n</select>";

    Dropdown.prototype._init = function() {
      if (!this.opts.el) {
        throw "simple tree: option el is required";
        return;
      }
      if (!(this.opts.items || this.opts.url)) {
        throw "simple tree: option items is required";
        return;
      }
      this.opts.items = $.extend([], this.opts.items);
      return this._render();
    };

    Dropdown.prototype._render = function() {
      this.el = $(this.opts.el).addClass("simple-dropdown").data("dropdown", this);
      if (this.opts.url) {
        return $.ajax({
          url: this.opts.url,
          type: 'get',
          dataType: 'json',
          data: this.opts.params,
          success: (function(_this) {
            return function(result) {
              _this.opts.items = result;
              if (_this.opts.emptyText) {
                _this.opts.items.unshift({
                  label: _this.opts.emptyText,
                  value: null
                });
              }
              return _this.createDropdown(_this.opts.items, _this.opts.selected);
            };
          })(this)
        });
      } else {
        if (this.opts.emptyText) {
          this.opts.items.unshift({
            label: this.opts.emptyText,
            value: null
          });
        }
        return this.createDropdown(this.opts.items, this.opts.selected);
      }
    };

    Dropdown.prototype.createDropdown = function(items, callback) {
      var i;
      this.selectEl = ejs.render(Dropdown._tpl, {
        items: items,
        height: this.opts.height,
        classes: this.opts["class"]
      });
      this.selectEl = $(this.selectEl).appendTo(this.el);
      i = 0;
      $(this.selectEl).find('option').each(function() {
        $(this).data('item', items[i]);
        return i += 1;
      });
      return $(this.selectEl).change(function() {
        return $(this).find('option:selected').each(function() {
          return callback(this, $(this).data('item'));
        });
      });
    };

    Dropdown.prototype.destroy = function() {
      this.selectEl.remove();
      return this.el.removeClass('simple-dropdown').removeData("dropdown");
    };

    return Dropdown;

  })(Widget);

  this.simple || (this.simple = {});

  $.extend(this.simple, {
    dropdown: function(opts) {
      return new Dropdown(opts);
    }
  });

}).call(this);
