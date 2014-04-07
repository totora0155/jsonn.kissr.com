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
  json = [
    {layer: 1, key: "因幡", val: "てゐ", parent: false, id: '0000000000'}
    {layer: 1, key: "霧雨", val: "魔理沙", parent: false, id: '0000000000'}
    {layer: 1, key: "アリス", val: "マーガトロイド", parent: false, id: '0000000000'}
    {layer: 1, key: "博霊", val: "霊夢", parent: false, id: '0000000000'}
    {layer: 1, key: "チルノ", val: "⑨", parent: false, id: '0000000000'}
    {layer: 1, key: "プリキュア", val: "", parent: true, id: '0000000001'}
    {layer: 2, key: "キュアラブリー", val: "愛乃めぐみ", parent: false, id: '0000000001'}
    {layer: 2, key: "キュアプリンセス", val: "白雪姫", parent: false, id: '0000000001'}
  ]
  {
    getJson: ->
      json

    checkJsonVal: (key, id) ->
      for j in json
        if j.id is id
          if j.key is key
            return 1
      0


    getLen: ->
      json.length

    addJson: (hashValue, nowId) ->
      num = @checkJsonVal(hashValue.key)
      if num is 0
        hashValue.id = if nowId? then nowId else id()
        json.push hashValue
      hashValue

    insert: (idx, hashValue) ->
      isEmptyId = hashValue.id is ''
      if isEmptyId
        hashValue.id = id()
      console.log hashValue
      len = @getLen()
      tmp = []
      if idx+1 is len
        json.push hashValue
      else
        tmp = json[idx+1..len]
        json.length = idx+1
        json.push hashValue
        json.push t for t in tmp

    delete: (idx) ->
      len = @getLen()
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
            @delete(idx)
            3
          else
            @delete(idx)
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

    setIds: (id) ->
      ids.push id

    getIds: ->
      ids

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
# <div ng-transclude class="main main-{{selected.title}}"></div>
  @jsonTpl =
    """
      <ol class="json-ol {{pane.title}}">
        <li json-row _addFormTpl="" ng-click="add()" ng-repeat="json in jsons" class="json-li" data-index="{{$index}}" data-type="json" data-layer="{{json.layer}}" data-parent="{{json.parent}}" data-id="{{json.id}}">
          <span class="json-key json-edit json-layer{{json.layer}}" ng-blur="update($index, $event, 'key')" ng-keydown="key()" contenteditable>{{json.key}}</span>
          <span class="json-edit" ng-class="{'json-parent':json.val == ''}" ng-blur="update($index, $event, 'val')" contenteditable>{{json.val == '' ? '{' : json.val}}</span>
        </li>
        <li json-add-form id="main-form" class="json-li json-li-form" data-id="{{id()}}" data-layer="{{layer()}}">
          <input ng-model="new.key" type="text" class="json-new json-new-key json-layer{{layer()}}" ng-keydown="keyKeycode($event)" autofocus>
          <input ng-model="new.val" type="text" class="json-new json-new-val" ng-focus="isFocus=true" ng-blur="isFocus=false" ng-keydown="valKeycode($event)">
        </li>
      </ul>
    """
# <li json-add-form id="main-form" class="json-li json-li-form">
#           <input ng-model="new.key" type="text" class="json-new json-new-key" ng-keydown="keyKeycode($event)" autofocus>
#           <input ng-model="new.val" type="text" class="json-new json-new-val" ng-focus="isFocus=true" ng-blur="isFocus=false" ng-keydown="valKeycode($event)">
#         </li>
  @resultTpl =
    """
      <ol class="result-ol">
        <li class="result-li"><div class="result-json">{{json()}}</div></li>
      </ul>
    """
          # <span ng-click="edit($index, 'key')" class="json-key" contenteditable>{{json.key}}</span>
          # <span ng-click="edit($index, 'val')" class="" contenteditable>{{json.val}}</span>
          # <input type="text" class="json-rest" value="{{json.key}}">
          # <input type="text" class="json-rest" value="{{json.key}}">
            # <span ng-click="edit($index, 'key')" class="main-key">{{json.key}}</span>
            # <span ng-click="edit($index, 'val')" class="main-val">{{json.val}}</span>
        # <pre>{{new.key | json}}</pre>
        # <pre>{{new.val | json}}</pre>

  @addFormTpl = (idx, layer, parent, id) ->
    """
      <li json-add-form id="insert-form" class="json-li json-li-form" data-original="#{idx}" data-layer="#{if parent is true then layer+1 else layer}" data-parent="#{parent}" data-id="#{id}">
        <input ng-model="new.key" type="text" class="json-new json-layer#{if parent is true then layer+1 else layer}" ng-keydown="keyKeycode($event)" autofocus>
        <input ng-model="new.val" type="text" class="json-new json-new-val" ng-focus="isFocus=true" ng-blur="isFocus=false" ng-keydown="valKeycode($event)">
      </li>
    """

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
      # Cache.setPane pane.title

      # $scope.selected = pane

    @addPane = (pane) ->
      if panes.length is 0
        $scope.select(pane)
      panes.push pane

    $document.on 'keydown', (e) ->
      switch e.keyCode
        when 39
          angular.forEach panes, (pane) ->
            pane.selected = false
          $scope.selected = panes[1]
          panes[1].selected = true
          $scope.$apply()
        when 37
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
      Json.addJson hash.key, hash.val

    @

  link: (scope, element, attrs, tabsCtrl) ->
    tabsCtrl.addPane scope

    scope.pane = null

    scope.select = ->
      scope.pane = tabsCtrl.getPane()
    scope.jsons = Json.getJson()

    scope.layer = ->
      ids = Cache.getIds()
      ids.length

    scope.id = ->
      ids = Cache.getIds()
      ids[ids.length-1]

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
          # idx = element.data 'index'
          layer = element.data 'layer'
          parent = element.data 'parent'
          id = element.data 'id'
          # console.log parent
          idx = Cache.getOri()
          attrs.$set('_addFormTpl', Tpl.addFormTpl(idx, layer, parent, id))
        Cache.setFlagLi false
      , 1

]

jsonn.directive 'jsonAddForm', ['$timeout', 'Json', 'Cache', ($timeout, Json, Cache) ->
  # require: '^?jsonPane'
  # link: (scope, element, attrs, jsonPaneCtrl) ->
  link: (scope, element, attrs) ->
    scope.new = {layer: null, key: '', val: '', parent: false, id: ''}
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

    scope.key = (e) ->

    scope.isId = if scope.isId? then scope.isId else scope.$id
    scope.isFocus = false
    scope.getFocus = false

    scope.keyKeycode = (e) ->
      switch e.keyCode
        when 221
          if e.ctrlKey is true
            console.log 'ok'

    scope.valKeycode = (e) ->
      isFocus = scope.isFocus is true
      switch e.keyCode
        when 9, 13
          e.preventDefault()
          presentKey = scope.new.key isnt ''
          presentVal = scope.new.val isnt ''

          scope.new.layer = element.data 'layer'
          id = element.data 'id'
          layer = element.data 'layer'

          # console.log element.data 'id'

          if isFocus and presentKey
            if scope.isId is scope.$id
              # console.log element.context.previousElementSibling.dataset.layer
              # ids = Cache.getIds()
              if Json.checkJsonVal(scope.new.key, id) is 0
                if presentVal
                  # idsSize = Cache.getIdsSize()
                  if element.context.previousElementSibling.dataset.parent is 'true'
                    scope.new.layer = parseInt(element.context.dataset.layer)
                    # element.context.dataset.layer = parseInt(element.context.dataset.layer)+1
                  else
                    scope.new.layer = element.context.dataset.layer

                  Json.addJson scope.new, element.context.dataset.id
                  scope.new = {layer: null, key: '', val: '', parent: false, id: ''}
                  $timeout ->
                    element[0].children[0].focus()
                    Cache.setNode null
                  , 1
                else
                  # scope.new.id = '0000000000'
                  # id = if ids.length isnt 0 then ids[ids.length-1] else '0000000000'
                  idsSize = Cache.getIdsSize()
                  # layer = if element.context.previousElementSibling.dataset.parent is 'true' then layer+1 else layer
                  if element.context.previousElementSibling.dataset.parent is 'true'
                    scope.new.layer = parseInt(element.context.dataset.layer)
                    element.context.dataset.layer = parseInt(element.context.dataset.layer)+1
                  else
                    scope.new.layer = element.context.dataset.layer
                  scope.new.parent = true
                  result = Json.addJson scope.new
                  Cache.setIds result.id
                  scope.new = {layer: null, key: '', val: '', parent: false, id: ''}
                  $timeout ->
                    element[0].children[0].focus()
                    Cache.setNode null
                  , 1
                    # scope.$apply()
                  , 1
            else
              idx = Cache.getOri()
              if Json.checkJsonVal(scope.new.key, id) is 0
                unless presentVal
                  scope.new.parent = true
                else
                  scope.new.id = id
                Json.insert idx, scope.new
                scope.new = {layer: null, key: '', val: '', parent: false, id: ''}
                $timeout ->
                  element[0].remove()
                , 1

        when 219
          if e.altKey is true
            id = ->
              node = if Cache.getNode()? then Cache.getNode() else e.target.parentNode
              now = node.dataset.id
              prev = node.dataset.id
              if node.dataset.layer is '1'
                return '0000000000'
              while prev is now
                node = node.previousElementSibling
                prev = node.dataset.id
              Cache.setNode node
              prev

            layer = ->
              elClassList = e.target.previousElementSibling.classList
              layer = elClassList.toString().match(/json-layer(\d)/)[1]
              return false if layer is '1'
              elClassList.remove "json-layer#{layer}"
              elClassList.add "json-layer#{parseInt(layer)-1}"
              layer

            if layer()
              id = id()
              num = layer
              console.log id
              e.target.parentNode.dataset.id = id
              e.target.parentNode.dataset.layer = parseInt(num)-1



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
      json = Json.getJson()
      len = json.length
      result = '{'
      ids = ['0000000000']
      currentId = '0000000000'
      count = 0
      layer = 0
      layerCount = 0
      angular.forEach json, (json) ->
        count++
        differentId = json.id isnt currentId
        sameId = json.id is currentId
        if sameId
          layerCount++
          result += ',' if layerCount isnt 1
          result += "\"#{json.key}\":\"#{json.val}\""
          if len is count
            for i in [1...ids.length]
              result += '}'
        else if differentId
          layerCount = 0
          if json.id is ids[layer-1]
            result += '},'
            result += "\"#{json.key}\":\"#{json.val}\""
            layer--
            ids.pop()
          else
            result += ',' if layerCount is 0
            result += "\"#{json.key}\":{"
            layer++
            ids.push json.id
          currentId = json.id
          # result += "\"#{json.key}\":{"
        # else
        #   result += "\"#{json.key}\":\"#{json.val}\""
        #   if len is count
        #     for i in [1...ids.length]
        #       result += '}'
          # else
          #   console.log count
          #   console.log len
            # result += ','
      result += '}'
      result

  template: Tpl.resultTpl
  replace: true
]