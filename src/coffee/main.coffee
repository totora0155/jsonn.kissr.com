jsonn = angular.module 'Jsonn', []

jsonn.factory 'Json', ->
  # json = []
  json = [
    {key: "aksdjf", val: "fjdsalkjf"}
    {key: "sdlfksdjf", val: "fjdsalkjf"}
    {key: "aksdsdjlfk", val: "fjdsalkjf"}
    {key: "aksdxljsljf", val: "fjdsalkjf"}
    {key: "aksdjasdjff", val: "fjdsalkjf"}
  ]
  {
    getJson: ->
      json

    getLen: ->
      json.length

    addJson: (hashValue) ->
      json.push hashValue

    insert: (idx, hashValue) ->
      len = @getLen()
      tmp = []
      console.log idx
      console.log len
      if idx is len
        json.push hashValue
        console.log 'ue'
      else
        tmp = json[idx+1..len]
        json.length = idx+1
        json.push hashValue
        json.push t for t in tmp
        console.log angular.toJson(json)
  }

jsonn.factory 'Cache', ->
  flagLi = false
  editForm = false
  ori = null
  {
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
        <div ng-transclude class="main_"></div>
      </div>
    """

  @jsonTpl =
    """
      <div class="main-pane">
        <ol class="main-ol">
          <li json-row _addFormTpl="" ng-click="add()" ng-repeat="json in jsons" data-index="{{$index}}" class="main-li" data-type="json">
            <span ng-click="edit($index, 'key')" class="main-key">{{json.key}}</span>
            <span ng-click="edit($index, 'val')" class="main-val">{{json.val}}</span>
          </li>
          <li json-add-form id="main-form" class="main-li main-li-form">
            <input ng-model="new.key" type="text" class="main-intx" ng-keydown="keyKeycode($event)" autofocus>
            <input ng-model="new.val" type="text" class="main-intx main-intx-val" ng-focus="isFocus=true" ng-blur="isFocus=false" ng-keydown="valKeycode($event)">
          </li>
        </ul>
      </div>
    """
        # <pre>{{new.key | json}}</pre>
        # <pre>{{new.val | json}}</pre>

  @addFormTpl = (idx) ->
    """
      <li json-add-form id="insert-form" class="main-li main-li-form" data-original="#{idx}">
        <input ng-model="new.key" type="text" class="main-intx" ng-keydown="keyKeycode($event)" autofocus>
        <input ng-model="new.val" type="text" class="main-intx main-intx-val" ng-focus="isFocus=true" ng-blur="isFocus=false" ng-keydown="valKeycode($event)">
      </li>
    """

  @


jsonn.directive 'tabs', ['Tpl', (Tpl) ->
  restrict: 'E'
  transclude: true
  controller: ($scope, $element) ->
    panes = $scope.panes = []

    $scope.select = (pane) ->
      angular.forEach panes, (pane) ->
        pane.selected = false
      pane.selected = true

    @addPane = (pane) ->
      if panes.length is 0
        $scope.select(pane)
      panes.push pane

    @

  template: Tpl.tabTpl
  replace: true
]


jsonn.directive 'jsonPane', ['$document', '$compile', 'Json', 'Tpl', ($document, $compile, Json, Tpl) ->
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

    scope.jsons = Json.getJson()

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
          editForm = $document[0].querySelector '#edit-form'
          $(editForm).remove() if editForm?

          console.log 'hoge'
          Cache.setFlagLi true
          el = angular.element tgt
          type = el.data 'type'
          Cache.setOri el.data 'index'
          if type is 'json'
            insertForm = $document[0].querySelector '#insert-form'
            if insertForm?
              $(insertForm).remove()
        when 'SPAN'
          # insertForm = $document[0].querySelector '#insert-form'
          # $(insertForm).remove() if insertForm?

          # text = tgt.innerText
          # el = angular.element tgt
          # el.parent().append "<input type='text' id='edit-form' class='intx' value='#{text}'>"

          # editForm = $document[0].querySelector '#edit-form'

          # if editForm.length is 1
          #   el.remove()
          # if editForm.length is 2
          #   el.remove()
          #   el.parent().append "<input type='text' id='edit-form' class='intx' value='#{text}'>"

          # if editForm.length is 2
          #   $(editForm).remove()
          #   text = tgt.innerText
          #   el = angular.element tgt
          #   el.parent().append "<input type='text' id='edit-form' class='intx' value='#{text}'>"
          #   el.remove()

          # text = tgt.innerText
          # el = angular.element tgt
          # el.parent().append "<input type='text' id='edit-form' class='intx' value='#{text}'>"
          # el.remove()
        else
          insertForm = $document[0].querySelector '#insert-form'
          editForm = $document[0].querySelector '#edit-form'

          $(insertForm).remove() if insertForm?
          $(editForm).remove() if editForm?

    scope.add = ->
      $timeout ->
        if Cache.getFlagLi()
          # idx = element.data 'index'
          idx = Cache.getOri()
          attrs.$set('_addFormTpl', Tpl.addFormTpl(idx))
        Cache.setFlagLi false
      , 1
]

jsonn.directive 'jsonAddForm', ['$timeout', 'Json', 'Cache', ($timeout, Json, Cache) ->
  # require: '^?jsonPane'
  # link: (scope, element, attrs, jsonPaneCtrl) ->
  link: (scope, element, attrs) ->
    scope.new = {key: '', val: ''}

    scope.isId = if scope.isId? then scope.isId else scope.$id
    scope.isFocus = false
    scope.getFocus = false

    scope.keyKeycode = (e) ->
      switch e.keyCode
        when 221
          if e.ctrlKey is true
            console.log 'ok'

    scope.valKeycode = (e) ->
      switch e.keyCode
        when 9, 13
          e.preventDefault()
          isFocus = scope.isFocus is true
          presentKey = scope.new.key isnt ''
          presentVal = scope.new.val isnt ''

          if isFocus and presentKey and presentVal
            if scope.isId is scope.$id
              Json.addJson scope.new
              scope.new = {key: '', val: ''}
              $timeout ->
                element[0].children[0].focus()
              , 1
            else
              # idx = element.data 'original'
              idx = Cache.getOri()
              Json.insert idx, scope.new
              $timeout ->
                element[0].remove()
              , 1

]


jsonn.directive 'resultPane', ['$document', '$compile', 'Json', 'Tpl', ($document, $compile, Json, Tpl) ->
  require: '^tabs'
  restrict: 'E'
  transclude: true
  scope:
    title: '@'
  link: (scope, element, attrs, tabsCtrl) ->
    tabsCtrl.addPane scope

  # template: Tpl.jsonTpl
  replace: true
]