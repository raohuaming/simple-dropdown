
describe 'simple dropdown', ->
  data = null
  dropdownEl = $("<div id='dropdown'></div>")
  beforeEach ->
    data = [
      {
        label: '男'
        value: 'male'
      },
      {
        label: '女'
        value: 'female'
      }
    ]
    expect($('#dropdown').length).toBe(0)
    dropdownEl.appendTo('body')

  afterEach ->
    $(".simple-dropdown").each () ->
      $(@).data('dropdown').destroy()
    dropdownEl.remove()

  it 'should display', ->
    simple.dropdown
      el: '#dropdown'
      items: data
    expect($(".simple-dropdown").length).toBe(1)

  it 'should display exatly the items without emptyText', ->
    simple.dropdown
      el: '#dropdown'
      items: data
      emptyText: false
    $('#dropdown option').each (index)->
      expect($(@).text()).toEqual data[index].label
      expect($(@).val()).toEqual data[index].value

  it 'should append an empty option while providing emptyText', ->
    emptyText = 'please choose'
    simple.dropdown
     el: '#dropdown'
     items: data
     emptyText: emptyText
    emptyOp = $('#dropdown option')[0]
    expect($(emptyOp).text()).toEqual emptyText

  it 'should fetch items according to opts.url and params', ->
    spyOn($, 'ajax').and.callFake (options) ->
      options.success(data)
    simple.dropdown
     el: '#dropdown'
     url: 'data.json'
     emptyText: false
    $('#dropdown option').each (index)->
      expect($(@).text()).toEqual data[index].label
      expect($(@).val()).toEqual data[index].value

  it 'should call the selected callback while selecting any options', ->
    callback = jasmine.createSpy('callback')
    simple.dropdown
     el: '#dropdown'
     items: data
     emptyText: false
     selected: callback
    
    $('#dropdown select').val(data[1].value).trigger('change')
    el = $('#dropdown option')[1]
    expect(callback).toHaveBeenCalledWith(el, data[1])

  it 'should set the class name and height for select tag', ->
    simple.dropdown
     el: '#dropdown'
     items: data
     emptyText: false
     class: 'myClass'
     height: '20px'
    expect(dropdownEl.find('select').attr('class')).toEqual 'myClass'
    expect(dropdownEl.find('select').attr('height')).toEqual '20px'


  it 'shuld destroy when call destroy()', ->
    simple.dropdown
      el: '#dropdown'
      items: data
    dropdownEl.data('dropdown').destroy()
    expect($('.simple-dropdown').length).toBe(0)
