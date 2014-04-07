jsonn = angular.module 'Jsonn', []

jsonn.factory 'Json', ->
  id = ->
    str = 'abcdefghijklmnopqrstuvwxyz' +
          'ABCDEFGHIJKLMNOPQRSTUVWXYZ' +
          '0123456789'

    chars = str.split('')
    result = ''
    for i in [0...10]
      result += chars[Math.floor(Math.random() * chars.length)]
    result
  ids =
    '0000000000':
      next: null

  first = true

  json = [
    {layer: 1, key: "jsonn", val: "editer><", parent: false, id: '0000000000'}
  ]

  {
    setIds: (id, parent) ->
      ids[id] = parent

    getIds: (id) ->
      if id?
        ids[id]
      else
        ids

    get: ->
      json
    size: ->
      json.length
    checkKey: (key, id) ->
      for j in json
        sameId = j.id is id
        existKey = j.key is key
        return false if sameId and existKey
      true

    newId: ->
      id()

    add: (obj, issueId) ->
      nilKey = @checkKey obj.key
      containSpace_ = obj.val.match /\s/
      if containSpace_
        unless obj.val.match /^"/
          obj.val = obj.val.replace /(　)+/g, " "
          obj.val = obj.val.split " "
      if nilKey
        if first is true
          json.shift()
          first = false
        json.push obj.hash()
      obj

    insert: (idx, obj) ->
      len = @size()
      tmp = json[idx+1..len]
      json.length = idx+1
      containSpace_ = obj.val.match /\s/
      if containSpace_
        unless obj.val.match /^"/
          obj.val = obj.val.replace /(　)+/g, " "
          obj.val = obj.val.split " "
      json[idx+1] = obj.hash()
      json.push t for t in tmp
      obj

    del: (idx) ->
      len = @size()
      if idx is 0
        json.shift()
      else if idx+1 is len
        json.pop()
      else
        af = json[idx+1..len]
        json.length = idx
        json.push t for t in af

    update: (idx, target, val) ->
      if target is 'key'
        if val is ''
          if idx+1 is json.length
            @del(idx)
            3
          else
            @del(idx)
            1
        else
          [layer, key, val, parent] = [json[idx].layer, val, json[idx].val, json[idx].parent]
          # renew = {key: val, val: json[idx].val}
          renew = {layer: layer, key: key, val: val, parent: parent}
          json[idx] = renew
      else if target is 'val'
        if val is ''
          2
        else
          val = if val is '{' then '' else val
          json[idx].val = val
  }

jsonn.factory 'Cache', ->
  flagLi = false
  editForm = false
  ori = null
  pane = null
  ids = ['0000000000']
  prevNode = null
  {
    setPane: (title) ->
      pane = title

    getPane: ->
      pane

    setFlagLi: (bool) ->
      flagLi = bool

    getFlagLi: ->
      flagLi

    setOri: (num) ->
      ori = num

    getOri: ->
      ori

    setEditForm: (text) ->
      editForm = text

    getEditForm: ->
      editForm

    setIds: (id, layer) ->
      ids = ids[0...layer]
      ids[layer-1] = id

    getIds: ->
      ids

    decIds: (num) ->
      ids = ids[0...num]

    getIdsSize: ->
      ids.length

    setNode: (node) ->
      prevNode = node

    getNode: ->
      prevNode
  }


jsonn.service 'Tpl', ->
  @tabTpl =
    """
      <div class="in_content">
        <div class="tab_">
          <ul class="tab-ul">
            <li ng-repeat="pane in panes" class="tab-li" ng-class="{'tab-act':pane.selected}">
              <a href ng-click="select(pane)" class="tab-btn">{{pane.title}}</a>
            </li>
          </ul>
        </div>
        <div ng-transclude class="main main-{{selected.title}}"></div>
      </div>
    """

  @jsonTpl =
    """
      <ol class="json-ol {{pane.title}}">
        <li json-row _addFormTpl="" ng-click="add()" ng-repeat="json in jsons" class="json-li" ng-class="array_(json)" data-index="{{$index}}" data-type="json" data-layer="{{json.layer}}" data-parent="{{json.parent}}" data-id="{{json.id}}">
          <span class="json-key json-edit json-layer{{json.layer}}" ng-blur="update($index, $event, 'key')" ng-keydown="key()" contenteditable>{{json.key}}</span>
          <span class="json-edit" ng-class="{'json-parent':json.val == ''}" ng-blur="update($index, $event, 'val')" contenteditable>{{json.val == '' ? '{' : format(json.val)}}</span>
        </li>
        <li json-add-form id="main-form" class="json-li json-li-form" data-id="{{id()}}" data-layer="{{layer()}}" data-transfar="false" data-parent="false">
          <input ng-model="key" type="text" class="json-new json-new-key json-layer{{layer()}}" ng-keydown="keySc($event)" autofocus>
          <input ng-model="val" type="text" class="json-new json-new-val" ng-focus="isFocus=true" ng-blur="isFocus=false" ng-keydown="valSc($event)">
        </li>
      </ul>
    """

  @resultTpl =
    """
      <ol class="result-ol">
        <li class="result-li"><div class="result-json">{{json()}}</div></li>
      </ul>
    """

  @addFormTpl = (idx, layer, parent, id) ->
    """
      <li json-add-form id="insert-form" class="json-li json-li-form" data-original="#{idx}" data-layer="#{if parent is true then layer+1 else layer}" data-parent="#{parent}" data-id="#{id}">
        <input ng-model="key" type="text" class="json-new json-layer#{if parent is true then layer+1 else layer}" ng-keydown="keySc($event)" autofocus>
        <input ng-model="val" type="text" class="json-new json-new-val" ng-focus="isFocus=true" ng-blur="isFocus=false" ng-keydown="valSc($event)">
      </li>
    """
      # <li json-add-form id="insert-form" class="json-li json-li-form" data-original="#{idx}" data-layer="#{if parent is true then layer+1 else layer}" data-parent="#{parent}" data-id="#{id}">
        # <input ng-model="key" type="text" class="json-new json-layer#{if parent is true then layer+1 else layer}" ng-keydown="keySc($event)" autofocus>
  @


jsonn.directive 'tabs', ['$document', '$timeout', 'Tpl', 'Cache', ($document, $timeout, Tpl, Cache) ->
  restrict: 'E'
  transclude: true
  controller: ($scope, $element) ->
    panes = $scope.panes = []

    $scope.selected = null

    $scope.select = (pane) ->
      angular.forEach panes, (pane) ->
        pane.selected = false
      pane.selected = true
      $scope.selected = pane

    @addPane = (pane) ->
      if panes.length is 0
        $scope.select(pane)
      panes.push pane

    $document.on 'keydown', (e) ->
      switch e.keyCode
        when 39
          if e.altKey is true
            e.preventDefault()
            angular.forEach panes, (pane) ->
              pane.selected = false
            $scope.selected = panes[1]
            panes[1].selected = true
            $scope.$apply()
        when 37
          if e.altKey is true
            e.preventDefault()
            angular.forEach panes, (pane) ->
              pane.selected = false
            $scope.selected = panes[0]
            panes[0].selected = true
            $scope.$apply()

    @

  link: (scope, element, attrs) ->
    scope.title = Cache.getPane()

  template: Tpl.tabTpl
  replace: true
]


jsonn.directive 'jsonPane', ['$document', '$compile', 'Json', 'Tpl','Cache', ($document, $compile, Json, Tpl, Cache) ->
  require: '^tabs'
  restrict: 'E'
  transclude: true
  scope:
    title: '@'
  controller: ($scope, $element) ->
    @add = (hash) ->
      Json.add hash.key, hash.val

    @

  link: (scope, element, attrs, tabsCtrl) ->
    tabsCtrl.addPane scope

    scope.pane = null

    scope.select = ->
      scope.pane = tabsCtrl.getPane()
    scope.jsons = Json.get()

    scope.id = ->
      ids = Cache.getIds()
      if ids.length is 0
        '0000000000'
      else
        ids[ids.length-1]

    scope.array_ = (json) ->
      if json.array is true
        'json-array'

    scope.format = (val) ->
      unless /^\"/.test val
        val = val.toString().replace /\"/g, ''
      val = val.toString().replace /\[/g, ''
      val = val.toString().replace /,/g, ' '
      val


  template: Tpl.jsonTpl
  replace: true
]

jsonn.directive 'jsonRow', ['$compile', '$document', '$timeout', 'Tpl', 'Cache', ($compile, $document, $timeout, Tpl, Cache) ->
  link: (scope, element, attrs) ->
    attrs.$observe '_addFormTpl', (tpl) ->
      if angular.isDefined(tpl) and tpl isnt null
        el = $compile(tpl)(scope)
        element.after el
        attrs.$set('_addFormTpl', null)

    $document.on 'click', (e) ->
      tgt = e.target
      switch tgt.tagName
        when 'LI'
          Cache.setFlagLi true
          el = angular.element tgt
          type = el.data 'type'
          Cache.setOri el.data 'index'
          if type is 'json'
            insertForm = $document[0].querySelector '#insert-form'
            if insertForm?
              $(insertForm).remove()
        else
          insertForm = $document[0].querySelector '#insert-form'
          $(insertForm).remove() if insertForm?

    scope.add = ->
      $timeout ->
        if Cache.getFlagLi()
          layer = element.data 'layer'
          parent = element.data 'parent'
          id = element.data 'id'
          idx = Cache.getOri()
          attrs.$set('_addFormTpl', Tpl.addFormTpl(idx, layer, parent, id))
        Cache.setFlagLi false
      , 1

]

jsonn.directive 'jsonAddForm', ['$timeout', 'Json', 'Cache', ($timeout, Json, Cache) ->
  link: (scope, element, attrs) ->
    scope.key = ''
    scope.val = ''
    class CreateJson
      constructor: (@id, @layer, @key) ->
        @val = ''
        @parent = false
        @array = false

      hash: ->
        id: @id
        layer: @layer
        key: @key
        val: @val
        parent: @parent
        array: @array

    scope.layer = ->
      ids = Cache.getIds()
      if element.context.dataset.parent is 'true' and element.context.dataset.transfar is 'false'
        ids.length + 1
      else
        element.context.dataset.transfar = 'false'
        ids.length

    scope.edit = false

    scope.update = (idx, e, target) ->
      val = e.target.innerText
      num = Json.update idx, target, val
      if num is 1
        e.target.parentNode.nextSibling.nextSibling.querySelector('.json-key').focus()
      else if num is 2
        e.target.innerText = "\"\""
      else if num is 3
        e.target.parentNode.nextSibling.nextSibling.nextSibling.querySelector('.json-new-key').focus()

    scope.isId = if scope.isId? then scope.isId else scope.$id
    scope.isFocus = false
    scope.getFocus = false

    pull = (e) ->
      id = ->
        id = Json.getIds e.target.parentNode.dataset.id
        console.log id.prev
        console.log Json.getIds()
        return false unless id.prev?
        e.target.parentNode.dataset.id = id.prev
        console.log e.target.parentNode.dataset.id
        true

      layer = ->
        ids = Cache.getIds()
        Cache.decIds ids.length-1
        if e.target.previousElementSibling isnt null
          elClassList = e.target.previousElementSibling.classList
        else
          elClassList = e.target.classList
        allClass = elClassList.toString().match(/json-layer(\d)/g)
        for cls in allClass
          if cls is "json-layer#{ids+1}"
            elClassList.remove cls
            elClassList.add "json-layer#{ids+1}"
          else
            elClassList.remove cls

        console.log e.target.parentNode.dataset.layer
        e.target.parentNode.dataset.transfar = 'true'
        e

      if id()
        layer()

    push = (e) ->
      id = ->
        id = Json.getIds e.target.parentNode.dataset.id
        if id.next is null
          e.target.parentNode.dataset.transfar = 'false'
          return false
        e.target.parentNode.dataset.id = id.next
        true

      layer = ->
        currentLayer = parseInt(e.target.parentNode.dataset.layer)
        e.target.parentNode.dataset.layer = currentLayer+1
        if e.target.previousElementSibling isnt null
          elClassList = e.target.previousElementSibling.classList
        else
          elClassList = e.target.classList
        allClass = elClassList.toString().match(/json-layer(\d)/g)
        for cls in allClass
          if cls is "json-layer#{currentLayer}"
            elClassList.remove cls
            elClassList.add "json-layer#{currentLayer+1}"
          else
            elClassList.remove cls

      if id()
        layer()


    initForm = ->
      scope.key = ''
      scope.val = ''

    exPost = (json, element) ->
      # if element.context.dataset.transfar is 'false' or !(element.context.dataset.transfar?)
      #   if element.context.previousElementSibling.dataset.parent is 'true'
      #     element.context.dataset.layer = parseInt(element.context.dataset.layer) + 1
      #     element.context.children[0].dataset.layer =
      console.log element
      element.context.children[0].focus()
      initForm()

    indent = (nextId) ->
      layer = parseInt(element.context.dataset.layer)
      next_ = element.context.previousElementSibling.dataset.id is element.context.dataset.id
      sameLayer_ = element.context.previousElementSibling.dataset.layer is element.context.dataset.layer
      transfar_ = element.context.dataset.transfar is 'true'
      if element.context.previousElementSibling.dataset.parent is 'true' and next_ and sameLayer_
        layer++
        element.context.dataset.layer = layer
        console.log 1
      else if element.context.previousElementSibling.dataset.parent is 'true' and !(next_) and sameLayer_ and transfar_
        element.context.dataset.layer = layer
        # element.context.dataset.transfair = 'false'
      else if element.context.previousElementSibling.dataset.parent is 'true' and !(next_) and sameLayer_ and !(transfar_)
        # layer++
        element.context.dataset.layer = layer
        console.log 3
      layer

    addChildEndJson = (json) ->
      json.val = scope.val
      json.id = element.context.dataset.id
      json.layer = indent json.id
      Json.add json
      $timeout ->
        exPost(json, element)
      , 1

    addParentEndJson = (json, e) ->
      prev =
        prev: element.context.dataset.id
        next: null
        layer: element.context.dataset.layer

      json.id = Json.newId()
      prevData = Json.getIds prev.prev
      json.layer = indent json.id
      prevData.next = json.id
      Json.setIds json.id, prev
      json.parent = true
      if json.key is '['
        json.array = true
      result = Json.add json
      # if json.key is '['
        # json.key = ']'
        # Json.add json


      element.context.dataset.parent = 'true'
      _id = element.context.dataset.id
      Cache.setIds result.id, element.context.dataset.layer
      $timeout ->
        exPost(json, element)
      , 1

    scope.valSc = (e) ->
      switch e.keyCode
        when 9, 78
          if e.keyCode is 9
            e.preventDefault()
          if e.keyCode is 78
            return if e.altKey isnt true
          key_ = scope.key isnt ''
          val_ = scope.val isnt ''
          focus_ = scope.isFocus is true
          sameScope_ = scope.isId is scope.$id

          if focus_ and key_
            _json = new CreateJson element.data('id'), element.data('layer'), scope.key
            if sameScope_
              nilKey = Json.checkKey _json.key, _json.id
              if nilKey
                addChildEndJson(_json) if val_
                addParentEndJson(_json, e) if !(val_)

            else
              nilKey = Json.checkKey _json.key, _json.id
              idx = parseInt(element.context.dataset.original)
              if nilKey
                if val_
                  _json.val = scope.val
                else
                  _json.id = Json.newId()
                  prev =
                    prev: element.context.dataset.id
                    next: null
                    layer: element.context.dataset.layer
                  prevData = Json.getIds prev.prev
                  prevData.next = _json.id
                  Json.setIds _json.id, prev
                  _json.parent = true

                Json.insert idx, _json
                _json = new CreateJson
                $timeout ->
                  element[0].remove()
                , 1

        when 72
          # e.preventDefault()
          # console.log 1
          if e.altKey is true
            pull(e)
        when 76
          if e.altKey is true
            push(e)

    scope.keySc = (e) ->
      switch e.keyCode
        when 72
          if e.altKey is true
            pull(e)
        when 76
          if e.altKey is true
            push(e)



]


jsonn.directive 'resultPane', ['$document', '$compile', 'Json', 'Tpl', ($document, $compile, Json, Tpl) ->
  require: '^tabs'
  restrict: 'E'
  transclude: true
  scope:
    title: '@'
  link: (scope, element, attrs, tabsCtrl) ->
    tabsCtrl.addPane scope

    scope.json = ->
      json = Json.get()
      len = Json.size()
      layer = 0
      array_ = false
      result = ''

      close = (num) ->
        tmp = ''
        tmp += '}' while num--
        tmp

      angular.forEach json, (v) ->
        parent_ = v.parent
        sameLayer_ = layer is v.layer
        isNumber_ = isNaN(Number(v.val)) is true
        if sameLayer_
          result += ','
          if parent_
            result += "\"#{v.key}\":{"
          else
            if isNumber_
              if v.val.toString().match /,/
                tmp = ''
                i = 0
                size = v.val.length
                for val in v.val
                  i++
                  if isNaN(Number(val)) is true
                    tmp += "\"#{val}\""
                  else
                    tmp += val
                  if i isnt size
                    tmp += ','
                result += "\"#{v.key}\":[#{tmp}]"
              else
                result += "\"#{v.key}\":\"#{v.val}\""
            else
              result += "\"#{v.key}\":#{v.val}"
        else
          up = v.layer > layer
          if up
            layer = v.layer
            if parent_
              if v.key is '['
                result += "#{v.key}{"
                array_ = true
              else
                result += "\"#{v.key}\":{"
            else
              if isNumber_
                if v.val.toString().match /,/
                  tmp = ''
                  i = 0
                  size = v.val.length
                  for val in v.val
                    i++
                    if isNaN(Number(val)) is true
                      tmp += "\"#{val}\""
                    else
                      tmp += val
                    if i isnt size
                      tmp += ','
                  result += "\"#{v.key}\":[#{tmp}]"
                else
                  result += "\"#{v.key}\":\"#{v.val}\""
              else
                result += "\"#{v.key}\":#{v.val}"

          else
            parent_ = v.parent
            gap = layer - v.layer
            layer = v.layer
            if array_
              result += close(gap) + ']' + ','
            else
              result += close(gap) + ','

            if parent_
              result += "\"#{v.key}\":{"
            else
              if isNumber_
                if v.val.toString().match /,/
                  tmp = ''
                  i = 0
                  size = v.val.length
                  for val in v.val
                    i++
                    if isNaN(Number(val)) is true
                      tmp += "\"#{val}\""
                    else
                      tmp += val
                    if i isnt size
                      tmp += ','
                  result += "\"#{v.key}\":[#{tmp}]"
                else
                  result += "\"#{v.key}\":\"#{v.val}\""
              else
                result += "\"#{v.key}\":\"#{v.val}\""
      if array_
        return result + close(json[len-1].layer-1) + ']'
      else
        return '{' + result + close(json[len-1].layer)

  template: Tpl.resultTpl
  replace: true
]