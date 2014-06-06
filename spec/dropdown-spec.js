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
    it('should generate a hidden select component using the items', function() {
      simple.dropdown({
        el: '#dropdown',
        items: data
      });
      $(dropdownEl).find('option').each(function(index) {
        expect($(this).text()).toEqual(data[index].label);
        return expect($(this).val()).toEqual(data[index].value);
      });
      return expect($(dropdownEl).find('select').css('display')).toEqual('none');
    });
    it('should generate a hidden ul waiting for displaying filled with the values of items', function() {
      simple.dropdown({
        el: '#dropdown',
        items: data
      });
      $(dropdownEl).find('ul li').each(function(index) {
        return expect($(this).text()).toEqual(data[index].label);
      });
      return expect($(dropdownEl).find('ul').css('display')).toEqual('none');
    });
    it('should show an empty option while providing emptyText', function() {
      var emptyOp, emptyText;
      emptyText = 'please choose';
      simple.dropdown({
        el: '#dropdown',
        items: data,
        emptyText: emptyText
      });
      emptyOp = $(dropdownEl).find('a')[1];
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
      $(dropdownEl).find('options').each(function(index) {
        expect($(this).text()).toEqual(data[index].label);
        return expect($(this).val()).toEqual(data[index].value);
      });
      return $(dropdownEl).find('ul li').each(function(index) {
        return expect($(this).text()).toEqual(data[index].label);
      });
    });
    it('should call the selected callback while selecting some option and set the value of the hidden select', function() {
      var callback, selectedEl;
      callback = jasmine.createSpy('callback');
      simple.dropdown({
        el: '#dropdown',
        items: data,
        emptyText: false,
        selected: callback
      });
      selectedEl = $(dropdownEl).find('ul li')[1];
      $(selectedEl).trigger('click');
      expect(callback).toHaveBeenCalledWith(selectedEl, data[1]);
      expect($(dropdown).find('select').val()).toEqual(data[1].value);
      return expect($(dropdown).find('.sdSelector').text()).toEqual(data[1].label);
    });
    it('should set max-height to options element by setting height', function() {
      simple.dropdown({
        el: '#dropdown',
        items: data,
        emptyText: false,
        height: '20px'
      });
      return expect(dropdownEl.find('ul').css('max-height')).toEqual('20px');
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
