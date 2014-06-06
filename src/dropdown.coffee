class Dropdown extends Widget
  opts:
    el: null
    url: null
    items: []
    params: {}
    height: null
    emptyText: null
    selected: $.noop

  @_tpl:
    """
      <select style="display: none;">
        <% items.forEach(function(item) { %>
          <option value=<%= item.value %> ><%= item.label %></option>
        <% }) %>
      </select>
      <div class="sdHolder">
        <a class="sdToggle" href="#"></a>
        <a class="sdSelector" href="#"><%= emptyText %></a>
        <ul class="sdOptions" style="display: none; max-height: <%= height %>;">
          <% items.forEach(function(item) { %>
            <li><a href="#"><%= item.label %></a></li>
          <% }) %>
        </ul>
      </div>
    """

  _init: () ->
    unless @opts.el
      throw "simple tree: option el is required"
      return

    unless @opts.items or @opts.url
      throw "simple tree: option items is required"
      return

    @opts.items = $.extend([], @opts.items)
    @opts.emptyText = @opts.emptyText || "请点击选择"
    @opts.height = @opts.height || "#{5 * 30}px"

    @_render()

  _render: () ->
    @el = $(@opts.el).addClass("simple-dropdown").data("dropdown", @)

    if @opts.url
      $.ajax
        url: @opts.url
        type: 'get'
        dataType: 'json'
        data: @opts.params,
        success: (result) =>
          @opts.items = result
          @createDropdown @opts.items, @opts.selected
    else
      @createDropdown @opts.items, @opts.selected

  createDropdown: (items, callback) ->
    @widgetEl = ejs.render(Dropdown._tpl, { items: items, emptyText: @opts.emptyText, height: @opts.height })
    @widgetEl = $(@widgetEl).appendTo(@el)
    selectEl = @selectEl = $(@el).find('select')
    toggleEl = @toggleEl = $(@el).find('.sdToggle')
    selectorEl = @selectorEl = $(@el).find('.sdSelector')
    optionsEl = @optionsEl = $(@el).find('.sdOptions')

    # bind data
    i = 0
    $(optionsEl).find('li').each ->
      $(@).data('item', items[i])
      i += 1
      $(@).click ->
        $(optionsEl).hide()
        $(selectEl).val($(@).data('item').value)
        $(selectorEl).text($(@).data('item').label)
        callback(@, $(@).data('item'))

    $(@el).mouseleave ->
      $(optionsEl).hide()

    $(selectorEl).mouseenter =>
      $(optionsEl).css('top', "#{$(selectorEl).height()}px")
      $(optionsEl).toggle()
      if $(window).height() - $(selectorEl).height() - $(selectorEl).offset().top < $(optionsEl).height()
        $(optionsEl).css('top', "-#{$(optionsEl).height()}px")

  destroy: ->
    @widgetEl.remove()
    @el.removeClass('simple-dropdown').removeData("dropdown")

@simple ||= {}

$.extend(@simple, {
  dropdown: (opts) ->
    return new Dropdown opts
})
