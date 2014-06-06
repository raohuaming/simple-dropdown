
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

  it 'should generate a hidden select component using the items', ->
    simple.dropdown
      el: '#dropdown'
      items: data
    $(dropdownEl).find('option').each (index)->
      expect($(@).text()).toEqual data[index].label
      expect($(@).val()).toEqual data[index].value
    expect($(dropdownEl).find('select').css('display')).toEqual 'none'

  it 'should generate a hidden ul waiting for displaying filled with the values of items', ->
    simple.dropdown
      el: '#dropdown'
      items: data
    $(dropdownEl).find('ul li').each (index)->
      expect($(@).text()).toEqual data[index].label
    expect($(dropdownEl).find('ul').css('display')).toEqual 'none'


  it 'should show an empty option while providing emptyText', ->
    emptyText = 'please choose'
    simple.dropdown
     el: '#dropdown'
     items: data
     emptyText: emptyText
    emptyOp = $(dropdownEl).find('a')[1]
    expect($(emptyOp).text()).toEqual emptyText

  it 'should fetch items according to opts.url and params', ->
    spyOn($, 'ajax').and.callFake (options) ->
      options.success(data)
    simple.dropdown
     el: '#dropdown'
     url: 'data.json'
     emptyText: false
    $(dropdownEl).find('options').each (index)->
      expect($(@).text()).toEqual data[index].label
      expect($(@).val()).toEqual data[index].value
    $(dropdownEl).find('ul li').each (index)->
      expect($(@).text()).toEqual data[index].label

  it 'should call the selected callback while selecting some option and set the value of the hidden select', ->
    callback = jasmine.createSpy('callback')
    simple.dropdown
     el: '#dropdown'
     items: data
     emptyText: false
     selected: callback

    selectedEl = $(dropdownEl).find('ul li')[1]
    $(selectedEl).trigger('click')
    expect(callback).toHaveBeenCalledWith(selectedEl, data[1])
    expect($(dropdown).find('select').val()).toEqual data[1].value
    expect($(dropdown).find('.sdSelector').text()).toEqual data[1].label

  it 'should set max-height to options element by setting height', ->
    simple.dropdown
     el: '#dropdown'
     items: data
     emptyText: false
     height: '20px'
    expect(dropdownEl.find('ul').css('max-height')).toEqual '20px'

  it 'shuld destroy when call destroy()', ->
    simple.dropdown
      el: '#dropdown'
      items: data
    dropdownEl.data('dropdown').destroy()
    expect($('.simple-dropdown').length).toBe(0)
