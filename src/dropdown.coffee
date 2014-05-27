class Dropdown extends Widget
  opts:
    el: null
    url: null
    items: []
    params: {}
    height: 'auto'
    emptyText: '点击选择'
    class: ''
    selected: $.noop

  @_tpl:
    """
      <select height="<%= height %>" class="<%= classes %>">
        <% items.forEach(function(item) { %>
          <option value=<%= item.value %> ><%= item.label %></option>
        <% }) %>
      </select>
    """

  _init: () ->
    unless @opts.el
      throw "simple tree: option el is required"
      return

    unless @opts.items or @opts.url
      throw "simple tree: option items is required"
      return

    @opts.items = $.extend([], @opts.items)

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
          @opts.items.unshift({label: @opts.emptyText, value: null}) if @opts.emptyText
          @createDropdown @opts.items, @opts.selected
    else
      @opts.items.unshift({label: @opts.emptyText, value: null}) if @opts.emptyText
      @createDropdown @opts.items, @opts.selected

  createDropdown: (items, callback) ->
    @selectEl = ejs.render(Dropdown._tpl, { items: items, height: @opts.height, classes: @opts.class })
    @selectEl = $(@selectEl).appendTo(@el)

    i = 0
    $(@selectEl).find('option').each ->
      $(@).data('item', items[i])
      i += 1

    $(@selectEl).change ->
      $(@).find('option:selected').each ->
        callback(@, $(@).data('item'))


  destroy: ->
    @selectEl.remove()
    @el.removeClass('simple-dropdown').removeData("dropdown")

@simple ||= {}

$.extend(@simple, {
  dropdown: (opts) ->
    return new Dropdown opts
})
