(function() {
  describe('simple dropdown', function() {
    var data, dropdownEl;
    data = null;
    dropdownEl = $("<div id='dropdown'></div>");
    beforeEach(function() {
      data = [
        {
          label: '男',
          value: 'male'
        }, {
          label: '女',
          value: 'female'
        }
      ];
      expect($('#dropdown').length).toBe(0);
      return dropdownEl.appendTo('body');
    });
    afterEach(function() {
      $(".simple-dropdown").each(function() {
        return $(this).data('dropdown').destroy();
      });
      return dropdownEl.remove();
    });
    it('should display', function() {
      simple.dropdown({
        el: '#dropdown',
        items: data
      });
      return expect($(".simple-dropdown").length).toBe(1);
    });
    it('should display exatly the items without emptyText', function() {
      simple.dropdown({
        el: '#dropdown',
        items: data,
        emptyText: false
      });
      return $('#dropdown option').each(function(index) {
        expect($(this).text()).toEqual(data[index].label);
        return expect($(this).val()).toEqual(data[index].value);
      });
    });
    it('should append an empty option while providing emptyText', function() {
      var emptyOp, emptyText;
      emptyText = 'please choose';
      simple.dropdown({
        el: '#dropdown',
        items: data,
        emptyText: emptyText
      });
      emptyOp = $('#dropdown option')[0];
      return expect($(emptyOp).text()).toEqual(emptyText);
    });
    it('should fetch items according to opts.url and params', function() {
      spyOn($, 'ajax').and.callFake(function(options) {
        return options.success(data);
      });
      simple.dropdown({
        el: '#dropdown',
        url: 'data.json',
        emptyText: false
      });
      return $('#dropdown option').each(function(index) {
        expect($(this).text()).toEqual(data[index].label);
        return expect($(this).val()).toEqual(data[index].value);
      });
    });
    it('should call the selected callback while selecting any options', function() {
      var callback, el;
      callback = jasmine.createSpy('callback');
      simple.dropdown({
        el: '#dropdown',
        items: data,
        emptyText: false,
        selected: callback
      });
      $('#dropdown select').val(data[1].value).trigger('change');
      el = $('#dropdown option')[1];
      return expect(callback).toHaveBeenCalledWith(el, data[1]);
    });
    it('should set the class name and height for select tag', function() {
      simple.dropdown({
        el: '#dropdown',
        items: data,
        emptyText: false,
        "class": 'myClass',
        height: '20px'
      });
      expect(dropdownEl.find('select').attr('class')).toEqual('myClass');
      return expect(dropdownEl.find('select').attr('height')).toEqual('20px');
    });
    return it('shuld destroy when call destroy()', function() {
      simple.dropdown({
        el: '#dropdown',
        items: data
      });
      dropdownEl.data('dropdown').destroy();
      return expect($('.simple-dropdown').length).toBe(0);
    });
  });

}).call(this);
