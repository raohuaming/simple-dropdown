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
      height: null,
      emptyText: null,
      selected: $.noop
    };

    Dropdown._tpl = "<select style=\"display: none;\">\n  <% items.forEach(function(item) { %>\n    <option value=<%= item.value %> ><%= item.label %></option>\n  <% }) %>\n</select>\n<div class=\"sdHolder\">\n  <a class=\"sdToggle\" href=\"#\"></a>\n  <a class=\"sdSelector\" href=\"#\"><%= emptyText %></a>\n  <ul class=\"sdOptions\" style=\"display: none; max-height: <%= height %>;\">\n    <% items.forEach(function(item) { %>\n      <li><a href=\"#\"><%= item.label %></a></li>\n    <% }) %>\n  </ul>\n</div>";

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
      this.opts.emptyText = this.opts.emptyText || "请点击选择";
      this.opts.height = this.opts.height || ("" + (5 * 30) + "px");
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
              return _this.createDropdown(_this.opts.items, _this.opts.selected);
            };
          })(this)
        });
      } else {
        return this.createDropdown(this.opts.items, this.opts.selected);
      }
    };

    Dropdown.prototype.createDropdown = function(items, callback) {
      var i, optionsEl, selectEl, selectorEl, toggleEl;
      this.widgetEl = ejs.render(Dropdown._tpl, {
        items: items,
        emptyText: this.opts.emptyText,
        height: this.opts.height
      });
      this.widgetEl = $(this.widgetEl).appendTo(this.el);
      selectEl = this.selectEl = $(this.el).find('select');
      toggleEl = this.toggleEl = $(this.el).find('.sdToggle');
      selectorEl = this.selectorEl = $(this.el).find('.sdSelector');
      optionsEl = this.optionsEl = $(this.el).find('.sdOptions');
      i = 0;
      $(optionsEl).find('li').each(function() {
        $(this).data('item', items[i]);
        i += 1;
        return $(this).click(function() {
          $(optionsEl).hide();
          $(selectEl).val($(this).data('item').value);
          $(selectorEl).text($(this).data('item').label);
          return callback(this, $(this).data('item'));
        });
      });
      $(this.el).mouseleave(function() {
        return $(optionsEl).hide();
      });
      return $(selectorEl).mouseenter((function(_this) {
        return function() {
          $(optionsEl).css('top', "" + ($(selectorEl).height()) + "px");
          $(optionsEl).toggle();
          if ($(window).height() - $(selectorEl).height() - $(selectorEl).offset().top < $(optionsEl).height()) {
            return $(optionsEl).css('top', "-" + ($(optionsEl).height()) + "px");
          }
        };
      })(this));
    };

    Dropdown.prototype.destroy = function() {
      this.widgetEl.remove();
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
