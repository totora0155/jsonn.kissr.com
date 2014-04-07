// Generated by CoffeeScript 1.6.3
(function() {
  var jsonn;

  jsonn = angular.module('Jsonn', []);

  jsonn.factory('Json', function() {
    var id, json;
    id = function() {
      var chars, i, result, str, _i;
      str = "abcdefghijklmnopqrstuvwxyz\nABCDEFGHIJKLMNOPQRSTUVWXYZ\n0123456789";
      chars = str.split('');
      result = '';
      for (i = _i = 0; _i < 10; i = ++_i) {
        result += chars[Math.floor(Math.random() * chars.length)];
      }
      return result;
    };
    json = [
      {
        layer: 1,
        key: "因幡",
        val: "てゐ",
        parent: false,
        id: '0000000000'
      }, {
        layer: 1,
        key: "霧雨",
        val: "魔理沙",
        parent: false,
        id: '0000000000'
      }, {
        layer: 1,
        key: "アリス",
        val: "マーガトロイド",
        parent: false,
        id: '0000000000'
      }, {
        layer: 1,
        key: "博霊",
        val: "霊夢",
        parent: false,
        id: '0000000000'
      }, {
        layer: 1,
        key: "チルノ",
        val: "⑨",
        parent: false,
        id: '0000000000'
      }, {
        layer: 1,
        key: "プリキュア",
        val: "",
        parent: true,
        id: '0000000001'
      }, {
        layer: 2,
        key: "キュアラブリー",
        val: "愛乃めぐみ",
        parent: false,
        id: '0000000001'
      }, {
        layer: 2,
        key: "キュアプリンセス",
        val: "白雪姫",
        parent: false,
        id: '0000000001'
      }
    ];
    return {
      getJson: function() {
        return json;
      },
      checkJsonVal: function(key, id) {
        var j, _i, _len;
        for (_i = 0, _len = json.length; _i < _len; _i++) {
          j = json[_i];
          if (j.id === id) {
            if (j.key === key) {
              return 1;
            }
          }
        }
        return 0;
      },
      getLen: function() {
        return json.length;
      },
      addJson: function(hashValue) {
        var num;
        num = this.checkJsonVal(hashValue.key);
        if (num === 0) {
          return json.push(hashValue);
        }
      },
      insert: function(idx, hashValue) {
        var isEmptyId, len, t, tmp, _i, _len;
        isEmptyId = hashValue.id === '';
        if (isEmptyId) {
          hashValue.id = id();
        }
        console.log(hashValue);
        len = this.getLen();
        tmp = [];
        if (idx + 1 === len) {
          return json.push(hashValue);
        } else {
          tmp = json.slice(idx + 1, +len + 1 || 9e9);
          json.length = idx + 1;
          json.push(hashValue);
          for (_i = 0, _len = tmp.length; _i < _len; _i++) {
            t = tmp[_i];
            json.push(t);
          }
          return console.log(angular.toJson(json));
        }
      },
      "delete": function(idx) {
        var af, len, t, _i, _len, _results;
        len = this.getLen();
        if (idx === 0) {
          return json.shift();
        } else if (idx + 1 === len) {
          return json.pop();
        } else {
          af = json.slice(idx + 1, +len + 1 || 9e9);
          json.length = idx;
          _results = [];
          for (_i = 0, _len = af.length; _i < _len; _i++) {
            t = af[_i];
            _results.push(json.push(t));
          }
          return _results;
        }
      },
      update: function(idx, target, val) {
        var key, layer, parent, renew, _ref;
        if (target === 'key') {
          if (val === '') {
            if (idx + 1 === json.length) {
              this["delete"](idx);
              return 3;
            } else {
              this["delete"](idx);
              return 1;
            }
          } else {
            _ref = [json[idx].layer, val, json[idx].val, json[idx].parent], layer = _ref[0], key = _ref[1], val = _ref[2], parent = _ref[3];
            renew = {
              layer: layer,
              key: key,
              val: val,
              parent: parent
            };
            return json[idx] = renew;
          }
        } else if (target === 'val') {
          if (val === '') {
            return 2;
          } else {
            val = val === '{' ? '' : val;
            return json[idx].val = val;
          }
        }
      }
    };
  });

  jsonn.factory('Cache', function() {
    var editForm, flagLi, ori;
    flagLi = false;
    editForm = false;
    ori = null;
    return {
      setFlagLi: function(bool) {
        return flagLi = bool;
      },
      getFlagLi: function() {
        return flagLi;
      },
      setOri: function(num) {
        return ori = num;
      },
      getOri: function() {
        return ori;
      },
      setEditForm: function(text) {
        return editForm = text;
      },
      getEditForm: function() {
        return editForm;
      }
    };
  });

  jsonn.service('Tpl', function() {
    this.tabTpl = "<div class=\"in_content\">\n  <div class=\"tab_\">\n    <ul class=\"tab-ul\">\n      <li ng-repeat=\"pane in panes\" class=\"tab-li\" ng-class=\"{'tab-act':pane.selected}\">\n        <a href ng-click=\"select(pane)\" class=\"tab-btn\">{{pane.title}}</a>\n      </li>\n    </ul>\n  </div>\n  <div ng-transclude class=\"main\"></div>\n</div>";
    this.jsonTpl = "<ol class=\"json-ol {{pane.title}} ng-click=\">\n  <li json-row _addFormTpl=\"\" ng-click=\"add()\" ng-repeat=\"json in jsons\" class=\"json-li\" data-index=\"{{$index}}\" data-type=\"json\" data-layer=\"{{json.layer}}\" data-parent=\"{{json.parent}}\" data-id=\"{{json.id}}\">\n    <span class=\"json-key json-edit json-layer{{json.layer}}\" ng-blur=\"update($index, $event, 'key')\" ng-keydown=\"key()\" contenteditable>{{json.key}}</span>\n    <span class=\"json-edit\" ng-class=\"{'json-parent':json.val == ''}\" ng-blur=\"update($index, $event, 'val')\" contenteditable>{{json.val == '' ? '{' : json.val}}</span>\n  </li>\n  <li json-add-form id=\"main-form\" class=\"json-li json-li-form\">\n    <input ng-model=\"new.key\" type=\"text\" class=\"json-new json-new-key\" ng-keydown=\"keyKeycode($event)\" autofocus>\n    <input ng-model=\"new.val\" type=\"text\" class=\"json-new json-new-val\" ng-focus=\"isFocus=true\" ng-blur=\"isFocus=false\" ng-keydown=\"valKeycode($event)\">\n  </li>\n</ul>";
    this.resultTpl = "<ol class=\"json-ol {{pane.title}}\">\n  <li json-row _addFormTpl=\"\" ng-click=\"add()\" ng-repeat=\"json in jsons\" class=\"json-li\" data-index=\"{{$index}}\" data-type=\"json\" data-layer=\"{{json.layer}}\" data-parent=\"{{json.parent}}\" data-id=\"{{json.id}}\">\n    <span class=\"json-key json-edit json-layer{{json.layer}}\" ng-blur=\"update($index, $event, 'key')\" ng-keydown=\"key()\" contenteditable>{{json.key}}</span>\n    <span class=\"json-edit\" ng-class=\"{'json-parent':json.val == ''}\" ng-blur=\"update($index, $event, 'val')\" contenteditable>{{json.val == '' ? '{' : json.val}}</span>\n  </li>\n  <li json-add-form id=\"main-form\" class=\"json-li json-li-form\">\n    <input ng-model=\"new.key\" type=\"text\" class=\"json-new json-new-key\" ng-keydown=\"keyKeycode($event)\" autofocus>\n    <input ng-model=\"new.val\" type=\"text\" class=\"json-new json-new-val\" ng-focus=\"isFocus=true\" ng-blur=\"isFocus=false\" ng-keydown=\"valKeycode($event)\">\n  </li>\n</ul>";
    this.addFormTpl = function(idx, layer, parent, id) {
      return "<li json-add-form id=\"insert-form\" class=\"json-li json-li-form\" data-original=\"" + idx + "\" data-layer=\"" + (parent === true ? layer + 1 : layer) + "\" data-parent=\"" + parent + "\" data-id=\"" + id + "\">\n  <input ng-model=\"new.key\" type=\"text\" class=\"json-new json-layer" + (parent === true ? layer + 1 : layer) + "\" ng-keydown=\"keyKeycode($event)\" autofocus>\n  <input ng-model=\"new.val\" type=\"text\" class=\"json-new json-new-val\" ng-focus=\"isFocus=true\" ng-blur=\"isFocus=false\" ng-keydown=\"valKeycode($event)\">\n</li>";
    };
    return this;
  });

  jsonn.directive('tabs', [
    '$timeout', 'Tpl', function($timeout, Tpl) {
      return {
        restrict: 'E',
        transclude: true,
        controller: function($scope, $element) {
          var panes;
          panes = $scope.panes = [];
          $scope.selected = '';
          $scope.select = function(pane) {
            angular.forEach(panes, function(pane) {
              return pane.selected = false;
            });
            pane.selected = true;
            console.log(panes);
            return $scope.selected = pane;
          };
          this.getPane = function() {
            return $scope.selected;
          };
          this.addPane = function(pane) {
            if (panes.length === 0) {
              $scope.select(pane);
            }
            return panes.push(pane);
          };
          return this;
        },
        template: Tpl.tabTpl,
        replace: true
      };
    }
  ]);

  jsonn.directive('jsonPane', [
    '$document', '$compile', 'Json', 'Tpl', function($document, $compile, Json, Tpl) {
      return {
        require: '^tabs',
        restrict: 'E',
        transclude: true,
        scope: {
          title: '@'
        },
        controller: function($scope, $element) {
          this.add = function(hash) {
            return Json.addJson(hash.key, hash.val);
          };
          return this;
        },
        link: function(scope, element, attrs, tabsCtrl) {
          tabsCtrl.addPane(scope);
          scope.pane = tabsCtrl.getPane();
          return scope.jsons = Json.getJson();
        },
        template: Tpl.jsonTpl,
        replace: true
      };
    }
  ]);

  jsonn.directive('jsonRow', [
    '$compile', '$document', '$timeout', 'Tpl', 'Cache', function($compile, $document, $timeout, Tpl, Cache) {
      return {
        link: function(scope, element, attrs) {
          attrs.$observe('_addFormTpl', function(tpl) {
            var el;
            if (angular.isDefined(tpl) && tpl !== null) {
              el = $compile(tpl)(scope);
              element.after(el);
              return attrs.$set('_addFormTpl', null);
            }
          });
          $document.on('click', function(e) {
            var el, insertForm, tgt, type;
            tgt = e.target;
            switch (tgt.tagName) {
              case 'LI':
                Cache.setFlagLi(true);
                el = angular.element(tgt);
                type = el.data('type');
                Cache.setOri(el.data('index'));
                if (type === 'json') {
                  insertForm = $document[0].querySelector('#insert-form');
                  if (insertForm != null) {
                    return $(insertForm).remove();
                  }
                }
                break;
              default:
                insertForm = $document[0].querySelector('#insert-form');
                if (insertForm != null) {
                  return $(insertForm).remove();
                }
            }
          });
          return scope.add = function() {
            return $timeout(function() {
              var id, idx, layer, parent;
              if (Cache.getFlagLi()) {
                layer = element.data('layer');
                parent = element.data('parent');
                id = element.data('id');
                console.log(parent);
                idx = Cache.getOri();
                attrs.$set('_addFormTpl', Tpl.addFormTpl(idx, layer, parent, id));
              }
              return Cache.setFlagLi(false);
            }, 1);
          };
        }
      };
    }
  ]);

  jsonn.directive('jsonAddForm', [
    '$timeout', 'Json', 'Cache', function($timeout, Json, Cache) {
      return {
        link: function(scope, element, attrs) {
          scope["new"] = {
            layer: null,
            key: '',
            val: '',
            parent: false,
            id: ''
          };
          scope.edit = false;
          scope.update = function(idx, e, target) {
            var num, val;
            val = e.target.innerText;
            num = Json.update(idx, target, val);
            if (num === 1) {
              return e.target.parentNode.nextSibling.nextSibling.querySelector('.json-key').focus();
            } else if (num === 2) {
              return e.target.innerText = "\"\"";
            } else if (num === 3) {
              return e.target.parentNode.nextSibling.nextSibling.nextSibling.querySelector('.json-new-key').focus();
            }
          };
          scope.key = function(e) {};
          scope.isId = scope.isId != null ? scope.isId : scope.$id;
          scope.isFocus = false;
          scope.getFocus = false;
          scope.keyKeycode = function(e) {
            switch (e.keyCode) {
              case 221:
                if (e.ctrlKey === true) {
                  return console.log('ok');
                }
            }
          };
          return scope.valKeycode = function(e) {
            var id, idx, isFocus, presentKey, presentVal;
            switch (e.keyCode) {
              case 9:
              case 13:
                e.preventDefault();
                isFocus = scope.isFocus === true;
                presentKey = scope["new"].key !== '';
                presentVal = scope["new"].val !== '';
                scope["new"].layer = element.data('layer');
                id = element.data('id');
                if (isFocus && presentKey) {
                  if (scope.isId === scope.$id) {
                    if (Json.checkJsonVal(scope["new"].key, '0000000000') === 0) {
                      if (presentVal) {
                        Json.addJson(scope["new"]);
                        scope["new"] = {
                          layer: null,
                          key: '',
                          val: '',
                          parent: false,
                          id: ''
                        };
                        return $timeout(function() {
                          return element[0].children[0].focus();
                        }, 1);
                      } else {
                        scope["new"].layer += 1;
                        scope["new"].parent = true;
                        console.log(scope["new"]);
                        Json.addJson(scope["new"]);
                        scope["new"] = {
                          layer: null,
                          key: '',
                          val: '',
                          parent: false,
                          id: ''
                        };
                        return $timeout(function() {
                          return element[0].children[0].focus();
                        }, 1);
                      }
                    }
                  } else {
                    idx = Cache.getOri();
                    if (Json.checkJsonVal(scope["new"].key, id) === 0) {
                      if (!presentVal) {
                        scope["new"].parent = true;
                      } else {
                        scope["new"].id = id;
                      }
                      Json.insert(idx, scope["new"]);
                      scope["new"] = {
                        layer: null,
                        key: '',
                        val: '',
                        parent: false,
                        id: ''
                      };
                      return $timeout(function() {
                        return element[0].remove();
                      }, 1);
                    }
                  }
                }
            }
          };
        }
      };
    }
  ]);

  jsonn.directive('resultPane', [
    '$document', '$compile', 'Json', 'Tpl', function($document, $compile, Json, Tpl) {
      return {
        require: '^tabs',
        restrict: 'E',
        transclude: true,
        scope: {
          title: '@'
        },
        link: function(scope, element, attrs, tabsCtrl) {
          tabsCtrl.addPane(scope);
          scope.pane = tabsCtrl.getPane();
          return console.log(scope);
        },
        template: Tpl.jsonTpl,
        replace: true
      };
    }
  ]);

}).call(this);
